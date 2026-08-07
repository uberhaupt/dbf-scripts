/*! HEAD bundle — laden in <head>, site-breed
    Dutch Boat Factory — samengesteld 2026-08-07.
    Elke module is een op zichzelf staande IIFE en activeert alleen waar zijn element bestaat. */

/* ===================== siteheaderinitv1-2.0.0.js ===================== */
(function(){var s=document.createElement('style');s.textContent='.heading-style-h2,.text-eyebrow,.hdpro_title{visibility:hidden!important}';document.head.appendChild(s);})();(function(){var s=document.createElement('style');s.textContent='.header_intro{opacity:0;transform:translateY(2rem)}';document.head.appendChild(s);function init(){var els=document.querySelectorAll('.header_intro');if(!els.length)return;var tr='opacity 0.3s cubic-bezier(0.61,1,0.88,1) 0.2s,transform 0.3s cubic-bezier(0.61,1,0.88,1) 0.2s';for(var i=0;i<els.length;i++){els[i].style.transition=tr;els[i].style.willChange='opacity,transform';}var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){if(es[i].isIntersecting){var el=es[i].target;el.style.opacity='1';el.style.transform='translateY(0)';io.unobserve(el);}}},{threshold:0});for(var i=0;i<els.length;i++)io.observe(els[i]);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();

/* ===================== loading_layer_once_v6-1.0.0.js ===================== */
(function(){var n=(performance.getEntriesByType('navigation')[0]||{}).type;if(n==='reload')sessionStorage.removeItem('dbf_hv');var visited=sessionStorage.getItem('dbf_hv');var s=document.createElement('style');if(visited){s.textContent='.page-loading-layer{display:none!important}.hero_title_3s{display:none!important}.hero_title_0s{display:block!important}';}else{s.textContent='.page-loading-layer{display:flex!important}.hero_title_0s{display:none!important}';}document.head.appendChild(s);sessionStorage.setItem('dbf_hv','1');})();

/* ===================== shop_grid_min_height_v2-1.0.0.js ===================== */
(function(){var g=document.getElementById('shop-products');if(!g)return;g.style.minHeight='60vh';var obs=new MutationObserver(function(){if(g.children.length>0){g.style.minHeight='';obs.disconnect();}});obs.observe(g,{childList:true});})();

/* ===================== form_checkbox_icon_v1-1.0.0.js ===================== */
(function(){var s=document.createElement('style');s.textContent='.form_checkbox-icon.w--redirected-checked{background-size:55%;background-repeat:no-repeat;background-position:center}';document.head.appendChild(s);})();

