// Import necessary components from Three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Define sizes for each canvas
const sizes = {
  width: 300,  // Each canvas will have a width of 300px
  height: 300  // Each canvas will have a height of 300px
};

// Initialize GLTFLoader
const loader = new GLTFLoader();

// Array to hold the loaded models and their details
const models = [];
let currentIndex = 0; // Track the current start index of the carousel

// Function to load a model and push it to the models array
const loadModel = (url, name, position, onLoad) => {
  loader.load(url, (gltf) => {
    const model = gltf.scene;
    model.position.set(position.x, position.y, position.z);  // Set position if needed
    //model.scale.multiplyScalar(0.1); // You can adjust scaling here

    models.push({ model, name });  // Add model and its details to array
    onLoad();
  });
};

// Load multiple models
const modelUrls = [
  { url: 'public/scythe/scene.gltf', name: 'Scythe', position: { x: 0, y: 0, z: 2} },
  { url: 'public/handgun/scene.gltf', name: 'Handgun', position: { x: 0, y: 0, z: -55 } },
  { url: 'public/pistol.glb', name: 'Pistol', position: { x: 0, y: 0, z: 4} },
  { url: 'public/white_sunglasses.glb', name: 'Sunglasses', position: { x: 0, y: 0, z: 2 } },
  { url: 'public/backpack.glb', name: 'Backpack', position: { x: 0, y: -0.1, z: 4 } },
  { url: 'public/guitar.glb', name: 'Electric Guitar', position: { x: 0, y: -0.7, z: 3 } }
];

// Function to create a scene for each model
const createScene = (model) => {
  const scene = new THREE.Scene();
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);
  
  // Add the model to the scene
  scene.add(model);

  return scene;
};

// Create the camera
const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
  camera.position.z = 5;
  return camera;
};

// Function to create a renderer for each canvas
const createRenderer = (canvas) => {
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
  renderer.setSize(sizes.width, sizes.height);
  return renderer;
};

// Function to animate and render the scene in the canvas
const animate = (renderer, scene, camera, model) => {
  const renderLoop = () => {
    requestAnimationFrame(renderLoop);

    // Rotate the model
    model.rotation.y += 0.01;

    // Render the scene from the perspective of the camera
    renderer.render(scene, camera);
  };
  renderLoop();
};

// Render three models at a time
const renderModelsInDivs = () => {
  const container = document.querySelector('#models-container');
  container.innerHTML = '';  // Clear the previous models

  // Display the current set of three models
  models.slice(currentIndex, currentIndex + 3).forEach((modelInfo, index) => {
    // Create a div for each model
    const div = document.createElement('div');
    div.classList.add('model-container');

    // Create a canvas for each div
    const canvas = document.createElement('canvas');
    canvas.classList.add('webgl');
    div.appendChild(canvas);

    // Append the div to the container
    container.appendChild(div);

    // Create a Three.js scene, camera, and renderer for each canvas
    const scene = createScene(modelInfo.model);
    const camera = createCamera();
    const renderer = createRenderer(canvas);

    // Animate the model within the canvas
    animate(renderer, scene, camera, modelInfo.model);

    // Add click event to show the modal with model details
    div.addEventListener('click', () => {
      showModal(modelInfo.name);
    });
  });
};

// Show modal with model details
const showModal = (name) => {
  const modal = document.querySelector('#modal');
  const modalContent = document.querySelector('#modal-content');
  modalContent.innerHTML = `<h2>${name}</h2><p>Masterpiece of  ${name}.</p>`;
  
  modal.style.display = 'block';  // Show the modal
};

// Load all models and render the first set of three once loaded
let modelsLoaded = 0;
modelUrls.forEach((modelInfo) => {
  loadModel(modelInfo.url, modelInfo.name, modelInfo.position, () => {
    modelsLoaded++;
    if (modelsLoaded === modelUrls.length) {
      renderModelsInDivs();  // Only render when all models are loaded
    }
  });
});

// Carousel controls
document.querySelector('#next-btn').addEventListener('click', () => {
  if (currentIndex + 3 < models.length) {
    currentIndex += 3;  // Move to the next set of models
    renderModelsInDivs();
  }
});

document.querySelector('#prev-btn').addEventListener('click', () => {
  if (currentIndex - 3 >= 0) {
    currentIndex -= 3;  // Move to the previous set of models
    renderModelsInDivs();
  }
});

// Modal close button

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
