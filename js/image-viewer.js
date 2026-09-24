(() => {
    const viewer = document.querySelector('.image-viewer');
    if (!viewer || typeof viewer.showModal !== 'function') return;
    const image = viewer.querySelector('.image-viewer-image');
    const title = viewer.querySelector('#image-viewer-title');
    const close = viewer.querySelector('.image-viewer-close');
    let opener;

    document.querySelectorAll('.project-preview').forEach(link => {
        link.setAttribute('aria-haspopup', 'dialog');
        link.addEventListener('click', event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
            event.preventDefault();
            opener = link;
            image.src = link.href;
            image.alt = link.querySelector('img').alt;
            title.textContent = `${link.closest('article').querySelector('h3').textContent} — screenshot`;
            viewer.showModal();
            document.documentElement.classList.add('image-viewer-open');
            close.focus();
        });
    });

    close.addEventListener('click', () => viewer.close());
    // Only a gesture that starts and ends outside closes the modal.
    const outside = event => {
        const rect = viewer.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom;
    };
    let startedOutside = false;
    viewer.addEventListener('pointerdown', event => { startedOutside = outside(event); });
    viewer.addEventListener('click', event => {
        if (startedOutside && outside(event)) viewer.close();
        startedOutside = false;
    });
    // Native dialog handles Escape, focus trapping and background inertness.
    viewer.addEventListener('close', () => {
        document.documentElement.classList.remove('image-viewer-open');
        opener?.focus({ preventScroll: true });
        image.removeAttribute('src');
    });
})();
