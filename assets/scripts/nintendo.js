// Import reusable functions from utils.js
import { fetchGamesData, updateGameCount, renderGames, adjustFontSizes } from './utils.js';

// Main function that orchestrates the fetching and processing of data
async function fetchData() {
    await fetchAndDisplayGames('ds', 'ds-count', 'game_container_ds');
    await fetchAndDisplayGames('switch', 'switch-count', 'game_container_switch');
    adjustFontSizes();
}

// Generic function to fetch and display games for either DS or Switch
async function fetchAndDisplayGames(platform, countElementId, containerElementId) {
    try {
        const games = await fetchGamesData(platform);  // Use the generalized function
        updateGameCount(games, countElementId);
        renderGames(games, containerElementId, platform);
    } catch (error) {
        console.error(`Error fetching the ${platform} games:`, error);
        document.getElementById(containerElementId).innerHTML = 'Impossible de charger les données.';
    }
}

export default fetchData;