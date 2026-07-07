CREATE TABLE customer_profiles (
  id VARCHAR(36) PRIMARY KEY,
  tenant_key VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  nationality VARCHAR(120) NOT NULL,
  passport_number VARCHAR(80) NOT NULL,
  preferred_language VARCHAR(50) NOT NULL DEFAULT 'English',
  loyalty_tier VARCHAR(50) NOT NULL DEFAULT 'Explorer',
  emergency_contact VARCHAR(120) NOT NULL,
  address TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_customer_profiles_tenant_key (tenant_key),
  INDEX idx_customer_profiles_email (email)
);

CREATE TABLE customer_bookings (
  id VARCHAR(36) PRIMARY KEY,
  reference VARCHAR(32) NOT NULL,
  tenant_key VARCHAR(100) NOT NULL,
  customer_id VARCHAR(36) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  travel_date DATE NOT NULL,
  return_date DATE NOT NULL,
  adults INT NOT NULL DEFAULT 0,
  children INT NOT NULL DEFAULT 0,
  infants INT NOT NULL DEFAULT 0,
  travelers_count INT NOT NULL DEFAULT 1,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'LKR',
  booking_status VARCHAR(32) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(32) NOT NULL DEFAULT 'unpaid',
  payment_due_date DATE NOT NULL,
  notes TEXT NULL,
  support_contact VARCHAR(255) NOT NULL,
  itinerary JSON NULL,
  add_ons JSON NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_customer_bookings_tenant_key (tenant_key),
  INDEX idx_customer_bookings_customer_id (customer_id),
  INDEX idx_customer_bookings_reference (reference),
  CONSTRAINT fk_customer_bookings_customer
    FOREIGN KEY (customer_id) REFERENCES customer_profiles(id)
    ON DELETE CASCADE
);

CREATE TABLE customer_reviews (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL,
  tenant_key VARCHAR(100) NOT NULL,
  customer_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  rating TINYINT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'submitted',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_customer_reviews_tenant_key (tenant_key),
  INDEX idx_customer_reviews_booking_id (booking_id),
  CONSTRAINT fk_customer_reviews_booking
    FOREIGN KEY (booking_id) REFERENCES customer_bookings(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_customer_reviews_customer
    FOREIGN KEY (customer_id) REFERENCES customer_profiles(id)
    ON DELETE CASCADE
);

