// === Génère les boutons dans la page ===
export function createFilterButtons() {
  const container = document.getElementById('filters-container');
  if (!container) return;

  const path = window.location.pathname;
  const isSteamPage = path.includes('steam');
  const isPlaystationPage = path.includes('ps3') || path.includes('ps4') || path.includes('ps5');

  const completionIcon = isSteamPage
    ? `<i class="fa-solid fa-award"></i>`
    : `<i class="fa-solid fa-trophy color-platinum"></i>`;

  const goldTrophyButton = isPlaystationPage
    ? `<button class="filter-btn" data-sort="gold"><i class="fa-solid fa-trophy color-gold"></i></button>`
    : '';

  container.innerHTML = `
    <div class="filters">
      <button class="filter-btn" data-sort="original"><i class="fa-solid fa-arrow-rotate-left"></i></button>
      <button class="filter-btn" data-sort="az"><i class="fa-solid fa-arrow-down-a-z"></i></button>
      <button class="filter-btn" data-sort="za"><i class="fa-solid fa-arrow-up-z-a"></i></button>
      <button class="filter-btn" data-sort="platine" id="filter-completed">${completionIcon}</button>
      ${goldTrophyButton}
    </div>
  `;
}


// === Initialise le tri et les filtres ===
export function initFilters(containerId = "game_container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const originalOrder = Array.from(container.children);
  let platineActive = false;
  let goldActive = false;
  let currentSort = "original"; // pour garder la trace du tri actuel

  function applySortAndFilter() {
    let listToShow = originalOrder;

    if (platineActive) {
      listToShow = listToShow.filter(el =>
        el.classList.contains("platined") ||
        el.classList.contains("platined-steam") ||
        el.classList.contains("platined-retro")
      );
    }

    if (goldActive) {
    listToShow = listToShow.filter(el => el.classList.contains("without-platine"));
    }

    if (currentSort === "az" || currentSort === "za") {
      listToShow = [...listToShow].sort((a, b) => {
        const nameA = a.querySelector('.game-name')?.textContent.toLowerCase() || "";
        const nameB = b.querySelector('.game-name')?.textContent.toLowerCase() || "";
        if (currentSort === "az") return nameA.localeCompare(nameB);
        else return nameB.localeCompare(nameA);
      });
    }

    container.innerHTML = "";
    listToShow.forEach(el => container.appendChild(el));
  }

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const sort = btn.dataset.sort;

      // Reset classes active sur tous les boutons
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));

      if (sort === "platine") {
      platineActive = !platineActive;
      goldActive = false;
      if (platineActive) btn.classList.add("active");
    } else if (sort === "gold") {
      goldActive = !goldActive;
      platineActive = false;
      if (goldActive) btn.classList.add("active");
    } else {
      platineActive = false;
      goldActive = false;
      currentSort = sort;
      btn.classList.add("active");
    }

      // Applique le filtre et le tri combinés
      applySortAndFilter();
    });
  });

  // Optionnel : active le bouton original au démarrage
  const btnOriginal = document.querySelector('.filter-btn[data-sort="original"]');
  if (btnOriginal) btnOriginal.classList.add("active");
}

export function initPlatformFilter() {
  const platformButtons = document.querySelectorAll('[data-platform]');
  const containers = {
    ps1: document.getElementById('game_container_ps1'),
    ps2: document.getElementById('game_container_ps2'),
    psp: document.getElementById('game_container_psp'),
    gc: document.getElementById('game_container_gc')
  };

  let currentPlatform = null;

  platformButtons.forEach(button => {
    button.addEventListener('click', () => {
      const platform = button.dataset.platform;

      // Réinitialiser la classe active sur tous les boutons
      platformButtons.forEach(b => b.classList.remove('active-platform'));

      // Si "Tout afficher" est cliqué
      if (platform === 'all') {
        Object.values(containers).forEach(c => c.style.display = 'flex');
        button.classList.add('active-platform');
        currentPlatform = null;
        return;
      }

      // Si on reclique sur le même bouton (désactive)
      if (currentPlatform === platform) {
        Object.values(containers).forEach(c => c.style.display = 'flex');
        currentPlatform = null;
        return;
      }

      // Appliquer le filtre
      Object.entries(containers).forEach(([key, container]) => {
        container.style.display = key === platform ? 'flex' : 'none';
      });

      // Appliquer la classe active sur le bon bouton
      button.classList.add('active-platform');
      currentPlatform = platform;
    });
  });
}

export function initCompletionFilter() {
  const completionBtn = document.getElementById('filter-completed');
  const containers = {
    ps1: document.getElementById('game_container_ps1'),
    ps2: document.getElementById('game_container_ps2'),
    psp: document.getElementById('game_container_psp'),
    gc: document.getElementById('game_container_gc')
  };

  let isCompletionFilterActive = false;
  let currentPlatform = null;

  // Pour synchroniser avec la plateforme actuelle
  document.querySelectorAll('[data-platform]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPlatform = btn.dataset.platform === 'all' ? null : btn.dataset.platform;
      if (isCompletionFilterActive) {
        // Si un filtre 100% est actif, on le réinitialise à chaque changement de plateforme
        isCompletionFilterActive = false;
        completionBtn.classList.remove('active-completion');
        Object.values(containers).forEach(c => {
          Array.from(c.children).forEach(g => g.style.display = 'flex');
        });
      }
    });
  });

  // Clic sur le bouton "100%"
  completionBtn.addEventListener('click', () => {
    if (!currentPlatform) return; // Aucun filtre actif → rien à faire

    const container = containers[currentPlatform];
    const games = Array.from(container.children);

    if (!isCompletionFilterActive) {
      games.forEach(game => {
        const isCompleted = game.classList.contains('platined-retro') || game.classList.contains('platined-steam') || game.classList.contains('platined');
        game.style.display = isCompleted ? 'flex' : 'none';
      });
      completionBtn.classList.add('active-completion');
    } else {
      games.forEach(game => game.style.display = 'flex');
      completionBtn.classList.remove('active-completion');
    }

    isCompletionFilterActive = !isCompletionFilterActive;
  });
}