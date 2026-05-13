/* ═══════════════════════════════════════════════════
   BOLOKART — Production JavaScript
   Complete UI Logic: Cart, Modals, Products, Timer, AI Chat
═══════════════════════════════════════════════════ */

'use strict';

/* ── PRODUCT DATA ── */
const PRODUCTS = [
  { id: 1, name: 'Fresh Tomato', qty: '1 kg', price: 25, original: 35, emoji: '🍅', category: 'vegetables', rating: 4.8, discount: '28%', eta: '10 min', best: false },
  { id: 2, name: 'Potato', qty: '1 kg', price: 20, original: 28, emoji: '🥔', category: 'vegetables', rating: 4.7, discount: '29%', eta: '10 min', best: true },
  { id: 3, name: 'Onion', qty: '1 kg', price: 22, original: 30, emoji: '🧅', category: 'vegetables', rating: 4.6, discount: '27%', eta: '10 min', best: false },
  { id: 4, name: 'Banana', qty: '1 dozen', price: 40, original: 55, emoji: '🍌', category: 'vegetables', rating: 4.9, discount: '27%', eta: '10 min', best: true },
  { id: 5, name: 'Green Capsicum', qty: '500 g', price: 18, original: 25, emoji: '🫑', category: 'vegetables', rating: 4.5, discount: '28%', eta: '10 min', best: false },
  { id: 6, name: 'Fresh Apple', qty: '1 kg', price: 120, original: 150, emoji: '🍎', category: 'vegetables', rating: 4.8, discount: '20%', eta: '10 min', best: false },
  { id: 7, name: 'Full Cream Milk', qty: '1 litre', price: 60, original: 68, emoji: '🥛', category: 'dairy', rating: 4.9, discount: '12%', eta: '10 min', best: true },
  { id: 8, name: 'Paneer', qty: '200 g', price: 85, original: 100, emoji: '🧀', category: 'dairy', rating: 4.7, discount: '15%', eta: '10 min', best: false },
  { id: 9, name: 'Dahi (Curd)', qty: '400 g', price: 35, original: 42, emoji: '🍶', category: 'dairy', rating: 4.6, discount: '17%', eta: '10 min', best: false },
  { id: 10, name: 'Farm Eggs', qty: '6 pieces', price: 42, original: 50, emoji: '🥚', category: 'dairy', rating: 4.8, discount: '16%', eta: '10 min', best: true },
  { id: 11, name: 'Lays Chips', qty: '90 g pack', price: 20, original: 20, emoji: '🍿', category: 'snacks', rating: 4.7, discount: null, eta: '10 min', best: false },
  { id: 12, name: 'Parle-G Biscuit', qty: '200 g', price: 10, original: 10, emoji: '🍪', category: 'snacks', rating: 4.9, discount: null, eta: '10 min', best: true },
  { id: 13, name: 'Maggi Noodles', qty: '2 pack', price: 28, original: 28, emoji: '🍜', category: 'snacks', rating: 4.8, discount: null, eta: '10 min', best: false },
  { id: 14, name: 'Coca-Cola', qty: '1.25 litre', price: 60, original: 70, emoji: '🥤', category: 'beverages', rating: 4.7, discount: '14%', eta: '10 min', best: false },
  { id: 15, name: 'Mango Juice', qty: '1 litre', price: 55, original: 65, emoji: '🧃', category: 'beverages', rating: 4.8, discount: '15%', eta: '10 min', best: true },
  { id: 16, name: 'Mineral Water', qty: '1 litre', price: 20, original: 20, emoji: '💧', category: 'beverages', rating: 4.9, discount: null, eta: '10 min', best: false },
  { id: 17, name: 'Carrot', qty: '1 kg', price: 30, original: 40, emoji: '🥕', category: 'vegetables', rating: 4.6, discount: '25%', eta: '10 min', best: false },
  { id: 18, name: 'Cucumber', qty: '1 kg', price: 18, original: 25, emoji: '🥒', category: 'vegetables', rating: 4.5, discount: '28%', eta: '10 min', best: false },
];

/* ── CART STATE ── */
let cart = [
  { id: 1, name: 'Tomato', qty: '1 kg', price: 25, emoji: '🍅', count: 1 },
  { id: 7, name: 'Full Cream Milk', qty: '1 litre', price: 60, emoji: '🥛', count: 1 },
  { id: 3, name: 'Onion', qty: '1 kg', price: 22, emoji: '🧅', count: 1 },
];

/* ── TIMER ── */
let timerSeconds = 2 * 3600 + 45 * 60 + 30;
function startTimer() {
  const th = document.getElementById('th');
  const tm = document.getElementById('tm');
  const ts = document.getElementById('ts');
  if (!th) return;
  setInterval(() => {
    if (timerSeconds <= 0) { timerSeconds = 3 * 3600; return; }
    timerSeconds--;
    const h = Math.floor(timerSeconds / 3600);
    const m = Math.floor((timerSeconds % 3600) / 60);
    const s = timerSeconds % 60;
    th.textContent = String(h).padStart(2, '0');
    tm.textContent = String(m).padStart(2, '0');
    ts.textContent = String(s).padStart(2, '0');
  }, 1000);
}

/* ── NAVBAR SCROLL ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ── MOBILE MENU ── */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

/* ── PRODUCTS RENDER ── */
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    const count = inCart ? inCart.count : 0;
    return `
      <div class="product-card" data-id="${p.id}">
        <div class="pc-img">
          ${p.discount ? `<span class="pc-discount-badge">${p.discount} OFF</span>` : ''}
          ${p.best ? `<span class="pc-best-badge">⭐ Best</span>` : ''}
          <span style="font-size:64px">${p.emoji}</span>
        </div>
        <div class="pc-body">
          <div class="pc-name">${p.name}</div>
          <div class="pc-qty">${p.qty}</div>
          <div class="pc-meta">
            <span class="pc-rating">⭐ ${p.rating}</span>
            <span class="pc-eta">⚡ ${p.eta}</span>
          </div>
          <div class="pc-price-row">
            <span class="pc-price">₹${p.price}</span>
            ${p.original > p.price ? `<span class="pc-original">₹${p.original}</span>` : ''}
          </div>
        </div>
        ${count === 0
          ? `<button class="pc-add-btn" onclick="addToCart(${p.id})">+ Add to Cart</button>`
          : `<div class="pc-qty-ctrl active" id="ctrl-${p.id}">
              <button onclick="changeQty(${p.id}, -1)">−</button>
              <span class="pc-qty-num" id="qnum-${p.id}">${count}</span>
              <button onclick="changeQty(${p.id}, 1)">+</button>
            </div>`
        }
      </div>
    `;
  }).join('');
}

function filterProducts(cat) {
  // Update filter tab UI
  document.querySelectorAll('.ftab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === cat);
  });
  renderProducts(cat);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initFilterTabs() {
  document.querySelectorAll('.ftab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });
}

/* ── CART LOGIC ── */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.count++;
  } else {
    cart.push({ id: product.id, name: product.name, qty: product.qty, price: product.price, emoji: product.emoji, count: 1 });
  }
  updateCartCount();
  renderProducts(getCurrentFilter());
  renderCartItems();
  showToast(`${product.emoji} ${product.name} added to cart!`);
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.count += delta;
  if (item.count <= 0) {
    cart = cart.filter(c => c.id !== id);
    showToast('Item removed from cart');
  }
  updateCartCount();
  renderProducts(getCurrentFilter());
  renderCartItems();
}

function getCurrentFilter() {
  const active = document.querySelector('.ftab.active');
  return active ? active.dataset.filter : 'all';
}

function updateCartCount() {
  const total = cart.reduce((s, c) => s + c.count, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = total);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = `${total} item${total !== 1 ? 's' : ''}`;
}

function renderCartItems() {
  const body = document.getElementById('cartBody');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div style="text-align:center;padding:48px 24px;color:#9CA3AF">
        <div style="font-size:56px;margin-bottom:16px">🛒</div>
        <strong style="display:block;color:#374151;margin-bottom:8px">Your cart is empty</strong>
        <p style="font-size:14px">Add items to get started</p>
      </div>`;
    updateCartSummary();
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-img">${item.emoji}</div>
      <div class="ci-info">
        <strong>${item.name}</strong>
        <span>${item.qty}</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <span class="ci-price">₹${item.price * item.count}</span>
        <div class="ci-qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.count}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');

  updateCartSummary();
}

function updateCartSummary() {
  const subtotal = cart.reduce((s, c) => s + c.price * c.count, 0);
  const discount = Math.floor(subtotal * 0.15);
  const total = subtotal + 15 + 5 - discount;

  const el = id => document.getElementById(id);
  if (el('csSubtotal')) el('csSubtotal').textContent = `₹${subtotal}`;
  if (el('csDiscount')) el('csDiscount').textContent = `-₹${discount}`;
  if (el('csTotal')) el('csTotal').textContent = `₹${total}`;
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── MODALS ── */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function overlayClose(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

function openCheckout() {
  closeCart();
  setTimeout(() => openModal('checkoutModal'), 200);
}

function openTracking() {
  closeModal('successModal');
  setTimeout(() => openModal('trackingModal'), 200);
}

/* ── OTP FLOW ── */
function sendOTP() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (phone.length < 10) {
    showToast('⚠️ Enter a valid 10-digit number');
    return;
  }
  document.getElementById('step1').classList.add('hidden');
  document.getElementById('step2').classList.remove('hidden');
  document.getElementById('otpPhoneShow').textContent = phone;
  showToast(`📱 OTP sent to +91 ${phone}`);
  // Auto-focus first OTP box
  setTimeout(() => document.querySelector('.otp-box').focus(), 100);
}

function verifyOTP() {
  const boxes = document.querySelectorAll('.otp-box');
  const otp = [...boxes].map(b => b.value).join('');
  if (otp.length < 4) {
    showToast('⚠️ Enter complete 4-digit OTP');
    return;
  }
  closeModal('loginModal');
  showToast('✅ Login successful! Welcome to BoloKart');
  document.getElementById('loginBtn').textContent = 'My Account';
}

/* OTP box auto-advance */
function initOTPBoxes() {
  document.querySelectorAll('.otp-box').forEach((box, idx, all) => {
    box.addEventListener('input', () => {
      if (box.value && idx < all.length - 1) all[idx + 1].focus();
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && idx > 0) all[idx - 1].focus();
    });
  });
}

/* ── PLACE ORDER ── */
function placeOrder() {
  closeModal('checkoutModal');
  const orderId = `BK-${new Date().toLocaleDateString('en-GB', {day:'2-digit',month:'2-digit',year:'2-digit'}).replace(/\//g,'')}-A-${String(Math.floor(Math.random()*900)+100)}`;
  document.getElementById('successOID').textContent = orderId;
  setTimeout(() => openModal('successModal'), 300);
  cart = [];
  updateCartCount();
  renderCartItems();
  renderProducts(getCurrentFilter());
}

/* ── VENDOR / RIDER FORMS ── */
function submitForm(modalId) {
  const modal = document.getElementById(modalId);
  const inputs = modal.querySelectorAll('.form-inp');
  let valid = true;
  inputs.forEach(inp => {
    if (inp.tagName !== 'SELECT' && !inp.value.trim()) {
      inp.style.borderColor = '#EF4444';
      valid = false;
      setTimeout(() => inp.style.borderColor = '', 2000);
    }
  });
  if (!valid) { showToast('⚠️ Please fill in all fields'); return; }
  closeModal(modalId);
  showToast(modalId === 'vendorModal'
  ? "✅ Vendor application submitted! We'll call you within 24 hours."
  : "✅ Rider application received! Team will contact you soon."
);
}

/* ── WHATSAPP CHAT ANIMATION ── */
const WA_MESSAGES = [
  { type: 'received', text: 'नमस्ते! BoloKart में स्वागत है 🙏\nआज क्या चाहिए आपको?' },
  { type: 'sent', text: '1 kg aalu aur 2 litre doodh bhejo' },
  { type: 'received', text: '✅ Order noted!\n🥔 Aalu 1kg — ₹25\n🥛 Doodh 2L — ₹60\nTotal: <strong>₹85</strong>\nDelivery in <strong>10 mins</strong> 🛵' },
  { type: 'sent', text: 'COD mein milega na?' },
  { type: 'received', text: '✅ Haan bilkul! Cash on Delivery available hai. Order confirm karein?' },
  { type: 'sent', text: 'Ha, confirm karo!' },
  { type: 'received', text: '🎉 Order Confirmed! #BK-130526-A-001\nRider Nadim on the way!\nEstimated: <strong>10 mins</strong> 🛵' },
];

function animateWAChat() {
  const body = document.getElementById('waBody');
  if (!body) return;
  body.innerHTML = '';
  let i = 0;
  function addMsg() {
    if (i >= WA_MESSAGES.length) {
      // Restart after delay
      setTimeout(() => { body.innerHTML = ''; i = 0; addMsg(); }, 4000);
      return;
    }
    const msg = WA_MESSAGES[i];
    const div = document.createElement('div');
    div.className = `wa-msg ${msg.type}`;
    div.innerHTML = msg.text.replace(/\n/g, '<br/>');
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    i++;
    setTimeout(addMsg, 1200);
  }
  setTimeout(addMsg, 800);
}

/* ── INTERSECTION OBSERVER for scroll animations ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.cat-card, .product-card, .step-card, .benefit-card, .testi-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });
}

// CSS class for visible state
const style = document.createElement('style');
style.textContent = '.cat-card.visible,.product-card.visible,.step-card.visible,.benefit-card.visible,.testi-card.visible{opacity:1!important;transform:translateY(0)!important}';
document.head.appendChild(style);

/* ── TOAST ── */
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── SEARCH ── */
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) { renderProducts(getCurrentFilter()); return; }
    const grid = document.getElementById('productsGrid');
    const results = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    grid.innerHTML = results.length === 0
      ? `<div style="grid-column:1/-1;text-align:center;padding:48px;color:#9CA3AF"><div style="font-size:48px;margin-bottom:12px">🔍</div><strong style="color:#374151">No results for "${q}"</strong></div>`
      : results.map(p => `
          <div class="product-card visible" data-id="${p.id}">
            <div class="pc-img">
              ${p.discount ? `<span class="pc-discount-badge">${p.discount} OFF</span>` : ''}
              ${p.best ? `<span class="pc-best-badge">⭐ Best</span>` : ''}
              <span style="font-size:64px">${p.emoji}</span>
            </div>
            <div class="pc-body">
              <div class="pc-name">${p.name}</div>
              <div class="pc-qty">${p.qty}</div>
              <div class="pc-meta">
                <span class="pc-rating">⭐ ${p.rating}</span>
                <span class="pc-eta">⚡ ${p.eta}</span>
              </div>
              <div class="pc-price-row">
                <span class="pc-price">₹${p.price}</span>
                ${p.original > p.price ? `<span class="pc-original">₹${p.original}</span>` : ''}
              </div>
            </div>
            <button class="pc-add-btn" onclick="addToCart(${p.id})">+ Add to Cart</button>
          </div>`).join('');
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ── PAYMENT OPTION TOGGLE ── */
function initPaymentOptions() {
  document.querySelectorAll('.pay-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.pay-opt').forEach(o => o.classList.remove('active-opt'));
      opt.classList.add('active-opt');
    });
  });
}

/* ── SMOOTH SCROLL for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        document.getElementById('mobileMenu').classList.remove('open');
      }
    });
  });
}

/* ── STAGGERED CARD ANIMATIONS ── */
function staggerCards(selector, delay = 60) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${i * delay}ms`;
  });
}

/* ── ACTIVE NAV LINK on scroll ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });
}

/* ── VENDOR MODAL open helper ── */
function openVendorModal() { openModal('vendorModal'); }
function openRiderModal() { openModal('riderModal'); }

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  startTimer();
  initNavbar();
  renderProducts();
  renderCartItems();
  updateCartCount();
  initFilterTabs();
  initOTPBoxes();
  initSearch();
  initPaymentOptions();
  initSmoothScroll();
  initActiveNav();
  animateWAChat();

  // Stagger animations
  staggerCards('.cat-card', 50);
  staggerCards('.product-card', 40);
  staggerCards('.step-card', 80);
  staggerCards('.benefit-card', 60);

  // Kick off scroll animations after a brief paint delay
  requestAnimationFrame(() => setTimeout(initScrollAnimations, 100));

  // Keyboard: Escape closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
      closeCart();
    }
  });

  console.log('%c🛒 BoloKart loaded successfully!', 'color:#16A34A;font-weight:bold;font-size:14px');
  console.log('%cBuilt by Sahid Ansari — BoloKart Startup, Sahibganj, Jharkhand', 'color:#6B7280;font-size:12px');
});
