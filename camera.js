import * as poseDetection from '@tensorflow-models/pose-detection';

const model = poseDetection.SupportedModels.MoveNet;
const defaultLineWidth = 2;
const defaultRadius = 2;

export class Context {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('output');
        this.source = document.getElementById('currentVID');
        this.ctx = this.canvas.getContext('2d');
        const stream = this.canvas.captureStream();
        const options = {mimeType: 'video/webm; codecs=vp9'};
        this.mediaRecorder = new MediaRecorder(stream, options);
        this.mediaRecorder.ondataavailable = this.handleDataAvailable;

    }

    drawCtx() {
        this.ctx.drawImage(
            this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
    }

    clearCtx() {
        this.ctx.clearRect(0, 0, this.video.videoWidth, this.video.videoHeight);
    }

    drawResults(poses) {
        for (const pose of poses) {
            this.drawResults(pose);
        }
    }

    drawResult(pose) {
        if (pose.keypoints != null) {
            this.drawKeypoints(pose.keypoints);
            this.drawSkeleton(pose.keypoints);
        }
    }

    drawKeypoints(keypoints) {
        const keypointInd = poseDetection.util.getKeypointIndexBySide(model);
        
        this.ctx.fillStyle = 'White';
        this.ctx.strokeStyle = 'White';
        this.ctx.lineWidth = defaultLineWidth;

        for (const i of keypointInd.middle) {
            this.drawKeypoints(keypoints[i]);
        }

        this.ctx.fillStyle = 'Green';
        for (const i of keypointInd.left) {
            this.drawKeypoint(keypoints[i]);
        }
        
        this.ctx.fillStyle = 'Orange';
        for (const i of keypointInd.right) {
            this.drawKeypoint(keypoints[i]);
        }
    }

    drawKeypoint(keypoint) {
        const score = keypoint.score != null ? keypoint.score : 1;
        // where do we get the model's ACTUAL scoreThreshold?
        const scoreThreshold = 0;

        if (score >= scoreThreshold) {
            const circle = new Path2D();
            circle.arc(keypoint.x, keypoint.y, defaultRadius, 0, 2 * Math.PI);
            this.ctx.fill(circle);
            this.ctx.stroke(circle);
        }
    }
    drawSkeleton(keypoints) {
        this.ctx.fillStyle = 'White';
        this.ctx.strokeStyle = 'White';
        this.ctx.lineWidth = params.DEFAULT_LINE_WIDTH;
    
        poseDetection.util.getAdjacentPairs(model)
            .forEach(([i, j]) => {
          const kp1 = keypoints[i];
          const kp2 = keypoints[j];
    
          // If score is null, just show the keypoint.
          const score1 = kp1.score != null ? kp1.score : 1;
          const score2 = kp2.score != null ? kp2.score : 1;
          const scoreThreshold = 0;
    
          if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
            this.ctx.beginPath();
            this.ctx.moveTo(kp1.x, kp1.y);
            this.ctx.lineTo(kp2.x, kp2.y);
            this.ctx.stroke();
          }
        });
      }
    
      start() {
        this.mediaRecorder.start();
      }
    
      stop() {
        this.mediaRecorder.stop();
      }
    
      handleDataAvailable(event) {
        if (event.data.size > 0) {
          const recordedChunks = [event.data];
    
          // Download.
          const blob = new Blob(recordedChunks, {type: 'video/webm'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.style = 'display: none';
          a.href = url;
          a.download = 'pose.webm';
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }




}