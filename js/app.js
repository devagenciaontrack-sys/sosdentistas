/* Comportamento do site: idioma, menu do celular e formulário. */
(function () {
  'use strict';

  var TEXTOS = window.TEXTOS || {};
  var atual = 'pt';

  /* As páginas de região trazem um dicionário próprio em
     window.TEXTOS_PAGINA. Ele se junta ao geral, sem sobrescrevê-lo. */
  if (window.TEXTOS_PAGINA) {
    ['pt', 'en'].forEach(function (lang) {
      var extra = window.TEXTOS_PAGINA[lang];
      if (!extra || !TEXTOS[lang]) return;
      Object.keys(extra).forEach(function (k) { TEXTOS[lang][k] = extra[k] });
    });
  }

  /* ─────────── idioma ─────────── */

  function guardar (lang) {
    try { localStorage.setItem('sos-idioma', lang) } catch (e) { /* modo privado */ }
  }

  function lembrado () {
    try {
      var g = localStorage.getItem('sos-idioma');
      if (g === 'pt' || g === 'en') return g;
    } catch (e) { /* modo privado */ }
    return (navigator.language || '').toLowerCase().indexOf('pt') === 0 ? 'pt' : null;
  }

  function aplicar (lang) {
    var dic = TEXTOS[lang];
    if (!dic) return;
    atual = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var txt = dic[el.getAttribute('data-i18n')];
      if (txt == null) return;
      // só a nota de convênios traz marcação; o resto entra como texto
      if (txt.indexOf('<strong>') === 0) el.innerHTML = txt;
      else el.textContent = txt;
    });

    document.documentElement.lang = (lang === 'pt' ? 'pt-BR' : 'en');

    document.querySelectorAll('.idioma button').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('ativo', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    // mantém a mensagem pronta do WhatsApp no idioma escolhido
    var ola = encodeURIComponent(dic.zapOla);
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      var base = a.getAttribute('href').split('?')[0];
      if (a.getAttribute('href').indexOf('text=') > -1) a.setAttribute('href', base + '?text=' + ola);
    });

    guardar(lang);
  }

  document.querySelectorAll('.idioma button').forEach(function (b) {
    b.addEventListener('click', function () { aplicar(b.getAttribute('data-lang')) });
  });

  /* ─────────── menu do celular ─────────── */

  var botao = document.getElementById('hamburguer');
  var menu = document.getElementById('menu');

  function fecharMenu () {
    if (!menu) return;
    menu.classList.remove('aberto');
    if (botao) botao.setAttribute('aria-expanded', 'false');
  }

  if (botao && menu) {
    botao.addEventListener('click', function () {
      var abrindo = !menu.classList.contains('aberto');
      menu.classList.toggle('aberto', abrindo);
      botao.setAttribute('aria-expanded', abrindo ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', fecharMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharMenu();
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !botao.contains(e.target)) fecharMenu();
    });
  }

  /* ─────────── mega-menu "Onde atendemos" ─────────── */

  var abreMega = document.querySelector('.abre-mega');
  var mega = document.getElementById('mega');

  function fecharMega () {
    if (!mega) return;
    mega.hidden = true;
    if (abreMega) abreMega.setAttribute('aria-expanded', 'false');
  }

  if (abreMega && mega) {
    abreMega.addEventListener('click', function (e) {
      e.stopPropagation();
      var abrindo = mega.hidden;
      mega.hidden = !abrindo;
      abreMega.setAttribute('aria-expanded', abrindo ? 'true' : 'false');
    });
    mega.addEventListener('click', function (e) { e.stopPropagation() });
    document.addEventListener('click', fecharMega);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { fecharMega(); if (abreMega) abreMega.focus() }
    });
    // no desktop, abrir ao passar o mouse é mais rápido que clicar
    var pai = abreMega.parentElement;
    if (window.matchMedia('(min-width:821px)').matches) {
      pai.addEventListener('mouseenter', function () {
        mega.hidden = false; abreMega.setAttribute('aria-expanded', 'true');
      });
      pai.addEventListener('mouseleave', fecharMega);
    }
  }

  /* ─────────── formulário → WhatsApp ─────────── */
  /* O site é estático: não há servidor para receber o envio.
     Então montamos a mensagem e entregamos pronta no WhatsApp. */

  var form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var dic = TEXTOS[atual] || TEXTOS.pt;
      var d = new FormData(form);
      var nome = (d.get('nome') || '').toString().trim();
      var tel = (d.get('telefone') || '').toString().trim();
      var msg = (d.get('mensagem') || '').toString().trim();

      var linhas = [msg];
      if (nome) linhas.push(dic.zapNome + ': ' + nome);
      if (tel) linhas.push(dic.zapTel + ': ' + tel);

      window.open('https://wa.me/5511945825999?text=' +
        encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
    });
  }

  /* ─────────── ano do rodapé ─────────── */

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ─────────── início ─────────── */

  var inicial = lembrado();
  if (inicial && inicial !== 'pt') aplicar(inicial);
  else aplicar('pt');
})();
