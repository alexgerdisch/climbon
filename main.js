document.getElementById("film").addEventListener("change", function() {
  let media = URL.createObjectURL(this.files[0]);
  let video = document.getElementById("filmDisplay");
  let source = document.createElement('source');
  
  source.setAttribute('src', media);
  source.setAttribute('type', 'video/mp4');

  video.appendChild(source);
  video.play();

});