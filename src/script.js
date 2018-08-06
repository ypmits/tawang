const Reactive = require('Reactive');
const Scene = require('Scene');
const FaceTracking = require('FaceTracking');
const Diagnostics = require('Diagnostics');
const Animation = require('Animation');

Scene.root.child('plane0').transform.rotationX = FaceTracking.face(0).cameraTransform.rotationX.neg();
Scene.root.child('plane0').transform.rotationY = FaceTracking.face(0).cameraTransform.rotationY;
Scene.root.child('plane0').transform.rotationZ = FaceTracking.face(0).cameraTransform.rotationZ.neg();

const TestModule = require('./test-module.js');
Diagnostics.log(TestModule);

sds
test.test();

