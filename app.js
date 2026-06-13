// 0. Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyByIKx3kYZXZTafp-K8-AuVoNYeI7A33NY",
  authDomain: "nurik-hackathon-june-202-13171.firebaseapp.com",
  projectId: "nurik-hackathon-june-202-13171",
  storageBucket: "nurik-hackathon-june-202-13171.firebasestorage.app",
  messagingSenderId: "779730032331",
  appId: "1:779730032331:web:52e99a230f74f076502d4e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 1. Grab the HTML elements
const canvas = document.getElementById('drawingBoard');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');

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

// 6. Save Button Logic
saveBtn.addEventListener('click', async () => {
    saveBtn.innerText = "Saving...";
    saveBtn.disabled = true;

    // Convert the canvas image to a file (blob)
    canvas.toBlob(async (blob) => {
        try {
            // Create a unique filename based on the current time
            const filename = `drawing_${Date.now()}.png`;
            const storageRef = ref(storage, `gallery/${filename}`);
            
            // Upload the file to Cloud Storage
            await uploadBytes(storageRef, blob);

            // Get the public URL of the uploaded image
            const downloadURL = await getDownloadURL(storageRef);

            // Save this URL to the database (Firestore)
            await addDoc(collection(db, "artworks"), {
                imageUrl: downloadURL,
                timestamp: new Date()
            });

            // Return the button to its normal state
            saveBtn.innerText = "Saved!";
            setTimeout(() => {
                saveBtn.innerText = "Save to Firebase";
                saveBtn.disabled = false;
            }, 2000);

        } catch (error) {
            console.error("Error saving:", error);
            saveBtn.innerText = "Error! Check the console.";
        }
    }, 'image/png'); // We want .png
});