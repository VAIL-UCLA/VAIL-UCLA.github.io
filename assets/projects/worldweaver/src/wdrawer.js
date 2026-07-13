/*
 * wdrawer.js — W-Drawer_Page (GenAgent) enhancement script.
 *
 * Plain vanilla JavaScript. No framework, no npm, no build step.
 * Loaded from index.html via <script defer src="wdrawer.js"></script>.
 *
 * Structure:
 *   1. CONFIG constants.
 *   2. Pure, DOM-free logic functions (tasks 2.2–2.7) — unit / property testable.
 *   3. Feature-module init functions, each wrapped in its own try/catch so a
 *      single module failure never breaks the others or the page content.
 *   4. DOMContentLoaded dispatcher.
 *   5. Node-testing export guard (ignored by the browser <script defer> path).
 *
 * The feature-module bodies (scroll-spy, smooth-scroll, bibtex copy,
 * back-to-top, reveal, meta, lazy-load) are filled in by later tasks (3–13).
 */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------- *
   * 1. Configuration constants (design: 数据模型 / 配置常量)
   * ---------------------------------------------------------------------- */
  var CONFIG = {
    NAV_GAP: 12, // extra gap below the fixed nav for scroll landing (px)
    SPY_LINE_RATIO: 0.30, // scroll-spy probe line position (fraction of viewport height) — req 2.1
    BACK_TO_TOP_THRESHOLD: 400, // back-to-top show/hide threshold (px) — req 8.1/8.3
    REVEAL_MARGIN_RATIO: 0.15, // reveal trigger line from viewport bottom — req 9.1
    OG_DESC_MAX: 200, // OG/Twitter description max length — req 10.5
    SECTION_IDS: ['gallery', 'abstract', 'method', 'experiments', 'citation']
  };

  /* ---------------------------------------------------------------------- *
   * 2. Pure logic functions (DOM-free, testable)
   * ---------------------------------------------------------------------- */

  /**
   * computeActiveIndex(input) — task 2.2, requirements 2.1/2.3/2.4/2.5.
   *
   * Given a SpyInput { sections, scrollY, viewportHeight, docHeight, lineRatio }
   * where `sections` is a non-empty, document-ordered array of geometry objects
   * exposing a numeric `top`, returns the single active section index.
   *
   *   probe line: line = scrollY + viewportHeight * lineRatio
   *   - scrollY <= sections[0].top                          -> 0            (req 2.4)
   *   - scrollY + viewportHeight >= docHeight - 1           -> n - 1        (req 2.5)
   *   - otherwise: last index whose top <= line, else 0
   *
   * Always returns a single integer in [0, n - 1].
   */
  function computeActiveIndex(input) {
    if (!input || !input.sections || input.sections.length === 0) {
      return 0;
    }

    var sections = input.sections;
    var n = sections.length;
    var scrollY = Number(input.scrollY) || 0;
    var viewportHeight = Number(input.viewportHeight) || 0;
    var docHeight = Number(input.docHeight) || 0;
    var lineRatio = typeof input.lineRatio === 'number' ? input.lineRatio : CONFIG.SPY_LINE_RATIO;

    // Above (or at) the first section's top edge -> first section (req 2.4).
    if (scrollY <= sections[0].top) {
      return 0;
    }

    // Reached the bottom of the page -> last section (req 2.5).
    if (scrollY + viewportHeight >= docHeight - 1) {
      return n - 1;
    }

    // Normal case: last section whose top edge has crossed the probe line.
    var line = scrollY + viewportHeight * lineRatio;
    var activeIndex = 0;
    var found = false;
    for (var i = 0; i < n; i++) {
      if (sections[i].top <= line) {
        activeIndex = i;
        found = true;
      }
    }
    return found ? activeIndex : 0;
  }

  /**
   * computeScrollTarget(sectionTop, navHeight, gap) — task 2.3, requirements 1.4/1.5.
   *
   * Returns the smooth-scroll landing position so the section heading's top edge
   * sits at or below the nav bar's bottom edge. The landing is never negative and
   * is capped at (sectionTop - navHeight).
   */
  function computeScrollTarget(sectionTop, navHeight, gap) {
    var top = Number(sectionTop) || 0;
    var nav = Number(navHeight) || 0;
    var g = Number(gap) || 0;
    var cap = top - nav; // heading top exactly at nav bottom
    var desired = cap - g; // heading top a little below nav bottom
    // gap >= 0 => desired <= cap; guard with min in case of odd inputs.
    return Math.max(0, Math.min(cap, desired));
  }

  /**
   * trimBibtex(text) — task 2.4, requirement 7.2.
   *
   * Returns the contiguous substring between the first and last non-whitespace
   * characters, preserving internal whitespace/newlines. No leading/trailing
   * whitespace. All-whitespace (or non-string) input yields "". Idempotent.
   */
  function trimBibtex(text) {
    if (typeof text !== 'string') {
      return '';
    }
    return text.trim();
  }

  /**
   * truncateDescription(text, maxLen) — task 2.5, requirement 10.5.
   *
   * Returns a prefix of `text` with length <= maxLen that does not cut a word in
   * half (any trailing partial word is dropped). If `text` already fits within
   * maxLen it is returned unchanged.
   */
  function truncateDescription(text, maxLen) {
    if (typeof text !== 'string') {
      return '';
    }
    var limit = Number(maxLen);
    if (!isFinite(limit) || limit < 0) {
      return '';
    }
    if (text.length <= limit) {
      return text;
    }

    var truncated = text.slice(0, limit);

    // If the character right after the cut is non-whitespace AND the last kept
    // character is non-whitespace, the boundary splits a word -> drop the
    // trailing partial word back to the last whitespace run.
    var nextChar = text.charAt(limit);
    if (/\S/.test(nextChar) && /\S$/.test(truncated)) {
      var lastWs = truncated.search(/\s\S*$/);
      if (lastWs !== -1) {
        truncated = truncated.slice(0, lastWs);
      } else {
        // No whitespace at all: a single word longer than maxLen -> empty prefix.
        truncated = '';
      }
    }

    // Remove any trailing whitespace so the result is a clean prefix.
    return truncated.replace(/\s+$/, '');
  }

  /**
   * shouldShowBackToTop(scrollY, threshold) — task 2.6, requirements 8.1/8.3.
   *
   * True iff the vertical scroll position is strictly beyond the threshold.
   */
  function shouldShowBackToTop(scrollY, threshold) {
    return Number(scrollY) > Number(threshold);
  }

  /**
   * createRevealState() / reveal(state) — task 2.7, requirement 9.2.
   *
   * Reveal state machine. `reveal` is idempotent: once a section is revealed the
   * transition is not replayed and the same state reference is returned, so
   * `reveal(reveal(s)) === reveal(s)`. `transitions` never exceeds 1.
   */
  function createRevealState() {
    return { revealed: false, transitions: 0 };
  }

  function reveal(state) {
    if (!state) {
      return state;
    }
    if (!state.revealed) {
      state.revealed = true;
      state.transitions += 1;
    }
    return state;
  }

  /* -------------------------------------------------------------------- *
   * Gallery carousel pure logic (task 2.1) — DOM-free, testable.
   *
   * The #gallery Video_Carousel keeps a single runtime state
   * { activeIndex, isPlaying } and derives all view/behaviour from these
   * pure functions. They are deliberately defensive: illegal or
   * out-of-range inputs (count <= 0, non-integer indices) are normalized
   * rather than throwing, so the DOM shell can never crash on bad data.
   * -------------------------------------------------------------------- */

  // Coerce an arbitrary value to a non-negative integer sample count.
  // Invalid / negative / non-finite input collapses to 0 (no samples).
  function toCount(count) {
    var c = Math.floor(Number(count));
    if (!isFinite(c) || c < 0) {
      return 0;
    }
    return c;
  }

  // Coerce an arbitrary value to an integer index (floored). Non-finite
  // input collapses to 0 so downstream modular math stays well-defined.
  function toIndexInt(index) {
    var i = Math.floor(Number(index));
    if (!isFinite(i)) {
      return 0;
    }
    return i;
  }

  /**
   * normalizeIndex(index, count) — task 2.1, requirement 4.4.
   *
   * Normalizes any integer index into [0, count - 1] via modular wrap
   * (((index % count) + count) % count). Returns 0 when count <= 0.
   */
  function normalizeIndex(index, count) {
    var c = toCount(count);
    if (c <= 0) {
      return 0;
    }
    var i = toIndexInt(index);
    return ((i % c) + c) % c;
  }

  /**
   * nextIndex(current, count) — task 2.1, requirements 2.4/2.6/2.8.
   *
   * Advances to the next sample in DOM order, wrapping the last back to
   * the first: (current + 1) mod count. Result is always in [0, count-1].
   */
  function nextIndex(current, count) {
    return normalizeIndex(toIndexInt(current) + 1, count);
  }

  /**
   * prevIndex(current, count) — task 2.1, requirements 2.5/2.7/2.8.
   *
   * Steps back to the previous sample, wrapping the first to the last:
   * (current - 1 + count) mod count. Result is always in [0, count-1].
   */
  function prevIndex(current, count) {
    return normalizeIndex(toIndexInt(current) - 1, count);
  }

  /**
   * computeDotStates(activeIndex, count) — task 2.1,
   * requirements 4.1/4.2/4.3/5.1/8.5.
   *
   * Returns a boolean array of length `count` with exactly one `true` at
   * the (normalized) activeIndex and all other entries `false`. Returns an
   * empty array when count <= 0. Because activeIndex is normalized, the
   * "exactly one true" invariant holds even for out-of-range input.
   */
  function computeDotStates(activeIndex, count) {
    var c = toCount(count);
    var states = [];
    if (c <= 0) {
      return states;
    }
    var active = normalizeIndex(activeIndex, c);
    for (var i = 0; i < c; i++) {
      states.push(i === active);
    }
    return states;
  }

  /**
   * shouldShowNav(count) — task 2.1, requirements 2.8/2.10.
   *
   * Prev/Next controls are shown only when there are at least two samples.
   */
  function shouldShowNav(count) {
    return toCount(count) >= 2;
  }

  /**
   * playPauseView(isPlaying) — task 2.1, requirements 3.4/3.5/5.3.
   *
   * Maps the playback intent to the Play_Pause_Control icon class and a
   * non-empty accessible label. Playing -> pause icon ("Pause video");
   * paused -> play icon ("Play video"). The label is always non-empty.
   */
  function playPauseView(isPlaying) {
    if (isPlaying) {
      return { iconClass: 'fa-solid fa-pause', label: 'Pause video' };
    }
    return { iconClass: 'fa-solid fa-play', label: 'Play video' };
  }

  /**
   * applyCarouselAction(state, action, count) — task 2.1,
   * requirements 3.6/4.5/5.1/5.2/5.4/5.5/5.6.
   *
   * Pure reducer over CarouselState { activeIndex, isPlaying }. Never
   * mutates the input state; the real <video> play/pause side effects are
   * performed by the render layer from the returned state. Semantics:
   *   - { type: 'next' }          -> activeIndex via nextIndex; isPlaying unchanged.
   *   - { type: 'prev' }          -> activeIndex via prevIndex; isPlaying unchanged.
   *   - { type: 'select', index } -> activeIndex = normalizeIndex(index);
   *                                  isPlaying unchanged. If the normalized
   *                                  index equals the current activeIndex the
   *                                  returned state is equivalent (no change).
   *   - { type: 'togglePlay' }    -> isPlaying flipped; activeIndex unchanged.
   *   - { type: 'playbackFailed' }-> isPlaying = false; activeIndex unchanged.
   * The result always satisfies 0 <= activeIndex < count (0 when count <= 0).
   */
  function applyCarouselAction(state, action, count) {
    var c = toCount(count);
    var src = (state && typeof state === 'object') ? state : {};
    // Normalize the incoming activeIndex so the output invariant always holds.
    var activeIndex = c > 0 ? normalizeIndex(src.activeIndex, c) : 0;
    var isPlaying = !!src.isPlaying;
    var type = (action && action.type) ? action.type : null;

    var nextActive = activeIndex;
    var nextPlaying = isPlaying;

    switch (type) {
      case 'next':
        nextActive = nextIndex(activeIndex, c);
        break;
      case 'prev':
        nextActive = prevIndex(activeIndex, c);
        break;
      case 'select':
        nextActive = c > 0 ? normalizeIndex(action.index, c) : 0;
        break;
      case 'togglePlay':
        nextPlaying = !isPlaying;
        break;
      case 'playbackFailed':
        nextPlaying = false;
        break;
      default:
        // Unknown / missing action: return the normalized current state.
        break;
    }

    return { activeIndex: nextActive, isPlaying: nextPlaying };
  }

  /* ---------------------------------------------------------------------- *
   * 3. Feature-module init functions (stubs — filled in by later tasks).
   *    Each is invoked inside its own try/catch by the dispatcher below.
   * ---------------------------------------------------------------------- */

  // Scroll-spy active-link highlight (task 3, requirements 2.1/2.2/2.3/2.4/2.5/11.7).
  function initScrollSpy() {
    if (typeof document === 'undefined' || !document.querySelector) {
      return;
    }

    // 1. Resolve the six sections and their matching nav links (match by
    //    href="#<id>"). Only keep sections that actually exist in the DOM and
    //    have a corresponding link, preserving document (CONFIG) order.
    var entries = []; // { id, sectionEl, linkEl }
    for (var i = 0; i < CONFIG.SECTION_IDS.length; i++) {
      var id = CONFIG.SECTION_IDS[i];
      var sectionEl = document.getElementById(id);
      var linkEl = document.querySelector('.site-nav__link[href="#' + id + '"]');
      if (sectionEl && linkEl) {
        entries.push({ id: id, sectionEl: sectionEl, linkEl: linkEl });
      }
    }

    if (entries.length === 0) {
      return; // Nothing to highlight; degrade silently.
    }

    // 2. Apply the active state so exactly one nav link is marked active.
    function applyActive(activeIndex) {
      for (var j = 0; j < entries.length; j++) {
        var link = entries[j].linkEl;
        if (j === activeIndex) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'true');
        } else {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        }
      }
    }

    // 3. Gather current geometry for every section (top/bottom relative to the
    //    document), build the SpyInput, and resolve the single active index via
    //    the pure computeActiveIndex function.
    function recompute() {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var sections = [];
      for (var k = 0; k < entries.length; k++) {
        var rect = entries[k].sectionEl.getBoundingClientRect();
        sections.push({
          id: entries[k].id,
          top: rect.top + scrollY,
          bottom: rect.bottom + scrollY
        });
      }

      var docEl = document.documentElement || {};
      var input = {
        sections: sections,
        scrollY: scrollY,
        viewportHeight: window.innerHeight || docEl.clientHeight || 0,
        docHeight: docEl.scrollHeight || 0,
        lineRatio: CONFIG.SPY_LINE_RATIO
      };

      applyActive(computeActiveIndex(input));
    }

    // 4. Throttle recomputation with requestAnimationFrame so scroll/resize
    //    bursts collapse into at most one recompute per frame.
    var scheduled = false;
    var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) ?
      window.requestAnimationFrame.bind(window) :
      function (fn) { return setTimeout(fn, 16); };

    function scheduleRecompute() {
      if (scheduled) {
        return;
      }
      scheduled = true;
      raf(function () {
        scheduled = false;
        recompute();
      });
    }

    // 5. IntersectionObserver drives updates as sections cross the 30% probe
    //    line; scroll + resize listeners cover the page-top / page-bottom
    //    boundary cases (reqs 2.4/2.5) where no section intersects the line.
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function () {
        scheduleRecompute();
      }, { root: null, rootMargin: '-30% 0px -70% 0px', threshold: 0 });

      for (var m = 0; m < entries.length; m++) {
        observer.observe(entries[m].sectionEl);
      }
    }

    // Graceful degradation: when IntersectionObserver is unavailable we still
    // highlight via the scroll/resize + computeActiveIndex path below.
    window.addEventListener('scroll', scheduleRecompute, { passive: true });
    window.addEventListener('resize', scheduleRecompute);

    // Initial highlight for the load position.
    recompute();
  }

  // Smooth scroll + nav offset + focus transfer (task 4, requirements 1.4/1.5/1.7/11.6).
  function initSmoothScroll() {
    if (typeof document === 'undefined' || !document.querySelectorAll) {
      return;
    }

    var links = document.querySelectorAll('.site-nav__link');
    if (!links || links.length === 0) {
      return; // No nav links to wire up; degrade silently.
    }

    // Resolve the fixed nav bar height. Prefer the --nav-h CSS variable (the
    // offset system authored in styles.css); fall back to the live .site-nav
    // offsetHeight so the landing offset stays correct even if the variable is
    // missing or unresolved.
    function getNavHeight() {
      var navH = 0;
      try {
        if (typeof window !== 'undefined' && window.getComputedStyle && document.documentElement) {
          var raw = window.getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
          if (raw) {
            navH = parseFloat(raw);
          }
        }
      } catch (e) {
        navH = 0;
      }
      if (!navH || !isFinite(navH) || navH <= 0) {
        var navEl = document.querySelector('.site-nav');
        if (navEl && typeof navEl.offsetHeight === 'number') {
          navH = navEl.offsetHeight;
        }
      }
      return (isFinite(navH) && navH > 0) ? navH : 0;
    }

    // Scroll to the computed landing y. Use native smooth behaviour when the
    // browser supports it (landing completes within ~1000ms); otherwise fall
    // back to an instant jump to the SAME computed y so the offset is still
    // correct (req 1.4/1.5 robustness).
    function scrollToY(y) {
      var supportsSmooth = false;
      try {
        supportsSmooth = !!(document.documentElement &&
          document.documentElement.style &&
          'scrollBehavior' in document.documentElement.style);
      } catch (e) {
        supportsSmooth = false;
      }
      try {
        if (supportsSmooth && typeof window.scrollTo === 'function') {
          window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          window.scrollTo(0, y);
        }
      } catch (e) {
        // Some engines throw on the options-object form; jump instantly instead.
        try {
          window.scrollTo(0, y);
        } catch (e2) {
          /* nothing more we can do */
        }
      }
    }

    function onClick(event) {
      var link = event.currentTarget;
      var hash = link && link.getAttribute ? link.getAttribute('href') : null;

      // Only act on in-page anchor targets.
      if (!hash || hash.charAt(0) !== '#' || hash === '#') {
        return; // Not an in-page anchor; leave default behaviour untouched.
      }

      var target = null;
      try {
        target = document.querySelector(hash);
      } catch (e) {
        target = null; // Malformed selector -> treat as missing target.
      }

      // req 1.7: target missing -> do NOT preventDefault, do NOT scroll, keep
      // the current scroll position (native anchor behaviour, if any, applies).
      if (!target) {
        return;
      }

      // Target exists: take over navigation.
      event.preventDefault();

      var navHeight = getNavHeight();
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var rectTop = target.getBoundingClientRect().top;
      var sectionTop = rectTop + scrollY;
      var y = computeScrollTarget(sectionTop, navHeight, CONFIG.NAV_GAP);

      scrollToY(y);

      // req 11.6: move keyboard focus into the target section after initiating
      // the scroll. tabindex="-1" makes a non-interactive section focusable;
      // preventScroll avoids the browser re-scrolling and fighting our landing.
      try {
        target.setAttribute('tabindex', '-1');
        if (typeof target.focus === 'function') {
          target.focus({ preventScroll: true });
        }
      } catch (e) {
        // Older browsers reject the focus options object; retry without it.
        try {
          target.focus();
        } catch (e2) {
          /* focus transfer unsupported; scrolling still succeeded */
        }
      }
    }

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', onClick);
    }
  }

  // Sticky section heading reveal: the nav lives below the hero/teaser and
  // expands once the teaser has been scrolled past, hiding again when the user
  // scrolls back over the teaser.
  function initNavReveal() {
    if (typeof document === 'undefined' || !document.querySelector) {
      return;
    }

    var nav = document.querySelector('.site-nav');
    var teaser = document.querySelector('.world-teaser-img');
    var hero = document.querySelector('.hero-bg');
    if (!nav) {
      return; // No nav on the page; degrade silently.
    }

    // Apply the pinned/hidden state. Only mutate the DOM when the desired state
    // actually changes so the CSS transition is not restarted every frame.
    var pinned = null; // unknown until the first apply
    function applyPinned(shouldPin) {
      if (shouldPin === pinned) {
        return;
      }
      pinned = shouldPin;
      if (shouldPin) {
        nav.classList.add('is-pinned');
        nav.removeAttribute('aria-hidden');
      } else {
        nav.classList.remove('is-pinned');
        // Keep the collapsed heading out of the a11y tree while hidden.
        // pointer-events:none + opacity block pointer/keyboard interaction.
        nav.setAttribute('aria-hidden', 'true');
      }
    }

    var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) ?
      window.requestAnimationFrame.bind(window) :
      function (fn) { return setTimeout(fn, 16); };

    function getNavHeight() {
      if (nav && typeof nav.offsetHeight === 'number' && nav.offsetHeight > 0) {
        return nav.offsetHeight;
      }
      var cssNavH = 0;
      try {
        var raw = window.getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
        cssNavH = raw ? parseFloat(raw) : 0;
      } catch (e) {
        cssNavH = 0;
      }
      return (isFinite(cssNavH) && cssNavH > 0) ? cssNavH : 0;
    }

    function shouldPinFromTeaser() {
      var target = teaser || hero;
      if (!target || !target.getBoundingClientRect) {
        return false;
      }
      var rect = target.getBoundingClientRect();
      return rect.bottom <= getNavHeight();
    }

    function recompute() {
      applyPinned(shouldPinFromTeaser());
    }

    var scheduled = false;
    function scheduleRecompute() {
      if (scheduled) {
        return;
      }
      scheduled = true;
      raf(function () {
        scheduled = false;
        recompute();
      });
    }

    window.addEventListener('scroll', scheduleRecompute, { passive: true });
    window.addEventListener('resize', scheduleRecompute);

    // Initial check so the state is correct on load (at top -> hidden).
    recompute();
  }

  // Smooth nav interaction: the bottom bar reflects total page reading
  // progress, while a frosted cursor follows hovered/focused/current sections.
  function initNavProgressAndCursor() {
    if (typeof document === 'undefined' || !document.querySelector) {
      return;
    }

    var nav = document.querySelector('.site-nav');
    if (!nav) {
      return;
    }

    var links = nav.querySelectorAll('.site-nav__link');
    if (!links || links.length === 0) {
      return;
    }

    var activeHover = null;
    var scheduled = false;
    var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) ?
      window.requestAnimationFrame.bind(window) :
      function (fn) { return setTimeout(fn, 16); };

    function clamp01(value) {
      if (!isFinite(value)) {
        return 0;
      }
      return Math.max(0, Math.min(1, value));
    }

    function updateProgress() {
      var docEl = document.documentElement || {};
      var body = document.body || {};
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var docHeight = Math.max(docEl.scrollHeight || 0, body.scrollHeight || 0);
      var viewportHeight = window.innerHeight || docEl.clientHeight || 1;
      var maxScroll = Math.max(1, docHeight - viewportHeight);
      nav.style.setProperty('--nav-progress', String(clamp01(scrollY / maxScroll)));
    }

    function getActiveLink() {
      return nav.querySelector('.site-nav__link.is-active') || links[0];
    }

    function placeCursor(link, opacity) {
      if (!link || !link.getBoundingClientRect || !nav.getBoundingClientRect) {
        nav.style.setProperty('--nav-cursor-opacity', '0');
        return;
      }

      var navRect = nav.getBoundingClientRect();
      var linkRect = link.getBoundingClientRect();
      var x = Math.round(linkRect.left - navRect.left);
      var y = Math.round(linkRect.top - navRect.top);
      var w = Math.round(linkRect.width);
      var h = Math.round(linkRect.height);

      nav.style.setProperty('--nav-cursor-x', x + 'px');
      nav.style.setProperty('--nav-cursor-y', y + 'px');
      nav.style.setProperty('--nav-cursor-w', w + 'px');
      nav.style.setProperty('--nav-cursor-h', h + 'px');
      nav.style.setProperty('--nav-cursor-opacity', String(opacity));
    }

    function updateCursor() {
      var target = activeHover || getActiveLink();
      var isPinned = nav.classList.contains('is-pinned');
      placeCursor(target, isPinned ? 1 : 0);
    }

    function recompute() {
      updateProgress();
      updateCursor();
    }

    function scheduleRecompute() {
      if (scheduled) {
        return;
      }
      scheduled = true;
      raf(function () {
        scheduled = false;
        recompute();
      });
    }

    for (var i = 0; i < links.length; i += 1) {
      links[i].addEventListener('pointerenter', function (event) {
        activeHover = event.currentTarget;
        scheduleRecompute();
      });
      links[i].addEventListener('focus', function (event) {
        activeHover = event.currentTarget;
        scheduleRecompute();
      });
      links[i].addEventListener('blur', function () {
        activeHover = null;
        scheduleRecompute();
      });
    }

    nav.addEventListener('pointermove', function (event) {
      var target = event.target && event.target.closest ?
        event.target.closest('.site-nav__link') :
        null;
      if (target && target !== activeHover) {
        activeHover = target;
        scheduleRecompute();
      }
    });

    nav.addEventListener('pointerleave', function () {
      activeHover = null;
      scheduleRecompute();
    });

    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(scheduleRecompute);
      for (var j = 0; j < links.length; j += 1) {
        observer.observe(links[j], { attributes: true, attributeFilter: ['class'] });
      }
      observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
    }

    window.addEventListener('scroll', scheduleRecompute, { passive: true });
    window.addEventListener('resize', scheduleRecompute);

    recompute();
  }

  // One-click BibTeX copy (task 8, requirements 7.1/7.2/7.3/7.4/7.5).
  function initBibtexCopy() {
    if (typeof document === 'undefined' || !document.querySelectorAll) {
      return;
    }

    var buttons = document.querySelectorAll('.copy-btn[data-copy-target]');
    if (!buttons || buttons.length === 0) {
      return; // No copy control on the page; degrade silently.
    }

    var DEFAULT_LABEL = '复制 BibTeX';
    var SUCCESS_LABEL = '已复制 ✓';
    var SUCCESS_MSG = '已复制到剪贴板';
    var FAIL_MSG = '复制失败，请手动选择';
    // Restore the button to its default state within 3s (req 7.5); the success
    // indication therefore stays visible well beyond the >= 2s minimum (req 7.3).
    var RESTORE_MS = 2500;
    var FAIL_RESTORE_MS = 4000;

    function wire(btn) {
      var targetSel = btn.getAttribute('data-copy-target');
      var scope = (btn.closest && btn.closest('.citation-block')) || btn.parentNode;
      var labelEl = btn.querySelector('.copy-btn__label');
      var statusEl = scope && scope.querySelector ? scope.querySelector('.copy-status') : null;
      var timers = [];

      function clearTimers() {
        for (var t = 0; t < timers.length; t++) {
          clearTimeout(timers[t]);
        }
        timers = [];
      }

      function setLabel(text) {
        if (labelEl) {
          labelEl.textContent = text;
        }
      }

      function setStatus(text) {
        // aria-live="polite" region -> feedback is announced to AT.
        if (statusEl) {
          statusEl.textContent = text;
        }
      }

      // Success feedback shown synchronously on resolve (well within 500ms of
      // activation, req 7.3), then reset to default within 3s (req 7.5).
      function showSuccess() {
        clearTimers();
        btn.classList.remove('copy-btn--error');
        btn.classList.add('copy-btn--success');
        setLabel(SUCCESS_LABEL);
        setStatus(SUCCESS_MSG);
        timers.push(setTimeout(function () {
          btn.classList.remove('copy-btn--success');
          setLabel(DEFAULT_LABEL);
          setStatus('');
        }, RESTORE_MS));
      }

      // Failure feedback: visible message, BibTeX text left unchanged (req 7.4).
      function showFailure() {
        clearTimers();
        btn.classList.remove('copy-btn--success');
        btn.classList.add('copy-btn--error');
        setLabel(DEFAULT_LABEL);
        setStatus(FAIL_MSG);
        timers.push(setTimeout(function () {
          btn.classList.remove('copy-btn--error');
          setStatus('');
        }, FAIL_RESTORE_MS));
      }

      // Legacy fallback: hidden textarea + document.execCommand('copy').
      // Never mutates the #bibtex element itself, so its text stays intact.
      function legacyCopy(text) {
        var ok = false;
        var ta = null;
        try {
          ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          ta.style.top = '0';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          if (typeof ta.setSelectionRange === 'function') {
            ta.setSelectionRange(0, text.length);
          }
          ok = !!(document.execCommand && document.execCommand('copy'));
        } catch (e) {
          ok = false;
        }
        if (ta && ta.parentNode) {
          ta.parentNode.removeChild(ta);
        }
        return ok;
      }

      function tryLegacy(text) {
        if (legacyCopy(text)) {
          showSuccess();
        } else {
          showFailure();
        }
      }

      function onActivate() {
        var target = null;
        try {
          target = targetSel ? document.querySelector(targetSel) : null;
        } catch (e) {
          target = null;
        }
        if (!target) {
          showFailure();
          return;
        }

        // Read the raw text from the #bibtex element and normalize it with the
        // pure trimBibtex so the clipboard payload is byte-clean (req 7.2).
        var trimmed = trimBibtex(target.textContent || '');

        var clip = (typeof navigator !== 'undefined') ? navigator.clipboard : null;
        if (clip && typeof clip.writeText === 'function') {
          try {
            var p = clip.writeText(trimmed);
            if (p && typeof p.then === 'function') {
              p.then(showSuccess, function () {
                tryLegacy(trimmed); // Promise rejected -> fall back (req 7.4).
              });
            } else {
              showSuccess();
            }
          } catch (e) {
            tryLegacy(trimmed); // Synchronous throw -> fall back.
          }
        } else {
          tryLegacy(trimmed); // Clipboard API unavailable -> fall back.
        }
      }

      btn.addEventListener('click', onActivate);
    }

    for (var i = 0; i < buttons.length; i++) {
      wire(buttons[i]);
    }
  }

  // Back-to-top control (task 9, requirements 8.1/8.2/8.3/8.4/8.5).
  function initBackToTop() {
    if (typeof document === 'undefined' || !document.querySelector) {
      return;
    }

    var btn = document.querySelector('.back-to-top');
    if (!btn) {
      return; // No control on the page; degrade silently.
    }

    // Toggle visibility driven by the pure shouldShowBackToTop threshold check.
    // The `hidden` attribute keeps the button non-interactive/AT-invisible when
    // hidden; the .is-visible class drives the CSS opacity/visibility transition
    // (completes within ~300ms — reqs 8.1/8.3). We only mutate the DOM when the
    // desired state actually changes, so the transition is not restarted on
    // every scroll frame.
    var visible = null; // unknown until the first apply
    function applyVisibility(shouldShow) {
      if (shouldShow === visible) {
        return;
      }
      visible = shouldShow;
      if (shouldShow) {
        // Reveal before adding the class so the opacity transition can run.
        btn.removeAttribute('hidden');
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
        // Re-hide from AT / interaction once fully scrolled back near the top.
        btn.setAttribute('hidden', '');
      }
    }

    function recompute() {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      applyVisibility(shouldShowBackToTop(scrollY, CONFIG.BACK_TO_TOP_THRESHOLD));
    }

    // Throttle scroll handling with requestAnimationFrame so bursts collapse
    // into at most one recompute per frame.
    var scheduled = false;
    var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) ?
      window.requestAnimationFrame.bind(window) :
      function (fn) { return setTimeout(fn, 16); };

    function scheduleRecompute() {
      if (scheduled) {
        return;
      }
      scheduled = true;
      raf(function () {
        scheduled = false;
        recompute();
      });
    }

    // Activation: native <button> already handles click + Enter/Space, so a
    // single click listener covers all activation paths (req 8.2). Scroll to the
    // top with native smooth behaviour (~1000ms) and fall back to an instant
    // jump when smooth scrolling is unsupported.
    function onActivate() {
      var supportsSmooth = false;
      try {
        supportsSmooth = !!(document.documentElement &&
          document.documentElement.style &&
          'scrollBehavior' in document.documentElement.style);
      } catch (e) {
        supportsSmooth = false;
      }
      try {
        if (supportsSmooth && typeof window.scrollTo === 'function') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      } catch (e) {
        try {
          window.scrollTo(0, 0);
        } catch (e2) {
          /* nothing more we can do */
        }
      }
    }

    btn.addEventListener('click', onActivate);
    window.addEventListener('scroll', scheduleRecompute, { passive: true });
    window.addEventListener('resize', scheduleRecompute);

    // Initial check so the control state matches the load scroll position.
    recompute();
  }

  // Section reveal-on-scroll animation (task 10, requirements 9.1–9.7).
  function initReveal() {
    if (typeof document === 'undefined' || !document.getElementById) {
      return;
    }

    // 1. Resolve the six content sections in document (CONFIG) order. Only keep
    //    ones that actually exist in the DOM.
    var entries = []; // { el, state }
    for (var i = 0; i < CONFIG.SECTION_IDS.length; i++) {
      var el = document.getElementById(CONFIG.SECTION_IDS[i]);
      if (el) {
        entries.push({ el: el, state: createRevealState() });
      }
    }

    if (entries.length === 0) {
      return; // Nothing to reveal; degrade silently.
    }

    // 2. Add the `.reveal` class at RUNTIME (initial hidden state). Applying it
    //    here rather than in the static HTML guarantees that if this script
    //    never runs the sections stay fully visible (no flash-of-hidden-content,
    //    req 9.7). Text remains in the DOM and selectable throughout (req 9.4).
    for (var j = 0; j < entries.length; j++) {
      entries[j].el.classList.add('reveal');
    }

    // Drive a section to its final visible state through the reveal state
    // machine so the transition is played at most once per load (req 9.2).
    // Returns true when this call performed the (single) transition.
    function revealEntry(entry) {
      var before = entry.state.transitions;
      reveal(entry.state);
      if (entry.state.transitions > before) {
        entry.el.classList.add('is-revealed');
        return true;
      }
      return false;
    }

    // Immediately mark every section as revealed (final visible state) and skip
    // observing. Used for reduced-motion and the IO-unavailable fallback.
    function revealAll() {
      for (var k = 0; k < entries.length; k++) {
        revealEntry(entries[k]);
      }
    }

    // 3. Respect reduced motion: show the final visible state at once and skip
    //    scroll-triggered animation entirely (req 9.3). CSS also forces the
    //    final state under the reduced-motion media query as a safety net.
    var reducedMotion = false;
    try {
      reducedMotion = !!(typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      reducedMotion = false;
    }
    if (reducedMotion) {
      revealAll();
      return;
    }

    // 4. Without IntersectionObserver, reveal everything immediately so all
    //    sections render in their final visible state (req 9.7).
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    // 5. Observe each section. rootMargin shrinks the viewport bottom by 15%, so
    //    a section triggers once its top enters within 15% of the viewport
    //    bottom (req 9.1). Sections already within the viewport at load fire
    //    immediately (req 9.6). Each is unobserved after revealing so the
    //    transition runs at most once (req 9.2).
    function findEntry(target) {
      for (var m = 0; m < entries.length; m++) {
        if (entries[m].el === target) {
          return entries[m];
        }
      }
      return null;
    }

    var observer = new IntersectionObserver(function (observed) {
      for (var n = 0; n < observed.length; n++) {
        if (observed[n].isIntersecting) {
          var entry = findEntry(observed[n].target);
          if (entry) {
            revealEntry(entry);
            observer.unobserve(observed[n].target);
          }
        }
      }
    }, { root: null, rootMargin: '0px 0px -15% 0px', threshold: 0 });

    for (var p = 0; p < entries.length; p++) {
      observer.observe(entries[p].el);
    }
  }

  // Open Graph / Twitter meta description (task 11).
  function initMeta() {
    // TODO(task 11): derive description via truncateDescription(abstract, OG_DESC_MAX).
  }

  // Lazy-loading of below-the-fold media (task 13, requirements 12.2/12.3/12.4).
  //
  // The Hero teaser is the LCP element and is intentionally eager (plain src,
  // fetchpriority="high" in the HTML) — it is NOT touched here. This module only
  // concerns future below-the-fold media. Today the #gallery columns are
  // labelled placeholders (with a reserved aspect-ratio), so there is nothing to
  // lazy-load yet and this no-ops safely; it is ready for real <img> media added
  // later via loading="lazy" (native) or data-src (IntersectionObserver fallback).
  function initLazyLoad() {
    if (typeof document === 'undefined' || !document.querySelectorAll) {
      return;
    }

    // Collect candidate below-the-fold images: those declaring native lazy
    // loading and/or a deferred data-src source. De-duplicate since an <img>
    // may carry both markers.
    var seen = [];
    function collect(selector) {
      var list = document.querySelectorAll(selector);
      for (var i = 0; i < list.length; i++) {
        if (seen.indexOf(list[i]) === -1) {
          seen.push(list[i]);
        }
      }
    }
    collect('img[data-src]');
    collect('img[loading="lazy"]');

    if (seen.length === 0) {
      return; // No lazy media present yet; nothing to do.
    }

    // Swap a single element's data-src -> src (and data-srcset -> srcset) exactly
    // once, then clear the markers so it is never reprocessed.
    function loadImg(img) {
      if (!img || img.getAttribute('data-lazy-loaded') === '1') {
        return;
      }
      var src = img.getAttribute('data-src');
      if (src) {
        img.setAttribute('src', src);
        img.removeAttribute('data-src');
      }
      var srcset = img.getAttribute('data-srcset');
      if (srcset) {
        img.setAttribute('srcset', srcset);
        img.removeAttribute('data-srcset');
      }
      img.setAttribute('data-lazy-loaded', '1');
    }

    // Native lazy-loading support: leave <img loading="lazy"> to the browser.
    // Only elements that still need JS help are those carrying a data-src source
    // that the browser will not resolve on its own.
    var supportsNativeLazy = ('loading' in (document.createElement('img')));

    var needsObserver = [];
    for (var j = 0; j < seen.length; j++) {
      var img = seen[j];
      var hasDataSrc = !!img.getAttribute('data-src');
      var isNativeLazy = img.getAttribute('loading') === 'lazy';

      if (supportsNativeLazy && isNativeLazy && !hasDataSrc) {
        // Browser handles fetch timing via the src + loading="lazy" attributes.
        continue;
      }
      if (supportsNativeLazy && isNativeLazy && hasDataSrc) {
        // Native lazy is available: promote data-src to src immediately and let
        // the browser defer the actual fetch based on loading="lazy".
        loadImg(img);
        continue;
      }
      // No native lazy support (or no loading="lazy"): defer via observer.
      needsObserver.push(img);
    }

    if (needsObserver.length === 0) {
      return;
    }

    // Without IntersectionObserver we cannot cheaply detect proximity to the
    // viewport, so load eagerly rather than risk never loading (graceful
    // degradation: correctness over bandwidth).
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      for (var k = 0; k < needsObserver.length; k++) {
        loadImg(needsObserver[k]);
      }
      return;
    }

    // Swap data-src -> src when the image is within 200px of the viewport
    // (rootMargin "200px"), then stop observing it (req 12.3).
    var observer = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) {
          loadImg(entries[e].target);
          observer.unobserve(entries[e].target);
        }
      }
    }, { root: null, rootMargin: '200px', threshold: 0 });

    for (var m = 0; m < needsObserver.length; m++) {
      observer.observe(needsObserver[m]);
    }
  }

  // Gallery carousel: reducer-driven state, one render pass, then media side effects.
  function initGalleryCarousel() {
    if (typeof document === 'undefined' || !document.querySelectorAll) {
      return;
    }

    var carousels = document.querySelectorAll('[data-gallery-carousel]');
    if (!carousels.length) {
      return;
    }

    function formatTime(seconds) {
      if (!isFinite(seconds) || seconds < 0) {
        seconds = 0;
      }
      var mins = Math.floor(seconds / 60);
      var secs = Math.floor(seconds % 60);
      return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    function clamp01(value) {
      if (value < 0) return 0;
      if (value > 1) return 1;
      return value;
    }

    for (var i = 0; i < carousels.length; i++) {
      (function (carousel) {
        var items = carousel.querySelectorAll('[data-gallery-item]');
        if (!items.length) {
          return;
        }

        var count = items.length;
        var progress = carousel.querySelector('[data-gallery-progress]');
        var time = carousel.querySelector('[data-gallery-time]');
        var label = carousel.querySelector('[data-gallery-current-label]');
        var dots = carousel.querySelector('[data-gallery-dots]');
        var prev = carousel.querySelector('[data-gallery-prev]');
        var next = carousel.querySelector('[data-gallery-next]');
        var playPauseBtn = carousel.querySelector('[data-gallery-play-pause]');

        var initialActive = 0;
        for (var a = 0; a < count; a++) {
          if (items[a].classList && items[a].classList.contains('is-active')) {
            initialActive = a;
            break;
          }
        }

        var state = { activeIndex: normalizeIndex(initialActive, count), isPlaying: false };

        function getVideo(index) {
          return items[index] ? items[index].querySelector('[data-gallery-video]') : null;
        }

        function getActiveVideo() {
          return getVideo(state.activeIndex);
        }

        function getItemLabel(index) {
          var item = items[index];
          if (!item) {
            return '';
          }
          return item.getAttribute('data-gallery-title') ||
            item.getAttribute('data-gallery-label') ||
            'sample ' + String(index + 1);
        }

        function getItemSlug(index) {
          var item = items[index];
          return item ? (item.getAttribute('data-gallery-label') || 'sample-' + String(index + 1)) : '';
        }

        var initialVideo = getActiveVideo();
        state.isPlaying = !!(initialVideo && initialVideo.autoplay);

        function updateProgress() {
          if (!progress) {
            return;
          }
          var video = getActiveVideo();
          if (!video) {
            return;
          }
          var duration = video.duration || 0;
          var ratio = duration ? clamp01(video.currentTime / duration) : 0;
          progress.style.setProperty('--gallery-video-progress', String(ratio));
          progress.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
          if (time) {
            time.textContent = formatTime(video.currentTime) + ' / ' + formatTime(duration);
          }
        }

        function seekFromClientX(clientX) {
          if (!progress) {
            return;
          }
          var video = getActiveVideo();
          if (!video) {
            return;
          }
          var duration = video.duration || 0;
          if (!duration || !progress.getBoundingClientRect) {
            return;
          }
          var rect = progress.getBoundingClientRect();
          var ratio = clamp01((clientX - rect.left) / rect.width);
          video.currentTime = ratio * duration;
          updateProgress();
        }

        function setNavHidden(btn, hidden) {
          if (!btn) {
            return;
          }
          btn.hidden = hidden;
          if (hidden) {
            btn.setAttribute('tabindex', '-1');
          } else {
            btn.removeAttribute('tabindex');
          }
        }

        function isSpaceKey(event) {
          return event.key === ' ' || event.key === 'Spacebar' || event.keyCode === 32;
        }

        function preventSpaceScroll(event) {
          if (isSpaceKey(event)) {
            event.preventDefault();
          }
        }

        // Render syncs DOM state only; video play/pause happens after dispatch.
        function render() {
          for (var n = 0; n < count; n++) {
            if (items[n].classList) {
              items[n].classList.toggle('is-active', n === state.activeIndex);
            }
          }

          if (dots) {
            var dotButtons = dots.querySelectorAll('[data-gallery-dot]');
            var dotStates = computeDotStates(state.activeIndex, count);
            for (var d = 0; d < dotButtons.length; d++) {
              dotButtons[d].setAttribute('aria-current', dotStates[d] ? 'true' : 'false');
            }
          }

          if (playPauseBtn) {
            var view = playPauseView(state.isPlaying);
            var icon = playPauseBtn.querySelector('i');
            if (icon) {
              icon.className = view.iconClass;
            }
            playPauseBtn.setAttribute('aria-label', view.label);
          }

          var showNav = shouldShowNav(count);
          setNavHidden(prev, !showNav);
          setNavHidden(next, !showNav);

          if (label) {
            label.textContent = getItemLabel(state.activeIndex);
          }
          updateProgress();
        }

        // Autoplay can be blocked; fold that browser result back into state.
        function playActiveVideo() {
          var video = getActiveVideo();
          if (!video || typeof video.play !== 'function') {
            return;
          }
          var playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
              if (state.isPlaying) {
                dispatch({ type: 'playbackFailed' });
              }
            });
          }
        }

        function pauseVideo(index) {
          var video = getVideo(index);
          if (video && typeof video.pause === 'function') {
            video.pause();
          }
        }

        function dispatch(action) {
          var prevActiveIndex = state.activeIndex;
          state = applyCarouselAction(state, action, count);
          render();

          if (action && action.type === 'togglePlay') {
            if (state.isPlaying) {
              playActiveVideo();
            } else {
              pauseVideo(state.activeIndex);
            }
          } else if (prevActiveIndex !== state.activeIndex) {
            pauseVideo(prevActiveIndex);
            if (state.isPlaying) {
              playActiveVideo();
            }
          }
        }

        function buildDots() {
          if (!dots) {
            return;
          }
          dots.innerHTML = '';
          for (var d = 0; d < count; d++) {
            var dot = document.createElement('button');
            var dotTitle = getItemLabel(d);
            var dotSlug = getItemSlug(d);
            dot.type = 'button';
            dot.className = 'gallery-video-dot';
            dot.setAttribute('data-gallery-dot', '');
            dot.setAttribute('data-gallery-index', String(d + 1).padStart(2, '0'));
            dot.setAttribute('aria-label', 'Show gallery sample ' + String(d + 1) + ': ' + dotTitle);
            dot.setAttribute('aria-current', d === state.activeIndex ? 'true' : 'false');
            var dotText = document.createElement('span');
            var dotName = document.createElement('strong');
            var dotMeta = document.createElement('span');
            dotText.className = 'gallery-video-dot__text';
            dotName.textContent = dotTitle;
            dotMeta.textContent = dotSlug;
            dotText.appendChild(dotName);
            dotText.appendChild(dotMeta);
            dot.appendChild(dotText);
            dot.addEventListener('keydown', preventSpaceScroll);
            (function (index) {
              dot.addEventListener('click', function () {
                dispatch({ type: 'select', index: index });
              });
            })(d);
            dots.appendChild(dot);
          }
        }

        if (prev) {
          prev.addEventListener('keydown', preventSpaceScroll);
          prev.addEventListener('click', function () {
            dispatch({ type: 'prev' });
          });
        }

        if (next) {
          next.addEventListener('keydown', preventSpaceScroll);
          next.addEventListener('click', function () {
            dispatch({ type: 'next' });
          });
        }

        if (playPauseBtn) {
          playPauseBtn.addEventListener('keydown', preventSpaceScroll);
          playPauseBtn.addEventListener('click', function () {
            dispatch({ type: 'togglePlay' });
          });
        }

        if (progress) {
          progress.addEventListener('pointerdown', function (event) {
            progress.classList.add('is-scrubbing');
            seekFromClientX(event.clientX);
            if (progress.setPointerCapture && event.pointerId != null) {
              progress.setPointerCapture(event.pointerId);
            }
          });

          progress.addEventListener('pointermove', function (event) {
            if (!progress.classList.contains('is-scrubbing')) {
              return;
            }
            seekFromClientX(event.clientX);
          });

          progress.addEventListener('pointerup', function () {
            progress.classList.remove('is-scrubbing');
          });

          progress.addEventListener('pointercancel', function () {
            progress.classList.remove('is-scrubbing');
          });

          progress.addEventListener('keydown', function (event) {
            var video = getActiveVideo();
            if (!video) {
              return;
            }
            var duration = video.duration || 0;
            if (!duration) {
              return;
            }
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              var direction = event.key === 'ArrowLeft' ? -1 : 1;
              video.currentTime = clamp01((video.currentTime + direction * 2) / duration) * duration;
              updateProgress();
            }
          });
        }

        for (var vi = 0; vi < count; vi++) {
          var video = getVideo(vi);
          if (video) {
            video.addEventListener('loadedmetadata', updateProgress);
            video.addEventListener('durationchange', updateProgress);
            video.addEventListener('timeupdate', updateProgress);
            (function (item) {
              video.addEventListener('error', function () {
                if (item && item.classList) {
                  item.classList.add('is-media-error');
                }
              });
            })(items[vi]);
            video.addEventListener('play', function () {
              if (getActiveVideo() === this) {
                if (!state.isPlaying) {
                  state.isPlaying = true;
                  render();
                } else {
                  updateProgress();
                }
              }
            });
            video.addEventListener('pause', function () {
              if (getActiveVideo() === this && state.isPlaying) {
                state.isPlaying = false;
                render();
              }
            });
          }
        }

        buildDots();
        render();
      })(carousels[i]);
    }
  }

  /* ---------------------------------------------------------------------- *
   * 4. DOMContentLoaded dispatcher.
   *    Robustness: every module runs in its own try/catch so one failing
   *    module cannot break the others or the page (design: 运行时健壮性).
   * ---------------------------------------------------------------------- */
  function runModule(name, fn) {
    try {
      fn();
    } catch (err) {
      // Never let one module take down the rest of the page.
      if (typeof console !== 'undefined' && console.error) {
        console.error('[wdrawer] module "' + name + '" failed to initialize:', err);
      }
    }
  }

  function init() {
    runModule('scroll-spy', initScrollSpy);
    runModule('smooth-scroll', initSmoothScroll);
    runModule('nav-reveal', initNavReveal);
    runModule('nav-progress-cursor', initNavProgressAndCursor);
    runModule('bibtex-copy', initBibtexCopy);
    runModule('back-to-top', initBackToTop);
    runModule('reveal', initReveal);
    runModule('meta', initMeta);
    runModule('lazy-load', initLazyLoad);
    runModule('gallery-carousel', initGalleryCarousel);
  }

  // Only wire up DOM behaviour in a browser environment. In Node (tests) there
  // is no document, so we skip initialization and just expose the pure logic.
  if (typeof document !== 'undefined' && document.addEventListener) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      // Script may have been evaluated after DOMContentLoaded already fired.
      init();
    }
  }

  /* ---------------------------------------------------------------------- *
   * 5. Node-testing export guard.
   *    The browser <script defer> path ignores this (typeof module check).
   * ---------------------------------------------------------------------- */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      computeActiveIndex: computeActiveIndex,
      computeScrollTarget: computeScrollTarget,
      trimBibtex: trimBibtex,
      truncateDescription: truncateDescription,
      shouldShowBackToTop: shouldShowBackToTop,
      createRevealState: createRevealState,
      reveal: reveal,
      nextIndex: nextIndex,
      prevIndex: prevIndex,
      normalizeIndex: normalizeIndex,
      computeDotStates: computeDotStates,
      shouldShowNav: shouldShowNav,
      playPauseView: playPauseView,
      applyCarouselAction: applyCarouselAction
    };
  }
})();
