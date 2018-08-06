const path = require('path');
const sendSourceMap = require('./components/sendSourceMap')
const textAssembler = require('./components/textAssembler')
const concatToFile = require('./components/concatToFile')

module.exports = class {
  constructor(options) {
    this.options = options;
    this.bind();
  }

  apply(compiler) {
    // Tapping into the compilation process
    compiler.hooks.afterCompile.tapAsync('ARStudioDevPlugin', (compilation, callback) => {
      this.handler(compilation).then(() => {
        callback();
      }).catch(error => {
        console.error(error)
      })

    });
  }

  bind() {
    this.collectAssets = this.collectAssets.bind(this);
  }

  async handler(compilation) {
    let assets = this.collectAssets(compilation);

    let sourceMapOnServer = await sendSourceMap(assets.sourceMap.sourceContents._value);
    let wrapper = await textAssembler({
      id: sourceMapOnServer.id
    });
    await concatToFile(compilation, assets.script.sourceName, wrapper.prepend, wrapper.append)
  }

  collectAssets(compilation) {
    //console.log(compilation.assets['main.bundle.js'].children[0]);
    // console.log(JSON.stringify(compilation.assets['main.bundle.js'])

    let sourceMap = [];
    let script = [];

    Object.entries(compilation.assets).forEach(([sourceName, sourceContents]) => {
      let fileExtension = path.extname(sourceName);

      if (fileExtension === '.map') {
        sourceMap = {
          sourceName,
          sourceContents,
        };
        /* this.sendSourceMap(sourceContents._value).then(body => {
            console.log(body)
            
          }); */
      } else if (fileExtension === '.js') {
        script = {
          sourceName,
          sourceContents,
        };

        /* compilation.assets[sourceName] = new ConcatSource(
            '//tesxzxxzt',
            '\n',
            compilation.assets[sourceName],
          ); */
      }
    });

    return {
      sourceMap,
      script
    }
  }
};
