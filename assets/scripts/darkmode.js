function applyTheme(theme) {
    const body = document.body;
    const checkbox = document.getElementById('toggle-theme');
    const icon = document.querySelector('.theme-toggle .thumb i');

    if (theme === 'dark') {
        body.classList.add('dark');
        if (checkbox) checkbox.checked = true;
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    } else {
        body.classList.remove('dark');
        if (checkbox) checkbox.checked = false;
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    localStorage.setItem('theme', theme);
}

function initTheme() {
    const checkbox = document.getElementById('toggle-theme');
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');

    applyTheme(theme);

    if (checkbox) {
        checkbox.addEventListener('change', () => {
            applyTheme(checkbox.checked ? 'dark' : 'light');
        });
    }
}

document.addEventListener('DOMContentLoaded', initTheme);
