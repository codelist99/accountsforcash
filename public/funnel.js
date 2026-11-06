(() => {
  const products = new Set(['upsell1','upsell2','upsell2_downsell','upsell3','upsell3_downsell','upsell4','upsell4_downsell','upsell5','upsell5_downsell_497','upsell5_downsell_297','upsell5_downsell_97']);
  document.addEventListener('click', async event => {
    const link = event.target.closest('a[href^="#purchase-"]');
    if (!link) return;
    event.preventDefault();
    const product = link.getAttribute('href').slice(10);
    if (!products.has(product)) return;
    const previous = link.innerHTML;
    link.style.pointerEvents = 'none';
    link.textContent = 'Securely processing…';
    try {
      const response = await fetch('/api/purchase', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ product }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Purchase could not be completed');
      location.href = data.next;
    } catch (error) {
      link.innerHTML = previous;
      link.style.pointerEvents = '';
      alert(error.message);
    }
  }, true);
})();
