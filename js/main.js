// ===== LOADER — removed, instant load for better UX =====
// No fake loading screen — site loads fast enough

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
if (cursor && follower && window.innerWidth > 768) {
    let cx = 0, cy = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', (e) => { cx = e.clientX; cy = e.clientY; cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; });
    (function animateFollower() { fx += (cx - fx) * 0.12; fy += (cy - fy) * 0.12; follower.style.left = fx + 'px'; follower.style.top = fy + 'px'; requestAnimationFrame(animateFollower); })();
    document.querySelectorAll('a, button, .project-card, .service-item, .faq-question').forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
}

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const sections = document.querySelectorAll('section[id]');

// Scroll state + active section highlight
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Nav background
    nav.classList.toggle('scrolled', scrollY > 50);

    // Active nav link
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (scrollY >= top) current = section.id;
    });
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });

    // Back to top
    document.getElementById('back-to-top').classList.toggle('visible', scrollY > 600);

    // Sticky CTA bar (show after hero)
    const heroBottom = document.getElementById('hero').offsetTop + document.getElementById('hero').offsetHeight;
    const contactTop = document.getElementById('contact').offsetTop - window.innerHeight;
    const showSticky = scrollY > heroBottom && scrollY < contactTop;
    document.getElementById('sticky-cta').classList.toggle('visible', showSticky);
});

// Mobile menu toggle
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Back to top button
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== GSAP SCROLL ANIMATIONS =====
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.section-label, .section-title').forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }, y: 40, opacity: 0, duration: 0.8, ease: 'expo.out' });
    });

    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' }, y: 40, opacity: 0, duration: 0.6, delay: (i % 3) * 0.08, ease: 'expo.out' });
    });

    gsap.utils.toArray('.service-item').forEach((item, i) => {
        gsap.from(item, { scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }, x: -30, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'expo.out' });
    });

    gsap.utils.toArray('.process-step').forEach((step, i) => {
        gsap.from(step, { scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none none' }, y: 30, opacity: 0, duration: 0.6, delay: i * 0.1, ease: 'expo.out' });
    });

    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }, y: 30, opacity: 0, duration: 0.6, delay: i * 0.1, ease: 'expo.out' });
    });

    gsap.utils.toArray('.about-text, .about-tools, .about-stats').forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }, y: 25, opacity: 0, duration: 0.7, ease: 'expo.out' });
    });

    gsap.from('.contact-left', { scrollTrigger: { trigger: '.contact-section', start: 'top 75%', toggleActions: 'play none none none' }, x: -40, opacity: 0, duration: 0.8, ease: 'expo.out' });
    gsap.from('.contact-right', { scrollTrigger: { trigger: '.contact-section', start: 'top 75%', toggleActions: 'play none none none' }, x: 40, opacity: 0, duration: 0.8, delay: 0.15, ease: 'expo.out' });
}

// ===== STAT COUNTER =====
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            let current = 0;
            const increment = target / 40;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = Math.floor(current);
            }, 30);
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-count]').forEach(el => statsObserver.observe(el));

// ===== PROJECT FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== VIDEO HOVER PLAY =====
document.querySelectorAll('.project-card').forEach(card => {
    const video = card.querySelector('.project-video');
    if (!video) return;
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

// ===== VIDEO LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const thumb = card.querySelector('.project-thumb');
        const videoSrc = thumb.dataset.video;
        const tiktokUrl = thumb.dataset.tiktok;
        const youtubeUrl = thumb.dataset.youtube;

        if (videoSrc) {
            lightboxContent.innerHTML = `<video src="${videoSrc}" controls autoplay style="width:100%;max-height:80vh;border-radius:4px;"></video>`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else if (tiktokUrl) {
            window.open(tiktokUrl, '_blank');
        } else if (youtubeUrl) {
            window.open(youtubeUrl, '_blank');
        }
    });
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    const video = lightboxContent.querySelector('video');
    if (video) video.pause();
    setTimeout(() => { lightboxContent.innerHTML = ''; }, 300);
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); });

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const wasActive = item.classList.contains('active');
        // Close all
        document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
        // Toggle clicked
        if (!wasActive) item.classList.add('active');
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== CONTACT FORM — works with FormSubmit.co =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"] span');
        const formData = new FormData(contactForm);
        btn.textContent = 'Sending...';

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok || response.status === 200 || response.status === 302) {
                btn.textContent = 'Sent! I\'ll respond within 24h';
                contactForm.reset();
                setTimeout(() => { btn.textContent = 'Send Project Brief'; }, 4000);
            } else {
                btn.textContent = 'Error — try email instead';
                setTimeout(() => { btn.textContent = 'Send Project Brief'; }, 3000);
            }
        }).catch(() => {
            btn.textContent = 'Error — try email instead';
            setTimeout(() => { btn.textContent = 'Send Project Brief'; }, 3000);
        });
    });
}

// ===== MAGNETIC BUTTONS =====
if (window.innerWidth > 768) {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}

// ===== MOBILE VIDEO TAP =====
if (window.innerWidth <= 768) {
    document.querySelectorAll('.project-card').forEach(card => {
        const video = card.querySelector('.project-video');
        if (!video) return;
        // Auto-play videos in viewport on mobile
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        observer.observe(card);
    });
}
