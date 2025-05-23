// assets/scripts/retroachievements.js

import { fetchGamesData, adjustFontSizes, calculateGameStats, renderPlaystationGames, updatePlaystationGameCount } from './utils.js';

async function fetchData() {
    // Chargement des données
    const ps1Games = await fetchGamesData('ps1');
    const ps2Games = await fetchGamesData('ps2');
    const gcGames = await fetchGamesData('gamecube');

    // Affichage des jeux
    renderPlaystationGames(ps1Games, 'game_container_ps1', 'ps1');
    renderPlaystationGames(ps2Games, 'game_container_ps2', 'ps2');
    renderPlaystationGames(gcGames, 'game_container_gc', 'gc');

    // Mise à jour des compteurs individuels
    updatePlaystationGameCount(ps1Games, 'ps1-count');
    updatePlaystationGameCount(ps2Games, 'ps2-count');
    updatePlaystationGameCount(gcGames, 'gc-count');

    // Statistiques individuelles par plateforme
    updatePerConsoleCompletion(ps1Games, 'ps1');
    updatePerConsoleCompletion(ps2Games, 'ps2');
    updatePerConsoleCompletion(gcGames, 'gc');

    // Statistiques globales (succès, complétion)
    updateAchievementStats([...ps1Games, ...ps2Games, ...gcGames]);

    // Mise en forme
    adjustFontSizes();
    updateCompletionTimeline([...ps1Games, ...ps2Games, ...gcGames]);

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
        achievementsEl.textContent = `${totalEarned} / ${totalPossible} succès obtenus`;
    }
    if (platinedEl) {
        platinedEl.textContent = `${totalCompleted} terminés à 100% / ${games.length} jeux`;
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
        label.textContent = `${completed.length} / ${games.length} jeux terminés`;
    }
}

function updateCompletionTimeline(games) {
    const completedGames = games.filter(game => {
        const { earned, total } = calculateGameStats(game.amount_achievement);
        return total > 0 && earned === total;
    });

    const firstGame = completedGames.at(0);
    const lastGame = completedGames.at(-1);

    const firstEl = document.querySelector('#first_100');
    const lastEl = document.querySelector('#last_100');

    if (firstEl) {
        firstEl.textContent = firstGame ? `Premier 100% : ${firstGame.name}` : 'Premier 100% : -';
    }
    if (lastEl) {
        lastEl.textContent = lastGame ? `Dernier 100% : ${lastGame.name}` : 'Dernier 100% : -';
    }
}


export default fetchData;
