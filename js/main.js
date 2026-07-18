(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     Entry Gate
     ============================================================ */
  var gate = document.getElementById('gate');
  var body = document.body;
  body.classList.add('locked');

  function openGate() {
    if (gate.classList.contains('opened')) return;
    gate.classList.add('opened');
    body.classList.add('opened');
    body.classList.remove('locked');
    gate.setAttribute('aria-hidden', 'true');
  }

  gate.addEventListener('click', openGate);
  gate.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGate();
    }
  });

  // Auto-open if reduced motion or after long idle (keeps it accessible / avoids trapping)
  if (prefersReducedMotion) {
    openGate();
  }

  /* ============================================================
     Countdown — targets midnight IST, 11 Dec 2026
     ============================================================ */
  var target = new Date('2026-12-11T00:00:00+05:30').getTime();

  var elDays = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMins = document.getElementById('cd-mins');
  var elSecs = document.getElementById('cd-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickCountdown() {
    var now = Date.now();
    var diff = target - now;

    if (diff <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMins.textContent = '00';
      elSecs.textContent = '00';
      return;
    }

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent = pad(mins);
    elSecs.textContent = pad(secs);
  }

  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ============================================================
     Scroll-triggered theme switching for event sections
     ============================================================ */
  var themedSections = document.querySelectorAll('[data-theme]');

  if ('IntersectionObserver' in window) {
    var themeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var theme = entry.target.getAttribute('data-theme');
          body.setAttribute('data-active-theme', theme);
        }
      });
    }, { threshold: 0.55 });

    themedSections.forEach(function (sec) { themeObserver.observe(sec); });
  }

  /* ============================================================
     Generic reveal-on-scroll for elements (events-intro, cards)
     ============================================================ */
  var revealTargets = document.querySelectorAll(
    '.events-intro-line, .events-intro-sub, .event-card, .contact-card, .closing-line, .closing-sub, .closing-hashtag, .closing-sign'
  );
  revealTargets.forEach(function (el) { el.classList.add('will-reveal'); });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ============================================================
     Petals — generated drifting elements in hero + closing
     ============================================================ */
  function spawnPetals(container, count) {
    if (prefersReducedMotion || !container) return;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      var left = Math.random() * 100;
      var duration = 9 + Math.random() * 8;
      var delay = Math.random() * 10;
      var dx = (Math.random() * 80 - 40) + 'px';
      var scale = 0.6 + Math.random() * 0.8;
      var hueShift = Math.random() > 0.5 ? 'hsl(30, 70%, 55%)' : 'hsl(20, 65%, 60%)';

      p.style.left = left + '%';
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = delay + 's';
      p.style.setProperty('--dx', dx);
      p.style.transform = 'scale(' + scale + ')';
      p.style.background = hueShift;

      container.appendChild(p);
    }
  }

  document.querySelectorAll('[data-petal-field]').forEach(function (field) {
    spawnPetals(field, 14);
  });

  /* ============================================================
     Closing monogram easter egg — tap 3x for a petal burst
     ============================================================ */
  var closingMono = document.getElementById('closing-monogram');
  var tapCount = 0;
  var tapTimer = null;

  function petalBurst() {
    if (prefersReducedMotion) return;
    var closingSection = document.getElementById('closing');
    var burstField = closingSection.querySelector('[data-petal-field]');
    spawnPetals(burstField, 24);
    closingMono.classList.add('zapped');
    setTimeout(function () { closingMono.classList.remove('zapped'); }, 500);
  }

  function handleMonoTap() {
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(function () { tapCount = 0; }, 1200);
    if (tapCount >= 3) {
      tapCount = 0;
      petalBurst();
    }
  }

  closingMono.addEventListener('click', handleMonoTap);
  closingMono.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMonoTap();
    }
  });

})();
