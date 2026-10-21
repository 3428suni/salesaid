// Meta Pixel for the consult landing page: notice + opt-out (owner decision 2026-10-21, option A).
// It runs on visit; the privacy policy (linked in the footer) discloses it, and the footer link
// '광고 추적 설정' lets a visitor refuse at any time. A refusal is remembered in this browser,
// stops tracking at once and removes the _fbp/_fbc cookies.
//
// - Nothing loads, renders or is stored while `enabled` is false.
// - Events: one PageView per page load (after consent) and one Lead + one CompleteRegistration per newly saved consult
//   request. Only the event name is sent. Name, phone, message and receipt number are never
//   passed to Meta; the page only receives a one-way hash of the receipt, used here to stop duplicate Lead events.
// - autoConfig is off (no automatic button-click/metadata events, no automatic advanced
//   matching) and no customer data is given to fbq('init').
// - The consult form works the same whether the visitor allows or refuses tracking.
(() => {
  'use strict';
  const DEFAULTS = {
    enabled: true,                        // owner approved 2026-10-21
    pixelId: '949705877892080',           // Events Manager dataset "카드매출유동화" (Salesaidcoltd)
    consentVersion: 'ad-tracking-v1-20261021',
    policyUrl: '/privacy/',
    scriptSrc: 'https://connect.facebook.net/en_US/fbevents.js'
  };
  const cfg = Object.assign({}, DEFAULTS, window.SALESAID_META_PIXEL || {});
  const api = { enabled: () => cfg.enabled === true };
  window.SalesaidMetaPixel = api;
  if (!api.enabled() || !/^\d{15,16}$/.test(String(cfg.pixelId))) return;

  const CONSENT_KEY = 'sa_ad_consent';
  const LEAD_KEY = 'sa_mp_leads';
  let loaded = false, pageViewSent = false;

  // ---- consent storage -------------------------------------------------------------------
  function readConsent() {
    try {
      const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      if (!c || c.v !== cfg.consentVersion || (c.s !== 'granted' && c.s !== 'denied')) return '';
      return c.s;
    } catch { return ''; }
  }
  function writeConsent(state) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: cfg.consentVersion, s: state, at: new Date().toISOString() })); } catch {}
  }

  // ---- pixel -----------------------------------------------------------------------------
  function loadPixel() {
    if (loaded) return;
    loaded = true;
    /* Standard Meta base code, without the <noscript> image (that would fire without consent). */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', cfg.scriptSrc);
    window.fbq.disablePushState = true;            // no extra PageView on history changes
    window.fbq('consent', 'grant');
    window.fbq('set', 'autoConfig', false, cfg.pixelId); // no automatic events / metadata / matching
    window.fbq('init', cfg.pixelId);                // no customer data
  }
  function sendPageView() {
    if (pageViewSent) return;
    pageViewSent = true;
    window.fbq('track', 'PageView');
  }
  function revoke() {
    if (window.fbq) { try { window.fbq('consent', 'revoke'); } catch {} }
    const host = location.hostname.split('.');
    const domains = ['', location.hostname];
    for (let i = 1; i < host.length - 1; i++) domains.push('.' + host.slice(i).join('.'));
    for (const name of ['_fbp', '_fbc']) for (const d of domains)
      document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '') + '; SameSite=Lax';
  }

  // ---- Lead: once per newly saved consult request -----------------------------------------
  function sentLeads() { try { const a = JSON.parse(localStorage.getItem(LEAD_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch { return []; } }
  function newEventId() {
    try { return crypto.randomUUID(); } catch { return 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2); }
  }
  async function onSaved(ev) {
    const d = ev && ev.detail || {};
    if (readConsent() === 'denied' || !window.fbq) return;           // refused → nothing
    if (d.created === false) return;                                 // server says it was a retry/duplicate
    const key = typeof d.key === 'string' && /^[0-9a-f]{24}$/.test(d.key) ? d.key : ''; // hashed receipt of a confirmed save
    if (!key) return;
    const list = sentLeads();
    if (list.includes(key)) return;                                   // same receipt already counted
    list.push(key);
    try { localStorage.setItem(LEAD_KEY, JSON.stringify(list.slice(-20))); } catch { return; }
    // Two standard events for the same confirmed save (owner decision 2026-10-21):
    // - Lead: the event that matches a consult request; use it for new ad sets.
    // - CompleteRegistration (등록 완료): the running ad set was published with this optimization
    //   event and Meta does not allow changing it, so it keeps counting results without a new ad set.
    // Each has its own random eventID; neither carries customer data.
    window.fbq('track', 'Lead', {}, { eventID: newEventId() });
    window.fbq('track', 'CompleteRegistration', {}, { eventID: newEventId() });
  }
  window.addEventListener('salesaid:consult-saved', onSaved);

  // ---- UI: banner + "광고 추적 설정" ---------------------------------------------------------
  const css = `
#sa-adc{position:fixed;left:12px;right:12px;bottom:12px;z-index:70;max-width:560px;margin:0 auto;background:#0f1c2d;color:#e5e7eb;border-radius:10px;box-shadow:0 18px 40px rgba(0,0,0,.35);padding:16px 16px 14px;font:14px/1.6 Pretendard,'Noto Sans KR',sans-serif}
#sa-adc h2{margin:0 0 6px;font-size:15px;color:#fff}
#sa-adc p{margin:0 0 10px}
#sa-adc a{color:#d8c08f}
#sa-adc .row{display:flex;gap:8px}
#sa-adc button{flex:1;height:44px;border-radius:6px;font:700 14px Pretendard,sans-serif;cursor:pointer}
#sa-adc .no{background:#fff;color:#0f1c2d;border:1px solid #fff}
#sa-adc .yes{background:#fff;color:#0f1c2d;border:1px solid #fff}
#sa-adc .now{font-size:12.5px;color:#cbd5e1;margin:-4px 0 10px}
.sa-adc-open .cl-quick:not([data-sheet="true"]),.sa-adc-open .cl-float{display:none!important}
@media (max-width:768px){#sa-adc{left:8px;right:8px;bottom:8px;padding:12px 12px 10px;font-size:13px;line-height:1.55}#sa-adc h2{font-size:14px}#sa-adc p{margin-bottom:8px}#sa-adc button{height:40px}}`;
  function ensureStyle() {
    if (document.getElementById('sa-adc-style')) return;
    const s = document.createElement('style'); s.id = 'sa-adc-style'; s.textContent = css; document.head.appendChild(s);
  }
  function closeBanner() { document.getElementById('sa-adc')?.remove(); document.documentElement.classList.remove('sa-adc-open'); }
  function apply(state) {
    const before = readConsent();
    writeConsent(state);
    if (state === 'granted') { loadPixel(); sendPageView(); }
    else if (before === 'granted' || window.fbq) revoke();
    try { window.dispatchEvent(new CustomEvent('salesaid:ad-consent', { detail: { granted: state === 'granted' } })); } catch {}
  }
  function choose(state) {
    apply(state);
    closeBanner();
    document.getElementById('sa-adset-btn')?.focus({ preventScroll: true });
  }
  function showBanner() {
    ensureStyle();
    closeBanner();
    const cur = readConsent();
    const box = document.createElement('section');
    box.id = 'sa-adc'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-labelledby', 'sa-adc-t');
    box.innerHTML = `<h2 id="sa-adc-t">광고 추적 설정 (Meta 픽셀)</h2>
<p>세일사이드는 광고 성과를 측정하기 위해 Meta Platforms의 픽셀을 사용합니다. 이 페이지 방문 사실과 상담 신청 완료 여부가 쿠키·기기 정보와 함께 Meta에 전송됩니다. <b>성함·연락처·문의 내용은 전송하지 않습니다.</b> 거부하시면 이 브라우저에서는 전송을 멈추며, 거부해도 상담 신청은 그대로 이용하실 수 있습니다. <a href="${cfg.policyUrl}" target="_blank" rel="noopener">개인정보 처리방침</a></p>
<p class="now">현재 설정: ${cur === 'denied' ? '거부함' : '허용'}</p>
<div class="row"><button type="button" class="no">거부</button><button type="button" class="yes">허용</button></div>`;
    box.querySelector('.no').addEventListener('click', () => choose('denied'));
    box.querySelector('.yes').addEventListener('click', () => choose('granted'));
    document.body.appendChild(box);
    document.documentElement.classList.add('sa-adc-open');
  }
  // "광고 추적 설정" sits in the footer next to the existing 동의서 link (the footer itself is
  // rendered by the page template, so the button is re-attached if a re-render removes it).
  function makeSettingsButton() {
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'sa-adset-btn'; b.textContent = '광고 추적 설정';
    b.style.cssText = 'border:0;background:none;padding:0;color:#aaa;font:inherit;text-decoration:underline;cursor:pointer';
    return b;
  }
  function attachSettings() {
    if (document.getElementById('sa-adset-btn')) return;
    const footer = document.querySelector('footer');
    const row = footer && [...footer.querySelectorAll('div')].reverse().find(d => /개인정보 수집·이용 동의서/.test(d.textContent) && d.querySelector('button'));
    if (row) row.appendChild(makeSettingsButton());
  }
  function mountSettings() {
    ensureStyle();
    // Delegated: the template may re-create the footer button, so the listener lives on the document.
    document.addEventListener('click', e => { if (e.target && e.target.closest && e.target.closest('#sa-adset-btn')) showBanner(); }, true);
    attachSettings();
    let t = 0;
    new MutationObserver(() => { if (t) return; t = setTimeout(() => { t = 0; attachSettings(); }, 50); })
      .observe(document.body, { childList: true, subtree: true });
  }

  function start() {
    mountSettings();
    const c = readConsent();
    if (c !== 'denied') { loadPixel(); sendPageView(); }
  }
  api.consent = readConsent;
  api.openSettings = showBanner;
  api.setConsent = state => { if (state === 'granted' || state === 'denied') apply(state); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
