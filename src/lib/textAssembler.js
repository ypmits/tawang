const fs = require('fs');
const path = require('path');

module.exports = (options) => {
  let dataJSON = JSON.stringify(options);
  let wrapperCode = fs.readFileSync(path.join(__dirname, 'wrapperCode.js'));
  return {
    prepend: `const Diagnostics = require('Diagnostics');\nconst Networking = require('Networking');\ntry {`,
    append: `} catch (error) {\nconst dataJSON = '${dataJSON}'; \n${wrapperCode}\n}`
  }
}