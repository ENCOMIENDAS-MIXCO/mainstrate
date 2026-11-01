(function () {
    var lib = window.anime;
    if (!lib || typeof lib.animate !== 'function' || typeof lib.createScope !== 'function') return;

    var animate = lib.animate;
    var createTimeline = lib.createTimeline;
    var stagger = lib.stagger;
    var createScope = lib.createScope;

const SCROLL_TARGETS = [
    '.stats-grid .stat-item',
    '.section-header',
    '.about-grid .about-content',
    '.about-grid .about-image',
    '.features .feature-box',
    '.pulperia-banner-inner',
    '.pulperia-grid .feature-box',
    '.urgent-intro-copy > p',
    '.urgent-notes .urgent-note',
    '.urgent-climate',
    '.urgent-actions',
    '.urgent-pack-grid .pack-card',
    '.urgent-volume',
    '.country-cards-grid .country-dest-card',
    '.sea-shipping-home .flex-center',
    '.pricing-grid .price-card',
    '.faq-list .faq-item',
    '.parallax-content',
    '.contact-grid .contact-info',
    '.contact-grid .contact-card'
].join(',');

function profile() {
    if (window.matchMedia('(min-width: 1024px)').matches) {
        return { y: 22, duration: 780, staggerMs: 60 };
    }
    if (window.matchMedia('(min-width: 768px)').matches) {
        return { y: 16, duration: 600, staggerMs: 46 };
    }
    return { y: 10, duration: 420, staggerMs: 32 };
}

function markDone(el) {
    el.dataset.motionDone = '1';
    el.classList.remove('motion-pending');
    el.classList.add('motion-done', 'active');
    el.style.opacity = '';
    el.style.transform = '';
}

function showAll(root) {
    root.querySelectorAll('.motion-pending, .animate-reveal').forEach((el) => {
        el.classList.remove('motion-pending');
        el.classList.add('active');
    });
}

function startMotion() {
    const hero = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image-wrapper');
    const { y, duration, staggerMs } = profile();

    if (hero) {
        const title = hero.querySelector('.hero-title');
        const subtitle = hero.querySelector('.hero-subtitle');
        const checks = [...hero.querySelectorAll('.hero-check')];
        const cta = hero.querySelector('.hero-cta');
        [title, subtitle, ...checks, cta].filter(Boolean).forEach((el) => {
            el.classList.add('motion-pending');
        });

        const tl = createTimeline({ defaults: { ease: 'out(4)', duration } });
        if (title) {
            tl.add(title, {
                opacity: [0, 1],
                y: [y, 0],
                onComplete: () => markDone(title)
            });
        }
        if (subtitle) {
            tl.add(subtitle, {
                opacity: [0, 1],
                y: [y, 0],
                onComplete: () => markDone(subtitle)
            }, duration * 0.28);
        }
        if (checks.length) {
            tl.add(checks, {
                opacity: [0, 1],
                y: [y, 0],
                delay: stagger(staggerMs),
                onComplete: () => checks.forEach(markDone)
            }, duration * 0.42);
        }
        if (cta) {
            tl.add(cta, {
                opacity: [0, 1],
                y: [y, 0],
                onComplete: () => markDone(cta)
            }, duration * 0.62);
        }
    }

    if (heroImage) {
        heroImage.classList.add('motion-pending', 'motion-fade');
        animate(heroImage, {
            opacity: [0, 1],
            duration,
            ease: 'out(4)',
            onComplete: () => markDone(heroImage)
        });
    }

    const nodes = [...document.querySelectorAll(SCROLL_TARGETS)];
    nodes.forEach((el) => el.classList.add('motion-pending'));

    let queue = [];
    let frame = 0;

    function flush() {
        frame = 0;
        const batch = queue;
        queue = [];
        if (!batch.length) return;
        const motion = profile();
        animate(batch, {
            opacity: [0, 1],
            y: [motion.y, 0],
            duration: motion.duration,
            delay: stagger(motion.staggerMs),
            ease: 'out(4)',
            onComplete: () => batch.forEach(markDone)
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            observer.unobserve(el);
            if (el.dataset.motionDone || el.dataset.motionQueued) return;
            el.dataset.motionQueued = '1';
            queue.push(el);
            if (!frame) frame = requestAnimationFrame(flush);
        });
    }, {
        root: null,
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.01
    });

    nodes.forEach((el) => observer.observe(el));

    return () => {
        observer.disconnect();
        if (frame) cancelAnimationFrame(frame);
    };
}

createScope({
    mediaQueries: {
        reduce: '(prefers-reduced-motion: reduce)'
    }
}).add((self) => {
    if (self.matches.reduce) {
        showAll(document);
        return;
    }
    document.documentElement.classList.add('js-motion');
    const stop = startMotion();
    return () => {
        stop();
        document.documentElement.classList.remove('js-motion');
        showAll(document);
    };
});
})();
