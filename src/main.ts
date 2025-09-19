import { moduleMap, modules } from './modules';
import type { ModuleId, UIMsg } from './core/types';

figma.showUI(__html__, { width: 600, height: 400, title: 'MB Tools' });

// Init modules (listeners, etc.)
for (const m of modules) m.init?.();

figma.ui.onmessage = async (msg: UIMsg) => {
  const { module: moduleId, type, payload } = msg || ({} as UIMsg);
  const mod = moduleMap[moduleId as ModuleId];
  if (!mod) return;
  const handler = mod.handlers[type];
  if (!handler) return;
  await handler(payload);
};

