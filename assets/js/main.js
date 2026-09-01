// Moulin d'Or — Interactions du site statique
document.addEventListener('DOMContentLoaded', function () {

  /* ---- Menu mobile ---- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = header.classList.toggle('menu-open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close menu when clicking navigation links
    document.querySelectorAll('.nav-mobile a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('menu-open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside header
    document.addEventListener('click', function (e) {
      if (header.classList.contains('menu-open') && !header.contains(e.target)) {
        header.classList.remove('menu-open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Révélation au scroll (Lazy animations) ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Filtre et recherche combinés (Page Produits) ---- */
  var searchInput = document.getElementById('product-search');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('.product-card');
  var productGrid = document.querySelector('.product-grid');

  if (productGrid && (filterBtns.length || searchInput)) {
    // Create the "no products found" message container dynamically
    var noProductsMsg = document.createElement('div');
    noProductsMsg.className = 'no-products-msg';
    noProductsMsg.style.display = 'none';
    noProductsMsg.textContent = 'Aucun produit ne correspond à votre recherche.';
    productGrid.appendChild(noProductsMsg);

    function updateProducts() {
      var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      var activeBtn = document.querySelector('.filter-btn.active');
      var cat = activeBtn ? activeBtn.getAttribute('data-filter') : 'tous';
      var visibleCount = 0;

      productCards.forEach(function (card) {
        var cardCat = card.getAttribute('data-cat');
        var cardTitle = card.querySelector('h4').textContent.toLowerCase();
        var cardDesc = card.querySelector('p').textContent.toLowerCase();
        var cardCatText = card.querySelector('.p-cat').textContent.toLowerCase();

        var matchCat = cat === 'tous' || cardCat === cat;
        var matchQuery = query === '' || 
                         cardTitle.includes(query) || 
                         cardDesc.includes(query) || 
                         cardCatText.includes(query);

        if (matchCat && matchQuery) {
          card.style.display = '';
          // Simple subtle fade animation for matching items
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          visibleCount++;
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });

      if (visibleCount === 0) {
        noProductsMsg.style.display = 'block';
      } else {
        noProductsMsg.style.display = 'none';
      }
    }

    if (filterBtns.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          updateProducts();
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', updateProducts);
    }
  }

  /* ---- Formulaire de contact avec feedback interactif ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = document.getElementById('form-success');
      
      // Basic button loading feedback
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Envoi en cours...';
      }

      setTimeout(function() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        if (success) {
          success.classList.add('show');
          success.setAttribute('role', 'status');
          
          // Scroll success message into view smoothly
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          
          // Hide it after 6 seconds
          setTimeout(function() {
            success.classList.remove('show');
          }, 6000);
        }
        form.reset();
      }, 1000);
    });
  }

  /* ---- Année dynamique dans le footer ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
