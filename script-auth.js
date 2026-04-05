/**
 * script-auth.js — GreenNest Realty
 * Gestion état connexion Firebase sur toutes les pages
 *
 * Logique :
 * - Pages libres : index, about, contact, login, register
 * - Pages protégées : property.html, property-details.html
 *   → Si non connecté : redirection IMMÉDIATE vers login.html
 *   → Les liens vers pages protégées sont aussi interceptés
 */

import { getAuth, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);

/* ─── Pages protégées ─────────────────────────── */
const PROTECTED_PAGES = ["property.html", "property-details.html"];

const currentPage = window.location.pathname;
const isProtected = PROTECTED_PAGES.some(p => currentPage.includes(p));

/* ─── Masquer le body immédiatement sur pages protégées ─── */
if (isProtected) {
  document.documentElement.style.visibility = "hidden";
}

/* ─── Toast utilitaire ───────────────────────── */
function showToast(message, color = "#1a6b35") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    Object.assign(toast.style, {
      position: "fixed", bottom: "5.5rem", left: "50%",
      transform: "translateX(-50%) translateY(0)",
      background: color, color: "#fff", padding: "0.875rem 1.5rem",
      borderRadius: "999px", fontSize: "0.875rem", fontWeight: "600",
      zIndex: "99000", opacity: "0", transition: "opacity 0.3s",
      whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
    });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.background = color;
  toast.style.opacity = "1";
  setTimeout(() => { toast.style.opacity = "0"; }, 3200);
}

/* ─── Mettre à jour le bouton Connexion/Déconnexion ─── */
function updateAuthButton(user) {
  /* Sélectionner tous les boutons #btnLogin sur la page
     (desktop + mobile peuvent avoir le même ID ou des classes) */
  const loginBtns = document.querySelectorAll("#btnLogin, .btn-cta[href='login.html'], .mobile-cta[href='login.html']");

  loginBtns.forEach(btn => {
    if (user) {
      /* --- Connecté : afficher Déconnexion --- */
      btn.innerHTML = `<i class="fas fa-sign-out-alt"></i><span>Déconnexion</span>`;
      btn.href = "#";
      btn.style.background = "rgba(239,68,68,0.15)";
      btn.style.color = "var(--text)";
      btn.style.border = "2px solid rgba(239,68,68,0.3)";
      btn.onclick = async (e) => {
        e.preventDefault();
        try {
          await signOut(auth);
          showToast("Déconnecté avec succès 👋");
          setTimeout(() => window.location.href = "index.html", 1200);
        } catch (err) {
          showToast("Erreur lors de la déconnexion", "#dc2626");
        }
      };
    } else {
      /* --- Non connecté : afficher Connexion --- */
      btn.innerHTML = `<i class="fas fa-user"></i><span>Connexion</span>`;
      btn.href = "login.html";
      btn.style.background = "";
      btn.style.color = "";
      btn.style.border = "";
      btn.onclick = null;
    }
  });

  /* Afficher le nom de l'utilisateur si un élément #userName existe */
  const userNameEl = document.getElementById("userName");
  if (userNameEl) {
    userNameEl.textContent = user ? (user.displayName || user.email.split("@")[0]) : "";
    userNameEl.style.display = user ? "inline" : "none";
  }
}

/* ─── Intercepter les liens vers pages protégées ─── */
function setupProtectedLinks() {
  /* Tous les liens qui pointent vers property.html (quelle que soit la query string) */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isToProtected = PROTECTED_PAGES.some(p => href.includes(p));
    if (!isToProtected) return;

    link.addEventListener('click', (e) => {
      /* Vérifier l'état actuel de l'auth de façon synchrone via currentUser */
      if (!auth.currentUser) {
        e.preventDefault();
        /* Mémoriser la destination pour redirect après login */
        sessionStorage.setItem('gnr_redirect', link.href);
        showToast("Connectez-vous pour accéder aux propriétés 🔒", "#dc2626");
        setTimeout(() => window.location.href = "login.html", 1500);
      }
      /* Si connecté, laisser le lien fonctionner normalement */
    });
  });
}

/* ─── Écoute principale de l'état Firebase ─── */
onAuthStateChanged(auth, (user) => {

  if (isProtected) {
    if (!user) {
      /* Non connecté sur page protégée → redirection immédiate sans afficher la page */
      sessionStorage.setItem('gnr_redirect', window.location.href);
      window.location.replace("login.html");
      return; /* Ne pas continuer */
    }
    /* Connecté sur page protégée → afficher la page */
    document.documentElement.style.visibility = "visible";
  }

  /* Mettre à jour le bouton dans le header */
  updateAuthButton(user);

  /* Protéger les liens de navigation */
  setupProtectedLinks();
});
