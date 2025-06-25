document.addEventListener("DOMContentLoaded", () => {
    const photoStrip = document.getElementById("photoStrip");
    const downloadJPGBtn = document.getElementById("downloadJPG");
    const frameColorButtons = document.querySelectorAll(".frame-color-button");

    const photos = JSON.parse(localStorage.getItem("photos")) || [];
    const selectedFrame = localStorage.getItem("selectedFrame") || "f1-pink";
    const selectedFilter = localStorage.getItem("selectedFilter") || "none";
    const layoutKey = selectedFrame.split("-")[0];

    const gifPreviewVideo = document.getElementById("gifPreviewVideo");
    const downloadGIFBtn = document.getElementById("downloadGIF");

    frameColorButtons.forEach(btn => {
        if (btn.id.startsWith(layoutKey)) {
            btn.style.display = "inline-block";
        } else {
            btn.style.display = "none";
        }
    });

    const frameLayouts = {
        f1: [
            { top: "15px", left: "50%", transform: "translateX(-50%)", width: "175px", height: "105px" },
            { top: "120px", left: "50%", transform: "translateX(-50%)", width: "175px", height: "105px" },
            { top: "225px", left: "50%", transform: "translateX(-50%)", width: "175px", height: "105px" },
            { top: "335px", left: "50%", transform: "translateX(-50%)", width: "175px", height: "105px" }
        ],
        f2: [
            { top: "15px", left: "50%", transform: "translateX(-50%)", width: "175px", height: "140px" },
            { top: "155px", left: "50%", transform: "translateX(-50%)", width: "175px", height: "140px" },
            { top: "300px", left: "50%", transform: "translateX(-50%)", width: "175px", height: "140px" }
        ],
        f3: [
            { top: "15px", left: "50%", transform: "translateX(-50%)", width: "175px", height: "210px" },
            { top: "225px", left: "50%", transform: "translateX(-50%)", width: "175px", height: "210px" }
        ],
        f4: [
            { top: "20px", left: "5%", width: "150px", height: "140px" },
            { top: "20px", left: "50%", width: "150px", height: "140px" },
            { top: "156px", left: "5%", width: "150px", height: "140px" },
            { top: "156px", left: "50%", width: "150px", height: "140px" },
            { top: "295px", left: "5%", width: "150px", height: "140px" },
            { top: "295px", left: "50%", width: "150px", height: "140px" }
        ]
    };

    function getFilterCSS(filter) {
        switch (filter) {
            case 'bw': return 'grayscale(100%)';
            case 'vintage': return 'sepia(70%) contrast(1.1) brightness(0.9)';
            case 'soft': return 'blur(0.5px) brightness(1.5) contrast(0.9) saturate(1.2) sepia(0.2) hue-rotate(340deg)';
            default: return 'none';
        }
    }

    function applyFilterToCanvas(img, filter) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
    
        ctx.filter = getFilterCSS(filter);
    
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
        return canvas;
    }
    
    // ================ JPG ================

    function renderPhotos() {
        photoStrip.innerHTML = "";
        const frameImage = document.getElementById("frameImage");
        const layout = frameLayouts[layoutKey];

        layout.forEach((pos, index) => {
            const img = document.createElement("img");
            img.src = photos[index];
            img.alt = `Photo ${index + 1}`;
            img.style.position = "absolute";
            img.style.objectFit = "cover";
            img.style.borderRadius = "5px";
            img.style.zIndex = "1";

            img.style.top = pos.top;
            img.style.left = pos.left;
            if (pos.transform) img.style.transform = pos.transform;
            img.style.width = pos.width;
            img.style.height = pos.height;

            img.style.filter = getFilterCSS(selectedFilter);

            photoStrip.appendChild(img);

            img.onload = () => console.log(`Loaded Photo ${index + 1}: ${img.src}`);
            img.onerror = () => console.error(`Failed to load photo ${index + 1}: ${img.src}`);
        });

        frameImage.src = `images/${selectedFrame}.png`;
    }

    const frameImage = document.getElementById("frameImage");
    if (frameImage.complete) {
        renderPhotos();
    } else {
        frameImage.onload = renderPhotos;
    }

    downloadJPGBtn.addEventListener("click", () => {
        const original = document.querySelector('.photo-strip-container');

        if (!frameImage.complete) {
            frameImage.onload = () => captureAndDownload();
        } else {
            captureAndDownload();
        }
        
        function captureAndDownload() {
            const frameImg = new Image();
            frameImg.src = frameImage.src;
            frameImg.onload = () => {
                const frameWidth = frameImg.naturalWidth;
                const frameHeight = frameImg.naturalHeight;
                const layout = frameLayouts[layoutKey];
        
                const canvas = document.createElement('canvas');
                canvas.width = frameWidth;
                canvas.height = frameHeight;
                const ctx = canvas.getContext('2d');
        
                ctx.drawImage(frameImg, 0, 0, frameWidth, frameHeight);
        
                let imagesLoaded = 0;
                
                photos.forEach((src, index) => {
                    const layoutData = layout[index];
                    if (!layoutData) return;
                
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = src;
                
                    img.onload = () => {
                        ctx.save();
                        ctx.filter = getFilterCSS(selectedFilter);
                
                        let scale, width, height, top, left;
                        let scaleFactor = 1; // default no scale
                
                        if (layoutKey === "f1") {
                            scale = { w: 2.5, h: 3, top: 4, left: 3.5, offset: 80 };
                            scaleFactor = 1.5;
                        } else if (layoutKey === "f2") {
                            scale = { w: 3.25, h: 3, top: 4, left: 2, offset: 65 };
                            scaleFactor = 1.3;
                        } else if (layoutKey === "f3") {
                            scale = { w: 4.5, h: 3, top: 4, left: -0.5, offset: 90 };
                            scaleFactor = 1.35;
                        } else if (layoutKey === "f4") {
                            scale = { w: 5, h: 4, top: 4, left: 0, offset: 80 };
                            scaleFactor = 1;
                        } else {
                            scale = { w: 3.5, h: 3, top: 4, left: 2, offset: 80};
                            scaleFactor = 1.5;
                        }
                
                        width = parseFloat(layoutData.width) * scale.w * scaleFactor;
                        height = parseFloat(layoutData.height) * scale.h * scaleFactor;
                
                        top = parseFloat(layoutData.top) * scale.top + scale.offset - ((height - (parseFloat(layoutData.height) * scale.h)) / 2);
                        if (layoutKey === "f4") {
                            top -= 90;
                        }
                
                        if (layoutKey === "f4") {
                            if (index % 2 === 0) {
                                left = frameWidth * 0.12 - 100;
                            } else {
                                left = frameWidth * 0.5 + 10;
                            }
                        } else {
                            left = parseFloat(layoutData.left) * scale.left - ((width - (parseFloat(layoutData.width) * scale.w)) / 2);
                        }
                
                        ctx.drawImage(img, left, top, width, height);
                        ctx.restore();
                
                        imagesLoaded++;
                        if (imagesLoaded === photos.length) {
                            ctx.drawImage(frameImg, 0, 0, frameWidth, frameHeight);
                
                            const link = document.createElement("a");
                            link.download = "fleureframes-strip.jpg";
                            link.href = canvas.toDataURL("image/jpeg", 1.0);
                            link.click();
                        }
                    };
                
                    img.onerror = () => {
                        console.error(`Photo ${index + 1} failed to load.`);
                    };
                });                
            };
        
            frameImg.onerror = () => {
                console.error("Frame image failed to load.");
            };
        }        
    });

    // ================ GIF ================
    function getStoredPhotos() {
        const photosJSON = localStorage.getItem("photos");
        return photosJSON ? JSON.parse(photosJSON) : [];
    }

    $('#exampleModalCenter').on('show.bs.modal', async function () {
        const statusMessage = document.getElementById("status-message");
        const gifPreviewVideo = document.getElementById("gifPreviewVideo");

        // Show the "Please wait..." message and hide the video
        statusMessage.style.display = "block";
        gifPreviewVideo.style.display = "none";

        try {
            //Call video generation function
            const videoBlob = await generateVideoFromPhotos(photos, filter);

            // Create blob URL for the generated video
            const videoURL = URL.createObjectURL(videoBlob);
            gifPreviewVideo.src = videoURL;

            // Hide the loading message and show the video
            statusMessage.style.display = "none";
            gifPreviewVideo.style.display = "block";

        } catch (error) {
            console.error("Error generating video:", error);
            statusMessage.innerText = "An error occurred while generating the video.";
        }
    });


    async function generateVideoFromPhotos(photos, filter) {
        const canvas = document.createElement("canvas");
        canvas.width = 1440;
        canvas.height = 1080;
        const ctx = canvas.getContext("2d");

        const loadedImages = await Promise.all(
            photos.map(src => new Promise(resolve => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = src;
            }))
        );

        const stream = canvas.captureStream(60); 
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        const chunks = [];

        recorder.ondataavailable = e => chunks.push(e.data);

        await new Promise(r => setTimeout(r, 200));
        recorder.start();

        // Loop images
        for (let loop = 1; loop <=4 ; loop++) {
            for (const img of loadedImages) {
                /*
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.filter = getFilterCSS(filter);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                await new Promise(r => setTimeout(r, 500)); 
                */

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.filter = "none"; // reset filter to avoid stacking effects
                ctx.drawImage(document.createElement("canvas"), 0, 0); // flush GPU context
                ctx.filter = getFilterCSS(filter); // apply actual filter
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                await new Promise(r => setTimeout(r, 500));
            }
        }

        await new Promise(r => setTimeout(r, 500));
        recorder.stop();

        return new Promise(resolve => {
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: "video/webm" });
                resolve(blob);
            };
        });
    }

    $('#exampleModalCenter').on('show.bs.modal', async function () {
        const statusMessage = document.getElementById("status-message");
        const gifPreviewVideo = document.getElementById("gifPreviewVideo");

        const photos = getStoredPhotos();
        const selectedFilter = localStorage.getItem("selectedFilter") || "none";

        if (photos.length === 0) {
            alert("No photos found in local storage.");
            return;
        }

        statusMessage.style.display = "block";
        statusMessage.innerText = "Please wait, video is generating...";
        gifPreviewVideo.style.display = "none";
        gifPreviewVideo.src = "";

        try {
            const videoBlob = await generateVideoFromPhotos(photos, selectedFilter);
            const videoURL = URL.createObjectURL(videoBlob);
            gifPreviewVideo.src = videoURL;

            gifPreviewVideo.dataset.blobUrl = videoURL;

            statusMessage.style.display = "none";
            gifPreviewVideo.style.display = "block";

        } catch (error) {
            console.error("Error generating video:", error);

            statusMessage.innerText = "An error occurred while generating the video.";
            statusMessage.style.display = "block";

            gifPreviewVideo.style.display = "none";
        }
    });

    // Handle download
    downloadGIFBtn.addEventListener("click", () => {
        const videoURL = gifPreviewVideo.dataset.blobUrl;
        if (!videoURL) return;

        const a = document.createElement("a");
        a.href = videoURL;
        a.download = "fleureframes-video.webm";
        a.click();
    });

    // ================ NEW PHOTOS ================

    document.getElementById("newPhotos").addEventListener("click", () => {
        document.querySelectorAll('.frame-option.selected').forEach(btn => {
            btn.classList.remove('selected');
        });

        localStorage.clear();

        location.href = "index.html";
    });
});
