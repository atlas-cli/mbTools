import type { Module } from '../../core/types';

const STYLE_PREFIX = 'colors/';
const VARIABLE_PREFIX = 'colors/';

function convertStyleNameToVariableName(styleName: string): string {
  if (!styleName.startsWith(STYLE_PREFIX)) return '';
  const token = styleName.slice(STYLE_PREFIX.length);
  return `${VARIABLE_PREFIX}${token}`;
}

let variableCache: Map<string, Variable> | null = null;

async function getVariableCache(): Promise<Map<string, Variable>> {
  if (!variableCache) {
    variableCache = new Map();
    const allVariables = await figma.variables.getLocalVariablesAsync();
    allVariables
      .filter((v) => v.resolvedType === 'COLOR' && v.name.startsWith(VARIABLE_PREFIX))
      .forEach((v) => variableCache!.set(v.name, v));
  }
  return variableCache;
}

async function countColorStyles(selection: readonly SceneNode[]): Promise<number> {
  let count = 0;
  async function countInNode(node: SceneNode) {
    if ('fillStyleId' in node && node.fillStyleId && typeof node.fillStyleId === 'string') {
      const style = await figma.getStyleByIdAsync(node.fillStyleId);
      if (style?.type === 'PAINT' && style.name.startsWith(STYLE_PREFIX)) count++;
    }
    if ('strokeStyleId' in node && node.strokeStyleId && typeof node.strokeStyleId === 'string') {
      const style = await figma.getStyleByIdAsync(node.strokeStyleId);
      if (style?.type === 'PAINT' && style.name.startsWith(STYLE_PREFIX)) count++;
    }
    if ('children' in node) {
      for (const child of node.children) await countInNode(child);
    }
  }
  for (const node of selection) await countInNode(node);
  return count;
}

async function convertStylesToVariables(selection: readonly SceneNode[]): Promise<{
  converted: number;
  failed: number;
  errors: string[];
}> {
  const variables = await getVariableCache();
  const result = { converted: 0, failed: 0, errors: [] as string[] };

  async function processNode(node: SceneNode) {
    if ('fillStyleId' in node && node.fillStyleId && typeof node.fillStyleId === 'string') {
      const style = await figma.getStyleByIdAsync(node.fillStyleId);
      if (style?.type === 'PAINT' && style.name.startsWith(STYLE_PREFIX)) {
        const variableName = convertStyleNameToVariableName(style.name);
        const variable = variables.get(variableName);
        if (variable) {
          try {
            const fills = JSON.parse(JSON.stringify(node.fills));
            if (fills.length > 0) {
              fills[0] = figma.variables.setBoundVariableForPaint(fills[0], 'color', variable);
              node.fills = fills;
              result.converted++;
            }
          } catch (_e) {
            result.failed++;
            result.errors.push(`Failed to convert fill: ${style.name}`);
          }
        } else {
          result.failed++;
          if (!result.errors.includes(variableName)) result.errors.push(`Variable not found: ${variableName}`);
        }
      }
    }
    if ('strokeStyleId' in node && node.strokeStyleId && typeof node.strokeStyleId === 'string') {
      const style = await figma.getStyleByIdAsync(node.strokeStyleId);
      if (style?.type === 'PAINT' && style.name.startsWith(STYLE_PREFIX)) {
        const variableName = convertStyleNameToVariableName(style.name);
        const variable = variables.get(variableName);
        if (variable) {
          try {
            const strokes = JSON.parse(JSON.stringify(node.strokes));
            if (strokes.length > 0) {
              strokes[0] = figma.variables.setBoundVariableForPaint(strokes[0], 'color', variable);
              node.strokes = strokes;
              result.converted++;
            }
          } catch (_e) {
            result.failed++;
            result.errors.push(`Failed to convert stroke: ${style.name}`);
          }
        } else {
          result.failed++;
          if (!result.errors.includes(variableName)) result.errors.push(`Variable not found: ${variableName}`);
        }
      }
    }
    if ('children' in node) {
      for (const child of node.children) await processNode(child);
    }
  }

  for (const node of selection) await processNode(node);
  return result;
}

function notifySelectionUpdate() {
  // Fire and forget
  countColorStyles(figma.currentPage.selection).then((count) => {
    figma.ui.postMessage({ module: 'style', type: 'selection-update', count, hasSelection: figma.currentPage.selection.length > 0 });
  });
}

export const styleModule: Module = {
  id: 'style',
  name: 'Styles → Variables',
  init() {
    figma.on('selectionchange', notifySelectionUpdate);
  },
  handlers: {
    'check-selection': async () => {
      notifySelectionUpdate();
    },
    convert: async () => {
      const selection = figma.currentPage.selection;
      if (selection.length === 0) {
        figma.ui.postMessage({ module: 'style', type: 'error', message: 'Nenhum elemento selecionado' });
        return;
      }
      const result = await convertStylesToVariables(selection);
      figma.ui.postMessage({ module: 'style', type: 'conversion-complete', ...result });
      if (result.failed === 0) figma.notify(`✅ ${result.converted} estilos convertidos`);
      else figma.notify(`Convertidos: ${result.converted} | Falhas: ${result.failed}`, { timeout: 5000 });
      // Refresh status
      notifySelectionUpdate();
    }
  }
};

