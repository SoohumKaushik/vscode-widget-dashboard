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
      console.log('[watch] build started');
      const ctx1 = await esbuild.context({
        ...extensionConfig,
        plugins: [{
          name: 'watch-plugin',
          setup(build) {
            build.onEnd(result => {
              if (result.errors.length > 0) {
                console.log('[watch] build failed');
              } else {
                console.log('[watch] build finished');
              }
            });
          }
        }]
      });
      const ctx2 = await esbuild.context(webviewConfig);
      await ctx1.watch();
      await ctx2.watch();
      console.log('[watch] build finished');
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

