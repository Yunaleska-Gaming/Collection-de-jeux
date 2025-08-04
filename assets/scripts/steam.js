// steam.js
import { calculateGameStats, createSteamItem, adjustFontSizes, fetchGamesData } from './utils.js';
import { createFilterButtons, initFilters } from './filter.js';

async function fetchData(platform) {
    try {
        const games = await fetchGamesData(platform);
        document.getElementById('itemCount').innerHTML = `<i class="fa-solid fa-gamepad"></i> ${games.length} jeux possédés`;

        let totalEarned = 0;
        let totalPossible = 0;
        let gamesPlatinedCount = 0;
        let gamesWithAchievementsCount = 0;
        const fragment = document.createDocumentFragment();

        games.forEach(game => {
            const { earned, total, percent } = calculateGameStats(game.amount_achievement);

            if (total > 0) {
                totalEarned += earned;
                totalPossible += total;
                gamesWithAchievementsCount++;
                if (percent === 100) gamesPlatinedCount++;
            }

            const gameItem = createSteamItem(game, percent);
            fragment.appendChild(gameItem);
            updateCompletionTimeline(games);
        });

        document.getElementById('game_container').appendChild(fragment);

        adjustFontSizes();
        createFilterButtons(); // génère les boutons
        initFilters(); // initialise les comportements
        const percentCompletion = totalPossible > 0 
            ? (totalEarned / totalPossible) * 100 
            : 0;
            
        document.getElementById('percent_completion').textContent = `${percentCompletion.toFixed(2)}%`;
        document.getElementById(`percent_completion`).style.width = `${percentCompletion}%`;
        document.getElementById('achievements_count').innerHTML = `<img src="assets/images/steam/icon-achievement.png" class="site-sidebar-achievement"> ${totalEarned}/${totalPossible}`;
        document.getElementById('games_platined').innerHTML = `<img src="assets/images/steam/icon-100.png" class="site-sidebar-achievement"> ${gamesPlatinedCount}/${gamesWithAchievementsCount}`;
    } catch (error) {
        console.error('Error fetching the JSON file:', error);
    }
}

function updateCompletionTimeline(games) {
    const completedGames = games.filter(game => {
        const { earned, total } = calculateGameStats(game.amount_achievement);
        return total > 0 && earned === total;
    });

    const firstGame = completedGames.at(0);
    const lastGame = completedGames.at(-1);

    const firstEl = document.getElementById('first_100');
    const lastEl = document.getElementById('last_100');

    if (firstEl) {
        firstEl.textContent = `Premier 100% : Spyro Reignited Trilogy`;
    }

    if (lastEl) {
        lastEl.textContent = lastGame
            ? `Dernier 100% : ${lastGame.name}`
            : 'Dernier 100% : -';
    }
}


export default fetchData;