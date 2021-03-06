const fs = require('fs');
const path = require('path');
const numberOfLines = require('./numberOfLines');

/**
 * Assembles the wrapper code which is added to the webpack output.
 * @param {object} options Options passed thorugh to the AR Studio client.
 * @param {String} options.id The id of the source map on the server.
 * @param {String} options.fullParseEndpointAddress The full address of the parse GET endpoint on the API server.
 */
module.exports = (options = {}) => {
  if (typeof options !== 'object') {
    throw new Error('No options object provided!');
  }

  if (typeof options.id !== 'string') {
    throw new Error('No valid id provided! options.id must be a string.');
  }

  if (typeof options.fullParseEndpointAddress !== 'string') {
    throw new Error(
      'No valid fullParseEndpointAddress provided! options.fullParseEndpointAddress must be a string.',
    );
  }

  // Getting the wrapper code
  let clientSetupCode = fs.readFileSync(path.join(__dirname, 'clientSetup.js'), 'UTF-8');
  let clientErrorHandlingCode = fs.readFileSync(
    path.join(__dirname, 'clientErrorHandling.js'),
    'UTF-8',
  );

  // Assembling the data object which gets passed on to the client.
  let data = {
    ...options,
    linesOffset: numberOfLines(clientSetupCode) + 2, // Number of lines above webpack output.
  };

  // Making the options into JSON.
  let dataJSON = JSON.stringify(data);

  // Assembling the code that is inserted before the webpack compilation output.
  let prepend = `const DATA_JSON = '${dataJSON}'; \n${clientSetupCode}\ntry {`;

  // Assembling the code that is inserted after the webpack compilation output.
  let append = `} catch (error) {\n${clientErrorHandlingCode}\n}`;

  return {
    prepend,
    append,
  };
};
