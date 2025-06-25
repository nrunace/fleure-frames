document.addEventListener("DOMContentLoaded", () => {
    const frameOptions = document.querySelectorAll('.frame-option');
    const continueBtn = document.getElementById('continueBtn');
    let selectedFrame = null;

    const defaultFrames = {
        "f1": "f1-pink",  
        "f2": "f2-pink",  
        "f3": "f3-pink",  
        "f4": "f4-pink"   
    };

    const selectedLayout = localStorage.getItem('selectedLayout') || "f1"; 
    selectedFrame = defaultFrames[selectedLayout] || "f1-pink";  

    const defaultFrameOption = document.querySelector(`#${selectedFrame}`);
    if (defaultFrameOption) {
        defaultFrameOption.classList.add('selected');
    }

    localStorage.setItem('selectedFrame', selectedFrame);

    frameOptions.forEach(option => {
        option.addEventListener('click', () => {
            frameOptions.forEach(opt => opt.classList.remove('selected'));

            option.classList.add('selected');

            const poses = option.getAttribute('data-poses');
            const layout = option.getAttribute('data-layout');

            const layoutMap = {
                "f1": "f1",
                "f2": "f2",
                "f3": "f3",
                "f4": "f4"
            };

            const selectedLayout = layoutMap[layout] || "f1";  
            selectedFrame = `${selectedLayout}-${option.getAttribute('data-frame-color')}`;

            localStorage.setItem('frameCount', poses);
            localStorage.setItem('selectedFrame', selectedFrame);
            localStorage.setItem('selectedLayout', selectedLayout); 

            continueBtn.disabled = false;
        });
    });

    continueBtn.addEventListener('click', () => {
        if (selectedFrame) {
            window.location.href = "camera.html";
        }
    });

    selectedFrame = localStorage.getItem('selectedFrame');
    if (selectedFrame) {
        // Only mark as selected if still stored
        const selectedButton = document.querySelector(`[data-frame-id="${selectedFrame}"]`);
        selectedButton?.classList.add('selected');
    }
});
