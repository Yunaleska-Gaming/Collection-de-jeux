import { fetchGamesData, createPsItem, updateSidebarStatistics, adjustFontSizes } from './utils.js';
import { createFilterButtons, initFilters } from './filter.js';

async function fetchData(platform) {
    try {
        const games = await fetchGamesData(platform);
        const container = document.getElementById('game_container');
        container.innerHTML = '';

        const fragment = document.createDocumentFragment();
        let totalPlatinums = 0;
        let withoutPlatinum = 0;
        let goldObtained = 0, goldTotal = 0;
        let silverObtained = 0, silverTotal = 0;
        let bronzeObtained = 0, bronzeTotal = 0;

        games.forEach(game => {
            const { gameDiv, gameStats } = createPsItem(game, platform);

            bronzeObtained += gameStats.bronze.current;
            bronzeTotal += gameStats.bronze.total;
            silverObtained += gameStats.silver.current;
            silverTotal += gameStats.silver.total;
            goldObtained += gameStats.gold.current;
            goldTotal += gameStats.gold.total;

            if (game.without_platine) withoutPlatinum++;
            if (gameStats.isCompleted && !game.without_platine) totalPlatinums++;
            fragment.appendChild(gameDiv);
        });

        container.appendChild(fragment);
        adjustFontSizes();
        updateSidebarStatistics({
            totalPlatinums,
            withoutPlatinum,
            gamesLength: games.length,
            goldObtained,
            goldTotal,
            silverObtained,
            silverTotal,
            bronzeObtained,
            bronzeTotal
        });
        createFilterButtons();
        initFilters('game_container'); // ou 'game_container_ps4', etc.
    } catch (error) {
        console.error('Error fetching the JSON file:', error);
    }
}

export default fetchData;