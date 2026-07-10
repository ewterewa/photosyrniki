// ============================================================
// PHOTOSYRNIK — ОСНОВНОЙ JS
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ===== 1. БУРГЕР-МЕНЮ =====
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');

    if (burger && nav) {
        burger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('open');
        });

        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('open');
            });
        });
    }

    // ===== 2. ШАПКА ПРИ СКРОЛЛЕ =====
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ===== 3. ОФЛАЙН-УВЕДОМЛЕНИЕ =====
    window.addEventListener('offline', function() {
        const banner = document.createElement('div');
        banner.className = 'offline-banner';
        banner.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#000; color:#fff; padding:12px 24px; border-radius:50px; font-size:13px; z-index:9999; font-family:Inter,sans-serif;';
        banner.textContent = '📡 Нет интернета, но сайт работает офлайн';
        document.body.appendChild(banner);
    });

    window.addEventListener('online', function() {
        document.querySelector('.offline-banner')?.remove();
    });

});

// ===== 4. SERVICE WORKER (ОФЛАЙН) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('js/sw.js')
            .then(() => console.log('✅ Service Worker зарегистрирован'))
            .catch(() => console.log('⚠️ Service Worker не зарегистрирован'));
    });
}
