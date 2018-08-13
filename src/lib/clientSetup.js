const Diagnostics = require('Diagnostics');
const Networking = require('Networking');
const Time = require('Time');

let DATA_OBJECT = JSON.parse(DATA_JSON);

let dropError = false;

let throttleTime = 1000;
Time.setInterval(function() {
  dropError = false;
}, throttleTime);

function throttle(func) {
  if (!dropError) {
    func();
    dropError = true;
  }
}

/** A list of error locations. */
var StackTrace = function() {
  this.store = [];
};

/**
 * Adds a location to the stack trace.
 * @param {number} line The line number of the error.
 * @param {number} column The column number of the error.
 * @param {String} methodName The method name of the error.
 */
StackTrace.prototype.add = function(line, column, methodName) {
  if (typeof line == 'number' && typeof column === 'number') {
    var location = {
      line: line,
      column: column,
    };

    if (typeof methodName === 'string') {
      location.methodName = methodName;
    }

    this.store.push(location);
  }
};

/** Utilities for parsing errors. */
var ErrorParser = function() {
  this.errorStackStringRegEx = /(Backtrace:\n)((.*|\n)*)/m;
};

/**
 * Checks if the provided argument is a valid JS
 * error object.
 * @param {*} error Something to be checked.
 * @return {boolean} Boolean indicating wether the suplied argument is a valid JS error.
 */
ErrorParser.prototype.isValidJSError = function(error) {
  return typeof error === 'object' && typeof error.stack === 'string';
};

/**
 * Gets the error title from a valid JS error.
 * @param {Error} error A valid JS error object.
 * @return {String} The error title.
 */
ErrorParser.prototype.getTitleFromJSError = function(error) {
  return error.name + ': ' + error.message;
};

/**
 * Gets the stack trace from a valid JS error.
 * @param {Error} error A valid JS error object.
 * @return {StackTrace} The stack trace from the error.
 */
ErrorParser.prototype.getStackTraceFromJSError = function(error) {
  var stackTrace = new StackTrace();

  // Parsing the stack trace.
  var lines = error.stack.split('\n');
  lines.forEach(function(line) {
    var parts = line.split(':');
    var line = parts[2] - DATA_OBJECT.linesOffset;
    var column = parts[3];

    stackTrace.add(line, column);
  });

  return stackTrace;
};

/**
 * Checks if the provided error is a valid native
 * error string from AR Studio.
 * @param {*} error Something to be checked.
 * @return {boolean} Boolean indicating wether the suplied argument is a valid native error.
 */
ErrorParser.prototype.isValidNativeError = function(error) {
  var isString = typeof error === 'string';

  try {
    var stackTraceString = this.errorStackStringRegEx.exec(error)[2];
  } catch (error) {
    // Is not valid if the RegEx operation fails
    return false;
  }
  var hasStackTrace = typeof stackTraceString === 'string';

  return isString && hasStackTrace;
};

/**
 * Gets the error title from a valid native Error.
 * @param {String} error A valid native error string.
 * @return {String} The error title.
 */
ErrorParser.prototype.getTitleFromNativeError = function(error) {
  // Getting the error message.
  var errorMessageRegEx = /^(.*)$/m;
  return errorMessageRegEx.exec(error)[0];
};

/**
 * Gets the stack trace from a valid native error.
 * @param {String} error A valid native error string.
 * @return {StackTrace} The stack trace from the error.
 */
ErrorParser.prototype.getStackTraceFromNativeError = function(error) {
  var stackTrace = new StackTrace();

  // Getting the stack trace string.
  var errorStackString = this.errorStackStringRegEx.exec(error)[2];
  var stackLines = errorStackString.split('\n');

  // Parsing each line of the stack trace.
  for (let i = 0; i < stackLines.length; i++) {
    var currentLine = stackLines[i];

    // Checking if current line is still par of the stack trace.
    if (currentLine.includes('#' + i)) {
      // Removing the number from the line.
      var currentLineWithoutNumber = currentLine.substr(3) + '';
      if (currentLineWithoutNumber.includes('at')) {
        // Splitting the line at the 'at' word.
        var currentLineAtSplit = currentLineWithoutNumber.split('at');

        // Getting the method name
        var methodNameWithSpace = currentLineAtSplit[0];
        // Removing the space before the at
        var methodName = methodNameWithSpace.substr(0, methodNameWithSpace.length - 1);

        // Getting the loction string
        var locationWithSpace = currentLineAtSplit[1];
        // Removing the space after the at
        var location = locationWithSpace.substr(1);

        // Getting the index of the colon between the line and column number.
        var lineColonIndex = location.lastIndexOf(':');
        var file = location.substr(0, lineColonIndex);

        var lineString = location.substr(lineColonIndex + 1);

        if (!isNaN(lineString)) {
          var lineParsed = parseInt(lineString);

          stackTrace.add(lineParsed - DATA_OBJECT.linesOffset, 0, methodName);
        }
      }
    }
  }

  return stackTrace;
};

var errorParser = new ErrorParser();
