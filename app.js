// ===== FIREBASE INIT =====
const firebaseConfig = {
  apiKey: "AIzaSyDJ9tI1I0KM6tkHT0Zy8-Crf1LpM7e1l0w",
  authDomain: "portfolio-follow-23690.firebaseapp.com",
  databaseURL: "https://portfolio-follow-23690-default-rtdb.firebaseio.com",
  projectId: "portfolio-follow-23690",
  storageBucket: "portfolio-follow-23690.firebasestorage.app",
  messagingSenderId: "116470511665",
  appId: "1:116470511665:web:b288121c2ca55aaf1b7d10",
  measurementId: "G-1ZE9R3WFR6"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
const observerOptions = { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 };
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, observerOptions);
sections.forEach(s => sectionObserver.observe(s));

// ===== SCROLL REVEAL ANIMATION =====
const revealEls = document.querySelectorAll('.service-card, .pricing-card, .portfolio-card, .why-card');
revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
});
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===== CONTACT FORM =====
const WEB3FORMS_KEY = '74474fc6-b842-47c9-b88b-62d20aea9a2f';

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !service || !message) {
    showToast('Please fill in all fields.', 'error');
    return;
  }
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        name,
        email,
        service,
        message
      })
    });
    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    if (data.success) {
      contactForm.reset();
      showToast('Message sent! I\'ll get back to you within 24 hours. ✅', 'success');
    } else {
      showToast('Something went wrong. Please try again.', 'error');
    }
  } catch {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    showToast('Network error — please try again.', 'error');
  }
});

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
    background:${type === 'success' ? 'linear-gradient(135deg,#6c63ff,#43d9ad)' : 'linear-gradient(135deg,#ff6584,#e55039)'};
    color:#fff; padding:14px 24px; border-radius:12px; font-size:0.9rem; font-weight:600;
    z-index:99999; box-shadow:0 8px 32px rgba(0,0,0,0.4);
    animation:toastIn 0.3s ease; max-width:90vw; text-align:center;
  `;
  toast.textContent = msg;
  const style = document.createElement('style');
  style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ===== AI CHATBOT =====
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatbotBody = document.getElementById('chatbotBody');
const chatNotification = document.querySelector('.chat-notification');
const chatIcon = document.getElementById('chatIcon');

let isOpen = false;

chatbotToggle.addEventListener('click', () => {
  isOpen = !isOpen;
  chatbotWindow.classList.toggle('open', isOpen);
  chatIcon.className = isOpen ? 'fas fa-times' : 'fas fa-comment-dots';
  if (isOpen) {
    chatNotification.style.display = 'none';
    chatInput.focus();
  }
});

chatbotClose.addEventListener('click', () => {
  isOpen = false;
  chatbotWindow.classList.remove('open');
  chatIcon.className = 'fas fa-comment-dots';
});

// ===== GROQ AI CONFIG =====
const GROQ_KEY = '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';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are WebBot, a friendly and professional AI sales assistant for "Website Creator" — a freelance web development service run by Ishaq.

CONTACT:
- WhatsApp: +92 306 2025427
- Email: ishaksiddiquee@gmail.com
- Response time: Within 24 hours

SERVICES WE OFFER:
1. Full-Time Digital Employees (AI Agents) — GPT-4 / Claude powered digital workers tailored to your workflow. Handle any platform or channel, fully automated, tireless, and always performing at their best.
2. 3D Modern Website — Immersive Three.js / WebGL animated websites with parallax & scroll effects, 3D product showcases, and jaw-dropping visuals. Fully mobile optimized.
3. Call AI Agent — Vapi / Twilio powered voice AI agents that handle customer calls, bookings, and inquiries 24/7. Natural conversation flow with CRM & calendar integration.
4. OpenAI Style Website App — AI web applications with chat interfaces, image generation, and GPT-4 / Claude API integration. Custom AI workflows, streaming chat responses, user auth & API dashboard.
5. E-Commerce Store — Full online store with Stripe / PayPal integration, product management, order tracking, and admin dashboard. Built to sell from day one.
6. Portfolio Website — Beautiful animated portfolio with project gallery, animated sections, contact form, and blog-ready setup. Wins clients and impresses employers.
7. Business Website — Professional, trust-building business websites with corporate design, SEO optimization, lead generation forms, and Google Maps & reviews integration.

PRICING PLANS:
- Starter ($50): 1-page website, mobile responsive, contact form, 1-day delivery, 1 revision. No AI chatbot, no SEO.
- Professional ($250): Up to 5 pages, mobile responsive, contact form, 1-day delivery, 3 revisions, AI chatbot integration, basic SEO setup.
- Premium ($5,000): Unlimited pages, e-commerce ready, AI chatbot, Call AI Agent, full SEO package, booking system, unlimited revisions.
- Enterprise ($100,000): Everything in Premium + AI Call Agent (Enterprise), AI Chatbot (Enterprise), 1 Billion+ Followers System, Full-Time Digital Employees, Custom AI Recommendations.

DELIVERY GUARANTEE:
- Large projects: delivered in under 3 days.
- Small projects: delivered within 1 day.

BEHAVIOUR RULES:
- Be warm, engaging, and professional — like a helpful sales rep, not a robot.
- Keep replies short and conversational (2–4 sentences). Use bullet points only when listing things.
- Never ask for the visitor's name — just help them directly.
- If someone asks for contact info — give: WhatsApp +92 306 2025427 and email ishaksiddiquee@gmail.com.
- Encourage visitors to fill out the contact form on the website or reach out on WhatsApp.
- Never invent services or prices not listed above.
- If the visitor writes in Urdu or another language, reply in that same language.
- Use emojis occasionally to keep the tone friendly.`;

let chatHistory = [];

// Opening message
(function () {
  const msg = document.createElement('div');
  msg.className = 'chat-msg bot-msg';
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.style.whiteSpace = 'pre-line';
  bubble.textContent = 'Hi there! 👋 Welcome to Website Creator.\n\nHow can I help you today? Ask me about our services, pricing, or delivery times!';
  msg.appendChild(bubble);
  chatbotBody.appendChild(msg);
})();

async function getAIReply(userText) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...chatHistory,
    { role: 'user', content: userText }
  ];

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.75,
      max_tokens: 400
    })
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Groq API error:', data?.error?.message || res.status, data);
    throw new Error(data?.error?.message || `HTTP ${res.status}`);
  }

  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    console.error('Groq empty response:', data);
    throw new Error('Empty response from Groq');
  }

  chatHistory.push({ role: 'user',      content: userText });
  chatHistory.push({ role: 'assistant', content: reply });
  return reply;
}

function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${sender}-msg`;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.style.whiteSpace = 'pre-line';
  bubble.textContent = text;
  msg.appendChild(bubble);
  chatbotBody.appendChild(msg);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg bot-msg';
  div.id = 'typing';
  div.innerHTML = '<div class="chat-bubble typing-indicator"><span></span><span></span><span></span></div>';
  chatbotBody.appendChild(div);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.disabled = true;
  chatSend.disabled = true;
  appendMessage(text, 'user');
  chatInput.value = '';

  showTyping();
  try {
    const reply = await getAIReply(text);
    removeTyping();
    appendMessage(reply, 'bot');
  } catch (err) {
    console.error('WebBot failed:', err.message);
    removeTyping();
    appendMessage('Sorry, I\'m having a connection issue. Please reach us directly on WhatsApp: +92 306 2025427 😊', 'bot');
  } finally {
    chatInput.disabled = false;
    chatSend.disabled = false;
    chatInput.focus();
  }
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

// Auto-show notification after 4 seconds
setTimeout(() => {
  if (!isOpen && chatNotification) chatNotification.style.display = 'flex';
}, 4000);

// ===== FOLLOW WIDGET (Firebase Realtime Database) =====
(function () {
  const BASE_COUNT = 10247831;
  const STORAGE_KEY = 'wc_followed';

  const followBtn = document.getElementById('followBtn');
  const followIcon = document.getElementById('followIcon');
  const followText = document.getElementById('followText');
  const followerCountEl = document.getElementById('followerCount');

  const db = firebase.database();
  const countRef = db.ref('followers/count');

  function fmt(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }

  function applyFollowed(animate) {
    followBtn.classList.add('following');
    followIcon.className = 'fas fa-check';
    followText.textContent = 'Following';
    if (animate) {
      followBtn.classList.remove('pop');
      void followBtn.offsetWidth;
      followBtn.classList.add('pop');
    }
  }

  // Seed initial count in DB if it has never been set
  countRef.once('value', snapshot => {
    if (!snapshot.exists()) countRef.set(BASE_COUNT);
  });

  // Real-time listener — updates the displayed count for everyone live
  countRef.on('value', snapshot => {
    const count = snapshot.val() || BASE_COUNT;
    followerCountEl.textContent = fmt(count);
  });

  // Restore per-device follow state from localStorage
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    applyFollowed(false);
  }

  followBtn.addEventListener('click', () => {
    if (followBtn.classList.contains('following')) return;
    localStorage.setItem(STORAGE_KEY, 'true');
    applyFollowed(true);
    // Atomically increment count in Firebase
    countRef.transaction(current => (current || BASE_COUNT) + 1);
  });
})();

// ===== SERVICE CARD ROUTING =====
(function () {
  const routes = {
    'Custom Agent':             'custom-website.html',
    '3D Modern Website':        '3d-website.html',
    'Call AI Agent':            'call-ai-agents.html',
    'OpenAI Style Website App': 'openai-web-apps.html',
    'E-Commerce':               'ecommerce.html',
    'Portfolio':                'portfolio-site.html',
    'Business Website':         'business-website.html'
  };
  document.querySelectorAll('.service-card').forEach(card => {
    const h3 = card.querySelector('h3');
    if (!h3) return;
    const page = routes[h3.textContent.trim()];
    if (!page) return;
    const viewBtn = card.querySelector('.service-btn');
    if (viewBtn) viewBtn.href = page;
    const ctaBtn = card.querySelector('.service-cta-btn');
    if (ctaBtn) ctaBtn.href = page;
  });
})();

// ===== VIDEO PLAYBACK FOR MOBILE =====
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  // Try to play immediately
  heroVideo.play().catch(() => {});

  // Re-attempt on any user interaction (required by some mobile browsers)
  const tryPlay = () => { if (heroVideo.paused) heroVideo.play().catch(() => {}); };
  document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
  document.addEventListener('click',      tryPlay, { once: true, passive: true });
  document.addEventListener('scroll',     tryPlay, { once: true, passive: true });
}
