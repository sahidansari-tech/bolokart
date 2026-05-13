
/* ============================================
   PRODUCT DATA
   ============================================ */
const allProducts = [
  // GROCERY
  { id:1, name:'Aashirvaad Atta', weight:'5 kg', price:245, original:275, discount:11, emoji:'🌾', cat:'Grocery', rating:4.8, reviews:234, tag:'Best Seller', delivery:'16 min' },
  { id:2, name:'India Gate Basmati Rice', weight:'1 kg', price:89, original:105, discount:15, emoji:'🍚', cat:'Grocery', rating:4.7, reviews:189, tag:'15% OFF', delivery:'14 min' },
  { id:3, name:'Tata Salt', weight:'1 kg', price:24, original:28, discount:14, emoji:'🧂', cat:'Grocery', rating:4.9, reviews:412, tag:null, delivery:'12 min' },
  { id:4, name:'Fortune Sunflower Oil', weight:'1 L', price:145, original:168, discount:14, emoji:'🫒', cat:'Grocery', rating:4.6, reviews:156, tag:'HOT', delivery:'18 min' },
  { id:5, name:'Patanjali Honey', weight:'500g', price:175, original:200, discount:13, emoji:'🍯', cat:'Grocery', rating:4.8, reviews:98, tag:null, delivery:'15 min' },
  { id:6, name:'MDH Garam Masala', weight:'100g', price:85, original:95, discount:11, emoji:'🌶️', cat:'Grocery', rating:4.7, reviews:267, tag:null, delivery:'13 min' },
  // DAIRY
  { id:7, name:'Amul Full Cream Milk', weight:'1 L', price:28, original:32, discount:13, emoji:'🥛', cat:'Dairy', rating:4.9, reviews:521, tag:'Fresh', delivery:'10 min' },
  { id:8, name:'Amul Butter', weight:'500g', price:265, original:290, discount:9, emoji:'🧈', cat:'Dairy', rating:4.9, reviews:445, tag:'Popular', delivery:'12 min' },
  { id:9, name:'Amul Cheese Slices', weight:'200g', price:95, original:110, discount:14, emoji:'🧀', cat:'Dairy', rating:4.6, reviews:134, tag:null, delivery:'14 min' },
  { id:10, name:'Mother Dairy Curd', weight:'400g', price:38, original:45, discount:16, emoji:'🥣', cat:'Dairy', rating:4.7, reviews:178, tag:'Fresh', delivery:'11 min' },
  // SNACKS
  { id:11, name:'Parle-G Biscuits', weight:'800g', price:55, original:65, discount:15, emoji:'🍪', cat:'Snacks', rating:4.8, reviews:634, tag:'All-Time Fav', delivery:'10 min' },
  { id:12, name:'Lays Classic Chips', weight:'90g', price:30, original:35, discount:14, emoji:'🥔', cat:'Snacks', rating:4.6, reviews:289, tag:null, delivery:'12 min' },
  { id:13, name:'Haldiram Bhujia', weight:'400g', price:95, original:110, discount:14, emoji:'🌿', cat:'Snacks', rating:4.8, reviews:342, tag:'HOT', delivery:'15 min' },
  { id:14, name:'Maggi Noodles Pack', weight:'560g (4pk)', price:72, original:85, discount:15, emoji:'🍜', cat:'Snacks', rating:4.9, reviews:891, tag:'Trending', delivery:'10 min' },
  // BEVERAGES
  { id:15, name:'Coca-Cola 2L', weight:'2 L', price:65, original:75, discount:13, emoji:'🥤', cat:'Beverages', rating:4.7, reviews:234, tag:null, delivery:'14 min' },
  { id:16, name:'Real Fruit Juice', weight:'1 L', price:85, original:100, discount:15, emoji:'🧃', cat:'Beverages', rating:4.6, reviews:167, tag:null, delivery:'16 min' },
  { id:17, name:'Bisleri Water', weight:'1 L', price:20, original:22, discount:9, emoji:'💧', cat:'Beverages', rating:4.8, reviews:312, tag:null, delivery:'8 min' },
  // FRESH
  { id:18, name:'Farm Fresh Eggs', weight:'12 pcs', price:84, original:95, discount:12, emoji:'🥚', cat:'Dairy', rating:4.9, reviews:445, tag:'Fresh', delivery:'12 min' },
  { id:19, name:'Banana Bunch', weight:'~500g', price:35, original:40, discount:13, emoji:'🍌', cat:'Fruits', rating:4.7, reviews:189, tag:'Fresh', delivery:'14 min' },
  { id:20, name:'Tomatoes', weight:'500g', price:25, original:30, discount:17, emoji:'🍅', cat:'Vegetables', rating:4.6, reviews:234, tag:null, delivery:'12 min' },
  { id:21, name:'Onions', weight:'1 kg', price:30, original:38, discount:21, emoji:'🧅', cat:'Vegetables', rating:4.5, reviews:178, tag:null, delivery:'11 min' },
  { id:22, name:'Britannia Bread', weight:'400g', price:35, original:40, discount:13, emoji:'🍞', cat:'Bakery', rating:4.7, reviews:312, tag:'Fresh Daily', delivery:'12 min' },
];

const tabProducts = {
  trending: [11,14,7,8,1,4,13,12,18,15,22,17],
  bestsellers: [7,11,8,1,14,18,3,12,2,10,17,13],
  essentials: [7,3,18,1,11,17,21,20,22,8,2,6],
  fresh: [18,19,20,21,10,7,22,9,5,15,16,14],
  deals: [2,4,13,14,20,11,16,21,9,12,6,17],
};

/* ============================================
   CART STATE
   ============================================ */
let cart = {};

function getCartItems() {
  return Object.values(cart).filter(i => i.qty > 0);
}
function getCartCount() {
  return getCartItems().reduce((s,i) => s+i.qty, 0);
}
function getCartSubtotal() {
  return getCartItems().reduce((s,i) => s + i.price*i.qty, 0);
}

function updateCartBadge() {
  const count = getCartCount();
  const badge = document.getElementById('cartBadge');
  badge.textContent = count;
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
}

function addToCart(productId) {
  const p = allProducts.find(p => p.id === productId);
  if (!p) return;
  if (!cart[productId]) cart[productId] = { ...p, qty: 0 };
  cart[productId].qty++;
  updateCartBadge();
  renderCartItems();
  renderProductGrid(currentTab);
  showToast(`${p.emoji} ${p.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
  if (!cart[productId]) return;
  cart[productId].qty = Math.max(0, cart[productId].qty - 1);
  if (cart[productId].qty === 0) delete cart[productId];
  updateCartBadge();
  renderCartItems();
  renderProductGrid(currentTab);
}

function getQty(productId) {
  return cart[productId]?.qty || 0;
}

/* ============================================
   RENDER PRODUCTS
   ============================================ */
let currentTab = 'trending';

function renderProductGrid(tab) {
  currentTab = tab;
  const ids = tabProducts[tab] || tabProducts.trending;
  const products = ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
  const grid = document.getElementById('productGrid');
  grid.innerHTML = products.map(p => productCardHTML(p)).join('');
}

function productCardHTML(p) {
  const qty = getQty(p.id);
  const stockDot = `<div class="pc-stock-dot"></div>`;
  const badgeHTML = p.tag ? `<div class="pc-badge">${p.tag}</div>` : '';
  const priceBlock = `<div class="pc-price-block"><div class="pc-price">₹${p.price}</div><div class="pc-original">₹${p.original}</div></div>`;
  const addControl = qty === 0
    ? `<button class="pc-add-btn" onclick="addToCart(${p.id})">+</button>`
    : `<div class="pc-qty-ctrl">
        <button class="pc-qty-btn" onclick="removeFromCart(${p.id})">−</button>
        <span class="pc-qty-num">${qty}</span>
        <button class="pc-qty-btn" onclick="addToCart(${p.id})">+</button>
       </div>`;
  return `
    <div class="product-card" id="pc-${p.id}">
      <div class="pc-img-wrap">
        <span class="pc-emoji">${p.emoji}</span>
        ${badgeHTML}
        ${stockDot}
      </div>
      <div class="pc-body">
        <div class="pc-delivery">${p.delivery}</div>
        <div class="pc-name">${p.name}</div>
        <div class="pc-weight">${p.weight}</div>
        <div class="pc-rating">
          <span class="stars">★</span>
          <span>${p.rating}</span>
          <span class="count">(${p.reviews})</span>
        </div>
        <div class="pc-price-row">
          ${priceBlock}
          ${addControl}
        </div>
      </div>
    </div>
  `;
}

function switchTab(btn, tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProductGrid(tab);
}

function filterCategory(cat) {
  const matching = allProducts.filter(p => p.cat === cat).map(p => p.id);
  if (matching.length === 0) { showToast(`More ${cat} items coming soon!`, 'success'); return; }
  const grid = document.getElementById('productGrid');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  grid.innerHTML = matching.map(id => {
    const p = allProducts.find(pp => pp.id === id);
    return p ? productCardHTML(p) : '';
  }).join('');
  document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`Showing ${cat} products`, 'success');
}

/* ============================================
   RENDER CART
   ============================================ */
function renderCartItems() {
  const items = getCartItems();
  const list = document.getElementById('cartItemsList');
  const empty = document.getElementById('cartEmpty');
  const summary = document.getElementById('cartSummary');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (items.length === 0) {
    list.innerHTML = `<div class="cart-empty" id="cartEmpty">
      <div class="cart-empty-icon">🛒</div>
      <div class="cart-empty-text">Cart khali hai!</div>
      <div class="cart-empty-sub">Kuch add karo na...</div>
    </div>`;
    summary.style.display = 'none';
    checkoutBtn.style.display = 'none';
    return;
  }

  list.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-weight">${item.weight}</div>
        <div class="ci-price">₹${item.price * item.qty}</div>
      </div>
      <div class="ci-controls">
        <button class="ci-btn" onclick="removeFromCart(${item.id})">−</button>
        <span class="ci-qty">${item.qty}</span>
        <button class="ci-btn" onclick="addToCart(${item.id})">+</button>
      </div>
    </div>
  `).join('');

  const subtotal = getCartSubtotal();
  document.getElementById('cs-subtotal').textContent = `₹${subtotal}`;
  document.getElementById('cs-discount').textContent = `-₹${couponApplied ? Math.round(subtotal*0.1) : 0}`;
  document.getElementById('cs-total').textContent = `₹${couponApplied ? Math.round(subtotal*0.9) : subtotal}`;

  summary.style.display = 'block';
  checkoutBtn.style.display = 'block';
}

/* ============================================
   CART OPEN/CLOSE
   ============================================ */
function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartSidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartSidebar').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('cartBtn').addEventListener('click', openCart);

/* ============================================
   COUPON
   ============================================ */
let couponApplied = false;
function applyCoupon() {
  const val = document.getElementById('couponInput').value.trim().toUpperCase();
  if (val === 'BOLO100' || val === 'SAVE10') {
    couponApplied = true;
    showToast('🎉 Coupon applied! 10% off', 'success');
    renderCartItems();
  } else {
    showToast('❌ Invalid coupon code', 'error');
  }
}

/* ============================================
   CHECKOUT
   ============================================ */
function openCheckout() {
  closeCart();
  const subtotal = getCartSubtotal();
  const total = couponApplied ? Math.round(subtotal*0.9) : subtotal;
  document.getElementById('osm-items').textContent = `${getCartCount()} items`;
  document.getElementById('osm-subtotal').textContent = `₹${subtotal}`;
  document.getElementById('osm-total').textContent = `₹${total}`;
  document.getElementById('checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}
function selectPayment(el) {
  document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

/* ============================================
   PLACE ORDER
   ============================================ */
let orderCount = 1;
function placeOrder() {
  closeCheckout();
  const date = new Date();
  const mm = String(date.getMonth()+1).padStart(2,'0');
  const dd = String(date.getDate()).padStart(2,'0');
  const yy = String(date.getFullYear()).slice(-2);
  const orderId = `BK-${mm}${dd}${yy}-A-${String(orderCount++).padStart(3,'0')}`;
  document.getElementById('successOrderId').textContent = orderId;
  document.getElementById('success-screen').classList.add('open');
  document.body.style.overflow = 'hidden';
  cart = {};
  updateCartBadge();
  renderProductGrid(currentTab);
}
function closeSuccess() {
  document.getElementById('success-screen').classList.remove('open');
  document.body.style.overflow = '';
  renderCartItems();
}

/* ============================================
   SEARCH
   ============================================ */
const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');

searchInput.addEventListener('focus', () => searchDropdown.classList.add('show'));
searchInput.addEventListener('blur', () => setTimeout(() => searchDropdown.classList.remove('show'), 200));
searchInput.addEventListener('input', function() {
  const val = this.value.trim().toLowerCase();
  if (val.length > 0) {
    const matching = allProducts.filter(p => p.name.toLowerCase().includes(val)).slice(0,4);
    if (matching.length > 0) {
      searchDropdown.innerHTML = `<div class="search-section-label">🔍 Results</div>` +
        matching.map(p => `<div class="search-item" onclick="selectSearch('${p.name}')"><span class="search-item-icon">${p.emoji}</span>${p.name} <span style="margin-left:auto;font-size:0.8rem;color:var(--green);font-weight:700">₹${p.price}</span></div>`).join('');
    }
  } else {
    searchDropdown.innerHTML = `
      <div class="search-section-label">🔥 Trending Now</div>
      <div class="search-item" onclick="selectSearch('Amul Butter')"><span class="search-item-icon">🧈</span> Amul Butter<span class="search-item-tag">HOT</span></div>
      <div class="search-item" onclick="selectSearch('Britannia Bread')"><span class="search-item-icon">🍞</span> Britannia Bread</div>
      <div class="search-item" onclick="selectSearch('Tata Salt')"><span class="search-item-icon">🧂</span> Tata Salt<span class="search-item-tag">OFFER</span></div>
      <div class="search-item" onclick="selectSearch('Parle-G Biscuits')"><span class="search-item-icon">🍪</span> Parle-G Biscuits</div>
    `;
  }
});
function selectSearch(term) {
  searchInput.value = term;
  searchDropdown.classList.remove('show');
  const matching = allProducts.filter(p => p.name.toLowerCase().includes(term.toLowerCase()));
  if (matching.length > 0) {
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const grid = document.getElementById('productGrid');
      grid.innerHTML = matching.map(p => productCardHTML(p)).join('');
      showToast(`🔍 Showing results for "${term}"`, 'success');
    }, 400);
  }
}

/* ============================================
   NAVBAR SCROLL
   ============================================ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  if (!target) return;
  const suffix = el.querySelector('span')?.textContent || '';
  let current = 0;
  const step = Math.ceil(target / 50);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.childNodes[0].textContent = current;
    if (current >= target) clearInterval(interval);
  }, 30);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ============================================
   TOAST
   ============================================ */
function showToast(msg, type='success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type==='success'?'✓':'✕'}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ============================================
   SCROLL HELPERS
   ============================================ */
function scrollToProducts() {
  document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}
function scrollToEco() {
  document.getElementById('ecoSection').scrollIntoView({ behavior: 'smooth' });
}

/* ============================================
   LOADING SCREEN
   ============================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

/* ============================================
   INIT
   ============================================ */
renderProductGrid('trending');

