CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  description TEXT,
  image_url TEXT
);

CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed mock products
INSERT INTO products (name, price, description, image_url) VALUES
  ('Wireless Headphones', 79.99, 'Premium noise-cancelling headphones', '/headphones.jpg'),
  ('Smart Watch', 199.99, 'Fitness tracking & notifications', '/watch.jpg'),
  ('Laptop Stand', 49.99, 'Ergonomic aluminum stand', '/stand.jpg'),
  ('Mechanical Keyboard', 129.99, 'RGB backlit gaming keyboard', '/keyboard.jpg'),
  ('Webcam 4K', 89.99, 'Professional streaming camera', '/webcam.jpg'),
  ('USB-C Hub', 39.99, '7-in-1 connectivity hub', '/hub.jpg'),
  ('Desk Lamp', 34.99, 'LED with adjustable brightness', '/lamp.jpg'),
  ('Mouse Pad XL', 24.99, 'Extended gaming surface', '/mousepad.jpg');
