document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const countdownEl = document.getElementById("countdown");
    const preview = document.getElementById("preview");
    const captureBtn = document.getElementById("captureBtn");
    const continueBtn = document.getElementById("continueBtn");

    const frameCount = parseInt(localStorage.getItem("frameCount")) || 1;
    let photos = [];

    // Access camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            alert("Cannot access camera: " + err);
        });

    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function startCapture() {
        captureBtn.disabled = true;

        const videoHeight = video.videoHeight;
        preview.style.height = `${videoHeight}px`;
        preview.style.setProperty('--frame-count', frameCount);

        for (let i = 1; i <= frameCount; i++) {
            for (let sec = 3; sec > 0; sec--) {
                countdownEl.textContent = `Photo ${i} in ${sec}...`;
                await delay(1000);
            }

            countdownEl.textContent = "Smile! 📸";

            // Capture photo
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL("image/png");

            // Save & show preview
            photos.push(imageData);
            const img = document.createElement("img");
            img.src = imageData;
            img.classList.add("captured-photo");
            preview.appendChild(img); 

            await delay(800);
        }

        countdownEl.textContent = "Done!";
        localStorage.setItem("photos", JSON.stringify(photos)); 
        continueBtn.disabled = false;

        continueBtn.addEventListener("click", () => {
            if (!continueBtn.disabled) {
                window.location.href = "editing.html";
            }
        });
    }

    captureBtn.addEventListener("click", startCapture);
});
