function main() {
    // Retrieve <canvas> element <- (1)
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');
    // Draw a blue rectangle <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color
    let v1 = new Vector3([2.25, 2.25, 0]); 
    drawVector(v1, 'red', ctx);


} 
function drawVector(v, color, context){
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(200, 200);
    context.lineTo(20 * v.elements[0] + 200, -20 * v.elements[1] + 200);
    
    context.stroke();

}

function handleDrawEvent(){
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    var ctx = canvas.getContext('2d');

    ctx.fillRect(0, 0, 400, 400);

    var v1X = document.getElementById("v1X").value;
    var v1Y = document.getElementById("v1Y").value;
    var v2X = document.getElementById("v2X").value;
    var v2Y = document.getElementById("v2Y").value;
    var v1 = new Vector3([v1X, v1Y, 0]);
    var v2 = new Vector3([v2X, v2Y, 0]);
    drawVector(v1, "red", ctx);
    drawVector(v2, "blue", ctx);
}

function handleDrawOperationEvent(){
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    var ctx = canvas.getContext('2d');

    ctx.fillRect(0, 0, 400, 400);

    var v1X = document.getElementById("v1X").value;
    var v1Y = document.getElementById("v1Y").value;
    var v2X = document.getElementById("v2X").value;
    var v2Y = document.getElementById("v2Y").value;
    var v1 = new Vector3([v1X, v1Y, 0]);
    var v2 = new Vector3([v2X, v2Y, 0]);
    drawVector(v1, "red", ctx);
    drawVector(v2, "blue", ctx);

    var opType = document.getElementById("opSelect").value;
    var opValue = document.getElementById("scalar").value;
    if(opType == "mul"){
        v1.mul(opValue);
        v2.mul(opValue);
        drawVector(v1, "green", ctx);
        drawVector(v2, "green", ctx);
    }
    else if(opType == "div"){
        v1.div(opValue);
        v2.div(opValue);
        drawVector(v1, "green", ctx);
        drawVector(v2, "green", ctx);
    }
    else if(opType == "add"){
        v1.add(v2);
        drawVector(v1, "green", ctx);
    }
    else if(opType == "sub"){
        v1.sub(v2);
        drawVector(v1, "green", ctx);
    }
	else if(opType == "mag"){
		v1Mag = v1.magnitude();
		v2Mag = v2.magnitude();
		console.log("Magnitude v1: " + v1Mag);
		console.log("Magnitude v2: " + v2Mag);
	}
	else if(opType == "norm"){
		v1.normalize();
		v2.normalize();
		drawVector(v1, "green", ctx);
        drawVector(v2, "green", ctx);
	}
	else if(opType == "ang"){
		angleBetween(v1, v2);
	}
	else if(opType == "tri"){
		areaTriangle(v1, v2);
	}

}

function angleBetween(v1, v2){
	let dot = Vector3.dot(v1, v2);
	let m1 = v1.magnitude();
	let m2 = v2.magnitude();
	
	let cos = dot / (m1 * m2);
	
	let angle = Math.acos(cos) / (Math.PI / 180);
	
	console.log("Angle: " + angle);
}


function areaTriangle(v1, v2){
	let areaP = Vector3.cross(v1, v2).magnitude();
	console.log("Area of the triangle: " + areaP / 2);
}