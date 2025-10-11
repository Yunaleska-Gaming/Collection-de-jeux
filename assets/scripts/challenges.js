document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".index-challenges");
  if (!container) return;

  try {
    const response = await fetch("./assets/json/challenges.json");
    const data = await response.json();

    container.innerHTML = ""; // vider avant d'injecter

    const sections = [
      { key: "completed", title: "Challenges réussis", class: "success-title" },
      { key: "ongoing", title: "Challenges en cours", class: "ingame-title" },
      { key: "paused", title: "Challenges en pause", class: "stopped-title" },
      { key: "future", title: "Futurs challenges", class: "future-title" }
    ];

    sections.forEach(section => {
      if (!data[section.key] || data[section.key].length === 0) return;

      // 🔹 Titre de section (sans icône maintenant)
      const h2 = document.createElement("h2");
      h2.className = section.class;
      h2.innerHTML = `<span data-i18n="${section.key}Title">${section.title}</span>`;
      container.appendChild(h2);

      // 🔹 Liste des jeux de cette section
      data[section.key].forEach(gameBlock => {
        const li = document.createElement("li");
        li.className = "index-lists";
        li.textContent = `${gameBlock.game} :`;

        const subUl = document.createElement("ul");
        subUl.className = "index-sublists";

        gameBlock.entries.forEach(entry => {
          const subLi = document.createElement("li");

          // === Déterminer automatiquement l’icône selon la section ===
          let iconClass = "fa-solid fa-circle-question"; // par défaut
          if (section.key === "completed") {
            iconClass = entry.platform === "youtube"
              ? "fa-brands fa-youtube"
              : "fa-solid fa-spinner fa-spin";
          } else if (section.key === "ongoing") {
            iconClass = entry.platform === "twitch"
              ? "fa-brands fa-twitch"
              : "fa-solid fa-spinner fa-spin";
          } else if (section.key === "paused") {
            iconClass = "fa-solid fa-circle-pause";
          } else if (section.key === "future") {
            iconClass = entry.title.toLowerCase().includes("définir")
              ? "fa-solid fa-circle-question"
              : "fa-regular fa-hourglass-half";
          }

          // === Génération du contenu ===
          if (entry.url) {
            const a = document.createElement("a");
            a.href = entry.url;
            a.className = `challenge-link ${
              entry.platform === "youtube"
                ? "youtube-link"
                : entry.platform === "twitch"
                ? "twitch-link"
                : ""
            }`;
            a.innerHTML = `<i class="${iconClass}"></i> ${entry.title}`;
            subLi.appendChild(a);
          } else {
            subLi.innerHTML = `<i class="${iconClass}"></i> ${entry.title}`;
          }

          subUl.appendChild(subLi);
        });

        li.appendChild(subUl);
        container.appendChild(li);
      });
    });
  } catch (err) {
    console.error("Erreur de chargement des challenges :", err);
    container.innerHTML = "<p>Impossible de charger la liste des challenges.</p>";
  }
});
