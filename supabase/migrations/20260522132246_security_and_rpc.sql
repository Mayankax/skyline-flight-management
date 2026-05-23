-- =========================
-- ENABLE RLS
-- =========================

alter table public.bookings
enable row level security;

alter table public.passengers
enable row level security;

alter table public.reschedules
enable row level security;

alter table public.seats
enable row level security;

alter table public.flights
enable row level security;

-- =========================
-- FLIGHTS POLICIES
-- =========================

create policy "Flights are viewable by everyone"
on public.flights
for select
using (true);

-- =========================
-- SEATS POLICIES
-- =========================

create policy "Seats are viewable by everyone"
on public.seats
for select
using (true);

-- =========================
-- BOOKINGS POLICIES
-- =========================

create policy "Users can view own bookings"
on public.bookings
for select
using (
    auth.uid() = user_id
);

create policy "Users can insert own bookings"
on public.bookings
for insert
with check (
    auth.uid() = user_id
);

create policy "Users can update own bookings"
on public.bookings
for update
using (
    auth.uid() = user_id
);

-- =========================
-- PASSENGERS POLICIES
-- =========================

create policy "Users can view own passengers"
on public.passengers
for select
using (
    exists (
        select 1
        from public.bookings b
        where b.id = booking_id
        and b.user_id = auth.uid()
    )
);

create policy "Users can insert own passengers"
on public.passengers
for insert
with check (
    exists (
        select 1
        from public.bookings b
        where b.id = booking_id
        and b.user_id = auth.uid()
    )
);

-- =========================
-- RESCHEDULES POLICIES
-- =========================

create policy "Users can view own reschedules"
on public.reschedules
for select
using (
    exists (
        select 1
        from public.bookings b
        where b.id = booking_id
        and b.user_id = auth.uid()
    )
);

create policy "Users can insert own reschedules"
on public.reschedules
for insert
with check (
    exists (
        select 1
        from public.bookings b
        where b.id = booking_id
        and b.user_id = auth.uid()
    )
);

-- =========================
-- PNR GENERATOR
-- =========================

create or replace function generate_pnr()
returns text
language plpgsql
as $$
declare
    chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result text := '';
    i integer := 0;
begin
    for i in 1..6 loop
        result := result ||
        substr(chars,
        floor(random() * length(chars) + 1)::integer,
        1);
    end loop;

    return result;
end;
$$;

-- =========================
-- SEAT RESERVATION RPC
-- =========================

create or replace function reserve_seat(
    p_flight_id uuid,
    p_seat_id uuid,
    p_user_id uuid,
    p_total_price numeric
)
returns uuid
language plpgsql
security definer
as $$
declare
    seat_available boolean;
    booking_id uuid;
begin

    -- lock seat row
    select is_available
    into seat_available
    from public.seats
    where id = p_seat_id
    and flight_id = p_flight_id
    for update;

    if seat_available is false then
        raise exception 'Seat already booked';
    end if;

    -- mark seat unavailable
    update public.seats
    set is_available = false
    where id = p_seat_id;

    -- create booking
    insert into public.bookings (
        user_id,
        flight_id,
        seat_id,
        total_price,
        pnr_code
    )
    values (
        p_user_id,
        p_flight_id,
        p_seat_id,
        p_total_price,
        generate_pnr()
    )
    returning id into booking_id;

    return booking_id;
end;
$$;

-- =========================
-- CANCELLATION RULE
-- =========================

create or replace function prevent_late_cancellation()
returns trigger
language plpgsql
as $$
declare
    flight_departure timestamptz;
begin

    select departs_at
    into flight_departure
    from public.flights
    where id = old.flight_id;

    if (
        flight_departure - now()
    ) < interval '2 hours' then
        raise exception
        'Cannot cancel within 2 hours of departure';
    end if;

    return new;
end;
$$;

create trigger cancellation_trigger
before update on public.bookings
for each row
when (
    old.status <> 'cancelled'
    and new.status = 'cancelled'
)
execute function prevent_late_cancellation();

-- =========================
-- CANCEL BOOKING RPC
-- =========================

create or replace function cancel_booking(
    p_booking_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
    booking_seat_id uuid;
begin

    select seat_id
    into booking_seat_id
    from public.bookings
    where id = p_booking_id
    and user_id = auth.uid();

    if booking_seat_id is null then
        raise exception 'Booking not found';
    end if;

    update public.bookings
    set status = 'cancelled'
    where id = p_booking_id;

    update public.seats
    set is_available = true
    where id = booking_seat_id;

end;
$$;