const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo Config Plugin to copy offline bundled web assets into Android native assets
 */
const withAndroidAssets = (config, options = {}) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const srcDir = path.resolve(projectRoot, options.src || 'assets/web');
      const destDir = path.resolve(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'assets',
        options.dest || 'web'
      );
      const rootAssetsDir = path.resolve(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'assets',
        'assets'
      );

      function copyRecursive(src, dest) {
        if (!fs.existsSync(src)) return;
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
          const s = path.join(src, entry.name);
          const d = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            copyRecursive(s, d);
          } else {
            fs.copyFileSync(s, d);
          }
        }
      }

      console.log(`[withAndroidAssets] Copying web assets from ${srcDir} to ${destDir}...`);
      copyRecursive(srcDir, destDir);

      // Copy assets folder to root of android assets for fallback
      const webAssetsDir = path.join(srcDir, 'assets');
      if (fs.existsSync(webAssetsDir)) {
        copyRecursive(webAssetsDir, rootAssetsDir);
      }

      console.log('[withAndroidAssets] Web assets successfully bundled into Android assets!');
      return config;
    },
  ]);
};

module.exports = withAndroidAssets;
