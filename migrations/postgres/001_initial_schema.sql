-- Initial schema for Postgres (compatible with initDb)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE TABLE IF NOT EXISTS restaurant_tables (
  id SERIAL PRIMARY KEY,
  name TEXT,
  capacity INT,
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  table_id INT REFERENCES restaurant_tables(id) ON DELETE SET NULL,
  party_size INT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_items (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
  menu_item_id INT REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  price_at_order NUMERIC(10,2) NOT NULL
);

-- Seed a default table and menu item for e2e tests and quick local start
INSERT INTO restaurant_tables (id, name, capacity, location, is_active)
SELECT 1, 'Table 1', 4, 'Main floor', TRUE
WHERE NOT EXISTS (SELECT 1 FROM restaurant_tables WHERE id = 1);

INSERT INTO menu_items (id, name, description, price, is_available)
SELECT 1, 'Burger', 'Classic burger', 5.99, TRUE
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 1);
