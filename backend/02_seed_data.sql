-- 02_seed_data.sql
-- Sample Seed Data: 10 Kategori & 50 Produk

-- Dummy user untuk pemilik produk default jika diperlukan
-- Password 'password123' bcrypt hash
INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES 
(1, 'Admin Seller', 'seller@commerceapi.com', '$2b$10$B6SARqHvLdEvt4OwnRbyJeLcXphwvNlHTH01JdYWR7H9x4V8SWbyq', 'seller', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 10 Kategori
INSERT INTO kategori (id, nama, deskripsi, created_at, updated_at) VALUES
(1, 'Elektronik', 'Peralatan elektronik, gadget, dan aksesoris teknologi', NOW(), NOW()),
(2, 'Pakaian Pria', 'Busana pria formal, casual, dan aksesoris', NOW(), NOW()),
(3, 'Pakaian Wanita', 'Busana wanita tren masa kini, gamis, dress, dan kasual', NOW(), NOW()),
(4, 'Makanan & Minuman', 'Produk kuliner, camilan, dan minuman kemasan', NOW(), NOW()),
(5, 'Kesehatan & Kecantikan', 'Skincare, suplemen, dan perlengkapan perawatan diri', NOW(), NOW()),
(6, 'Rumah Tangga', 'Peralatan dapur, dekorasi ruangan, dan furnitur', NOW(), NOW()),
(7, 'Olahraga & Outdoor', 'Perlengkapan fitness, camping, dan olahraga atletik', NOW(), NOW()),
(8, 'Otomotif', 'Aksesoris motor, mobil, helm, dan suku cadang', NOW(), NOW()),
(9, 'Buku & Alat Tulis', 'Buku referensi, novel, dan perlengkapan kantor/sekolah', NOW(), NOW()),
(10, 'Mainan & Hobi', 'Mainan anak, action figure, diecast, dan perkakas hobi', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 50 Produk
INSERT INTO produk (user_id, kategori_id, nama, deskripsi, harga, stok, sku, gambar_url, berat, status, created_at, updated_at) VALUES
(1, 1, 'Smartphone Galaxy X', 'Layar 6.7 inch AMOLED 120Hz, RAM 8GB, 256GB Storage', 7500000.00, 25, 'ELK-001', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 200.0, 'active', NOW(), NOW()),
(1, 1, 'Laptop UltraSlim 14"', 'Intel Core i7 13th Gen, 16GB RAM, 512GB NVMe SSD', 14200000.00, 10, 'ELK-002', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 1400.0, 'active', NOW(), NOW()),
(1, 1, 'TWS Bluetooth ANC Headset', 'Active Noise Cancelling, battery up to 30 hours', 599000.00, 50, 'ELK-003', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', 60.0, 'active', NOW(), NOW()),
(1, 1, 'Smartwatch Fitness Tracker', 'Heart rate monitor, SpO2, tahan air 5ATM', 850000.00, 30, 'ELK-004', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 45.0, 'active', NOW(), NOW()),
(1, 1, 'Mechanical Keyboard RGB', 'Tenkeyless layout, Blue switch tactile, RGB backlit', 650000.00, 15, 'ELK-005', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', 850.0, 'active', NOW(), NOW()),

(1, 2, 'Kemeja Katun Pria Formal', 'Bahan katun adem reguler fit lengan panjang', 185000.00, 40, 'PKP-001', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', 250.0, 'active', NOW(), NOW()),
(1, 2, 'Celana Jeans Denim Slim Fit', 'Bahan denim stretch nyaman dipakai sehari-hari', 275000.00, 35, 'PKP-002', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 500.0, 'active', NOW(), NOW()),
(1, 2, 'Jaket Hoodie Fleece Basic', 'Bahan cotton fleece tebal dan hangat', 199000.00, 45, 'PKP-003', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2', 450.0, 'active', NOW(), NOW()),
(1, 2, 'Kaos Polos Cotton Combed 30s', 'Katun murni halus, menyerap keringat maksimal', 65000.00, 100, 'PKP-004', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518', 180.0, 'active', NOW(), NOW()),
(1, 2, 'Sepatu Sneakers Casual Canvas', 'Sole karet anti slip, model casual modern', 320000.00, 20, 'PKP-005', 'https://images.unsplash.com/photo-1549298916-b41d501d3772', 700.0, 'active', NOW(), NOW()),

(1, 3, 'Dress Motif Floral Elegant', 'Bahan sifon premium lembut dan tidak menerawang', 245000.00, 25, 'PKW-001', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1', 300.0, 'active', NOW(), NOW()),
(1, 3, 'Blouse Casual Wanita Lengan Balon', 'Desain kekinian cocok untuk kerja maupun kuliah', 135000.00, 50, 'PKW-002', 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992', 200.0, 'active', NOW(), NOW()),
(1, 3, 'Rok Plisket Premium Panjang', 'Bahan hyget super rempel rapi tidak gampang melar', 95000.00, 60, 'PKW-003', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa', 300.0, 'active', NOW(), NOW()),
(1, 3, 'Cardigan Rajut Oversize', 'Rajut tebal premium knitwear model Korea', 155000.00, 30, 'PKW-004', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105', 400.0, 'active', NOW(), NOW()),
(1, 3, 'Tas Selempang Wanita Kulit Sintetis', 'Model shoulder bag minimalis dan elegan', 189000.00, 40, 'PKW-005', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 350.0, 'active', NOW(), NOW()),

(1, 4, 'Kopi Arabika Gayo Single Origin 250g', 'Biji kopi sangrai kualitas specialty cupping score tinggi', 85000.00, 75, 'MKM-001', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e', 250.0, 'active', NOW(), NOW()),
(1, 4, 'Keripik Tempe Renyah Gurih 200g', 'Keripik tempe olahan tradisional tanpa pengawet', 25000.00, 120, 'MKM-002', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691', 220.0, 'active', NOW(), NOW()),
(1, 4, 'Madu Hutan Murni 500ml', 'Madu alami asli dari lebah liar hutan tropis', 120000.00, 30, 'MKM-003', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38', 650.0, 'active', NOW(), NOW()),
(1, 4, 'Matcha Green Tea Powder Premium 100g', 'Bubuk matcha murni impor Jepang untuk latte & baking', 99000.00, 45, 'MKM-004', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a', 120.0, 'active', NOW(), NOW()),
(1, 4, 'Granola Almond Cokelat Sehat 400g', 'Oatmeal panggang dengan madu, almond, dan dark chocolate', 68000.00, 50, 'MKM-005', 'https://images.unsplash.com/photo-1517093708454-e0c1a967f673', 420.0, 'active', NOW(), NOW()),

(1, 5, 'Facial Serum Niacinamide 10% 30ml', 'Mencerahkan kulit, memudarkan noda hitam, meratakan warna kulit', 115000.00, 60, 'KHB-001', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 100.0, 'active', NOW(), NOW()),
(1, 5, 'Sunscreen UV Shield SPF 50 PA++++ 50ml', 'Formula gel ringan tidak lengket bebas whitecast', 89000.00, 80, 'KHB-002', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908', 90.0, 'active', NOW(), NOW()),
(1, 5, 'Moisturizer Gel Ceramide 50g', 'Memperbaiki skin barrier dan menjaga kelembaban kulit', 129000.00, 40, 'KHB-003', 'https://images.unsplash.com/photo-1608248597359-2503a45c76db', 120.0, 'active', NOW(), NOW()),
(1, 5, 'Gentle Foaming Cleanser 100ml', 'Sabun cuci muka low pH lembut tanpa membuat kulit kering', 75000.00, 70, 'KHB-004', 'https://images.unsplash.com/photo-1556228720-195a672e8a03', 150.0, 'active', NOW(), NOW()),
(1, 5, 'Hair Tonic Ginseng Anti Rontok 150ml', 'Menguatkan akar rambut dan menyuburkan pertumbuhan rambut', 65000.00, 55, 'KHB-005', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d', 200.0, 'active', NOW(), NOW()),

(1, 6, 'Set Panci Masak Anti Lengket 5 Pcs', 'Bahan granit coating marble bebas PFOA dan tahan lama', 450000.00, 15, 'RMT-001', 'https://images.unsplash.com/photo-1584990347449-74d1a581e285', 2500.0, 'active', NOW(), NOW()),
(1, 6, 'Air Fryer Digital 4.5 Liter 800W', 'Menggoreng tanpa minyak sehat dan cepat matang merata', 680000.00, 12, 'RMT-002', 'https://images.unsplash.com/photo-1596797038530-2c107229654b', 3200.0, 'active', NOW(), NOW()),
(1, 6, 'Vacuum Cleaner Portable Handheld', 'Daya hisap kuat 12000Pa untuk kasur, sofa, dan mobil', 299000.00, 25, 'RMT-003', 'https://images.unsplash.com/photo-1558317374-067fb5f30001', 1100.0, 'active', NOW(), NOW()),
(1, 6, 'Lampu Meja LED Dimmable Touch', '3 tingkat keterangan, port USB charging praktis', 110000.00, 45, 'RMT-004', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', 400.0, 'active', NOW(), NOW()),
(1, 6, 'Diffuser Aromaterapi Ultrasonik 500ml', 'Melembabkan udara dengan lampu LED warna-warni', 145000.00, 35, 'RMT-005', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108', 500.0, 'active', NOW(), NOW()),

(1, 7, 'Matras Yoga Anti Slip 6mm NBR', 'Empuk dan nyaman untuk yoga, pilates, senam lantai', 115000.00, 40, 'OLH-001', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f', 900.0, 'active', NOW(), NOW()),
(1, 7, 'Dumbbell Set Neoprene 2 x 3kg', 'Lapisan karet lembut tidak licin dan aman di lantai', 160000.00, 20, 'OLH-002', 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2', 6000.0, 'active', NOW(), NOW()),
(1, 7, 'Tenda Camping Waterproof 4 Orang', 'Bahan polyester tahan air, double layer windproof', 490000.00, 10, 'OLH-003', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4', 2800.0, 'active', NOW(), NOW()),
(1, 7, 'Botol Minum Olahraga 1 Liter BPA Free', 'Bahan tritan food grade dengan penanda waktu minum', 49000.00, 90, 'OLH-004', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8', 200.0, 'active', NOW(), NOW()),
(1, 7, 'Raket Badminton Carbon Fiber', 'Ringan tarikan senar kuat hingga 30 LBS', 275000.00, 22, 'OLH-005', 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95', 150.0, 'active', NOW(), NOW()),

(1, 8, 'Helm Motor Full Face SNI DOT', 'Busa lembut bisa dilepas, kaca visor anti gores', 380000.00, 18, 'OTO-001', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39', 1500.0, 'active', NOW(), NOW()),
(1, 8, 'Oli Mesin Sintetis Mobil 10W-40 4L', 'Perlindungan maksimal mesin bensin terhadap panas tinggi', 360000.00, 25, 'OTO-002', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b', 3800.0, 'active', NOW(), NOW()),
(1, 8, 'Pompa Ban Mobil Elektrik Digital 12V', 'Auto stop saat tekanan ban tercapai, display LED akurat', 215000.00, 30, 'OTO-003', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537', 800.0, 'active', NOW(), NOW()),
(1, 8, 'Sarung Tangan Riding Touchscreen', 'Bahan breathable dengan protector knuckle kokoh', 85000.00, 50, 'OTO-004', 'https://images.unsplash.com/photo-1578632767115-351597cf2477', 150.0, 'active', NOW(), NOW()),
(1, 8, 'Cairan Pengkilap Body Mobil & Motor 250ml', 'Formula hydrophobic nano coating efek daun talas', 55000.00, 65, 'OTO-005', 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9', 300.0, 'active', NOW(), NOW()),

(1, 9, 'Buku Pemrograman Web Modern Fullstack', 'Panduan lengkap JavaScript, Node.js, Express & React', 135000.00, 40, 'BKT-001', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 450.0, 'active', NOW(), NOW()),
(1, 9, 'Buku Desain Sistem & Arsitektur Cloud', 'Strategi merancang aplikasi skalabel dan reliabel', 155000.00, 30, 'BKT-002', 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a', 500.0, 'active', NOW(), NOW()),
(1, 9, 'Notebook Kulit A5 Dotted Grid 160 Hal', 'Kertas tebal 100gsm tidak tembus tinta cocok untuk bullet journal', 58000.00, 80, 'BKT-003', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73', 300.0, 'active', NOW(), NOW()),
(1, 9, 'Gel Pen Set 12 Warna Pastel 0.5mm', 'Tinta lancar tidak mudah macet dan cepat kering', 42000.00, 95, 'BKT-004', 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd', 150.0, 'active', NOW(), NOW()),
(1, 9, 'Kalkulator Ilmiah Saintifik 240 Fungsi', 'Display 2 baris baterai tahan lama untuk pelajar & teknik', 98000.00, 35, 'BKT-005', 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd', 220.0, 'active', NOW(), NOW()),

(1, 10, 'Action Figure Superhero Scale 1:12', 'Sendi artikulasi lengkap dilengkapi aksesoris tangan & senjata', 299000.00, 20, 'MH-001', 'https://images.unsplash.com/photo-1608889175123-8ee362201f81', 300.0, 'active', NOW(), NOW()),
(1, 10, 'Diecast Mobil Klasik Vintage 1:24', 'Bahan metal pintu dan kap mesin bisa dibuka rapi', 185000.00, 25, 'MH-002', 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f', 400.0, 'active', NOW(), NOW()),
(1, 10, 'Rubik Speedcube Magnetik 3x3', 'Putaran sangat licin, magnet kuat untuk kompetisi speedcubing', 85000.00, 45, 'MH-003', 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54', 120.0, 'active', NOW(), NOW()),
(1, 10, 'Board Game Strategi Keluarga Seru', 'Permainan papan taktik 2-4 pemain durasi 45 menit', 245000.00, 15, 'MH-004', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09', 950.0, 'active', NOW(), NOW()),
(1, 10, 'Puzzle 1000 Pcs Pemandangan Alam', 'Bahan karton presisi gambar tajam dan kaya warna', 125000.00, 30, 'MH-005', 'https://images.unsplash.com/photo-1587740896339-96a76170508d', 600.0, 'active', NOW(), NOW());
