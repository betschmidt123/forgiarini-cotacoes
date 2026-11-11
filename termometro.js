/* Termômetro do Arroz · Corretora Forgiarini
   Desenha a enquete dentro de <div id="fg-termo" data-lang="pt|es|en"></div>.
   Votos ficam no Supabase (projeto termometro-arroz). */
(function () {
  var SB_URL = 'https://gwbxzscutlgjosewsayj.supabase.co';
  var SB_KEY = 'sb_publishable_i6yPmMKHOJvBMJWfhyncig_jh7feOQe';
  var LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/dist/umd/supabase.min.js';

  var T = {
    pt: {open: 'Perguntas abertas', all: 'Todas', cats: {preco: 'Preço', safra: 'Safra', cambio: 'Câmbio', paraguai: 'Paraguai'},
      until: 'Fecha em', yes: 'SIM', no: 'NÃO', sim: 'Sim', votes: function (n) { return n === 1 ? '1 voto' : fmt(n) + ' votos'; },
      first: 'Seja o primeiro a votar', resolves: 'Resolve por', week: ' pts em 7 dias',
      voted: function (o, d) { return '✓ Seu voto: ' + o + '. Você pode mudar até ' + d + '.'; },
      closedVote: 'Votação encerrada. Aguardando o dado oficial.', err: 'Não deu para registrar agora. Tente de novo em instantes.', saving: 'Registrando…',
      closed: 'Encerradas', h: ['Pergunta', 'Mercado dizia', 'Resultado', 'Fonte'], happened: '✓ ACONTECEU', didnt: '✕ NÃO ACONTECEU',
      noneClosed: 'As primeiras perguntas fecham em breve. Os resultados aparecem aqui, conferidos com o dado oficial.',
      rank: 'Quem mais acerta', rankEmpty: 'O ranking começa quando as primeiras perguntas forem encerradas. Entre agora para aparecer nele.',
      joinT: 'Entre no ranking', joinP: 'Escolha um apelido para registrar seus acertos. O contato é opcional e não aparece no site.',
      nick: 'Apelido (3 a 24 letras ou números)', contact: 'WhatsApp ou e-mail (opcional)', ok: 'Aceito receber contato da Corretora Forgiarini', joinB: 'Salvar apelido',
      joined: function (a) { return '✓ Você está no ranking como ' + a + '.'; }, taken: 'Esse apelido já está em uso. Tente outro.', bad: 'Use de 3 a 24 letras, números, espaço, ponto, hífen ou _.',
      ctaT: 'Quer um preço firme?', ctaP: 'O termômetro mostra a expectativa do mercado. Para vender ou comprar seu lote, fale com a corretora.', ctaB: 'Pedir cotação', ctaL: '/contato',
      note: 'O Termômetro do Arroz é uma enquete de opinião, sem apostas e sem dinheiro envolvido. As perguntas são resolvidas com dados oficiais (Cepea/Esalq, Irga, Conab, Banco Central e entidades do Paraguai). Os percentuais refletem os votos dos visitantes e não são previsão nem oferta da Corretora Forgiarini.',
      loading: 'Carregando o termômetro…', fail: 'O termômetro não carregou. Recarregue a página em instantes.', loc: 'pt-BR'},
    es: {open: 'Preguntas abiertas', all: 'Todas', cats: {preco: 'Precio', safra: 'Zafra', cambio: 'Cambio', paraguai: 'Paraguay'},
      until: 'Cierra el', yes: 'SÍ', no: 'NO', sim: 'Sí', votes: function (n) { return n === 1 ? '1 voto' : fmt(n) + ' votos'; },
      first: 'Sé el primero en votar', resolves: 'Se resuelve con', week: ' pts en 7 días',
      voted: function (o, d) { return '✓ Tu voto: ' + o + '. Puedes cambiarlo hasta el ' + d + '.'; },
      closedVote: 'Votación cerrada. Esperando el dato oficial.', err: 'No se pudo registrar ahora. Intenta de nuevo en unos instantes.', saving: 'Registrando…',
      closed: 'Cerradas', h: ['Pregunta', 'El mercado decía', 'Resultado', 'Fuente'], happened: '✓ OCURRIÓ', didnt: '✕ NO OCURRIÓ',
      noneClosed: 'Las primeras preguntas cierran pronto. Los resultados aparecen aquí, verificados con el dato oficial.',
      rank: 'Quién acierta más', rankEmpty: 'El ranking empieza cuando cierren las primeras preguntas. Entra ahora para aparecer.',
      joinT: 'Entra al ranking', joinP: 'Elige un apodo para registrar tus aciertos. El contacto es opcional y no aparece en el sitio.',
      nick: 'Apodo (3 a 24 letras o números)', contact: 'WhatsApp o e-mail (opcional)', ok: 'Acepto ser contactado por Corretora Forgiarini', joinB: 'Guardar apodo',
      joined: function (a) { return '✓ Estás en el ranking como ' + a + '.'; }, taken: 'Ese apodo ya está en uso. Prueba otro.', bad: 'Usa de 3 a 24 letras, números, espacio, punto, guion o _.',
      ctaT: '¿Quieres un precio firme?', ctaP: 'El termómetro muestra la expectativa del mercado. Para vender o comprar tu lote, habla con la corredora.', ctaB: 'Pedir cotización', ctaL: '/es/contacto',
      note: 'El Termómetro del Arroz es una encuesta de opinión, sin apuestas y sin dinero involucrado. Las preguntas se resuelven con datos oficiales (Cepea/Esalq, Irga, Conab, Banco Central de Brasil y entidades de Paraguay). Los porcentajes reflejan los votos de los visitantes y no son previsión ni oferta de Corretora Forgiarini.',
      loading: 'Cargando el termómetro…', fail: 'El termómetro no cargó. Recarga la página en unos instantes.', loc: 'es-PY'},
    en: {open: 'Open questions', all: 'All', cats: {preco: 'Price', safra: 'Crop', cambio: 'FX', paraguai: 'Paraguay'},
      until: 'Closes', yes: 'YES', no: 'NO', sim: 'Yes', votes: function (n) { return n === 1 ? '1 vote' : fmt(n) + ' votes'; },
      first: 'Be the first to vote', resolves: 'Resolved by', week: ' pts in 7 days',
      voted: function (o, d) { return '✓ Your vote: ' + o + '. You can change it until ' + d + '.'; },
      closedVote: 'Voting closed. Waiting for the official figure.', err: 'Could not save right now. Please try again shortly.', saving: 'Saving…',
      closed: 'Resolved', h: ['Question', 'Market said', 'Result', 'Source'], happened: '✓ HAPPENED', didnt: '✕ DID NOT HAPPEN',
      noneClosed: 'The first questions close soon. Results will appear here, checked against the official figure.',
      rank: 'Top forecasters', rankEmpty: 'The leaderboard starts when the first questions close. Join now to be on it.',
      joinT: 'Join the leaderboard', joinP: 'Pick a nickname to track your hits. Contact details are optional and never shown on the site.',
      nick: 'Nickname (3 to 24 letters or numbers)', contact: 'WhatsApp or e-mail (optional)', ok: 'I agree to be contacted by Corretora Forgiarini', joinB: 'Save nickname',
      joined: function (a) { return '✓ You are on the leaderboard as ' + a + '.'; }, taken: 'That nickname is taken. Try another one.', bad: 'Use 3 to 24 letters, numbers, space, dot, hyphen or _.',
      ctaT: 'Need a firm price?', ctaP: 'The thermometer shows market expectations. To sell or buy your lot, talk to the brokerage.', ctaB: 'Request a quote', ctaL: '/en/contact',
      note: 'The Rice Thermometer is an opinion poll, with no betting and no money involved. Questions are resolved with official data (Cepea/Esalq, Irga, Conab, Central Bank of Brazil and Paraguayan bodies). Percentages reflect visitor votes and are neither a forecast nor an offer from Corretora Forgiarini.',
      loading: 'Loading the thermometer…', fail: 'The thermometer did not load. Please reload the page shortly.', loc: 'en-US'}
  };

  var CSS = "#fg-termo{--noite:#16281A;--lav:#2E4A2F;--broto:#D3E3A4;--grao:#F7F3EA;--ouro:#B8862B;--up:#9FD36B;--dn:#E8836B;--mono:'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace;--bg:#0F1C12;--card:#122016;--line:#2E4A2F;--mut:#A9B59A;--dim:#7F8C72;background:var(--bg);color:var(--grao);font-family:'Figtree',system-ui,sans-serif;padding:8px 0 8px}" +
    "#fg-termo *{box-sizing:border-box}#fg-termo [hidden]{display:none!important}#fg-termo .w{max-width:1100px;margin:0 auto;padding:0 24px}" +
    "#fg-termo .bar-top{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin:44px 0 18px}" +
    "#fg-termo .bar-top h2{font:400 26px/1.2 'Red Hat Display',sans-serif;margin:0;color:var(--grao)}" +
    "#fg-termo .filters{display:flex;gap:6px;flex-wrap:wrap}" +
    "#fg-termo .filters button{all:unset;cursor:pointer;font:700 11px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--mut);border:1px solid var(--line);padding:8px 12px;border-radius:999px}" +
    "#fg-termo .filters button.on{background:var(--broto);color:var(--noite);border-color:var(--broto)}" +
    "#fg-termo .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}" +
    "#fg-termo .q{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:14px;transition:border-color .2s}" +
    "#fg-termo .q:hover{border-color:#456B46}" +
    "#fg-termo .meta{display:flex;justify-content:space-between;gap:10px;font:500 11.5px var(--mono);letter-spacing:.08em;color:var(--dim);text-transform:uppercase}#fg-termo .meta .cat{color:var(--broto)}" +
    "#fg-termo .q h3{font:500 20px/1.3 'Red Hat Display',sans-serif;margin:0;color:var(--grao)}" +
    "#fg-termo .prob{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}#fg-termo .prob b{font:500 40px/1 var(--mono);color:var(--up)}#fg-termo .prob span{font:400 13px var(--mono);color:var(--mut)}" +
    "#fg-termo .prob .chg{margin-left:auto;font:700 12px var(--mono);padding:4px 8px;border-radius:6px}" +
    "#fg-termo .chg.up{color:var(--up);background:rgba(159,211,107,.12)}#fg-termo .chg.dn{color:var(--dn);background:rgba(232,131,107,.12)}#fg-termo .chg.nt{color:#C9D4B5;background:rgba(201,212,181,.08)}" +
    "#fg-termo .meter{height:8px;background:rgba(232,131,107,.35);border-radius:4px;overflow:hidden}#fg-termo .meter.e{background:#1E3322}#fg-termo .meter i{display:block;height:100%;background:var(--up);border-radius:4px;transition:width .5s ease}" +
    "#fg-termo svg.spark{width:100%;height:46px;display:block}" +
    "#fg-termo .btns{display:grid;grid-template-columns:1fr 1fr;gap:10px}" +
    "#fg-termo .btns button{all:unset;cursor:pointer;text-align:center;font:700 14px var(--mono);letter-spacing:.06em;padding:13px 10px;border-radius:9px;transition:transform .15s,background .2s}" +
    "#fg-termo .btns .y{background:rgba(159,211,107,.14);color:var(--up);border:1px solid rgba(159,211,107,.35)}" +
    "#fg-termo .btns .n{background:rgba(232,131,107,.12);color:var(--dn);border:1px solid rgba(232,131,107,.35)}" +
    "#fg-termo .btns button:hover{transform:translateY(-1px)}#fg-termo .btns button.sel{outline:2px solid currentColor;outline-offset:2px}" +
    "#fg-termo .btns button[disabled]{cursor:default;opacity:.55;transform:none}" +
    "#fg-termo .foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font:400 12px var(--mono);color:var(--dim)}#fg-termo .foot a{color:var(--broto)}" +
    "#fg-termo .voted{font:500 12.5px var(--mono);color:var(--broto);min-height:18px}#fg-termo .voted.er{color:var(--dn)}" +
    "#fg-termo .res{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}" +
    "#fg-termo .res .r{display:grid;grid-template-columns:minmax(0,2fr) 130px 160px minmax(0,1fr);gap:16px;align-items:center;padding:16px 22px;border-bottom:1px solid #1E3322;font-family:var(--mono);font-size:14px;color:var(--grao)}" +
    "#fg-termo .res .r:last-child{border-bottom:0}#fg-termo .res .hd{font:700 11px var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--dim);background:var(--bg)}" +
    "#fg-termo .res .src{color:var(--dim);font-size:12.5px}#fg-termo .empty{padding:22px;color:var(--mut);font-size:15px;line-height:1.55}" +
    "#fg-termo .st{display:inline-block;padding:4px 9px;border-radius:6px;font-weight:700;font-size:12px}#fg-termo .st.y{color:var(--up);background:rgba(159,211,107,.12)}#fg-termo .st.n{color:var(--dn);background:rgba(232,131,107,.12)}" +
    "#fg-termo .cols{display:grid;grid-template-columns:1.4fr 1fr;gap:18px;align-items:start}" +
    "#fg-termo .rank{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:8px 0}" +
    "#fg-termo .rank .r{display:grid;grid-template-columns:36px 1fr auto;gap:12px;align-items:center;padding:12px 22px;font-family:var(--mono);font-size:14px;border-bottom:1px solid #1E3322;color:var(--grao)}" +
    "#fg-termo .rank .r:last-child{border-bottom:0}#fg-termo .rank .pos{color:var(--ouro);font-weight:700}#fg-termo .rank .pct{color:var(--up);font-weight:700}" +
    "#fg-termo .join{background:var(--lav);border-radius:14px;padding:24px}#fg-termo .join+.join{margin-top:18px;background:var(--card);border:1px solid var(--line)}" +
    "#fg-termo .join h4{font:500 18px 'Red Hat Display',sans-serif;margin:0 0 6px;color:var(--grao)}#fg-termo .join p{margin:0;color:#D9DECF;font-size:14.5px;line-height:1.55}" +
    "#fg-termo .join input[type=text]{width:100%;margin-top:12px;background:#0F1C12;border:1px solid #456B46;border-radius:8px;color:var(--grao);font:400 15px 'Figtree',sans-serif;padding:11px 12px}" +
    "#fg-termo .join input[type=text]:focus{outline:2px solid var(--broto);outline-offset:1px}" +
    "#fg-termo .join label{display:flex;gap:8px;align-items:flex-start;margin-top:12px;font-size:13.5px;color:#D9DECF;line-height:1.4}" +
    "#fg-termo .join .b{all:unset;cursor:pointer;display:inline-block;margin-top:14px;background:var(--broto);color:var(--noite);font:600 15px 'Red Hat Display',sans-serif;padding:12px 18px;border-radius:8px;text-decoration:none}" +
    "#fg-termo .join .msg{margin-top:10px;font:500 12.5px var(--mono);color:var(--broto);min-height:16px}#fg-termo .join .msg.er{color:var(--dn)}" +
    "#fg-termo .note{margin:48px 0 64px;padding:18px 22px;border-left:3px solid var(--ouro);background:var(--card);border-radius:0 10px 10px 0;font-size:14px;line-height:1.6;color:var(--mut)}" +
    "#fg-termo .load{padding:60px 0;text-align:center;font:500 13px var(--mono);color:var(--mut)}" +
    "@media (max-width:860px){#fg-termo .grid,#fg-termo .cols{grid-template-columns:1fr}#fg-termo .res .hd{display:none}#fg-termo .res .r{grid-template-columns:1fr auto;row-gap:6px}#fg-termo .q h3{font-size:18px}}";

  var el, L, t, sb, Q = [], mine = {}, perfil = null, filtro = 'all';
  function fmt(n) { return Number(n).toLocaleString(t ? t.loc : 'pt-BR'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
  function tx(o) { return o ? (o[L] || o.pt || '') : ''; }
  function pct(o) { return o.total ? Math.round(100 * o.sim / o.total) : null; }
  function aberta(o) { return o.status === 'aberta' && new Date(o.fecha_em) > new Date(); }

  function spark(s) {
    var v = s.map(function (p) { return p[1]; }).filter(function (x) { return x != null; });
    if (v.length < 2) return '';
    var w = 300, h = 46, mn = Math.min.apply(0, v) - 4, mx = Math.max.apply(0, v) + 4;
    var pts = v.map(function (y, i) { return [i * (w / (v.length - 1)), h - (y - mn) / (mx - mn) * h]; });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + d + ' L' + w + ' ' + h + ' L0 ' + h + 'Z" fill="rgba(159,211,107,.08)"/><path d="' + d + '" fill="none" stroke="#9FD36B" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';
  }
  function semana(s) {
    var v = s.filter(function (p) { return p[1] != null; });
    if (v.length < 2) return null;
    var last = v[v.length - 1], alvo = new Date(new Date(last[0]).getTime() - 7 * 864e5).toISOString().slice(0, 10), ref = v[0];
    v.forEach(function (p) { if (p[0] <= alvo) ref = p; });
    if (ref === last) return null;
    return last[1] - ref[1];
  }

  function card(o) {
    var p = pct(o), ch = semana(o.serie || []), m = mine[o.id], ab = aberta(o), d = tx(o.resolve_txt);
    var chip = ch == null ? '' : '<span class="chg ' + (ch > 0 ? 'up' : ch < 0 ? 'dn' : 'nt') + '">' + (ch > 0 ? '▲ ' : ch < 0 ? '▼ ' : '') + Math.abs(ch) + t.week + '</span>';
    var fonte = o.fonte_link ? '<a href="' + esc(o.fonte_link) + '" target="_blank" rel="noopener">' + esc(o.fonte) + '</a>' : esc(o.fonte);
    var st = m ? t.voted(m === 'sim' ? t.sim : t.no.charAt(0) + t.no.slice(1).toLowerCase(), d) : (ab ? '' : t.closedVote);
    return '<article class="q" data-cat="' + esc(o.categoria) + '" data-id="' + o.id + '"' + (filtro === 'all' || filtro === o.categoria ? '' : ' hidden') + '>' +
      '<div class="meta"><span class="cat">' + esc(t.cats[o.categoria] || o.categoria) + '</span><span>' + t.until + ' ' + esc(d) + '</span></div>' +
      '<h3>' + esc(tx(o.pergunta)) + '</h3>' +
      '<div class="prob"><b>' + (p == null ? '—' : p + '%') + '</b><span>' + (p == null ? t.first : t.sim) + '</span>' + chip + '</div>' +
      '<div class="meter' + (p == null ? ' e' : '') + '"><i style="width:' + (p == null ? 0 : p) + '%"></i></div>' + spark(o.serie || []) +
      '<div class="btns"><button type="button" class="y' + (m === 'sim' ? ' sel' : '') + '" data-v="sim"' + (ab ? '' : ' disabled') + '>' + t.yes + (p == null ? '' : ' · ' + p + '%') + '</button>' +
      '<button type="button" class="n' + (m === 'nao' ? ' sel' : '') + '" data-v="nao"' + (ab ? '' : ' disabled') + '>' + t.no + (p == null ? '' : ' · ' + (100 - p) + '%') + '</button></div>' +
      '<div class="voted" aria-live="polite">' + esc(st) + '</div>' +
      '<div class="foot"><span>' + t.votes(o.total) + '</span><span>' + t.resolves + ': ' + fonte + '</span></div></article>';
  }

  function render(rank) {
    var abertas = Q.filter(function (o) { return o.status === 'aberta'; });
    var fechadas = Q.filter(function (o) { return o.status === 'encerrada' && o.resposta; });
    var cats = []; abertas.forEach(function (o) { if (cats.indexOf(o.categoria) < 0) cats.push(o.categoria); });
    var h = '<div class="w">';
    h += '<div class="bar-top"><h2>' + t.open + '</h2><div class="filters"><button type="button" data-f="all"' + (filtro === 'all' ? ' class="on"' : '') + '>' + t.all + '</button>' +
      cats.map(function (c) { return '<button type="button" data-f="' + esc(c) + '"' + (filtro === c ? ' class="on"' : '') + '>' + esc(t.cats[c] || c) + '</button>'; }).join('') + '</div></div>';
    h += '<div class="grid">' + abertas.map(card).join('') + '</div>';
    h += '<div class="bar-top"><h2>' + t.closed + '</h2></div><div class="res">';
    if (!fechadas.length) h += '<div class="empty">' + t.noneClosed + '</div>';
    else {
      h += '<div class="r hd">' + t.h.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>';
      h += fechadas.map(function (o) {
        var p = pct(o), y = o.resposta === 'sim';
        return '<div class="r"><span>' + esc(tx(o.pergunta)) + '</span><span>' + (p == null ? '—' : p + '% ' + t.sim) + '</span><span><span class="st ' + (y ? 'y' : 'n') + '">' + (y ? t.happened : t.didnt) + '</span></span><span class="src">' + esc(tx(o.resolucao) || o.fonte) + '</span></div>';
      }).join('');
    }
    h += '</div>';
    h += '<div class="bar-top"><h2>' + t.rank + '</h2></div><div class="cols"><div class="rank">';
    h += rank && rank.length ? rank.map(function (r, i) { return '<div class="r"><span class="pos">' + (i < 9 ? '0' : '') + (i + 1) + '</span><span>' + esc(r.apelido) + '</span><span class="pct">' + r.acertos + '/' + r.total + '</span></div>'; }).join('') : '<div class="empty">' + t.rankEmpty + '</div>';
    h += '</div><div><form class="join" novalidate><h4>' + t.joinT + '</h4>';
    if (perfil && perfil.apelido) h += '<p class="msg">' + esc(t.joined(perfil.apelido)) + '</p>';
    else h += '<p>' + t.joinP + '</p><input type="text" name="apelido" maxlength="24" placeholder="' + t.nick + '" aria-label="' + t.nick + '" autocomplete="nickname">' +
      '<input type="text" name="contato" maxlength="120" placeholder="' + t.contact + '" aria-label="' + t.contact + '" autocomplete="email">' +
      '<label><input type="checkbox" name="aceita"> <span>' + t.ok + '</span></label><button type="submit" class="b">' + t.joinB + '</button><div class="msg" aria-live="polite"></div>';
    h += '</form><div class="join"><h4>' + t.ctaT + '</h4><p>' + t.ctaP + '</p><a class="b" href="' + t.ctaL + '">' + t.ctaB + '</a></div></div></div>';
    h += '<p class="note">' + t.note + '</p></div>';
    el.innerHTML = h;
  }

  function carregar() {
    return Promise.all([sb.rpc('termometro_resumo'), sb.rpc('termometro_ranking')]).then(function (r) {
      if (r[0].error) throw r[0].error;
      Q = r[0].data || [];
      return sb.auth.getSession().then(function (s) {
        if (!s.data.session) return r[1].data;
        var uid = s.data.session.user.id;
        return Promise.all([sb.from('palpites').select('pergunta_id,opcao'), sb.from('perfis').select('apelido').eq('user_id', uid).maybeSingle()]).then(function (m) {
          mine = {}; (m[0].data || []).forEach(function (v) { mine[v.pergunta_id] = v.opcao; });
          perfil = m[1].data || null;
          return r[1].data;
        });
      });
    }).then(render);
  }

  function sessao() {
    return sb.auth.getSession().then(function (s) {
      if (s.data.session) return s.data.session.user.id;
      return sb.auth.signInAnonymously().then(function (r) { if (r.error) throw r.error; return r.data.user.id; });
    });
  }

  function votar(btn) {
    var art = btn.closest('.q'), id = +art.getAttribute('data-id'), v = btn.getAttribute('data-v'), msg = art.querySelector('.voted');
    if (mine[id] === v) return;
    art.querySelectorAll('.btns button').forEach(function (b) { b.disabled = true; });
    msg.className = 'voted'; msg.textContent = t.saving;
    sessao().then(function (uid) {
      return sb.from('palpites').upsert({user_id: uid, pergunta_id: id, opcao: v}, {onConflict: 'user_id,pergunta_id'});
    }).then(function (r) {
      if (r.error) throw r.error;
      mine[id] = v;
      return carregar();
    }).catch(function (e) {
      if (window.console) console.warn('termometro', e);
      art.querySelectorAll('.btns button').forEach(function (b) { b.disabled = false; });
      msg.className = 'voted er'; msg.textContent = t.err;
    });
  }

  function entrar(form) {
    var msg = form.querySelector('.msg'), a = form.apelido.value.trim(), c = form.contato.value.trim();
    if (!/^[A-Za-z0-9_À-ÿ.\- ]{3,24}$/.test(a)) { msg.className = 'msg er'; msg.textContent = t.bad; return; }
    msg.className = 'msg'; msg.textContent = t.saving;
    sessao().then(function (uid) {
      return sb.from('perfis').upsert({user_id: uid, apelido: a, contato: c || null, aceita_contato: !!form.aceita.checked, idioma: L}, {onConflict: 'user_id'});
    }).then(function (r) {
      if (r.error) throw r.error;
      perfil = {apelido: a};
      return carregar();
    }).catch(function (e) {
      msg.className = 'msg er'; msg.textContent = e && e.code === '23505' ? t.taken : t.err;
    });
  }

  function start() {
    el = document.getElementById('fg-termo'); if (!el) return;
    L = (el.getAttribute('data-lang') || 'pt').slice(0, 2); t = T[L] || T.pt;
    if (!document.getElementById('fgt-css')) { var s = document.createElement('style'); s.id = 'fgt-css'; s.textContent = CSS; document.head.appendChild(s); }
    el.innerHTML = '<div class="load">' + t.loading + '</div>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.btns button'); if (b && !b.disabled) { votar(b); return; }
      var f = e.target.closest('.filters button');
      if (f) {
        filtro = f.getAttribute('data-f');
        el.querySelectorAll('.filters button').forEach(function (x) { x.classList.toggle('on', x === f); });
        el.querySelectorAll('.grid .q').forEach(function (q) { q.hidden = !(filtro === 'all' || q.getAttribute('data-cat') === filtro); });
      }
    });
    el.addEventListener('submit', function (e) { if (e.target.classList.contains('join')) { e.preventDefault(); entrar(e.target); } });
    function go() {
      sb = window.supabase.createClient(SB_URL, SB_KEY, {auth: {persistSession: true, storageKey: 'fg-termo-auth'}});
      carregar().catch(function (e) { if (window.console) console.warn('termometro', e); el.innerHTML = '<div class="load">' + t.fail + '</div>'; });
    }
    if (window.supabase && window.supabase.createClient) go();
    else { var sc = document.createElement('script'); sc.src = LIB; sc.onload = go; sc.onerror = function () { el.innerHTML = '<div class="load">' + t.fail + '</div>'; }; document.head.appendChild(sc); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
