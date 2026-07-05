/**
 * Encomiendas Mixco — Gestor de Consentimiento de Cookies
 * RGPD / LSSI-CE Compliant | Vanilla JS | v1.0
 */
(function() {
    'use strict';

    const GA_ID = 'G-4GXMGS5JWD';
    const STORAGE_KEY = 'mixco_cookie_consent';

    function getConsent() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e) { return null; }
    }
    function saveConsent(prefs) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    }
    function applyAnalytics(enabled) {
        window['ga-disable-' + GA_ID] = !enabled;
        if (window.gtag) {
            gtag('consent', 'update', {
                analytics_storage: enabled ? 'granted' : 'denied',
                ad_storage: enabled ? 'granted' : 'denied'
            });
        }
    }
    function closeBanner() {
        var banner = document.getElementById('mixco-cookie-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(function() { banner.remove(); }, 500);
        }
    }
    function closeModal() {
        var overlay = document.getElementById('mixco-cookie-overlay');
        if (overlay) overlay.classList.remove('show');
    }
    function acceptAll() {
        saveConsent({ technical: true, analytics: true, marketing: true, ts: Date.now() });
        applyAnalytics(true);
        closeBanner();
        closeModal();
    }
    function rejectAll() {
        saveConsent({ technical: true, analytics: false, marketing: false, ts: Date.now() });
        applyAnalytics(false);
        closeBanner();
        closeModal();
    }
    function saveCustom() {
        var analytics = document.getElementById('mixco-cookie-analytics');
        var marketing = document.getElementById('mixco-cookie-marketing');
        var prefs = {
            technical: true,
            analytics: analytics ? analytics.checked : false,
            marketing: marketing ? marketing.checked : false,
            ts: Date.now()
        };
        saveConsent(prefs);
        applyAnalytics(prefs.analytics);
        closeBanner();
        closeModal();
    }
    function openModal() {
        var overlay = document.getElementById('mixco-cookie-overlay');
        if (overlay) overlay.classList.add('show');
    }
    function injectBanner() {
        var banner = document.createElement('div');
        banner.id = 'mixco-cookie-banner';
        banner.className = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'true');
        banner.setAttribute('aria-label', 'Configuracion de cookies');
        banner.innerHTML =
            '<div class="cookie-consent-content">' +
            '  <h4>&#127850; Utilizamos cookies</h4>' +
            '  <p>Usamos cookies propias y de terceros para mejorar tu experiencia, analizar el trafico y personalizar el contenido. Puedes aceptar todas, rechazar las no esenciales o configurarlas a tu medida. ' +
            '  Consulta nuestra <a href="/cookies.html" target="_blank">Politica de Cookies</a>.</p>' +
            '</div>' +
            '<div class="cookie-consent-actions">' +
            '  <button class="cookie-btn cookie-btn-settings" id="mixco-btn-settings" aria-label="Personalizar cookies">Personalizar</button>' +
            '  <button class="cookie-btn cookie-btn-reject" id="mixco-btn-reject" aria-label="Rechazar cookies no esenciales">Rechazar</button>' +
            '  <button class="cookie-btn cookie-btn-accept" id="mixco-btn-accept" aria-label="Aceptar todas las cookies">Aceptar todas</button>' +
            '</div>';
        document.body.appendChild(banner);
        setTimeout(function() { banner.classList.add('show'); }, 800);
        document.getElementById('mixco-btn-accept').addEventListener('click', acceptAll);
        document.getElementById('mixco-btn-reject').addEventListener('click', rejectAll);
        document.getElementById('mixco-btn-settings').addEventListener('click', openModal);
    }
    function injectModal() {
        var prefs = getConsent();
        var analyticsChecked = (prefs && prefs.analytics) ? 'checked' : '';
        var marketingChecked = (prefs && prefs.marketing) ? 'checked' : '';
        var overlay = document.createElement('div');
        overlay.id = 'mixco-cookie-overlay';
        overlay.className = 'cookie-settings-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML =
            '<div class="cookie-settings-modal">' +
            '  <div class="cookie-settings-header">' +
            '    <h3>Configuracion de cookies</h3>' +
            '    <button class="cookie-settings-close" id="mixco-modal-close" aria-label="Cerrar">&#10005;</button>' +
            '  </div>' +
            '  <div class="cookie-option-item">' +
            '    <div class="cookie-option-info">' +
            '      <h5>&#128274; Cookies tecnicas (obligatorias)</h5>' +
            '      <p>Necesarias para el funcionamiento basico de la web: sesion, seguridad y preferencias.</p>' +
            '    </div>' +
            '    <label class="cookie-switch" title="Siempre activas">' +
            '      <input type="checkbox" checked disabled>' +
            '      <span class="cookie-slider"></span>' +
            '    </label>' +
            '  </div>' +
            '  <div class="cookie-option-item">' +
            '    <div class="cookie-option-info">' +
            '      <h5>&#128202; Cookies analiticas</h5>' +
            '      <p>Nos ayudan a entender como interactuan los usuarios con la web (Google Analytics). Datos anonimos y agregados.</p>' +
            '    </div>' +
            '    <label class="cookie-switch" title="Activar/desactivar cookies analiticas">' +
            '      <input type="checkbox" id="mixco-cookie-analytics" ' + analyticsChecked + '>' +
            '      <span class="cookie-slider"></span>' +
            '    </label>' +
            '  </div>' +
            '  <div class="cookie-option-item">' +
            '    <div class="cookie-option-info">' +
            '      <h5>&#128226; Cookies de marketing</h5>' +
            '      <p>Permiten mostrar anuncios relevantes segun tus intereses y medir la efectividad de campanas publicitarias.</p>' +
            '    </div>' +
            '    <label class="cookie-switch" title="Activar/desactivar cookies de marketing">' +
            '      <input type="checkbox" id="mixco-cookie-marketing" ' + marketingChecked + '>' +
            '      <span class="cookie-slider"></span>' +
            '    </label>' +
            '  </div>' +
            '  <div class="cookie-settings-actions">' +
            '    <button class="cookie-btn cookie-btn-reject" id="mixco-modal-reject">Rechazar todas</button>' +
            '    <button class="cookie-btn cookie-btn-accept" id="mixco-modal-save">Guardar preferencias</button>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(overlay);
        document.getElementById('mixco-modal-close').addEventListener('click', closeModal);
        document.getElementById('mixco-modal-reject').addEventListener('click', rejectAll);
        document.getElementById('mixco-modal-save').addEventListener('click', saveCustom);
        overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
        document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });
    }

    window.MixcoCookies = {
        openSettings: function() {
            var overlay = document.getElementById('mixco-cookie-overlay');
            if (!overlay) injectModal();
            setTimeout(function() {
                var el = document.getElementById('mixco-cookie-overlay');
                if (el) el.classList.add('show');
            }, 50);
        }
    };

    function init() {
        var prefs = getConsent();
        if (prefs) {
            applyAnalytics(prefs.analytics);
            injectModal();
            return;
        }
        window['ga-disable-' + GA_ID] = true;
        if (window.gtag) {
            gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' });
        }
        injectModal();
        injectBanner();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
