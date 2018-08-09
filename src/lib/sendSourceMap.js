const needle = require('needle');

module.exports = async (rawSourceMap, postURL) => {
  let data = { map: rawSourceMap };
  let options = { json: true };

  let response = await needle(
    'post',
    postURL,
    data,
    options,
  );
  if (response.body) {
    return response.body;
  } else {
    throw 'Invalid JSON in response!';
  }
};
