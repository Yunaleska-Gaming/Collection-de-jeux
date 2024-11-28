// Get the current page's URL
const currentPage = window.location.pathname.split("/").pop();

// Get all navigation links
const navLinks = document.querySelectorAll('.site-navigation__sub-item a');

// Loop through the links and add the "selected" class to the current page link
navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
    link.classList.add('selected');
    }
});