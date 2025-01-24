const canvas = document.getElementById('randomWalkCanvas');
const ctx = canvas.getContext('2d');
let x = canvas.width / 2;
let y = canvas.height / 2;
let path = [];
let animationId;
let driftAngle = 0;
let stepsize = 20;
let driftEnabled = false;
let driftStrength = 0.1;
let visionEnabled = false;
let visionStrength = 0.1;
let maxSteps = 100 * 12;
let countSteps = 0;

function isAtWall(newX, newY) {
    return newX <= 0 || newX >= canvas.width || 
           newY <= 0 || newY >= canvas.height;
}

function randomWalkStep() {
    let dx = Math.random() - 0.5;
    let dy = Math.random() - 0.5;

    if (driftEnabled) {
        dx += driftStrength * Math.cos(driftAngle);
        dy += driftStrength * Math.sin(driftAngle);
    }

    if (visionEnabled) {
        dy += visionStrength;
    }

    const newX = x + dx * stepsize;
    const newY = y + dy * stepsize;

    if (isAtWall(newX, newY)) {
        alert('Reached a wall!');
        return null;
    }

    if (countSteps > maxSteps) {
        alert('Ran out of steps!');
        return null;
    }
    countSteps += 1;

    x = newX;
    y = newY;

    return { x, y };
}

function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Draw the vision arrow if enabled
    if (visionEnabled) {
        drawArrow(x, y, 0, visionStrength * stepsize); // Vision points upward
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
        path.push(newPoint);
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
    x = canvas.width / 2;
    y = canvas.height / 2;
    path = [{ x, y }];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPath();
}

function toggleDrift() {
    driftEnabled = !driftEnabled;
    const driftButton = document.getElementById('driftButton');
    driftButton.textContent = driftEnabled ? 'Drift: ON' : 'Drift: OFF';

    if (driftEnabled) {
        driftAngle = Math.random() * 2 * Math.PI;
    }
}

function toggleVision() {
    visionEnabled = !visionEnabled;
    const visionButton = document.getElementById('visionButton');
    visionButton.textContent = visionEnabled ? 'Vision: ON' : 'Vision: OFF';
    // Redraw immediately to show or hide the arrow when toggled
    drawPath();
}

path = [{ x, y }];
drawPath();
