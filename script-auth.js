/**
 * script-auth.js — GreenNest Realty
 * Gestion état connexion Firebase sur toutes les pages
 *
 * VERSION AUTONOME : contient sa propre initialisation Firebase
 * => fonctionne en local (file://) ET en ligne sans dépendre de firebase-config.js
 * => timeout de sécurité : si Firebase ne répond pas en 4s, la page s'affiche quand même
 */

import { initializeApp, getApps }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ─── Config Firebase ─────────────────────────── */
const firebaseConfig = {
  apiKey:            "AIzaSyDb7y807LAXmV2ST_EdA_L-LdBcbc6SKN8",
  authDomain:        "green-nest-realty-immobilier.firebaseapp.com",
  projectId:         "green-nest-realty-immobilier",
  storageBucket:     "green-nest-realty-immobilier.firebasestorage.app",
  messagingSenderId: "1037762102556",
  appId:             "1:1037762102556:web:f78e8d720783bbbdf426d9"
};

/* Initialiser Firebase seulement si pas déjà fait */
const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ─── Pages protégées ─────────────────────────── */
const PROTECTED = ["property.html", "property-details.html"];
const path      = window.location.pathname;
const isProtected = PROTECTED.some(p => path.includes(p));

/* ─── Rendre la page invisible immédiatement sur pages protégées ─── */
if (isProtected) {
  document.body.style.opacity    = "0";
  document.body.style.visibility = "hidden";
}

/* ─── Timeout de sécurité : afficher la page après 4s max ─── */
/* (au cas où Firebase ne répond pas — évite l'écran blanc permanent) */
let authResolved = false;
const safetyTimeout = setTimeout(() => {
  if (!authResolved) {
    console.warn("GreenNest: Firebase auth timeout - affichage de la page par sécurité");
    if (isProtected) {
      /* Si la page est protégée et Firebase ne répond pas, rediriger quand même */
      sessionStorage.setItem("gnr_redirect", window.location.href);
      window.location.replace("login.html");
    } else {
      showPage();
    }
  }
}, 4000);

/* ─── Afficher la page ────────────────────────── */
function showPage() {
  document.body.style.opacity    = "1";
  document.body.style.visibility = "visible";
}

/* ─── Toast utilitaire ───────────────────────── */
function showToast(message, color) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed; bottom:5.5rem; left:50%;
    transform:translateX(-50%);
    background:${color || "#1a6b35"}; color:#fff;
    padding:.875rem 1.5rem; border-radius:999px;
    font-size:.875rem; font-weight:600;
    z-index:99000; opacity:1; transition:opacity .3s;
    white-space:nowrap; box-shadow:0 8px 24px rgba(0,0,0,.25);
    font-family:'DM Sans',system-ui,sans-serif;
  `;
  setTimeout(() => { toast.style.opacity = "0"; }, 3200);
}

/* ─── Mettre à jour tous les boutons Connexion/Déconnexion ─── */
function updateAuthButtons(user) {
  /* Sélectionner tous les boutons d'auth sur la page */
  const btns = document.querySelectorAll(
    "#btnLogin, a.btn-cta[href='login.html'], a.mobile-cta[href='login.html']"
  );

  btns.forEach(btn => {
    if (user) {
      /* Connecté → bouton Déconnexion propre sans style flou */
      btn.innerHTML = `<i class="fas fa-sign-out-alt"></i><span>Déconnexion</span>`;
      btn.setAttribute("href", "#");
      btn.classList.remove("btn-cta");
      btn.classList.add("btn-logout-clean");
      btn.onclick = async (e) => {
        e.preventDefault();
        try {
          await signOut(auth);
          showToast("Déconnecté avec succès 👋");
          setTimeout(() => window.location.href = "index.html", 1200);
        } catch {
          showToast("Erreur lors de la déconnexion", "#dc2626");
        }
      };
    } else {
      /* Non connecté → bouton Connexion */
      btn.innerHTML = `<i class="fas fa-user"></i><span>Connexion</span>`;
      btn.setAttribute("href", "login.html");
      btn.classList.add("btn-cta");
      btn.classList.remove("btn-logout-clean");
      btn.onclick = null;
    }
  });
}

/* ─── Intercepter les clics vers pages protégées ─── */
function setupProtectedLinks() {
  document.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href") || "";
    const goesToProtected = PROTECTED.some(p => href.includes(p));
    if (!goesToProtected) return;

    /* Ajouter l'intercepteur une seule fois */
    if (link.dataset.authGuarded) return;
    link.dataset.authGuarded = "1";

    link.addEventListener("click", (e) => {
      if (!auth.currentUser) {
        e.preventDefault();
        sessionStorage.setItem("gnr_redirect", link.href);
        showToast("Connectez-vous pour accéder aux propriétés 🔒", "#dc2626");
        setTimeout(() => window.location.href = "login.html", 1400);
      }
    });
  });
}

/* ─── Écoute principale Firebase Auth ────────── */
onAuthStateChanged(auth, (user) => {
  authResolved = true;
  clearTimeout(safetyTimeout);

  if (isProtected) {
    if (!user) {
      /* Non connecté sur page protégée → redirection immédiate */
      sessionStorage.setItem("gnr_redirect", window.location.href);
      window.location.replace("login.html");
      return;
    }
    /* Connecté → afficher la page */
    showPage();
  } else {
    /* Page libre → toujours visible */
    showPage();
  }

  updateAuthButtons(user);
  setupProtectedLinks();
});
