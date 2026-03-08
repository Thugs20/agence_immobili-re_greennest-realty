/////////////////////////////////////////////
// INITIALISATION DE FIREBASE
/////////////////////////////////////////////

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDb7y807LAXmV2ST_EdA_L-LdBcbc6SKN8",
  authDomain: "green-nest-realty-immobilier.firebaseapp.com",
  projectId: "green-nest-realty-immobilier",
  storageBucket: "green-nest-realty-immobilier.firebasestorage.app",
  messagingSenderId: "1037762102556",
  appId: "1:1037762102556:web:f78e8d720783bbbdf426d9"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/////////////////////////////////////////////
// INSCRIPTION
/////////////////////////////////////////////
const registerForm = document.getElementById("registerForm");
if(registerForm){
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if(password !== confirmPassword){
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      // Créer l'utilisateur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ajouter dans Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullname,
        email,
        phone,
        role: "user",
        favorites: [],
        createdAt: serverTimestamp()
      });

      alert("Compte créé avec succès !");
      registerForm.reset();
      // Rediriger vers login
      window.location.href = "login.html";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}

/////////////////////////////////////////////
// LOGIN EMAIL/PASSWORD
/////////////////////////////////////////////
const loginForm = document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      alert("Connexion réussie !");
      // Redirection après login
      window.location.href = "dashboard.html"; // ou page d'accueil
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}

/////////////////////////////////////////////
// LOGIN GOOGLE
/////////////////////////////////////////////
const googleBtn = document.getElementById("googleSignIn");
if(googleBtn){
  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Vérifier si l'utilisateur existe déjà dans Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if(!docSnap.exists()){
        // Ajouter l'utilisateur dans Firestore
        await setDoc(userRef, {
          uid: user.uid,
          fullname: user.displayName || "",
          email: user.email,
          phone: user.phoneNumber || "",
          role: "user",
          favorites: [],
          createdAt: serverTimestamp()
        });
      }

      alert("Connexion Google réussie !");
      window.location.href = "dashboard.html"; // redirection
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}

function requireAuth(redirectPage){
  const user = auth.currentUser;

  if(user){
    window.location.href = redirectPage;
  }else{
    alert("Veuillez vous connecter pour accéder à cette page.");
    window.location.href = "login.html";
  }
}

// Vérification Firebase pour accéder aux pages protégées
const protectedLinks = [
  {id: "linkProperties", url: "properties.html"},
  {id: "linkBuy", url: "properties.html#buy"},
  {id: "linkRent", url: "properties.html#to_rent_out"},
  {id: "linkContact", url: "contact.html"}
];

protectedLinks.forEach(link => {
  const element = document.getElementById(link.id);
  if(element){
    element.addEventListener("click", (e) => {
      e.preventDefault();

      const user = auth.currentUser;

      if(user){
        // utilisateur connecté
        window.location.href = link.url;
      }else{
        // utilisateur non connecté
        alert("Veuillez vous connecter pour accéder à cette page.");
        window.location.href = "register.html";
      }

    });
  }
});

// ================================
// BOUTON CONNEXION / DECONNEXION DYNAMIQUE
// ================================

// Cibler le <li> ou <a> du menu pour Connexion
const authLi = document.getElementById("btnLogin");

onAuthStateChanged(auth, (user) => {
    if(user){
        // Utilisateur connecté → afficher Nom + Déconnexion
        const displayName = user.displayName || user.email;

        authLi.outerHTML = `
            <li id="authLi">
                <span class="user-name">${displayName}</span>
                <button id="btnLogout" class="btn-logout">Déconnexion</button>
            </li>
        `;

        // Ajouter l'événement Déconnexion
        const btnLogout = document.getElementById("btnLogout");
        btnLogout.addEventListener("click", async () => {
            try{
                await auth.signOut();
                // Recréer le bouton Connexion
                const authLiContainer = document.getElementById("authLi");
                authLiContainer.outerHTML = `<li><a href="login.html" class="btn-login" id="btnLogin">Connexion</a></li>`;
            }catch(error){
                console.error(error);
                alert("Erreur lors de la déconnexion.");
            }
        });

    }else{
        // Utilisateur non connecté → bouton Connexion visible
        authLi.outerHTML = `<li><a href="login.html" class="btn-login" id="btnLogin">Connexion</a></li>`;
    }
});




