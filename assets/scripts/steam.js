// steam.js
import { calculateGameStats, createSteamItem, adjustFontSizes, fetchGamesData } from './utils.js';

async function fetchData(platform) {
    try {
        const games = await fetchGamesData(platform);
        document.getElementById('itemCount').textContent = `${games.length} jeux possédés`;

        let totalEarned = 0;
        let totalPossible = 0;
        let gamesPlatinedCount = 0;
        const fragment = document.createDocumentFragment();

        games.forEach(game => {
            const { earned, total, percent } = calculateGameStats(game.amount_achievement);
            totalEarned += earned;
            totalPossible += total;
            if (percent === 100) gamesPlatinedCount++;

            const gameItem = createSteamItem(game, percent);
            fragment.appendChild(gameItem);
        });

        document.getElementById('game_container').appendChild(fragment);

        adjustFontSizes();

        const percentCompletion = (totalEarned / totalPossible) * 100;
        document.getElementById('percent_completion').textContent = `${percentCompletion.toFixed(2)}%`;
        document.getElementById('achievements_count').innerHTML = `<img src="https://zupimages.net/up/23/28/zq6r.png" class="site-sidebar-achievement" />${totalEarned}/${totalPossible}`;
        document.getElementById('games_platined').innerHTML = `<img src="https://zupimages.net/up/23/28/w9k3.png" class="site-sidebar-achievement" /> ${gamesPlatinedCount}/${games.length}`;
    } catch (error) {
        console.error('Error fetching the JSON file:', error);
    }
}

export default fetchData;