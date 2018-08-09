const fs = require('fs');
const path = require('path');

/**
 * Assembles the wrapper code which is added to the webpack output.
 * @param {object} options Options passed thorugh to the AR Studio client.
 * @param {String} options.id The id of the source map on the server.
 * @param {String} options.fullGetEndPointAddress The full address of the parse GET endpoint on the API server.
 */
module.exports = options => {
  // Making the options into JSON.
  let dataJSON = JSON.stringify(options);

  // Getting the wrapper code
  let wrapperCode = fs.readFileSync(path.join(__dirname, 'wrapperCode.js'));

  // Assembling the code that is inserted before the webpack compilation output.
  let prepend = `const Diagnostics = require('Diagnostics');\nconst Networking = require('Networking');\ntry {`;

  // Assembling the code that is inserted after the webpack compilation output.
  let append = `} catch (error) {\nconst dataJSON = '${dataJSON}'; \n${wrapperCode}\n}`;

  return {
    prepend,
    append,
  };
};
