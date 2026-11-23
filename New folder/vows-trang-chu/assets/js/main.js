/* Vows · Trang chủ
   - Phát video camera lùi từ cổng ra (bản 720p trên điện thoại, 1080p trên máy tính)
   - Chữ, menu và thiệp mẫu hiện khi video chạy xong (data-reveal-at trên .hero, tính bằng giây)
   - Nút Bỏ qua / Xem lại, menu điện thoại, nút trả lời thiệp mẫu
   - Thêm ?intro=off vào địa chỉ để bỏ đoạn mở đầu khi đang chỉnh sửa
*/
(function () {
  'use strict';
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var video = hero.querySelector('.hero__video');
  var bar = hero.querySelector('.hero__progress span');
  var revealAt = parseFloat(hero.getAttribute('data-reveal-at')) || 8;
  var mq = function (q) { return window.matchMedia ? window.matchMedia(q).matches : false; };
  var reduceMotion = mq('(prefers-reduced-motion: reduce)');
  var isMobile = mq('(max-width: 760px)');
  var skipIntro = /[?&]intro=off\b/.test(location.search);
  var revealed = false;
  var fallbackTimer = null;

  function setProgress(p) { if (bar) bar.style.width = Math.max(0, Math.min(100, p * 100)) + '%'; }

  function reveal(hideVideo) {
    if (!revealed) {
      revealed = true;
      hero.classList.remove('is-intro');
      hero.classList.add('is-in');
      setProgress(1);
    }
    if (hideVideo && video) video.classList.add('is-off');
    clearTimeout(fallbackTimer);
  }

  function play() {
    clearTimeout(fallbackTimer);
    // nếu vì lý do nào đó video không kết thúc, vẫn hiện chữ sau 12 giây
    fallbackTimer = setTimeout(function () { reveal(false); }, 12000);
    var p;
    try { p = video.play(); } catch (e) { reveal(true); return; }
    if (p && typeof p.catch === 'function') p.catch(function () { reveal(true); });
  }

  function ensureSource() {
    if (video.getAttribute('src')) return;
    var src = isMobile ? video.getAttribute('data-src-mobile') : video.getAttribute('data-src-desktop');
    video.setAttribute('src', src);
  }

  if (!video) {
    reveal(true);
  } else {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    video.addEventListener('timeupdate', function () {
      var d = isFinite(video.duration) && video.duration > 0 ? video.duration : 8;
      if (!revealed) setProgress(video.currentTime / d);
      if (video.currentTime >= Math.min(revealAt, d - 0.05)) reveal(false);
    });
    video.addEventListener('ended', function () { reveal(false); });
    video.addEventListener('error', function () { reveal(true); });

    if (reduceMotion || skipIntro) {
      reveal(true);
    } else {
      ensureSource();
      play();
    }
  }

  // ---- clicks
  var menuBtn = document.querySelector('[data-action="menu"]');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!t) {
      if (menu && !menu.hidden && !e.target.closest('.hero__header')) setMenu(false);
      return;
    }
    var action = t.getAttribute('data-action');

    if (action === 'skip') {
      try { video.pause(); } catch (err) {}
      reveal(true);
    } else if (action === 'replay' && video) {
      revealed = false;
      hero.classList.add('is-intro');
      hero.classList.remove('is-in');
      video.classList.remove('is-off');
      setProgress(0);
      ensureSource();
      try { video.currentTime = 0; } catch (err) {}
      play();
    } else if (action === 'rsvp') {
      var group = t.parentElement.querySelectorAll('[data-action="rsvp"]');
      for (var i = 0; i < group.length; i++) group[i].setAttribute('aria-pressed', group[i] === t ? 'true' : 'false');
    } else if (action === 'menu') {
      setMenu(menu.hidden);
    }
  });

  if (menu) {
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
})();
