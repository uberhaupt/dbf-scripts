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

## Laden in Webflow

De bundels zitten **niet** als `<script src>` in de custom-code-secties. Ze zijn geregistreerd als
*registered scripts* met een SRI-hash, via de Webflow Data API (app: **Webflow MCP Bridge App** —
die app niet verwijderen, daaronder staan `dbfhead`, `dbfmain` en `dbfshop`).

| Script-id | Toegepast op | Locatie |
|---|---|---|
| `dbfhead` | site-breed | header |
| `dbfmain` | site-breed | footer |
| `dbfshop` | alleen de Shop-pagina | footer |

Omdat de SRI-hash aan precies die bytes hangt, verandert een push naar GitHub **niets** aan de live
site. Elke wijziging vraagt een nieuwe versie. Dat is bewust: niemand kan de inhoud van een script
onder de site vandaan wisselen.

## Testen

```bash
npm install     # eenmalig, installeert jsdom
npm test
```

Laadt `dbf-main.js`, bouwt een neppagina in het geheugen en controleert of de modules nog doen wat
ze horen te doen — formuliervalidatie, het gedrag van de videoknop en de veldnamen die de HubSpot-
relay verstuurt. Draait in ongeveer een seconde.

Dit vervangt handmatig testen niet: er draait geen echte browser, dus opmaak, animaties en of
YouTube daadwerkelijk afspeelt blijf je zelf bekijken. Het vangt wat je met het blote oog mist —
dat een wijziging in de ene module er stilletjes een andere sloopt.

Nieuwe module toegevoegd? Zet er een blok `check()`-regels bij in `test/bundle.test.js`.

## Aanpassen & uitrollen

1. Bewerk het betreffende `.js`-bestand.
2. `npm test` — moet groen zijn.
3. `git commit` + `git push`, en **tag de nieuwe versie** (`git tag v1.0.24 && git push origin --tags`).
4. jsDelivr purgen en controleren dat er staat wat er moet staan:
   ```bash
   curl -s https://purge.jsdelivr.net/gh/uberhaupt/dbf-scripts@1.0.24/dbf-main.js -o /dev/null
   curl -s -o /tmp/x.js -w '%{http_code}\n' https://cdn.jsdelivr.net/gh/uberhaupt/dbf-scripts@1.0.24/dbf-main.js
   diff -q dbf-main.js /tmp/x.js
   ```
   **Controleer HTTP-status én inhoud voordat je verder gaat.** Bij een storing serveert jsDelivr een
   foutpagina, en een hash daarover berekend maakt de site stuk.
5. SRI-hash berekenen over het gecontroleerde bestand:
   ```bash
   echo "sha384-$(openssl dgst -sha384 -binary /tmp/x.js | openssl base64 -A)"
   ```
6. Nieuwe versie registreren en toepassen via de Data API (`register_hosted_script` +
   `add_site_script`, of `add_page_script` voor `dbfshop`). Houd dezelfde `display_name`
   (`dbfmain`, `dbfhead`, `dbfshop`): Webflow hangt de nieuwe versie dan onder hetzelfde
   script-id. Gebruik **niet** `update_registered_script` om een versie toe te voegen — dat
   geeft een 404.
7. **Publiceren doet de klant zelf.**

## Herkomst
De modules komen 1-op-1 uit de Webflow registered scripts (backup in `~/Dropbox/CLAUDE/Dutch Boat Factory/scripts/`). Gedrag is identiek; alleen herordend.
