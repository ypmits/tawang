const needle = require('needle');

/**
 * Sends the source map to the API. The server then parses the source map and returns the location.
 * @param {String} rawSourceMap A valid source map in JSON format.
 * @param {String} fullSourceMapEndpointAddress The full address of the source map POST endpoint on the API server.
 */
module.exports = async (rawSourceMap, fullSourceMapEndpointAddress) => {
  let data = { map: rawSourceMap };
  let options = { json: true };

  let response = await needle('post', fullSourceMapEndpointAddress, data, options);
  if (response.body) {
    return response.body;
  } else {
    throw 'Invalid JSON in response!';
  }
};
