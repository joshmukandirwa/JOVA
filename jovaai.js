// Scroll reveal
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Theme toggle with ripple
const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;
themeToggle.addEventListener('click', () => {
    const current = rootEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    const rect = themeToggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2,
        y = rect.top + rect.height / 2;
    const maxDist = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.transform = 'translate(-50%,-50%)';
    document.body.appendChild(ripple);
    const anim = ripple.animate([{
        width: '0px',
        height: '0px',
        opacity: 0.6
    }, {
        width: (maxDist * 2.2) + 'px',
        height: (maxDist * 2.2) + 'px',
        opacity: 0
    }], {
        duration: 750,
        easing: 'cubic-bezier(.16,.9,.24,1)'
    });
    rootEl.setAttribute('data-theme', next);
    anim.onfinish = () => ripple.remove();
});

// ---- JOVA AI chat logic ----
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// 👉 Remplace cette URL par celle de ton backend une fois déployé sur Render
// Exemple : "https://jova-ai-backend.onrender.com/api/jova-ai/chat"
const BACKEND_URL = "https://jova-ai-backend.onrender.com/api/jova-ai/chat";

// Le prompt système de JOVA AI est géré côté backend (voir jova-ai-backend-route.js)
let history = [];

function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'user' : 'ai');
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
}

function showTyping() {
    const t = document.createElement('div');
    t.className = 'typing';
    t.id = 'typingIndicator';
    t.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(t);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function hideTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
}

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage('user', text);
    history.push({
        role: 'user',
        content: text
    });
    chatInput.value = '';
    sendBtn.disabled = true;
    showTyping();

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: history
            })
        });
        if (!response.ok) throw new Error('Réponse serveur invalide');
        const data = await response.json();
        hideTyping();
        const reply = (data.reply || '').trim() || "Désolé, je n'ai pas pu générer de réponse.";
        addMessage('ai', reply);
        history.push({
            role: 'assistant',
            content: reply
        });
    } catch (err) {
        hideTyping();
        addMessage('ai', "Je n'arrive pas à joindre JOVA AI pour le moment.");
        console.error('JOVA AI error:', err);
    } finally {
        sendBtn.disabled = false;
        chatInput.focus();
    }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});