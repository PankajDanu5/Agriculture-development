-- Sample data for Smart Crop Support System

-- Insert sample users
INSERT INTO users (id, email, password_hash, name, phone, location, farm_size, crops, role, language_preference) VALUES
('user_001', 'farmer1@example.com', '$2b$10$hashedpassword1', 'Rajesh Kumar', '+91-9876543210', 'Punjab, India', 5.5, '["wheat", "rice", "sugarcane"]', 'farmer', 'hi'),
('user_002', 'farmer2@example.com', '$2b$10$hashedpassword2', 'Priya Sharma', '+91-9876543211', 'Haryana, India', 3.2, '["tomato", "potato", "onion"]', 'farmer', 'hi'),
('admin_001', 'admin@cropcare.com', '$2b$10$hashedpassword3', 'Admin User', '+91-9876543212', 'Delhi, India', NULL, NULL, 'admin', 'en');

-- Insert sample mandi prices
INSERT INTO mandi_prices (id, crop, variety, market, state, district, min_price, max_price, modal_price, price_date, unit, source) VALUES
('price_001', 'Wheat', 'HD-2967', 'Karnal Mandi', 'Haryana', 'Karnal', 2100.00, 2300.00, 2200.00, CURDATE(), 'per quintal', 'agmarknet.gov.in'),
('price_002', 'Rice', 'Basmati', 'Amritsar Mandi', 'Punjab', 'Amritsar', 3500.00, 4000.00, 3750.00, CURDATE(), 'per quintal', 'agmarknet.gov.in'),
('price_003', 'Tomato', 'Hybrid', 'Delhi Azadpur Mandi', 'Delhi', 'Delhi', 800.00, 1200.00, 1000.00, CURDATE(), 'per quintal', 'agmarknet.gov.in'),
('price_004', 'Potato', 'Jyoti', 'Agra Mandi', 'Uttar Pradesh', 'Agra', 1200.00, 1500.00, 1350.00, CURDATE(), 'per quintal', 'agmarknet.gov.in'),
('price_005', 'Onion', 'Nasik Red', 'Nashik Mandi', 'Maharashtra', 'Nashik', 2000.00, 2500.00, 2250.00, CURDATE(), 'per quintal', 'agmarknet.gov.in');

-- Insert sample government schemes
INSERT INTO government_schemes (id, title, description, eligibility, benefits, application_process, deadline, status, category, target_states, official_url) VALUES
('scheme_001', 'PM-KISAN Samman Nidhi', 'Direct income support scheme providing financial assistance to small and marginal farmers', 'Small and marginal farmers with cultivable land up to 2 hectares', 'Rs. 6000 per year in three equal installments of Rs. 2000 each', 'Apply online at pmkisan.gov.in or visit nearest Common Service Center', '2025-12-31', 'Active', 'Financial Support', '["All States"]', 'https://pmkisan.gov.in'),
('scheme_002', 'Pradhan Mantri Fasal Bima Yojana', 'Crop insurance scheme providing financial support to farmers in case of crop failure', 'All farmers growing notified crops in notified areas', 'Insurance coverage for crop loss due to natural calamities, pests, and diseases', 'Apply through banks, insurance companies, or Common Service Centers', '2025-06-30', 'Active', 'Insurance', '["All States"]', 'https://pmfby.gov.in'),
('scheme_003', 'Soil Health Card Scheme', 'Provides soil health cards to farmers for better nutrient management and soil health', 'All farmers across the country', 'Free soil testing and nutrient recommendations every 2 years', 'Contact local agriculture department or Krishi Vigyan Kendra', NULL, 'Active', 'Technical Support', '["All States"]', 'https://soilhealth.dac.gov.in'),
('scheme_004', 'Kisan Credit Card', 'Provides adequate and timely credit support for agriculture and allied activities', 'All farmers including tenant farmers, oral lessees, and sharecroppers', 'Credit facility for crop production, post-harvest expenses, and consumption requirements', 'Apply through banks with required documents', NULL, 'Active', 'Credit Support', '["All States"]', 'https://pmkisan.gov.in/KCCForm.aspx');

-- Insert sample disease detection records
INSERT INTO disease_detections (id, user_id, image_url, image_filename, disease, confidence, treatment, severity, crop_type, location) VALUES
('detect_001', 'user_001', '/uploads/tomato_leaf_001.jpg', 'tomato_leaf_001.jpg', 'Tomato Late Blight', 0.8900, 'Apply copper-based fungicide (Copper oxychloride 50% WP @ 3g/liter). Improve air circulation and avoid overhead watering.', 'High', 'Tomato', 'Punjab, India'),
('detect_002', 'user_002', '/uploads/wheat_leaf_001.jpg', 'wheat_leaf_001.jpg', 'Wheat Rust', 0.9200, 'Spray Propiconazole 25% EC @ 1ml/liter or Tebuconazole 10% + Sulphur 65% WG @ 2g/liter', 'Medium', 'Wheat', 'Haryana, India'),
('detect_003', 'user_001', '/uploads/healthy_plant_001.jpg', 'healthy_plant_001.jpg', 'Healthy Plant', 0.9500, 'Plant appears healthy. Continue regular monitoring and maintain good agricultural practices.', 'None', 'Rice', 'Punjab, India');

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, priority) VALUES
('notif_001', 'user_001', 'Disease Detected in Your Crop', 'Late blight detected in your tomato crop with 89% confidence. Immediate treatment recommended.', 'disease_alert', FALSE, 'high'),
('notif_002', 'user_002', 'Price Alert: Tomato Prices Up', 'Tomato prices have increased by 15% in Delhi Azadpur Mandi. Current rate: Rs. 1000/quintal', 'price_update', FALSE, 'medium'),
('notif_003', 'user_001', 'New Government Scheme Available', 'PM-KISAN 14th installment is now available. Check your eligibility and apply now.', 'scheme_update', TRUE, 'medium');
