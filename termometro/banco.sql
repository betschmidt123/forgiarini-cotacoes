-- Termômetro do Arroz · Corretora Forgiarini
-- Cole tudo no Supabase: SQL Editor → New query → Run.

-- 1. Perguntas
create table if not exists public.perguntas (
  id          bigint generated always as identity primary key,
  slug        text unique not null,
  categoria   text not null,                       -- preco | safra | cambio | paraguai
  pergunta    jsonb not null,                      -- {"pt": "...", "es": "...", "en": "..."}
  fonte       text not null,                       -- quem resolve (Cepea, Irga, Conab...)
  fonte_link  text,
  fecha_em    timestamptz not null,                -- depois disso não aceita voto
  resolve_txt jsonb,                               -- data de resolução por idioma
  status      text not null default 'aberta' check (status in ('aberta','encerrada','cancelada')),
  resposta    text check (resposta in ('sim','nao')),
  resolucao   jsonb,                               -- {"pt": "Cepea · R$ 86,10 em 31/12", ...}
  ordem       int not null default 0,
  criado_em   timestamptz not null default now()
);

-- 2. Perfis (apelido do ranking + contato opcional, que NÃO aparece no site)
create table if not exists public.perfis (
  user_id        uuid primary key references auth.users on delete cascade default auth.uid(),
  apelido        text unique check (apelido ~ '^[A-Za-z0-9_À-ÿ\.\- ]{3,24}$'),
  contato        text check (char_length(contato) <= 120),
  aceita_contato boolean not null default false,
  idioma         text,
  criado_em      timestamptz not null default now()
);

-- 3. Votos
create table if not exists public.palpites (
  user_id       uuid not null references auth.users on delete cascade default auth.uid(),
  pergunta_id   bigint not null references public.perguntas on delete cascade,
  opcao         text not null check (opcao in ('sim','nao')),
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  primary key (user_id, pergunta_id)
);
create index if not exists palpites_pergunta on public.palpites (pergunta_id, atualizado_em);

-- Segurança: tudo trancado, e só o necessário liberado
alter table public.perguntas enable row level security;
alter table public.perfis    enable row level security;
alter table public.palpites  enable row level security;

revoke all on public.perguntas, public.perfis, public.palpites from anon, authenticated;
grant select on public.perguntas to anon, authenticated;
grant select, insert, update on public.perfis   to authenticated;
grant select, insert, update on public.palpites to authenticated;

drop policy if exists "perguntas visiveis" on public.perguntas;
create policy "perguntas visiveis" on public.perguntas for select using (status <> 'cancelada');

drop policy if exists "perfil proprio ler" on public.perfis;
drop policy if exists "perfil proprio criar" on public.perfis;
drop policy if exists "perfil proprio editar" on public.perfis;
create policy "perfil proprio ler"    on public.perfis for select to authenticated using (user_id = auth.uid());
create policy "perfil proprio criar"  on public.perfis for insert to authenticated with check (user_id = auth.uid());
create policy "perfil proprio editar" on public.perfis for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "voto proprio ler" on public.palpites;
drop policy if exists "voto proprio criar" on public.palpites;
drop policy if exists "voto proprio editar" on public.palpites;
create policy "voto proprio ler" on public.palpites for select to authenticated using (user_id = auth.uid());
create policy "voto proprio criar" on public.palpites for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.perguntas p where p.id = pergunta_id and p.status = 'aberta' and p.fecha_em > now()));
create policy "voto proprio editar" on public.palpites for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and exists (select 1 from public.perguntas p where p.id = pergunta_id and p.status = 'aberta' and p.fecha_em > now()));

create or replace function public.palpite_carimbo() returns trigger language plpgsql as $$
begin new.atualizado_em := now(); if tg_op = 'UPDATE' then new.criado_em := old.criado_em; end if; return new; end $$;
drop trigger if exists palpite_carimbo on public.palpites;
create trigger palpite_carimbo before insert or update on public.palpites for each row execute function public.palpite_carimbo();

-- Resumo público: totais por pergunta + série diária (% Sim acumulado, últimos 21 dias)
create or replace function public.termometro_resumo()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x order by x->>'ordem', x->>'id'), '[]'::jsonb) from (
    select jsonb_build_object(
      'id', p.id, 'slug', p.slug, 'categoria', p.categoria, 'pergunta', p.pergunta,
      'fonte', p.fonte, 'fonte_link', p.fonte_link, 'fecha_em', p.fecha_em, 'resolve_txt', p.resolve_txt,
      'status', p.status, 'resposta', p.resposta, 'resolucao', p.resolucao, 'ordem', lpad(p.ordem::text, 6, '0'),
      'sim', (select count(*) from palpites v where v.pergunta_id = p.id and v.opcao = 'sim'),
      'total', (select count(*) from palpites v where v.pergunta_id = p.id),
      'serie', (select coalesce(jsonb_agg(jsonb_build_array(d::date, s.pct) order by d), '[]'::jsonb)
                from generate_series(greatest(p.criado_em::date, least(now(), p.fecha_em)::date - 20), least(now(), p.fecha_em)::date, interval '1 day') d
                cross join lateral (
                  select case when count(*) = 0 then null
                         else round(100.0 * count(*) filter (where v.opcao = 'sim') / count(*)) end as pct
                  from palpites v where v.pergunta_id = p.id and v.atualizado_em < d + interval '1 day') s)
    ) as x
    from perguntas p where p.status <> 'cancelada'
  ) t;
$$;

-- Ranking público: só apelido e acertos (nunca o contato)
create or replace function public.termometro_ranking()
returns table (apelido text, acertos bigint, total bigint) language sql stable security definer set search_path = public as $$
  select f.apelido, count(*) filter (where v.opcao = p.resposta) as acertos, count(*) as total
  from palpites v
  join perguntas p on p.id = v.pergunta_id and p.status = 'encerrada' and p.resposta is not null
  join perfis f on f.user_id = v.user_id and f.apelido is not null
  group by f.apelido
  order by acertos desc, (count(*) filter (where v.opcao = p.resposta))::numeric / count(*) desc, total desc
  limit 20;
$$;

revoke all on function public.termometro_resumo(), public.termometro_ranking() from public;
grant execute on function public.termometro_resumo(), public.termometro_ranking() to anon, authenticated;

-- Perguntas iniciais (horário de Brasília)
insert into public.perguntas (slug, categoria, pergunta, fonte, fonte_link, fecha_em, resolve_txt, ordem) values
('saca-rs-85-dez26', 'preco',
 '{"pt":"A saca de arroz em casca no RS fecha dezembro acima de R$ 85?","es":"¿La bolsa de arroz cáscara en Rio Grande do Sul cierra diciembre por encima de R$ 85?","en":"Will Rio Grande do Sul paddy rice close December above R$ 85 per 50 kg bag?"}',
 'Indicador Cepea/Esalq', 'https://www.cepea.org.br/br/indicador/arroz.aspx', '2026-12-31 18:00-03',
 '{"pt":"31/12/2026","es":"31/12/2026","en":"Dec 31, 2026"}', 1),
('plantio-rs-95-nov26', 'safra',
 '{"pt":"O plantio de arroz no RS passa de 95% da área prevista até 30/11?","es":"¿La siembra de arroz en Rio Grande do Sul supera el 95% del área prevista al 30/11?","en":"Will rice planting in Rio Grande do Sul pass 95% of the planned area by Nov 30?"}',
 'Irga', 'https://irga.rs.gov.br/', '2026-11-30 18:00-03',
 '{"pt":"30/11/2026","es":"30/11/2026","en":"Nov 30, 2026"}', 2),
('dolar-560-2026', 'cambio',
 '{"pt":"O dólar termina 2026 acima de R$ 5,60?","es":"¿El dólar cierra 2026 por encima de R$ 5,60?","en":"Will the US dollar end 2026 above R$ 5.60?"}',
 'Banco Central do Brasil (Ptax)', 'https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes', '2026-12-31 13:00-03',
 '{"pt":"31/12/2026","es":"31/12/2026","en":"Dec 31, 2026"}', 3),
('paraguai-area-180mil', 'paraguai',
 '{"pt":"O Paraguai planta menos de 180 mil hectares de arroz na safra 2026/27?","es":"¿Paraguay siembra menos de 180 mil hectáreas de arroz en la zafra 2026/27?","en":"Will Paraguay plant less than 180,000 hectares of rice in the 2026/27 crop?"}',
 'Feparroz / Caparroz', null, '2027-01-31 18:00-03',
 '{"pt":"31/01/2027","es":"31/01/2027","en":"Jan 31, 2027"}', 4),
('chicago-1850-semana', 'preco',
 '{"pt":"O arroz em Chicago (jan/27) fecha a semana acima de US$ 18,50?","es":"¿El arroz en Chicago (ene/27) cierra la semana por encima de US$ 18,50?","en":"Will Chicago rough rice (Jan 27) close the week above US$ 18.50?"}',
 'CME, via USDA', 'https://www.cmegroup.com/markets/agriculture/grains/rough-rice.html', '2026-11-13 15:15-03',
 '{"pt":"13/11/2026","es":"13/11/2026","en":"Nov 13, 2026"}', 5),
('conab-revisa-dez26', 'safra',
 '{"pt":"A Conab revisa a produção de arroz 2026/27 para baixo em dezembro?","es":"¿Conab revisa a la baja la producción de arroz 2026/27 en diciembre?","en":"Will Conab cut its 2026/27 rice crop estimate in December?"}',
 'Conab', 'https://www.conab.gov.br/info-agro/safras', '2026-12-10 08:00-03',
 '{"pt":"Dez/2026","es":"Dic/2026","en":"Dec 2026"}', 6)
on conflict (slug) do nothing;
