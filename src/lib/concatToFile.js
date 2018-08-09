const ConcatSource = require('webpack-sources/lib/ConcatSource');

/**
 * Appends and a prepends a string to a webpack file.
 * @param {{object}} compilation Compilation object from an afterCompile event.
 * @param {{String}} name The filename of the script output file.
 * @param {{String}} prepend Text to prepend to the file.
 * @param {{String}} append Text to append to the file.
 */
module.exports = (compilation, name, prepend, append) => {

  // Using a webapck method to concat the strings.
  compilation.assets[name] = new ConcatSource(
    prepend,
    '\n',
    compilation.assets[name],
    '\n',
    append,
  );
};
