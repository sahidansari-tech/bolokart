/* ═══════════════════════════════════════════
   BOLOKART — app.js v3
   Fixes: search→panel, address system, account page,
   category filter, empty cart on refresh, coupon UI,
   production checkout
═══════════════════════════════════════════ */
'use strict';

/* ─── PRODUCTS DATABASE ─── */
const PRODUCTS = [
  {id:1,  name:'Aashirvaad Atta',     w:'5 kg',   price:269, mrp:295, emoji:'🌾', cat:'atta',       disc:'9%' },
  {id:2,  name:'India Gate Rice',     w:'5 kg',   price:320, mrp:360, emoji:'🍚', cat:'atta',       disc:'11%'},
  {id:3,  name:'Toor Dal',            w:'1 kg',   price:112, mrp:130, emoji:'🫘', cat:'dal',        disc:'14%'},
  {id:4,  name:'Moong Dal',           w:'500 g',  price:58,  mrp:70,  emoji:'🟡', cat:'dal',        disc:'17%'},
  {id:5,  name:'Fortune Sunlite Oil', w:'1 L',    price:125, mrp:145, emoji:'🫙', cat:'oil',        disc:'14%'},
  {id:6,  name:'Amul Ghee',           w:'500 ml', price:280, mrp:310, emoji:'🧈', cat:'oil',        disc:'10%'},
  {id:7,  name:'Tata Tea Premium',    w:'100 g',  price:55,  mrp:62,  emoji:'🍵', cat:'tea',        disc:'11%'},
  {id:8,  name:'Red Label Tea',       w:'250 g',  price:115, mrp:130, emoji:'☕', cat:'tea',        disc:'12%'},
  {id:9,  name:'Amul Taaza Milk',     w:'1 L',    price:56,  mrp:56,  emoji:'🥛', cat:'dairy',      disc:null },
  {id:10, name:'Amul Dahi',           w:'1 kg',   price:60,  mrp:68,  emoji:'🍶', cat:'dairy',      disc:'12%'},
  {id:11, name:'Amul Butter',         w:'100 g',  price:55,  mrp:60,  emoji:'🧈', cat:'dairy',      disc:'8%' },
  {id:12, name:'Parle-G Biscuits',    w:'250 g',  price:18,  mrp:20,  emoji:'🍪', cat:'snacks',     disc:'10%'},
  {id:13, name:'Lays Classic',        w:'90 g',   price:20,  mrp:20,  emoji:'🍟', cat:'snacks',     disc:null },
  {id:14, name:'Good Day Biscuit',    w:'200 g',  price:30,  mrp:35,  emoji:'🍘', cat:'snacks',     disc:'14%'},
  {id:15, name:'Fresh Tomato',        w:'1 kg',   price:30,  mrp:40,  emoji:'🍅', cat:'vegetables', disc:'25%'},
  {id:16, name:'Potato (Aalu)',       w:'1 kg',   price:22,  mrp:30,  emoji:'🥔', cat:'vegetables', disc:'27%'},
  {id:17, name:'Onion (Pyaaz)',       w:'1 kg',   price:25,  mrp:35,  emoji:'🧅', cat:'vegetables', disc:'29%'},
  {id:18, name:'Surf Excel Matic',    w:'1 kg',   price:165, mrp:185, emoji:'🧺', cat:'cleaning',   disc:'11%'},
  {id:19, name:'Lifebuoy Soap',       w:'100 g',  price:32,  mrp:38,  emoji:'🧼', cat:'cleaning',   disc:'16%'},
];

const COUPONS = {
  'BK20':   { type:'percent', value:20, label:'20% off' },
  'FIRST50':{ type:'flat',    value:50, label:'₹50 off' },
  'SAVE30': { type:'percent', value:30, label:'30% off' },
};

const KEYWORD_MAP = {
  aalu:'Potato (Aalu)',alu:'Potato (Aalu)',potato:'Potato (Aalu)',
  doodh:'Amul Taaza Milk',milk:'Amul Taaza Milk',
  chai:'Tata Tea Premium',tea:'Tata Tea Premium',
  atta:'Aashirvaad Atta',aata:'Aashirvaad Atta',
  dal:'Toor Dal',daal:'Toor Dal',
  pyaz:'Onion (Pyaaz)',onion:'Onion (Pyaaz)',pyaaz:'Onion (Pyaaz)',
  tamatar:'Fresh Tomato',tomato:'Fresh Tomato',
  dahi:'Amul Dahi',curd:'Amul Dahi',
  parle:'Parle-G Biscuits',biscuit:'Parle-G Biscuits',
  tel:'Fortune Sunlite Oil',oil:'Fortune Sunlite Oil',
  ghee:'Amul Ghee',
  sabun:'Lifebuoy Soap',soap:'Lifebuoy Soap',
  chawal:'India Gate Rice',rice:'India Gate Rice',
  butter:'Amul Butter',makhan:'Amul Butter',
};

/* ─── STATE (no default cart items) ─── */
let cart = [];                  // FIX: empty on load
let currentFilter = 'all';
let currentUser   = null;       // null = logged out
let appliedCoupon = null;       // FIX: no auto-apply
let productModalQty = 1;
let isRecording = false;
let speechRec = null;
let otpTimer = null;

/* Saved addresses state */
let savedAddresses = [
  { id:1, type:'Home', name:'Sahid Ansari', phone:'+91 99999 00000', full:'Srikund Village, Sahibganj – 816101, Jharkhand', selected:true },
];
let selectedAddressId = 1;

/* Past orders (demo) */
const PAST_ORDERS = [
  { id:'BK-130526-A-042', items:'Tata Tea, Amul Milk, Parle-G', total:'₹131', status:'Delivered', date:'13 May 2026' },
  { id:'BK-120526-A-031', items:'Potato, Onion, Tomato', total:'₹77',  status:'Delivered', date:'12 May 2026' },
];

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSearch();
  renderProducts('all');
  updateCartUI();
  initCategoryTabs();
  initSidebarCats();
  initOTPBoxes();
  initPaymentOpts();
  initKeyboard();
  renderSavedAddresses();

  // Close account menu on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.account-dropdown')) closeAccountMenu();
    if (!e.target.closest('.nav-search-wrap')) closeSearchPanel();
  });
});

/* ─── NAVBAR ─── */
function initNavbar() {
  const nb = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nb.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,.1)' : '';
  }, { passive:true });
}
function toggleMobileMenu() {
  document.getElementById('mobileNav').classList.toggle('open');
}

/* ─── SEARCH — results shown ON PAGE, not cart ─── */
function initSearch() {
  const input  = document.getElementById('searchInput');
  const panel  = document.getElementById('searchPanel');
  const clrBtn = document.getElementById('searchClearBtn');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    clrBtn.classList.toggle('show', q.length > 0);
    if (!q) { closeSearchPanel(); return; }

    const hits = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.cat.includes(q) ||
      p.w.toLowerCase().includes(q)
    ).slice(0, 8);

    renderSearchPanel(hits, q);
    panel.classList.add('open');
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) panel.classList.add('open');
  });
}

function renderSearchPanel(hits, q) {
  const panel = document.getElementById('searchPanel');
  if (!hits.length) {
    panel.innerHTML = `<div class="srp-empty">No results for "<strong>${q}</strong>"<br/><small>Try: aalu, doodh, chai, atta</small></div>`;
    return;
  }
  const header = `<div class="srp-header"><span>${hits.length} result${hits.length>1?'s':''} found</span><button onclick="jumpToProducts('${q}');closeSearchPanel()">View all in products ↓</button></div>`;
  const items  = hits.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    const count  = inCart ? inCart.count : 0;
    const ctrl   = count === 0
      ? `<button class="srp-add-btn" onclick="addToCart(${p.id});event.stopPropagation()">+ Add</button>`
      : `<div class="srp-qty-ctrl">
           <button onclick="changeQty(${p.id},-1);renderSearchPanelLive();event.stopPropagation()">−</button>
           <span>${count}</span>
           <button onclick="addToCart(${p.id});renderSearchPanelLive();event.stopPropagation()">+</button>
         </div>`;
    return `
      <div class="srp-item" onclick="openProductModal(${p.id})">
        <div class="srp-emoji">${p.emoji}</div>
        <div class="srp-info">
          <div class="srp-name">${p.name}</div>
          <div class="srp-meta">${p.w}${p.disc ? ` · <span style="color:var(--red);font-weight:700">${p.disc} OFF</span>` : ''}</div>
        </div>
        <div class="srp-right">
          <div>
            <span class="srp-price">₹${p.price}</span>
            ${p.mrp > p.price ? `<span class="srp-mrp">₹${p.mrp}</span>` : ''}
          </div>
          ${ctrl}
        </div>
      </div>`;
  }).join('');
  const footer = `<a class="srp-view-all" href="#products" onclick="closeSearchPanel()">See all products ↓</a>`;
  panel.innerHTML = header + items + footer;
}

function renderSearchPanelLive() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!q) return;
  const hits = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.cat.includes(q)
  ).slice(0, 8);
  renderSearchPanel(hits, q);
}

function closeSearchPanel() {
  const panel = document.getElementById('searchPanel');
  if (panel) panel.classList.remove('open');
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClearBtn').classList.remove('show');
  closeSearchPanel();
}

function jumpToProducts(q) {
  document.getElementById('products')?.scrollIntoView({ behavior:'smooth' });
  // filter products by search query
  const matching = PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
  if (matching.length) {
    const grid = document.getElementById('productsGrid');
    if (grid) renderProductsToGrid(matching);
    const title = document.getElementById('prodAreaTitle');
    if (title) title.textContent = `Search: "${q}"`;
  }
}

/* ─── PRODUCTS ─── */
function renderProducts(cat) {
  currentFilter = cat || 'all';
  const list = currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === currentFilter);

  // update sidebar active
  document.querySelectorAll('.sl-item').forEach(el =>
    el.classList.toggle('active', el.dataset.cat === currentFilter)
  );
  document.querySelectorAll('.esc-btn').forEach(el =>
    el.classList.toggle('active', el.dataset.cat === currentFilter)
  );

  const LABELS = {
    all:'Top picks for you', atta:'Atta & Rice', oil:'Oil & Ghee',
    tea:'Tea & Coffee', dal:'Dals & Pulses', dairy:'Dairy Products',
    snacks:'Snacks & Biscuits', vegetables:'Fruits & Vegetables', cleaning:'Cleaning & Soap',
  };
  const title = document.getElementById('prodAreaTitle');
  if (title) title.textContent = LABELS[currentFilter] || 'Products';
  const cnt = document.getElementById('prodCount');
  if (cnt) cnt.textContent = `${list.length} items`;

  renderProductsToGrid(list);
}

function renderProductsToGrid(list) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400)"><div style="font-size:40px;margin-bottom:10px">🔍</div><strong>No items found</strong></div>`;
    return;
  }
  grid.innerHTML = list.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    const count  = inCart ? inCart.count : 0;
    return `
      <div class="prod-card" id="pcard-${p.id}">
        <div class="pc-img-zone" onclick="openProductModal(${p.id})">
          ${p.disc ? `<span class="pc-disc-tag">${p.disc} OFF</span>` : ''}
          <span>${p.emoji}</span>
        </div>
        <div class="pc-body-zone" onclick="openProductModal(${p.id})">
          <div class="pc-pname">${p.name}</div>
          <div class="pc-pwt">${p.w}</div>
        </div>
        <div class="pc-row">
          <span class="pc-price-val">₹${p.price}</span>
          ${p.mrp > p.price ? `<span class="pc-mrp-val">₹${p.mrp}</span>` : ''}
        </div>
        <div class="pc-controls">
          <button class="pc-add-btn" id="padd-${p.id}" onclick="addToCart(${p.id})" style="${count>0?'display:none':''}">+ Add</button>
          <div class="pc-qty-ctrl ${count>0?'show':''}" id="pqc-${p.id}">
            <button onclick="changeQty(${p.id},-1)">−</button>
            <span class="pc-qty-num" id="pqn-${p.id}">${count}</span>
            <button onclick="addToCart(${p.id})">+</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function filterProducts(cat) {
  renderProducts(cat);
  document.getElementById('products')?.scrollIntoView({ behavior:'smooth', block:'start' });
}

function initCategoryTabs() {
  document.querySelectorAll('.esc-btn').forEach(btn => {
    btn.addEventListener('click', () => filterProducts(btn.dataset.cat));
  });
}
function initSidebarCats() {
  document.querySelectorAll('.sl-item').forEach(el => {
    el.addEventListener('click', () => filterProducts(el.dataset.cat));
  });
}

/* ─── CART OPERATIONS ─── */
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.count++;
  else cart.push({ ...p, count:1 });
  updateCartUI();
  updateProductCardUI(id);
  renderSearchPanelLive();
  showToast(`✅ ${p.emoji} ${p.name} added!`);
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.count += delta;
  if (item.count <= 0) {
    cart = cart.filter(c => c.id !== id);
    showToast('🗑 Item removed');
  }
  updateCartUI();
  updateProductCardUI(id);
  renderSearchPanelLive();
  if (document.getElementById('cartDrawer').classList.contains('open')) renderCartItems();
}

function updateProductCardUI(id) {
  const item = cart.find(c => c.id === id);
  const count = item ? item.count : 0;
  const addBtn = document.getElementById(`padd-${id}`);
  const qtyCtrl = document.getElementById(`pqc-${id}`);
  const qtyNum  = document.getElementById(`pqn-${id}`);
  if (addBtn)  addBtn.style.display  = count > 0 ? 'none' : '';
  if (qtyCtrl) qtyCtrl.classList.toggle('show', count > 0);
  if (qtyNum)  qtyNum.textContent = count;
}

function updateCartUI() {
  const total = cart.reduce((s, c) => s + c.count, 0);
  const dot = document.getElementById('cartCount');
  if (dot) {
    dot.textContent = total;
    dot.style.display = total > 0 ? 'flex' : 'none';
  }
  const badge = document.getElementById('cdBadge');
  if (badge) badge.textContent = `${total} item${total !== 1 ? 's' : ''}`;
}

function calcTotals() {
  const subtotal = cart.reduce((s, c) => s + c.price * c.count, 0);
  let discount = 0;
  if (appliedCoupon) {
    const c = COUPONS[appliedCoupon];
    discount = c.type === 'percent' ? Math.floor(subtotal * c.value / 100) : Math.min(c.value, subtotal);
  }
  const delivery = cart.length > 0 ? 15 : 0;
  const total = subtotal + delivery - discount;
  return { subtotal, discount, delivery, total };
}

function renderCartItems() {
  const body = document.getElementById('cdBody');
  if (!body) return;
  if (!cart.length) {
    body.innerHTML = `
      <div class="cd-empty">
        <div class="cd-empty-ico">🛒</div>
        <strong>Your cart is empty</strong>
        <p>Add items from the product list</p>
      </div>`;
    renderCartFooter();
    return;
  }
  body.innerHTML = cart.map(item => `
    <div class="ci">
      <div class="ci-emo">${item.emoji}</div>
      <div class="ci-info">
        <strong>${item.name}</strong>
        <span>${item.w}</span>
      </div>
      <div class="ci-right">
        <span class="ci-price">₹${item.price * item.count}</span>
        <div class="ci-qctrl">
          <button onclick="changeQty(${item.id},-1)">−</button>
          <span class="ci-num">${item.count}</span>
          <button onclick="addToCart(${item.id})">+</button>
        </div>
      </div>
    </div>`).join('');
  renderCartFooter();
}

function renderCartFooter() {
  const ftr = document.getElementById('cdFooter');
  if (!ftr) return;
  if (!cart.length) { ftr.innerHTML = ''; return; }
  const { subtotal, discount, delivery, total } = calcTotals();
  ftr.innerHTML = `
    <div class="cd-totals">
      <div class="cd-tot-row"><span>Item Total</span><span>₹${subtotal}</span></div>
      <div class="cd-tot-row"><span>Delivery Fee</span><span>₹${delivery}</span></div>
      ${discount > 0 ? `<div class="cd-tot-row" style="color:var(--g);font-weight:600"><span>Coupon (${appliedCoupon})</span><span>-₹${discount}</span></div>` : ''}
      <div class="cd-tot-row final-row"><span>Total</span><strong>₹${total}</strong></div>
    </div>
    <button class="btn-green-fw" onclick="openCheckout()">Proceed to Checkout →</button>
    <p class="cd-secure">🔒 Safe & Secure Checkout</p>`;
}

function openCart() {
  renderCartItems();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── PRODUCT MODAL ─── */
function openProductModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  productModalQty = cart.find(c => c.id === id)?.count || 1;
  const content = document.getElementById('prodModalContent');
  content.innerHTML = `
    <div class="pm-emoji">${p.emoji}</div>
    <div>
      <div class="pm-name">${p.name}</div>
      <div class="pm-weight">${p.w}</div>
      <div class="pm-price-row">
        <span class="pm-price">₹${p.price}</span>
        ${p.mrp > p.price ? `<span class="pm-mrp">₹${p.mrp}</span>` : ''}
        ${p.disc ? `<span class="pm-disc">${p.disc} OFF</span>` : ''}
      </div>
      <div class="pm-meta">
        <span>⚡ 15–20 min delivery</span>
        <span>✅ Quality assured</span>
      </div>
      <div class="pm-qty-row" style="margin-top:16px">
        <span class="pm-qty-label">Qty:</span>
        <div class="pm-qty-ctrl">
          <button onclick="pmQty(-1,${id})">−</button>
          <span id="pmQtyNum">${productModalQty}</span>
          <button onclick="pmQty(1,${id})">+</button>
        </div>
        <button class="pm-add-btn" onclick="addToCartQty(${id})">
          🛒 Add to Cart — ₹${p.price * productModalQty}
        </button>
      </div>
    </div>`;
  openModal('productModal');
}

function pmQty(delta, id) {
  const p = PRODUCTS.find(x => x.id === id);
  productModalQty = Math.max(1, productModalQty + delta);
  document.getElementById('pmQtyNum').textContent = productModalQty;
  document.querySelector('.pm-add-btn').textContent = `🛒 Add to Cart — ₹${p.price * productModalQty}`;
}

function addToCartQty(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) existing.count = productModalQty;
  else cart.push({ ...p, count: productModalQty });
  updateCartUI();
  updateProductCardUI(id);
  closeModal('productModal');
  showToast(`✅ ${p.emoji} ${p.name} added (×${productModalQty})!`);
}

/* ─── CHECKOUT ─── */
function openCheckout() {
  if (!cart.length) { showToast('⚠️ Cart is empty!'); return; }
  closeCart();
  populateCheckout();
  setTimeout(() => openModal('checkoutModal'), 200);
}

function populateCheckout() {
  // Items
  const itemsEl = document.getElementById('coSummaryItems');
  if (itemsEl) {
    itemsEl.innerHTML = cart.map(c =>
      `<div class="co-sum-item"><span>${c.emoji} ${c.name} ×${c.count}</span><span>₹${c.price * c.count}</span></div>`
    ).join('');
  }
  // Coupon field reset visual only — don't auto-apply
  const couponInput = document.getElementById('couponInput');
  if (couponInput) couponInput.value = '';
  document.getElementById('couponResult').textContent = '';
  document.getElementById('couponResult').className = 'coupon-result';
  document.getElementById('coCouponRow').classList.add('hidden');

  updateCheckoutTotals();

  // Address
  const sel = savedAddresses.find(a => a.id === selectedAddressId);
  if (sel) {
    const n = document.getElementById('coAddrName');
    const d = document.getElementById('coAddrDetail');
    if (n) n.textContent = sel.name;
    if (d) d.textContent = sel.full + ' · ' + sel.phone;
  }
}

function updateCheckoutTotals() {
  const { subtotal, discount, delivery, total } = calcTotals();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('coItemTotal', `₹${subtotal}`);
  set('coDelivery',  `₹${delivery}`);
  set('coGrandTotal',`₹${total}`);
  const btn = document.getElementById('placeOrderBtn');
  if (btn) btn.innerHTML = `Place Order &nbsp;—&nbsp; ₹${total}`;
}

/* Coupon */
function setCoupon(code) {
  const input = document.getElementById('couponInput');
  if (input) input.value = code;
  applyCoupon();
}

function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  const res  = document.getElementById('couponResult');
  const row  = document.getElementById('coCouponRow');
  if (!code) { showToast('⚠️ Enter a coupon code'); return; }
  const coupon = COUPONS[code];
  if (!coupon) {
    res.textContent = '✕ Invalid coupon code';
    res.className = 'coupon-result error';
    appliedCoupon = null;
    row.classList.add('hidden');
  } else {
    appliedCoupon = code;
    res.textContent = `✓ Coupon applied — ${coupon.label}!`;
    res.className = 'coupon-result success';
    document.getElementById('coCouponLabel').textContent = `Coupon (${code})`;
    row.classList.remove('hidden');
    showToast(`🎉 Coupon ${code} applied!`);
  }
  updateCheckoutTotals();
}

function initPaymentOpts() {
  document.querySelectorAll('.co-pay-opt').forEach(opt => {
    opt.addEventListener('click', () => selectPayment(opt));
  });
}
function selectPayment(el) {
  document.querySelectorAll('.co-pay-opt').forEach(o => o.classList.remove('active-pay'));
  if (el && el.classList) el.classList.add('active-pay');
}

/* ─── PLACE ORDER ─── */
function placeOrder() {
  const d = new Date();
  const orderId = `BK-${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getFullYear()).slice(-2)}-A-${String(Math.floor(Math.random()*900)+100)}`;
  const payMethod = document.querySelector('.co-pay-opt.active-pay strong')?.textContent || 'Cash on Delivery';

  // Store order in history
  const { total } = calcTotals();
  PAST_ORDERS.unshift({ id:orderId, items:cart.map(c=>c.name).join(', '), total:`₹${total}`, status:'Processing', date:'Today' });

  document.getElementById('sOID').textContent = orderId;
  document.getElementById('trkOID').textContent = `#${orderId}`;
  document.getElementById('sPayment').textContent = payMethod;

  cart = [];
  appliedCoupon = null;
  updateCartUI();
  renderProductsToGrid(PRODUCTS.filter(p => currentFilter === 'all' ? true : p.cat === currentFilter));

  closeModal('checkoutModal');
  setTimeout(() => openModal('successModal'), 250);
}

/* ─── MODALS ─── */
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  document.body.style.overflow = '';
}
function overlayClose(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      closeCart();
      document.body.style.overflow = '';
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchInput')?.focus();
    }
  });
}

/* ─── LOGIN / OTP ─── */
function sendOTP() {
  const phone = document.getElementById('phoneInput')?.value.trim();
  if (!phone || phone.length < 10) { showToast('⚠️ Enter valid 10-digit number'); return; }
  document.getElementById('loginStep1').classList.add('hidden');
  document.getElementById('loginStep2').classList.remove('hidden');
  document.getElementById('otpPhoneDisp').textContent = phone;
  showToast(`📱 OTP sent to +91 ${phone}`);
  startOTPTimer();
  setTimeout(() => document.querySelector('.otpb')?.focus(), 100);
}

function startOTPTimer() {
  let secs = 30;
  const el = document.getElementById('otpTimer');
  clearInterval(otpTimer);
  otpTimer = setInterval(() => {
    if (secs <= 0) {
      clearInterval(otpTimer);
      if (el) el.innerHTML = '<a href="#" onclick="sendOTP();return false" style="color:var(--g);font-weight:600">Resend OTP</a>';
    } else {
      if (el) el.textContent = `Resend in ${secs}s`;
      secs--;
    }
  }, 1000);
}

function resetToStep1() {
  document.getElementById('loginStep1').classList.remove('hidden');
  document.getElementById('loginStep2').classList.add('hidden');
  document.querySelectorAll('.otpb').forEach(b => b.value = '');
  clearInterval(otpTimer);
}

function verifyOTP() {
  const otp = [...document.querySelectorAll('.otpb')].map(b => b.value).join('');
  if (otp.length < 4) { showToast('⚠️ Enter complete 4-digit OTP'); return; }
  const phone = document.getElementById('otpPhoneDisp')?.textContent;
  // Login success
  currentUser = { name: 'Sahid Ansari', phone: `+91 ${phone}`, initial: 'S' };
  closeModal('loginModal');
  document.getElementById('loginTrigger').style.display = 'none';
  document.getElementById('accountDropdown').style.display = 'block';
  const av = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('acctAvatar').textContent = av;
  document.getElementById('acctName').textContent = currentUser.name.split(' ')[0];
  document.getElementById('amhAvatar').textContent = av;
  document.getElementById('amhName').textContent = currentUser.name;
  document.getElementById('amhPhone').textContent = currentUser.phone;
  // Profile fields
  const pn = document.getElementById('pf_name'); if (pn) pn.value = currentUser.name;
  const pp = document.getElementById('pf_phone'); if (pp) pp.value = currentUser.phone;
  const pb = document.getElementById('profileAvBig'); if (pb) pb.textContent = av;
  resetToStep1();
  showToast(`✅ Welcome back, ${currentUser.name.split(' ')[0]}!`);
}

function initOTPBoxes() {
  document.querySelectorAll('.otpb').forEach((box, i, all) => {
    box.addEventListener('input', () => { if (box.value && i < all.length-1) all[i+1].focus(); });
    box.addEventListener('keydown', e => { if (e.key === 'Backspace' && !box.value && i > 0) all[i-1].focus(); });
  });
}

function logout() {
  currentUser = null;
  document.getElementById('loginTrigger').style.display = '';
  document.getElementById('accountDropdown').style.display = 'none';
  closeAccountMenu();
  showToast('👋 Logged out successfully');
}

/* ─── ACCOUNT MENU ─── */
function toggleAccountMenu() {
  document.getElementById('accountMenu').classList.toggle('open');
}
function closeAccountMenu() {
  document.getElementById('accountMenu')?.classList.remove('open');
}

/* ─── ORDERS MODAL ─── */
function openModal(id) {
  if (id === 'ordersModal') renderOrdersList();
  if (id === 'profileModal') renderProfile();
  document.getElementById(id)?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderOrdersList() {
  const container = document.getElementById('ordersListContainer');
  if (!container) return;
  if (!PAST_ORDERS.length) {
    container.innerHTML = `<div class="orders-empty"><div style="font-size:40px;margin-bottom:12px">📦</div><p>No orders yet</p></div>`;
    return;
  }
  container.innerHTML = PAST_ORDERS.map(o => `
    <div class="order-card">
      <div class="oc-header">
        <span class="oc-id">#${o.id}</span>
        <span class="oc-status ${o.status === 'Delivered' ? 'status-delivered' : 'status-processing'}">${o.status}</span>
      </div>
      <div class="oc-items">${o.items}</div>
      <div class="oc-footer">
        <span style="font-size:12px;color:var(--gray-400)">${o.date}</span>
        <span class="oc-total">${o.total}</span>
        <button class="oc-reorder" onclick="reorder('${o.id}')">Reorder</button>
      </div>
    </div>`).join('');
}

function reorder(orderId) {
  closeModal('ordersModal');
  showToast('🛒 Items added to cart!');
}

function renderProfile() {
  if (!currentUser) return;
  const pn = document.getElementById('pf_name'); if (pn) pn.value = currentUser.name;
  const pp = document.getElementById('pf_phone'); if (pp) pp.value = currentUser.phone;
  const pb = document.getElementById('profileAvBig'); if (pb) pb.textContent = currentUser.initial || currentUser.name.charAt(0);
}

function enableProfileEdit() {
  document.querySelectorAll('.pf-field input').forEach(inp => inp.removeAttribute('readonly'));
  document.getElementById('saveProfileBtn')?.classList.remove('hidden');
  showToast('✏️ Edit your profile details');
}

function saveProfile() {
  const name  = document.getElementById('pf_name')?.value;
  const email = document.getElementById('pf_email')?.value;
  if (currentUser) { currentUser.name = name; }
  document.querySelectorAll('.pf-field input').forEach(inp => inp.setAttribute('readonly',''));
  document.getElementById('saveProfileBtn')?.classList.add('hidden');
  showToast('✅ Profile saved!');
}

/* ─── ADDRESS SYSTEM ─── */
function renderSavedAddresses() {
  const list = document.getElementById('savedAddrList');
  if (!list) return;
  if (!savedAddresses.length) {
    list.innerHTML = `<p style="font-size:13px;color:var(--gray-400);text-align:center;padding:16px">No saved addresses yet</p>`;
    return;
  }
  list.innerHTML = savedAddresses.map(addr => `
    <div class="saved-addr-card ${addr.id === selectedAddressId ? 'selected' : ''}" onclick="selectAddress(${addr.id})">
      <div class="sac-ico">${addr.type === 'Home' ? '🏠' : addr.type === 'Work' ? '🏢' : '📍'}</div>
      <div class="sac-info">
        <span class="sac-tag">${addr.type}</span>
        <strong>${addr.name}</strong>
        <p>${addr.full}</p>
        <p>${addr.phone}</p>
      </div>
      <div class="sac-actions">
        <button class="sac-btn" onclick="editAddress(${addr.id});event.stopPropagation()">Edit</button>
        <button class="sac-btn del" onclick="deleteAddress(${addr.id});event.stopPropagation()">Delete</button>
      </div>
    </div>`).join('');
}

function selectAddress(id) {
  selectedAddressId = id;
  const sel = savedAddresses.find(a => a.id === id);
  if (sel) {
    document.getElementById('currentAddrText').textContent = sel.full.split(',')[0] + '...';
  }
  renderSavedAddresses();
  closeModal('addressModal');
  showToast('📍 Address updated!');
}

function deleteAddress(id) {
  if (savedAddresses.length <= 1) { showToast('⚠️ At least one address required'); return; }
  savedAddresses = savedAddresses.filter(a => a.id !== id);
  if (selectedAddressId === id) selectedAddressId = savedAddresses[0].id;
  renderSavedAddresses();
  showToast('🗑 Address deleted');
}

function editAddress(id) {
  const addr = savedAddresses.find(a => a.id === id);
  if (!addr) return;
  showAddNewAddr();
  const parts = addr.full.split(',');
  document.getElementById('af_name').value    = addr.name;
  document.getElementById('af_phone').value   = addr.phone;
  document.getElementById('af_village').value = parts[0]?.trim() || '';
  document.getElementById('af_district').value= parts[1]?.trim() || '';
}

function showAddNewAddr() {
  document.getElementById('addAddrForm').classList.remove('hidden');
  document.getElementById('addAddrForm').scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function saveNewAddress() {
  const name    = document.getElementById('af_name').value.trim();
  const phone   = document.getElementById('af_phone').value.trim();
  const house   = document.getElementById('af_house').value.trim();
  const street  = document.getElementById('af_street').value.trim();
  const village = document.getElementById('af_village').value.trim();
  const district= document.getElementById('af_district').value.trim();
  const state   = document.getElementById('af_state').value.trim();
  const pin     = document.getElementById('af_pin').value.trim();
  const type    = document.querySelector('input[name="addrType"]:checked')?.value || 'Home';

  if (!name || !phone || !village) { showToast('⚠️ Name, phone & village are required'); return; }

  const parts = [house, street, village, district, state].filter(Boolean);
  const full  = parts.join(', ') + (pin ? ` – ${pin}` : '');
  const newId = Date.now();
  savedAddresses.push({ id:newId, type, name, phone, full });
  selectedAddressId = newId;
  document.getElementById('addAddrForm').classList.add('hidden');
  renderSavedAddresses();
  document.getElementById('currentAddrText').textContent = village + '...';
  showToast('✅ Address saved!');
  // Clear fields
  ['af_name','af_phone','af_house','af_street','af_village','af_district','af_state','af_pin'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

function detectLocation() {
  if (!navigator.geolocation) { showToast('⚠️ Location not supported'); return; }
  showToast('📍 Detecting location...');
  navigator.geolocation.getCurrentPosition(
    pos => {
      showToast('✅ Location detected! (demo: Gumani)');
      document.getElementById('currentAddrText').textContent = 'Gumani';
    },
    () => showToast('⚠️ Could not detect location')
  );
}

/* ─── QUICK ORDER ─── */
let qocParsed = [];

function appendMsg(type, html) {
  const msgs = document.getElementById('qocMsgs');
  if (!msgs) return;
  const wrap   = document.createElement('div');
  wrap.className = 'qoc-msg-wrap';
  const bubble = document.createElement('div');
  bubble.className = `qoc-bubble ${type === 'user' ? 'user-bubble' : type === 'cart' ? 'cart-preview-bubble' : 'ai-bubble'}`;
  bubble.innerHTML = html;
  wrap.appendChild(bubble);
  msgs.appendChild(wrap);
  msgs.scrollTop = msgs.scrollHeight;
  return bubble;
}

function sendQuickOrder() {
  const input = document.getElementById('qocInput');
  const text  = input?.value.trim();
  if (!text) return;
  appendMsg('user', text);
  input.value = '';
  const typing = appendMsg('ai', '⏳ Samajh raha hoon...');
  setTimeout(() => {
    const parsed = parseOrder(text);
    if (!parsed.length) {
      typing.innerHTML = `😅 Samajh nahi aaya. Try: <em>"1 kg aalu, 2L doodh, Tata Tea"</em>`;
      return;
    }
    qocParsed = parsed;
    const subtotal = parsed.reduce((s, p) => s + p.price * p.count, 0);
    typing.className = 'qoc-bubble cart-preview-bubble';
    typing.innerHTML = `
      ✅ Yeh mila:<br/>
      <table class="cpi-table">
        ${parsed.map(p => `<tr><td>${p.emoji} ${p.name} ×${p.count}</td><td style="text-align:right;font-weight:700">₹${p.price * p.count}</td></tr>`).join('')}
      </table>
      <div class="cpi-subtotal"><span>Subtotal</span><span>₹${subtotal}</span></div>
      <div class="cpi-actions">
        <button class="cpa-btn cpa-confirm" onclick="confirmQuickOrder()">✓ Cart mein Add</button>
        <button class="cpa-btn cpa-edit" onclick="editQuickOrder()">✏ Edit</button>
      </div>`;
  }, 700);
}

function parseOrder(text) {
  const result = [];
  const matched = new Set();
  const lower = text.toLowerCase();
  const words = lower.split(/[\s,।]+/).filter(Boolean);
  words.forEach((word, idx) => {
    const key = Object.keys(KEYWORD_MAP).find(k => word.includes(k));
    if (key && !matched.has(KEYWORD_MAP[key])) {
      const product = PRODUCTS.find(p => p.name === KEYWORD_MAP[key]);
      if (product) {
        let qty = 1;
        if (idx > 0) { const n = parseInt(words[idx-1]); if (!isNaN(n) && n > 0 && n <= 20) qty = n; }
        result.push({ ...product, count: qty });
        matched.add(KEYWORD_MAP[key]);
      }
    }
  });
  return result;
}

function confirmQuickOrder() {
  qocParsed.forEach(p => {
    const ex = cart.find(c => c.id === p.id);
    if (ex) ex.count += p.count;
    else cart.push({ ...p });
  });
  updateCartUI();
  renderProducts(currentFilter);
  appendMsg('ai', `🎉 <strong>${qocParsed.length} item${qocParsed.length>1?'s':''} added!</strong><br/>Delivery: <strong>15–20 mins</strong><br/><button onclick="openCart()" style="margin-top:8px;padding:7px 16px;background:var(--g);color:#fff;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;border:none">View Cart 🛒</button>`);
  qocParsed = [];
  showToast('✅ Items added to cart!');
}

function editQuickOrder() {
  const input = document.getElementById('qocInput');
  if (input) {
    input.value = qocParsed.map(p => `${p.count} ${p.name.split(' ')[0].toLowerCase()}`).join(', ');
    input.focus();
  }
}

function quickSuggest(text) {
  const input = document.getElementById('qocInput');
  if (input) { input.value = text; input.focus(); }
  sendQuickOrder();
}

/* ─── VOICE ─── */
function toggleVoice() {
  const btn = document.getElementById('voiceBtn');
  const bar = document.getElementById('voiceBar');
  if (isRecording) {
    isRecording = false;
    btn.classList.remove('rec');
    bar.classList.add('hidden');
    if (speechRec) speechRec.stop();
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast('⚠️ Voice only works in Chrome'); return; }
  isRecording = true;
  btn.classList.add('rec');
  bar.classList.remove('hidden');
  speechRec = new SR();
  speechRec.lang = 'hi-IN';
  speechRec.interimResults = false;
  speechRec.onresult = e => {
    const t = e.results[0][0].transcript;
    const inp = document.getElementById('qocInput');
    if (inp) inp.value = t;
    isRecording = false;
    btn.classList.remove('rec');
    bar.classList.add('hidden');
    sendQuickOrder();
  };
  speechRec.onerror = () => {
    isRecording = false;
    btn.classList.remove('rec');
    bar.classList.add('hidden');
  };
  speechRec.onend = () => { isRecording = false; btn.classList.remove('rec'); bar.classList.add('hidden'); };
  speechRec.start();
  appendMsg('ai', '🎙️ Sun raha hoon... Hindi mein boliye');
}

/* ─── FORM SUBMIT ─── */
function submitForm(id) {
  const fields = document.querySelectorAll(`#${id} .form-field`);
  let ok = true;
  fields.forEach(f => {
    const empty = f.tagName === 'SELECT' ? !f.value : !f.value.trim();
    if (empty) { f.style.borderColor = 'var(--red)'; ok = false; setTimeout(() => f.style.borderColor = '', 2000); }
  });
  if (!ok) { showToast('⚠️ Please fill all fields'); return; }
  closeModal(id);
  showToast(id === 'vendorModal'
    ? '✅ Vendor application submitted! Team will call within 24 hrs.'
    : '✅ Rider application received! We\'ll contact you soon.'
  );
}

/* ─── REVIEWS SCROLL ─── */
function scrollReviews(dir) {
  const track = document.getElementById('reviewsTrack');
  if (track) track.scrollBy({ left: dir * 300, behavior: 'smooth' });
}

/* ─── TOAST ─── */
let _tt;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_tt);
  _tt = setTimeout(() => t.classList.remove('show'), 3000);
}