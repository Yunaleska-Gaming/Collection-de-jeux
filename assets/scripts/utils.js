
export function calculateGameStats(amountAchievement) {
    const [earned, total] = amountAchievement.split('/').map(Number);
    const percent = total > 0 ? (earned / total) * 100 : 0;
    return { earned, total, percent };
}

export function createSteamItem(game, percent) {
    const percentString = `${percent.toFixed()}%`;

    const gameDiv = document.createElement('div');

    gameDiv.classList.add(
        'games-show-steam', 
        'effect-show-steam', 
        percent === 100 ? 'platined-steam' : 'not-platined-steam'
    );
    
    gameDiv.innerHTML = `
        <img src="assets/images/steam/${game.img_src}" alt="${game.name}" />
        <div class="mask mask-1"></div>
        <div class="mask mask-2"></div>
        <div class="content">
            <h2 class="game-name">${game.name}</h2>
            <div class="games-trophies">
                <div class="achievements-steam-logo ${percent === 100 ? 'completed-steam' : 'not-completed-steam'}">
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
    `;
    
    return gameDiv;
}

export async function fetchGamesData(platform) {
    const filePath = `./assets/json/${platform}_data.json`;
    const response = await fetch(filePath);

    if (!response.ok) throw new Error('File unavailable');
    return await response.json();
}

export function createPsItem(game, platform) {
    const gameStats = {
        bronze: parseTrophies(game.bronze_trophies, game.bronze_trophies_dlc),
        silver: parseTrophies(game.silver_trophies, game.silver_trophies_dlc),
        gold: parseTrophies(game.gold_trophies, game.gold_trophies_dlc),
        isCompleted: checkTrophyCompletion([game.bronze_trophies, game.silver_trophies, game.gold_trophies])
    };

    const isWithoutPlatine = game.without_platine || false;

    const className = (isWithoutPlatine && game.date_platined && 
        (game.date_platined.includes("Pas de trophées") || game.date_platined.includes("100% le")))
        ? 'without-platine'
        : (gameStats.isCompleted ? 'platined' : 'not-platined');

    const gameDiv = document.createElement('div');
    gameDiv.className = `games-show effect-show ${className}`;
    gameDiv.innerHTML = buildGameHTML(game, platform, gameStats);

    return { gameDiv, gameStats };
}

function parseTrophies(baseTrophy, dlcTrophy) {
    const base = parseSingleTrophy(baseTrophy);
    const dlc = parseSingleTrophy(dlcTrophy);
    return { current: base.current + dlc.current, total: base.total + dlc.total };
}

function parseSingleTrophy(trophy) {
    const [current, total] = trophy.split('/').map(Number);
    return { current: current || 0, total: total || 0 };
}

function checkTrophyCompletion(baseTrophies) {
    const allZeroTrophies = baseTrophies.every(trophy => {
        const { current, total } = parseSingleTrophy(trophy);
        return current === 0 && total === 0;
    });

    if (allZeroTrophies) {
        return false;
    }

    return baseTrophies.every(trophy => {
        const { current, total } = parseSingleTrophy(trophy);
        if (total === 0) {
            return current === 0;
        }
        return current === total;
    });
}


function hasDlcTrophies(game) {
    return (
        game.bronze_trophies_dlc !== '0/0' ||
        game.silver_trophies_dlc !== '0/0' ||
        game.gold_trophies_dlc !== '0/0'
    );
}

function buildGameHTML(game, platform, stats) {
    const { isCompleted } = stats;
    const hasDlc = hasDlcTrophies(game);

    const platineSection = game.without_platine
        ? `<div class="trophies-pictures no-platine-picture"></div> 0/0`
        : `<div class="trophies-pictures platine-picture"></div> ${isCompleted ? '1/1' : '0/1'}`;

    return `
        <img src="assets/images/${platform}/${game.img_src}" alt="${game.name}" />
        <div class="mask mask-1"></div>
        <div class="mask mask-2"></div>
        <div class="content">
            <h2 class="game-name">${game.name}</h2>
            <div class="games-trophies">
                ${platineSection}
                <div class="trophies-pictures gold-picture"></div> ${game.gold_trophies}
                <div class="trophies-pictures silver-picture"></div> ${game.silver_trophies}
                <div class="trophies-pictures bronze-picture"></div> ${game.bronze_trophies}
            </div>
            <div class="date-platined">${game.date_platined ? `${game.date_platined}` : 'Platine non obtenu'}</div>
            ${hasDlc ? buildDlcHTML(game) : ''}
        </div>
    `;
}

function buildDlcHTML(game) {
    return `
        <h2>DLC</h2>
        <div class="games-trophies">
            <div class="trophies-pictures gold-picture"></div> ${game.gold_trophies_dlc}
            <div class="trophies-pictures silver-picture"></div> ${game.silver_trophies_dlc}
            <div class="trophies-pictures bronze-picture"></div> ${game.bronze_trophies_dlc}
        </div>
    `;
}


export function updateSidebarStatistics({ totalPlatinums, withoutPlatinum, gamesLength, goldObtained, goldTotal, silverObtained, silverTotal, bronzeObtained, bronzeTotal }) {
    const updateElement = (id, value, percent) => {
        document.getElementById(`${id}Count`).innerHTML = value;
        document.getElementById(`${id}Percent`).textContent = `${percent}%`;
        document.getElementById(`${id}Percent`).style.width = `${percent}%`;
    };

    updateElement('platine', `<div class="trophies-pictures platine-picture"></div> ${totalPlatinums}/${gamesLength - withoutPlatinum}`, ((totalPlatinums / (gamesLength - withoutPlatinum)) * 100).toFixed(2));
    updateElement('gold', `<div class="trophies-pictures gold-picture"></div> ${goldObtained}/${goldTotal}`, ((goldObtained / goldTotal) * 100).toFixed(2));
    updateElement('silver', `<div class="trophies-pictures silver-picture"></div> ${silverObtained}/${silverTotal}`, ((silverObtained / silverTotal) * 100).toFixed(2));
    updateElement('bronze', `<div class="trophies-pictures bronze-picture"></div> ${bronzeObtained}/${bronzeTotal}`, ((bronzeObtained / bronzeTotal) * 100).toFixed(2));
    document.getElementById('totalCount').textContent = `${totalPlatinums + goldObtained + silverObtained + bronzeObtained}/${(gamesLength - withoutPlatinum) + goldTotal + silverTotal + bronzeTotal}`;
    document.getElementById('itemCount').textContent = `${gamesLength} jeux possédés`;
}

export function updateGameCount(games, countElementId) {
    let gameType = '';

    if (countElementId === 'ds-count') {
        gameType = 'DS/3DS';
    } else if (countElementId === 'switch-count') {
        gameType = 'Switch';
    }

    document.getElementById(countElementId).textContent = `${games.length} jeux ${gameType} possédés`;
}

export function renderGames(games, containerElementId, platform) {
    const fragment = document.createDocumentFragment();
    games.forEach(game => {
        const gameElement = platform === 'ds' ? createDsGame(game) : createSwitchGame(game);
        fragment.appendChild(gameElement);
    });
    document.getElementById(containerElementId).appendChild(fragment);
}

export function createDsGame(game) {
    return createNintendoItem(game, 'ds-nintendo', 'effect-show-nintendo');
}

export function createSwitchGame(game) {
    return createNintendoItem(game, 'switch-nintendo', 'effect-show-switch');
}

function createNintendoItem(game, platformClass, effectClass) {
    const gameDiv = document.createElement('div');
    const completionDivs = game.completions.map(completion => `<div class="completion-nintendo">${completion}</div>`).join('');

    const platformClassName = platformClass === 'ds-nintendo' ? 'games-show-nintendo' : platformClass === 'switch-nintendo' ? 'games-show-switch' : '';

    gameDiv.className = `${platformClassName} ${effectClass} ${platformClass}`
    gameDiv.innerHTML = `
            <img src="${game.img_src}" alt="${game.name}" />
            <div class="mask mask-1"></div>
            <div class="mask mask-2"></div>
            <div class="content">
                <h2 class="game-name">${game.name}</h2>
                <div class="games-trophies">
                    ${completionDivs}
                </div>
            </div>
    `;
    
    return gameDiv;
}

export async function findGame(platform, gameName) {
    try {
        const games = await fetchGamesData(platform);
        const game = games.find(game => game.name.toLowerCase() === gameName.toLowerCase());
        
        return game || null;
    } catch (error) {
        console.error(`Error fetching game data for platform ${platform}:`, error);
        return null;
    }
}

export function adjustFontSizes() {
    document.querySelectorAll('.game-name').forEach(element => {
        const length = element.textContent.length;
        element.style.fontSize = length > 20 ? '13px' : length > 15 ? '14px' : length > 10 ? '15px' : '16px';
    });
}