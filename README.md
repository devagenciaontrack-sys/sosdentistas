# SOS Dentistas 24 Horas — site

Reformulação do site da clínica (original em Wix: https://www.sosdentistas.com.br/).
Site estático: HTML, CSS e JavaScript, sem build e sem dependências.

Feito pela **On Track Agência Digital**.

## Arquivos

```
index.html             home
locais/index.html      índice "Onde atendemos"
locais/<bairro>/        21 páginas de região (geradas)
css/estilo.css         estilos
js/idiomas.js          dicionário PT/EN compartilhado
js/app.js              idioma, menu, mega-menu, formulário
assets/                logo, selo 24h, foto e imagem de compartilhamento
tools/locais.json      dados das regiões e da clínica
tools/gera-locais.cjs  gerador das páginas e do menu
sitemap.xml            gerado junto
.nojekyll              necessário no GitHub Pages
```

## Páginas de região

O site antigo tinha um menu suspenso com cerca de 30 itens numa lista
única, com repetições — "Dentista 24 horas Zona Sul" aparecia três vezes,
"Zona Leste" outras três. Aqui isso virou:

- um **mega-menu em três colunas** (Zona Sul, Zona Leste, Outras regiões);
- uma **página índice** em `/locais/`;
- **uma página por região**, 21 no total, cada uma com título, descrição,
  canonical e schema `Dentist` com `areaServed` próprios.

Cada página de região traz um botão que traça a rota no Google Maps **da
região até a clínica**, a lista "antes de sair de casa" e links para as
regiões vizinhas.

### Como mexer nas regiões

Edite `tools/locais.json` e rode da raiz do projeto:

```
node tools/gera-locais.cjs
```

Isso regrava as 22 páginas, injeta o menu na home entre os marcadores
`<!-- MENU:INICIO -->` e `<!-- MENU:FIM -->`, e refaz o `sitemap.xml`.
**Não edite o menu da home à mão** — ele é sobrescrito.

## Identidade

A paleta foi tirada da própria logo, amostrando os pixels:

| | |
|---|---|
| Teal | `#0E92AC` |
| Vermelho | `#C33C34` |
| Tinta | `#10232A` |

A logo foi recortada da arte em alta resolução do site original e teve o
fundo branco removido, gerando `assets/logo-sos.png` e `assets/selo-24h.png`
com transparência.

## Dois idiomas

O site abre em português. O botão PT/EN troca todo o texto e guarda a
escolha no `localStorage`. Visitante com navegador em inglês cai no inglês
na primeira visita.

Para mexer num texto, edite `js/idiomas.js` — a mesma chave existe nos dois
blocos, `pt` e `en`. No HTML, o elemento carrega `data-i18n="chave"`.

> O site original **não tinha** seletor de idioma. Todo o texto em inglês
> foi escrito por nós e deve ser revisto pelo cliente antes de divulgar.

## Formulário

Não há servidor. O formulário monta a mensagem e abre o WhatsApp
(`wa.me/5511945825999`) com o texto pronto. Nada é armazenado.

## Dados que vieram do site original

- Endereço: Av. Indianópolis, 1838 — Planalto Paulista, São Paulo/SP
- Telefones: (11) 5587-4809 e (11) 5585-3497
- WhatsApp: (11) 94582-5999
- Atendimento 24 horas, todos os dias
- Estacionamento gratuito e acesso para cadeirantes
- Especialidades: urgências 24h, implante, endodontia, lente de contato
  dental, ortodontia
- Convênios: Sul América Odonto, Porto Seguro, Odontoprev, Rede Unna,
  Bradesco Dental
- Instagram @sosdentistas24horas · Facebook SOSDentistas24Horas
- Razão social no rodapé: Instituto SOS Dentistas 24 Horas Carvalho & Machado

## Pendências — confirmar com o cliente antes de publicar no domínio

1. **MetLife.** Aparece um logotipo no site antigo, mas sem texto dizendo
   que é convênio atendido. **Foi deixado de fora.** Confirmar se entra.
2. **Seção "Quando vir sem pensar duas vezes".** Os seis casos de urgência
   são conteúdo clínico geral, escrito por nós — não vieram do site antigo.
   Pedir para um dentista da clínica revisar.
3. **Texto em inglês.** Tradução nossa, nunca existiu no site deles.
4. **Responsável técnico e CRO.** Não constam em lugar nenhum do site
   antigo. O Código de Ética Odontológica exige a identificação do
   cirurgião-dentista responsável e o número de inscrição no CRO em
   material de divulgação. **Isto precisa entrar antes de ir ao ar.**
5. **CNPJ e razão social completa** para o rodapé.
6. **Fotos reais da clínica.** Hoje só existe a foto genérica que eles já
   usavam. Fotos do consultório, da equipe e da recepção valem mais.
7. **"Mais de 12 anos" e "três unidades"** aparecem no site antigo. Não
   foram repetidos aqui porque não deu para confirmar. Confirmar e incluir.
8. **Analytics.** Nenhuma tag instalada. Definir GA4 e, se houver campanha,
   Google Ads.

## Alterações

Ao editar o CSS ou o JS, suba o número da versão no `index.html`:

```html
<link rel="stylesheet" href="css/estilo.css?v=1">   →  ?v=2
<script src="js/app.js?v=1">                        →  ?v=2
```

Sem isso, quem já visitou continua vendo a versão antiga em cache.

## Verificações feitas

- Sem rolagem horizontal em 57 larguras, de 320px a 1440px — testado na
  home, no índice de regiões e numa página de região
- Sem erro no console
- Troca PT/EN cobre todas as chaves nos dois idiomas
- Todas as imagens carregam
- Mapa do Google carrega e aponta para o endereço certo
- As 22 páginas têm title e canonical únicos, h1 e dicionário próprios
- Os 22 links do mega-menu respondem (nenhum 404)
