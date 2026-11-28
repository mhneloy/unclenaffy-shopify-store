(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionCleanups = new WeakMap();
  const headerObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(updateHeaderOffset) : null;

  function initialiseAerialPan(hero, button) {
    let paused = false;
    function sync() {
      const reduced = motionPreference.matches;
      button.hidden = reduced;
      hero.classList.toggle('has-un-pan', !reduced);
      hero.classList.toggle('is-un-pan-paused', paused);
      button.textContent = paused ? 'Play animation' : 'Pause animation';
    }
    function toggle() {
      paused = !paused;
      sync();
    }
    button.addEventListener('click', toggle);
    motionPreference.addEventListener('change', sync);
    motionCleanups.set(hero, () => {
      button.removeEventListener('click', toggle);
      motionPreference.removeEventListener('change', sync);
      motionCleanups.delete(hero);
    });
    sync();
  }

  function initialiseHero(hero) {
    const template = hero.querySelector('[data-un-video-template]');
    const button = hero.querySelector('[data-un-motion]');
    if (!button || motionCleanups.has(hero)) return;
    if (!template) {
      if (button.hasAttribute('data-un-pan')) initialiseAerialPan(hero, button);
      return;
    }

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
    motionCleanups.set(hero, () => {
      motionPreference.removeEventListener('change', syncPreference);
      button.removeEventListener('click', togglePlayback);
      video?.remove();
      motionCleanups.delete(hero);
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

  function updateHeaderOffset() {
    const header = document.querySelector('.un-header');
    if (!header) return;
    const style = getComputedStyle(header);
    const offset = header.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    document.documentElement.style.setProperty('--un-header-offset', `${offset}px`);
  }

  function observeHeader() {
    headerObserver?.disconnect();
    const header = document.querySelector('.un-header');
    if (header) {
      headerObserver?.observe(header, { box: 'border-box' });
      updateHeaderOffset();
    }
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
    observeHeader();
    syncHeader();
  });
  document.addEventListener('shopify:section:unload', (event) => {
    event.target.querySelectorAll('[data-un-hero]').forEach((hero) => motionCleanups.get(hero)?.());
  });
  window.addEventListener('scroll', syncHeader, { passive: true });
  initialiseSections(document);
  observeHeader();
  syncHeader();
})();
