import type { Module } from '../../core/types';
import lucideNames from '.././../../assets/lucide-names.json';

function kebabToPascalCase(str: string) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export const iconsModule: Module = {
  id: 'icons',
  name: 'Icon Rename',
  handlers: {
    'rename-icons': () => {
      const selectedNodes = figma.currentPage.selection;
      if (selectedNodes.length === 0) {
        figma.notify('Selecione pelo menos um componente.');
        return;
      }
      let renamedCount = 0;
      const invalidNames: string[] = [];
      for (const node of selectedNodes) {
        if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
          const oldName = node.name;
          const newName = kebabToPascalCase(oldName);
          if ((lucideNames as string[]).includes(newName)) {
            node.name = newName;
            renamedCount++;
            // eslint-disable-next-line no-console
            console.log(`✅ Renomeado: "${oldName}" → "${newName}"`);
          } else {
            invalidNames.push(newName);
          }
        }
      }
      if (invalidNames.length > 0) {
        const formatted = JSON.stringify(invalidNames, null, 2);
        // eslint-disable-next-line no-console
        console.warn(`❌ Nomes inválidos (${invalidNames.length}) — copie e cole no lucide-names.json se forem válidos:\n${formatted}`);
      }
      figma.notify(`${renamedCount} renomeado(s), ${invalidNames.length} inválido(s).`);
      figma.ui.postMessage({ module: 'icons', type: 'done', invalidNames });
    }
  }
};

