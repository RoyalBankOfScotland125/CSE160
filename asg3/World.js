// BlockyAnimal.js 2020 jswalker
// Vertex shader program
var VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotationMat;
  uniform mat4 u_ProjMat;
  uniform mat4 u_ViewMat;
  uniform float u_Size;
  void main() {
    gl_Position = u_ProjMat * u_ViewMat * u_GlobalRotationMat * u_ModelMatrix * a_Position;
    gl_PointSize = u_Size;
    v_UV = a_UV;
  }
  `

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;  // uniform var
  uniform sampler2D u_Sampler0;
  uniform int u_loadTex;
  void main() {
    //gl_FragColor = u_FragColor;
    //gl_FragColor = ;
    gl_FragColor = texture2D(u_Sampler0, v_UV);

    if(u_loadTex == -2){
      gl_FragColor = u_FragColor;
    }
    else if(u_loadTex == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
    else{
      gl_FragColor = vec4(1.0, 0.0 , 1.0, 1.0);
    }
    
  }`

let canvas;
let gl;
let a_Position;
let a_UV; 
let u_FragColor
let u_Size;
let u_Sampler0;
let u_loadTex;
let u_GlobalRotationMat;
let u_ProjMat;
let u_ViewMat;
let g_eye;
let g_at;
let g_up;
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;


var g_shapesList = [];

function setupWebGL () {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function initTextures(){
  

  

  var image = new Image();
  
  if(!image){
    console.log('Failed to create the image object');
    return false;
  }

  image.onload = function(){ loadTexture0(image);};

  image.src = 'uvDebug.jpg';

  return true;

}


function loadTexture0(image) {

  var texture = gl.createTexture();
  if(!texture){
    console.log('Failed to create texture object');
    return false;
  }
  //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}


function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');

    if (a_UV < 0) {
      console.log('Failed to get the storage location of a_UV');
      return;
    }


    u_loadTex = gl.getUniformLocation(gl.program, 'u_loadTex');

    if (!u_loadTex) {
      console.log('Failed to get the storage location of u_loadTex');
      return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');

    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return;
    }
    
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }
    
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
    }

    u_ProjMat = gl.getUniformLocation(gl.program, 'u_ProjMat');
    if (!u_ProjMat) {
      console.log('Failed to get the storage location of u_ProjnMat');
      return;
    }

    u_ViewMat = gl.getUniformLocation(gl.program, 'u_ViewMat');
    if (!u_ViewMat) {
      console.log('Failed to get the storage location of u_ViewMat');
      return;
    }

    u_GlobalRotationMat = gl.getUniformLocation(gl.program, 'u_GlobalRotationMat');
    if (!u_GlobalRotationMat) {
      console.log('Failed to get the storage location of u_GlobalRotationMat');
      return;
    }
}
function main () {

  setupWebGL();

  connectVariablesToGLSL();

  addHtmlUIActions();

  initTextures();
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  g_eye = new Vector3([0, 0, 2]);
  g_at = new Vector3([0, 0, -100]);
  g_up = new Vector3([0, 1, 0]);
  renderAllShapes();

  requestAnimationFrame(tick);
}

//clock vars

var g_clockStart = performance.now() / 1000.0;
var g_clock = performance.now() / 1000.0 - g_clockStart;

function tick(){

  g_clock = performance.now() / 1000.0 - g_clockStart;

  updateAnimation();

  renderAllShapes();

  requestAnimationFrame(tick);
}

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_size = 5;
let g_selectedType = POINT;
let g_segments = 5;
let g_angle = 30;
let g_yellowAngle = 0;
let g_animation = true;
let g_upperLock = false;
function addHtmlUIActions() {

  //button events

  document.getElementById('aniOn').onclick = function() {g_animation = true; };
  document.getElementById('aniOff').onclick = function() {g_animation = false; };



  
  //sliders

  document.getElementById("upperSlider").addEventListener("mousemove", function() {
    g_upperLock = false;
    if(!g_animation){
      g_upperAngle = parseFloat(this.value);
      
    }
  });
  document.getElementById("lowerSlider").addEventListener("mousemove", function() { 
    if(!g_animation){
      g_lowerAngle = parseFloat(this.value);
      g_upperLock = true;
    }
  });
  
  document.getElementById("rotationSlider").addEventListener("mousemove", function() { g_angle = this.value; renderAllShapes();});


  //keyboard controls
  window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Should do nothing if the default action has been cancelled
    }
  
    var handled = false;
    if (event.key !== undefined) {
      if(event.key == 'w'){
        moveForward();
      }
      if(event.key == 's'){
        moveBackward();
      }
      if(event.key == 'a'){
        moveLeft();
      }
      if(event.key == 'd'){
        moveRight();
      }
      if(event.key == 'q'){
        rotateLeft();
      }
      if(event.key == 'e'){
        rotateRight();
      }
      handled = true;
      // Handle the event with KeyboardEvent.key and set handled true.
    } else if (event.keyCode !== undefined) {
      if(event.keyCode == 87){
        moveForward();
        
      }
      if(event.keyCode == 83){
        moveBackward();
      }
      if(event.keyCode == 65){
        moveLeft();
      }
      if(event.keyCode == 68){
        moveRight();
      }
      if(event.keyCode == 81){
        rotateLeft();
      }
      if(event.keyCode == 69){
        rotateLeft();
      }
      handled = true;
      // Handle the event with KeyboardEvent.keyCode and set handled true.
    }
  
    if (handled) {
      // Suppress "double action" if event handled
      event.preventDefault();
    }
  }, true);
  

}

function convertCoordinatesToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  
  return ([x, y]);
}


var g_bodyTrans = 0;
var g_upperAngle = 15;
var g_lowerAngle = 0;

function updateAnimation(){

  if(g_animation){
    
    g_upperAngle =  10*Math.sin(10*g_clock);
    //g_lowerAngle = -20*Math.sin(10*g_clock) +90;
  }
  
  //g_bodyTrans = 5* Math.sin(6*g_clock);
}


function moveForward(){
  var at = new Vector3(g_at.elements);
  var eye = new Vector3(g_eye.elements);
  var d = at.sub(eye);
  d.normalize();
  g_at.add(d);
  g_eye.add(d);
   
  
}

function moveBackward(){
  var at = new Vector3(g_at.elements);
  var eye = new Vector3(g_eye.elements);
  var d = at.sub(eye);
  d.normalize();
  g_at.sub(d);
  g_eye.sub(d);
}

function moveLeft(){
  var at = new Vector3(g_at.elements);
  var eye = new Vector3(g_eye.elements);
  var d = at.sub(eye);
  var left = Vector3.cross(g_up, d);
  left.normalize();
  g_at.add(left);
  g_eye.add(left);
}

function moveRight(){
  var at = new Vector3(g_at.elements);
  var eye = new Vector3(g_eye.elements);
  var d = at.sub(eye);
  var right = Vector3.cross(d, g_up);
  right.normalize();
  g_at.add(right);
  g_eye.add(right);
  
}

function rotateLeft(){
  var at = new Vector3(g_at.elements);
  var eye = new Vector3(g_eye.elements);
  var d = at.sub(eye);
  var rotation = new Matrix4();
  rotation.setRotate(-15, g_up.elements[0], g_up.elements[1], g_up.elements[2]);
  d = rotation.multiplyVector3(d);
  g_at = eye.add(d);
}

function rotateRight(){
  var at = new Vector3(g_at.elements);
  var eye = new Vector3(g_eye.elements);
  var d = at.sub(eye);
  var rotation = new Matrix4();
  rotation.setRotate(15, g_up.elements[0], g_up.elements[1], g_up.elements[2]);
  d = rotation.multiplyVector3(d);
  g_at = eye.add(d);
}


function renderAllShapes() {
    // Clear <canvas>

  var startTime = performance.now();
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  g_shapesList = [];
  

  var globalRotationMat = new Matrix4().rotate(g_angle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotationMat, false, globalRotationMat.elements);
 
  var viewMat = new Matrix4();
  viewMat.setLookAt(g_eye.elements[0], g_eye.elements[1], g_eye.elements[2], //eye
                    g_at.elements[0], g_at.elements[1], g_at.elements[2], //at
                    g_up.elements[0],g_up.elements[1], g_up.elements[2] ); //up
                               
  gl.uniformMatrix4fv(u_ViewMat, false, viewMat.elements);
  //console.log(g_eye);

  var projMat = new Matrix4();
  projMat.setPerspective(90, canvas.width/canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjMat, false, projMat.elements);
  

  
  var test = new Cube();

  test.matrix.scale(.5, .5, .5);
  test.matrix.translate(-1, -1, -1);
  g_shapesList.push(test);


  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    //g_shapesList[i].color = mainColor;
    g_shapesList[i].render();

  }
  
  var duration = performance.now() - startTime;

  sendTextToHTML( " ms: " + Math.floor(duration) + " fps " + Math.floor(10000/duration) / 10, "numdot");

  
}

function sendTextToHTML(text, htmlID){

  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
 

function click (ev) {

  [x, y] = convertCoordinatesToGL(ev);
  // Store the coordinates to g_points array

  let point;

  if(g_selectedType == POINT){
    point = new Point();
  }
  else if(g_selectedType == CIRCLE){
    point = new Circle();
  }
  else{
    point = new Triangle();
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_size;
  if(point.type == 'circle'){
    point.segments = g_segments;
  }
  g_shapesList.push(point);
  // Store the coordinates to g_points array
  //  if (x >= 0.0 && y >= 0.0) {// First quadrant
  //    g_colors.push([1.0, 0.0, 0.0, 1.0]);// Red
  //  } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //    g_colors.push([0.0, 1.0, 0.0, 1.0]);// Green
  //  } else {// Others
  //    g_colors.push([1.0, 1.0, 1.0, 1.0]);// White
  //  }
  //draw every shape in the buffer
  renderAllShapes()
}


