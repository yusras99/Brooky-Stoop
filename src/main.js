import '../style.css'
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
		map : new THREE.TextureLoader().load('assets/ball.png')
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
		color: 0xcd853f,
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

function makeElementObject(type, width, height) {
	const obj = new THREE.Object3D
  
	const element = document.createElement( type );
	element.style.width = width+'px';
	element.style.height = height+'px';
	element.style.opacity = 0.999;
  
	var css3dObject = new THREE.CSS3DObject( element );
	obj.css3dObject = css3dObject
	obj.add(css3dObject)
  
	// make an invisible plane for the DOM element to chop
	// clip a WebGL geometry with it.
	var material = new THREE.MeshPhongMaterial({
	  opacity	: 0,
	  color	: new THREE.Color( 0x02A0FE ),
	  blending: THREE.NoBlending
	});
  
	var geometry = new THREE.BoxGeometry( width, height, 1 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	obj.lightShadowMesh = mesh
	obj.add( mesh );
  
	return obj
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

	// const button = makeElementObject('button', 700, 200)    
	// button.css3dObject.element.textContent = "Click me!"
	// button.css3dObject.element.style.fontSize = '100px'
	// button.css3dObject.element.addEventListener('click', () => alert('Button clicked!'))
	// button.position.y = -3440
	// button.position.z = -490
	// button.position.x = -2700

	// update camera position by listening to dom events by mouse
	controls = new OrbitControls(camera,renderer.domElement);

	animate();
}

// Recursive function that gives infinite loop that helps to animate object
function animate() {
    requestAnimationFrame(animate); // Request next animation frame

    // Rotate the box if it exists
    if (box) {
        box.rotation.y += 0.01; // Rotate box around Y axis
    }

    // Rotate shirts if they exist
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