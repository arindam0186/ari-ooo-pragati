(function () {
  'use strict';

  // Note: this site intentionally does not gate any animation on
  // prefers-reduced-motion — see the note in css/style.css.

  /* ============================================================
     "Save the Date" — letter-by-letter ink reveal
     ============================================================ */
  var stdWord = document.getElementById('std-word');
  if (stdWord) {
    var text = stdWord.textContent;
    stdWord.textContent = '';
    text.split('').forEach(function (ch, i) {
      var span = document.createElement('span');
      span.className = 'std-letter';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (0.35 + i * 0.045) + 's';
      stdWord.appendChild(span);
    });
  }

  /* ============================================================
     Robust viewport height fix (older iOS/Android address-bar quirks)
     ============================================================ */
  function setVH() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh100', (vh * 100) + 'px');
  }
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setVH);
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
    var diff = target - Date.now();
    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
      return;
    }
    elDays.textContent = pad(Math.floor(diff / 86400000));
    elHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    elMins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    elSecs.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ============================================================
     Scroll reveal
     ============================================================ */
  var revealTargets = document.querySelectorAll('.will-reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ============================================================
     Ambient petals — continuous, behind everything
     ============================================================ */
  var ambientField = document.getElementById('ambient-petals');
  function spawnAmbientPetals(count) {
    if (!ambientField) return;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      p.style.left = (Math.random() * 100) + '%';
      p.style.animationDuration = (11 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 14) + 's';
      p.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
      p.style.transform = 'scale(' + (0.6 + Math.random() * 0.7) + ')';
      p.style.background = Math.random() > 0.5 ? '#E08A2C' : '#C7A94F';
      ambientField.appendChild(p);
    }
  }
  spawnAmbientPetals(16);

  // A single SVG heart, reused (via currentColor) for every heart effect on the
  // page — this renders identically across OSes, unlike the emoji glyph, whose
  // size/baseline differs a lot between Android's and iOS's emoji fonts.
  var HEART_SVG = '<svg viewBox="0 0 32 29" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M16 28.3C9.3 23 1 16.7 1 9.5 1 4.8 4.7 1.1 9.3 1.1c2.7 0 5.2 1.3 6.7 3.5 1.5-2.2 4-3.5 6.7-3.5 4.6 0 8.3 3.7 8.3 8.4 0 7.2-8.3 13.5-15 18.8z" fill="currentColor"/>' +
    '</svg>';

  function spawnHearts(x, y, count) {
    if (!ambientField) return;
    for (var i = 0; i < count; i++) {
      var h = document.createElement('span');
      h.className = 'heart';
      h.innerHTML = HEART_SVG;
      h.style.left = x + 'px';
      h.style.top = y + 'px';
      h.style.color = Math.random() > 0.5 ? '#7A2E2E' : '#E08A2C';
      h.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
      h.style.animationDuration = (1 + Math.random() * .6) + 's';
      ambientField.appendChild(h);
      (function (el) {
        setTimeout(function () { el.remove(); }, 1800);
      })(h);
    }
  }

  // A single larger heart that pops directly on top of an element — used on
  // the couple photo so the "tap for love" gesture reads clearly against a
  // busy photo, the way a double-tap-to-like does on photo apps.
  function spawnBigHeart(el) {
    if (!el) return;
    var span = document.createElement('span');
    span.className = 'big-heart';
    span.style.color = '#B23B3B';
    span.innerHTML = HEART_SVG;
    el.appendChild(span);
    setTimeout(function () { span.remove(); }, 1100);
  }

  /* ============================================================
     Tap-for-hearts — shared across both monograms + couple photo
     ============================================================ */
  function bindTapHearts(el, bumpEl) {
    if (!el) return;
    function trigger() {
      if (bumpEl) {
        bumpEl.classList.add('zapped');
        setTimeout(function () { bumpEl.classList.remove('zapped'); }, 500);
      }
      var rect = el.getBoundingClientRect();
      spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
    }
    el.addEventListener('click', trigger);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  }

  bindTapHearts(document.getElementById('hero-monogram'), document.getElementById('hero-monogram'));
  bindTapHearts(document.getElementById('closing-monogram'), document.getElementById('closing-monogram'));

  var coupleWrap = document.getElementById('couple-wrap');
  bindTapHearts(coupleWrap, null);
  if (coupleWrap) {
    function bounceCouple() {
      coupleWrap.classList.add('tapped');
      spawnBigHeart(coupleWrap);
      setTimeout(function () { coupleWrap.classList.remove('tapped'); }, 1200);
    }
    coupleWrap.addEventListener('click', bounceCouple);
    coupleWrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { bounceCouple(); }
    });
  }

  // Subtle parallax: touch-drag on touch devices (no permission needed),
  // mouse move on desktop.
  var coupleTilt = document.getElementById('couple-tilt');
  if (coupleTilt && coupleWrap) {
    var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice) {
      coupleWrap.addEventListener('touchmove', function (e) {
        if (!e.touches || !e.touches.length) return;
        var touch = e.touches[0];
        var rect = coupleWrap.getBoundingClientRect();
        var relX = ((touch.clientX - rect.left) / rect.width - 0.5) * 10;
        relX = Math.max(-9, Math.min(9, relX));
        coupleTilt.style.transform = 'rotate(' + relX + 'deg)';
      }, { passive: true });
      coupleWrap.addEventListener('touchend', function () {
        coupleTilt.style.transform = 'rotate(0deg)';
      });
    } else {
      document.addEventListener('mousemove', function (e) {
        var relX = (e.clientX / window.innerWidth - 0.5) * 4;
        coupleTilt.style.transform = 'rotate(' + relX + 'deg)';
      });
    }
  }

  /* ============================================================
     Scratch-to-reveal date cards
     ============================================================ */
  function initScratchCard(wrap) {
    var canvas = wrap.querySelector('.scratch-canvas');
    var hint = wrap.parentElement ? wrap.parentElement.querySelector('.scratch-hint') : null;
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var revealed = false;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var lastPt = null;
    var scratching = false;

    function paint() {
      var rect = wrap.getBoundingClientRect();
      var w = Math.max(1, Math.round(rect.width));
      var h = Math.max(1, Math.round(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#D8B85A');
      grad.addColorStop(1, '#9C7A22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Diagonal foil hatch — reads as a scratch-card texture at a glance,
      // and renders identically everywhere since it's drawn, not an emoji/font glyph.
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,.16)';
      ctx.lineWidth = Math.max(2, h * 0.09);
      var gap = h * 0.4;
      for (var x = -h; x < w + h; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, h);
        ctx.lineTo(x + h, 0);
        ctx.stroke();
      }
      ctx.restore();

      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = 'rgba(255,255,255,.5)';
      ctx.lineWidth = 1.4;
      ctx.strokeRect(2, 2, w - 4, h - 4);
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(255,255,255,.95)';
      ctx.font = '600 ' + Math.round(h * 0.4) + 'px "EB Garamond", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', w / 2, h / 2 + 1);
    }
    paint();

    function pointFromEvent(e) {
      var rect = canvas.getBoundingClientRect();
      var src = (e.touches && e.touches[0]) || e;
      return { x: src.clientX - rect.left, y: src.clientY - rect.top };
    }

    function erase(pt) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 15, 0, Math.PI * 2);
      ctx.fill();
      if (lastPt) {
        ctx.lineWidth = 30;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPt.x, lastPt.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      }
      lastPt = pt;
    }

    function checkCleared() {
      var data;
      try {
        data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      } catch (err) { return; }
      var step = Math.max(4, Math.round(4 * dpr));
      var total = 0, cleared = 0;
      for (var y = 0; y < canvas.height; y += step) {
        for (var x = 0; x < canvas.width; x += step) {
          var idx = (y * canvas.width + x) * 4 + 3;
          total++;
          if (data[idx] < 60) cleared++;
        }
      }
      if (total && cleared / total > 0.42) reveal();
    }

    function reveal() {
      if (revealed) return;
      revealed = true;
      canvas.classList.add('revealed');
      wrap.classList.add('done');
      if (hint) hint.classList.add('done');
      var rect = wrap.getBoundingClientRect();
      spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
    }

    function start(e) {
      if (revealed) return;
      scratching = true;
      lastPt = null;
      erase(pointFromEvent(e));
      checkCleared();
      if (e.cancelable) e.preventDefault();
    }
    function move(e) {
      if (!scratching || revealed) return;
      erase(pointFromEvent(e));
      checkCleared();
      if (e.cancelable) e.preventDefault();
    }
    function stop() {
      scratching = false;
      lastPt = null;
    }

    if (window.PointerEvent) {
      canvas.addEventListener('pointerdown', start);
      canvas.addEventListener('pointermove', move);
      window.addEventListener('pointerup', stop);
      window.addEventListener('pointercancel', stop);
    } else {
      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', move);
      window.addEventListener('mouseup', stop);
      canvas.addEventListener('touchstart', start, { passive: false });
      canvas.addEventListener('touchmove', move, { passive: false });
      window.addEventListener('touchend', stop);
    }
    window.addEventListener('resize', function () { if (!revealed) paint(); });
  }

  var scratchCards = document.querySelectorAll('[data-scratch-card]');
  scratchCards.forEach(initScratchCard);

  /* ============================================================
     Add to Calendar — generates a real .ics file
     ============================================================ */
  var addCalBtn = document.getElementById('add-calendar-btn');
  var toast = document.getElementById('toast');

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  function buildICS() {
    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Pragati and Arindam//Save the Date//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:pragati-arindam-wedding-2026@savethedate',
      'DTSTAMP:20260101T000000Z',
      'DTSTART;VALUE=DATE:20261211',
      'DTEND;VALUE=DATE:20261213',
      'SUMMARY:Pragati and Arindam\'s Wedding Celebrations',
      'DESCRIPTION:Three days of celebration — details to follow. #AriOooPragati',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    return ics;
  }

  addCalBtn.addEventListener('click', function () {
    try {
      var blob = new Blob([buildICS()], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'pragati-arindam-wedding.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      showToast('Added — check your calendar app 💛');
    } catch (err) {
      showToast('Could not create the file — please try again');
    }
  });

  /* ============================================================
     Share the date
     ============================================================ */
  var shareBtn = document.getElementById('share-btn');
  shareBtn.addEventListener('click', function () {
    var shareData = {
      title: 'Pragati & Arindam — Save the Date',
      text: 'Pragati & Arindam are getting married, 11–12 December 2026! #AriOooPragati',
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url).then(function () {
        showToast('Link copied to clipboard!');
      }).catch(function () {
        showToast(shareData.url);
      });
    } else {
      showToast(shareData.url);
    }
  });

  /* ============================================================
     Event card carousel — dot sync
     ============================================================ */
  var carousel = document.getElementById('card-carousel');
  var dots = document.querySelectorAll('#carousel-dots .dot');

  if (carousel && dots.length) {
    carousel.addEventListener('scroll', function () {
      var index = Math.round(carousel.scrollLeft / carousel.clientWidth);
      dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
    }, { passive: true });
  }

})();
