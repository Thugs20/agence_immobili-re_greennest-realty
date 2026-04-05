/**
 * script.js — GreenNest Realty | Logique Propriétés & Favoris
 * Auteur : HOUETO Fabrice | 2026
 *
 * Modules :
 * 1. Génération du catalogue local (localStorage)
 * 2. Rendu des cartes propriétés
 * 3. Filtrage en temps réel
 * 4. Gestion des favoris
 * 5. Page de détails
 * 6. Vue grille / liste
 * 7. Compteurs animés (home)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     1. DONNÉES DES VILLES (focus Afrique de l'Ouest)
  ===================================================== */
  const cities = [
    "Cotonou", "Abidjan", "Dakar", "Lomé", "Accra",
    "Lagos", "Ouagadougou", "Casablanca", "Rabat", "Douala"
  ];

  /* Types de propriétés avec noms authentiques */
  const propertyTypes = {
    villa: ["Villa Moderne", "Villa Luxe", "Villa avec Piscine", "Villa Jardin", "Villa Panoramique"],
    maison: ["Maison Familiale", "Maison Moderne", "Maison de Ville", "Maison de Maître"],
    appartement: ["Appartement Moderne", "Appartement Vue Ville", "Appartement Terrasse", "Appartement Standing"],
    studio: ["Studio Étudiant", "Studio Urbain", "Studio Moderne", "Studio Meublé"],
    duplex: ["Duplex Élégant", "Duplex Terrasse", "Duplex Moderne", "Duplex Design"],
    loft: ["Loft Industriel", "Loft Design", "Loft Artistique", "Loft Contemporain"],
    terrain: ["Terrain Constructible", "Terrain Résidentiel", "Terrain Commercial", "Terrain Agricole"],
    bureau: ["Bureau Professionnel", "Espace de Coworking", "Bureau Moderne", "Open Space"],
    boutique: ["Boutique Commerciale", "Local Commercial", "Magasin Centre Ville", "Showroom"]
  };

  /* =====================================================
     2. INITIALISATION OU RÉCUPÉRATION DU CATALOGUE
  ===================================================== */
  let myProperties = JSON.parse(localStorage.getItem("gnr_properties"));

  if (!myProperties || myProperties.length === 0) {
    myProperties = generateCatalog();
    localStorage.setItem("gnr_properties", JSON.stringify(myProperties));
    // Nettoyer l'ancienne clé
    localStorage.removeItem("properties");
  }

  /**
   * Génère un catalogue de propriétés aléatoires
   * @returns {Array} tableau de propriétés
   */
  function generateCatalog() {
    const catalog = [];
    let id = 1;

    Object.keys(propertyTypes).forEach(type => {
      for (let i = 0; i < 11; i++) {
        const city = cities[Math.floor(Math.random() * cities.length)];
        const titles = propertyTypes[type];
        const title = titles[Math.floor(Math.random() * titles.length)];
        const status = Math.random() > 0.5 ? "acheter" : "louer";

        // Prix réalistes selon type et statut
        let price;
        if (status === "louer") {
          price = Math.floor(Math.random() * 900 + 100);
        } else {
          if (type === "terrain")        price = Math.floor(Math.random() * 70000 + 10000);
          else if (type === "villa")     price = Math.floor(Math.random() * 800000 + 200000);
          else if (type === "bureau")    price = Math.floor(Math.random() * 200000 + 50000);
          else                           price = Math.floor(Math.random() * 300000 + 50000);
        }

        // Assignation d'image cyclique parmi 29 images disponibles
        const imageIndex = ((id - 1) % 29) + 1;

        catalog.push({
          id: id++,
          title,
          city,
          price,
          type,
          status,
          image: `images/appartement${imageIndex}.webp`,
          rooms: type === "terrain" ? 0 : Math.floor(Math.random() * 6) + 1,
          surface: Math.floor(Math.random() * 280) + 30
          /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded      }
      /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded
    return catalog;
  }

  /* =====================================================
     3. GESTION DES FAVORIS
  ===================================================== */
  let favorites = JSON.parse(localStorage.getItem('gnr_favs')) || [];

  /**
   * Bascule un favori et sauvegarde dans localStorage
   * @param {number} id - ID de la propriété
   */
  window.toggleFavorite = function(id) {
    const numId = parseInt(id);
    if (favorites.includes(numId)) {
      favorites = favorites.filter(favId => favId !== numId);
      window.showToast?.("Retiré des favoris", "info");
    } else {
      favorites.push(numId);
      window.showToast?.("Ajouté aux favoris ❤️", "success");
    }
    localStorage.setItem('gnr_favs', JSON.stringify(favorites));

    // Mise à jour du bouton cœur sans re-render
    const btn = document.querySelector(`.favorite-heart[data-id="${numId}"]`);
    if (btn) {
      const icon = btn.querySelector('i');
      if (favorites.includes(numId)) {
        btn.classList.add('active');
        icon.className = 'fas fa-heart';
        btn.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.4)' },
          { transform: 'scale(1)' }
        ], { duration: 350, easing: 'ease-out'   /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded      } else {
        btn.classList.remove('active');
        icon.className = 'far fa-heart';
      }
    }
  };

  /* =====================================================
     4. RENDU DES CARTES
  ===================================================== */
  const grid = document.getElementById('propertiesGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');

  /**
   * Affiche les propriétés dans la grille
   * @param {Array} data - tableau filtré de propriétés
   */
  function renderProperties(data) {
    if (!grid) return;

    // Transition de disparition
    grid.style.opacity = '0';

    setTimeout(() => {
      grid.innerHTML = '';

      if (data.length === 0) {
        noResults && (noResults.style.display = 'block');
        grid.style.opacity = '1';
        if (resultsCount) resultsCount.innerHTML = '<strong>0</strong> propriété trouvée';
        return;
      }

      noResults && (noResults.style.display = 'none');

      // Mise à jour du compteur
      if (resultsCount) {
        resultsCount.innerHTML = `<strong>${data.length}</strong> propriété${data.length > 1 ? 's' : ''} trouvée${data.length > 1 ? 's' : ''}`;
      }

      // Génération des cartes avec délai d'animation
      data.forEach((item, index) => {
        const isFav = favorites.includes(item.id);
        const priceLabel = item.status === 'louer'
          ? `${item.price.toLocaleString('fr-FR')} €/mois`
          : `${item.price.toLocaleString('fr-FR')} €`;

        const card = document.createElement('div');
        card.className = 'property-card';
        card.style.animationDelay = `${Math.min(index * 0.06, 0.5)}s`;

        card.innerHTML = `
          <div class="card-image-container">
            <img src="${item.image}" alt="${item.title} – ${item.city}" loading="lazy">
            <span class="card-type-badge">${item.type}</span>
            <button
              class="favorite-heart ${isFav ? 'active' : ''}"
              data-id="${item.id}"
              onclick="toggleFavorite(${item.id})"
              title="${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
              aria-label="Favoris"
            >
              <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
            </button>
          </div>
          <div class="card-info">
            <p class="card-price">${priceLabel}</p>
            <h3>${item.title}</h3>
            <p class="card-location">
              <i class="fas fa-map-marker-alt"></i>
              ${item.city}
            </p>
            ${item.type !== 'terrain' ? `
            <div class="card-details">
              <div class="card-detail">
                <i class="fas fa-bed"></i>
                <span>${item.rooms} pièce${item.rooms > 1 ? 's' : ''}</span>
              </div>
              <div class="card-detail">
                <i class="fas fa-ruler-combined"></i>
                <span>${item.surface} m²</span>
              </div>
              <div class="card-detail">
                <i class="fas fa-tag"></i>
                <span>${item.status === 'louer' ? 'Location' : 'Vente'}</span>
              </div>
            </div>
            ` : ''}
            <button
              class="btn-view"
              onclick="window.location.href='property-details.html?id=${item.id}'"
            >
              Voir les détails →
            </button>
          </div>
        `;

        grid.appendChild(card);
        /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded
      // Réapparition
      grid.style.opacity = '1';

    }, 200);
  }

  /* =====================================================
     5. FILTRAGE EN TEMPS RÉEL
  ===================================================== */

  /**
   * Lit tous les filtres et retourne les propriétés filtrées
   */
  function filterNow() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
    const typeTerm = document.getElementById('typeFilter')?.value || 'all';
    const statusTerm = document.getElementById('statusFilter')?.value || 'all';
    const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;

    // Afficher/masquer le bouton clear
    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) {
      clearBtn.style.display = searchTerm ? 'block' : 'none';
    }

    const filtered = myProperties.filter(p => {
      const matchSearch = !searchTerm ||
        p.title.toLowerCase().includes(searchTerm) ||
        p.city.toLowerCase().includes(searchTerm) ||
        p.type.toLowerCase().includes(searchTerm);
      const matchType = typeTerm === 'all' || p.type === typeTerm;
      const matchStatus = statusTerm === 'all' || p.status === statusTerm;
      const matchMin = p.price >= minPrice;
      const matchMax = p.price <= maxPrice;

      return matchSearch && matchType && matchStatus && matchMin && matchMax;
      /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded
    renderProperties(filtered);
  }

  // Écoute de tous les filtres
  ['searchInput', 'typeFilter', 'statusFilter', 'minPrice', 'maxPrice'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', filterNow);
    document.getElementById(id)?.addEventListener('change', filterNow);
    /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded
  // Bouton clear recherche
  document.getElementById('clearSearch')?.addEventListener('click', () => {
    const input = document.getElementById('searchInput');
    if (input) { input.value = ''; filterNow(); input.focus(); }
    /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded
  // Bouton reset tous les filtres
  document.getElementById('resetFilters')?.addEventListener('click', () => {
    ['searchInput', 'minPrice', 'maxPrice'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
      /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded    ['typeFilter', 'statusFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = 'all';
      /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded    filterNow();
    /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded
  /* =====================================================
     6. FILTRES URL (depuis les liens de navigation)
  ===================================================== */
  function applyUrlFilters() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const type = params.get('type');
    const city = params.get('city');

    if (status && document.getElementById('statusFilter')) {
      document.getElementById('statusFilter').value = status;
    }
    if (type && document.getElementById('typeFilter')) {
      document.getElementById('typeFilter').value = type;
    }
    if (city && document.getElementById('searchInput')) {
      document.getElementById('searchInput').value = city;
    }
  }

  applyUrlFilters();

  // Appel initial (seulement sur la page propriétés)
  if (grid) { filterNow(); }

  /* =====================================================
     7. VUE GRILLE / LISTE
  ===================================================== */
  const viewGrid = document.getElementById('viewGrid');
  const viewList = document.getElementById('viewList');

  viewGrid?.addEventListener('click', () => {
    grid?.classList.remove('list-view');
    viewGrid.classList.add('active');
    viewList?.classList.remove('active');
    /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded
  viewList?.addEventListener('click', () => {
    grid?.classList.add('list-view');
    viewList.classList.add('active');
    viewGrid?.classList.remove('active');
    /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded
  /* =====================================================
     8. PAGE DÉTAILS PROPRIÉTÉ
  ===================================================== */
  function initDetailsPage() {
    const wrapper = document.getElementById('detailsWrapper');
    if (!wrapper) return;

    const params = new URLSearchParams(window.location.search);
    const propId = parseInt(params.get('id'), 10);

    // Chercher dans le nouveau catalogue ou l'ancien
    const catalog = JSON.parse(localStorage.getItem('gnr_properties'))
      || JSON.parse(localStorage.getItem('properties'))
      || [];

    const property = catalog.find(p => p.id === propId);

    if (!property) {
      wrapper.innerHTML = `
        <div style="text-align:center; padding:4rem 2rem;">
          <div style="font-size:3rem; margin-bottom:1rem;">🏠</div>
          <h2>Propriété introuvable</h2>
          <p style="color:var(--text-muted); margin:1rem 0 2rem;">Cette propriété n'est plus disponible ou l'ID est incorrect.</p>
          <a href="property.html" class="btn-primary-green">Voir le catalogue</a>
        </div>
      `;
      return;
    }

    const isFav = favorites.includes(property.id);
    const priceLabel = property.status === 'louer'
      ? `${property.price.toLocaleString('fr-FR')} €/mois`
      : `${property.price.toLocaleString('fr-FR')} €`;

    wrapper.innerHTML = `
      <div class="details-container">

        <!-- IMAGE PRINCIPALE -->
        <div class="main-image-container">
          <img src="${property.image}" alt="${property.title}" id="mainImage">
          <span class="badge-status ${property.status === 'louer' ? 'badge-rent' : ''}">
            <i class="fas fa-${property.status === 'louer' ? 'sign' : 'key'}"></i>
            ${property.status === 'louer' ? 'À Louer' : 'À Vendre'}
          </span>
        </div>

        <!-- INFO CARD -->
        <div class="info-card">

          <div class="info-header">
            <div>
              <p class="details-city">
                <i class="fas fa-map-marker-alt"></i> ${property.city}
              </p>
              <h1 class="details-title">${property.title}</h1>
            </div>
            <p class="details-price">${priceLabel}</p>
          </div>

          ${property.type !== 'terrain' ? `
          <div class="features-list">
            <div class="feature-box">
              <i class="fas fa-bed"></i>
              <span>${property.rooms} Pièce${property.rooms > 1 ? 's' : ''}</span>
            </div>
            <div class="feature-box">
              <i class="fas fa-ruler-combined"></i>
              <span>${property.surface} m²</span>
            </div>
            <div class="feature-box">
              <i class="fas fa-home"></i>
              <span>${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
            </div>
            <div class="feature-box">
              <i class="fas fa-leaf"></i>
              <span>Écologique</span>
            </div>
          </div>
          ` : ''}

          <div class="details-description">
            <h3>Description</h3>
            <p>
              ${property.title} idéalement situé${property.type !== 'terrain' ? 'e' : ''} à ${property.city}.
              Ce bien de ${property.surface} m²${property.type !== 'terrain' ? ` avec ${property.rooms} pièce${property.rooms > 1 ? 's' : ''}` : ''}
              vous offre tout le confort moderne dans un cadre respectueux de l'environnement.
              Propriété sélectionnée et certifiée par GreenNest Realty.
            </p>
          </div>

          <div class="btn-group">
            <button
              id="btnFav"
              class="btn-fav-detail ${isFav ? 'active' : ''}"
              data-id="${property.id}"
            >
              <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
              ${isFav ? 'Dans vos favoris' : 'Ajouter aux favoris'}
            </button>
            <a
              href="contact.html?prop=${encodeURIComponent(property.title)}&ville=${encodeURIComponent(property.city)}&prix=${encodeURIComponent(priceLabel)}&type=${encodeURIComponent(property.type)}&id=${property.id}"
              class="btn-action-detail"
            >
              <i class="fas fa-phone"></i>
              Contacter un agent
            </a>

            <!-- Bouton Prendre rendez-vous avec paiement fictif KKiaPay -->
            <button
              class="btn-rdv-detail"
              id="btnRdv"
              data-title="${property.title}"
              data-ville="${property.city}"
              data-prix="${priceLabel}"
            >
              <i class="fas fa-calendar-check"></i>
              Prendre rendez-vous (visite)
            </button>
          </div>

        </div>

      </div>
    `;

    // ── Bouton Prendre rendez-vous + paiement fictif KKiaPay ──
    const btnRdv = document.getElementById('btnRdv');
    btnRdv?.addEventListener('click', () => {
      openKkiaPayModal({
        title: btnRdv.getAttribute('data-title'),
        ville: btnRdv.getAttribute('data-ville'),
        prix:  btnRdv.getAttribute('data-prix'),
        /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded      /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded
    // Gestion du bouton favoris sur la page détails
    const btnFav = document.getElementById('btnFav');
    btnFav?.addEventListener('click', () => {
      const id = parseInt(btnFav.getAttribute('data-id'));
      const icon = btnFav.querySelector('i');

      if (favorites.includes(id)) {
        favorites = favorites.filter(fid => fid !== id);
        btnFav.classList.remove('active');
        icon.className = 'far fa-heart';
        btnFav.innerHTML = `<i class="far fa-heart"></i> Ajouter aux favoris`;
      } else {
        favorites.push(id);
        btnFav.classList.add('active');
        btnFav.innerHTML = `<i class="fas fa-heart"></i> Dans vos favoris`;
        btnFav.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.2)' },
          { transform: 'scale(1)' }
        ], { duration: 350, easing: 'ease-out'   /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded      }

      localStorage.setItem('gnr_favs', JSON.stringify(favorites));
      /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded  }

  // Initialiser la page détails si on est dessus
  if (window.location.pathname.includes('property-details')) {
    initDetailsPage();
  }

  /* =====================================================
     FONCTION : Modal paiement fictif KKiaPay
     Simule une interface de paiement mobile money pour
     démontrer l'intégration d'un prestataire de paiement.
     ⚠️ FICTIF — aucune transaction réelle n'est effectuée.
  ===================================================== */
  window.openKkiaPayModal = function({ title, ville, prix }) {
    // Supprimer un modal existant
    document.getElementById('kkiapay-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'kkiapay-modal';
    modal.innerHTML = `
      <div class="kkia-backdrop" id="kkiaBackdrop"></div>
      <div class="kkia-modal">
        <div class="kkia-header">
          <div class="kkia-logo">
            <span class="kkia-logo-icon">💳</span>
            <div>
              <strong>KKiaPay</strong>
              <em>Paiement Mobile Money</em>
            </div>
          </div>
          <button class="kkia-close" id="kkiaClose">✕</button>
        </div>

        <div class="kkia-body">
          <div class="kkia-property-recap">
            <i class="fas fa-home"></i>
            <div>
              <strong>${title}</strong>
              <span>${ville}</span>
            </div>
          </div>

          <div class="kkia-amount-box">
            <span class="kkia-label">Frais de visite</span>
            <span class="kkia-amount">5 000 FCFA</span>
            <span class="kkia-note">Remboursable si vous achetez</span>
          </div>

          <div class="kkia-methods">
            <p class="kkia-methods-title">Choisissez votre opérateur</p>
            <div class="kkia-method-grid">
              <button class="kkia-method active" data-op="MTN">
                <span class="kkia-method-icon" style="background:#ffd000;color:#000;">M</span>
                MTN MoMo
              </button>
              <button class="kkia-method" data-op="Moov">
                <span class="kkia-method-icon" style="background:#0062ae;color:#fff;">F</span>
                Flooz
              </button>
              <button class="kkia-method" data-op="Wave">
                <span class="kkia-method-icon" style="background:#1dc5f0;color:#fff;">W</span>
                Wave
              </button>
            </div>
          </div>

          <div class="kkia-phone-wrap">
            <label>Numéro de téléphone</label>
            <div class="kkia-phone-input">
              <span class="kkia-flag">🇧🇯 +229</span>
              <input type="tel" id="kkiaPhone" placeholder="97 00 00 00" maxlength="8">
            </div>
          </div>
        </div>

        <div class="kkia-footer">
          <button class="kkia-pay-btn" id="kkiaPayBtn">
            <i class="fas fa-lock"></i>
            Payer 5 000 FCFA
          </button>
          <p class="kkia-disclaimer">
            🎓 <strong>Démo portfolio</strong> — Aucun paiement réel ne sera effectué
          </p>
        </div>

        <!-- Écran de succès (masqué) -->
        <div class="kkia-success" id="kkiaSuccess" style="display:none;">
          <div class="kkia-success-icon">✅</div>
          <h3>Paiement confirmé !</h3>
          <p>Votre rendez-vous pour la visite de <strong>${title}</strong> est confirmé.</p>
          <p>Un agent vous contactera sous 24h pour confirmer la date.</p>
          <button class="kkia-pay-btn" onclick="document.getElementById('kkiapay-modal').remove()">
            Fermer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    // Forcer un reflow pour déclencher l'animation
    requestAnimationFrame(() => modal.querySelector('.kkia-modal').classList.add('open'));

    // Sélection opérateur
    modal.querySelectorAll('.kkia-method').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kkia-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Fermer modal
    const closeModal = () => modal.remove();
    document.getElementById('kkiaClose').addEventListener('click', closeModal);
    document.getElementById('kkiaBackdrop').addEventListener('click', closeModal);

    // Simuler le paiement
    document.getElementById('kkiaPayBtn').addEventListener('click', () => {
      const phone = document.getElementById('kkiaPhone').value.replace(/\s/g, '');
      if (phone.length < 8) {
        document.getElementById('kkiaPhone').style.borderColor = '#dc2626';
        document.getElementById('kkiaPhone').focus();
        return;
      }
      const btn = document.getElementById('kkiaPayBtn');
      btn.innerHTML = '<span class="spinner"></span> Traitement en cours...';
      btn.disabled = true;

      // Simulation 2.5 secondes
      setTimeout(() => {
        document.querySelector('.kkia-body').style.display = 'none';
        document.querySelector('.kkia-footer').style.display = 'none';
        document.getElementById('kkiaSuccess').style.display = 'flex';
      }, 2500);
    });
  };

}); // fin DOMContentLoaded