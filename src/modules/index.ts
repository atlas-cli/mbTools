import type { Module } from '../core/types';
import { styleModule } from './style-to-variable/main';
import { iconsModule } from './icon-rename/main';
import { colorPaletteModule } from './color-palette/main';

export const modules: Module[] = [styleModule, iconsModule, colorPaletteModule];

export const moduleMap = Object.fromEntries(modules.map((m) => [m.id, m]));

