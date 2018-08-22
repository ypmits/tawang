/**
 * Counts the number of lines in a string.
 * @param {String} string
 * @return {number} The number of lines in the string.
 */
module.exports = string => {
  if (typeof string !== 'string') {
    throw new Error(`Can only count lines of a string! Provided type: ${typeof string}.`);
  }

  string += '';
  return string.split(/\r\n|\r|\n/).length;
};
