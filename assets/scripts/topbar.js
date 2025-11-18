class topBar extends HTMLElement {
    connectedCallback() {
        try {
            const page = window.location.pathname.split('/').pop() || 'index.html';
            let topbarClass = 'top-bar';

            this.innerHTML = `
                <div class="${topbarClass}">
                    <div class="top-bar-limits">
                        <button id="open-profile" class="profile-btn" data-i18n-title="profileTitle" title="Yunaleska">
                            <i class="fa-solid fa-user"></i>
                        </button>
                        <div class="language-dropdown">
                            <button class="lang-button" id="lang-toggle" data-i18n-title="langTitle" title="Changer la langue">
                                <i class="fa-solid fa-globe"></i>
                            </button>
                            <ul class="lang-menu" id="lang-menu">
                                <li data-lang="fr">🇫🇷 Français</li>
                                <li data-lang="en">🇬🇧 English</li>
                                <li data-lang="pt">🇵🇹 Português</li>
                            </ul>
                        </div>
                        <button id="see-changelog" data-i18n-title="changelogTitle" title="Voir les nouveautés">
                            <i class="fa-solid fa-newspaper"></i>
                        </button>
                        <div class="dark-options">
                            <label class="theme-toggle">
                                <input type="checkbox" id="toggle-theme">
                                <span class="slider">
                                    <span class="thumb"><i class="fas fa-moon"></i></span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Topbar rendering failed:', error);
        }
    }
}

customElements.define('custom-topbar', topBar);