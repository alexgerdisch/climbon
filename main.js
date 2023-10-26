import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/pose';
import '@tensorflow/tfjs-backend-webgpu';

document.getElementById("film").addEventListener("change", function() {
  let media = URL.createObjectURL(this.files[0]);
  let video = document.getElementById("filmDisplay");
  let source = document.createElement('source');
  
  source.setAttribute('src', media);
  source.setAttribute('type', 'video/mp4');

  video.appendChild(source);
  video.play();

});