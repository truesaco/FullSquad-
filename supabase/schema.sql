-- Fullsquad v1 (beta) database. DRAFT: the website does not use this yet.
-- It's the backend for the real multi-user app (accounts, games, joining by position, waitlist, auto-promotion),
-- to be wired up after the Supabase class. Tested against a local Postgres with a mock of Supabase's auth schema.
-- Run once in Supabase: SQL Editor → New query → paste this whole file → Run.
-- Safe to re-run: it drops and recreates the Fullsquad objects (this deletes existing games).

-- ---------- Clean slate ----------
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.create_game(text, timestamptz, text, text, text, int, int, int, int, text) cascade;
drop function if exists public.create_game(text, timestamptz, text, text, text, int, int, int, int, text, text, text, timestamptz, int) cascade;
drop function if exists public._need(public.games, text) cascade;
drop function if exists public.join_game(uuid) cascade;
drop function if exists public.leave_game(uuid) cascade;
drop function if exists public.remove_player(uuid, uuid) cascade;
drop function if exists public.cancel_game(uuid) cascade;
drop function if exists public._claim_slot(public.games, text[]) cascade;
drop function if exists public._promote(uuid) cascade;
drop table if exists public.signups cascade;
drop table if exists public.games cascade;
drop table if exists public.profiles cascade;

-- ---------- Tables ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '' check (char_length(name) <= 40),
  positions text[] not null default '{MID}'
    check (positions <@ array['GK', 'DEF', 'MID', 'FWD'] and cardinality(positions) between 1 and 4),
  skill text not null default 'Intermediate' check (skill in ('Casual', 'Intermediate', 'Competitive')),
  goal_ok boolean not null default false, -- happy to take a turn in goal
  created_at timestamptz not null default now()
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 60),
  starts_at timestamptz not null,
  place text not null check (char_length(place) between 1 and 80),
  format text not null check (format in ('5v5', '7v7', '8v8', '11v11')),
  size int not null check (size between 2 and 30),
  level text not null default 'All levels' check (level in ('All levels', 'Casual', 'Intermediate', 'Competitive')),
  -- Spots reserved for specific positions. Every other open spot is "any position".
  need_gk int not null default 0 check (need_gk >= 0),
  need_def int not null default 0 check (need_def >= 0),
  need_mid int not null default 0 check (need_mid >= 0),
  need_fwd int not null default 0 check (need_fwd >= 0),
  notes text check (char_length(notes) <= 280),
  -- Game style: set positions, rotating, or positions until switch_at and then rotating.
  style text not null default 'positions' check (style in ('positions', 'rotating', 'hybrid')),
  rotation text not null default 'keeper' check (rotation in ('keeper', 'free')),
  switch_at timestamptz,
  duration_min int not null default 60 check (duration_min between 20 and 180),
  cancelled boolean not null default false,
  created_at timestamptz not null default now(),
  check (need_gk + need_def + need_mid + need_fwd <= size - 1)
);
create index games_starts_at_idx on public.games (starts_at);

create table public.signups (
  game_id uuid not null references public.games (id) on delete cascade,
  player_id uuid not null references public.profiles (id) on delete cascade,
  status text not null check (status in ('in', 'waitlist')),
  pos text not null check (pos in ('GK', 'DEF', 'MID', 'FWD')),          -- position they'll play
  slot text not null default 'ANY' check (slot in ('GK', 'DEF', 'MID', 'FWD', 'ANY')), -- which open spot they took
  created_at timestamptz not null default clock_timestamp(),              -- waitlist order
  primary key (game_id, player_id)
);
create index signups_order_idx on public.signups (game_id, status, created_at);

-- ---------- New user → profile ----------
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, positions)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)), 40),
    coalesce(
      (select array_agg(x) from jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'positions', '[]'::jsonb)) as x
        where x in ('GK', 'DEF', 'MID', 'FWD')),
      '{MID}'
    )
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Matching logic ----------
-- Reserved spots for a position. Rotating games have none, and "positions, then rotate"
-- games drop them once switch_at has passed, so the deadline needs no scheduled job.
create function public._need(g public.games, p text)
returns int language sql stable set search_path = public as $$
  select case
    when g.style = 'rotating' or (g.style = 'hybrid' and g.switch_at is not null and now() >= g.switch_at) then 0
    when p = 'GK' then g.need_gk when p = 'DEF' then g.need_def when p = 'MID' then g.need_mid else g.need_fwd
  end
$$;

-- Which open spot can a player who plays `player_positions` take? Their positions first, then "any".
create function public._claim_slot(g public.games, player_positions text[])
returns text language plpgsql stable set search_path = public as $$
declare
  in_count int;
  specific_left int := 0;
  p text;
  need int;
  taken int;
begin
  select count(*) into in_count from signups where game_id = g.id and status = 'in';
  if in_count >= g.size then
    return null;
  end if;

  foreach p in array array['GK', 'DEF', 'MID', 'FWD'] loop
    need := _need(g, p);
    select count(*) into taken from signups where game_id = g.id and status = 'in' and slot = p;
    specific_left := specific_left + greatest(0, need - taken);
  end loop;

  foreach p in array player_positions loop
    need := _need(g, p);
    select count(*) into taken from signups where game_id = g.id and status = 'in' and slot = p;
    if need - taken > 0 then
      return p;
    end if;
  end loop;

  if g.size - in_count - specific_left > 0 then
    return 'ANY';
  end if;
  return null;
end $$;

-- Move people up from the waitlist, in sign-up order, into any spot they fit.
create function public._promote(p_game uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  g games;
  w record;
  s text;
begin
  select * into g from games where id = p_game;
  for w in
    select su.player_id, pr.positions
    from signups su join profiles pr on pr.id = su.player_id
    where su.game_id = p_game and su.status = 'waitlist'
    order by su.created_at
  loop
    s := _claim_slot(g, w.positions);
    if s is not null then
      update signups
        set status = 'in', slot = s, pos = case when s = 'ANY' then w.positions[1] else s end
        where game_id = p_game and player_id = w.player_id;
    end if;
  end loop;
end $$;

-- ---------- Actions (the app calls these; tables are read-only to users) ----------
create function public.create_game(
  p_title text, p_starts_at timestamptz, p_place text, p_format text, p_level text,
  p_need_gk int, p_need_def int, p_need_mid int, p_need_fwd int, p_notes text,
  p_style text default 'positions', p_rotation text default 'keeper', p_switch_at timestamptz default null, p_duration_min int default 60
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  my_positions text[];
  new_id uuid;
  v_size int := case p_format when '5v5' then 10 when '7v7' then 14 when '8v8' then 16 when '11v11' then 22 end;
begin
  if me is null then raise exception 'Please sign in first.'; end if;
  if v_size is null then raise exception 'Unknown format.'; end if;
  select positions into my_positions from profiles where id = me;

  if p_style = 'hybrid' and p_switch_at is null then raise exception 'Pick when the game switches to rotating.'; end if;

  insert into games (organizer_id, title, starts_at, place, format, size, level, need_gk, need_def, need_mid, need_fwd, notes,
                     style, rotation, switch_at, duration_min)
  values (me, trim(p_title), p_starts_at, trim(p_place), p_format, v_size, p_level,
          greatest(0, p_need_gk), greatest(0, p_need_def), greatest(0, p_need_mid), greatest(0, p_need_fwd), nullif(trim(p_notes), ''),
          p_style, p_rotation, case when p_style = 'hybrid' then p_switch_at end, p_duration_min)
  returning id into new_id;

  -- The organizer is in, on an "any position" spot, so the positions they asked for stay open.
  insert into signups (game_id, player_id, status, pos, slot) values (new_id, me, 'in', my_positions[1], 'ANY');
  return new_id;
end $$;

create function public.join_game(p_game uuid)
returns text language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  g games;
  my_positions text[];
  current_status text;
  s text;
begin
  if me is null then raise exception 'Please sign in first.'; end if;
  select * into g from games where id = p_game for update; -- one join at a time per game
  if not found or g.cancelled then raise exception 'This game is not available.'; end if;

  -- If a deadline has passed, people already waiting move up first (fair order).
  perform _promote(p_game);

  select status into current_status from signups where game_id = p_game and player_id = me;
  if found then return current_status; end if;

  select positions into my_positions from profiles where id = me;
  s := _claim_slot(g, my_positions);
  if s is null then
    insert into signups (game_id, player_id, status, pos, slot) values (p_game, me, 'waitlist', my_positions[1], 'ANY');
    return 'waitlist';
  end if;
  insert into signups (game_id, player_id, status, pos, slot)
    values (p_game, me, 'in', case when s = 'ANY' then my_positions[1] else s end, s);
  return 'in';
end $$;

create function public.leave_game(p_game uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  g games;
  was text;
begin
  if me is null then raise exception 'Please sign in first.'; end if;
  select * into g from games where id = p_game for update;
  if not found then raise exception 'This game is not available.'; end if;
  if g.organizer_id = me then raise exception 'You organize this game. Cancel it instead.'; end if;

  delete from signups where game_id = p_game and player_id = me returning status into was;
  if was = 'in' then
    perform _promote(p_game);
  end if;
end $$;

create function public.remove_player(p_game uuid, p_player uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  g games;
  was text;
begin
  select * into g from games where id = p_game for update;
  if not found or g.organizer_id is distinct from me then raise exception 'Only the organizer can do that.'; end if;
  if p_player = me then raise exception 'You can''t remove yourself. Cancel the game instead.'; end if;

  delete from signups where game_id = p_game and player_id = p_player returning status into was;
  if was = 'in' then
    perform _promote(p_game);
  end if;
end $$;

create function public.cancel_game(p_game uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update games set cancelled = true where id = p_game and organizer_id = auth.uid();
  if not found then raise exception 'Only the organizer can cancel this game.'; end if;
end $$;

-- ---------- Security: signed-in users can read; changes only through the functions above ----------
alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.signups enable row level security;

create policy "Signed-in users can see profiles" on public.profiles for select to authenticated using (true);
create policy "Users can edit their own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "Signed-in users can see games" on public.games for select to authenticated using (true);
create policy "Signed-in users can see signups" on public.signups for select to authenticated using (true);

revoke all on function public._claim_slot(public.games, text[]) from public, anon, authenticated;
revoke all on function public._promote(uuid) from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.create_game(text, timestamptz, text, text, text, int, int, int, int, text, text, text, timestamptz, int) from public, anon;
revoke all on function public._need(public.games, text) from public, anon, authenticated;
revoke all on function public.join_game(uuid) from public, anon;
revoke all on function public.leave_game(uuid) from public, anon;
revoke all on function public.remove_player(uuid, uuid) from public, anon;
revoke all on function public.cancel_game(uuid) from public, anon;
grant execute on function public.create_game(text, timestamptz, text, text, text, int, int, int, int, text, text, text, timestamptz, int) to authenticated;
grant execute on function public.join_game(uuid) to authenticated;
grant execute on function public.leave_game(uuid) to authenticated;
grant execute on function public.remove_player(uuid, uuid) to authenticated;
grant execute on function public.cancel_game(uuid) to authenticated;

-- ---------- Live updates in the app ----------
alter publication supabase_realtime add table public.games, public.signups;
