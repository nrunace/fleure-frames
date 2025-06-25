document.addEventListener("DOMContentLoaded", () => {
    const frameImage = document.getElementById('frameImage');
    const photoStrip = document.getElementById('photoStrip');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const frameGroups = document.querySelectorAll('.frame-options-group');
    const frameButtons = document.querySelectorAll('.frame-option');
    const layoutDisplay = document.getElementById("layout-no");
    const continueBtn = document.getElementById("continueBtn");

    const photos = JSON.parse(localStorage.getItem("photos")) || [];
    const selectedLayout = localStorage.getItem('selectedLayout');

    frameGroups.forEach(group => {
        if (group.getAttribute('data-frame') === selectedLayout) {
            group.style.display = 'flex';
        } else {
            group.style.display = 'none';
        }
    });

    let selectedFrame = localStorage.getItem('selectedFrame') || `${selectedLayout}-pink`;
    frameImage.src = `images/${selectedFrame}.png`; 
    localStorage.setItem("selectedFrame", selectedFrame);
    

    // Frame layout coordinates
    const frameLayouts = {
        'f1': [
            { top: '15px', left: '50%', transform: 'translateX(-50%)', width: '190px', height: '130px' },
            { top: '140px', left: '50%', transform: 'translateX(-50%)', width: '190px', height: '130px' },
            { top: '270px', left: '50%', transform: 'translateX(-50%)', width: '190px', height: '130px' },
            { top: '395px', left: '50%', transform: 'translateX(-50%)', width: '190px', height: '130px' }
        ],
        'f2': [
            { top: '15px', left: '50%', transform: 'translateX(-50%)', width: '190px', height: '170px' },
            { top: '185px', left: '50%', transform: 'translateX(-50%)', width: '190px', height: '170px' },
            { top: '355px', left: '50%', transform: 'translateX(-50%)', width: '190px', height: '170px' }
        ],
        'f3': [
            { top: '15px', left: '50%', transform: 'translateX(-50%)', width: '190px', height: '255px' },
            { top: '270px', left: '50%', transform: 'translateX(-50%)', width: '190px', height: '255px' }
        ],
        'f4': [
            { top: '35px', left: '10%', width: '165px', height: '155px' },
            { top: '35px', left: '50%', width: '165px', height: '155px' },
            { top: '195px', left: '10%', width: '165px', height: '155px' },
            { top: '195px', left: '50%', width: '165px', height: '155px' },
            { top: '355px', left: '10%', width: '165px', height: '155px' },
            { top: '355px', left: '50%', width: '165px', height: '155px' }
        ]
    };


    if (selectedLayout && frameLayouts[selectedLayout]) {
        const photoCount = frameLayouts[selectedLayout].length;
        layoutDisplay.textContent = `Layout: ${selectedLayout.toUpperCase()} (${photoCount} photo${photoCount > 1 ? 's' : ''})`;
    }


    // Render photos inside the frame
    function renderPhotos(frameId) {
        photoStrip.innerHTML = '';

        const layoutKey = frameId.split('-')[0];
        const layout = frameLayouts[layoutKey];

        photos.forEach((photo, index) => {
            if (index >= layout.length) return;

            const img = document.createElement('img');
            img.src = photo;
            img.alt = `Photo ${index + 1}`;

            const pos = layout[index];
            Object.assign(img.style, {
                position: 'absolute',
                objectFit: 'cover',
                borderRadius: '5px',
                ...pos
            });

            photoStrip.appendChild(img);
        });
    }

    // Frame Color
    frameButtons.forEach(button => {
        button.addEventListener('click', () => {
            const frameId = button.getAttribute('data-frame-id');
            selectedFrame = frameId;
            localStorage.setItem("selectedFrame", selectedFrame);
            frameImage.src = `images/${selectedFrame}.png`;
            renderPhotos(selectedFrame);
        });
    });

    // Filter Button
    function applyFilter(filter) {
        localStorage.setItem("selectedFilter", filter);
    
        const images = photoStrip.querySelectorAll('img');
        
        images.forEach(img => {
            switch (filter) {
                case 'none':
                    img.style.filter = 'none';
                    break;
                case 'bw':
                    img.style.filter = 'grayscale(100%)';
                    break;
                case 'vintage':
                    img.style.filter = 'sepia(70%) contrast(1.1) brightness(0.9)';
                    break;
                case 'soft':
                    img.style.filter = 'blur(0.5px) brightness(1.5) contrast(0.9) saturate(1.2) sepia(0.2) hue-rotate(340deg)';
                    break;
                default:
                    img.style.filter = 'none';
            }
        });
    }    

    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const filter = event.target.getAttribute('data-filter');
            applyFilter(filter);
        });
    });

    frameImage.onload = () => {
        renderPhotos(selectedFrame);
    };

    continueBtn.addEventListener("click", () => {
        window.location.href = "download.html";
    });
    
});
