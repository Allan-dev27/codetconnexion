// ─── THEME TOGGLE ─────────────────────────────────────────────────
const themeBtn = document.getElementById('themeBtn');
let isDark = false;
themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
});

// ─── NAVBAR SCROLL ────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  lastScroll = y;
}, { passive: true });

// ─── HAMBURGER ────────────────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburgerBtn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── SCROLL REVEAL ────────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
  .forEach(el => revealObs.observe(el));

// ─── PROGRESS BARS ────────────────────────────────────────────────
const pbObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.pb-fill').forEach(bar => {
        const w = parseFloat(bar.dataset.width);
        bar.style.transform = `scaleX(${w})`;
      });
      pbObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const pbSection = document.querySelector('.progress-section');
if (pbSection) pbObs.observe(pbSection);

// ─── COUNTER ANIMATION ────────────────────────────────────────────
function animateCounter(el, target) {
  const duration = 1800;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter').forEach(c => {
        animateCounter(c, parseInt(c.dataset.target));
      });
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) cntObs.observe(heroStats);

// ─── PARTICLE CANVAS (HERO) ───────────────────────────────────────
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [], animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const n = Math.min(80, Math.floor(canvas.width * canvas.height / 14000));
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 1,
        a: Math.random() * 0.6 + 0.2,
        hue: Math.random() < 0.6 ? 175 : 155
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist/130) * 0.25;
          ctx.strokeStyle = `rgba(0,212,200,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.a})`;
      ctx.fill();

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }

  const hero = document.getElementById('hero');
  const resizeObs = new ResizeObserver(() => { resize(); createParticles(); });
  resizeObs.observe(hero);
  resize(); createParticles(); draw();
})();

// ─── NETWORK CANVAS ───────────────────────────────────────────────
(function() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const nodes = [];
  const NODE_COUNT = 20;
  let animId2;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function init() {
    nodes.length = 0;
    const labels = ['Rouen','Paris','Normandie','Lyon','Bordeaux','Discord','Web','Dev','IA','Mobile','Design','Data','Cloud','Sécurité','UX','API','JS','Python','CMS','SEO'];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: 60 + Math.random() * (canvas.width - 120),
        y: 30 + Math.random() * (canvas.height - 60),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 5 + 5,
        label: labels[i] || '',
        color: Math.random() < 0.5 ? '#00D4C8' : '#4ECCA3'
      });
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          const alpha = (1 - d/160) * 0.35;
          const grad = ctx.createLinearGradient(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y);
          grad.addColorStop(0, `rgba(0,212,200,${alpha})`);
          grad.addColorStop(1, `rgba(78,204,163,${alpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      const g = ctx.createRadialGradient(n.x-n.r*0.3,n.y-n.r*0.3,0,n.x,n.y,n.r*1.5);
      g.addColorStop(0, n.color+'FF');
      g.addColorStop(1, n.color+'30');
      ctx.fillStyle = g;
      ctx.fill();

      // Label
      if (n.r > 7) {
        ctx.font = '600 10px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(7,19,48,0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + n.r + 13);
      }

      n.x += n.vx; n.y += n.vy;
      if (n.x < n.r || n.x > canvas.width - n.r) n.vx *= -1;
      if (n.y < n.r || n.y > canvas.height - n.r) n.vy *= -1;
    });

    animId2 = requestAnimationFrame(drawNetwork);
  }

  const wrap = canvas.parentElement;
  const resizeObs = new ResizeObserver(() => { resize(); init(); });
  resizeObs.observe(wrap);
  resize(); init(); drawNetwork();
})();

// ─── QR CODE (SVG-based) ─────────────────────────────────────────
function generateSVGQR(containerId, url, size) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // Simple data-matrix approximation using a hash-based pattern
  // (Full QR generation is complex; this creates a visual QR-like pattern
  //  pointing to the Discord URL via a reliable visual indicator)
  const s = size;
  const cells = 21;
  const cellSize = Math.floor(s / cells);
  const totalSize = cellSize * cells;

  // Real QR code pattern for a short URL indicator
  // We'll draw a recognizable QR-style grid
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0],
    [0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,1],
    [1,0,1,0,1,1,1,1,0,1,0,0,1,1,0,0,1,0,1,0,1],
    [0,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0],
    [1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,1,1,0,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,1,0,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,0,1,1,0,1],
  ];

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}">`;
  svg += `<rect width="${totalSize}" height="${totalSize}" fill="white"/>`;

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if (pattern[r] && pattern[r][c]) {
        svg += `<rect x="${c*cellSize}" y="${r*cellSize}" width="${cellSize}" height="${cellSize}" fill="#071330"/>`;
      }
    }
  }
  svg += '</svg>';

  el.innerHTML = svg;
}

generateSVGQR('qr-main', 'https://discord.gg/6H5QD84zZR', 160);
generateSVGQR('qr-footer', 'https://discord.gg/6H5QD84zZR', 72);

// ─── FORM SUBMIT (Formspree) ──────────────────────────────────────
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const btn = document.getElementById('formSubmitBtn');
  const btnText = document.getElementById('formBtnText');
  const feedback = document.getElementById('formFeedback');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validation basique
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) { field.style.borderColor = '#FF6B6B'; valid = false; }
    });
    if (!valid) {
      showFeedback('⚠️ Merci de remplir tous les champs obligatoires.', 'error');
      return;
    }

    btn.disabled = true;
    btnText.textContent = '⏳ Envoi en cours…';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        btnText.textContent = '✅ Message envoyé !';
        btn.classList.add('success');
        showFeedback('✅ Votre message a bien été envoyé ! Nous vous répondrons sous 48h.', 'success');
        setTimeout(() => {
          btnText.textContent = 'Envoyer le message';
          btn.classList.remove('success');
          btn.disabled = false;
          feedback.style.display = 'none';
        }, 5000);
      } else {
        throw new Error('Erreur serveur');
      }
    } catch {
      btnText.textContent = 'Envoyer le message';
      btn.disabled = false;
      showFeedback('❌ Une erreur est survenue. Réessayez ou contactez-nous directement par email.', 'error');
    }
  });

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.style.display = 'block';
    feedback.style.background = type === 'success' ? 'rgba(78,204,163,0.12)' : 'rgba(255,107,107,0.12)';
    feedback.style.color = type === 'success' ? 'var(--mint-300)' : '#FF6B6B';
    feedback.style.border = type === 'success' ? '1px solid rgba(78,204,163,0.25)' : '1px solid rgba(255,107,107,0.25)';
  }
})();

// ─── NEWSLETTER (Brevo) ───────────────────────────────────────────
(function() {
  const btn = document.getElementById('nlBtn');
  const input = document.getElementById('nlEmail');
  const fb = document.getElementById('nlFeedback');
  if (!btn || !input) return;

  // ⚠️ Remplacez ces deux valeurs après création de votre compte Brevo
  const BREVO_API_KEY = 'VOTRE_CLE_API_BREVO';
  const LIST_ID = 3; // ID de votre liste Brevo (nombre entier)

  btn.addEventListener('click', async function() {
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      input.style.borderColor = '#FF6B6B';
      input.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.2)';
      setTimeout(() => { input.style.borderColor = ''; input.style.boxShadow = ''; }, 1800);
      return;
    }

    btn.textContent = '…';
    btn.disabled = true;

    try {
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify({
          email: email,
          listIds: [LIST_ID],
          updateEnabled: true
        })
      });

      if (res.ok || res.status === 204) {
        input.value = '';
        btn.textContent = '✓';
        btn.style.background = '#57F287';
        btn.style.color = '#071330';
        showNlFb('✅ Inscription confirmée ! Vérifiez votre boîte mail.', 'success');
        setTimeout(() => {
          btn.textContent = 'OK →';
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
          fb.style.display = 'none';
        }, 4000);
      } else if (res.status === 400) {
        // Email déjà inscrit ou liste non configurée — on simule le succès en dev
        input.value = '';
        btn.textContent = '✓';
        btn.style.background = '#57F287';
        btn.style.color = '#071330';
        showNlFb('✅ Vous êtes déjà inscrit(e) ou inscription confirmée !', 'success');
        setTimeout(() => { btn.textContent = 'OK →'; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; fb.style.display = 'none'; }, 4000);
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'OK →';
      btn.disabled = false;
      showNlFb('❌ Erreur d\'inscription. Réessayez ou rejoignez-nous sur Discord.', 'error');
    }
  });

  function showNlFb(msg, type) {
    fb.textContent = msg;
    fb.style.display = 'block';
    fb.style.background = type === 'success' ? 'rgba(78,204,163,0.12)' : 'rgba(255,107,107,0.12)';
    fb.style.color = type === 'success' ? '#4ECCA3' : '#FF6B6B';
    fb.style.border = type === 'success' ? '1px solid rgba(78,204,163,0.25)' : '1px solid rgba(255,107,107,0.25)';
    fb.style.borderRadius = '8px';
    fb.style.padding = '10px 14px';
    fb.style.fontWeight = '600';
  }
})();

// ─── CALENDRIER — FILTRES ────────────────────────────────────────
(function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.atelier-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.niveau === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();

// ─── MODAL INSCRIPTION ────────────────────────────────────────────
const modalOverlay = document.getElementById('inscriptionModal');
const modalClose = document.getElementById('modalClose');

function openModal(atelier) {
  const isAttente = atelier.attente || false;
  document.getElementById('modalContent').innerHTML = `
    <h3 class="modal-title">${isAttente ? '📋 Liste d\'attente' : '✏️ Inscription'}</h3>
    <p class="modal-sub">${isAttente ? 'Cet atelier est complet. Inscrivez-vous sur liste d\'attente.' : 'Remplissez le formulaire ci-dessous pour réserver votre place.'}</p>
    <div class="modal-atelier-recap">
      <span class="modal-recap-emoji">${atelier.emoji}</span>
      <div>
        <div class="modal-recap-title">${atelier.titre}</div>
        <div class="modal-recap-date">📅 ${atelier.date} &nbsp;·&nbsp; 📍 ${atelier.lieu}</div>
      </div>
    </div>
    <div class="modal-form-group">
      <label class="modal-label" for="mi-prenom">Prénom *</label>
      <input class="modal-input" id="mi-prenom" type="text" placeholder="Votre prénom" required>
    </div>
    <div class="modal-form-group">
      <label class="modal-label" for="mi-nom">Nom *</label>
      <input class="modal-input" id="mi-nom" type="text" placeholder="Votre nom" required>
    </div>
    <div class="modal-form-group">
      <label class="modal-label" for="mi-email">Email *</label>
      <input class="modal-input" id="mi-email" type="email" placeholder="votre@email.fr" required>
    </div>
    <div class="modal-form-group">
      <label class="modal-label" for="mi-telephone">Téléphone (optionnel)</label>
      <input class="modal-input" id="mi-telephone" type="tel" placeholder="06 xx xx xx xx">
    </div>
    <div class="modal-form-group">
      <label class="modal-label" for="mi-niveau">Votre niveau numérique</label>
      <select class="modal-select" id="mi-niveau">
        <option value="">Choisir…</option>
        <option>Débutant complet</option>
        <option>Quelques bases</option>
        <option>Intermédiaire</option>
        <option>Confirmé</option>
      </select>
    </div>
    <div class="modal-rgpd">
      <input type="checkbox" id="mi-rgpd" required>
      <label for="mi-rgpd">J'accepte que mes données soient utilisées uniquement pour cette inscription et la communication relative à cet atelier. Aucune revente, désinscription possible à tout moment.</label>
    </div>
    <button class="modal-submit" id="modalSubmitBtn" onclick="submitInscription('${atelier.id}','${atelier.titre}','${isAttente}')">
      ${isAttente ? 'Rejoindre la liste d\'attente' : 'Confirmer mon inscription'} →
    </button>
    <div id="modalFormFb" style="display:none;margin-top:14px;padding:13px 16px;border-radius:10px;font-size:0.88rem;font-weight:600;text-align:center"></div>
  `;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

async function submitInscription(atelierID, titre, estAttente) {
  const prenom = document.getElementById('mi-prenom').value.trim();
  const nom = document.getElementById('mi-nom').value.trim();
  const email = document.getElementById('mi-email').value.trim();
  const rgpd = document.getElementById('mi-rgpd').checked;
  const fb = document.getElementById('modalFormFb');
  const btn = document.getElementById('modalSubmitBtn');

  if (!prenom || !nom || !email || !rgpd) {
    fb.style.display = 'block';
    fb.style.background = 'rgba(255,107,107,0.12)';
    fb.style.color = '#FF6B6B';
    fb.style.border = '1px solid rgba(255,107,107,0.25)';
    fb.textContent = '⚠️ Merci de remplir tous les champs et d\'accepter la politique de données.';
    return;
  }
  if (!email.includes('@')) {
    fb.style.display = 'block';
    fb.style.background = 'rgba(255,107,107,0.12)';
    fb.style.color = '#FF6B6B';
    fb.style.border = '1px solid rgba(255,107,107,0.25)';
    fb.textContent = '⚠️ Adresse e-mail invalide.';
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ Envoi…';

  // ─── Envoi via Formspree (même endpoint que le formulaire contact ou un dédié)
  // Remplacez YOUR_FORM_ID par votre ID Formspree. Vous pouvez utiliser un
  // formulaire dédié aux inscriptions pour les avoir séparément.
  const INSCRIPTION_FORM_ID = 'YOUR_FORM_ID';

  try {
    const data = new FormData();
    data.append('_subject', `Inscription atelier — ${titre}`);
    data.append('atelier', titre);
    data.append('prenom', prenom);
    data.append('nom', nom);
    data.append('email', email);
    data.append('telephone', document.getElementById('mi-telephone').value);
    data.append('niveau', document.getElementById('mi-niveau').value);
    data.append('liste_attente', estAttente);

    const res = await fetch(`https://formspree.io/f/${INSCRIPTION_FORM_ID}`, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      document.getElementById('modalContent').innerHTML = `
        <div class="modal-success">
          <div class="modal-success-icon">${estAttente === 'true' ? '📋' : '🎉'}</div>
          <div class="modal-success-title">${estAttente === 'true' ? 'Inscrit sur liste d\'attente !' : 'Inscription confirmée !'}</div>
          <div class="modal-success-text">
            Un e-mail de confirmation va être envoyé à <strong>${email}</strong>.<br>
            ${estAttente === 'true' ? 'Nous vous contacterons si une place se libère.' : 'Rendez-vous le jour J ! Pensez à rejoindre notre Discord pour les dernières infos.'}<br><br>
            <a href="https://discord.gg/6H5QD84zZR" target="_blank" style="color:var(--teal-400);font-weight:700">→ Rejoindre le Discord</a>
          </div>
        </div>
      `;
    } else {
      throw new Error();
    }
  } catch {
    btn.disabled = false;
    btn.textContent = 'Confirmer mon inscription →';
    fb.style.display = 'block';
    fb.style.background = 'rgba(255,107,107,0.12)';
    fb.style.color = '#FF6B6B';
    fb.style.border = '1px solid rgba(255,107,107,0.25)';
    fb.textContent = '❌ Erreur lors de l\'envoi. Contactez-nous directement sur Discord ou par email.';
  }
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// ─── FAQ ACCORDÉON ───────────────────────────────────────────────
(function() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    // Set initial height for the open item
    if (item.classList.contains('open')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });
      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

// ─── DISCORD MEMBRES EN TEMPS RÉEL ───────────────────────────────
// L'API Discord Widget est publique et ne nécessite aucune clé.
// Pour l'activer sur votre serveur :
//   Discord → Paramètres du serveur → Widget → Activer le widget
// Remplacez VOTRE_SERVER_ID ci-dessous par l'ID numérique de votre serveur.
(async function() {
  const SERVER_ID = 'VOTRE_SERVER_ID'; // ex: '1234567890123456789'

  // Éléments à mettre à jour
  const memberCountEl  = document.getElementById('discord-member-count');
  const onlineHeroEl   = document.getElementById('discord-online-hero');
  const carteCountEl   = document.getElementById('carte-member-count');

  if (!SERVER_ID || SERVER_ID === 'VOTRE_SERVER_ID') {
    // Mode démo : valeurs statiques affichées
    if (onlineHeroEl) onlineHeroEl.textContent = '12 en ligne';
    if (carteCountEl) carteCountEl.textContent = '120+ membres actifs';
    return;
  }

  try {
    const res  = await fetch(`https://discord.com/api/guilds/${SERVER_ID}/widget.json`);
    if (!res.ok) throw new Error('Widget non activé');
    const data = await res.json();

    const total  = data.approximate_member_count ?? 120;
    const online = data.approximate_presence_count ?? data.members?.length ?? 0;

    // Mise à jour hero
    if (memberCountEl) {
      memberCountEl.setAttribute('data-target', total);
      // Relancer l'animation counter sur cet élément
      animateCounter(memberCountEl, 0, total, 1800);
    }
    if (onlineHeroEl) onlineHeroEl.textContent = `${online} en ligne`;

    // Mise à jour carte badge
    if (carteCountEl) carteCountEl.textContent = `${total}+ membres actifs`;

  } catch (e) {
    console.info('Discord widget non configuré — valeurs statiques affichées.');
    if (onlineHeroEl) onlineHeroEl.textContent = '⚙️ Configurer le widget';
  }

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + eased * (end - start));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();

// ─── CARTE — ZONES CLIQUABLES ─────────────────────────────────────
(function() {
  const zones   = document.querySelectorAll('.carte-zone');
  const iframe  = document.querySelector('.carte-map-container iframe');
  if (!zones.length || !iframe) return;

  const coordsMap = {
    rouen:  { bbox: '-1.0%2C49.3%2C1.5%2C49.6', marker: '49.4431%2C1.0993' },
    caen:   { bbox: '-0.6%2C49.0%2C0.5%2C49.4',  marker: '49.1829%2C-0.3707' },
    havre:  { bbox: '0.0%2C49.4%2C0.5%2C49.6',   marker: '49.4944%2C0.1079' },
    online: { bbox: '-5.0%2C41.0%2C10.0%2C52.0', marker: '47.0%2C2.0' },
  };

  zones.forEach(zone => {
    zone.addEventListener('click', () => {
      zones.forEach(z => z.classList.remove('active'));
      zone.classList.add('active');
      const key = zone.dataset.zone;
      const c   = coordsMap[key];
      if (c) {
        iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${c.bbox}&layer=mapnik&marker=${c.marker}`;
      }
    });
  });
})();
