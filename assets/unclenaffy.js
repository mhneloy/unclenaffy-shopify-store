(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const videoCleanups = new WeakMap();

  function initialiseHero(hero) {
    const template = hero.querySelector('[data-un-video-template]');
    const button = hero.querySelector('[data-un-motion]');
    if (!template || !button || videoCleanups.has(hero)) return;

    const container = template.parentElement;
    let video;
    let pausedByVisitor = false;

    const updateState = () => {
      const playing = video && !video.paused && !video.error;
      button.textContent = playing ? 'Pause video' : 'Play video';
    };

    const play = () => video.play().catch(updateState);
    function syncPreference() {
      if (motionPreference.matches) {
        video?.remove();
        video = undefined;
        container.classList.remove('is-visible');
        button.hidden = true;
        updateState();
        return;
      }

      if (!video) {
        container.append(template.content.cloneNode(true));
        video = container.querySelector('video');
        if (!video) return;
        video.muted = true;
        video.playsInline = true;
        video.addEventListener('playing', () => {
          container.classList.add('is-visible');
          updateState();
        });
        video.addEventListener('pause', updateState);
        const activeVideo = video;
        video.addEventListener('error', () => {
          if (video !== activeVideo) return;
          container.classList.remove('is-visible');
          button.hidden = true;
          updateState();
        });
      }

      button.hidden = false;
      updateState();
      if (!pausedByVisitor) play();
    }

    function togglePlayback() {
      if (!video) return;
      pausedByVisitor = !video.paused;
      if (pausedByVisitor) video.pause();
      else play();
    }

    button.addEventListener('click', togglePlayback);
    motionPreference.addEventListener('change', syncPreference);
    videoCleanups.set(hero, () => {
      motionPreference.removeEventListener('change', syncPreference);
      button.removeEventListener('click', togglePlayback);
      video?.remove();
      videoCleanups.delete(hero);
    });
    syncPreference();
  }

  function initialiseSections(root) {
    root.querySelectorAll('[data-un-hero]').forEach(initialiseHero);
    root.querySelectorAll('[data-un-map-load]').forEach((button) => { button.hidden = false; });
  }

  function syncHeader() {
    document.querySelector('.un-home .un-header')?.classList.toggle('is-solid', window.scrollY > 36);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const menu = document.querySelector('[data-un-menu][open]');
    if (!menu) return;
    menu.open = false;
    menu.querySelector('summary').focus();
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-un-menu] a');
    if (link) {
      const menu = link.closest('[data-un-menu]');
      menu.open = false;
      if (link.pathname === location.pathname && link.hash) {
        const target = document.getElementById(link.hash.slice(1));
        if (target) {
          target.tabIndex = -1;
          target.focus({ preventScroll: true });
        }
      }
    }

    const button = event.target.closest('[data-un-map-load]');
    if (!button) return;
    const map = button.closest('[data-un-map]');
    const iframe = document.createElement('iframe');
    iframe.src = button.dataset.mapUrl;
    iframe.title = 'Interactive map for Uncle Naffy';
    iframe.referrerPolicy = 'no-referrer';
    map.replaceChildren(iframe);
    iframe.focus();
  });

  document.addEventListener('shopify:section:load', (event) => {
    initialiseSections(event.target);
    syncHeader();
  });
  document.addEventListener('shopify:section:unload', (event) => {
    event.target.querySelectorAll('[data-un-hero]').forEach((hero) => videoCleanups.get(hero)?.());
  });
  window.addEventListener('scroll', syncHeader, { passive: true });
  initialiseSections(document);
  syncHeader();
})();
