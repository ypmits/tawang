const needle = require('needle');

module.exports = rawSourceMap => {
  let data = { map: rawSourceMap };
  let options = { json: true };

  return needle(
    'post',
    'https://sourcemap-parse-api.eu.dev.monkapps.com/source-map',
    data,
    options,
  );
};
