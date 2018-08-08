const ConcatSource = require('webpack-sources/lib/ConcatSource');

module.exports = (compilation, name, prepend, append) => {
  compilation.assets[name] = new ConcatSource(
    prepend,
    '\n',
    compilation.assets[name],
    '\n',
    append,
  );
};
