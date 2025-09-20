import type { Module } from '../../core/types';

// Converte HEX para RGB normalizado (0-1)
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # se presente
  const cleanHex = hex.replace('#', '');

  // Expande formato #RGB para #RRGGBB
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;

  const bigint = parseInt(fullHex, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255
  };
}

// Converte RGB normalizado para HEX
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Converte RGB para HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  // Lightness
  const l = (max + min) / 2;

  // Saturation
  let s = 0;
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
  }

  // Hue
  let h = 0;
  if (diff !== 0) {
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
}

// Converte HSL para RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 1/6) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 1/6 && h < 2/6) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 2/6 && h < 3/6) {
    [r, g, b] = [0, c, x];
  } else if (h >= 3/6 && h < 4/6) {
    [r, g, b] = [0, x, c];
  } else if (h >= 4/6 && h < 5/6) {
    [r, g, b] = [x, 0, c];
  } else if (h >= 5/6 && h < 1) {
    [r, g, b] = [c, 0, x];
  }

  return {
    r: r + m,
    g: g + m,
    b: b + m
  };
}

// Clamp valor entre 0 e 1
function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Converte HEX para formato RGBA do Figma
function hexToFigmaRGBA(hex: string): RGBA {
  const rgb = hexToRgb(hex);
  return {
    r: rgb.r,
    g: rgb.g,
    b: rgb.b,
    a: 1
  };
}

// Busca ou cria coleção de variáveis "colors-tokens"
async function getOrCreateColorsTokensCollection(): Promise<{ collection: VariableCollection; modeId: string }> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  // Busca coleção existente
  let collection = collections.find(c => c.name === 'colors-tokens');

  // Cria nova coleção se não existe
  if (!collection) {
    collection = figma.variables.createVariableCollection('colors-tokens');
    console.log('✅ Coleção "colors-tokens" criada');
  } else {
    console.log('✅ Coleção "colors-tokens" encontrada');
  }

  // Garante que existe pelo menos um modo
  const modeId = collection.modes[0]?.modeId;
  if (!modeId) {
    throw new Error('Nenhum modo encontrado na coleção colors-tokens');
  }

  return { collection, modeId };
}

// Busca ou cria variável de cor
async function getOrCreateColorVariable(fullName: string, collection: VariableCollection): Promise<Variable> {
  const variables = await figma.variables.getLocalVariablesAsync();

  // Busca variável existente
  let variable = variables.find(v => v.name === fullName && v.resolvedType === 'COLOR');

  // Cria nova variável se não existe
  if (!variable) {
    variable = figma.variables.createVariable(fullName, collection, 'COLOR');
    console.log(`✅ Variável "${fullName}" criada`);
  } else {
    console.log(`✅ Variável "${fullName}" encontrada`);
  }

  return variable;
}

// Gera paleta de cores baseada em HSL com regras condicionais
function generateColorPalette(baseHex: string): Record<string, string> {
  const baseRgb = hexToRgb(baseHex);
  const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);

  // Regras baseadas na luminosidade
  const isLightColor = baseHsl.l > 0.3;

  const variations = {
    'colors/primary/primary': baseHex,

    'colors/primary/primary-dark': (() => {
      const darkHsl = { h: baseHsl.h, s: baseHsl.s, l: 0.125 };
      const rgb = hslToRgb(darkHsl.h, darkHsl.s, darkHsl.l);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    })(),

    'colors/primary/primary-hover': (() => {
      const s = isLightColor ? baseHsl.s : baseHsl.s * 0.65;
      const hoverHsl = { h: baseHsl.h, s: clamp(s), l: 0.29 };
      const rgb = hslToRgb(hoverHsl.h, hoverHsl.s, hoverHsl.l);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    })(),

    'colors/primary/primary-high-emphasis': (() => {
      const s = isLightColor ? baseHsl.s + 0.18 : 0.25;
      const l = 1.05 - baseHsl.l;
      const emphasisHsl = { h: baseHsl.h, s: clamp(s), l: clamp(l) };
      const rgb = hslToRgb(emphasisHsl.h, emphasisHsl.s, emphasisHsl.l);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    })(),

    'colors/primary/primary-low-emphasis': (() => {
      const s = isLightColor ? baseHsl.s - 0.13 : 0.3;
      const lowEmphasisHsl = { h: baseHsl.h, s: clamp(s), l: 0.93 };
      const rgb = hslToRgb(lowEmphasisHsl.h, lowEmphasisHsl.s, lowEmphasisHsl.l);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    })()
  };

  return variations;
}

// Aplica paleta de cores nas variáveis do Figma
async function applyPaletteToFigma(palette: Record<string, string>): Promise<number> {
  const { collection, modeId } = await getOrCreateColorsTokensCollection();

  let updatedCount = 0;

  for (const [fullName, hex] of Object.entries(palette)) {
    try {
      // Busca ou cria variável
      const variable = await getOrCreateColorVariable(fullName, collection);

      // Converte HEX para formato Figma e aplica
      const rgba = hexToFigmaRGBA(hex);
      variable.setValueForMode(modeId, rgba);

      console.log(`✅ Atualizado: ${fullName} → ${hex}`);
      updatedCount++;

    } catch (error) {
      console.error(`❌ Erro ao processar variável ${fullName}:`, error);
    }
  }

  return updatedCount;
}

export const colorPaletteModule: Module = {
  id: 'color-palette',
  name: 'Color Palette Generator',
  handlers: {
    'generate-palette': async (payload: { hex: string }) => {
      try {
        console.log('🎨 Iniciando geração de paleta para:', payload.hex);

        // Validar formato HEX
        const hexPattern = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
        if (!hexPattern.test(payload.hex)) {
          throw new Error('Formato HEX inválido. Use #RGB ou #RRGGBB');
        }

        // Gerar paleta de cores
        const palette = generateColorPalette(payload.hex);
        console.log('🎨 Paleta gerada:', palette);

        // Aplicar no Figma
        const updatedCount = await applyPaletteToFigma(palette);

        // Sucesso
        const message = `✅ ${updatedCount} variáveis de cor atualizadas na coleção "colors-tokens"`;
        console.log(message);
        figma.notify(message);

        figma.ui.postMessage({
          module: 'color-palette',
          type: 'palette-applied',
          payload: {
            palette,
            updatedCount,
            baseColor: payload.hex
          }
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

        console.error('❌ Erro ao gerar paleta:', errorMessage);
        figma.notify(`❌ Erro: ${errorMessage}`);

        figma.ui.postMessage({
          module: 'color-palette',
          type: 'error',
          payload: {
            message: errorMessage,
            hex: payload.hex
          }
        });
      }
    }
  }
};