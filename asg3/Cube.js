class Cube{
    constructor(){
        this.type = 'cube';
        
        this.color = [1.0, 1.0, 1.0, 1.0];
        
        this.matrix = new Matrix4();
        this.texNum = 0;
        this.cubeVerts32 = new Float32Array([
            0, 0, 0, 0, 0,   1, 1, 0, 1, 1,   1, 0, 0, 1, 0,  //front
            0, 0, 0, 0, 0,   0, 1, 0, 0, 1,   1, 1, 0, 1, 1
            ,
            0, 1, 0, 0, 1,   0, 1, 1, 0, 0,   1, 1, 1, 1, 0, //top
            0, 1, 0, 0, 1,   1, 1, 1, 1, 0,   1, 1, 0, 1, 1
            ,
            1, 0, 0, 1, 0,   1, 1, 0, 1, 1,   1, 1, 1, 0, 1, //right
            1, 0, 0, 1, 0,   1, 1, 1, 0, 1,   1, 0, 1, 0, 0
            ,
            1, 0, 0, 1, 0,   0, 0, 1, 0, 1,   1, 0, 1, 1, 1, //bottom
            0, 0, 0, 0, 0,   0, 0, 1, 0, 1,   1, 0, 0, 1, 0
            ,
            0, 0, 0, 0, 0,   0, 1, 0, 0, 1,   0, 0, 1, 1, 0, //left
            0, 1, 0, 0, 1,   0, 1, 1, 1, 1,   0, 0, 1, 1, 0
            ,
            0, 1, 1, 1, 1,   1, 1, 1, 0, 1,   0, 0, 1, 1, 0, //back
            1, 1, 1, 0, 1,   1, 0, 1, 0, 0,   0, 0, 1, 1, 0
        ])
    }
    render(){

         
        var rgba = this.color;
        
        

        gl.uniform1i(u_loadTex, this.texNum);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        renderTriangles3DUV(this.cubeVerts32);
        // Pass the position of a point to a_Position variable
        
        /*
        // Pass the color of a point to u_FragColor variable
       
        
        
        //front of cube;
        drawTriangle3D([
            0.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 0.0, 0.0
        ]);
        drawTriangle3D([
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0
        ]);

        gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);

        //top
        drawTriangle3D([
            0, 1, 0,
            0, 1, 1,
            1, 1, 1
        ]);
        drawTriangle3D([
            0, 1, 0,
            1, 1, 1,
            1, 1, 0
        ]);

        gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
        //right side
        drawTriangle3D([
            1, 0, 0,
            1, 1, 0,
            1, 1, 1
        ]);

        drawTriangle3D([
            1, 0, 0,
            1, 1, 1,
            1, 0, 1
        ]);

        //bottom

        gl.uniform4f(u_FragColor, rgba[0] * .7, rgba[1] * .7, rgba[2] * .7, rgba[3]);
        drawTriangle3D([
            1, 0, 0,
            0, 0, 1,
            1, 0, 1
        ]);

        drawTriangle3D([
            0, 0, 0,
            0, 0, 1,
            1, 0, 0
        ]);

        //left side

        drawTriangle3D([
            0, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);

        drawTriangle3D([
            0, 1, 0,
            0, 1, 1,
            0, 0, 1
        ]);

        //back
        gl.uniform4f(u_FragColor, rgba[0] * .5, rgba[1] * .5, rgba[2] * .5, rgba[3]);
        drawTriangle3D([
            0, 1, 1,
            1, 1, 1,
            0, 0, 1
        ]);

        drawTriangle3D([
            1, 1, 1,
            1, 0, 1,
            0, 0, 1
        ]);
        */
    }
}