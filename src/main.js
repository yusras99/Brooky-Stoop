import '../styles/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ballImg from '/assets/ball.jpg';
import basketBallImg from '/assets/basketball.jpeg';
import rubikImg from '/assets/rubik.jpg';
import shirtImg from '/assets/shirt.png';
import shirt2Img from '/assets/shirt2.png';
import brownStoneTexture from '/assets/bg_cropped.jpg';
import starImg from '/assets/star.png';

let scene, camera, renderer, brownstoneTexture, box, ball, shirt, controls, count, clock, bg_geometry;

function addStar() {
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: new THREE.TextureLoader().load(starImg),
  });

  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.userData.type = 'star';
  
  const x = THREE.MathUtils.randFloat(-10, 5) - 20; // Negative x for left side
  const y = THREE.MathUtils.randFloat(-15, -5); 
  const z = 5;
  
  star.position.set(x, y, z);
  scene.add(star);
}

function addShirt(img) {
  // Add shirt
  const shirtGeometry = new THREE.BoxGeometry(3, 3, 0.1);
  const shirtMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(img),
  });

  shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
  shirt.userData.type = 'shirt';
  const x = THREE.MathUtils.randFloat(2, 6) - 20; // Negative x for left side
  const y = THREE.MathUtils.randFloat(-15, -2); 
  const z = 5;

  shirt.position.set(x, y, z);
  scene.add(shirt);
}

function addBall(img) {
  // Add ball
  const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
  const ballMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(img),
    // emissive: new THREE.Color(0x333333), // Glow effect
    // shininess: 100
  });
  ball = new THREE.Mesh(ballGeometry, ballMaterial);

  ball.userData.type = 'ball';

  const x = THREE.MathUtils.randFloat(-6, 1) - 20; // Negative x for left side
  const y = THREE.MathUtils.randFloat(-15, -2); 
  const z = 5;
  ball.position.set(x, y, z);
  scene.add(ball);
}

function addBox() {
  const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(rubikImg),
  });

  box = new THREE.Mesh(boxGeometry, material);
  box.userData.type = 'box';
  box.renderOrder = 1;
  const x = THREE.MathUtils.randFloat(-12, -8) - 20; // Negative x for left side
  const y = THREE.MathUtils.randFloat(-15, -2); 
  const z = 5;

  box.position.set(x, y, z);
  scene.add(box);
}

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  // Renderer
  const bg_container = document.querySelector('.bg');
  const loader = new THREE.TextureLoader()
  renderer = new THREE.WebGLRenderer({});
  renderer.setClearColor(0xffffff);
  // renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  bg_container.appendChild(renderer.domElement);
  
  bg_geometry = new THREE.PlaneGeometry(80, 50, 15, 9);
  const bg_material = new THREE.MeshBasicMaterial({
    map : loader.load(brownStoneTexture),
    transparent : true,
    opacity: 1
  });
  const bg_mesh = new THREE.Mesh(bg_geometry,bg_material);
  bg_mesh.position.z = 1; // Ensure background is behind other objects
  bg_mesh.renderOrder = 0;


  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  Array(3).fill().forEach(() => addShirt(shirtImg));
  Array(3).fill().forEach(() => addShirt(shirt2Img));
  Array(3).fill().forEach(() => addBall(ballImg));
  Array(3).fill().forEach(() => addBall(basketBallImg));
  Array(5).fill().forEach(addBox);

  scene.add(bg_mesh);
  // update camera position by listening to dom events by mouse
  controls = new OrbitControls(camera, renderer.domElement);

  // Grab the number of vertices in the background geometry
  count = bg_geometry.attributes.position.count;
  // Start the clock to use it for animations
  clock = new THREE.Clock();

  animate();
}

// Recursive function that gives infinite loop that helps to animate object
function animate() {
  const time = clock.getElapsedTime();
  // Loop for each vertex of the geometry
  for (let i = 0; i< count; i++){
    // Get the x and y coord of the ith vertex
    const x = bg_geometry.attributes.position.getX(i);
    const y = bg_geometry.attributes.position.getY(i);

    // Create three sine waves with different frequencies and give z a new vertex
    const anim1 = 0.25 * Math.sin(x + time * 0.7);
    const anim2 = 0.35 * Math.sin(x * 1 + time * 0.7);
    const anim3 = 0.1 * Math.sin(y * 15 + time * 0.7);
    bg_geometry.attributes.position.setZ(i, anim1 + anim2 + anim3);

    // recalculate the vertex normals of the geometry to ensure the lighting updates correctly with the animated vertices
    bg_geometry.computeVertexNormals();
    // position attribute of the geometry has been updated and needs to be reprocessed for rendering
    bg_geometry.attributes.position.needsUpdate = true;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if(child.userData.type == 'ball' || child.userData.type ==  'shirt' || child.userData.type == 'box') {
            child.rotation.x += 0.0001; // Slow down rotation
            child.position.y += Math.sin(time * 1.5) * 0.001; // Slow down up and down movement
        }
      }
    });
  }



  requestAnimationFrame(animate); // Request next animation frame

  controls.update(); // Update orbit controls

  renderer.render(scene, camera); // Render the scene
}

// Whenever the window is resized the renderer should resize too so its not static
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
