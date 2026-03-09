import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Initialise Firebase Auth
const auth = getAuth();

// Sélection des liens protégés
const protectedLinks = [
  document.getElementById("navProperties"),
  document.getElementById("heroProperties"),
  document.getElementById("allPropertiesBtn"),
  document.getElementById("linkBuy"),
  document.getElementById("linkRent"),
  document.getElementById("linkVillas")
];

// Bouton Connexion / Déconnexion
const btnLogin = document.getElementById("btnLogin");

// Surveille l'état de connexion
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Utilisateur connecté → bouton Déconnexion
    btnLogin.textContent = "Déconnexion";
    btnLogin.href = "#"; // plus de redirection
    btnLogin.classList.add("btn-logout");

    btnLogin.onclick = async (e) => {
      e.preventDefault();
      await signOut(auth);
      showToast("Déconnecté avec succès", "#2e7d32");
      // Le bouton redeviendra Connexion automatiquement grâce à onAuthStateChanged
    };

    // Sécurisation des liens
    protectedLinks.forEach((link) => {
      if (!link) return;
      link.onclick = null; // Si connecté, les liens fonctionnent normalement
    });

  } else {
    // Aucun utilisateur → bouton Connexion
    btnLogin.textContent = "Connexion";
    btnLogin.href = "login.html";
    btnLogin.classList.remove("btn-logout");
    btnLogin.onclick = null;

    // Sécurisation des liens
    protectedLinks.forEach((link) => {
      if (!link) return;
      link.onclick = (e) => {
        e.preventDefault();
        showToast("Veuillez vous connecter ou créer un compte pour accéder à cette page", "#e53935");
      };
    });
  }
});

// Fonction showToast
function showToast(message, color = "#2e7d32") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.background = color;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}