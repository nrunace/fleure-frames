const checkbox = document.getElementById('check');
const icon = document.querySelector('.icon i');

checkbox.addEventListener('change', () => {
    const navLinks = document.getElementById('navLinks');

    // Toggle menu visibility
    navLinks.classList.toggle('show', checkbox.checked);

    icon.classList.remove('fa-bars', 'fa-xmark');

    if (checkbox.checked) {
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.add('fa-bars');
    }
});
