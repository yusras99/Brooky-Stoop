import '../styles/style.css'
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

let scene, camera, renderer, brownstoneTexture, box,ball, shirt, controls;

function addStar(){
	const starGeometry = new THREE.SphereGeometry(0.25,24,24);
	const starMaterial = new THREE.MeshStandardMaterial({color: 0xffffff,
		map : new THREE.TextureLoader().load('assets/star.png'),
	})
	
	const star = new THREE.Mesh(starGeometry,starMaterial);
	star.userData.type = 'star';
	const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

	star.position.set(x,y,z);
	scene.add(star);
}

function addShirt(){
	// Add shirt
	const shirtGeometry = new THREE.BoxGeometry(3, 3, 0.1);
	const shirtMaterial = new THREE.MeshPhongMaterial({ 
		map : new THREE.TextureLoader().load('assets/shirt.png'),
	});

	shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
	shirt.userData.type = 'shirt';
	const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
	shirt.position.set(x,y,z);
	scene.add(shirt);
}

function addBall(){
	// Add ball
	const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
	const ballMaterial = new THREE.MeshPhongMaterial({
		map : new THREE.TextureLoader().load('assets/ball.jpg')
	})
	ball = new THREE.Mesh(ballGeometry,ballMaterial);

	ball.userData.type = 'ball';

	const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
	ball.position.set(x,y,z);
	scene.add(ball);
}

function addBox(){
	const boxGeometry = new THREE.BoxGeometry( 2, 2, 2 );
	const material = new THREE.MeshBasicMaterial( { 
		map : new THREE.TextureLoader().load('assets/rubik.jpg')
	 } );
	
	box = new THREE.Mesh( boxGeometry, material );
	box.userData.type = 'box';
	const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
	box.position.set(x,y,z);
	scene.add(box);

	// Add edges on the box
	const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
	const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black color for edges
	const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
	box.add(edges);
}

function init(){
	// Scene
	scene = new THREE.Scene();

	// Camera
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 30;

	// Renderer
	const canvas = document.querySelector('#bg');
	renderer = new THREE.WebGLRenderer({
		canvas,
	});
	renderer.setPixelRatio(devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );

	// Brownstone backdrop to show brooklyn views
	brownstoneTexture = new THREE.TextureLoader().load('assets/brownStoneTexture.jpg');
	scene.background = brownstoneTexture;


	// Add lights
	const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);

	Array(100).fill().forEach(addStar);
	Array(100).fill().forEach(addShirt);
	Array(100).fill().forEach(addBall);
	Array(100).fill().forEach(addBox);

	// update camera position by listening to dom events by mouse
	controls = new OrbitControls(camera,renderer.domElement);

	animate();
}

// Recursive function that gives infinite loop that helps to animate object
function animate() {
    requestAnimationFrame(animate); // Request next animation frame

    // Rotate objects if they exist
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.type === 'shirt'||
			child instanceof THREE.Mesh && child.userData.type === 'star' ||
			child instanceof THREE.Mesh && child.userData.type === 'box' ||
			child instanceof THREE.Mesh && child.userData.type === 'ball'
		) {
            child.rotation.y += 0.01; // Rotate shirt around Y axis
        }
    });

    controls.update(); // Update orbit controls

    renderer.render(scene, camera); // Render the scene
}



// Whenever the window is resized the renderer should resize too so its not static
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  init();