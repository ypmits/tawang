const needle = require('needle');

module.exports = async rawSourceMap => {
  let data = { map: rawSourceMap };
  let options = { json: true };

  let response = await needle(
    'post',
    'https://sourcemap-parse-api.eu.dev.monkapps.com/source-map',
    data,
    options,
  );
  if (response.body) {
    return response.body;
  } else {
    throw 'Invalid JSON in response!';
  }
};
