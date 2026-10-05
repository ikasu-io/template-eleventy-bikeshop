// Two small helpers; the page works without them.
(() => {
  // Open / closed badge and today's row in the opening hours, worked out
  // in the shop's time zone from src/_data/shop.json.
  const { timeZone, hours } = JSON.parse(document.getElementById('shop-hours').textContent);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone, weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).map((p) => [p.type, p.value]),
  );
  const now = `${parts.hour}:${parts.minute}`;
  const index = hours.findIndex((h) => h.day === parts.weekday);
  const today = hours[index];
  document.querySelector(`.hours tr[data-day="${parts.weekday}"]`)?.classList.add('is-today');
  const badge = document.querySelector('[data-open-badge]');
  if (badge && today) {
    const open = today.open && now >= today.open && now < today.close;
    let text = open ? `Open until ${today.close}` : '';
    if (!open) {
      for (let i = 0; i < 7; i++) {
        const h = hours[(index + i) % 7];
        if (h.open && (i > 0 || now < h.open)) {
          text = `Closed · opens ${i === 0 ? 'today' : i === 1 ? 'tomorrow' : h.day.slice(0, 3)} ${h.open}`;
          break;
        }
      }
    }
    badge.textContent = text;
    badge.classList.toggle('is-open', open);
    badge.hidden = !text;
  }

  // Filter the bikes by type.
  const filter = document.querySelector('[data-filter]');
  if (!filter) return;
  const bikes = [...document.querySelectorAll('.bike')];
  const empty = document.querySelector('[data-filter-empty]');
  filter.hidden = false;
  filter.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-type]');
    if (!button) return;
    const type = button.dataset.type;
    for (const b of filter.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b === button));
    let shown = 0;
    for (const bike of bikes) {
      const show = type === 'all' || bike.dataset.type === type;
      bike.hidden = !show;
      if (show && !bike.classList.contains('bike-sold')) shown++;
    }
    empty.hidden = shown > 0;
  });
})();
