/* Regressietests voor dbf-main.js.
 *
 * Waarom: dbf-main.js is één bestand met een stuk of vijftien losse modules dat
 * op elke pagina van een live site draait. `node --check` ziet alleen of het
 * geldig JavaScript is, niet of een module nog doet wat hij hoort te doen.
 *
 * Draaien:  npm install && npm test
 *
 * Een module toevoegen: schrijf een nieuw blok met check()-regels. Houd het bij
 * gedrag dat stuk kán gaan — niet bij opmaak, want hier draait geen echte browser.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const SRC = path.join(__dirname, '..', 'dbf-main.js');
const src = fs.readFileSync(SRC, 'utf8');

let fails = 0;
const check = (naam, ok) => { console.log((ok ? '  ok   ' : '  FAIL ') + naam); if (!ok) fails++; };
const groep = (naam) => console.log('\n' + naam);

/* ------------------------------------------------------------------ *
 * form_validator_v10 — eigen foutmeldingen op de Webflow-formulieren
 * ------------------------------------------------------------------ */
const vStart = src.indexOf("(function(){var s=document.createElement('style');s.textContent='.form-err");
const validator = src.slice(vStart, src.indexOf('/* =====', vStart));

function submit({ radios = false, vulVelden = false, kiesRadio = false }) {
  const radioHtml = radios ? `
    <div class="form_field-wrapper">
      <label class="w-radio"><input type="radio" id="6M-RIB" name="product" value="6M RIB"></label>
      <label class="w-radio"><input type="radio" id="9M-RIB" name="product" value="9M RIB"></label>
    </div>` : '';
  const dom = new JSDOM(`<!doctype html><html><head></head><body>
    <form id="wf-form-Form" class="form_form">${radioHtml}
      <input type="text" id="Name" class="form_input">
      <input type="text" id="Email" class="form_input">
      <textarea id="Message-3" class="form_input"></textarea>
      <label class="w-checkbox"><input type="checkbox" id="Checkbox"></label>
    </form></body></html>`, { runScripts: 'outside-only' });

  const w = dom.window, d = w.document;
  w.eval(validator);

  if (vulVelden) {
    d.getElementById('Name').value = 'Mark Moget';
    d.getElementById('Email').value = 'mark@example.com';
    d.getElementById('Message-3').value = 'Graag een prijsopgave voor een romp.';
    d.getElementById('Checkbox').checked = true;
  }
  if (kiesRadio) d.getElementById('9M-RIB').checked = true;

  const ev = new w.Event('submit', { bubbles: true, cancelable: true });
  const doorgelaten = d.getElementById('wf-form-Form').dispatchEvent(ev) && !ev.defaultPrevented;
  const melding = d.getElementById('rad-e');
  return { doorgelaten, meldingBestaat: !!melding, meldingZichtbaar: melding ? melding.classList.contains('show') : null };
}

groep('form_validator — contactformulier (geen radiogroep)');
check('leeg formulier wordt geblokkeerd',      submit({}).doorgelaten === false);
check('compleet formulier gaat door',          submit({ vulVelden: true }).doorgelaten === true);
check('er wordt geen radio-melding bijgezet',  submit({ vulVelden: true }).meldingBestaat === false);

groep('form_validator — offeringformulier (met radiogroep)');
check('zonder productkeuze geblokkeerd',       submit({ radios: true, vulVelden: true }).doorgelaten === false);
check('melding wordt getoond',                 submit({ radios: true, vulVelden: true }).meldingZichtbaar === true);
check('met productkeuze gaat door',            submit({ radios: true, vulVelden: true, kiesRadio: true }).doorgelaten === true);

/* ------------------------------------------------------------------ *
 * cases_video_v1 — eigen play/stop over de YouTube-embed
 * Alleen de CSS-intentie; afspelen zelf vraagt een echte browser.
 * ------------------------------------------------------------------ */
groep('cases_video — stopknop');
check('verbergt zich na 4 seconden',           /is-idle.\);\},4000\)/.test(src));
check('idle-regel zet opacity op 0',           src.includes('.dbf-vstop.is-idle{opacity:0;pointer-events:none}'));
check('hover toovert hem NIET terug',         !src.includes('.dbf-vstop.is-idle{opacity:1'));
check('hover verandert wel de kleur',          src.includes('.dbf-vstop:hover{background:#f15a24'));
check('klik op de video toont hem weer',       src.includes("shield.addEventListener('click',reveal)"));

/* ------------------------------------------------------------------ *
 * hubspot_form_relay_v2 — inzendingen doorsturen naar HubSpot
 * Veldnamen zijn kritiek: een onbekend veld laat HubSpot de HELE
 * inzending weigeren.
 * ------------------------------------------------------------------ */
groep('hubspot relay — veldnamen');
check('stuurt product_interest',               src.includes("F('product_interest',prod)"));
check('boat_interest is volledig weg',        !src.includes('boat_interest'));
check('data-hs-boat is volledig weg',         !src.includes('data-hs-boat'));
check('leest de aangevinkte radio',            src.includes('input[type="radio"][name^="product" i]:checked'));
check('leest data-hs-product als terugval',    src.includes("getAttribute('data-hs-product')"));

/* ------------------------------------------------------------------ *
 * loading_progress_v13 — de laadlaag over de hero
 * De tijden bepalen samen hoe lang een bezoeker naar de laag kijkt:
 *   dur 1500 (teller) + 300 (pauze op 100%) + 800 (wegvegen) = 2,6 s
 *   CAP 2500 = extra wachttijd op de video, gerekend vanaf het load-event
 *   HARDMAX 5000 = bovengrens, vanaf het begin gerekend
 * ------------------------------------------------------------------ */
groep('loading_progress — timing');
check('teller duurt 1500 ms',                  src.includes('var dur=1500,start=performance.now()'));
check('pauze op 100% is 300 ms',               src.includes('setTimeout(finish,300)'));
check('wegvegen duurt 0.8 s',                  src.includes('clip-path 0.8s cubic-bezier(0.76,0,0.24,1)'));
check('laag verdwijnt na 850 ms',              src.includes('startLenis();},850)'));
check('wachten op video gecapt op 2500 ms',    src.includes('CAP=2500'));
check('harde bovengrens op 5000 ms',           src.includes('HARDMAX=5000'));

console.log(fails ? `\n${fails} test(s) GEFAALD\n` : '\nAlles groen\n');
process.exit(fails ? 1 : 0);
