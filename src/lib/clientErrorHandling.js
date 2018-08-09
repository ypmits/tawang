throttle(function () {

  Diagnostics.log('error')
  
  let id = DATA_OBJECT.id;
  let line = error.line - DATA_OBJECT.linesOffset;
  let column = error.column;
  
  const url = DATA_OBJECT.fullGetEndPointAddress
    .replace(/\[id\]/i, id)
    .replace(/\[line\]/i, line)
    .replace(/\[column\]/i, column);
  
  Networking.fetch(url)
    .then(function(result) {
      // Log result: {"status":200}
      if (result.status >= 200 && result.status < 300) {
        return result.json();
      }
      throw new Error('HTTP status code ' + result.status);
    })
    .then(function(json) {
      Diagnostics.log(json);
    })
    .catch(function(error) {
      Diagnostics.log('There was an issue with fetch operation: ' + error.message);
    });
});

