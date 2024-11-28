import { fetchGamesData, createPsItem, updateSidebarStatistics, adjustFontSizes } from './utils.js';

async function fetchData(platform) {
    try {
        const games = await fetchGamesData(platform);
        const container = document.getElementById('game_container');
        container.innerHTML = '';

        const fragment = document.createDocumentFragment();
        let totalPlatinums = 0;
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

            if (gameStats.isCompleted) totalPlatinums++;
            fragment.appendChild(gameDiv);
        });

        container.appendChild(fragment);
        adjustFontSizes();
        updateSidebarStatistics({
            totalPlatinums,
            gamesLength: games.length,
            goldObtained,
            goldTotal,
            silverObtained,
            silverTotal,
            bronzeObtained,
            bronzeTotal
        });
    } catch (error) {
        console.error('Error fetching the JSON file:', error);
    }
}

export default fetchData;