/* Gera as páginas de região e o menu "Onde atendemos".
   Rode da raiz do projeto:  node tools/gera-locais.cjs

   Por que gerar em vez de escrever à mão: são 21 páginas que precisam
   dizer a mesma coisa do mesmo jeito. Mudou o telefone, muda aqui e
   todas as 21 acompanham. */

const fs = require('fs')
const path = require('path')

const RAIZ = path.resolve(__dirname, '..')
const DADOS = JSON.parse(fs.readFileSync(path.join(__dirname, 'locais.json'), 'utf8'))
const { clinica, grupos, locais } = DADOS
const SITE = 'https://devagenciaontrack-sys.github.io/sosdentistas'

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const porGrupo = id => locais.filter(l => l.grupo === id)
const curto = l => l.curto || l.nome

/* ─────────── menu (igual em todas as páginas) ─────────── */

function menu (prof) {
  const r = '../'.repeat(prof)        // caminho até a raiz
  const colunas = grupos.map(g => `
          <div class="mega-col">
            <p class="mega-tit" data-i18n="grupo_${g.id}">${esc(g.pt)}</p>
            <ul>
${porGrupo(g.id).map(l =>
  `              <li><a href="${r}locais/${l.slug}/">${esc(curto(l))}</a></li>`).join('\n')}
            </ul>
          </div>`).join('')

  return `<nav class="menu" id="menu" aria-label="Principal">
      <a href="${r}#urgencia" data-i18n="navUrgencia">Urgência</a>
      <a href="${r}#especialidades" data-i18n="navEspecialidades">Especialidades</a>
      <a href="${r}#convenios" data-i18n="navConvenios">Convênios</a>

      <div class="tem-mega">
        <button type="button" class="abre-mega" aria-expanded="false" aria-controls="mega">
          <span data-i18n="navOnde">Onde atendemos</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        <div class="mega" id="mega" hidden>
          <div class="mega-grade">${colunas}
          </div>
          <a class="mega-pe" href="${r}locais/">
            <span data-i18n="verTodas">Ver todas as regiões</span> →
          </a>
        </div>
      </div>

      <a href="${r}#contato" data-i18n="navContato">Contato</a>
    </nav>`
}

/* ─────────── cabeçalho e rodapé compartilhados ─────────── */

function cabecalho (prof) {
  const r = '../'.repeat(prof)
  return `<header class="cabecalho">
  <div class="faixa-topo">
    <span class="pulso" aria-hidden="true"></span>
    <span data-i18n="faixaAberto">Aberto agora — atendemos 24 horas, todos os dias</span>
  </div>

  <div class="barra">
    <a class="marca" href="${r}" aria-label="SOS Dentistas 24 Horas">
      <img src="${r}assets/logo-sos.png" alt="SOS Dentistas" width="190" height="59">
    </a>

    <!-- MENU:INICIO -->
    ${menu(prof)}
    <!-- MENU:FIM -->

    <div class="acoes">
      <div class="idioma" role="group" aria-label="Idioma / Language">
        <button type="button" data-lang="pt" class="ativo">PT</button>
        <button type="button" data-lang="en">EN</button>
      </div>
      <a class="btn btn-tel" href="tel:${clinica.telefoneLimpo}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1z"/></svg>
        <span>${clinica.telefone}</span>
      </a>
      <button class="hamburguer" id="hamburguer" aria-label="Abrir menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>`
}

function rodape (prof) {
  const r = '../'.repeat(prof)
  return `<footer class="rodape">
  <div class="rodape-grade">
    <div>
      <img src="${r}assets/logo-sos.png" alt="SOS Dentistas" width="170" height="53">
      <p class="razao">Instituto SOS Dentistas 24 Horas Carvalho &amp; Machado</p>
    </div>
    <div>
      <h4 data-i18n="rodEndereco">Endereço</h4>
      <p>${clinica.endereco}<br>${clinica.bairro}<br>${clinica.cidade} — ${clinica.uf}</p>
    </div>
    <div>
      <h4 data-i18n="rodContato">Contato</h4>
      <p>
        <a href="tel:${clinica.telefoneLimpo}">${clinica.telefone}</a><br>
        <a href="tel:${clinica.telefone2Limpo}">${clinica.telefone2}</a><br>
        <a href="https://wa.me/${clinica.whatsapp}" target="_blank" rel="noopener">WhatsApp ${clinica.telefone2 && '(11) 94582-5999'}</a>
      </p>
    </div>
    <div>
      <h4 data-i18n="rodRegioes">Regiões</h4>
      <p><a href="${r}locais/" data-i18n="verTodas">Ver todas as regiões</a></p>
    </div>
  </div>
  <p class="creditos"><span>&copy; <span id="ano">2026</span> SOS Dentistas 24 Horas</span></p>
</footer>

<div class="barra-fixa">
  <a class="btn btn-vermelho" href="tel:${clinica.telefoneLimpo}" data-i18n="fixoLigar">Ligar agora</a>
  <a class="btn btn-zap" href="https://wa.me/${clinica.whatsapp}?text=Ol%C3%A1%2C%20preciso%20de%20atendimento%20odontol%C3%B3gico%20de%20urg%C3%AAncia." target="_blank" rel="noopener">WhatsApp</a>
</div>`
}

function molde ({ prof, titulo, descricao, canonico, corpo, extraCabeca = '', dicionario = '' }) {
  const r = '../'.repeat(prof)
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${canonico}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="SOS Dentistas 24 Horas">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="${canonico}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:image" content="${SITE}/assets/og-sos.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="${r}assets/logo-sos.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${r}css/estilo.css?v=2">
${extraCabeca}
</head>
<body>

<a class="pular" href="#conteudo" data-i18n="pular">Pular para o conteúdo</a>

${cabecalho(prof)}

<main id="conteudo">
${corpo}
</main>

${rodape(prof)}

<script src="${r}js/idiomas.js?v=2"></script>
${dicionario}
<script src="${r}js/app.js?v=2"></script>
</body>
</html>
`
}

/* ─────────── página de cada região ─────────── */

function paginaLocal (l) {
  const nome = l.nome
  const vizinhos = porGrupo(l.grupo).filter(o => o.slug !== l.slug).slice(0, 6)
  const grupo = grupos.find(g => g.id === l.grupo)

  const rota = 'https://www.google.com/maps/dir/?api=1&origin=' +
    encodeURIComponent(nome + ', São Paulo') +
    '&destination=' + encodeURIComponent(clinica.endereco + ', ' + clinica.bairro + ', São Paulo')

  const zap = 'https://wa.me/' + clinica.whatsapp + '?text=' +
    encodeURIComponent('Olá, estou em ' + nome + ' e preciso de atendimento odontológico de urgência.')

  const titulo = `Dentista 24 horas em ${nome} | SOS Dentistas`
  const descricao = `Pronto-socorro odontológico 24 horas para quem está em ${nome}. ` +
    `${clinica.endereco}, ${clinica.bairro}. Ligue ${clinica.telefone}.`

  const sede = l.sede
    ? `<p class="destaque-sede" data-i18n="ehSede">Esta é a região onde fica a nossa clínica.</p>`
    : ''

  const schema = `<script type="application/ld+json">
{
  "@context":"https://schema.org","@type":"Dentist",
  "name":"SOS Dentistas 24 Horas",
  "url":"${SITE}/locais/${l.slug}/",
  "telephone":"${clinica.telefoneLimpo}",
  "address":{"@type":"PostalAddress","streetAddress":"${clinica.endereco}",
    "addressLocality":"${clinica.cidade}","addressRegion":"${clinica.uf}","addressCountry":"BR"},
  "areaServed":{"@type":"Place","name":"${esc(nome)}, São Paulo"},
  "openingHoursSpecification":{"@type":"OpeningHoursSpecification",
    "dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens":"00:00","closes":"23:59"}
}
</script>`

  const dic = `<script>
window.TEXTOS_PAGINA = {
  pt: {
    migalhaInicio: 'Início', migalhaLocais: 'Onde atendemos',
    localH1: 'Dentista 24 horas em ${nome.replace(/'/g, "\\'")}',
    localIntro: 'Nosso pronto-socorro odontológico fica na ${clinica.endereco}, no ${clinica.bairro}, e atende quem está em ${nome.replace(/'/g, "\\'")} 24 horas por dia, todos os dias, sem hora marcada.',
    btnRota: 'Traçar rota até a clínica',
    h2Chegar: 'Como chegar',
    pChegar: 'O endereço é ${clinica.endereco}, ${clinica.bairro}, São Paulo. Temos estacionamento gratuito e acesso para cadeirantes. Se preferir, ligue antes: alguém atende a qualquer hora.',
    h2Antes: 'Antes de sair de casa',
    antes1: 'Se o dente saiu inteiro, guarde-o em leite ou soro fisiológico — nunca na água — e venha imediatamente.',
    antes2: 'Não coloque analgésico ou aspirina direto sobre a gengiva: isso queima o tecido.',
    antes3: 'Traga a carteirinha do convênio, se tiver, e a lista dos remédios que você usa.',
    antes4: 'Com inchaço no rosto, não aplique calor. Gelo por fora ajuda enquanto você se desloca.',
    h2Perto: 'Também atendemos',
    voltarTodas: 'Ver todas as regiões'
  },
  en: {
    migalhaInicio: 'Home', migalhaLocais: 'Where we serve',
    localH1: '24-hour dentist in ${nome.replace(/'/g, "\\'")}',
    localIntro: 'Our dental emergency room is at ${clinica.endereco}, in ${clinica.bairro}, and serves anyone in ${nome.replace(/'/g, "\\'")} 24 hours a day, every day, with no appointment.',
    btnRota: 'Get directions to the clinic',
    h2Chegar: 'Getting here',
    pChegar: 'The address is ${clinica.endereco}, ${clinica.bairro}, São Paulo. We have free parking and wheelchair access. If you prefer, call ahead — someone answers at any hour.',
    h2Antes: 'Before you leave home',
    antes1: 'If a tooth came out whole, keep it in milk or saline — never in water — and come immediately.',
    antes2: 'Do not place a painkiller or aspirin directly on the gum: it burns the tissue.',
    antes3: 'Bring your insurance card, if you have one, and a list of the medication you take.',
    antes4: 'With facial swelling, do not apply heat. Ice on the outside helps while you travel.',
    h2Perto: 'We also serve',
    voltarTodas: 'See all areas'
  }
};
</script>`

  const corpo = `  <nav class="migalha" aria-label="Você está aqui">
    <a href="../../" data-i18n="migalhaInicio">Início</a> ·
    <a href="../" data-i18n="migalhaLocais">Onde atendemos</a> ·
    <span>${esc(nome)}</span>
  </nav>

  <section class="capa capa-local">
    <div class="capa-txt">
      <p class="olho" data-i18n="grupo_${grupo.id}">${esc(grupo.pt)}</p>
      <h1 data-i18n="localH1">Dentista 24 horas em ${esc(nome)}</h1>
      <p class="chamada" data-i18n="localIntro">Nosso pronto-socorro odontológico fica na ${clinica.endereco}, no ${clinica.bairro}, e atende quem está em ${esc(nome)} 24 horas por dia, todos os dias, sem hora marcada.</p>
      ${sede}
      <div class="botoes">
        <a class="btn btn-grande btn-vermelho" href="tel:${clinica.telefoneLimpo}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1z"/></svg>
          <span data-i18n="btnLigar">Ligar agora</span>
        </a>
        <a class="btn btn-grande btn-zap" href="${zap}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
      <ul class="selos">
        <li data-i18n="selo1">Sem hora marcada</li>
        <li data-i18n="selo2">Estacionamento gratuito</li>
        <li data-i18n="selo3">Acesso para cadeirantes</li>
      </ul>
    </div>

    <div class="capa-img">
      <div class="mapa mapa-local">
        <iframe title="Mapa — ${esc(clinica.endereco)}"
          src="https://www.google.com/maps?q=${encodeURIComponent(clinica.endereco + ', ' + clinica.bairro + ', São Paulo')}&output=embed"
          loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <a class="btn btn-tel btn-rota" href="${rota}" target="_blank" rel="noopener" data-i18n="btnRota">Traçar rota até a clínica</a>
    </div>
  </section>

  <section class="secao fundo-claro">
    <div class="duas">
      <div>
        <h2 data-i18n="h2Chegar">Como chegar</h2>
        <p class="apoio" data-i18n="pChegar">O endereço é ${clinica.endereco}, ${clinica.bairro}, São Paulo. Temos estacionamento gratuito e acesso para cadeirantes. Se preferir, ligue antes: alguém atende a qualquer hora.</p>
      </div>
      <div>
        <h2 data-i18n="h2Antes">Antes de sair de casa</h2>
        <ul class="dicas">
          <li data-i18n="antes1">Se o dente saiu inteiro, guarde-o em leite ou soro fisiológico — nunca na água — e venha imediatamente.</li>
          <li data-i18n="antes2">Não coloque analgésico ou aspirina direto sobre a gengiva: isso queima o tecido.</li>
          <li data-i18n="antes3">Traga a carteirinha do convênio, se tiver, e a lista dos remédios que você usa.</li>
          <li data-i18n="antes4">Com inchaço no rosto, não aplique calor. Gelo por fora ajuda enquanto você se desloca.</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="secao">
    <div class="cabeca">
      <p class="olho" data-i18n="olhoEsp">Especialidades</p>
      <h2 data-i18n="h2Esp">Além do plantão</h2>
    </div>
    <div class="grade">
      <article class="cartao"><span class="num">01</span><h3 data-i18n="esp1t">Urgências 24 horas</h3><p data-i18n="esp1d">Pronto-socorro odontológico aberto todos os dias, sem hora marcada, para dor, trauma e infecção.</p></article>
      <article class="cartao"><span class="num">02</span><h3 data-i18n="esp2t">Implante dentário</h3><p data-i18n="esp2d">Reposição de dentes perdidos, de unidade isolada a reabilitação completa.</p></article>
      <article class="cartao"><span class="num">03</span><h3 data-i18n="esp3t">Endodontia</h3><p data-i18n="esp3d">Tratamento de canal, inclusive em sessão de urgência para aliviar a dor.</p></article>
      <article class="cartao"><span class="num">04</span><h3 data-i18n="esp4t">Lente de contato dental</h3><p data-i18n="esp4d">Facetas finas em porcelana para forma, cor e alinhamento aparente.</p></article>
      <article class="cartao"><span class="num">05</span><h3 data-i18n="esp5t">Ortodontia</h3><p data-i18n="esp5d">Aparelho convencional e alinhadores transparentes.</p></article>
    </div>
    <p class="nota" data-i18n="notaConv"><strong>Atenção:</strong> pelos convênios atendemos exclusivamente urgências e emergências, 24 horas. Demais tratamentos são particulares.</p>
  </section>

  <section class="secao fundo-claro">
    <div class="cabeca"><h2 data-i18n="h2Perto">Também atendemos</h2></div>
    <ul class="planos">
${vizinhos.map(v => `      <li><a href="../${v.slug}/">${esc(curto(v))}</a></li>`).join('\n')}
      <li><a href="../" data-i18n="voltarTodas">Ver todas as regiões</a></li>
    </ul>
  </section>
`

  return molde({
    prof: 2, titulo, descricao,
    canonico: `${SITE}/locais/${l.slug}/`,
    extraCabeca: schema, dicionario: dic, corpo,
  })
}

/* ─────────── página índice das regiões ─────────── */

function paginaIndice () {
  const blocos = grupos.map(g => `
    <div class="bloco-reg">
      <h2 data-i18n="grupo_${g.id}">${esc(g.pt)}</h2>
      <ul class="lista-locais">
${porGrupo(g.id).map(l =>
  `        <li><a href="${l.slug}/"><strong>${esc(curto(l))}</strong>${l.sede ? '<em data-i18n="aqui">nossa clínica fica aqui</em>' : ''}</a></li>`).join('\n')}
      </ul>
    </div>`).join('')

  const dic = `<script>
window.TEXTOS_PAGINA = {
  pt: {
    migalhaInicio: 'Início',
    indiceH1: 'Onde atendemos',
    indiceIntro: 'Somos um pronto-socorro só, na ${clinica.endereco}, no ${clinica.bairro}. Esta lista mostra de onde vêm os pacientes que mais nos procuram — e o caminho até a clínica a partir de cada região.',
    aqui: 'nossa clínica fica aqui'
  },
  en: {
    migalhaInicio: 'Home',
    indiceH1: 'Where we serve',
    indiceIntro: 'We are a single emergency clinic, at ${clinica.endereco}, in ${clinica.bairro}. This list shows where most of our patients come from — and the route to the clinic from each area.',
    aqui: 'our clinic is here'
  }
};
</script>`

  const corpo = `  <nav class="migalha" aria-label="Você está aqui">
    <a href="../" data-i18n="migalhaInicio">Início</a> ·
    <span data-i18n="navOnde">Onde atendemos</span>
  </nav>

  <section class="secao">
    <div class="cabeca">
      <p class="olho" data-i18n="navOnde">Onde atendemos</p>
      <h1 data-i18n="indiceH1">Onde atendemos</h1>
      <p class="apoio" data-i18n="indiceIntro">Somos um pronto-socorro só, na ${clinica.endereco}, no ${clinica.bairro}. Esta lista mostra de onde vêm os pacientes que mais nos procuram — e o caminho até a clínica a partir de cada região.</p>
    </div>
    <div class="regioes-grade">${blocos}
    </div>
  </section>
`

  return molde({
    prof: 1,
    titulo: 'Onde atendemos — SOS Dentistas 24 Horas',
    descricao: `Pronto-socorro odontológico 24 horas em São Paulo. Atendemos pacientes de ${locais.length} regiões. ${clinica.endereco}, ${clinica.bairro}.`,
    canonico: `${SITE}/locais/`,
    dicionario: dic, corpo,
  })
}

/* ─────────── grava tudo ─────────── */

let n = 0
const dirLocais = path.join(RAIZ, 'locais')
fs.mkdirSync(dirLocais, { recursive: true })

fs.writeFileSync(path.join(dirLocais, 'index.html'), paginaIndice())
n++

for (const l of locais) {
  const d = path.join(dirLocais, l.slug)
  fs.mkdirSync(d, { recursive: true })
  fs.writeFileSync(path.join(d, 'index.html'), paginaLocal(l))
  n++
}

/* injeta o mesmo menu na home */
const home = path.join(RAIZ, 'index.html')
let h = fs.readFileSync(home, 'utf8')
const ini = '<!-- MENU:INICIO -->', fim = '<!-- MENU:FIM -->'
if (h.includes(ini) && h.includes(fim)) {
  h = h.slice(0, h.indexOf(ini) + ini.length) + '\n    ' + menu(0) + '\n    ' +
      h.slice(h.indexOf(fim))
  fs.writeFileSync(home, h)
  console.log('menu injetado na home')
} else {
  console.log('AVISO: marcadores MENU:INICIO/MENU:FIM nao encontrados na home')
}

/* sitemap */
const urls = [SITE + '/', SITE + '/locais/']
  .concat(locais.map(l => `${SITE}/locais/${l.slug}/`))
fs.writeFileSync(path.join(RAIZ, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n') +
  '\n</urlset>\n')

console.log(n + ' paginas geradas em locais/')
console.log('sitemap.xml com ' + urls.length + ' URLs')
