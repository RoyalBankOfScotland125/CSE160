// BlockyAnimal.js 2020 jswalker
// Vertex shader program
var VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotationMat;
  uniform float u_Size;
  void main() {
    gl_Position = u_GlobalRotationMat * u_ModelMatrix * a_Position;
    gl_PointSize = u_Size;
  }
  `

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  uniform vec4 u_FragColor;  // uniform var
  void main() {
    gl_FragColor = u_FragColor;
  }`

let canvas;
let gl;
let a_Position;
let u_FragColor
let u_Size;
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
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

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

function renderAllShapes() {
    // Clear <canvas>

  var startTime = performance.now();
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  g_shapesList = [];
  

  var globalRotationMat = new Matrix4().rotate(g_angle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotationMat, false, globalRotationMat.elements);
 

  var mainColor = [.7921, .929, .5411, 1.0];
  var body = new Cube();
  body.color = mainColor;
  body.matrix.translate(-.025, -.025, -.5);
  var bodyCoords = new Matrix4(body.matrix);
  body.matrix.rotate(5, 1, 0, 0);
  body.matrix.scale(0.05, .05, 1);
  
  

  

  var tail = new Cube();
  tail.matrix.set(bodyCoords);
  tail.color = mainColor;
  tail.matrix.translate(0, -.09, 1);
  tail.matrix.rotate(-10, 1, 0, 0);
  tail.matrix.scale(0.05, .05, .5);

  var seg1UpperLen = .4
  
  if(!g_upperLock){
    g_lowerAngle = -2 * g_upperAngle + 90;
  }
  
  //Upper left segment
  var upperL1 = new Cube();
  upperL1.color = mainColor;
  upperL1.matrix.rotate( /*15*/g_upperAngle, 0, 0, 1);
  upperL1.matrix.translate(-seg1UpperLen, -.05, -seg1UpperLen/2);
  upperL1.matrix.rotate(90, 0, 1, 0);
  upperL1.matrix.scale(0.03, .03, seg1UpperLen);
  var upperLPos = new Matrix4(upperL1.matrix);

  //Lower left segment
  var lowerL1 = new Cube();
  lowerL1.matrix.translate(-seg1UpperLen * Math.cos(g_upperAngle * Math.PI / 180), -Math.sin(g_upperAngle * Math.PI / 180) * seg1UpperLen, 0);
  lowerL1.matrix.rotate(g_lowerAngle, 0, 0, 1);
  lowerL1.matrix.scale(1.5, 1, 1);
  lowerL1.matrix.translate(-seg1UpperLen - .01, -.01, -seg1UpperLen/2);
  lowerL1.matrix.rotate(90, 0, 1, 0);
  lowerL1.matrix.scale(0.03, .03, seg1UpperLen);
  var lowerLPos = new Matrix4(lowerL1.matrix);

  //Upper right segment
  var upperR1 = new Cube();
  upperR1.matrix.rotate( /*15*/g_upperAngle, 0, 0, 1);
  upperR1.matrix.translate(0, -.05, -seg1UpperLen/2);
  upperR1.matrix.rotate(90, 0, 1, 0);
  upperR1.matrix.scale(0.03, .03, seg1UpperLen);
  var upperRPos = new Matrix4(upperR1.matrix);

  //Upper right segment
  var lowerR1 = new Cube();
  lowerR1.matrix.translate(seg1UpperLen * Math.cos(g_upperAngle * Math.PI / 180), Math.sin(g_upperAngle * Math.PI / 180) * seg1UpperLen , 0);
  lowerR1.matrix.rotate(g_lowerAngle, 0, 0, 1);
  lowerR1.matrix.scale(1.5, 1, 1);
  lowerR1.matrix.translate(-seg1UpperLen -.01, -.01, -seg1UpperLen/2);
  lowerR1.matrix.rotate(90, 0, 1, 0);
  lowerR1.matrix.scale(0.03, .03, seg1UpperLen);
  var lowerRPos = new Matrix4(lowerR1.matrix);


  //Left segment 2
  var upperL2 = new Cube();

  upperL2.matrix.translate(0, 0, .3);
  upperL2.matrix.rotate(20, 0, 0, 1);
  upperL2.matrix.scale(1.25, 1, 1);
  upperL2.matrix.multiply(upperLPos);

  var lowerL2 = new Cube();
  lowerL2.matrix.translate(seg1UpperLen * (Math.cos(g_upperAngle * Math.PI / 180) - Math.cos((20 +  g_upperAngle) * Math.PI / 180)) - .05,
   seg1UpperLen * (Math.sin(g_upperAngle * Math.PI / 180) - Math.sin((20 + g_upperAngle) * (Math.PI / 180))) - .05, .3);
  lowerL2.matrix.scale(1, .75, 1);
  lowerL2.matrix.multiply(lowerLPos);


  //Right Segment 2
  var upperR2 = new Cube();

  upperR2.matrix.translate(0, 0, .3);
  upperR2.matrix.scale(1.25, 1, 1);
  upperR2.matrix.multiply(upperRPos);

  var lowerR2 = new Cube();
  lowerR2.matrix.translate(.25 * .4, 0, .3);
  lowerR2.matrix.multiply(lowerRPos);



  //Left segment 3
  var upperL3 = new Cube();

  upperL3.matrix.translate(0, -.05, .6);
  upperL3.matrix.scale(1.25, 1, 1);
  upperL3.matrix.multiply(upperLPos);

  var lowerL3 = new Cube();
  lowerL3.matrix.translate(-.25 * .4, -.05, .6);
  
  lowerL3.matrix.multiply(lowerLPos);


  //Right Segment 3
  var upperR3 = new Cube();

  upperR3.matrix.translate(0, -.05, .6);
  upperR3.matrix.rotate(-20, 0, 0, 1);
  upperR3.matrix.scale(.75, 1, 1);
  upperR3.matrix.multiply(upperRPos);

  var lowerR3 = new Cube();
  lowerR3.matrix.translate(seg1UpperLen * (Math.cos(g_upperAngle * Math.PI / 180) - Math.cos((20 +  g_upperAngle) * Math.PI / 180)) - .05,
   seg1UpperLen * (Math.sin(g_upperAngle * Math.PI / 180) - Math.sin((20 + g_upperAngle) * (Math.PI / 180))) - .05, 0);

  lowerR3.matrix.translate(-.25 * .4,.05,.6);
  lowerL2.matrix.scale(1, 1.2, 1);
  lowerR3.matrix.multiply(lowerRPos);



   
  //eye stalks

  var leftStalk = new Cube();
  leftStalk.matrix.translate(-.05, .02, -.6);
  leftStalk.matrix.rotate(10, 0, 1, 0);
  leftStalk.matrix.rotate(20, 1, 0, 0);
  leftStalk.matrix.scale(.025, .025, .15);
  var stalkPos = new Matrix4(leftStalk.matrix);


  var rightStalk = new Cube();
  
  rightStalk.matrix.scale(-1, 1, 1);
  rightStalk.matrix.multiply(stalkPos);

  tail.matrix.translate(g_bodyTrans, 0, 0);
  body.matrix.translate(g_bodyTrans, 0, 0);
  g_shapesList.push(tail);
  g_shapesList.push(body);
  g_shapesList.push(upperL1);
  g_shapesList.push(lowerL1);
  g_shapesList.push(upperR1);
  g_shapesList.push(lowerR1);
  g_shapesList.push(upperL2);
  g_shapesList.push(lowerL2);
  g_shapesList.push(upperR2);
  g_shapesList.push(lowerR2);
  g_shapesList.push(upperL3);
  g_shapesList.push(lowerL3);
  g_shapesList.push(upperR3);
  g_shapesList.push(lowerR3);
  g_shapesList.push(leftStalk);
  g_shapesList.push(rightStalk);
  /*
  var leftArm = new Cube();
  leftArm.color = [1, 1, 0, 1];
  leftArm.matrix.setTranslate(0, -.5, 0);
  leftArm.matrix.rotate(-5, 1, 0, 0);
  leftArm.matrix.rotate(g_yellowAngle, 1, 0, 0);
  var yellowCoords = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(.25, .7, .5);
  leftArm.matrix.translate(-.5, 0, 0.0);
  g_shapesList.push(leftArm);


  var box = new Cube();
  box.color = [1, 0, 1, 1];
  box.matrix.set(yellowCoords); 
  box.matrix.translate(0, .65, 0, 0);
  box.matrix.scale(.3, .3, .3);
  box.matrix.translate(-.5, 0, -.001);
  g_shapesList.push(box);

  */

  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    g_shapesList[i].color = mainColor;
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


