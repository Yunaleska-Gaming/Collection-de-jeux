// assets/scripts/retroachievements.js

import {
  fetchGamesData,
  adjustFontSizes,
  calculateGameStats,
  renderPlaystationGames,
  updatePlaystationGameCount
} from './utils.js';

import {
  initPlatformFilter,
  initCompletionFilter
} from './filter.js';


const platformNames = {
  ps1: "PS1",
  ps2: "PS2",
  psp: "PSP",
  gc: "GameCube",
  snes: "Super Nintendo",
  gba: "Game Boy Advance",
  ds: "Nintendo DS"
  // Ajoute d'autres plateformes ici si besoin
};

async function fetchData() {
  const ps1Games = await fetchGamesData('ps1');
  const ps2Games = await fetchGamesData('ps2');
  const pspGames = await fetchGamesData('psp');
  const gcGames = await fetchGamesData('gamecube');

  renderPlaystationGames(ps1Games, 'game_container_ps1', 'ps1');
  renderPlaystationGames(ps2Games, 'game_container_ps2', 'ps2');
  renderPlaystationGames(pspGames, 'game_container_psp', 'psp');
  renderPlaystationGames(gcGames, 'game_container_gc', 'gc');

  updatePlaystationGameCount(ps1Games, 'ps1-count');
  updatePlaystationGameCount(ps2Games, 'ps2-count');
  updatePlaystationGameCount(pspGames, 'psp-count');
  updatePlaystationGameCount(gcGames, 'gc-count');

  updatePerConsoleCompletion(ps1Games, 'ps1');
  updatePerConsoleCompletion(ps2Games, 'ps2');
  updatePerConsoleCompletion(pspGames, 'psp');
  updatePerConsoleCompletion(gcGames, 'gc');

  updateAchievementStats([...ps1Games, ...ps2Games, ...pspGames, ...gcGames]);

  adjustFontSizes();
  initPlatformFilter();          // initialise le filtre par plateforme
  initCompletionFilter();        // initialise le filtre des jeux à 100%
}

function updateAchievementStats(games) {
  let totalEarned = 0;
  let totalPossible = 0;
  let totalCompleted = 0;

  games.forEach(game => {
    const { earned, total } = calculateGameStats(game.amount_achievement);
    totalEarned += earned;
    totalPossible += total;
    if (total > 0 && earned === total) totalCompleted++;
  });

  const completionPercent = totalPossible > 0
    ? ((totalEarned / totalPossible) * 100).toFixed(0)
    : 0;

  const achievementsEl = document.getElementById('achievements_count');
  const platinedEl = document.getElementById('games_platined');
  const percentEl = document.getElementById('percent_completion');

  if (achievementsEl) {
    achievementsEl.innerHTML = `<img src="assets/images/retro/icon-achievement.png" class="site-sidebar-achievement"> ${totalEarned} / ${totalPossible} succès obtenus`;
  }
  if (platinedEl) {
    platinedEl.textContent = `${totalCompleted} jeux terminés à 100% / ${games.length} jeux`;
  }
  if (percentEl) {
    percentEl.style.width = `${completionPercent}%`;
    percentEl.textContent = `${completionPercent}%`;
    if (completionPercent === "100") {
      percentEl.setAttribute("data-complete", "true");
    }
  }
}

function updatePerConsoleCompletion(games, platform) {
  const completed = games.filter(game => {
    const { earned, total } = calculateGameStats(game.amount_achievement);
    return total > 0 && earned === total;
  });

  const percent = games.length > 0
    ? ((completed.length / games.length) * 100).toFixed(0)
    : 0;

  const barId = `percent_completion_${platform}`;
  const bar = document.getElementById(barId);
  if (bar) {
    bar.textContent = `${percent}%`;
    bar.style.width = `${percent}%`;
    if (percent === "100") {
      bar.setAttribute("data-complete", "true");
    }
  }

  const labelId = `games_platined_${platform}`;
  const label = document.getElementById(labelId);
  if (label) {
    label.textContent = `${completed.length} / ${games.length} jeux ${platformNames[platform] || platform} terminés`;
  }
}

export default fetchData;
