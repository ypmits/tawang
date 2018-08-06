var ConcatSource = require('webpack-sources/lib/ConcatSource');

module.exports = class {
  constructor(options) {
    this.options = options;
  }
  
  apply(compiler) {

    // Tapping into the compilation process
    compiler.hooks.compilation.tap('ARStudioDevPlugin', compilation => {
      
      // Inside the compilation process calling a function after all assets have been optimized.
      compilation.hooks.afterOptimizeChunkAssets.tap('ARStudioDevPlugin', (chunks, callback) => {
        
        // Looping over all chunks
        chunks.forEach(chunk => {
          
          // Looping over the files in each chunk
          chunk.files.forEach(file => {
            console.log(compilation.assets[file]);
            // Concating a string to the file
            compilation.assets[file] = new ConcatSource(
              '//test',
              '\n',
              compilation.assets[file],
            );
          });
        });
      });
    });
  }
};
