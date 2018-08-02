const express = require("express");
const app = express();
const fs = require("fs");
const sourceMap = require("source-map");

app.listen(3000, function() {
  console.log("Remote debug listening on port 3000!");
});

// Loading in source map
const rawSourceMap = JSON.parse(
  fs.readFileSync("./../../build/main.bundle.js.map", "utf8")
);

// TODO: Handle when the consumer isn't ready yet, but there is already a request coming in.

sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {
  // Making the endpoint for error parsing
  app.get("/api/error", function(req, res) {
    // Getting the line and cloumn number from the request's GET parameters
    let line = parseInt(req.query.line);
    let column = parseInt(req.query.column);

    // Getting the original line and column number
    let originalError = consumer.originalPositionFor({
      line: line,
      column: column
    });
    console.error(originalError);
    res.json(originalError);
  });
});
