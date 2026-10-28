const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const expoDir = path.resolve(rootDir, 'expo-apk');
const expoAssetsWebDir = path.resolve(expoDir, 'assets', 'web');

console.log('1. Reading fresh dist/index.html...');
let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Find the <script ...>...</script> inside <head>
const scriptStartIdx = html.indexOf('<script');
if (scriptStartIdx === -1) {
  console.error('Error: No script found in dist/index.html');
  process.exit(1);
}

// Find the corresponding closing </script> for this tag
// Note: we want the </script> tag after scriptStartIdx
const scriptCloseTag = '</script>';
const scriptEndIdx = html.indexOf(scriptCloseTag, scriptStartIdx);
if (scriptEndIdx === -1) {
  console.error('Error: Closing </script> tag not found');
  process.exit(1);
}

// Extract the full script tag and its contents
const fullScriptTag = html.slice(scriptStartIdx, scriptEndIdx + scriptCloseTag.length);
console.log('Found script tag of length:', fullScriptTag.length);

// Extract just the JS code
const jsCodeStart = html.indexOf('>', scriptStartIdx) + 1;
let rawJs = html.slice(jsCodeStart, scriptEndIdx);
console.log('Extracted bundle JS of length:', rawJs.length);

// Replace import.meta.url so it can run as a regular classic script without module restrictions
rawJs = rawJs.replace(/import\.meta\.url/g, '"file:///android_asset/web/index.html"');

// Normalize image paths starting with /assets/ to relative ./assets/
rawJs = rawJs.replace(/"\/assets\//g, '"./assets/');
rawJs = rawJs.replace(/'\/assets\//g, "'./assets/");

// Test that rawJs parses without syntax errors
try {
  new Function(rawJs);
  console.log('Verified: bundle JS is 100% syntactically valid standard JavaScript!');
} catch (e) {
  console.error('Syntax error in bundle JS:', e.message);
  process.exit(1);
}

// Remove the script from <head>
html = html.slice(0, scriptStartIdx) + html.slice(scriptEndIdx + scriptCloseTag.length);

// Diagnostic and polyfill preamble to put inside <head>
const preamble = `
    <!-- Diagnostic & Safety Preamble for Android Standalone APK -->
    <script>
      (function() {
        // Visual on-screen error banner in case of any unhandled error
        window.onerror = function(msg, url, line, col, err) {
          console.error('[Nivvo Standalone Error]:', msg, line, col, err);
          try {
            var banner = document.getElementById('nivvo-standalone-error');
            if (!banner) {
              banner = document.createElement('div');
              banner.id = 'nivvo-standalone-error';
              banner.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#FFFFFF;color:#B91C1C;padding:24px;font-family:-apple-system,BlinkMacSystemFont,Roboto,sans-serif;z-index:9999999;overflow:auto;box-sizing:border-box;';
              (document.body || document.documentElement).appendChild(banner);
            }
            banner.innerHTML = '<div style=\"max-width:400px;margin:20px auto;border:2px solid #EF4444;border-radius:16px;padding:20px;background:#FEF2F2;\">' +
              '<h2 style=\"margin:0 0 8px;color:#991B1B;font-size:18px;\">Initialization Issue</h2>' +
              '<p style=\"margin:0 0 12px;color:#374151;font-size:13px;line-height:1.5;\"><b>' + String(msg) + '</b></p>' +
              '<p style=\"margin:0 0 12px;color:#6B7280;font-size:11px;\">Line: ' + line + ' : ' + col + '</p>' +
              '<pre style=\"background:#FFFFFF;border:1px solid #FCA5A5;padding:10px;border-radius:8px;font-size:10px;overflow:auto;color:#1F2937;\">' + (err && err.stack ? err.stack : 'No stack') + '</pre>' +
              '</div>';
          } catch(e) {}

          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'JS_ERROR',
              message: String(msg),
              line: line,
              stack: err ? err.stack : ''
            }));
          }
        };

        // Safe localStorage polyfill for Android WebView file:/// protocol
        try {
          var testKey = '__nivvo_test__';
          window.localStorage.setItem(testKey, '1');
          window.localStorage.removeItem(testKey);
        } catch (e) {
          console.warn('[Nivvo] Using memory store fallback for localStorage:', e);
          var store = {};
          try {
            window.localStorage = {
              getItem: function(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
              setItem: function(k, v) { store[k] = String(v); },
              removeItem: function(k) { delete store[k]; },
              clear: function() { store = {}; },
              key: function(i) { return Object.keys(store)[i] || null; },
              get length() { return Object.keys(store).length; }
            };
          } catch(err) {}
        }

        // Safe fetch wrapper for local/api requests
        var origFetch = window.fetch;
        window.fetch = function(url, options) {
          try {
            var urlStr = String(url || '');
            if (urlStr.startsWith('file:') || urlStr.startsWith('/api') || urlStr.startsWith('.')) {
              if (origFetch) {
                return origFetch.apply(this, arguments).catch(function() {
                  return new Response(JSON.stringify({ success: false, data: [] }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                  });
                });
              }
              return Promise.resolve(new Response(JSON.stringify({ success: false, data: [] }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }));
            }
            return origFetch ? origFetch.apply(this, arguments) : Promise.resolve(new Response('{}', { status: 200 }));
          } catch(err) {
            return Promise.resolve(new Response(JSON.stringify({ success: false, data: [] }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
        };

        // Notify React Native when ready
        document.addEventListener('DOMContentLoaded', function() {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'APP_MOUNTED' }));
          }
        });
      })();
    </script>
`;

// Insert preamble right after <head>
html = html.replace('<head>', '<head>' + preamble);

// Make Google Fonts non-blocking so it never hangs offline
html = html.replace(
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">',
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media=\'all\'">'
);

// Now find the LAST </body> tag in the document
const lastBodyIdx = html.lastIndexOf('</body>');
if (lastBodyIdx === -1) {
  console.error('Error: </body> not found');
  process.exit(1);
}

// Ensure <div id="root"> exists before the script
const rootIdx = html.indexOf('id="root"');
console.log('Verified: <div id="root"> is at position:', rootIdx);
console.log('Verified: </body> is at position:', lastBodyIdx);

if (rootIdx > lastBodyIdx) {
  console.error('Error: root is after body?');
  process.exit(1);
}

// Assemble the final HTML: Put standard <script> immediately before </body>!
const scriptTagToInsert = '\n    <script>\n' + rawJs + '\n    </script>\n';
html = html.slice(0, lastBodyIdx) + scriptTagToInsert + html.slice(lastBodyIdx);

console.log('2. Copying dist to expo-apk/assets/web ...');
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirSync(distDir, expoAssetsWebDir);

console.log('3. Writing processed index.html to both dist/ and expo-apk/assets/web ...');
fs.writeFileSync(path.join(expoAssetsWebDir, 'index.html'), html, 'utf8');
fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');

console.log('Successfully prepared standalone web assets! Output size: ' + Math.round(html.length / 1024) + ' KB');
