const Diagnostics = require("Diagnostics");

try {
  test.test();
} catch (error) {
  Diagnostics.log(error);
  Diagnostics.log(error.message);
  Diagnostics.log(error.name);
}
