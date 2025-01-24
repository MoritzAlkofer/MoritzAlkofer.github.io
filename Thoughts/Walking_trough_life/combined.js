const canvas = document.getElementById('randomWalkCanvas');
const ctx = canvas.getContext('2d');

let animationId;

const arrows= {
    points: [], // Array of positions for arrows
    direction: { x: 1, y: 0 }, // Moving right
    arrowSize: 10,
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

    if (isAtWall(newX, newY)) {
        alert('Reached a wall!');
        return null;
    }
    x = newX;
    y = newY;

    walker.x = newX;
    walker.y = newY;

    return {x, y};
}

function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(walker.path[0].x, walker.path[0].y);
    for (let i = 1; i < walker.path.length; i++) {
        ctx.lineTo(walker.path[i].x, walker.path[i].y);
    }
    ctx.strokeStyle = 'blue';
    ctx.stroke();

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

function animate() {
    const newPoint = randomWalkStep();
    if (newPoint) {
        walker.path.push(newPoint);
        drawPath();
        animationId = requestAnimationFrame(animate);
    }
}

function startAnimation() {
    if (!animationId) {
        animate();
    }
}

function resetAnimation() {
    cancelAnimationFrame(animationId);
    animationId = null;
    walker.x = canvas.width / 2;
    walker.y = canvas.height / 2;
    walker.path = [{ x: walker.x, y: walker.y }];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPath();
}

function toggleDrift() {
    walker.drift.enabled = !walker.drift.enabled;
    const driftButton = document.getElementById('driftButton');
    driftButton.textContent = walker.drift.enabled ? 'Drift: ON' : 'Drift: OFF';

    if (walker.drift.enabled) {
        driftAngle = Math.random() * 2 * Math.PI;
    }
}

function toggleVision() {
    walker.vision.enabled = !walker.vision.enabled;
    const visionButton = document.getElementById('visionButton');
    visionButton.textContent = walker.vision.enabled ? 'Vision: ON' : 'Vision: OFF';
    // Redraw immediately to show or hide the arrow when toggled
    drawPath();
}

walker.path = [{ x: walker.x, y: walker.y }];
drawPath();
