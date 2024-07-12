import * as THREE from "three";

let scene, camera, renderer, brownstoneTexture, box, shirt;

function init(){
	// Scene
	scene = new THREE.Scene();

	// Camera
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 30;

	// Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// Brownstone backdrop to show brooklyn views
	brownstoneTexture = new THREE.TextureLoader().load('assets/brownStoneTexture.jpg');
	scene.background = brownstoneTexture;

	// box
	const boxGeometry = new THREE.BoxGeometry( 10, 10, 10 );
	const material = new THREE.MeshBasicMaterial( { 
		color: 0xcd853f,
	 } );
	box = new THREE.Mesh( boxGeometry, material );
	box.position.y = -4;
	scene.add( box );

	// Add edges on the box
	const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
	const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black color for edges
	const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
	box.add(edges);

	// Add shirt
	const textureLoader = new THREE.TextureLoader();
	textureLoader.load('assets/shirt.png', (texture) => {
		// Create shirt geometry and material once the texture is loaded
		const shirtGeometry = new THREE.BoxGeometry(3, 3, 0.1);
		const shirtMaterial = new THREE.MeshPhongMaterial({ 
			map: texture
		});

		shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
		shirt.position.set(4, 10, 10);
		box.add(shirt);
	});

	// Add a toy ball

	const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
	const ballMaterial = new THREE.MeshPhongMaterial({
		map : new THREE.TextureLoader().load('assets/ball.png')
	})
	const ball = new THREE.Mesh(ballGeometry,ballMaterial);
	ball.position.set(8, 10, 10);
	box.add(ball)

	// Add lights
	const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);

	

	animate();
}

// This function helps to runs a loop that helps to animate object
function animate() {

	requestAnimationFrame(animate);
	box.rotation.y += 0.01;
	renderer.render( scene, camera );

}

// Whenever the window is resized the renderer should resize too so its not static
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  init();