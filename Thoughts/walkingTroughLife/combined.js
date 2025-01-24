const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');

let animationId;

const arrows= {
    points: [], // Array of positions for arrows
    direction: { x: 1, y: 0 }, // Moving right
    arrowSize: 10,
    rows: 10,
    cols: 20,
    speed: 2, // Speed of arrows
};
const walker = {
    path: [],
    x: canvas.width / 2, // Start in the center
    y: canvas.height / 2,
    stepSize: 20, // Random step size
    drift: { enabled: false, strength: 0.1}, // Default: no drift
    vision: { enabled: false, strength: 0.1}, // Vision toggle
}

function isAtWall(newX, newY) {
    return newX <= 0 || newX >= canvas.width || 
           newY <= 0 || newY >= canvas.height;
}

function randomWalkStep() {
    let dx = Math.random() - 0.5;
    let dy = Math.random() - 0.5;

    if (walker.drift.enabled) {
        dx += walker.drift.strength;
    }

    if (walker.vision.enabled) {
        dy += walker.vision.strength;
    }

    const newX = walker.x + dx * walker.stepSize;
    const newY = walker.y + dy * walker.stepSize;

    x = newX;
    y = newY;

    walker.x = newX;
    walker.y = newY;

    return {x, y};
}

function drawPath() {
    ctx.beginPath();
    ctx.moveTo(walker.path[0].x, walker.path[0].y);
    for (let i = 1; i < walker.path.length; i++) {
        ctx.lineTo(walker.path[i].x, walker.path[i].y);
    }
    ctx.strokeStyle = 'blue';
    ctx.stroke();
}

function drawWalker() {
    ctx.beginPath();
    ctx.arc(walker.x, walker.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Draw the vision arrow if enabled
    if (walker.vision.enabled) {
        drawArrow(walker.x, walker.y, 0, walker.vision.strength); // Vision points upward
    }
}

function drawArrow(x, y, dx, dy) {
    const arrowLength = 20; // Length of the arrow
    const angle = Math.atan2(dy, dx); // Direction of the arrow

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Draw the arrow line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(arrowLength, 0);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(arrowLength, 0);
    ctx.lineTo(arrowLength - 5, -5);
    ctx.lineTo(arrowLength - 5, 5);
    ctx.closePath();
    ctx.fillStyle = 'green';
    ctx.fill();

    ctx.restore();
}

function updateWalker(){
    // update point
    const newPoint = randomWalkStep();
    if (newPoint) {
        walker.path.push(newPoint); // add new point to path
    }
}

function updateArrows(){
    arrows.points.forEach(point => {
        // Move point
        point.x += arrows.speed * arrows.direction.x;
        point.y += arrows.speed * arrows.direction.y;
        // Wrap around if point leaves canvas
        if (point.x > canvas.width) point.x = 0;
        if (point.x < 0) point.x = canvas.width;
        if (point.y > canvas.height) point.y = 0;
        if (point.y < 0) point.y = canvas.height;
    });
}

function drawArrows(){
    arrows.points.forEach(point => {
            // Draw arrow
            drawArrow(point.x, point.y,1,0);
    })
}

function updateDrawing() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw path and walker
    drawPath();
    drawWalker();
    if (walker.drift.enabled) {
        // Update arrows 
        updateArrows();
        // draw arrows
        drawArrows();
    }
    drawImageAtPoint(canvas.width / 2 - 35, canvas.height - 45, 70,50);
}
function animate(recusive = true) {
    
    // update walker
    updateWalker();
    if (isAtWall(walker.x, walker.y)) {
        alert('Reached a wall!');
        stopAnimation();
        return none;
    }     
    // if walker did not reach a wall, update drawing
    updateDrawing()
    // Request the next frame if recursive = true
    animationId = requestAnimationFrame(animate);        
    
}

function startAnimation() {
    if (!animationId) {
        // automatically reset if at the end of previous animation
        resetAnimation();
        // start new animation
        animate();
    }
}

function stopAnimation() {
        cancelAnimationFrame(animationId); // Stop the animation
        animationId = null; // Reset the ID
}

function resetAnimation() {
    stopAnimation();
    walker.x = canvas.width / 2;
    walker.y = canvas.height / 2;
    walker.path = [{ x: walker.x, y: walker.y }];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateDrawing();
}

function toggleDrift() {
    walker.drift.enabled = !walker.drift.enabled;
    const driftButton = document.getElementById('driftButton');
    driftButton.textContent = walker.drift.enabled ? 'Drift: ON' : 'Drift: OFF';
    // Draw immediately to show or hide the arrow when toggled
    updateDrawing();
}

function toggleVision() {
    walker.vision.enabled = !walker.vision.enabled;
    const visionButton = document.getElementById('visionButton');
    visionButton.textContent = walker.vision.enabled ? 'Vision: ON' : 'Vision: OFF';
    // Draw immediately to show or hide the arrow when toggled
    updateDrawing();
}


// Create evenly distributed points
for (let row = 0; row < arrows.rows; row++) {
    for (let col = 0; col < arrows.cols; col++) {
        arrows.points.push({ 
            x: (col + 0.5) * (canvas.width / arrows.cols),
            y: (row + 0.5) * (canvas.height / arrows.rows)
        });
    }
}

function drawImageAtPoint(x, y, width = null, height = null) {
    if (goalFlagImage.complete) {
        ctx.drawImage(goalFlagImage, x, y, width, height);
    }
}

const goalFlagImage = new Image();
goalFlagImage.src = 'goalFlag.png'; // Replace with the path to your PNG file
goalFlagImage.onload = function () {
walker.path = [{ x: walker.x, y: walker.y }];
updateDrawing()
};
