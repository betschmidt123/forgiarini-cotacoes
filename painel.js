/* Painel de cotações · Corretora Forgiarini
   Lê dados.json (atualizado todo dia útil) e desenha o painel em <div id="fg-cot" data-lang="pt|es|en">. */
(function () {
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/[^\/]*$/, '') : 'https://betschmidt123.github.io/forgiarini-cotacoes/';
  var CSS = "\
.fgc{--noite:#16281A;--lav:#2E4A2F;--broto:#D3E3A4;--grao:#F7F3EA;--ouro:#B8862B;--up:#9FD36B;--dn:#E8836B;--mono:'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace;--bg:#0F1C12;--card:#122016;--line:#2E4A2F;color:var(--grao);font-family:'Figtree',system-ui,sans-serif}\
.fgc *{box-sizing:border-box}\
.fgc .top{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap}\
.fgc .lab{font:700 13px/1 'Lato',sans-serif;letter-spacing:.16em;text-transform:uppercase;margin:0 0 14px;color:var(--ouro)}\
.fgc h2{font:300 40px/1.1 'Red Hat Display',sans-serif!important;margin:0;letter-spacing:-.01em;color:var(--grao)!important;text-transform:none}\
.fgc h3{font:400 26px/1.2 'Red Hat Display',sans-serif!important;color:var(--grao)!important;margin:56px 0 0;text-transform:none}\
.fgc .live{display:inline-flex;align-items:center;gap:8px;font:500 12px var(--mono);letter-spacing:.12em;color:var(--broto);border:1px solid var(--line);padding:8px 12px;border-radius:6px}\
.fgc .live i{width:8px;height:8px;border-radius:50%;background:var(--up);animation:fgcP 1.6s infinite}\
@keyframes fgcP{0%{box-shadow:0 0 0 0 rgba(159,211,107,.7)}70%{box-shadow:0 0 0 8px rgba(159,211,107,0)}100%{box-shadow:0 0 0 0 rgba(159,211,107,0)}}\
.fgc .tabs{display:flex;gap:4px;flex-wrap:wrap;margin-top:28px;border-bottom:1px solid var(--line)}\
.fgc .tabs button{all:unset;cursor:pointer;font:700 12px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:#A9B59A;padding:12px 16px;border-bottom:2px solid transparent;margin-bottom:-1px}\
.fgc .tabs button[aria-selected=true]{color:var(--broto);border-bottom-color:var(--broto)}.fgc .tabs button:hover{color:var(--grao)}\
.fgc .board{border:1px solid var(--line);border-top:0;border-radius:0 0 12px 12px;overflow:hidden;background:var(--card)}\
.fgc .hd,.fgc .row{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1.35fr) minmax(0,1fr);gap:20px;align-items:center;padding:15px 22px}\
.fgc .ct .hd,.fgc .ct .row{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,.9fr)}\
.fgc .hd{font:700 11px var(--mono);letter-spacing:.14em;text-transform:uppercase;color:#7F8C72;border-bottom:1px solid var(--line);background:var(--bg)}\
.fgc .row{border-bottom:1px solid #1E3322;font-family:var(--mono)}.fgc .row:last-child{border-bottom:0}.fgc .row:hover{background:#1A2E1E}.fgc .row.hl{background:#14261A}\
.fgc .grp{padding:10px 22px;font:700 11px var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ouro);background:var(--bg);border-bottom:1px solid #1E3322}\
.fgc .as b{display:block;font:700 14px var(--mono);color:var(--broto);letter-spacing:.06em}\
.fgc .as b a{color:var(--broto);text-decoration:none;border-bottom:1px dashed rgba(211,227,164,.5)}\
.fgc .as small{display:block;font:400 12.5px 'Figtree',sans-serif;color:#A9B59A;margin-top:2px}\
.fgc .flag{display:inline-block;min-width:26px;font:700 10.5px var(--mono);color:var(--noite);background:var(--broto);border-radius:4px;padding:2px 5px;margin-right:8px;text-align:center}\
.fgc .q{display:flex;align-items:center;gap:12px;flex-wrap:wrap}\
.fgc .v{font-size:21px;color:var(--grao);font-weight:500;letter-spacing:-.01em}\
.fgc .chip{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:6px;font-weight:700;font-size:12.5px}\
.fgc .chip.up{color:var(--up);background:rgba(159,211,107,.12)}.fgc .chip.dn{color:var(--dn);background:rgba(232,131,107,.12)}.fgc .chip.nt{color:#C9D4B5;background:rgba(201,212,181,.08)}\
.fgc .nota{display:block;width:100%;font:400 12px var(--mono);color:#A9B59A}\
.fgc .ref{font-size:12.5px;color:#A9B59A;line-height:1.5}.fgc .ref em{font-style:normal;color:#7F8C72;display:block}\
.fgc .foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:14px;font:400 12px var(--mono);color:#7F8C72}.fgc .foot a{color:var(--broto)}\
.fgc .read{margin-top:24px;font-size:16px;line-height:1.6;color:#D9DECF}.fgc .read strong{color:var(--grao)}\
.fgc .hint{font:400 13.5px 'Figtree',sans-serif;color:#A9B59A;margin:8px 0 0;max-width:760px}\
.fgc .chartbox{margin-top:24px;border:1px solid var(--line);border-radius:12px;background:var(--card);padding:22px 22px 14px}\
.fgc .chartbox .cth{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}\
.fgc .chartbox .cth b{display:block;font:700 13px var(--mono);letter-spacing:.08em;color:var(--broto)}\
.fgc .chartbox .cth span{font:400 12.5px 'Figtree',sans-serif;color:#A9B59A}\
.fgc .big{font:500 32px var(--mono);color:var(--grao);text-align:right}.fgc .big small{display:block;font-size:12.5px;font-weight:700}\
.fgc .cw{position:relative}.fgc svg.rs{width:100%;display:block;margin-top:10px;overflow:visible}.fgc svg.rs text{font:400 11px var(--mono);fill:#7F8C72}\
.fgc .tip{position:absolute;pointer-events:none;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:6px 9px;font:500 12px var(--mono);color:var(--grao);white-space:nowrap;transform:translate(-50%,-120%);display:none}\
.fgc .src{font:400 11.5px var(--mono);color:#7F8C72;margin-top:6px}\
@media (max-width:760px){.fgc .hd{display:none}.fgc .row,.fgc .ct .row{grid-template-columns:1fr;row-gap:8px}.fgc .ref em{display:inline;margin-left:6px}.fgc h2{font-size:30px}.fgc .big{text-align:left}}";

  var T = {
    pt: {lab: 'Painel do arroz', h: 'Cotações do arroz hoje', at: 'ATUALIZADO', ativo: 'Ativo', ult: 'Último · variação', df: 'Data · fonte', contrato: 'Contrato', fech: 'Fechamento', var: 'Variação', orig: 'Origem', preco: 'Preço', dia: 'no dia', aviso: 'Valores de referência de mercado. Não são oferta da Corretora Forgiarini.', cme: 'Ver pregão do arroz na Bolsa de Chicago ↗', leitura: 'Leitura do dia.', g: 'Gráficos', gh: 'O arroz em casca no RS, com o histórico oficial do Cepea, e os gráficos ao vivo de Chicago e do câmbio.', rs: 'ARROZ EM CASCA · RS', rss: 'Indicador Cepea/Esalq · R$ por saca de 50 kg', pr: 'pregões', srcs: 'Fonte: Cepea/Esalq. O histórico cresce a cada atualização diária.', erro: 'Não foi possível carregar as cotações agora. Tente recarregar a página.', em: 'em'},
    es: {lab: 'Panel del arroz', h: 'Cotizaciones del arroz hoy', at: 'ACTUALIZADO', ativo: 'Activo', ult: 'Último · variación', df: 'Fecha · fuente', contrato: 'Contrato', fech: 'Cierre', var: 'Variación', orig: 'Origen', preco: 'Precio', dia: 'en el día', aviso: 'Valores de referencia de mercado. No son oferta de Corretora Forgiarini.', cme: 'Ver la rueda del arroz en la Bolsa de Chicago ↗', leitura: 'Lectura del día.', g: 'Gráficos', gh: 'El arroz con cáscara en Rio Grande do Sul, con el histórico oficial del Cepea, y los gráficos en vivo de Chicago y del tipo de cambio.', rs: 'ARROZ CON CÁSCARA · RS', rss: 'Indicador Cepea/Esalq · R$ por bolsa de 50 kg', pr: 'ruedas', srcs: 'Fuente: Cepea/Esalq. El histórico crece con cada actualización diaria.', erro: 'No fue posible cargar las cotizaciones ahora. Intente recargar la página.', em: 'en'},
    en: {lab: 'Rice dashboard', h: 'Rice prices today', at: 'UPDATED', ativo: 'Asset', ult: 'Last · change', df: 'Date · source', contrato: 'Contract', fech: 'Settle', var: 'Change', orig: 'Origin', preco: 'Price', dia: 'd/d', aviso: 'Market reference values. Not an offer from Corretora Forgiarini.', cme: 'See the rice market on the Chicago exchange ↗', leitura: 'Today\'s read.', g: 'Charts', gh: 'Paddy rice in Rio Grande do Sul, with official Cepea history, plus live Chicago and currency charts.', rs: 'PADDY RICE · RS', rss: 'Cepea/Esalq indicator · R$ per 50 kg sack', pr: 'sessions', srcs: 'Source: Cepea/Esalq. The history grows with every daily update.', erro: 'Prices could not be loaded right now. Please reload the page.', em: 'over'}
  };

  function L(x, lang) { return (x && typeof x === 'object' && !Array.isArray(x)) ? (x[lang] || x.pt || '') : (x == null ? '' : x); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
  function num(v, dec, lang) {
    var loc = lang === 'en' ? 'en-US' : (lang === 'es' ? 'es-PY' : 'pt-BR');
    return Number(v).toLocaleString(loc, {minimumFractionDigits: dec, maximumFractionDigits: dec});
  }
  function valor(it, lang) {
    var d = it.dec == null ? 2 : it.dec;
    var n = Array.isArray(it.v) ? num(it.v[0], d, lang) + '–' + num(it.v[1], d, lang) : num(it.v, d, lang);
    return (it.aprox ? '≈ ' : '') + L(it.pre, lang) + n + L(it.suf, lang);
  }
  function chip(it, lang, t) {
    if (it.chip) return '<span class="chip ' + (it.tom || 'nt') + '">' + esc(L(it.chip, lang)) + '</span>';
    if (typeof it.var === 'number') {
      var up = it.var >= 0;
      var base = it.base ? ' ' + L(it.base, lang) : '';
      return '<span class="chip ' + (up ? 'up' : 'dn') + '">' + (up ? '▲ ' : '▼ ') + Math.abs(it.var).toLocaleString(lang === 'en' ? 'en-US' : (lang === 'es' ? 'es-PY' : 'pt-BR'), {minimumFractionDigits: 1, maximumFractionDigits: 2}) + '%' + esc(base) + '</span>';
    }
    return '';
  }
  function linha(it, lang, t, modo) {
    var tk = esc(L(it.tk, lang));
    if (it.link) tk = '<a href="' + esc(it.link) + '" target="_blank" rel="noopener">' + tk + ' ↗</a>';
    var flag = it.flag ? '<span class="flag">' + esc(it.flag) + '</span>' : '';
    var as = '<span class="as"><b>' + flag + tk + '</b><small>' + esc(L(it.sub, lang)) + '</small></span>';
    var ref = '<span class="ref">' + esc(L(it.data, lang)) + '<em>' + esc(L(it.fonte, lang)) + '</em></span>';
    var cls = 'row' + (it.destaque ? ' hl' : '');
    if (modo === 'contratos') return '<div class="' + cls + '">' + as + '<span class="v">' + valor(it, lang) + '</span><span>' + chip(it, lang, t) + '</span>' + ref + '</div>';
    var nota = it.nota ? '<span class="nota">' + esc(L(it.nota, lang)) + '</span>' : '';
    return '<div class="' + cls + '">' + as + '<span class="q"><span class="v">' + valor(it, lang) + '</span>' + chip(it, lang, t) + nota + '</span>' + ref + '</div>';
  }
  function tabela(aba, lang, t) {
    var ct = aba.colunas === 'contratos';
    var hd = ct ? [t.contrato, t.fech, t.var, t.df] : (aba.grupos ? [t.orig, t.preco, t.df] : [t.ativo, t.ult, t.df]);
    var h = '<div class="board' + (ct ? ' ct' : '') + '"><div class="hd">' + hd.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>';
    if (aba.grupos) aba.grupos.forEach(function (g) { h += '<div class="grp">' + esc(L(g.titulo, lang)) + '</div>' + g.itens.map(function (it) { return linha(it, lang, t, aba.colunas); }).join(''); });
    else h += aba.itens.map(function (it) { return linha(it, lang, t, aba.colunas); }).join('');
    return h + '</div>';
  }
  function dataBr(iso, lang) { var p = iso.split('-'); return lang === 'en' ? p[1] + '/' + p[2] : p[2] + '/' + p[1]; }
  function grafico(box, serie, lang, t) {
    var svg = box.querySelector('svg.rs'), tip = box.querySelector('.tip');
    var D = serie.slice(-60);
    function draw() {
      var W = Math.max(300, svg.clientWidth || box.clientWidth || 900), H = W < 500 ? 220 : 260, Lm = W < 500 ? 44 : 56, R = 12, Tm = 16, B = 30;
      var vals = D.map(function (d) { return d[1]; }), mn = Math.floor(Math.min.apply(0, vals) - 0.5), mx = Math.ceil(Math.max.apply(0, vals) + 0.5);
      var step = Math.max(1, Math.ceil(D.length / (W < 500 ? 3 : 6)));
      function x(i) { return Lm + i * (W - Lm - R) / Math.max(1, D.length - 1); }
      function y(v) { return Tm + (mx - v) / (mx - mn) * (H - Tm - B); }
      var h = '';
      for (var k = 0; k <= 4; k++) { var v = mn + (mx - mn) * k / 4, yy = y(v); h += '<line x1="' + Lm + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '" stroke="#1E3322"/><text x="' + (Lm - 8) + '" y="' + (yy + 4) + '" text-anchor="end">' + num(v, 2, lang) + '</text>'; }
      D.forEach(function (d, i) { if ((i % step === 0 && D.length - 1 - i >= Math.ceil(step / 2) + 1) || i === D.length - 1) h += '<text x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + dataBr(d[0], lang) + '</text>'; });
      var line = D.map(function (d, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(d[1]).toFixed(1); }).join(' ');
      h += '<defs><linearGradient id="fgcg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9FD36B" stop-opacity=".28"/><stop offset="1" stop-color="#9FD36B" stop-opacity="0"/></linearGradient></defs>';
      h += '<path d="' + line + ' L' + x(D.length - 1) + ' ' + (H - B) + ' L' + x(0) + ' ' + (H - B) + 'Z" fill="url(#fgcg)"/><path d="' + line + '" fill="none" stroke="#9FD36B" stroke-width="2.2"/>';
      var bw = (W - Lm - R) / Math.max(1, D.length - 1);
      D.forEach(function (d, i) { var last = i === D.length - 1; h += '<circle cx="' + x(i) + '" cy="' + y(d[1]) + '" r="' + (last ? 5 : (D.length > 30 ? 0 : 3)) + '" fill="' + (last ? '#D3E3A4' : '#9FD36B') + '"/><rect x="' + (x(i) - bw / 2) + '" y="' + Tm + '" width="' + bw + '" height="' + (H - Tm - B) + '" fill="transparent" data-i="' + i + '"/>'; });
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.style.height = H + 'px'; svg.innerHTML = h;
      svg.querySelectorAll('rect').forEach(function (r) {
        r.addEventListener('mouseenter', function () { var i = +r.getAttribute('data-i'); tip.style.display = 'block'; tip.textContent = dataBr(D[i][0], lang) + ' · R$ ' + num(D[i][1], 2, lang); tip.style.left = (x(i) / W * svg.getBoundingClientRect().width) + 'px'; tip.style.top = (y(D[i][1]) / H * svg.getBoundingClientRect().height) + 'px'; });
        r.addEventListener('mouseleave', function () { tip.style.display = 'none'; });
      });
    }
    draw(); var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(draw, 150); });
    var first = D[0][1], last = D[D.length - 1][1], ch = (last - first) / first * 100;
    var big = box.querySelector('.big');
    big.innerHTML = 'R$ ' + num(last, 2, lang) + '<small style="color:' + (ch >= 0 ? '#9FD36B' : '#E8836B') + '">' + (ch >= 0 ? '▲ ' : '▼ ') + num(Math.abs(ch), 2, lang) + '% ' + t.em + ' ' + D.length + ' ' + t.pr + '</small>';
  }
  function render(el, d) {
    var lang = (el.getAttribute('data-lang') || 'pt').slice(0, 2); if (!T[lang]) lang = 'pt';
    var t = T[lang];
    var abas = d.abas.slice();
    if (lang === 'es') abas.sort(function (a, b) { return (b.id === 'mundo') - (a.id === 'mundo'); });
    var at = d.atualizado.split('-'); var atTxt = at[2] + '/' + at[1] + '/' + at[0];
    var h = '<div class="top"><div><p class="lab">' + esc(t.lab) + '</p><h2>' + esc(t.h) + '</h2></div><span class="live"><i></i>' + t.at + ' ' + atTxt + '</span></div>';
    h += '<div class="tabs" role="tablist">' + abas.map(function (a, i) { return '<button role="tab" aria-selected="' + (i === 0) + '" data-p="' + a.id + '">' + esc(L(a.titulo, lang)) + '</button>'; }).join('') + '</div>';
    h += abas.map(function (a, i) { return '<div class="pane" data-id="' + a.id + '"' + (i ? ' hidden' : '') + '>' + tabela(a, lang, t) + '</div>'; }).join('');
    h += '<div class="foot"><span>' + esc(t.aviso) + '</span><span><a href="https://www.cmegroup.com/markets/agriculture/grains/rough-rice.html" target="_blank" rel="noopener">' + esc(t.cme) + '</a></span></div>';
    h += '<p class="read"><strong>' + esc(t.leitura) + '</strong> ' + esc(L(d.leitura, lang)) + '</p>';
    if (d.serie_rs && d.serie_rs.length > 1) {
      h += '<h3>' + esc(t.g) + '</h3><p class="hint">' + esc(t.gh) + '</p><div class="chartbox"><div class="cth"><div><b>' + esc(t.rs) + '</b><span>' + esc(t.rss) + '</span></div><div class="big"></div></div><div class="cw"><svg class="rs"></svg><div class="tip"></div></div><p class="src">' + esc(t.srcs) + '</p></div>';
    }
    el.classList.add('fgc'); el.innerHTML = h;
    el.querySelectorAll('.tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        el.querySelectorAll('.tabs button').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        b.setAttribute('aria-selected', 'true');
        el.querySelectorAll('.pane').forEach(function (p) { p.hidden = p.getAttribute('data-id') !== b.getAttribute('data-p'); });
      });
    });
    if (d.serie_rs && d.serie_rs.length > 1) grafico(el.querySelector('.chartbox'), d.serie_rs, lang, t);
  }

  /* Quadros ao vivo (TradingView). Arroz de Chicago não tem cotação gratuita ao vivo: fica no painel semanal.
     Grãos de Chicago via contratos que acompanham a bolsa (CFD Capital.com). */
  var TV = {
    pt: {loc: 'br', g: ['Grãos (Chicago)', 'B3', 'Câmbio', 'Índices'], n: {soja: 'Soja (Chicago)', milho: 'Milho (Chicago)', trigo: 'Trigo (Chicago)', farelo: 'Farelo de soja (Chicago)', ccm: 'Milho B3', sjc: 'Soja B3 (US$/saca)', bgi: 'Boi gordo B3', dol: 'Dólar futuro B3', brl: 'Dólar / Real', pyg: 'Dólar / Guarani', ars: 'Dólar / Peso argentino', uyu: 'Dólar / Peso uruguaio', dxy: 'Índice do dólar (DXY)', ibov: 'Ibovespa', spx: 'S&P 500', brent: 'Petróleo Brent'}},
    es: {loc: 'es', g: ['Granos (Chicago)', 'B3 (Brasil)', 'Tipo de cambio', 'Índices'], n: {soja: 'Soja (Chicago)', milho: 'Maíz (Chicago)', trigo: 'Trigo (Chicago)', farelo: 'Harina de soja (Chicago)', ccm: 'Maíz B3', sjc: 'Soja B3 (US$/bolsa)', bgi: 'Novillo B3', dol: 'Dólar futuro B3', brl: 'Dólar / Real', pyg: 'Dólar / Guaraní', ars: 'Dólar / Peso argentino', uyu: 'Dólar / Peso uruguayo', dxy: 'Índice del dólar (DXY)', ibov: 'Ibovespa', spx: 'S&P 500', brent: 'Petróleo Brent'}},
    en: {loc: 'en', g: ['Grains (Chicago)', 'B3 (Brazil)', 'Currencies', 'Indices'], n: {soja: 'Soybeans (Chicago)', milho: 'Corn (Chicago)', trigo: 'Wheat (Chicago)', farelo: 'Soybean meal (Chicago)', ccm: 'Corn B3', sjc: 'Soybeans B3 (US$/bag)', bgi: 'Live cattle B3', dol: 'Dollar futures B3', brl: 'USD / BRL', pyg: 'USD / PYG', ars: 'USD / ARS', uyu: 'USD / UYU', dxy: 'US Dollar Index (DXY)', ibov: 'Ibovespa', spx: 'S&P 500', brent: 'Brent crude'}}
  };
  var SYM = {soja: 'CAPITALCOM:SOYBEAN', milho: 'CAPITALCOM:CORN', trigo: 'CAPITALCOM:WHEAT', farelo: 'CAPITALCOM:SOYBEANMEAL', ccm: 'BMFBOVESPA:CCM1!', sjc: 'BMFBOVESPA:SJC1!', bgi: 'BMFBOVESPA:BGI1!', dol: 'BMFBOVESPA:DOL1!', brl: 'FX_IDC:USDBRL', pyg: 'FX_IDC:USDPYG', ars: 'FX_IDC:USDARS', uyu: 'FX_IDC:USDUYU', dxy: 'CAPITALCOM:DXY', ibov: 'BMFBOVESPA:IBOV', spx: 'FOREXCOM:SPXUSD', brent: 'TVC:UKOIL'};
  function tvCfg(kind, lang) {
    var t = TV[lang] || TV.pt, n = t.n;
    function s(k) { return {name: SYM[k], displayName: n[k]}; }
    if (kind === 'tape') return {symbols: ['soja', 'milho', 'trigo', 'brl', 'pyg', 'ccm', 'bgi', 'ibov'].map(function (k) { return {proName: SYM[k], title: n[k]}; }), showSymbolLogo: false, isTransparent: true, displayMode: 'adaptive', colorTheme: 'dark', locale: t.loc, width: '100%', height: 46};
    if (kind === 'overview') return {symbols: ['soja', 'milho', 'trigo', 'brl', 'pyg', 'ccm'].map(function (k) { return [n[k], SYM[k] + '|3M']; }), chartOnly: false, width: '100%', height: '100%', locale: t.loc, colorTheme: 'dark', autosize: true, showVolume: false, hideDateRanges: false, scalePosition: 'right', scaleMode: 'Normal', fontSize: '11', noTimeScale: false, valuesTracking: '1', changeMode: 'price-and-percent', chartType: 'area', lineWidth: 2, lineType: 0, dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'], isTransparent: true, lineColor: '#9FD36B', topColor: 'rgba(159,211,107,0.25)', bottomColor: 'rgba(159,211,107,0)'};
    return {width: '100%', height: '100%', symbolsGroups: [
      {name: t.g[0], symbols: ['soja', 'milho', 'trigo', 'farelo'].map(s)},
      {name: t.g[1], symbols: ['ccm', 'sjc', 'bgi', 'dol'].map(s)},
      {name: t.g[2], symbols: ['brl', 'pyg', 'ars', 'uyu', 'dxy'].map(s)},
      {name: t.g[3], symbols: ['ibov', 'spx', 'brent'].map(s)}], showSymbolLogo: false, isTransparent: true, colorTheme: 'dark', locale: t.loc};
  }
  function tvMount(lang) {
    var types = {tape: 'ticker-tape', overview: 'symbol-overview', quotes: 'market-quotes'};
    var kinds = {'ticker-tape': 'tape', 'symbol-overview': 'overview', 'market-quotes': 'quotes'};
    document.querySelectorAll('[data-tv], .tradingview-widget-container').forEach(function (box) {
      var kind = box.getAttribute('data-tv');
      if (!kind) { var sc = box.querySelector('script[src*="embed-widget-"]'), m = sc && sc.src.match(/embed-widget-([a-z-]+)\.js/); kind = m && kinds[m[1]]; }
      if (!types[kind] || box.getAttribute('data-fgtv')) return;
      box.setAttribute('data-fgtv', '1');
      var cfg = tvCfg(kind, lang);
      var f = document.createElement('iframe');
      f.src = 'https://s.tradingview.com/embed-widget/' + types[kind] + '/?locale=' + encodeURIComponent(cfg.locale) + '#' + encodeURIComponent(JSON.stringify(cfg));
      f.setAttribute('frameborder', '0'); f.setAttribute('allowtransparency', 'true'); f.setAttribute('scrolling', 'no'); f.setAttribute('loading', kind === 'tape' ? 'eager' : 'lazy'); f.title = types[kind];
      f.style.cssText = 'width:100%;height:' + (kind === 'tape' ? '46px' : '100%') + ';border:0;display:block;background:transparent';
      box.innerHTML = ''; box.appendChild(f);
    });
  }
  function start() {
    var el0 = document.getElementById('fg-cot'); tvMount(el0 ? (el0.getAttribute('data-lang') || 'pt').slice(0, 2) : 'pt');
    var el = document.getElementById('fg-cot'); if (!el) return;
    if (!document.getElementById('fgc-css')) { var s = document.createElement('style'); s.id = 'fgc-css'; s.textContent = CSS; document.head.appendChild(s); }
    var url = BASE + 'dados.json?v=' + Math.floor(Date.now() / 300000);
    fetch(url, {cache: 'no-cache'}).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { render(el, d); })
      .catch(function () { var lang = (el.getAttribute('data-lang') || 'pt').slice(0, 2); el.classList.add('fgc'); el.innerHTML = '<p class="read">' + esc((T[lang] || T.pt).erro) + '</p>'; });
  }
  if (document.readyState !== 'loading') start(); else document.addEventListener('DOMContentLoaded', start);
})();
