(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    if (prefersReducedMotion || !ambientField) return;
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

  function spawnHearts(x, y, count) {
    if (prefersReducedMotion || !ambientField) return;
    for (var i = 0; i < count; i++) {
      var h = document.createElement('span');
      h.className = 'heart';
      h.textContent = '❤️';
      h.style.left = x + 'px';
      h.style.top = y + 'px';
      h.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
      h.style.animationDuration = (1 + Math.random() * .6) + 's';
      ambientField.appendChild(h);
      (function (el) {
        setTimeout(function () { el.remove(); }, 1800);
      })(h);
    }
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
      setTimeout(function () { coupleWrap.classList.remove('tapped'); }, 1200);
    }
    coupleWrap.addEventListener('click', bounceCouple);
    coupleWrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { bounceCouple(); }
    });
  }

  // Subtle parallax: device orientation on mobile, mouse move on desktop
  var coupleTilt = document.getElementById('couple-tilt');
  if (!prefersReducedMotion && coupleTilt) {
    if (window.DeviceOrientationEvent && /Mobi|Android/i.test(navigator.userAgent)) {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null) return;
        var tilt = Math.max(-8, Math.min(8, e.gamma / 4));
        coupleTilt.style.transform = 'rotate(' + tilt + 'deg)';
      });
    } else {
      document.addEventListener('mousemove', function (e) {
        var relX = (e.clientX / window.innerWidth - 0.5) * 4;
        coupleTilt.style.transform = 'rotate(' + relX + 'deg)';
      });
    }
  }

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
