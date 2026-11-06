(() => {
  const params = new URLSearchParams(location.search);
  const keys = ['affid','aid','tid','utm_source','utm_campaign'];
  const attribution = Object.fromEntries(keys.map(key => [key, params.get(key) || localStorage.getItem(`afc_${key}`) || '']));
  Object.entries(attribution).forEach(([key, value]) => value && localStorage.setItem(`afc_${key}`, value));
  let sessionId = sessionStorage.getItem('afc_session_id');
  if (!sessionId) {
    sessionId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem('afc_session_id', sessionId);
  }
  const context = { ...attribution, aid: attribution.aid || attribution.affid, session_id:sessionId, device:innerWidth<768?'Mobile':innerWidth<1100?'Tablet':'Desktop' };
  const send = data => fetch('/api/events', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(data), keepalive:true }).catch(() => {});
  send({ type:'page_view', page:location.pathname, ...context });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    if (link.matches('a[href*="/checkout"],a[href^="#purchase-"]')) send({ type:'checkout_click', page:location.pathname, product_id:link.getAttribute('href'), ...context });
  }, true);
  if (location.pathname === '/checkout') {
    let started = false;
    document.addEventListener('focusin', event => {
      if (!started && event.target.matches('input,select')) { started = true; send({ type:'checkout_start', page:location.pathname, ...context }); }
    }, true);
  }
})();
