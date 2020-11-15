class Triangle{
    constructor(){
        this.type = 'triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }


    render(){
        var xy = this.position; 
        var rgba = this.color;
        var size = this.size;
    
        // Pass the position of a point to a_Position variable
        //gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
        // Pass Size
        gl.uniform1f(u_Size, size);
        // Draw

        var del = this.size/200.0;
        drawTriangle( [xy[0], xy[1], xy[0] + del, xy[1], xy[0], xy[1] + del] );
        
    }

}

let g_triangleBuffer = [];
let g_numTriangles = 0;

function drawTriangle(verticies) {
    var n = 3;
  
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
      console.log("Failed to create buffer object");
      return -1;
    }
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
  
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
  
function drawTriangle3D(verticies) {
    var n = 3;
  
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
      console.log("Failed to create buffer object");
      return -1;
    }
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
  
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function addTriangle3DUV(vertexData) {
    
    g_numTriangles++; 
    g_triangleBuffer = g_triangleBuffer.concat(vertexData);
   
}

function renderTriangles3DUV(triangleBuffer){
  var fVertexData
  var n;
  
  //var fVertexData = new Float32Array(g_triangleBuffer);
  var vertexUVBuffer = gl.createBuffer();
  if(!vertexUVBuffer){
    console.log("Failed to create buffer object");
    return -1;
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexUVBuffer);
   
  if(typeof triangleBuffer !== 'undefined'){
    n = (triangleBuffer.length / 5);
    fVertexData = triangleBuffer;
    console.log(n);
    //console.log(fVertexData.length); 
  }
  else{
    fVertexData = new  Float32Array(g_triangleBuffer);
    n = g_numTriangles;
    g_triangleBuffer = [];
    
  }
  gl.enableVertexAttribArray(a_UV);
  gl.enableVertexAttribArray(a_Position);
  gl.bufferData(gl.ARRAY_BUFFER, fVertexData, gl.DYNAMIC_DRAW);
  var FSIZE = fVertexData.BYTES_PER_ELEMENT;
  
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
  
  
    
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE * 5 , FSIZE * 3);

  

  
  gl.drawArrays(gl.TRIANGLES, 0, n)
}


