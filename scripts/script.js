//
// Available modules include (this is not a complete list):
// var Scene = require('Scene');
// var Textures = require('Textures');
// var Materials = require('Materials');
// var FaceTracking = require('FaceTracking');
// var Animation = require('Animation');
var Reactive = require('Reactive');
//
// Example script
//
// Loading required modules
var Scene = require('Scene');
var FaceTracking = require('FaceTracking');
//
// Binding an object's property to a value provided by the face tracker
var Diagnostics = require('Diagnostics');
 

Scene.root.child('cube0').transform.rotationX = FaceTracking.face(0).cameraTransform.rotationX.neg();
Scene.root.child('cube0').transform.rotationY = FaceTracking.face(0).cameraTransform.rotationY;
Scene.root.child('cube0').transform.rotationZ = FaceTracking.face(0).cameraTransform.rotationZ.neg();

const Animation = require('Animation');

// animation loops every second
// var driver = Animation.timeDriver({durationMilliseconds:1000}); 
// driver.start();
// Diagnostics.watch("driver", driver); 

// var rotation = FaceTracking.face(0).cameraTransform.rotationX.neg();
// 
// Scene.root.child('cube0').transform.rotationX = rotation;
// Diagnostics.watch("test", rotation); 
//
// If you want to log objects, use the Diagnostics module.

