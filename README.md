# dbf-scripts

Gebundelde custom scripts voor de **Dutch Boat Factory** Webflow-site (site_id `6a12e557b52abe1fe77a398d`).
Vervangt de ~25 losse "registered inline scripts" in Webflow door 3 bestanden, geserveerd via jsDelivr.

## Bundels
| Bestand | Laden in Webflow | Bevat |
|---|---|---|
| `dbf-head.js` | Site → **Head** (site-breed) | anti-flash hide + loading-layer + shop-grid min-height + form-checkbox CSS |
| `dbf-main.js` | Site → **Footer** (site-breed) | alle animaties + UX: hero-video, nav-scroll, h2-reveal, eyebrow, usp, service-title, cases/team dots, loading-progress, forms |
| `dbf-shop.js` | Shop-pagina → **Footer** | alle Shopify: cart-CSS, cart-logic, products, checkout-pijl |

Elke module is een op zichzelf staande IIFE en activeert zich alleen waar zijn element bestaat, dus de site-brede bundels zijn veilig op elke pagina.

## Laden in Webflow (jsDelivr)
```html
<!-- Site → Head -->
<script src="https://cdn.jsdelivr.net/gh/uberhaupt/dbf-scripts@1.0.0/dbf-head.js"></script>
<!-- Site → Footer -->
<script src="https://cdn.jsdelivr.net/gh/uberhaupt/dbf-scripts@1.0.0/dbf-main.js"></script>
<!-- Shop-pagina → Footer -->
<script src="https://cdn.jsdelivr.net/gh/uberhaupt/dbf-scripts@1.0.0/dbf-shop.js"></script>
```

## Aanpassen & uitrollen
1. Bewerk het betreffende `.js`-bestand.
2. `git commit` + `git push`.
3. **Nieuwe versie taggen** (`git tag v1.0.1 && git push origin v1.0.1`) — jsDelivr cachet versies onveranderlijk.
4. De versie in de Webflow `<script src>`-URL ophogen (`@1.0.0` → `@1.0.1`), dan publishen.

Alternatief zonder tag-bump: gebruik `@main` in de URL en purge na een push via `https://purge.jsdelivr.net/gh/uberhaupt/dbf-scripts@main/dbf-main.js`.

## Herkomst
De modules komen 1-op-1 uit de Webflow registered scripts (backup in `~/Dropbox/CLAUDE/Dutch Boat Factory/scripts/`). Gedrag is identiek; alleen herordend.
