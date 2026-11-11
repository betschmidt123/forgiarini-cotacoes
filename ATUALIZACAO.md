# Atualização diária (dias úteis) do painel de cotações

Este repositório alimenta a página **Cotações** do site da Corretora Forgiarini
(www.corretoraforgiarini.com/cotacoes, /es/cotizaciones e /en/rice-prices).

- `dados.json`: todos os números do painel. É o único arquivo que muda toda semana.
- `painel.js`: desenha o painel, as abas e o gráfico do RS. Só muda se o visual mudar.
- O site lê os dois arquivos pelo GitHub Pages: https://betschmidt123.github.io/forgiarini-cotacoes/

## Regras

1. **Nunca inventar ou estimar um número sem marcar.** Todo valor precisa de data e fonte.
   Se a fonte não publicou nada novo, mantenha o valor e a data anteriores.
2. Médias calculadas (receita ÷ volume) levam `"aprox": true` e a fonte diz "média calculada".
3. Não publicar volumes, preços ou negócios da própria corretora. Só referências públicas de mercado.
4. Datas no formato `DD/MM/AAAA` (ou texto por idioma, como `{"pt":"Out/2026",...}`).
5. `var` é a variação percentual (número, positivo ou negativo). Use `chip` + `tom` (`up`, `dn`, `nt`) para textos.
6. Textos com tradução usam `{"pt": "...", "es": "...", "en": "..."}`.
7. Depois de editar, valide: `python3 -c "import json;json.load(open('dados.json'))"`.
8. Mensagem de commit: `Atualização diária AAAA-MM-DD`.
9. Fontes semanais ou mensais (Irga, Conab, Paraguai, Uruguai, Argentina, FOB, USDA) só mudam
   quando publicarem dado novo; nos outros dias, mantenha o valor e a data anteriores.

## O que atualizar e onde buscar

| Item no `dados.json` | Fonte | Frequência da fonte |
|---|---|---|
| `atualizado` | data do dia da atualização | todo dia útil |
| `cambio_usd_brl` e USD/BRL (aba arroz) | fechamento do dólar comercial (Banco Central / imprensa) | diária |
| Arroz casca RS (abas arroz e cepea) + `serie_rs` | Indicador Cepea/Esalq arroz em casca RS, via https://www.noticiasagricolas.com.br/cotacoes/arroz/arroz-em-casca-esalq-bbm | diária |
| Arroz Chicago e vencimentos de arroz | USDA AMS Weekly National Rice Summary, https://www.ams.usda.gov/mnreports/ams_1655.pdf (ajustes CME) | semanal |
| Soja Chicago (vencimentos) | https://www.noticiasagricolas.com.br/cotacoes/soja/soja-bolsa-de-chicago-cme-group | diária |
| Soja e milho Cepea | https://www.noticiasagricolas.com.br/cotacoes/ (Indicadores Cepea) | diária |
| Plantio RS | Irga (via imprensa: Folha Agrícola, Agrolink, Canal Rural, Safras) | semanal na safra |
| Produção BR | Conab, levantamento mensal de safra | mensal |
| Paraguai exportação | Caparroz (via InfoNegocios, La Nación, Revista Foco, Forbes PY) | mensal |
| Paraguai → Brasil | Agrostat/MAPA (via imprensa) | trimestral |
| RS em US$/t | calculado: indicador RS × 20 ÷ dólar (`aprox: true`) | diária |
| Uruguai produtor | ACA (via Blasina y Asociados, El Observador, Tardáguila) | eventual |
| Argentina exportação | Bolsa de Comercio de Rosario | anual/eventual |
| FOB Uruguai 5% e EUA 2/4% | tabela mensal MAGyP Argentina (Osiriz/InfoArroz) | mensal |
| FOB Tailândia, Vietnã, Índia | Reuters "Asia rice" semanal (via InfoArroz, Business Recorder) | semanal |

`serie_rs`: acrescente os pregões novos do Indicador Cepea no formato `["AAAA-MM-DD", valor]`,
em ordem, sem repetir datas. O gráfico mostra os últimos 60.

Paridade teórica da nota do arroz Chicago: `preço US$/cwt ÷ 45,359237 × 50 × dólar`, arredondado.

## Leitura da semana

`leitura` traz 2 a 4 frases por idioma (pt, es, en) sobre o que mudou na semana, citando só números
que estão no painel. Tom neutro, sem previsão de preço e sem recomendação de compra ou venda.
