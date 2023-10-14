const SSD_MOBILENETV1 = 'ssd_mobilenetv1'
const TINY_FACE_DETECTOR = 'tiny_face_detector'


let selectedFaceDetector = SSD_MOBILENETV1

// ssd_mobilenetv1 options
let minConfidence = 0.5

// tiny_face_detector options
let inputSize = 224
let scoreThreshold = 0.5

function getFaceDetectorOptions() {
  return selectedFaceDetector === SSD_MOBILENETV1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
}

function getCurrentFaceDetectionNet() {
  if (selectedFaceDetector === SSD_MOBILENETV1) {
    return faceapi.nets.ssdMobilenetv1
  }
  if (selectedFaceDetector === TINY_FACE_DETECTOR) {
    return faceapi.nets.tinyFaceDetector
  }
}

function isFaceDetectionModelLoaded() {
  return !!getCurrentFaceDetectionNet().params
}

async function changeFaceDetector(detector) {
  selectedFaceDetector = detector

  if (!isFaceDetectionModelLoaded()) {
    await getCurrentFaceDetectionNet().load('./')
  }
}

async function onSelectedFaceDetectorChanged(e) {
  selectedFaceDetector = e.target.value

  await changeFaceDetector(e.target.value)
  updateResults()
}

function initFaceDetectionControls() {
  const faceDetectorSelect = document.getElementById('selectFaceDetector')
  faceDetectorSelect.value(selectedFaceDetector)
  faceDetectorSelect.addEventListener("change", onSelectedFaceDetectorChanged)

  const inputSizeSelect = document.getElementById('inputSize')
  inputSizeSelect.value(inputSize)
  inputSizeSelect.addEventListener("change", onInputSizeChanged)
}

async function onPlay(videoEl) {

  if(!isFaceDetectionModelLoaded())
    return setTimeout(() => onPlay(videoEl))

  const result = await faceapi.detectSingleFace(videoEl, getFaceDetectorOptions()).withFaceLandmarks()

  if (result) {
    const dims = faceapi.matchDimensions(videoEl, videoEl, true)
    const resizedResult = faceapi.resizeResults(result, dims)

    faceapi.draw.drawFaceLandmarksMax(videoEl, resizedResult, dims)
    window.last_updated = Date.now();
  }

  setTimeout(() => onPlay(videoEl))
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  // load face detection and face landmark models
  await changeFaceDetector(TINY_FACE_DETECTOR)
  await faceapi.loadFaceLandmarkModel('./')

  // try to access users webcam and stream the images
  // to the video element
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
  document.querySelector("body").insertAdjacentHTML("beforeend", 
    '<div class="invisibleVideo"><video onloadedmetadata="onPlay(this)" id="inputVideo" autoplay muted playsinline></video></div>');
  const videoElem = document.getElementById('inputVideo');
  videoElem.srcObject = stream
  window.tradeoff = 0.5;
  let size_multiplier = 0.6;
  window.videos_to_change = Array.from(document.querySelectorAll('.video-to-change'));
  window.actual_videos = document.querySelectorAll(".video-to-change video");
  window.videos_to_change_widths = [];
  window.videos_to_change_heights = [];
  let video_index = 0;
  window.actual_videos.forEach((item) => {
    item.play();
    var debug_str = 'Got video with a width of ' + item.scrollWidth.toString() + ' and a height of ' + item.scrollHeight.toString() + 
    ' css width ' + window.videos_to_change[video_index].style.width.toString() + ' css height ' + window.videos_to_change[video_index].style.height.toString();
    console.log(debug_str);
    document.querySelector("body").insertAdjacentHTML("beforeend", '<div style="display:none;">'+debug_str+'</div>');
    window.videos_to_change_widths.push(item.scrollWidth);
    window.videos_to_change_heights.push(item.scrollHeight);
    if (window.videos_to_change[video_index].style.height.length == 0) {
      window.videos_to_change[video_index].style.height = Math.floor(item.scrollHeight * size_multiplier).toString() + 'px';
    }
    if (window.videos_to_change[video_index].style.width.length == 0) {
      window.videos_to_change[video_index].style.width = Math.floor(item.scrollWidth * size_multiplier).toString() + 'px';
    }
    // var vp = document.getElementById('viewport');
    // vp.setAttribute('content','width='+Math.floor(item.scrollWidth * size_multiplier).toString());
    video_index += 1;
  });
  window.video_bounding_rects = window.videos_to_change.map((item) => item.getBoundingClientRect());
  videoElem.play()
  window.last_updated = Date.now();
  setTimeout(() => {if (Date.now() - window.last_updated > 5) {alert('There was an issue. Possible causes are:\n(1) Camera access didn\'t work\n(2) The device is in battery-saving mode\n(3) The internet connection is slow\n(4) You\'re not looking into the camera\nFix the problem(s) and reload the page.');}}, 5000);
}

addEventListener("load", () => {
  run()
});
