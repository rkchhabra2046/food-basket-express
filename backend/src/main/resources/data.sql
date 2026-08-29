-- Seed Initial Users (Customer & Admin)
INSERT INTO users (id, name, email, password, role, phone, address, created_at) VALUES 
(1, 'Manveer Singh', 'admin@foodbasket.com', 'Manveer@1313', 'ADMIN', '+91-79730-59398', 'Admin Headquarters, Mohali', NOW()),
(2, 'Customer User', 'customer@gmail.com', 'customer123', 'CUSTOMER', '+91-98765-43210', '123 Main Street, Sector 17, Chandigarh', NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Seed Initial Restaurants
INSERT INTO restaurants (id, name, description, address, cuisine_type, rating, image_url, is_open) VALUES 
(1, 'Food Basket Express', 'Fast food, burgers, rolls, and Indian snacks', 'Sector 34, Chandigarh', 'Fast Food & Snacks', 4.8, 'logo.png', true),
(2, 'Italian Pizza Hub', 'Authentic stone-baked pizzas and fresh pasta', 'Sector 17, Chandigarh', 'Italian & Continental', 4.6, 'pizza.png', true),
(3, 'Royal Spice Junction', 'Rich Indian delicacies, samosas, and tandoori rolls', 'Phase 7, Mohali', 'North Indian & Street Food', 4.7, 'Samosa.png', true)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Initial Food Items (Matching original Products.json + Extra Items)
INSERT INTO food_items (id, name, description, price, category, image_url, is_available, restaurant_id) VALUES 
(1, 'Double Beef Burger', 'Juicy double patty burger with melted cheddar cheese and lettuce', 250.00, 'Burgers', 'burger.png', true, 1),
(2, 'Veggie Pizza', 'Delicious mozzarella cheese pizza topped with bell peppers, olives & corn', 300.00, 'Pizzas', 'pizza.png', true, 2),
(3, 'Fried Chicken', 'Crispy golden fried chicken bucket served with dip', 700.00, 'Chicken', 'fried-chicken.png', true, 1),
(4, 'Chicken Roll', 'Spicy grilled chicken wrapped in soft kathi paratha', 550.00, 'Rolls', 'chicken-roll.png', true, 1),
(5, 'Sub Sandwich', 'Fresh footlong sub stuffed with veggies and savory sauce', 500.00, 'Sandwiches', 'sandwich.png', true, 1),
(6, 'Chicken Lasagna', 'Classic layered pasta with rich minced chicken ragu and béchamel', 1200.00, 'Italian', 'lasagna.png', true, 2),
(7, 'Italian Spaghetti', 'Traditional spaghetti Bolognese topped with parmesan cheese', 580.00, 'Italian', 'spaghetti.png', true, 2),
(8, 'Spring Roll', 'Crispy vegetable spring rolls served with sweet chili dip', 800.00, 'Snacks', 'spring-roll.png', true, 3),
(9, 'Samosa', 'Crispy Indian pastry stuffed with spiced potatoes and peas', 25.00, 'Snacks', 'Samosa.png', true, 3)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Initial Customer Reviews (Using customer profile pics profile1.jpeg through profile6.jpg)
INSERT INTO reviews (id, customer_name, customer_avatar, rating, comment, food_item_name, restaurant_name, created_at) VALUES
(1, 'Aarav Sharma', 'profile1.jpeg', 5, 'The Double Beef Burger was super juicy and fresh! Delivery took only 25 minutes. Highly recommended!', 'Double Beef Burger', 'Food Basket Express', NOW()),
(2, 'Priya Kapoor', 'profile2.jpeg', 5, 'Best Veggie Pizza in Chandigarh! Cheese pull was amazing and crust was super crunchy.', 'Veggie Pizza', 'Italian Pizza Hub', NOW()),
(3, 'Rohan Verma', 'profile3.jpeg', 4, 'Fried Chicken bucket was super crispy and piping hot. Will definitely order again.', 'Fried Chicken', 'Food Basket Express', NOW()),
(4, 'Simran Kaur', 'profile4.jpg', 5, 'Authentic Samosas! Crispy outer crust with delicious spiced potato filling. Perfect evening snack.', 'Samosa', 'Royal Spice Junction', NOW()),
(5, 'Kabir Mehta', 'profile5.jpg', 5, 'Spring rolls were super crunchy and sweet chili sauce was spot on. Fast delivery!', 'Spring Roll', 'Royal Spice Junction', NOW()),
(6, 'Ananya Sen', 'profile6.jpg', 4, 'Chicken Lasagna had amazing layers of cheese and sauce. Truly restaurant quality at home.', 'Chicken Lasagna', 'Italian Pizza Hub', NOW())
ON DUPLICATE KEY UPDATE id=id;
