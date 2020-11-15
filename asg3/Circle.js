class Circle{
    constructor(){
        this.type = 'circle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = 5;
    }
    render(){

        var xy = this.position; 
        var rgba = this.color;
        var size = this.size;
        
        // Pass the position of a point to a_Position variable
        
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
        var del = this.size/200.0;

        let alpha = 360 / this.segments;
        for(var theta = 0; theta < 360; theta += alpha){
            let centerPt = [xy[0], xy[1]];
            let angle1 = theta;
            let angle2 = theta + alpha;

            let vec1 = [Math.cos(angle1 * Math.PI/180) * del, Math.sin(angle1 * Math.PI/180) * del];
            let vec2 = [Math.cos(angle2 * Math.PI/180) * del, Math.sin(angle2 * Math.PI/180) * del];

            let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
            let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

            drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
        }

    }
}