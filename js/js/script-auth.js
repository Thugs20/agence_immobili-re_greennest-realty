// script-auth.js
import { getAuth, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);

// === Sélection des éléments ===
const btnLogin = document.getElementById("btnLogin");
const protectedLinks = [
    document.getElementById("navProperties"),
    document.getElementById("linkBuy"),
    document.getElementById("linkRent"),
    document.getElementById("linkVillas"),
    document.getElementById("heroProperties"),
    document.getElementById("allPropertiesBtn"),
];

// === Fonction toast ===
function showToast(message, color="#2e7d32"){
    let toast = document.getElementById("toast");
    if(!toast){
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.padding = "12px 25px";
        toast.style.color = "white";
        toast.style.borderRadius = "5px";
        toast.style.zIndex = "9999";
        toast.style.fontWeight = "bold";
        toast.style.transition = "opacity 0.3s";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = color;
    toast.style.opacity = "1";
    setTimeout(() => toast.style.opacity = "0", 3000);
}

// === Vérification de l'état de connexion ===
onAuthStateChanged(auth, (user)=>{
    if(user){
        // Utilisateur connecté
        if(btnLogin){
            btnLogin.textContent = "Déconnexion";
            btnLogin.href = "#";
            btnLogin.classList.add("btn-logout");
            btnLogin.onclick = async (e)=>{
                e.preventDefault();
                await signOut(auth);
                showToast("Déconnecté avec succès","#2e7d32");
                window.location.reload(); // recharge pour mettre à jour la page
            };
        }

        // Les liens protégés sont accessibles
        protectedLinks.forEach(link=>{
            if(link) link.onclick = null;
        });

    } else {
        // Utilisateur NON connecté
        if(btnLogin){
            btnLogin.textContent = "Connexion";
            btnLogin.href = "login.html";
            btnLogin.classList.remove("btn-logout");
            btnLogin.onclick = null;
        }

        // Bloquer l'accès aux liens protégés
        protectedLinks.forEach(link=>{
            if(!link) return;
            link.onclick = (e)=>{
                e.preventDefault();
                showToast("Veuillez vous connecter ou créer un compte pour accéder à cette page","#e53935");
            };
        });

        // Bloquer l'accès aux pages protégées
        const protectedPages = ["property.html"];
        const currentPage = window.location.pathname.split("/").pop();
        if(protectedPages.includes(currentPage)){
            window.location.href = "login.html";
        }
    }
});