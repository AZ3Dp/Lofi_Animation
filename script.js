import * as THREE from "three"; // Imports everything from THREE.JS
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; // Imports the orbit controller
import { OBJLoader } from "three/addons/loaders/OBJLoader.js"; // Imports the 3D model loader
var capturer = new CCapture({
    format: "webm",
    workersPath: "/lib/",
    verbose: true,
    framerate: 60,
}); // Format may be: GIF, WEBM, PNG, JPG




const loader = new THREE.TextureLoader();
const modelLoader = new OBJLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene(); // Init Scene

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // Init Camera

capturer.capture(renderer.domElement);
// Controls
const controls = new OrbitControls(camera, renderer.domElement); // Create control
controls.target.set(0, 0.5, 0); // Set target
controls.update(); // Update it
controls.enablePan = false; // Disable pan
controls.enableDamping = true; // Enable damping

controls.update();
// Change camera position
camera.position.z = 16;
camera.position.y = 16 / 4;

// Materials
const cubeMaterial = new THREE.MeshBasicMaterial({ map: loader.load('assets/wood texture.jfif') }); // We need to add a material, each material takes the arguement inside an object called color. It is in HEX.
scene.background = loader.load("assets/skybox.jpg");
// Add the objects
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 1), cubeMaterial); // We create a new cube, by default it DOES not exist in the scene


const runButton = document.getElementById('run')
const startRec = document.getElementById('rec-start')
const stopRec = document.getElementById('rec-stop')
const statusRec = document.getElementById('rec-status')
stopRec.disabled = true

// () => {} This is a arrow function
runButton.addEventListener('click', () => {
  runButton.disabled = true
  // Executed on run
  scene.add(cube);
  animate()
})

startRec.addEventListener('click', () => {
  startRec.disabled = true
    capturer.start(); // Start the capturer
    statusRec.innerText = "Recording in progress"; // Update the status
  stopRec.disabled = false
    capturer.stop(); // Stop rhe capturer
    capturer.save(); // Save the recording
    statusRec.innerText = "Saving recording... This *may* take a while"; // Update status
  // Executed on start rec
  
})

stopRec.addEventListener('click', () => {
  startRec.disabled = false
  stopRec.disabled = true
  // Executed on stop rec
})

const listener = new THREE.AudioListener(); // We create the listener
const soundSettings = new THREE.Audio(listener); // >> >> the audio settings
const audioLoader = new THREE.AudioLoader(); // >> >> the audio loader, so we can load the bg
camera.add(listener); // We attach it to the camera

audioLoader.load("assets/bg.mp3", function (buffer) {
    soundSettings.setBuffer(buffer);
    soundSettings.setLoop(true); // Set the audio to loop
    soundSettings.setVolume(0.5); // Audio volume
    soundSettings.play(); // Play Audio
});


modelLoader.load(
    "apple.obj",
    (obj) => {
        console.log("Model: Apple, loaded");
        // Change position, rotation, scale here
        obj.position.x = -1;
        scene.add(obj);
    },
    undefined,
    undefined
);

// Animate Scene
let tick = 0;
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.1;
    if (tick % 64 > 31) {
      cube.position.x += 0.1;
    } else {
      cube.position.x -= 0.1;
    }
    // ANIMATE STUFF HERE
    cube.rotation.x = -1 // Rotate the X axis by 90 degrees
    cube.rotation.z = 1 // Rotate the Z axis by 45 degrees
    renderer.render(scene, camera);
    tick++;
}