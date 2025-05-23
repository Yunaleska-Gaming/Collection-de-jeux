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
                        <nav class="site-navigation__back">
                            <ul class="${headerClasses}">
                                
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
