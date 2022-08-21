update bookings as bk, (SELECT * FROM airtn.booking_details) as src
set bk.booking_date = src.booking_date where src.booking_id = bk.id