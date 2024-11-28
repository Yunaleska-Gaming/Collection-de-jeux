import { adjustFontSizes } from './utils.js';

export async function fetchWishData(platform) {
    const filePath = `./assets/json/wishlist/${platform}_wishlist.json`;
    const response = await fetch(filePath);

    if (!response.ok) throw new Error('File unavailable');
    return await response.json();
}

export async function createWishItem(platform) {
    try {
        // Fetch JSON data using the provided platform (ps4, ps5, etc.)
        const gamesData = await fetchWishData(platform);
        
        // Get the container where games will be displayed
        const wishContainer = document.getElementById(`${platform}-container`); // Assuming each platform has its own container
        
        // Clear the container before appending new games (optional if you need to clear it)
        wishContainer.innerHTML = '';

        // Check if gamesData is empty
        if (gamesData.length === 0) {
            // If the gamesData is empty, show the "no games" message
            wishContainer.innerHTML = `
                <div class="no-wished-game-background">
                    <div class="no-wished-game">
                        Pas de jeux actuellement.
                    </div>
                </div>
            `;
            return; // Exit the function early
        }

        // Create a DocumentFragment to hold all the game divs before appending them
        const fragment = document.createDocumentFragment();
        
        // Iterate over the games and build HTML components
        gamesData.forEach(game => {
            // Create the main div for the game and apply the necessary classes
            const gameDiv = document.createElement('div');

            const gamePlatform = game.platform || 'steam';

            let platformClassName = `games-show-${gamePlatform} effect-show-${gamePlatform} not-platined-${gamePlatform}`;
            
            gameDiv.className = platformClassName;
            
            // Set the innerHTML for the game div using template literals
            gameDiv.innerHTML = `
                <img src="assets/images/${gamePlatform}/${game.img_src}" alt="${game.name}" />
                <div class="mask mask-1"></div>
                <div class="mask mask-2"></div>
                <div class="content">
                    <h2 class="game-name">${game.name}</h2>
                    <div class="games-trophies">
                        ${game.text.replace('\n', '<br />')}
                    </div>
                </div>
            `;
            
            // Append the game div to the fragment
            fragment.appendChild(gameDiv);
        });
        
        // Finally, append the fragment to the wishContainer
        wishContainer.appendChild(fragment);
        adjustFontSizes();
    } catch (error) {
        console.error('Error fetching or processing the data:', error);
    }
}

export default createWishItem;