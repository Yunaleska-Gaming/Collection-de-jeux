import { updates } from "./updates.js";

function showChangelogPopup(force = false) {
  const lastSeen = localStorage.getItem("lastSeenUpdate");
  const latestUpdate = updates[0]; // prend le plus récent
  const latestVersion = latestUpdate.version;

  if (!force && lastSeen === latestVersion) return;

  // Détection de la langue (préférence sauvegardée ou navigateur)
  const lang = localStorage.getItem("lang") || (navigator.language.startsWith("fr") ? "fr" : "en");

  const popup = document.createElement("div");
  popup.id = "changelog-popup";
  popup.innerHTML = `
    <div class="changelog-content">
      <h2>Version ${latestUpdate.version} (${latestUpdate.date})</h2>
      <ul class="changelog-section">
        <h3>News</h3>
        ${latestUpdate.messages[lang].features.map(msg => `<li>${msg}</li>`).join("")}
      </ul>
      <ul class="changelog-section" id="corrections">
        <h3>Corrections</h3>
        ${latestUpdate.messages[lang].fixes.map(msg => `<li>${msg}</li>`).join("")}
      </ul>
      <button id="close-changelog">OK</button>
    </div>
  `;

  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("active"), 10);

  document.getElementById("close-changelog").addEventListener("click", () => {
    popup.classList.remove("active");
    setTimeout(() => popup.remove(), 400); // attendre la fin de l’anim

    localStorage.setItem("lastSeenUpdate", latestVersion);
  });
}

// Affiche automatiquement si nouvelle version
document.addEventListener("DOMContentLoaded", () => {
  showChangelogPopup();
});

// Bouton manuel (par ex. dans ton footer)
document.getElementById("see-changelog")?.addEventListener("click", () => {
  showChangelogPopup(true);
});

