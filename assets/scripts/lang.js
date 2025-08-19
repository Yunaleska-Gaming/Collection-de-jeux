const translations = {
  fr: {
    welcome: "Présentation",
    firstParagraph: "Bonjour et bienvenue sur ce petit site ! L'intérêt principal de ce dernier est tout simplement de garder une trace et d'exposer ma petite collection de jeux-vidéos, toutes plateformes confondues.",
    secondParagraph: "Je suis Yunaleska, anciennement connu sous le pseudo de Rydia. Je suis une petite streameuse qui aime se lancer des défis sur les jeux mais qui ne souhaite aussi que partager sa passion autour de discussions avec des amis ou même de nouvelles personnes qui pourraient se perdre sur mes lives. Une récompense sur twitch, qui coûte un peu chère je vous l'accorde, pourrait vous permettre de choisir un jeu auquel je jouerais et que je streamerais. Grâce à ce site, vous pouvez donc faire un choix. Ce n'est pas ce qu'il manque.",
    thirdParagraph: "Un discord autour de l'univers du jeu vidéo est ouvert, si jamais vous souhaitez vous incruster ne serait-ce que pour discuter ou trouver des gens avec qui jouer. Vous êtes le ou la bienvenue le temps que vous êtes dans les règles !",
    linkParagraph: "Rejoindre le discord",
    completedChallenges: "Challenges réussis",
    ongoingChallenges: "Challenges en cours",
    pausedChallenges: "Challenges en pause",
    futureChallenges: "Futurs Challenges",
    ongoingGames: "Les jeux en cours",
    subOne: "Abonnement tier 1",
    subTwo: "Abonnement tier 2",
    subThree: "Abonnement tier 3",
    subBadges: "Badges d'abonnement",
    weeklyCalendar: "Calendrier hebdomadaire"
    // Ajoute toutes tes autres clés ici
  },
  en: {
    welcome: "Introduction",
    firstParagraph: "Hello and welcome to my website! The main purpose of it is to keep track and showcase my video-game collection with achievements, on every platform.",
    secondParagraph: "I'm Yunaleska, known before as Rydia. I'm a small streamer who loves challenges on video-games but also just wants to share her passion for gaming while having nice talks with friends or new comers who would join lives. You can redeem channel points on my Twitch, to let you decide the next game I will stream. The website can also be used to see which games I possess to help you make up your mind.",
    thirdParagraph: "A community discord around the whole video-game universe is open. If you ever decide to join us, enjoy speaking with others or are scouting for teammates, know that you're welcome as long as you accept the rules. Any nationality is accepted, but we mainly use french here so if you're not, please let me know. I am currently waiting for more non-french people to create an english section.",
    linkParagraph: "Join on Discord",
    completedChallenges: "Completed Challenges",
    ongoingChallenges: "Ongoing Challenges",
    pausedChallenges: "Paused Challenges",
    futureChallenges: "Future Challenges",
    ongoingGames: "Ongoing Games",
    subOne: "Subscription tier 1",
    subTwo: "Subscription tier 2",
    subThree: "Subscription tier 3",
    subBadges: "Subscription Badges",
    weeklyCalendar: "Weekly schedule"
    // Et les traductions ici
  }
};

function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

function initLanguageSwitcher() {
  const lang = localStorage.getItem('lang') || (navigator.language.startsWith('fr') ? 'fr' : 'en');
  const select = document.getElementById('lang-switcher');
  if (select) {
    select.value = lang;
    select.addEventListener('change', e => setLanguage(e.target.value));
  }
  setLanguage(lang);
}

function setupLanguageGlobeDropdown() {
  const button = document.getElementById('lang-toggle');
  const menu = document.getElementById('lang-menu');

  if (!button || !menu) return;

  button.addEventListener('click', () => {
    const isOpen = menu.style.display === 'block';
    menu.style.display = isOpen ? 'none' : 'block';
  });

  document.querySelectorAll('.lang-menu li').forEach(item => {
    item.addEventListener('click', () => {
      const selectedLang = item.dataset.lang;
      setLanguage(selectedLang);
      menu.style.display = 'none';
    });
  });

  // Fermer le menu si on clique en dehors
  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !menu.contains(e.target)) {
      menu.style.display = 'none';
    }
  });
}


// À lancer après chargement DOM
document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  setupLanguageGlobeDropdown(); // ← ajout ici
});