const esbuild = require('esbuild');

const watch = process.argv.includes('--watch');

const extensionConfig = {
  entryPoints: ['src/extension/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  sourcemap: true,
};

const webviewConfig = {
  entryPoints: ['src/webview/index.tsx'],
  bundle: true,
  outfile: 'dist/webview.js',
  format: 'iife',
  platform: 'browser',
  sourcemap: true,
  loader: {
    '.css': 'css',
  },
};

async function build() {
  try {
    if (watch) {
      const ctx1 = await esbuild.context(extensionConfig);
      const ctx2 = await esbuild.context(webviewConfig);
      await ctx1.watch();
      await ctx2.watch();
      console.log('Watching for changes...');
    } else {
      await esbuild.build(extensionConfig);
      await esbuild.build(webviewConfig);
      console.log('Build complete!');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();

