# Contexto do projeto: site da Corretora Forgiarini

Site: www.corretoraforgiarini.com (Squarespace). Idiomas: português (raiz), espanhol (/es) e inglês (/en).
Este arquivo resume o trabalho feito até 11/11/2026 para continuar em uma nova conversa.

## Regras do conteúdo (manter sempre)
- Não publicar volumes, preços ou negócios da própria corretora; nada de laudos.
- Logística e exportação são feitas por parceiros; a corretora só acompanha.
- Sem depoimentos, sem foto da equipe, sem crédito do Unsplash, sem autor nos posts.
- Não repetir fotos já usadas no site; vegetação com cara de Brasil/Paraguai.
- Todo número de mercado leva fonte e data; nunca inventar. Médias calculadas levam "≈" / "média calculada".
- Manter o aviso "Valores de referência de mercado. Não são oferta da Corretora Forgiarini."
- O arroz é vendido por fardo, saca ou tonelada (arroz em casca: saca ou tonelada).
- E-mail do usuário é privado.

## Páginas criadas
| Página | PT | ES | EN |
|---|---|---|---|
| Cotações | /cotacoes | /es/cotizaciones | /en/rice-prices |
| Termômetro do Arroz | /termometro-do-arroz | /es/termometro-del-arroz | /en/rice-thermometer |

Cada página tem hreflang no cabeçalho. O menu em ES/EN e o seletor PT/ES/EN são traduzidos pelo código no rodapé do site
(Configurações › Injeção de código › Rodapé: mapas PT2ES/PT2EN e NAV).
Blog: 4 artigos em PT/ES/EN (o mais recente: safra de arroz 2026/27 com seção do Paraguai).

## Painel de cotações (este repositório)
- `dados.json`: todos os números. `painel.js`: desenha o painel (abas Arroz, Chicago, Cepea, Mercosul e mundo) e os quadros ao vivo da TradingView.
- O site lê `dados.json` direto do GitHub (raw.githubusercontent.com) e usa o GitHub Pages como reserva.
- Quadros ao vivo: grãos de Chicago via CFD Capital.com (CBOT não libera no widget gratuito), B3 (milho, soja, boi, dólar futuro), câmbio (BRL, PYG, ARS, UYU, DXY) e índices. Arroz de Chicago ao vivo não existe de graça: fica na tabela diária.
- Regras e fontes da atualização: `ATUALIZACAO.md`.
- Tarefa agendada na nuvem: "Atualizar cotações do arroz (site Forgiarini) – dias úteis", seg–sex 7h41 (Brasília), commit "Atualização diária AAAA-MM-DD".
  Em 11/11 a rodada automática não publicou; a atualização foi feita à mão. Conferir se a de 12/11 publicou.

## Termômetro do Arroz (enquete tipo "Polymarket", sem dinheiro)
- Código: `termometro.js`; banco: `termometro/banco.sql` (já executado).
- Supabase: projeto termometro-arroz, URL https://gwbxzscutlgjosewsayj.supabase.co, chave pública no `termometro.js`. Voto anônimo (sem cadastro), apelido opcional para o ranking, contato opcional visível só no Supabase (tabela `perfis`).
- Encerrar pergunta: Supabase › Table Editor › `perguntas` › `status` = `encerrada` e `resposta` = `sim` ou `nao`.
- Perguntas iniciais: saca RS > R$ 85 em dez; plantio RS > 95% até 30/11; dólar > R$ 5,60 no fim de 2026; Paraguai < 180 mil ha; arroz Chicago jan/27 > US$ 18,50 na semana (fecha 13/11); Conab revisa para baixo em dez.

## Marca
- Cores: noite #16281A, lavoura #2E4A2F, broto #D3E3A4, grão #F7F3EA, palha #E8DCC0, terra #6B4A2E, ouro #B8862B.
- Fontes: Red Hat Display (títulos e logo, logo em Black), Figtree (texto), Lato (rótulos), JetBrains Mono (números).
- Logos em PNG transparente: pasta `marca/`. Os SVGs do designer trazem o texto como fonte (não em curvas); por isso os PNGs foram gerados.
  - Topo do site: gerado a partir de `marca/logo-menu-original.svg` (logo_23.svg) com Red Hat Display Black.
  - Rodapé: `marca/logo-completo-negativo.png` (creme + palha).

## Instagram
- Carrossel de 8 slides (1080×1350) no canvas "Carrossel Instagram – Cotações e Termômetro do Arroz": capa, quem somos, painel, fontes, "referência, não tempo real", Termômetro (em teste), como funciona, acesse.
- Números do slide 3 são de 10/11/2026: atualizar antes de postar se a data mudar.

## Pendências
- Pedir indexação no Google Search Console (páginas novas e páginas/artigos em inglês) e enviar sitemap.xml.
- Ver a página /about-1 (sobra do modelo do Squarespace) e desativar se não for usada.
- Linha do Chile no painel: voltar quando houver fonte acessível (ODEPA bloqueado).
- Pedir ao designer SVGs com texto convertido em curvas.
