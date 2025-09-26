document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Banner scrolling ---------- */
  const banner = document.querySelector('.banner');
  const bannerText = document.getElementById('banner-text');
  if (banner && bannerText) {
    let pos = banner.clientWidth;
    function moveBanner() {
      pos -= 1;
      if (pos < -bannerText.offsetWidth) pos = banner.clientWidth;
      bannerText.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(moveBanner);
    }
    window.addEventListener('resize', () => {
      pos = banner.clientWidth;
    });
    requestAnimationFrame(moveBanner);
  }

  /* ---------- Gallery auto-slide ---------- */
  const track = document.querySelector(".gallery-track");
  const cards = document.querySelectorAll(".glass-card");
  if (track && cards.length) {
    const visibleCards = 3;
    let currentIndex = 0;
    function slideGallery() {
      currentIndex++;
      if (currentIndex > cards.length - visibleCards) currentIndex = 0;
      const gap = 24;
      const cardWidth = cards[0].offsetWidth + gap;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
    setInterval(slideGallery, 2500);
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const ferr = document.getElementById('form-error');
  if (form) {
    const endpoint = form.dataset.endpoint || '';
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (status) status.style.display = 'none';
      if (ferr) ferr.style.display = 'none';
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());

      if (!payload.name || !payload.email || !payload.message) {
        if (ferr) {
          ferr.textContent = 'Please complete required fields.';
          ferr.style.display = '';
        }
        return;
      }

      if (!endpoint) {
        if (status) {
          status.textContent = 'Message sent (demo). Add data-endpoint to send real messages.';
          status.style.display = '';
        }
        form.reset();
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Network error');
        if (status) {
          status.textContent = 'Thank you — your message was sent.';
          status.style.display = '';
        }
        form.reset();
      } catch (err) {
        if (ferr) {
          ferr.textContent = 'Failed to send message. Please try again later.';
          ferr.style.display = '';
        }
      }
    });
  }

  /* ---------- Shopping cart ---------- */
  const PRODUCTS = [
    {
      id: 'p1',
      title: 'Nguni Cowhide Wing Jacket',
      price: 9999.00,
      images: ['images/nguni converts 1.jpeg', 'images/nguni converts 2.jpeg', 'images/nguni converts 3.jpeg']
    },
    {
      id: 'p2',
      title: ' Black Cowhide Wing Jacket',
      price: 10999.00,
      images: ['images/black cowhide 1.jpeg', 'images/black cowhide 2.jpeg', 'images/black cowhide 3.jpeg']
    },
    {
      id: 'p3',
      title: 'Hair On Hide Racer Jacket',
      price: 8999.00,
      images: ['images/Racer 1.jpeg', 'images/Racer 2.jpeg', 'images/Racer 3.jpeg']
    },
    {
      id: 'p4',
      title: ' Cowhide Varsity Jacket',
      price: 8999.00,
      images: ['images/varsity 1.jpeg', 'images/varsity 2.jpeg', 'images/varsity 3.jpeg']
    },
    {
      id: 'p5',
      title: ' Black Leather Converts',
      price: 6999.00,
      images: ['images/black converts 1.jpeg', 'images/black converts 2.jpeg', 'images/black converts 3.jpeg']
    },
    {
      id: 'p6',
      title: ' Nguni CowHide Converts',
      price: 7999.00,
      images: ['images/nguni converts 1.jpeg', 'images/nguni converts 2.jpeg', 'images/nguni converts 3.jpeg']
    },
    {
      id: 'p7',
      title: ' Blue 2Tone Denims Converts',
      price: 1999.00,
      images: ['images/blue 2.jpeg', 'images/blue 2.jpeg', 'images/blue 2.jpeg']
    },
    {
      id: 'p8',
      title: ' White 2Tone Denims Converts',
      price: 1999.00,
      images: ['images/white 2tone 1.jpeg', 'images/white 2tone 2.jpeg', 'images/white 2tone 3.jpeg']
    },
    {
      id: 'p9',
      title: ' Pleated Denim Shorts',
      price: 1599.00,
      images: ['images/pleated shorts 1.jpeg', 'images/pleated shorts 2.jpeg', 'images/pleated shorts 3.jpeg']
    },
    {
      id: 'p10',
      title: ' Wings Jackets ',
      price: 1799.00,
      images: ['images/wings 1.jpeg', 'images/wings 2.jpeg', 'images/wings 3.jpeg' , 'images/wings 4.jpeg' , 'images/wings 5.jpeg', 'images/wings 6.jpeg ' , 'images/wings 7.jpeg' , 'images/wings 8.jpeg' , 'images/wings 9.jpeg']
    },
    {
      id: 'p11',
      title: ' Detachable Tan Jacket',
      price: 1799.00,
      images: ['images/Tan 1.jpeg', 'images/Tan 2.jpeg', 'images/Tan 3.jpeg', 'images/Tan 4.jpeg' , 'images/Tan 5.jpeg' , 
        
      ]
    },
    // Add more products as needed...
  ];

  const LS_KEY = 'jskn_cart';
  let cart = JSON.parse(localStorage.getItem(LS_KEY) || '{}');

  const productsContainer = document.getElementById('products');
  const cartItems = document.getElementById('cart-items');
  const cartCountEl = document.getElementById('cart-count');
  const cartTotalEl = document.getElementById('cart-total');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartButton = document.getElementById('cart-button');
  const closeCart = document.getElementById('close-cart');
  const clearBtn = document.getElementById('clear-cart');
  const checkoutButton = document.getElementById('checkout-button');

  function formatPrice(n) {
    return 'R ' + Number(n).toFixed(2);
  }

  function saveCart() {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
    renderCartCount();
  }

  function renderProducts() {
    if (!productsContainer) return;
    productsContainer.innerHTML = PRODUCTS.map(p => {
      const main = p.images[0];
      const thumbs = p.images.map((src, i) =>
        `<button class="thumb" data-id="${p.id}" data-src="${src}" aria-label="View ${i+1}">
          <img src="${src}" alt="${p.title} thumbnail ${i+1}" />
        </button>`
      ).join('');

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-media">
            <img class="product-main" src="${main}" alt="${p.title}" />
            <div class="thumbs">${thumbs}</div>
          </div>
          <h3>${p.title}</h3>
          <div class="price">${formatPrice(p.price)}</div>
          <button class="btn add" data-id="${p.id}">Add to cart</button>
        </article>
      `;
    }).join('');

    productsContainer.querySelectorAll('.thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const src = btn.dataset.src;
        const card = productsContainer.querySelector(`.product-card[data-id="${id}"]`);
        const main = card.querySelector('.product-main');
        main.src = src;
        card.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    productsContainer.querySelectorAll('.add').forEach(b => {
      b.addEventListener('click', () => addToCart(b.dataset.id));
    });
  }

  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
  }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    renderCart();
  }

  function clearCart() {
    cart = {};
    saveCart();
    renderCart();
  }

  function renderCartCount() {
    const count = Object.values(cart).reduce((s, v) => s + v, 0);
    if (cartCountEl) cartCountEl.textContent = count;
  }

  function renderCart() {
    if (!cartItems) return;
    const keys = Object.keys(cart);
    if (keys.length === 0) {
      cartItems.innerHTML = '<div style="color:#666">Cart is empty</div>';
      if (cartTotalEl) cartTotalEl.textContent = formatPrice(0);
      return;
    }

    let total = 0;
    const rows = keys.map(id => {
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return '';
      const qty = cart[id];
      const line = p.price * qty;
      total += line;
      return `
        <div class="cart-row">
          <img src="${p.images[0]}" alt="${p.title}" />
          <div class="cart-info">
            <div class="cart-title">${p.title}</div>
            <div class="cart-meta">${formatPrice(p.price)} × ${qty} = <strong>${formatPrice(line)}</strong></div>
            <div class="cart-controls">
              <button class="qty" data-id="${id}" data-delta="-1">−</button>
              <button class="qty" data-id="${id}" data-delta="1">+</button>
              <button class="remove" data-id="${id}">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    cartItems.innerHTML = rows;
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);

    cartItems.querySelectorAll('.qty').forEach(btn => {
      btn.addEventListener('click', () => changeQty(btn.dataset.id, Number(btn.dataset.delta)));
    });

    cartItems.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', () => {
        delete cart[btn.dataset.id];
        saveCart();
        renderCart();
      });
    });
  }

  // Cart drawer
  if (cartButton) cartButton.addEventListener('click', () => {
    cartDrawer?.setAttribute('aria-hidden', 'false');
    cartDrawer?.classList.add('open');
    renderCart();
  });

  if (closeCart) closeCart.addEventListener('click', () => {
    cartDrawer?.setAttribute('aria-hidden', 'true');
    cartDrawer?.classList.remove('open');
  });

  if (clearBtn) clearBtn.addEventListener('click', clearCart);

  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      const modal = document.getElementById('checkout-modal');
      modal?.setAttribute('aria-hidden', 'false');
      modal?.classList.add('open');
    });
  }

  // Checkout modal
  const closeCheckout = document.getElementById('cancel-checkout');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutResult = document.getElementById('checkout-result');

  closeCheckout?.addEventListener('click', () => {
    const modal = document.getElementById('checkout-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.classList.remove('open');
  });

  checkoutForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = checkoutForm.name.value;
    const email = checkoutForm.email.value;
    checkoutResult.innerHTML = `<p>Thank you, ${name}! Confirmation sent to ${email}.</p>`;
    clearCart();
    setTimeout(() => {
      const modal = document.getElementById('checkout-modal');
      modal?.setAttribute('aria-hidden', 'true');
      modal?.classList.remove('open');
      checkoutResult.innerHTML = '';
    }, 2200);
  });

  renderProducts();
  renderCartCount();
  renderCart();
});

    function openLightbox(images) {
      currentImages = images;
      currentIndex = 0;
      document.getElementById("lightbox-img").src = currentImages[currentIndex];
      document.getElementById("lightbox").style.display = "flex";
    }

    function closeLightbox() {
      document.getElementById("lightbox").style.display = "none";
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % currentImages.length;
      document.getElementById("lightbox-img").src = currentImages[currentIndex];
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      document.getElementById("lightbox-img").src = currentImages[currentIndex];
    }
/* ---------- Cart sidebar ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');

  if (!cartBtn || !cartSidebar) {
    console.warn('Cart button or cart sidebar not found in DOM.');
    return;
  }

  // Toggle sidebar open/close
  cartBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent immediate document click handler
    const opened = cartSidebar.classList.toggle('open');
    cartBtn.setAttribute('aria-expanded', opened);
  });

  // Close when clicking outside the sidebar or button
  document.addEventListener('click', (e) => {
    if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target) && cartSidebar.classList.contains('open')) {
      cartSidebar.classList.remove('open');
      cartBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
      cartSidebar.classList.remove('open');
      cartBtn.setAttribute('aria-expanded', 'false');
    }
  });
});

const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const formError = document.getElementById('form-error');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // prevent default form submission

  // Simple validation or success message
  formStatus.textContent = "Sending your message...";
  formError.textContent = "";

  // Simulate a delay like sending to server
  setTimeout(() => {
    formStatus.textContent = "Message sent successfully!";
    form.reset();
  }, 1000);
});


