const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const buildId = 'aeb3988e-df03-4112-b90e-54c04a103008';
const rootDir = path.resolve(__dirname, '..');
const expoDir = path.resolve(rootDir, 'expo-apk');
const targetApk = path.resolve(rootDir, 'nivvo-standalone-v1.0.6.apk');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function monitor() {
  console.log(`Monitoring EAS Build ${buildId} ...`);
  let attempts = 0;
  const maxAttempts = 60; // 60 * 15s = 15 minutes max

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const output = execSync(`npx eas-cli build:view ${buildId} --json`, {
        cwd: expoDir,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      });

      // Parse JSON from output
      const jsonStart = output.indexOf('{');
      if (jsonStart !== -1) {
        const jsonStr = output.slice(jsonStart);
        const data = JSON.parse(jsonStr);
        console.log(`[Attempt ${attempts}] Status: ${data.status} (${new Date().toLocaleTimeString()})`);

        if (data.status === 'FINISHED') {
          const apkUrl = data.artifacts && (data.artifacts.buildUrl || data.artifacts.applicationArchiveUrl);
          console.log('\n========================================');
          console.log('BUILD FINISHED SUCCESSFULLY!');
          console.log('APK Artifact URL:', apkUrl);
          console.log('========================================\n');

          if (apkUrl) {
            console.log(`Downloading APK to ${targetApk} ...`);
            await downloadFile(apkUrl, targetApk);
            const stats = fs.statSync(targetApk);
            console.log(`Downloaded successfully! Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
          }
          return;
        }

        if (data.status === 'ERRORED' || data.status === 'CANCELED') {
          console.error(`Build terminated with status: ${data.status}`);
          process.exit(1);
        }
      }
    } catch (e) {
      console.warn(`Error querying build status: ${e.message}`);
    }

    // Wait 15 seconds before next poll
    await new Promise((r) => setTimeout(r, 15000));
  }

  console.error('Timeout waiting for EAS build.');
  process.exit(1);
}

monitor();
