/**
 * Validates and sanitizes inputs.
 */
module.exports = class {
  constructor() {}

  /**
   * Validates and sanitizes a relative address of the source map POST endpoint.
   * @param {String} postEndPoint An address or undefined.
   * @return {String} A valid endpoint address.
   */
  postEndPoint(postEndPoint) {
    // Cleaning up the postEndPoint option
    let cleanPostEndPoint = postEndPoint;

    if (typeof cleanPostEndPoint !== 'string') {
      // Setting to default parameter if parameter is not provided.
      cleanPostEndPoint = '/source-map';
    } else if (cleanPostEndPoint.charAt(0) !== '/') {
      // Adding / at the beginning if it isn't there.
      cleanPostEndPoint = '/' + cleanPostEndPoint;
    }

    return cleanPostEndPoint;
  }

  /**
   * Validates and sanitizes a relative address of the parsing GET endpoint.
   * @param {String} getEndPoint An address or undefined.
   * @return {String} A valid endpoint address.
   */
  getEndPoint(getEndPoint) {
    // Cleaning up the postEndPoint option
    let cleanGetEndPoint = getEndPoint;
    
    if (typeof cleanGetEndPoint !== 'string') {

      // Setting to default parameter if parameter is not provided.
      cleanGetEndPoint = '/source-map/[id]?line=[line]&column=[column]';
    } else if (cleanGetEndPoint.includes('https')) {
      throw 'Tawang: getEndPoint must not be a full address. Please provide only the relative address to the serverHost (e.g. /sourcemap)'
    } else if (!cleanGetEndPoint.includes('[id]')) {
      throw 'Tawang: getEndPoint must include an id placeholder! You can fix this by including "[id]" (without quotes) in the getEndPoint option.'
    } else if (!cleanGetEndPoint.includes('[line]')) {
      throw 'Tawang: getEndPoint must include an line placeholder! You can fix this by including "[line]" (without quotes) in the getEndPoint option.'
    } else if (!cleanGetEndPoint.includes('[column]')) {
      throw 'Tawang: getEndPoint must include an column placeholder! You can fix this by including "[column]" (without quotes) in the getEndPoint option.'
    } else if (cleanGetEndPoint.charAt(0) !== '/') {
      
      // Adding / at the beginning if it isn't there.
      cleanGetEndPoint = '/' + cleanGetEndPoint;
    }
    console.log(cleanGetEndPoint)
    return cleanGetEndPoint;
  }
};
