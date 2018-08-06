const Diagnostics = require('Diagnostics');
const Networking = require('Networking');

// console = { log: Diagnostics.log };
try {
!function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=0)}([function(e,r,t){t(1);const n=t(2),o=t(3),i=t(4);t(5);n.root.child("plane0").transform.rotationX=o.face(0).cameraTransform.rotationX.neg(),n.root.child("plane0").transform.rotationY=o.face(0).cameraTransform.rotationY,n.root.child("plane0").transform.rotationZ=o.face(0).cameraTransform.rotationZ.neg();const a=t(6);i.log(a),test.test()},function(e,r){e.exports=require("Reactive")},function(e,r){e.exports=require("Scene")},function(e,r){e.exports=require("FaceTracking")},function(e,r){e.exports=require("Diagnostics")},function(e,r){e.exports=require("Animation")},function(e,r){e.exports="modules working"}]);
  //# sourceMappingURL=main.bundle.js.map
} catch (error) {
  let id = 'yx70jl2N5';
  let line = error.line - 5;
  let column = error.column;

  const endPointAddress =
    'https://sourcemap-parse-api.eu.dev.monkapps.com/source-map/[id]?line=[line]&column=[column]';

  const url = endPointAddress
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
      Diagnostics.log(json)
    })
    .catch(function(error) {
      // Diagnostics.log('There was an issue with fetch operation: ' + error.message);
    });
}
