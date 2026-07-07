INSERT INTO customer_profiles (
  id, tenant_key, name, email, phone, nationality, passport_number, preferred_language,
  loyalty_tier, emergency_contact, address, created_at, updated_at
) VALUES (
  'cust_demo_001', 'lanka-trails', 'Ayesha Khan', 'ayesha.khan@example.com', '+94 77 123 4567',
  'Sri Lankan', 'N1234567', 'English', 'Insider', '+94 77 765 4321',
  '45 Marine Drive, Colombo 03', '2026-01-10 08:00:00', '2026-07-03 09:30:00'
);

INSERT INTO customer_bookings (
  id, reference, tenant_key, customer_id, customer_name, customer_email, package_name, destination,
  travel_date, return_date, adults, children, infants, travelers_count, total_amount, paid_amount,
  currency, booking_status, payment_status, payment_due_date, notes, support_contact, itinerary, add_ons,
  created_at, updated_at
) VALUES
('bk_001', 'TBK-2026-000101', 'lanka-trails', 'cust_demo_001', 'Ayesha Khan', 'ayesha.khan@example.com', 'Sri Lanka Highlights', 'Sigiriya, Kandy, Ella, Mirissa', '2026-08-14', '2026-08-20', 2, 0, 0, 2, 370000, 185000, 'LKR', 'confirmed', 'partial', '2026-08-07', 'Pickup requested from Bandaranaike International Airport.', 'operations@lankatrails.example', '["Arrival in Colombo","Sigiriya day trip","Kandy temple trail","Ella tea country","South coast"]', '["Airport transfer","Private driver","Cultural guide"]', '2026-06-27 10:15:00', '2026-07-01 13:05:00'),
('bk_002', 'TBK-2026-000102', 'lanka-trails', 'cust_demo_001', 'Ayesha Khan', 'ayesha.khan@example.com', 'Hill Country Weekend', 'Nuwara Eliya, Ella', '2026-08-22', '2026-08-24', 1, 1, 0, 2, 116000, 116000, 'LKR', 'confirmed', 'paid', '2026-08-20', 'Child seat requested for the transfer.', 'support@lankatrails.example', '["Nanu Oya pickup","Tea estate walk","Ella day excursion"]', '["Child seat","Train tickets"]', '2026-06-29 08:20:00', '2026-07-02 11:40:00'),
('bk_003', 'TBK-2026-000103', 'lanka-trails', 'cust_demo_001', 'Ayesha Khan', 'ayesha.khan@example.com', 'Southern Coast Escape', 'Mirissa, Galle', '2026-09-04', '2026-09-08', 2, 0, 0, 2, 248000, 0, 'LKR', 'pending', 'unpaid', '2026-08-30', 'Sea-view room preference.', 'bookings@lankatrails.example', '["Galle Fort","Mirissa beach time","Whale watching","Spa afternoon"]', '["Whale watching","Airport transfer"]', '2026-07-01 15:35:00', '2026-07-04 14:10:00'),
('bk_004', 'TBK-2026-000104', 'lanka-trails', 'cust_demo_001', 'Ayesha Khan', 'ayesha.khan@example.com', 'Cultural Triangle Tour', 'Anuradhapura, Sigiriya, Polonnaruwa', '2026-09-14', '2026-09-19', 2, 1, 0, 3, 312000, 156000, 'LKR', 'confirmed', 'partial', '2026-09-04', 'Need early morning departures for temple visits.', 'operations@lankatrails.example', '["Anuradhapura","Sigiriya climb","Polonnaruwa bike tour"]', '["Private guide","Lunch stops"]', '2026-07-02 09:25:00', '2026-07-05 07:55:00'),
('bk_005', 'TBK-2026-000105', 'lanka-trails', 'cust_demo_001', 'Ayesha Khan', 'ayesha.khan@example.com', 'Wildlife and Waterfalls', 'Yala, Ella', '2026-10-02', '2026-10-06', 2, 0, 0, 2, 295000, 0, 'LKR', 'draft', 'unpaid', '2026-09-25', 'Customer asked for jeep safari options.', 'bookings@lankatrails.example', '["Yala safari","Ella trek","Tea factory visit"]', '["Safari jeep","Waterfall stop"]', '2026-07-02 12:55:00', '2026-07-02 12:55:00'),
('bk_006', 'TBK-2026-000106', 'lanka-trails', 'cust_demo_001', 'Ayesha Khan', 'ayesha.khan@example.com', 'Luxury Private Tour', 'Colombo, Galle, Bentota', '2026-10-18', '2026-10-23', 2, 0, 0, 2, 465000, 232500, 'LKR', 'confirmed', 'partial', '2026-10-07', 'Prefers boutique hotels and late check-out.', 'vip@lankatrails.example', '["City arrival","Galle day tour","Bentota coast","Private farewell dinner"]', '["Private chauffeur","Spa reservation"]', '2026-07-03 10:05:00', '2026-07-05 18:10:00'),
('bk_007', 'TBK-2026-000107', 'lanka-trails', 'cust_demo_001', 'Ayesha Khan', 'ayesha.khan@example.com', 'Weekend Reset', 'Kandy', '2026-11-01', '2026-11-03', 1, 0, 0, 1, 88000, 0, 'LKR', 'pending', 'unpaid', '2026-10-27', 'Single-room stay with early pickup.', 'support@lankatrails.example', '["Temple visit","Lake walk","Tea lounge stop"]', '["City guide"]', '2026-07-03 14:45:00', '2026-07-04 15:15:00'),
('bk_008', 'TBK-2026-000108', 'lanka-trails', 'cust_demo_001', 'Ayesha Khan', 'ayesha.khan@example.com', 'Family Discovery', 'Bentota, Colombo', '2026-11-14', '2026-11-19', 2, 2, 0, 4, 332000, 332000, 'LKR', 'completed', 'paid', '2026-11-02', 'Completed booking with family-friendly timing.', 'bookings@lankatrails.example', '["Bentota beach","Colombo museum day","Departure"]', '["Family van","Flexible meals"]', '2026-07-01 06:10:00', '2026-07-06 09:45:00'),
('bk_009', 'TBK-2026-000109', 'lanka-trails', 'cust_demo_001', 'Ayesha Khan', 'ayesha.khan@example.com', 'Tea Trails Escape', 'Nuwara Eliya, Hatton', '2026-12-03', '2026-12-07', 2, 0, 0, 2, 268000, 134000, 'LKR', 'confirmed', 'partial', '2026-11-23', 'Requested room with balcony views.', 'operations@lankatrails.example', '["Tea estate walk","Scenic train","Waterfall stop"]', '["Tea tasting","Driver overnight stay"]', '2026-07-04 07:25:00', '2026-07-06 12:30:00'),
('bk_010', 'TBK-2026-000110', 'lanka-trails', 'cust_demo_001', 'Ayesha Khan', 'ayesha.khan@example.com', 'Festival City Break', 'Colombo', '2026-12-18', '2026-12-21', 2, 0, 0, 2, 124000, 0, 'LKR', 'draft', 'unpaid', '2026-12-08', 'Waiting on final hotel confirmation.', 'bookings@lankatrails.example', '["Arrival","Shopping","City dining","Departure"]', '["Airport transfer"]', '2026-07-06 09:35:00', '2026-07-06 09:35:00');

INSERT INTO customer_reviews (
  id, booking_id, tenant_key, customer_id, title, message, rating, status, created_at, updated_at
) VALUES
('rv_001', 'bk_001', 'lanka-trails', 'cust_demo_001', 'Excellent trip planning', 'The itinerary was practical, the driver was on time, and the support team responded fast.', 5, 'published', '2026-07-06 08:30:00', '2026-07-06 08:30:00'),
('rv_002', 'bk_002', 'lanka-trails', 'cust_demo_001', 'Smooth hill-country weekend', 'The child seat request was handled quickly and the schedule stayed relaxed.', 5, 'published', '2026-07-06 09:45:00', '2026-07-06 09:45:00');

