class FooterElement extends HTMLElement {
    connectedCallback() {
        try {
            const page = window.location.pathname.split('/').pop() || 'index.html';
            let ulClasses = 'site-footer social-list';
            let copyrightId = '';
          
            if (page === 'steam.html') {
              ulClasses += ' footer-steam';
              copyrightId = 'copyright-steam';
            } 
            else if (page === 'nintendo.html') {
              ulClasses += ' footer-nintendo';
              copyrightId = 'copyright-nintendo';
            }

            else if (page === 'retroachievements.html') {
              ulClasses += ' footer-retro';
              copyrightId = 'copyright-retro';
            }
          
            this.innerHTML = `
              <footer class="site-footer">
                  <ul class="${ulClasses}">
                      <li class="site-footer-item footer-twitch"><a href="https://www.twitch.tv/yunaleska"></a></li>
                      <li class="site-footer-item footer-youtube"><a href="https://www.youtube.com/@YunaleskaTwitch"></a></li>
                      <li class="site-footer-item footer-twitter"><a href="https://x.com/YunaleskaTwitch"></a></li>
                      <li class="site-footer-item footer-discord"><a href="https://discord.gg/r6M5Y2uuT4"></a></li>
                  </ul>
                  <p class="site-footer copyright" ${copyrightId ? `id="${copyrightId}"` : ''}>
                    © 2024-2025 Yunaleska's Collection Version 1.1. Tous droits réservés.
                  </p>

                  <button id="see-changelog" title="Voir les nouveautés">
                    <i class="fa-solid fa-newspaper"></i>
                  </button>
                  <div id="update-popup" class="popup">
                    <div class="popup-content">
                      <h2 id="popup-title"></h2>
                      <ul id="popup-list"></ul>
                      <button id="close-popup">OK</button>
                    </div>
                  </div>
                  
              </footer>
            `;
          } catch (error) {
            console.error('Footer rendering failed:', error);
          }          
    }
  }
  
  customElements.define('custom-footer', FooterElement);
  