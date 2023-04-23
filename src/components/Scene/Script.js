import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap, Power2 } from "gsap";
import * as dat from "dat.gui";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//Global variables
let currentRef = null;
const timeLine = gsap.timeline({
  defaults: { duration: 1, ease: Power2.easeOut },
});
const gui = new dat.GUI({
  width: 400
});

// Drone parts
const droneParts = {
  base: new THREE.Group(),
  helices: new THREE.Group(),
  camaras: new THREE.Group(),
  motor: new THREE.Group(),
};

//Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x393939);
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(-7, 5,10);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setPixelRatio(2);

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Resize canvas
const resize = () => {
  if (currentRef) {
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
    camera.updateProjectionMatrix();
  }
};
window.addEventListener("resize", resize);

// Loader
const loadingManager = new THREE.LoadingManager(() => {
  castShadows();
});
const loader = new GLTFLoader(loadingManager);

// Cast amd receive shadows
const castShadows = (object) => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.envMapIntensity = 0.3;
    }
  });
};

// Plane base shadow
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.ShadowMaterial({ opacity: 0.3 })
);

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.75;
plane.receiveShadow = true;
scene.add(plane);

//Animate the scene
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  const movement = Math.sin(elapsedTime);

  droneParts.base.position.y = movement * 0.05;
  droneParts.helices.position.y = movement * 0.05;
  droneParts.camaras.position.y = movement * 0.05;
  droneParts.motor.position.y = movement * 0.05;

  try {
    for (let i = 0; i < droneParts.helices.children.length; i++) {
      const helice = droneParts.helices.children[i];
      helice.rotation.y = elapsedTime * .5;
    }
  } catch (error) {
    console.log(error);
  }

  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

//Light
const light1 = new THREE.DirectionalLight(0xfcfcfc, 4.3);
light1.position.set(0, 6, 1);
light1.castShadow = true;
light1.shadow.mapSize.set(2048, 2048);
light1.shadow.bias = -0.000131;
scene.add(light1);

const al = new THREE.AmbientLight(0x208080, 0.61);
scene.add(al);

const envMap = new THREE.CubeTextureLoader().load([
  './envmap/px.png',
  './envmap/nx.png',
  './envmap/py.png',
  './envmap/ny.png',
  './envmap/pz.png',
  './envmap/nz.png',
]);
scene.environment = envMap;

//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  if (scene.dispose) scene.dispose();
  try {
    gui.destroy();
  } catch (error) {
    console.log(error);
  }
  currentRef.removeChild(renderer.domElement);
};

//Load groups
export const loadDrone = () => {
  scene.add(droneParts.base);
  scene.add(droneParts.helices);
  scene.add(droneParts.camaras);
  scene.add(droneParts.motor);
}

export const loadModels = (rute, group) => {
  loader.load(rute, (gltf) => {
    while (gltf.scene.children.length) {
      droneParts[group].add(gltf.scene.children[0]);
    }
  });
}

export const removeOldModels = (route, group) => {
  // get a reference to the 3D object
  const oldModels = new THREE.Group();

  while (droneParts[group].children.length) {
    oldModels.add(droneParts[group].children[0]);
  }

  while (droneParts[group].children.length) {
    droneParts[group].remove(droneParts[group].children[0]);
  }

  //Dispose the old models
  oldModels.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      child.material.dispose();
    }
  });

  console.log(renderer.info);

  loadModels(route, group);
}

// const cubeForDebugging = new THREE.Mesh(
//   new THREE.BoxGeometry(.1, .1, .1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );

// scene.add(cubeForDebugging);

// //Debug
// gui.add(cubeForDebugging.position, 'x', -10, 10, 0.01).name('Target X').onChange(() => {
//   orbitControls.target.x = cubeForDebugging.position.x;
// });

// gui.add(cubeForDebugging.position, 'y', -10, 10, 0.01).name('Target Y').onChange(() => {
//   orbitControls.target.y = cubeForDebugging.position.y;
// })

// gui.add(cubeForDebugging.position, 'z', -10, 10, 0.01).name('Target Z').onChange(() => {
//   orbitControls.target.z = cubeForDebugging.position.z;
// })

//camera

gui.add(camera.position, 'x', -10, 10, 0.01).name('Camera X');
gui.add(camera.position, 'y', -10, 10, 0.01).name('Camera Y');
gui.add(camera.position, 'z', -10, 10, 0.01).name('Camera Z');

gui.add(camera, 'zoom', 0, 10, 0.01).name('Camera Zoom').onChange(() => {
  camera.updateProjectionMatrix();
})

// Animations
export const gsapAnimations = (targetPost, camPos, zoom) => {
  timeLine.to(orbitControls.target, {
    x: targetPost.x,
    y: targetPost.y,
    z: targetPost.z,
  })

  timeLine.to(camera.position, {
    x: camPos.x,
    y: camPos.y,
    z: camPos.z,
  }, '-=1')

  timeLine.to(camera, {
    zoom: zoom,
    onUpdate: () => {
      camera.updateProjectionMatrix();
    }
  }, '-=1')
}

export const resetAnimation = () => {
  gsapAnimations({ x: 0, y: 0, z: 0 }, { x: -7, y: 5, z: 10 }, 1);
}