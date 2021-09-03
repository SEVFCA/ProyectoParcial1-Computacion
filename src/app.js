// Imports 
import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import * as dat from '../../node_modules/three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';

// Configuracion basica 
let gui = undefined;
let size = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

// Paleta de colores
const palette = {
  bgColor: '#34495e', // CSS String
};

let plane = undefined;
let spotLight;

// Variables generales (CONTADORES)
let countCube = undefined;
let countSphere = undefined;
let countLight = undefined;
let countPointLight = undefined;
let countDirectionalLight = undefined;
let countAmbientLight = undefined;


//Contadores GUI
let GUIFolderLight = 1;
let GUIFolderCube = 1;
let GUIFolderSphere = 1;
let GUIFolderPointLight = 1;
let GUIFolderDirectionalLight = 1;
let GUIFolderAmbientLight = 1;

// Arreglos de objetos
const objectsCube = [];
const objectsSphere = [];
const objectsLight = [];
const objectsPointLight = [];
const objectsDirectionalLight = [];
const objectsAmbientLight = [];

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

export function reset() {
  scene.children = [];
  renderer.setSize(0, 0, true);
  countCube = 0;
  GUIFolderCube = 1;
  GUIFolderSphere = 1;
  GUIFolderLight = 1;
}

export function main(optionSize) {
  reset();
  // Configuracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(palette.bgColor, 1);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 15;
  camera.position.y = 15;

  // Controls
  new OrbitControls(camera, renderer.domElement);

  // Plano por defecto
  defaultPlane(optionSize);

  // GUI
  loadGUI();

  // Light
  setupLights();

  // Render
  animate();
}

//
function defaultPlane(size) {
  const geometry = new THREE.PlaneGeometry(size, size, size, size);
  const material = new THREE.MeshPhongMaterial({
    color: '#28B06C',
    side: THREE.DoubleSide,
    wireframe: false,
  });
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  plane.receiveShadow = true;
  plane.rotation.x = Math.PI / 2;
}


function loadGUI() {
  cleanGUI();
  gui = new dat.GUI();
  gui.open();
}

// Limpia el GUI
export function cleanGUI() {
  const dom = document.querySelector('.dg.main');
  if (dom) dom.remove();
}

//
function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 10, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;

  spotLight.castShadow = true;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);
  updateElements();
  renderer.render(scene, camera);
}

function updateElements() {
  _updateCubes();
  _updateSpheres();
  _updateLights();
  _updatePointLight();
  _updateDirectionalLight();
  _updateAmbientLight();
}

//.....CREACION DE LUCES

//Creacion AmbientLight Generica

export function createAmbientGeneric(){
  const ambient = new THREE.AmbientLight({
    color: 0x404040,
    intensity: 1,
  }); // soft white light
  scene.add( ambient );

  objectsAmbientLight.push(ambient)

  ambient.GUIambient = _ambientObject();
  _createAmbientGUI(ambient.GUIambient);

  countAmbientLight = countAmbientLight + 1;

}

//Creacion DirectionalLight GENERICA
export function createDirectionalGeneric(){
  const directionalLight = new THREE.DirectionalLight({
    color: 0xffffff,
    intensity: 0.5,
  });
  scene.add(directionalLight);

  objectsDirectionalLight.push(directionalLight)

  directionalLight.GUIdirectional = _directionalObject();
  _createDirectionalGUI(directionalLight.GUIdirectional);

  countDirectionalLight = countDirectionalLight + 1;

}

//CreacionPointLighte Generica.
export function createPointGeneric(){
  const light = new THREE.PointLight({
    color: 0xff0000,
    intensity: 1,
    distance: 100,
    decay:1,
  });
  light.position.set(50,50,50);
  scene.add(light);

  objectsPointLight.push(light)

  light.GUIpoint = _pointObject();
  _createLightPointGui(light.GUIpoint);

  countPointLight = countPointLight + 1;

}



//Creacion LightSpot Generica.
export function createLightGeneric(){
  const spotLight = new THREE.SpotLight( 0xffffff);
  spotLight.intensity =1;
  spotLight.position.set(0,30,0);
  spotLight.castShadow=true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  scene.add(spotLight);
  objectsLight.push(spotLight)

  spotLight.GUIlight = _lightObject();
  _createLightGUI(spotLight.GUIlight);

  countLight = countLight + 1;

}

//CREACION DE FIGURAS......


//Creacion de Sphere Generico.

export function createSphereGeneric(){
const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshBasicMaterial( { 
  color: 0xAA5DD1,
  wireframe: false,
} );
const sphere = new THREE.Mesh( geometry, material );

scene.add( sphere );
objectsSphere.push(sphere);
sphere.position.y=0.5;
sphere.castShadow = true;
sphere.receiveShadow = true;

sphere.GUIsphere = _sphereObject();
_createSphereGUI(sphere.GUIsphere);

countSphere = countSphere + 1;
}

//Creacion de Cubo Generico.

export function createCubeGeneric() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0xffaec0,
    wireframe: false,
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);
  objectsCube.push(cube);
  cube.position.y = 0.5;
  cube.castShadow = true;
  cube.receiveShadow = true;

  cube.GUIcube = _cubeObject();
  _createCubeGUI(cube.GUIcube);

  countCube = countCube + 1;
}

//                                                      CAMBIOS/Atributos

//Cambios al objeto AmbientLight
function _ambientObject(){
  var GUIambient = {
    colorA:0x404040,
    intensidadA: 1,
    onoff: false,
  };

  return GUIambient;
}

//Cambios al Obejto DirectionalLight
function _directionalObject(){
  var GUIdirectional = {
    colorD: 0xffffff,
    intensidadD: 0.5,
    onoff: false,
  };

  return GUIdirectional;
}

//Cambio al Objeto PointLight.
function _pointObject(){
  var GUIpoint = {
    intensidadP: 1,
    colorPoint: 0xff0000,
    distanciaP: 100,
    decayP: 1,
    onoff: false,

    posPX: 50,
    posPY: 50,
    posPZ: 50,

  };

  return GUIpoint;
}

//Cambios al Objeto SpotLight.
function _lightObject(){
  var GUIlight = {
    intensidad: 1,
    colorLight: 0xffffff,
    shadowL: true,
    posLX: 0,
    posLY: 20,
    posLZ: 0,
    onoff: false,
  };

  return GUIlight;
}

//Cambios al Objeto Esfera.

function _sphereObject(){
  var GUIsphere = {
    materialSphere: 'Basic',
    materialColorSphere:0xAA5DD1,
    radio: 1,
    showSegSphere: false,
    widthSeg: 32,
    heightSeg: 16,
    posSX: 0,
    posSY: 2,
    posSZ:0,

    
  };
  return GUIsphere;
}

//Cambios al Objeto Cubo.

function _cubeObject() {
  var GUIcube = {
    material: 'Basic',
    materialColor: 0xffaec0,
    showSeg: false,
    segX: 1,
    segY: 1,
    segZ: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    posX: 0,
    posY: 0.5,
    posZ: 0,
  };

  return GUIcube;
}

//                                                  | GUI's |
//Gui de AmbientLight
function _createAmbientGUI(GUIambient){
  const folder = gui.addFolder('AmbientLight '+GUIFolderAmbientLight);

  folder.add(GUIambient, 'onoff').name('Apagar');

  folder.addColor(GUIambient, 'colorA').name('Color Ambient Light');
  folder.add(GUIambient,'intensidadA').name('Intensidad Ambient Light');

  GUIFolderAmbientLight = GUIFolderAmbientLight + 1;
}




//GUI de DirectionalLight
function _createDirectionalGUI(GUIdirectional){
  const folder = gui.addFolder('DirectionalLight '+ GUIFolderDirectionalLight);

  folder.add(GUIdirectional, 'onoff').name('Apagar');

  folder.add(GUIdirectional,'intensidadD').name('Intensidad DirectionalLight');
  folder.addColor(GUIdirectional, 'colorD');

  GUIFolderDirectionalLight = GUIFolderDirectionalLight + 1;

}

//GUI de PointLight
function _createLightPointGui(GUIpoint){
  const folder = gui.addFolder('PointLight '+ GUIFolderPointLight);

  folder.add(GUIpoint, 'onoff').name('Apagar');

  folder.add(GUIpoint,'intensidadP',0,10).name('Intensidad PointLight');
  folder.add(GUIpoint, 'decayP');

  folder.addColor(GUIpoint,'colorPoint').name('Color Point');
  folder.add(GUIpoint,'distanciaP');

  folder.add(GUIpoint, 'posPX');
  folder.add(GUIpoint, 'posPY');
  folder.add(GUIpoint, 'posPZ');

  GUIFolderPointLight = GUIFolderPointLight + 1;


}

//GUI DE SpotLIGHT

function _createLightGUI(GUIlight){
  const folder = gui.addFolder('SpotLight '+ GUIFolderLight);
  
  folder.add(GUIlight, 'onoff').name('Apagar');

  folder.add(GUIlight,'intensidad',0,40).name('Intensidad SpotLight');
  

  folder.addColor(GUIlight,'colorLight').name('Color Spot');

  folder.add(GUIlight,'shadowL');
  folder.add(GUIlight, 'posLX');
  folder.add(GUIlight, 'posLY');
  folder.add(GUIlight, 'posLZ');

  GUIFolderLight = GUIFolderLight + 1;

}

//GUI DE LA ESFERA

function _createSphereGUI(GUIsphere){
  const folder = gui.addFolder('Sphere '+ GUIFolderSphere);
  
  //Material
  folder.addColor(GUIsphere,'materialColorSphere').name('Color de Esfera')
  folder.add(GUIsphere, 'materialSphere', ['Basic', 'Phong','Lambert']).name('Material de la Esfera');
  
  //Mostrar/NoMostrar Wireframe
  
  folder.add(GUIsphere, 'showSegSphere').name('On/OFF Wireframe');
  folder.add(GUIsphere, 'widthSeg', 3,36);
  folder.add(GUIsphere, 'heightSeg', 2,20);

  //Posicion
  folder.add(GUIsphere, 'radio',1,10).name('Radio');
  folder.add(GUIsphere, 'posSX', -100,100).name('Posición X');
  folder.add(GUIsphere, 'posSY', -100,100).name('Posición Y');
  folder.add(GUIsphere, 'posSZ', -100,100).name('Posición Z');

  GUIFolderSphere = GUIFolderSphere + 1;


}

//GUI DEL CUBO

function _createCubeGUI(GUIcube) {
  const folder = gui.addFolder('Cube ' + GUIFolderCube);
  // Material
  folder.addColor(GUIcube, 'materialColor').name('Color del Cubo');
  folder.add(GUIcube, 'material', ['Basic', 'Phong', 'Lambert']).name('Material del Cubo');

  // Escala
  folder.add(GUIcube, 'scaleX').name('Ancho');
  folder.add(GUIcube, 'scaleY').name('Altura');
  folder.add(GUIcube, 'scaleZ').name('Profundidad');

  //Mostrar/NoMostrar Wireframe
  folder.add(GUIcube, 'showSeg').name('On/OFF Wireframe');
  folder.add(GUIcube, 'segX');
  folder.add(GUIcube, 'segY');
  folder.add(GUIcube, 'segZ');

  // Posicion
  folder.add(GUIcube, 'posX',-100,100).name('Posicion X');
  folder.add(GUIcube, 'posY',-100,100).name('Posicion Y');
  folder.add(GUIcube, 'posZ',-100,100).name('Posicion Z');

  GUIFolderCube = GUIFolderCube + 1;
}

//                                     |  UPDATES   |  

//Update AmbientLight
function _updateAmbientLight(){
  Object.keys(objectsAmbientLight).forEach((i)=>{
  const ambientSelected = objectsAmbientLight[i];

  ambientSelected.color.setHex(ambientSelected.GUIambient.colorA);
  if(ambientSelected.GUIambient.onoff == false){
    ambientSelected.intensity = ambientSelected.GUIambient.intensidadA;
  }
  else{
    ambientSelected.intensity = 0;
  }

  
  });

}

//UPDATE DirectionalLight

function _updateDirectionalLight(){
  Object.keys(objectsDirectionalLight).forEach((i)=>{
    const directionalSelected = objectsDirectionalLight[i];

    directionalSelected.color.setHex(directionalSelected.GUIdirectional.colorD);
    if(directionalSelected.GUIdirectional.onoff == false){
      directionalSelected.intensity = directionalSelected.GUIdirectional.intensidadD;
    }
    else{
      directionalSelected.intensity = 0;
    }

    

    

  });
}

//UPDATE PointLight

function _updatePointLight(){
    Object.keys(objectsPointLight).forEach((i)=>{
      const pointSelected = objectsPointLight[i];

    pointSelected.intensity = pointSelected.GUIpoint.intensidadP;
    pointSelected.distance = pointSelected.GUIpoint.distanciaP;
    pointSelected.decay = pointSelected.GUIpoint.decayP;
    pointSelected.color.setHex(pointSelected.GUIpoint.colorPoint);
    
    
    pointSelected.position.x = pointSelected.GUIpoint.posPX;
    pointSelected.position.y = pointSelected.GUIpoint.posPY;
    pointSelected.position.z = pointSelected.GUIpoint.posPZ;
    

    if(pointSelected.GUIpoint.onoff == false){
      pointSelected.intensity = pointSelected.GUIpoint.intensidadP;
    }
    else{
      pointSelected.intensity = 0;
    }

  

    

    });
}

//UPDATE SpotLIGHT

function _updateLights(){
  Object.keys(objectsLight).forEach((i) =>{
    
    const lightSelected = objectsLight[i];
  
    lightSelected.position.x = lightSelected.GUIlight.posLX;
    lightSelected.position.y = lightSelected.GUIlight.posLY;
    lightSelected.position.z = lightSelected.GUIlight.posLZ;

    lightSelected.castShadow= lightSelected.GUIlight.shadowL;
    lightSelected.color.setHex(lightSelected.GUIlight.colorLight);

    if(lightSelected.GUIlight.onoff == false){
      lightSelected.intensity = lightSelected.GUIlight.intensidad;
    }
    else{
      lightSelected.intensity = 0;
    }

    

  });
}

//UPDATES ESFERA
  
function _updateSpheres() {
  Object.keys(objectsSphere).forEach((i) => {
    const sphereSelected = objectsSphere[i];

    sphereSelected.GUIsphere.materialSphere == 'Basic' 
    ? (sphereSelected.material = new THREE.MeshBasicMaterial({
      color: sphereSelected.GUIsphere.materialColorSphere,
    }))
    :sphereSelected.GUIsphere.materialSphere == 'Lambert'
    ? (sphereSelected.material = new THREE.MeshLambertMaterial({
      color: sphereSelected.GUIsphere.materialColorSphere,
    }))
    : (sphereSelected.material = new THREE.MeshPhongMaterial({
      color: sphereSelected.GUIsphere.materialColorSphere,
    }));

    //wireframe
    sphereSelected.material.wireframe = sphereSelected.GUIsphere.showSegSphere;

    //SEGMENTOS Y RADIO
    sphereSelected.geometry = new THREE.SphereGeometry(
      sphereSelected.GUIsphere.radio,
      sphereSelected.GUIsphere.widthSeg,
      sphereSelected.GUIsphere.heightSeg,
    )

    //Posicion
    sphereSelected.position.x = sphereSelected.GUIsphere.posSX;
    sphereSelected.position.y = sphereSelected.GUIsphere.posSY;
    sphereSelected.position.z = sphereSelected.GUIsphere.posSZ;
  });
}



//UPDATES CUBO

function _updateCubes() {
  Object.keys(objectsCube).forEach((i) => {
    const cubeSelected = objectsCube[i];
    //Material cubo
    cubeSelected.GUIcube.material == 'Basic'
      ? (cubeSelected.material = new THREE.MeshBasicMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : cubeSelected.GUIcube.material == 'Lambert'
      ? (cubeSelected.material = new THREE.MeshLambertMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : (cubeSelected.material = new THREE.MeshPhongMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }));

    //Escalar cubo
    cubeSelected.geometry = new THREE.BoxGeometry(
      cubeSelected.GUIcube.scaleX,
      cubeSelected.GUIcube.scaleY,
      cubeSelected.GUIcube.scaleZ,
      cubeSelected.GUIcube.segX,
      cubeSelected.GUIcube.segY,
      cubeSelected.GUIcube.segZ,
    );

    //Mostrar/No Mostrar wireframe
    cubeSelected.material.wireframe = cubeSelected.GUIcube.showSeg;
    

    //Posición
    cubeSelected.position.x = cubeSelected.GUIcube.posX;
    cubeSelected.position.y = cubeSelected.GUIcube.posY;
    cubeSelected.position.z = cubeSelected.GUIcube.posZ;
  });
}