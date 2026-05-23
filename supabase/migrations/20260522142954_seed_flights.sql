-- =========================
-- FLIGHTS
-- =========================

insert into public.flights (
    id,
    flight_no,
    origin,
    destination,
    departs_at,
    arrives_at,
    aircraft_type,
    status,
    base_price
)
values

(
    gen_random_uuid(),
    'SK101',
    'Delhi',
    'Mumbai',
    now() + interval '1 day',
    now() + interval '1 day 2 hours',
    'Airbus A320',
    'scheduled',
    4500
),

(
    gen_random_uuid(),
    'SK102',
    'Mumbai',
    'Delhi',
    now() + interval '2 days',
    now() + interval '2 days 2 hours',
    'Boeing 737',
    'scheduled',
    4700
),

(
    gen_random_uuid(),
    'SK201',
    'Delhi',
    'Bangalore',
    now() + interval '1 day',
    now() + interval '1 day 3 hours',
    'Airbus A321',
    'scheduled',
    6500
),

(
    gen_random_uuid(),
    'SK202',
    'Bangalore',
    'Delhi',
    now() + interval '3 days',
    now() + interval '3 days 3 hours',
    'Boeing 777',
    'scheduled',
    6900
),

(
    gen_random_uuid(),
    'SK301',
    'Delhi',
    'Goa',
    now() + interval '2 days',
    now() + interval '2 days 3 hours',
    'Airbus A320',
    'scheduled',
    7200
),

(
    gen_random_uuid(),
    'SK302',
    'Goa',
    'Delhi',
    now() + interval '4 days',
    now() + interval '4 days 3 hours',
    'Airbus A320',
    'scheduled',
    7100
),

(
    gen_random_uuid(),
    'SK401',
    'Mumbai',
    'Bangalore',
    now() + interval '1 day',
    now() + interval '1 day 2 hours',
    'Boeing 737',
    'scheduled',
    5200
),

(
    gen_random_uuid(),
    'SK402',
    'Bangalore',
    'Mumbai',
    now() + interval '5 days',
    now() + interval '5 days 2 hours',
    'Boeing 737',
    'scheduled',
    5300
);


do $$
declare
    flight_record record;
    row_num int;
    seat_letter text;
    seat_class text;
begin

    for flight_record in
        select id from public.flights
    loop

        for row_num in 1..20 loop

            foreach seat_letter in array array[
                'A',
                'B',
                'C',
                'D',
                'E',
                'F'
            ]
            loop

                if row_num <= 2 then
                    seat_class := 'first';

                elseif row_num <= 6 then
                    seat_class := 'business';

                else
                    seat_class := 'economy';
                end if;

                insert into public.seats (
                    flight_id,
                    seat_number,
                    class,
                    is_available,
                    extra_fee
                )
                values (
                    flight_record.id,

                    row_num || seat_letter,

                    seat_class,

                    true,

                    case
                        when seat_class = 'first'
                        then 5000

                        when seat_class = 'business'
                        then 2500

                        else 500
                    end
                );

            end loop;
        end loop;

    end loop;
end $$;