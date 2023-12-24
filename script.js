var Colors = {
	red: 0xf25346,
	white: 0xd8d0d1,
	pink: 0xf5986e,
	blue: 0x68c3c0,
	grey: 0x5f5f5f
};

var mousePos = {
	x: 0,
	y: 0
};
window.addEventListener("load", init, false);

function init() {
	createScene();
	createLights();
	createPlane();
	createParticle();
	createSea();
	document.addEventListener("mousemove", handleMouseMove, false);
	loop();
}

var scene,
	fieldOfView,
	aspectRatio,
	nearPlane,
	farPlane,
	renderer,
	container,
	controls;
var HEIGHT, WIDTH;
function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	scene = new THREE.Scene();
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;

	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	// scene.fog= new THREE.Fog(0xf58585,100,780);

	camera.position.x = 0;
	camera.position.z = 220;
	camera.position.y = 150;
	camera.rotation.x = -Math.PI / 6;
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMap.enabled = true;
	container = document.getElementById("world");
	container.appendChild(renderer.domElement);
	renderer.render(scene, camera);

	window.addEventListener("resize", handleWindowResize, false);
}

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
	var tx = -1 + event.clientX / WIDTH * 2;
	var ty = 1 - event.clientY / HEIGHT * 2;

	mousePos = {
		x: tx,
		y: ty
	};
}

var ambientLight, hemisphereLight, shadowLight;

function createLights() {
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
	shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
	shadowLight.position.set(150, 420, 350);
	shadowLight.castShadow = true;
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	ambientLight = new THREE.AmbientLight(0xff8d8d, 0.5);
	scene.add(ambientLight);
	scene.add(hemisphereLight);
	scene.add(shadowLight);
}

var AirPlane = function() {
	this.mesh = new THREE.Object3D();

	var geomCockpit = new THREE.BoxGeometry(130, 60, 230, 1, 1, 1);
	var matCockpit = new THREE.MeshPhongMaterial({
		color: Colors.red,
		shading: THREE.FlatShading
	});
	geomCockpit.vertices[4].z += 40;
	geomCockpit.vertices[4].y -= 40;
	geomCockpit.vertices[1].z += 40;
	geomCockpit.vertices[1].y -= 40;
	this.cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	this.cockpit.castShadow = true;
	this.cockpit.receiveShadow = true;
	this.mesh.add(this.cockpit);

	var geomSideWing = new THREE.BoxGeometry(100, 3, 130, 1, 1, 1);
	var matSideWing = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		shading: THREE.FlatShading
	});
	geomSideWing.vertices[5].z += 70;
	geomSideWing.vertices[7].z += 70;
	geomSideWing.vertices[4].z -= 70;
	geomSideWing.vertices[6].z -= 70;
	var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;
	sideWing.position.z += 40;
	sideWing.position.y -= 10;
	sideWing.rotation.y = Math.PI / 2;
	this.mesh.add(sideWing);

	var geomExha = new THREE.CylinderGeometry(20, 5, 30, 10);
	var matExha = new THREE.MeshPhongMaterial({
		color: Colors.white,
		shading: THREE.FlatShading
	});
	var Exha = [];
	Exha[0] = new THREE.Mesh(geomExha, matExha);
	Exha[0].castShadow = true;
	Exha[0].receiveShadow = true;
	Exha[0].position.z += 120;
	Exha[0].position.x -= 30;
	Exha[0].rotation.x = Math.PI / 2;

	Exha[1] = new THREE.Mesh(geomExha, matExha);
	Exha[1].castShadow = true;
	Exha[1].receiveShadow = true;
	Exha[1].position.z += 120;
	Exha[1].position.x += 30;
	Exha[1].rotation.x = Math.PI / 2;
	this.mesh.add(Exha[0], Exha[1]);

	var geomExha_i = new THREE.CylinderGeometry(17, 17, 30, 33);
	var matExha_i = new THREE.MeshPhongMaterial({
		color: Colors.grey,
		shading: THREE.FlatShading
	});
	var Exha_i = [];
	Exha_i[0] = new THREE.Mesh(geomExha_i, matExha_i);
	Exha_i[0].castShadow = true;
	Exha_i[0].receiveShadow = true;
	Exha_i[0].position.z += 105;
	Exha_i[0].position.x -= 30;
	Exha_i[0].rotation.x = Math.PI / 2;

	Exha_i[1] = new THREE.Mesh(geomExha_i, matExha_i);
	Exha_i[1].castShadow = true;
	Exha_i[1].receiveShadow = true;
	Exha_i[1].position.z += 105;
	Exha_i[1].position.x += 30;
	Exha_i[1].rotation.x = Math.PI / 2;
	this.mesh.add(Exha_i[0], Exha_i[1]);

	var geomWin = new THREE.BoxGeometry(80, 30, 30, 1, 1, 1);
	var matWin = new THREE.MeshPhongMaterial({
		color: Colors.pink,
		shading: THREE.FlatShading
	});
	var Win;
	geomWin.vertices[4].y -= 10;
	geomWin.vertices[1].y -= 10;
	geomWin.vertices[6].z -= 30;
	geomWin.vertices[3].z -= 30;
	geomWin.vertices[7].z += 30;
	geomWin.vertices[2].z += 30;
	Win = new THREE.Mesh(geomWin, matWin);
	Win.castShadow = true;
	Win.receiveShadow = true;
	Win.position.y += 10;
	this.mesh.add(Win);
};

Sea = function() {
	var geom = new THREE.CylinderGeometry(500, 500, 2900, 33, 34);
	geom.mergeVertices();
	var l = geom.vertices.length;
	this.waves = [];

	for (var i = 0; i < l; i++) {
		var v = geom.vertices[i];

		this.waves.push({
			y: v.y,
			x: v.x,
			z: v.z,
			ang: Math.random() * Math.PI * 2,
			amp: 20 + Math.random() * 15,
			speed: 0.016 + Math.random() * 0.032
		});
	}

	var mat = new THREE.MeshPhongMaterial({
		color: 0x54b2a9,
		opacity: 0.9,
		shading: THREE.FlatShading
	});

	this.mesh = new THREE.Mesh(geom, mat);
	this.mesh.receiveShadow = true;
	this.mesh.rotation.z += Math.PI / 2;
	this.mesh.position.y -= 700;
};

Sea.prototype.moveWaves = function() {
	var verts = this.mesh.geometry.vertices;
	var l = verts.length;
	for (var i = 0; i < l; i++) {
		var v = verts[i];
		var vprops = this.waves[i];
		v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
		v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

		vprops.ang += vprops.speed;
	}

	this.mesh.geometry.verticesNeedUpdate = true;

	sea.mesh.rotation.z += 0.005;
};

var airplane;

function createPlane() {
	airplane = new AirPlane();
	airplane.mesh.scale.set(0.25, 0.25, 0.25);
	airplane.mesh.position.y = 0;
	airplane.mesh.position.z = 0;
	scene.add(airplane.mesh);
}

function createSea() {
	sea = new Sea();
	sea.moveWaves();
	scene.add(sea.mesh);
}

function updatePlane() {
	var targetX = normalize(mousePos.x, -1, 1, -100, 100);
	var targetZ = normalize(mousePos.y, -1, 1, 100, -200);
	airplane.mesh.position.x += (targetX - airplane.mesh.position.x) * 0.1;
	airplane.mesh.position.z += (targetZ - airplane.mesh.position.z) * 0.1;
	if (targetZ > 0) {
		sea.mesh.rotation.x += 0.002 + targetZ / 100000;
		for (var i = 0; i < p.length; i++) {
			p[i].mesh.rotation.x += 0.001 + targetZ / 300000;
		}
	} else {
		sea.mesh.rotation.x += 0.005 + -targetZ / 10000;
		for (var i = 0; i < p.length; i++) {
			p[i].mesh.rotation.x += 0.001 + -targetZ / 30000;
		}
	}

	airplane.mesh.rotation.z = 0;
}

function normalize(v, vmin, vmax, tmin, tmax) {
	var nv = Math.max(Math.min(v, vmax), vmin);
	var dv = vmax - vmin;
	var pc = (nv - vmin) / dv;
	var dt = tmax - tmin;
	var tv = tmin + pc * dt;
	return tv;
}

var Particle = function() {
	this.mesh = new THREE.Object3D();
	this.radius = 1400;
	this.side = 3;
	this.s = Math.PI * getRandomInt(0, 360) / 180;
	this.t = Math.PI * getRandomInt(0, 360) / 180;
	geom = new THREE.BoxGeometry(this.side, this.side, this.side, 1, 1, 1);
	mat = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		shading: THREE.FlatShading
	});
	var xAxis = this.radius * Math.cos(this.s) * Math.sin(this.t);
	var yAxis = this.radius * Math.sin(this.s) * Math.sin(this.t);
	var zAxis = this.radius * Math.cos(this.t);
	this.par = new THREE.Mesh(geom, mat);
	this.par.position.x = xAxis;
	this.par.position.y = yAxis;
	this.par.position.z = zAxis;
	this.mesh.add(this.par);
};
var p = [];
function createParticle() {
	for (var i = 0; i < 1000; i++) {
		p[i] = new Particle();
		scene.add(p[i].mesh);
	}
}

function loop() {
	var a = 0.01;
	airplane.mesh.position.y += Math.sin(a);
	renderer.render(scene, camera);
	updatePlane();
	requestAnimationFrame(loop);
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}