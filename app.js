// 1. Grab the HTML elements
const canvas = document.getElementById('drawingBoard');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');

// 2. Setup drawing variables
let isDrawing = false;

// Set up the pen style
ctx.strokeStyle = '#000000'; // Black ink
ctx.lineWidth = 5;           // Line thickness
ctx.lineCap = 'round';       // Smooth edges

// 3. Drawing Functions
function startDrawing(e) {
    isDrawing = true;
    draw(e); // Start drawing immediately where clicked
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Reset the path so the next line doesn't connect to the old one
}

function draw(e) {
    if (!isDrawing) return;

    // Get exact mouse coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// 4. Event Listeners for the mouse
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing); // Stop if they drag outside the box

// 5. Clear Button Logic
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});