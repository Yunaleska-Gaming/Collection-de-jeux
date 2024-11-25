async function fetchData() {
    try {
        const gamesdata = await fetch('assets/json/games_data.json');
        if (!gamesdata.ok) {
            throw new Error('Fichier indisponible');
        }
        // JSON data
        const games = await gamesdata.json();

        // Affichage du nombre de jeux possédés
        document.getElementById('itemCount').textContent = `${games.length} jeux possédés`;

        // Affichage des jeux 100%
        document.getElementById('games_platined').innerHTML = `<img src="https://zupimages.net/up/23/28/w9k3.png" class="site-sidebar-achievement" /> ${games.filter(game => game.platined).length}/${games.length}`;

        // Retirer les // pour trier les jeux par ordre alphabetique
        //games.sort((a, b) => a.name.localeCompare(b.name));

        // ID du container
        const container = document.getElementById('game_container');

        // Compteur de succès
        let totalEarned = 0;
        let totalPossible = 0;

        // Processing des jeux
        games.forEach(game => {
            const [earned, total] = game.amount_achievement.split('/').map(Number);

            const percent = total > 0 ? (earned / total) * 100 : 0;
            const percentString = `${percent.toFixed()}%`;

            totalEarned += earned;
            totalPossible += total;

            // Création des jeux
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <div class="games-show-steam effect-show-steam ${game.platined ? 'platined-steam' : 'not-platined-steam'}">
                    <img src="assets/images/steam/${game.img_src}" />
                    <div class="mask mask-1"></div>
                    <div class="mask mask-2"></div>
                    <div class="content">
                        <h2>${game.name}</h2>
                        <div class="games-trophies">
                            <div class="achievements-steam-logo ${game.platined ? 'completed-steam' : 'not-completed-steam'}">
                                <div class="amount-achievement-steam">
                                    ${game.amount_achievement}
                                </div>
                                <div class="percent-games-steam">
                                    ${
                                        game.amount_achievement === '0/0' 
                                        ? `<div class="no-achievement-game"></div>` 
                                        : `<div 
                                            class="${percentString === '0%' ? 'zero-percent' : percentString === '100%' ? 'cent-percent' : ''}"
                                            ${percentString !== '0%' && percentString !== '100%' ? `style="width: ${percentString};"` : ''}>
                                            ${percentString}
                                        </div>`
                                    }
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>            
            `;
            container.appendChild(itemDiv);
        });

        const percentCompletion = Number((totalEarned / totalPossible) * 100);
        document.getElementById('percent_completion').textContent = `${percentCompletion.toFixed(2)}%`;
        document.getElementById('achievements_count').innerHTML = `<img src="https://zupimages.net/up/23/28/zq6r.png" class="site-sidebar-achievement" />${totalEarned}/${totalPossible}`;
    } catch (error) {
        console.error('Error fetching the JSON file:', error);
    }
}

// Appel de la fonction
fetchData();