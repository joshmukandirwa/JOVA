// Page load reveal
window.addEventListener('load', () => {
    document.documentElement.classList.add('loaded');
});

// Mobile menu toggle
const toggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('nav.links');
let menuOpen = false;
toggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'fixed';
        navLinks.style.top = '66px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.margin = '0';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = 'var(--bg-soft)';
        navLinks.style.padding = '24px 32px';
        navLinks.style.gap = '20px';
        navLinks.style.borderBottom = '1px solid var(--footer-border)';
    } else {
        navLinks.removeAttribute('style');
    }
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (menuOpen) {
        menuOpen = false;
        navLinks.removeAttribute('style');
    }
}));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
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
revealEls.forEach(el => io.observe(el));

// Stat count-up
const statTargets = {
    0: 100,
    1: 12000,
    2: 3,
    3: 1,
};
const statEls = document.querySelectorAll('.stat-number');
const statIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const idx = Array.from(statEls).indexOf(el);
            const target = statTargets[idx] || 0;
            const duration = 1400;
            const start = performance.now();

            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                const val = Math.floor(eased * target);
                el.textContent = val.toLocaleString('fr-FR') + (idx <= 1 && p >= 1 ? '+' : '');
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            statIO.unobserve(el);
        }
    });
}, {
    threshold: 0.5
});
statEls.forEach(el => statIO.observe(el));

// Header shrink + scroll progress bar
const header = document.querySelector('header');
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
    header.style.padding = window.scrollY > 40 ? '12px 0' : '18px 0';
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = pct + '%';
});

// Custom cursor glow (fine pointers only)
if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.getElementById('cursor-glow');
    let gx = 0,
        gy = 0,
        cx = 0,
        cy = 0;
    window.addEventListener('mousemove', (e) => {
        gx = e.clientX;
        gy = e.clientY;
        glow.classList.add('active');
    });
    window.addEventListener('mouseleave', () => glow.classList.remove('active'));

    function raf() {
        cx += (gx - cx) * 0.12;
        cy += (gy - cy) * 0.12;
        glow.style.left = cx + 'px';
        glow.style.top = cy + 'px';
        requestAnimationFrame(raf);
    }
    raf();

    // Magnetic buttons
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const mx = e.clientX - r.left - r.width / 2;
            const my = e.clientY - r.top - r.height / 2;
            el.style.transform = `translate(${mx * 0.28}px, ${my * 0.35}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    // Hero rings parallax
    const orbitWrap = document.getElementById('orbitWrap');
    if (orbitWrap) {
        window.addEventListener('mousemove', (e) => {
            const px = (e.clientX / window.innerWidth - 0.5) * 24;
            const py = (e.clientY / window.innerHeight - 0.5) * 24;
            orbitWrap.style.setProperty('--px', px.toFixed(1));
            orbitWrap.style.setProperty('--py', py.toFixed(1));
        });
    }

    // Spotlight product cards
    document.querySelectorAll('.spotlight').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });
}

// Theme toggle with ripple animation
const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;
const savedTheme = null; // no localStorage per environment constraints
themeToggle.addEventListener('click', (e) => {
    const current = rootEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    const rect = themeToggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxDist = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '0px';
    ripple.style.height = '0px';
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