import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";

let scene;
let camera;
let renderer;
let camcontrols;
let mode = 0;
let objetos = [];
let grid, perfil, plano;
let flyControls;
let t0;
let sombra = true;
let meteorito;
let naveSound;
let estrella,
Planetas = [],
Lunas = [];

// El GUI se usará en este caso para cambiar entre la cámara normal y la cámara del planeta sobre la tierra
const gui = new GUI();

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 20, 30);
  camera.lookAt(0, 0, 0)

  const space = new THREE.TextureLoader().load("src/images/2k_stars_milky_way.jpg");


  scene.background = space;

  naveSound = new Audio("src/sound/nave.mp3");
  naveSound.loop = true;

  // Se crean las diversas texturas de los planetas para ponérselas

  const sun = new THREE.TextureLoader().load("src/images/2k_sun.jpg");

  const mercury = new THREE.TextureLoader().load("src/images/2k_mercury.jpg");

  const venus = new THREE.TextureLoader().load("src/images/venus_2k.jpg");

  const earth = new THREE.TextureLoader().load("src/images/2k_earth_daymap.jpg");

  const mars = new THREE.TextureLoader().load("src/images/2k_mars.jpg");

  const jupiter = new THREE.TextureLoader().load("src/images/2k_jupiter.jpg");

  const saturno = new THREE.TextureLoader().load("src/images/2k_saturn.jpg");

  const urano = new THREE.TextureLoader().load("src/images/2k_uranus.jpg");

  const neptuno = new THREE.TextureLoader().load("src/images/2k_neptune.jpg");

  const moon = new THREE.TextureLoader().load("src/images/2k_moon.jpg");

  // nubes
  const cloud = new THREE.TextureLoader().load("src/images/2k_earth_clouds.jpg");

  const venus_atmos = new THREE.TextureLoader().load("src/images/2k_venus_atmosphere.jpg");

  //meteorito
  const meteorito_texture = new THREE.TextureLoader().load("src/images/meteorito.jpg");
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (sombra) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  }
  document.body.appendChild(renderer.domElement);

  // Control de la cámara
  camcontrols = new OrbitControls(camera, renderer.domElement);

  flyControls = new FlyControls(camera, renderer.domElement);
  flyControls.movementSpeed = 2;       
  flyControls.rollSpeed = 0.5;         
  flyControls.dragToLook = true;      
  flyControls.autoForward = false;

  t0 = new Date();


  // Se quita el grid porque no hará falta en este ejemplo
  //Asistente GridHelper
  grid = new THREE.GridHelper(20, 20);
  grid.position.set(0, 0, 0);
  grid.geometry.rotateX(0);
  //Desplaza levemente hacia la cámara
  grid.position.set(0, 0, 0.05);

  //scene.add(grid);

  // Se crea el sol
  Estrella(1.8, 0xffd700, sun);

  // Se crean los planetas, el color se deja como undefined porque daba errores para la textura

  // Mercurio
  Planeta(0.3, 4.0, -10.0, undefined, 1.0, 1.0, mercury);
  // Venus
  Planeta(0.5, 5.8, -4.2, undefined, 1.0, 1.0, venus);
  // Atmósfera de Venus
  Planeta(0.55, 5.8, -4.2, undefined, 1.0, 1.0, undefined, venus_atmos);
  // Tierra
  Planeta(0.55, 8.0, -3.0, undefined, 1.0, 1.0, earth);
  // Nubes
  Planeta(0.6, 8.0, -3.0, undefined, 1.0, 1.0, undefined, cloud);
  // Marte
  Planeta(0.35, 10.0, -2.8, undefined, 1.0, 1.0, mars);
  // Jupiter
  Planeta(1.1, 13.0, -2.2, undefined, 1.0, 1.0, jupiter);
  // Saturno
  Planeta(0.9, 16.0, -2.0, undefined, 1.0, 1.0, saturno);
  // Urano
  Planeta(0.7, 18.0, -1.65, undefined, 1.0, 1.0, urano);
  // Neptuno 
  Planeta(0.68, 20.0, -1.6, undefined, 1.0, 1.0, neptuno);


  // Luna, Tierra
  Luna(Planetas[3].planeta, 0.15, 0.75, -3.5, undefined, 0.0, moon);

  //Meteorito
  Meteorito(0.2, undefined, meteorito_texture);

   //Luz ambiente, indicando parámetros de color e intensidad
   const Lamb = new THREE.AmbientLight(0xffffff, 0.8);
   scene.add(Lamb);
   

   // Luz generada por el sol
   const solLuz = new THREE.PointLight(0xffffff, 2, 200);
   solLuz.position.set(0, 0, 0); 
   solLuz.castShadow = true;
   solLuz.shadow.radius = 4;
   scene.add(solLuz);


  //Creo un plano en z=0 que no muestro para la intersección
  let geometryp = new THREE.PlaneGeometry(20, 20);
  let materialp = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  plano = new THREE.Mesh(geometryp, materialp);
  plano.visible = false;
  scene.add(plano);

  const camParams = { mode: 0 };
  gui.add(camParams, 'mode', { 'General': 0, 'Nave de Marvin el Marciano': 1, 'Tierra': 2, 'Meteorito': 3})
     .name('Vista')
     .onChange((value) => { mode = value; });

}

//Bucle de animación
function animate() {
  requestAnimationFrame(animate);

  estrella.rotation.y += 0.005;

  // Rotación y traslación
  Planetas.forEach((obj) => {
    obj.planeta.position.x =
      Math.cos(Date.now() * 0.0002 * obj.planeta.userData.speed) *
      obj.planeta.userData.dist;

    obj.planeta.position.z =
      Math.sin(Date.now() * 0.0002 * obj.planeta.userData.speed) *
      obj.planeta.userData.dist;

    obj.planeta.rotation.y += 0.01;
  });

  // Rotación
  Lunas.forEach((luna) => {
    if (luna.parent) {
      luna.parent.rotation.y += 0.01; 
    }
  });

  // Cambiamos el modo de la cámara
  // Por defecto el modo es 0, viendo el sistema entero. Si cambiamos a la nave, mode = 1
  if (mode === 0) {
    camcontrols.enabled = true;
    flyControls.enabled = false;
    meteorito.userData.sound.pause();
    naveSound.pause();
    camera.position.set(0, 20, 30);
    camera.lookAt(0, 0, 0);
  } else if (mode === 1){
    camcontrols.enabled = false;
    flyControls.enabled = true;
    meteorito.userData.sound.pause();
    naveSound.play();
    let t1 = new Date();
    let dt = (t1 -t0) / 1000;
    flyControls.update(dt);
    t0 = t1;
  } else if (mode == 2){
    meteorito.userData.sound.pause();
    naveSound.pause();
    const tierra = Planetas[3].planeta;
    camera.position.copy(tierra.position.clone().add(new THREE.Vector3(0, 1, 2)));
    camera.lookAt(tierra.position);
  } else if(mode == 3){
    camcontrols.enabled = false;
  flyControls.enabled = false;

  
  meteorito.userData.sound.play();
  naveSound.pause();

  if (meteorito) {
      camera.position.copy(meteorito.position.clone().add(new THREE.Vector3(0, 1, 2)) 
    );
    camera.lookAt(meteorito.position); 
  }

  }
  if (meteorito) {
    meteorito.position.add(meteorito.userData.velocidad);
    meteorito.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

// Se crea el sol, se mantiene la función general usada en las prácticas, menos por las texturas
function Estrella(rad, col, texture = undefined) {
  let geometry = new THREE.SphereGeometry(rad, 10, 10);
  let mat = new THREE.MeshPhongMaterial({ color: col });

  if (texture !== undefined) {
    mat.map = texture;
  }
  estrella = new THREE.Mesh(geometry, mat);
  scene.add(estrella);
}

// Se crean los planetas, hay pequeños cambios en la orbita y texturas, pero es bastante parecido al caso general
function Planeta(radio, dist, vel, col, f1, f2, texture = undefined, texalpha=undefined) {
  // Crear geometría de la esfera
  let geom = new THREE.SphereGeometry(radio, 32, 32); // más resolución para texturas
  // Crear material básico
  let mat = new THREE.MeshPhongMaterial({ color: col });

  if (texture !== undefined) {
    mat.map = texture;
  }

  if (texalpha != undefined) {
    //Con mapa de transparencia
    mat.alphaMap = texalpha;
    mat.transparent = true;
    mat.side = THREE.DoubleSide;
    mat.opacity = 1.0;

    //Sin mapa de transparencia
    /*mat.transparent = true;
    mat.side = THREE.DoubleSide;
    mat.opacity = 0.8;
    mat.transparent = true;
    mat.depthWrite = false;*/
  }

  // Crear mesh del planeta
  let planeta = new THREE.Mesh(geom, mat);
  planeta.userData = { dist, speed: vel, f1, f2 };

  // Crear la órbita
  let curva = new THREE.EllipseCurve(0, 0, dist * f1, dist * f2);
  let puntos = curva.getPoints(50);
  let geome = new THREE.BufferGeometry().setFromPoints(puntos);
  let mate = new THREE.LineBasicMaterial({ color: 0xffffff });
  let orbita = new THREE.Line(geome, mate);
  orbita.rotation.x = Math.PI / 2;

  Planetas.push({
    planeta: planeta,
    orbita: orbita
  });

  scene.add(orbita);
  scene.add(planeta);
}


// Luna con texturas
function Luna(planeta, radio, dist, vel, col, angle, texture=undefined) {
  var pivote = new THREE.Object3D();
  pivote.rotation.x = angle;
  planeta.add(pivote);
  var geom = new THREE.SphereGeometry(radio, 10, 10);
  let mat = new THREE.MeshPhongMaterial({ color: col });

  if (texture !== undefined) {
    mat.map = texture;
  }
  var luna = new THREE.Mesh(geom, mat);
  luna.position.x = dist;
  luna.userData.speed = vel;

  Lunas.push(luna);
  pivote.add(luna);
}

function Meteorito(rad, col, texture = undefined) {
  let geometry = new THREE.SphereGeometry(rad, 10, 10);
  let mat = new THREE.MeshPhongMaterial({ color: col });

  if (texture !== undefined) {
    mat.map = texture;
  }
  meteorito = new THREE.Mesh(geometry, mat);
  meteorito.position.set(-40, 5, -30); 
  meteorito.userData = { velocidad: new THREE.Vector3(0.005, 0, 0.003) };

  meteorito.userData.sound = new Audio("src/sound/meteorito.mp3");
  meteorito.userData.sound.loop = true;  

  scene.add(meteorito);
}

