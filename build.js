import { build, context } from 'esbuild';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';

const watch = process.argv.includes('--watch');

const options = {
  entryPoints: ['src/main.ts'],
  outfile: 'dist/code.js',
  bundle: true,
  // Figma plugin runtime lacks support for some modern syntax
  // Downlevel to avoid optional chaining/nullish coalescing in output
  // Target ES2017 to transpile object spread and newer syntax
  target: ['es2017'],
  platform: 'browser',
  format: 'cjs',
  sourcemap: false,
  minify: true,
  loader: { '.json': 'json' },
  logLevel: 'info'
};

async function bundle() {
  if (watch) {
    const ctx = await context(options);
    await ctx.watch();
    console.log('👀 Watching for changes...');
  } else {
    await build(options);
  }
}

function copyStatic() {
  try {
    mkdirSync('dist/assets', { recursive: true });
    // Use local logo from assets
    const logoSrc = resolve('assets/mb-logo.svg');
    copyFileSync(logoSrc, resolve('dist/assets/mb-logo.svg'));
    const logoB64 = readFileSync(logoSrc).toString('base64');

    // Copy UI and inline logo as data URI for inline-HTML runtime
    const uiSrc = resolve('src/ui/index.html');
    const uiDest = resolve('dist/ui.html');
    const htmlRaw = readFileSync(uiSrc, 'utf-8');
    const html = htmlRaw.replace(
      /src\s*=\s*"assets\/mb-logo\.svg"/g,
      `src="data:image/svg+xml;base64,${logoB64}"`
    );
    writeFileSync(uiDest, html);

    console.log('📦 Copied static assets (logo inlined in UI)');
  } catch (e) {
    console.warn('⚠️ Failed to copy static assets:', e.message);
  }
}

await bundle();
copyStatic();
