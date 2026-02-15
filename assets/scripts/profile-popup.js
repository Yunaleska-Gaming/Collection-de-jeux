document.addEventListener("DOMContentLoaded", () => {

  // --- 1) Trouver le bouton dans le header ---
  const btn = document.getElementById("open-profile");
  if (!btn) return;

  // --- 2) Construire la popup ---
  const popup = document.createElement("div");
  popup.id = "profile-popup";
  popup.className = "popup";
  popup.innerHTML = `
    <div class="profile-popup-content">

      <button id="close-profile" class="close-popup-btn">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="profile-banner"></div>

      <div class="profile-header">
        <img src="assets/images/avatar-profile.png" class="profile-avatar" alt="Avatar">
        <h2 class="profile-name">Yunaleska</h2>
        <p class="profile-desc">
          <span data-i18n="profileVGlover">Passionnée de jeux vidéo</span> 
          <span>•</span> 
          <span data-i18n="profileHunter">Chasseuse de trophées & succès</span>
          <span>•</span> 
          <span data-i18n="profileDev">Développeuse web & graphiste indépendante</span>
          <span>•</span>
          <span data-i18n="profileCreator">Créatrice d’overlays et de contenus</span>
        </p>
      </div>

      <h3 class="profile-subtitle" data-i18n="profileStatsTitle">Statistiques globales</h3>
      <ul class="profile-stats">
        <li><span data-i18n="profileGames">Jeux</span> <span id="stat-games">—</span></li>
        <li><span data-i18n="profileTrophies">Trophées</span> <span id="stat-trophies">—</span></li>
        <li><span data-i18n="profileAchiev">Succès Steam</span> <span id="stat-steam">—</span></li>
        <li><span data-i18n="profileRetro">Succès Retro</span> <span id="stat-ra">—</span></li>
        <li><span data-i18n="profileProgress">Progression générale :</span> <span id="stat-percent">—%</span>
          <div class="global-progress-bar">
              <div id="global-progress-fill"></div>
          </div>
        </li>
        
      </ul>

      <h3 class="profile-subtitle" data-i18n="profileChall">Défis préférés</h3>
      <ul class="profile-challenges">
        <li><i class="fa-solid fa-fire-flame-curved"></i> No Save No Damage</li>
        <li><i class="fa-solid fa-fire-flame-curved"></i> Knife Only</li>
        <li><i class="fa-solid fa-fire-flame-curved"></i> No Pictos No Luminas</li>
        <li><i class="fa-solid fa-fire-flame-curved"></i> Akumu Mode</li>
      </ul>

      <h3 class="profile-subtitle" data-i18n="profileLinks">Liens</h3>
      <div class="profile-links">
        <a href="https://www.twitch.tv/yunaleska"><i class="fa-brands fa-twitch"></i> Twitch</a>
        <a href="https://www.youtube.com/@YunaleskaTwitch"><i class="fa-brands fa-youtube"></i> YouTube</a>
        <a href="https://discord.gg/r6M5Y2uuT4"><i class="fa-brands fa-discord"></i> Discord</a>
        <a href="https://steamcommunity.com/id/Yunaleska"><i class="fa-brands fa-steam"></i> Steam</a>
      </div>

    </div>
  `;
  document.body.appendChild(popup);

  // --- 3) Ouvrir / fermer ---
  btn.addEventListener("click", () => {
    popup.classList.add("active");
  });

  document.addEventListener("click", (e) => {
    if (
      e.target.id === "close-profile" ||
      e.target.closest("#close-profile") ||
      e.target === popup
    ) {
      popup.classList.remove("active");
    }
  });

  // --- 3) STATS ---

  async function computeStats() {
    let totalGames = 0;
    let totalTrophies = 0;
    let totalSteam = 0;
    let totalRA = 0;
    let globalProgressList = [];

    const pushProgress = (earned, total) => {
      if (total > 0) {
        const percent = Math.round((earned / total) * 100);
        globalProgressList.push(percent);
      }
    };

    

    // --- PLAYSTATION (ps3/ps4/ps5) ---
    const psConsoles = [
      "ps3", 
      "ps4", 
      "ps5"
    ];
    for (const consoleName of psConsoles) {
      try {
        const res = await fetch(`./assets/json/${consoleName}_data.json`);
        if (!res.ok) continue;
        const games = await res.json();
        totalGames += games.length;

        games.forEach(game => {
          const b = (game.bronze_trophies || "0/0").split("/"); 
          const s = (game.silver_trophies || "0/0").split("/"); 
          const g = (game.gold_trophies || "0/0").split("/");
          const bdlc = (game.bronze_trophies_dlc || "0/0").split("/"); 
          const sdlc = (game.silver_trophies_dlc || "0/0").split("/"); 
          const gdlc = (game.gold_trophies_dlc || "0/0").split("/");
          
          let earned = (
            Number(b[0]) + Number(s[0]) + Number(g[0]) +
            Number(bdlc[0]) + Number(sdlc[0]) + Number(gdlc[0])
          );

          let total = (
            Number(b[1]) + Number(s[1]) + Number(g[1]) +
            Number(bdlc[1]) + Number(sdlc[1]) + Number(gdlc[1])
          );

          // 🔥 AJOUT DES PLATINES
          const isPlatined = game.date_platined && !game.without_platine;
          // ⭐⭐ INSERTION DU DEBUG ICI ⭐⭐
          if (isPlatined) {
            console.log("Platine détecté :", game.name);
          } else if (
            game.date_platined && 
            game.date_platined.toLowerCase().includes("plat")
          ) {
            console.warn("❌ Platine NON détecté :", game.name, game.date_platined);
          }
          // ⭐⭐ FIN DU DEBUG ⭐⭐

          if (isPlatined) {
            earned += 1;
            total += 1;
          }

          totalTrophies += earned;
          pushProgress(earned, total);
        });
      } catch (err) {
        console.warn(`Erreur PS (${consoleName})`, err);
      }
    }

    // --- STEAM ---
    try {
      const res = await fetch(`./assets/json/steam_data.json`);
      if (res.ok) {
        const steamGames = await res.json();
        totalGames += steamGames.length;

        steamGames.forEach(game => {
          const [earned, total] = (game.amount_achievement || "0/0").split("/").map(Number);
          totalSteam += Number(earned || 0);
          pushProgress(earned || 0, total || 0);
        });
      }
    } catch (err) {
      console.warn("Erreur Steam:", err);
    }

    // --- RETRO (ps1/ps2/psp/gamecube) ---
    const retroFiles = [
      "ps1_data.json",
      "ps2_data.json",
      "psp_data.json",
      "gamecube_data.json"
    ];

    for (const file of retroFiles) {
      try {
        const res = await fetch(`./assets/json/${file}`);
        if (!res.ok) continue;
        const games = await res.json();
        totalGames += games.length;

        games.forEach(game => {
          const [earned, total] = (game.amount_achievement || "0/0").split("/").map(Number);
          totalRA += Number(earned || 0);
          pushProgress(earned || 0, total || 0);
        });
      } catch (err) {
        console.warn(`Erreur Retro (${file})`, err);
      }
    }

    // --- CALCUL GLOBAL ---
    const globalPercent =
      globalProgressList.length > 0
        ? Math.round(globalProgressList.reduce((a, b) => a + b, 0) / globalProgressList.length)
        : 0;

    // --- INJECT DANS LA POPUP ---
    const put = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    put("stat-games", totalGames);
    put("stat-trophies", totalTrophies);
    put("stat-steam", totalSteam);
    put("stat-ra", totalRA);
    put("stat-percent", globalPercent + "%");

    // --- ANIMATION DE LA BARRE (fait ici, avec la valeur calculée) ---
    const bar = document.getElementById("global-progress-fill");
    if (bar) {
      // reset (au cas où)
      bar.style.width = "0%";
      // animate on next frame so transition is visible
      requestAnimationFrame(() => {
        bar.style.width = (Number(globalPercent) || 0) + "%";
        // accessibilité / attribut utile
        bar.setAttribute("aria-valuenow", String(globalPercent));
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");
      });
    }
  }

  computeStats();
});
