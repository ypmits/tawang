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
