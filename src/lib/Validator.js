/**
 * Validates and sanitizes inputs.
 */
module.exports = class {
  constructor() {}

  /**
   * Validates and sanitizes a relative address of the source map POST endpoint.
   * @param {String} sourceMapEndpoint An address or undefined.
   * @return {String} A valid endpoint address.
   */
  sourceMapEndpoint(sourceMapEndpoint) {
    // Cleaning up the postEndPoint option
    let cleanSourceMapEndpoint = sourceMapEndpoint;

    if (typeof cleanSourceMapEndpoint !== 'string') {
      // Setting to default parameter if parameter is not provided.
      cleanSourceMapEndpoint = '/source-map';
    } else if (cleanSourceMapEndpoint.charAt(0) !== '/') {
      // Adding / at the beginning if it isn't there.
      cleanSourceMapEndpoint = '/' + cleanSourceMapEndpoint;
    }

    return cleanSourceMapEndpoint;
  }

  /**
   * Validates and sanitizes a relative address of the parsing GET endpoint.
   * @param {String} parseEndpoint An address or undefined.
   * @return {String} A valid endpoint address.
   */
  parseEndpoint(parseEndpoint) {
    // Cleaning up the postEndPoint option
    let cleanParseEndpoint = parseEndpoint;

    if (typeof cleanParseEndpoint !== 'string') {
      // Setting to default parameter if parameter is not provided.
      cleanParseEndpoint = '/source-map/[id]';
    } else if (cleanParseEndpoint.includes('https')) {
      throw 'Tawang: getEndPoint must not be a full address. Please provide only the relative address to the serverHost (e.g. /sourcemap)';
    } else if (!cleanParseEndpoint.includes('[id]')) {
      throw 'Tawang: getEndPoint must include an id placeholder! You can fix this by including "[id]" (without quotes) in the getEndPoint option.';
    } else if (cleanParseEndpoint.charAt(0) !== '/') {
      // Adding / at the beginning if it isn't there.
      cleanParseEndpoint = '/' + cleanParseEndpoint;
    }

    return cleanParseEndpoint;
  }
};
