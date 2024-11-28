import { createSteamItem, findGame, adjustFontSizes, createPsItem, createSwitchGame, calculateGameStats } from './utils.js';

async function fetchData() {
    try {
        // Fetch index_games.json that lists all games with platform info
        const gamesData = await fetch('./assets/json/index_games.json');
        if (!gamesData.ok) {
            throw new Error('File unavailable');
        }

        const games = await gamesData.json();

        // Create a document fragment to append game items to the DOM
        const fragment = document.createDocumentFragment();

        // Use a for...of loop to handle async operations correctly
        for (const gameInfo of games) {
            const game = await findGame(gameInfo.platform, gameInfo.name);
            switch(gameInfo.platform) {
                case 'steam':
                    const { percent } = calculateGameStats(game.amount_achievement)
                    const steamItem = createSteamItem(game, percent);
                    fragment.appendChild(steamItem);
                    break;
                case 'ds':
                    const dsItem = createDsGame(game);
                    fragment.appendChild(dsItem);
                    break;
                case 'switch':
                    const switchItem = createSwitchGame(game);
                    fragment.appendChild(switchItem);
                    break;
                case 'ps3':
                case 'ps4':
                case 'ps5':
                    const { gameDiv } = createPsItem(game, gameInfo.platform);
                    fragment.appendChild(gameDiv);
                    break;
                default:
                    console.log(`No handler for platform: ${gameInfo.platform}`);
                    break;
            }
        }
        // Now append all the game items at once
        document.getElementById('game_container').appendChild(fragment);

        // Adjust the font sizes based on the game names
        adjustFontSizes();

    } catch (error) {
        console.error('Error fetching the JSON file:', error);
    }
}

export default fetchData;
