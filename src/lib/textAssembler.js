const fs = require('fs');

module.exports = (options) => {
  let dataJSON = JSON.stringify(options);
  let wrapperCode = fs.readFileSync('./src/components/wrapperCode.js');
  return {
    prepend: `const Diagnostics = require('Diagnostics');\nconst Networking = require('Networking');\ntry {`,
    append: `} catch (error) {\nconst dataJSON = '${dataJSON}'; \n${wrapperCode}\n}`
  }
}