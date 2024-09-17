const fs = require('fs');
const path = require('path');
const Terser = require('terser');  // Terser for minification

const jsFiles = [
  'public/js/framework7-bundle.js',
  'public/js/app.js',
  'public/js/americano.js',
  'public/js/result.js',
];

const output = 'public/js/combined.min.js';  // Output file

async function bundleAndMinify() {
  try {
    // Read and concatenate the JavaScript files
    const combinedJs = jsFiles
      .map(filePath => {
        try {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          if (!fileContent) {
            throw new Error(`File ${filePath} is empty or cannot be read`);
          }
          console.log(`Successfully read ${filePath}`);
          return fileContent;
        } catch (error) {
          throw new Error(`Error reading file ${filePath}: ${error.message}`);
        }
      })
      .join('\n');  // Combine the JS files into one string

    // Minify the concatenated JavaScript using Terser
    const minified = await Terser.minify(combinedJs);  // Await the minification process

    if (minified.error) {
      throw new Error(`Terser minification error: ${minified.error}`);
    }

    // Write the minified code to the output file
    fs.writeFileSync(output, minified.code, 'utf-8');

    console.log('JavaScript files successfully combined and minified into combined.min.js');
  } catch (error) {
    console.error('Error during bundling and minification:', error);
  }
}

bundleAndMinify();