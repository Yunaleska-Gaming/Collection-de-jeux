class HeaderElement extends HTMLElement {
    connectedCallback() {
        try {
            const page = window.location.pathname.split('/').pop() || 'index.html';
            let headerClasses = 'site-navigation list';
            let headerIconClass = 'header-icon';

            this.innerHTML = `
                <header class="site-header">
                    <div class="site-navigation limits">
                        <div class="${headerIconClass}"></div>
                         <div class="menu-hamburger">
                            <i class="fa-solid fa-bars icon-bars"></i>
                            <i class="fa-solid fa-xmark icon-close"></i>
                        </div>
                        <nav class="site-navigation__back">
                            <ul class="${headerClasses}">
                                <!-- Sélecteur de langue -->
                                <div class="language-dropdown">
                                    <button class="lang-button" id="lang-toggle">
                                        <i class="fa-solid fa-globe"></i>
                                    </button>
                                    <ul class="lang-menu" id="lang-menu">
                                        <li data-lang="fr">🇫🇷 Français</li>
                                        <li data-lang="en">🇬🇧 English</li>
                                        <li data-lang="pt">🇵🇹 Português</li>
                                    </ul>
                                </div>
                                <div class="dark-options">
                                    <label class="theme-toggle">
                                        <input type="checkbox" id="toggle-theme">
                                        <span class="slider">
                                            <span class="thumb"><i class="fas fa-moon"></i></span>
                                        </span>
                                    </label>
                                </div>
                                <li class="site-navigation__sub-item"><a class="site-navigation link" href="index.html">Index</a></li>
                                <li class="site-navigation__sub-item"><a class="site-navigation link" href="ps3.html">PS3</a></li>
                                <li class="site-navigation__sub-item"><a class="site-navigation link" href="ps4.html">PS4</a></li>
                                <li class="site-navigation__sub-item"><a class="site-navigation link" href="ps5.html">PS5</a></li>
                                <li class="site-navigation__sub-item"><a class="site-navigation link" href="steam.html">Steam</a></li>
                                <li class="site-navigation__sub-item"><a class="site-navigation link" href="nintendo.html">Nintendo</a></li>
                                <li class="site-navigation__sub-item"><a class="site-navigation link" href="retroachievements.html">RetroAchievements</a></li>
                                <li class="site-navigation__sub-item"><a class="site-navigation link" href="wish-list.html">Wishlist</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>
            `;
        } catch (error) {
            console.error('Header rendering failed:', error);
        }
    }
}

customElements.define('custom-header', HeaderElement);

const menuHamburger = document.querySelector(".menu-hamburger");
const menuList = document.querySelector(".list");

menuHamburger.addEventListener("click", () => {
  menuList.classList.toggle("mobile-menu");
  menuHamburger.classList.toggle("active");
});