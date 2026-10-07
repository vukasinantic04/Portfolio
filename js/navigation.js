(() => {
    const nav = document.querySelector('.site-nav');
    const toggle = nav.querySelector('.site-nav-toggle');
    const menu = nav.querySelector('.site-nav-menu');
    const mobile = window.matchMedia('(max-width: 991.98px)');
    function setOpen(open, restoreFocus = false) {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('title', open ? 'Close navigation menu' : 'Open navigation menu');
        if (restoreFocus) toggle.focus();
    }
    const sections = [...menu.querySelectorAll('a[href^="#"]')].map(link => ({
        link,
        target: document.querySelector(link.getAttribute('href'))
    })).filter(section => section.target);
    function updateScroll() {
        nav.classList.toggle('is-scrolled', window.scrollY > 24);
        // Track the section currently below the fixed navigation.
        const ordered = sections.map(section => ({
            ...section,
            top: section.target.getBoundingClientRect().top + window.scrollY
        })).sort((a, b) => a.top - b.top);
        const marker = window.scrollY + (mobile.matches ? 96 : 104) + 2;
        let active = ordered[0];
        for (const section of ordered) {
            if (section.top <= marker) active = section;
        }
        // The compact Contact section cannot always reach the header offset.
        if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
            active = ordered[ordered.length - 1];
        }
        for (const section of sections) {
            if (section.link === active?.link) section.link.setAttribute('aria-current', 'location');
            else section.link.removeAttribute('aria-current');
        }
    }
    let scrollFrame = 0;
    function scheduleUpdate() {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(() => {
            scrollFrame = 0;
            updateScroll();
        });
    }
    toggle.hidden = false;
    nav.classList.add('is-enhanced');
    updateScroll();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    document.fonts?.ready.then(scheduleUpdate);
    window.addEventListener('pageshow', updateScroll);
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || !mobile.matches) return;
        setOpen(false);
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false, true);
    });
    document.addEventListener('click', event => {
        if (!nav.contains(event.target)) setOpen(false);
    });
    nav.addEventListener('focusout', event => {
        if (!nav.contains(event.relatedTarget)) setOpen(false);
    });
    mobile.addEventListener('change', () => {
        const focused = document.activeElement;
        setOpen(false);
        if (mobile.matches && menu.contains(focused)) toggle.focus();
        if (!mobile.matches && focused === toggle) nav.querySelector('.site-nav-brand').focus();
    });
})();
