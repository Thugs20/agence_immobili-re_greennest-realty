# 🌿 GreenNest Realty — Projet Portfolio

> **⚠️ AVIS IMPORTANT — PROJET DE DÉMONSTRATION**
> Ce site est un projet réalisé dans le cadre d'un **portfolio personnel**.
> Les propriétés, prix, agents, témoignages et informations de contact sont **entièrement fictifs**.
> Il n'existe aucune agence immobilière « GreenNest Realty » à Cotonou ou ailleurs.
> Ce projet a pour unique but de **démontrer des compétences techniques** en développement web.

---

## 👨‍💻 Auteur

**HOUETO Fabrice**
Développeur Full-Stack · Designer UI/UX
📍 Cotonou, Bénin

---

## 🎯 Objectif du projet

Démontrer mes compétences dans les domaines suivants :

| Compétence | Technologies utilisées |
|---|---|
| Structure HTML sémantique & SEO | HTML5, balises meta, Open Graph |
| Design UI/UX premium | CSS3 avancé, variables CSS, Glassmorphism |
| Responsive Design | Media queries, CSS Grid, Flexbox |
| Animations & interactions | CSS keyframes, IntersectionObserver, Web Animations API |
| JavaScript avancé | ES6+, modules, localStorage, URLSearchParams |
| Authentification cloud | Firebase Auth (Email/Password + Google Sign-In) |
| Dark Mode | CSS variables dynamiques, localStorage |
| Accessibilité | ARIA labels, navigation clavier, contraste |
| Performance | Lazy loading, animations GPU, images WebP |

---

## 📁 STRUCTURE DES FICHIERS

```
GreenNest-Realty/
│
├── ─── PAGES HTML ───────────────────────────────────────
│
├── 📄 index.html              ← Accueil (Hero, Services, Propriétés, Témoignages, FAQ)
├── 📄 property.html           ← Catalogue avec filtres temps réel
├── 📄 property-details.html   ← Détail d'une propriété (généré par JS)
├── 📄 about.html              ← À propos (histoire, valeurs, équipe, timeline)
├── 📄 contact.html            ← Contact (formulaire, agents, carte Cotonou)
├── 📄 login.html              ← Connexion Firebase
├── 📄 register.html           ← Inscription Firebase
│
├── ─── STYLES CSS ────────────────────────────────────────
│   (1 fichier CSS dédié par page = maintenance facile)
│
├── 🎨 style-new.css           ← Variables globales, reset, header, footer, dark mode,
│                                 boutons, curseur custom, loader, animations scroll, toast
├── 🎨 style-home.css          ← Hero, barre recherche, services, propriétés vedette,
│                                 section about, chiffres, témoignages, équipe, FAQ, CTA
├── 🎨 style-properties.css    ← Banner, filtres, grille cartes, vue liste, no-results
├── 🎨 style-details.css       ← Breadcrumb, image principale, info card, features
├── 🎨 style-auth.css          ← Split-screen login/register, formulaires auth premium
├── 🎨 style-auth-extra.css    ← Indicateur force mot de passe, checkboxes termes
├── 🎨 style-contact.css       ← Cards rapides, grille contact, agents, carte, socials
├── 🎨 style-about.css         ← Hero about, histoire, timeline, valeurs, note développeur
│
├── ─── JAVASCRIPT ────────────────────────────────────────
│
├── ⚡ script-new.js           ← Logique UI globale :
│                                 Loader · Curseur custom animé · Header scroll/transparent
│                                 Menu mobile hamburger · Animations scroll (IntersectionObserver)
│                                 Compteurs animés (easing cubic) · Dark Mode toggle
│                                 FAQ accordéon · Parallaxe hero · Barre recherche rapide
│                                 Toast notifications · Smooth scroll ancres
│
├── ⚡ script.js               ← Logique métier propriétés :
│                                 Génération catalogue (99 biens) → localStorage
│                                 Rendu cartes HTML dynamique · Filtres temps réel
│                                 Filtres URL (paramètres GET) · Favoris persistants
│                                 Page détails dynamique · Vue grille/liste
│
├── ⚡ firebase-config.js      ← (Votre fichier existant — non modifié)
│                                 Initialisation Firebase App + config
│
├── ⚡ script-auth.js          ← (Votre fichier existant — non modifié)
│                                 Gestion état utilisateur dans la navbar
│                                 (affiche nom connecté, bouton déconnexion)
│
└── 📁 images/                 ← Vos images WebP originales (non modifiées)
    ├── appartement1.webp → appartement29.webp
    ├── agent1.webp, agent2.webp
    ├── ma_photo.webp
    └── Logo.webp
```

---

## 🔗 LIENS ENTRE LES PAGES

```
index.html
  ├── → property.html                     (Voir toutes les propriétés)
  ├── → property.html?status=acheter      (Filtre Acheter)
  ├── → property.html?status=louer        (Filtre Louer)
  ├── → property.html?type=villa          (Filtre Villas)
  ├── → about.html
  ├── → contact.html
  └── → login.html

property.html
  └── → property-details.html?id=N        (Détail d'une propriété par ID)

login.html  ←→  register.html             (Lien réciproque)
```

### Paramètres URL supportés par `property.html`
```
?status=acheter                     Filtre "À acheter"
?status=louer                       Filtre "À louer"
?type=villa                         Filtre par type de bien
?city=Cotonou                       Filtre par ville (pré-remplit la recherche)
?status=louer&type=appartement      Combinaisons possibles
```

---

## ⚡ FONCTIONNALITÉS DÉTAILLÉES

### 🎨 Design & Expérience Utilisateur
- **Loader d'entrée** : animation élégante avec barre de progression verte sur fond forêt
- **Curseur personnalisé** : point jade + follower avec effet lag fluide (desktop uniquement)
- **Header transparent** sur le hero → opaque + blur glassmorphism au scroll
- **Mode Sombre / Clair** : basculement avec icône lune/soleil, persistant (`localStorage`)
- **Bandeau portfolio** : barre fixe en bas, dismissable, rappelle le contexte démo
- **Animations au scroll** : `IntersectionObserver` sur `.reveal-up`, `.reveal-left`, `.reveal-right`
- **Typographie premium** : Cormorant Garamond (titres élégants) + DM Sans (corps lisible)
- **Palette cohérente** : vert forêt `#0d3d1f`, jade `#22c55e`, or `#c9a84c`, crème `#f8f6f1`
- **Particules flottantes** : 3 éléments décoratifs animés dans le hero avec keyframes

### 🏠 Catalogue Propriétés
- **Génération automatique** : 99 propriétés (9 types × 11 biens) au 1er chargement
- **Stockage** : `localStorage` clé `gnr_properties` (migration auto depuis l'ancienne clé `properties`)
- **Filtres simultanés** : texte libre, type, statut, prix min/max — en temps réel
- **Vue grille / liste** : basculement avec icône, layout adapté automatiquement sur mobile
- **Animations cartes** : apparition en cascade avec délai CSS progressif
- **Compteur résultats** : "X propriété(s) trouvée(s)" mis à jour à chaque frappe
- **Bouton reset** : réinitialise tous les filtres d'un coup avec retour visuel
- **Page détails** : entièrement générée par JS — titre, prix, features, description, boutons

### ❤️ Système de Favoris
- Stocké dans `localStorage` clé `gnr_favs`
- Animation cœur pulsé au clic (Web Animations API)
- Toast notification contextuel (ajout / retrait)
- État synchronisé entre la liste et la page détails
- Persistant entre les sessions

### 🔐 Authentification Firebase
- **Login** : Email/Password + Google Sign-In (OAuth)
- **Register** : Création compte + `updateProfile` pour le nom d'affichage
- **Indicateur force** mot de passe : 5 niveaux, couleur dynamique, largeur animée
- **Messages d'erreur** en français (codes Firebase traduits : `auth/email-already-in-use`, etc.)
- **Spinners** sur tous les boutons pendant les requêtes async (UX fluide)
- **`firebase-config.js`** + **`script-auth.js`** : vos fichiers originaux chargés sur toutes
  les pages principales pour gérer l'état de session dans la navbar

### 📱 Responsive Mobile First
| Breakpoint | Comportement |
|---|---|
| > 1280px | Layout desktop complet, max-width 1280px centré |
| 1024–1280px | Ajustements grilles (passage 2 colonnes) |
| 768–1024px | Menu hamburger, layouts 1 colonne, filtres scrollables |
| 480–768px | Mobile adapté, boutons pleine largeur, cartes empilées |
| < 480px | Mobile small, typographie fluide clamp(), CTA verticaux |

---

## 🛡️ PROTECTION PORTFOLIO (3 niveaux)

### Niveau 1 — Balise robots (dans le `<head>` de chaque page)
```html
<meta name="robots" content="noindex, nofollow">
```
→ Empêche Google et tous les moteurs de recherche d'**indexer le site**.
→ Le site ne remontera jamais dans les résultats de recherche.

### Niveau 2 — Bandeau visuel (toutes les pages, fixé en bas)
```
🎓 Projet de portfolio · Les données (propriétés, prix, agents) sont entièrement fictives
```
→ Visible par tout visiteur humain, avec bouton ✕ pour le fermer.
→ Style discret mais clairement lisible (fond vert forêt semi-transparent).

### Niveau 3 — Ce README
→ Tout recruteur ou visiteur du dépôt GitHub voit immédiatement le contexte.
→ Première section = avertissement bien visible.

---

## 🔧 PERSONNALISATION RAPIDE

### Changer la palette de couleurs
Dans `style-new.css`, modifier les variables CSS dans `:root { }` :
```css
:root {
  --forest:  #0d3d1f;   /* Vert forêt principal (fond dark, logo) */
  --emerald: #1a6b35;   /* Vert émeraude (hover) */
  --jade:    #22c55e;   /* Jade vif (accent, CTA, icônes) */
  --gold:    #c9a84c;   /* Or chaud (badge location) */
  --bg:      #f8f6f1;   /* Fond crème doux (mode clair) */
}
```

### Connecter de vraies données Firestore
Dans `script.js`, ligne `generateCatalog()` :
```js
// Remplacer la génération locale par un fetch Firestore :
import { getFirestore, collection, getDocs } from "firebase/firestore";
const db = getFirestore(app);
const snap = await getDocs(collection(db, "properties"));
myProperties = snap.docs.map(d => ({ id: d.id, ...d.data() }));
```

### Mettre de vraies coordonnées de contact
Chercher et remplacer dans `contact.html` et `index.html` :
- `+229 97 00 00 00` → votre numéro réel
- `contact@greennest-realty.bj` → votre email réel
- `Rue des Palmiers, Cotonou, Bénin` → votre adresse réelle
- L'iframe Google Maps → vos vraies coordonnées GPS

### Activer l'indexation Google (si vrai déploiement client)
Supprimer dans chaque `<head>` :
```html
<!-- Supprimer cette ligne pour autoriser l'indexation -->
<meta name="robots" content="noindex, nofollow">
```
Et supprimer le bandeau `.portfolio-banner` dans le `<body>`.

---

## 🚀 DÉPLOIEMENT

### En local (sans serveur)
Ouvrir directement `index.html` dans Chrome/Firefox/Edge.
> ⚠️ Les modules Firebase (`type="module"`) nécessitent un serveur pour fonctionner complètement.
> Utilisez **Live Server** (extension VS Code) ou **http-server** :
```bash
npx http-server . -o
```

### Sur GitHub Pages (gratuit)
1. Créer un dépôt GitHub (public ou privé)
2. Pousser tous les fichiers : `git push origin main`
3. Settings → Pages → Branch: `main` → `/root` → Save
4. URL : `https://votre-username.github.io/greennest-realty/`

### Sur Netlify (recommandé — le plus simple)
1. Aller sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glisser-déposer le dossier du projet
3. URL générée automatiquement en moins de 30 secondes
4. Domaine personnalisé possible gratuitement

### Sur Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting    # Dossier public = . (le dossier racine)
firebase deploy
```

---

## 📊 TECHNOLOGIES UTILISÉES

| Catégorie | Technologie | Version/Note |
|---|---|---|
| Markup | HTML5 sémantique | Balises article, section, nav, main |
| Style | CSS3 | Grid, Flexbox, Variables, Keyframes, clamp() |
| Script | JavaScript | ES6+, Modules, Async/Await, IntersectionObserver |
| Fonts | Google Fonts | Cormorant Garamond + DM Sans |
| Icons | Font Awesome | 6.5.0 CDN |
| Auth | Firebase Authentication | 10.12.2 (Email + Google OAuth) |
| Stockage local | localStorage | Catalogue, favoris, thème |
| Hébergement | Compatible | Firebase Hosting / Netlify / GitHub Pages |

---

## 📝 NOTES TECHNIQUES IMPORTANTES

### Pourquoi `firebase-config.js` et `script-auth.js` ne sont pas modifiés ?
Ces deux fichiers sont vos fichiers **originaux** qui gèrent :
- L'initialisation de Firebase App avec votre config projet
- La détection de l'état de connexion (onAuthStateChanged)
- L'affichage du nom de l'utilisateur connecté dans la navbar
- Le bouton de déconnexion

Ils sont chargés sur toutes les pages principales via :
```html
<!-- SDK Firebase (mode compat pour script-auth.js) -->
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>

<!-- Vos fichiers originaux non modifiés -->
<script type="module" src="firebase-config.js"></script>
<script type="module" src="script-auth.js"></script>
```

### Pourquoi `login.html` et `register.html` utilisent Firebase différemment ?
Ces pages utilisent Firebase en **import ESM inline** (SDK modulaire v9+),
ce qui est plus moderne et plus léger. La config Firebase y est incluse directement.
C'est intentionnel — ces pages sont **autonomes** et n'ont pas besoin de `firebase-config.js`.

### Clés localStorage
| Nouvelle clé | Contenu | Ancienne clé (migrée) |
|---|---|---|
| `gnr_properties` | Catalogue des 99 propriétés | `properties` |
| `gnr_favs` | Liste des IDs favoris | `favs` / `favoris` |
| `gnr-theme` | `'dark'` ou `'light'` | — |

> La migration est automatique : si `gnr_properties` est vide, le script génère
> un nouveau catalogue et supprime l'ancienne clé `properties`.

---

## 🙏 Crédits

| Ressource | Source | Licence |
|---|---|---|
| Images propriétés | Projet original HOUETO Fabrice | Propriétaire |
| Avatars témoignages | [pravatar.cc](https://i.pravatar.cc) | Domaine public |
| Icônes | [Font Awesome](https://fontawesome.com) | Free License |
| Polices | [Google Fonts](https://fonts.google.com) | Open Font License |
| Authentification | [Firebase](https://firebase.google.com) (Google) | Spark Plan gratuit |

---

*© 2026 — Projet portfolio de **HOUETO Fabrice** · Cotonou, Bénin*

*⚠️ Toutes les données présentées sur ce site (propriétés, prix, agents, témoignages)
sont **entièrement fictives** et créées à des fins de démonstration uniquement.
Ce projet ne représente pas une vraie agence immobilière.*
