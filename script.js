// Product Data - Load from localStorage (admin-managed) or use default
let products = [];

// WhatsApp configuration - merchant number in international format without '+'
const WHATSAPP_NUMBER = '201065777168';


// Socket.IO connection for real-time updates
let socket;

// Initialize Socket.IO connection
function initializeSocket() {
    // Connect to the server (adjust URL if needed)
    socket = io('http://localhost:3000');
    
    // Listen for product updates from server
    socket.on('productsUpdate', (newProducts) => {
        console.log('Received real-time product update');
        products = newProducts;
        // Update localStorage to keep it in sync
        localStorage.setItem('techhub_products', JSON.stringify(products));
        // Refresh the display
        loadProducts();
        showToast('Products updated in real-time!', 'success');
    });
    
    // Handle connection events
    socket.on('connect', () => {
        console.log('Connected to real-time server');
    });
    
    socket.on('disconnect', () => {
        console.log('Disconnected from real-time server');
        showToast('Connection lost. Trying to reconnect...', 'warning');
    });
}

// Function to notify server of admin changes
function notifyServerOfChanges(newProducts) {
    if (socket && socket.connected) {
        socket.emit('adminProductChange', newProducts);
        console.log('Notified server of admin changes');
    }
}

// Load products from localStorage or use default products
function loadProductsFromStorage() {
    // Clear existing products to force reload with new defaults
    localStorage.removeItem('techhub_products');
    
    const savedProducts = localStorage.getItem('techhub_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products if none exist in storage
        products = [
            // Headphones
            {
                id: 1,
                name: "AirPods Pro 2 Plus",
                category: "accessories",
                price: 550,
                originalPrice: 650,
                rating: 4.8,
                reviews: 156,
                image: "5f56dc8d-57c5-4cac-afab-298c238444a1.jpeg",
                badge: "Noise Cancel",
                description: "سماعات أذن مريحة مصنوعة من مواد عالية الجودة جودة صوت فائقة الوضوح علبة شحن لاسلكية بمنفذ USB-C"
            },
            {
                id: 2,
                name: "AirPods Pro 2 Plus",
                category: "accessories",
                price: 500,
                originalPrice: 550,
                rating: 4.7,
                reviews: 89,
                image: "b95ee7d2-0f5c-4072-9969-3eaee5ae3e08.jpeg",
                badge: "Noise Cancel",
                description: "سماعات أذن مريحة مصنوعة من مواد عالية الجودة جودة صوت فائقة الوضوح علبة شحن لاسلكية بمنفذ USB-C"
            },
            {
                id: 3,
                name: "Oraimo Space Buds Neo Premium Earphones 323-OTW",
                category: "accessories",
                price: 750,
                originalPrice: 850,
                rating: 4.6,
                reviews: 67,
                image: "001747a6-92c8-4e45-8a68-766f2e52b899.jpeg",
                badge: "Premium",
                description: "بصوت غامر الأنماط الحياة الديناميكية - اسود سريع"
            },
            {
                id: 4,
                name: "Oraimo Space Buds Neo Premium Earphones 323-OTW",
                category: "accessories",
                price: 950,
                originalPrice: 1050,
                rating: 4.5,
                reviews: 123,
                image: "9864caa6-bc2c-4e24-81d0-61054c1c8ba9.jpeg",
                badge: "Premium",
                description: "بصوت غامر الأنماط الحياة الديناميكية - اسود سريع"
            },
            {
                id: 5,
                name: "Our Imo FreeBuds 3C ANC Noise Cancelling Earphones",
                category: "accessories",
                price: 1000,
                originalPrice: 1100,
                rating: 4.4,
                reviews: 78,
                image: "f00e7c25-734e-468a-aa65-0cc92ffa79be.jpeg",
                badge: "Premium",
                description: "4 ميكروفونات بصوت جهوري قوي، سماعات أذن لاسلكية حقيقية وقت تشغيل طويل مقاومة للماء IPX5 ، عبر التطبيق، أسود"
            },

            
            // Laptops
            {
                id: 6,
                name: "HP EliteBook 745 G6",
                category: "laptops",
                price: 13000,
                originalPrice: 14000,
                rating: 4.6,
                reviews: 45,
                image: "71HLZfVKPxL._UF894,1000_QL80_.jpg",
                badge: "Programming",
                description: "Ryzen 5 Pro 3500U, 16GB RAM DDR4, 256GB SSD, AMD Radeon 2GB Graphics"
            },
            {
                id: 7,
                name: "HP EliteBook 845 G7",
                category: "laptops",
                price: 13000,
                originalPrice: 14000,
                rating: 4.7,
                reviews: 38,
                image: "61L3O0-5-vL._AC_SL1500_.jpg",
                badge: "Programming",
                description: "Ryzen 5 Pro 4650U, 16GB RAM DDR4, 256GB SSD, AMD Radeon 512MB Graphics"
            },
            {
                id: 8,
                name: "HP ZBook 15 3G",
                category: "laptops",
                price: 14500,
                originalPrice: 15500,
                rating: 4.8,
                reviews: 52,
                image: "61LJLbpmmSL.jpg",
                badge: "Workstation",
                description: "Intel i7 6th Gen, 16GB RAM DDR4, 512GB SSD (or 256GB SSD + 500GB HDD), NVIDIA 2GB Graphics"
            },
            {
                id: 9,
                name: "HP ZBook 15 3G",
                category: "laptops",
                price: 17000,
                originalPrice: 18000,
                rating: 4.9,
                reviews: 41,
                image: "fd2abf5c-075e-469b-ac0d-c7318bfdbf0e.jpg",
                badge: "Workstation",
                description: "Intel i7 6th Gen, 16GB RAM DDR4, 512GB SSD (or 256GB SSD + 500GB HDD), NVIDIA 4GB Graphics"
            },
            {
                id: 10,
                name: "HP Laptop",
                category: "laptops",
                price: 8500,
                originalPrice: 9500,
                rating: 4.4,
                reviews: 67,
                image: "815CHS7C3ML._UF894,1000_QL80_.jpg",
                badge: "Value",
                description: "Intel i3 7th Gen, 16GB RAM DDR4, 128GB SSD, NVIDIA 2GB Graphics"
            },
{
                id: 31,
                name: "Hp zbook g8 studio",
                category: "laptops",
                price: 30000,
                originalPrice: 32500,
                rating: 4.4,
                reviews: 85,
                image: "hp-zbook-studio-g8-workstation-preview.jpg",
                badge: "Engineer",
                description: "Hp zbook g8 studio CPU: core i7 11Th H Ram: 32 ddr4 Storage: 512 ssd NVME VGA: Nvidia Q T1200 4g "
            },
            {
                id: 32,
                name: "Hp zbook power g5",
                category: "laptops",
                price: 22500,
                originalPrice: 24000,
                rating: 4.4,
                reviews: 75,
                image: "zbook2biwillz-300x300.jpg",
                badge: "Workstation",
                description: "Hp zbook power g5 CPU: i7 8th H Ram 32 ddr4 Storage 512 ssd nvme VGA nvidia 4 g ddr4"
            },
            {
                id: 33,
                name: "ZBook(fury) g7",
                category: "laptops",
                price: 28000,
                originalPrice: 32000,
                rating: 4.4,
                reviews: 80,
                image: "Zbook-14-g8.png",
                badge: "Workstation",
                description: "ZBook(fury) g7 17.Gen 10 Ram 32 Hard 512 NVME Vga T2000 max 4g"
            },
            {
                id: 34,
                name: "Hp zbook g3",
                category: "laptops",
                price: 15000,
                originalPrice: 15500,
                rating: 4.4,
                reviews: 80,
                image: "Screenshot 2025-08-27 204911.png",
                badge: "Workstation",
                description: "Hp zbook g3 CPU :i7-6 HQ VGA : nvidia Quadro 2g Ram : 16g ddr4 Hard :512 ssd NVME Monitor: 15,6 inch full hd Battery : original معاه شاحن اصلي و الشنطه والماوس وايرليس وستاند معدن واستيكر كيبورد"
            },
            {
                id: 35,
                name: "Hp zbook g3",
                category: "laptops",
                price: 21500,
                originalPrice: 22500,
                rating: 4.4,
                reviews: 74,
                image: "Screenshot 2025-08-28 090537.png",
                badge: "Workstation",
                description: "Dell Precision 3541 - i7 9850H - معالج - ⁠ddr4 16G RAM - رامات - ⁠512G SSD - هارد كارت شاشه خارجي nvidia quadro 4g شاشه 15,6 full hd"
            },
            {
                id: 36,
                name: "Hp zbook g4",
                category: "laptops",
                price: 18500,
                originalPrice: 19000,
                rating: 4.4,
                reviews: 60,
                image: "download.jfif",
                badge: "Workstation",
                description: "Hp zbook g4 CPU :i7-7HQ VGA : nvidia Quadro 4g Ram : 16g ddr4 Hard :512 ssd NVME Monitor: 15,6 inch full hd Battery : original"
            },
            
            // Phones
            {
                id: 11,
                name: "Anker Soundcore R 50i",
                category: "accessories",
                price: 850,
                originalPrice: 950,
                rating: 4.9,
                reviews: 234,
                image: "0018875b-5f44-42ef-b34c-d65c9fefd0fc.jfif",
                badge: "Premium",
                description: "سماعة لاسلكية ساوندكور R50i صوت ستيريو حقيقي ومشغلات 10 ملم وصوت باس من انكر بلوتوث 5.3 مدة تشغيل 30 ساعة ذكاء اصطناعي لوضوح مكالمات مع ميكروفونين معادل مسبق الضبط 22 أسود ار 50 اي داخل الأذن"
            },
            {
                id: 12,
                name: "Air31 Wireless Earbuds with LED Display",
                category: "accessories",
                price: 300,
                originalPrice: 400,
                rating: 4.8,
                reviews: 189,
                image: "2025-Free-Shipping-to-India-Wireless-Headphone-BT-5.0-Earphone-TWS-Wireless-Headset-Earbuds-Free-Sample.avif",
                badge: "Deep Bass Stereo ",
                description: "سماعات أذن اير 31 لاسلكية سلكية شفافة مع صوت جهوري عميق ستيريو سماعة بلوتوث علبة شحن أبيض وأسود وزهري أسود"
            },
            {
                id: 13,
                name: "Xiaomi Redmi Note 13 Pro",
                category: "accessories",
                price: 500,
                originalPrice: 600,
                rating: 4.6,
                reviews: 156,
                image: "5.jpg",
                badge: "Value",
                description: "سماعة رأس بسلك بتقنية بلوتوث 1004-SD من سودو، مزودة بميكروفون مدمج للمشي وممارسة الرياضة والتحدث 3الوان فوق الأذن"
            },
            {
                id: 14,
                name: "P9 Wireless Bluetooth Headset",
                category: "accessories",
                price: 350,
                originalPrice: 400,
                rating: 4.7,
                reviews: 98,
                image: "51aA+ByzrDL._UF350,350_QL80_.jpg",
                badge: "Value",
                description: "سماعة بلوتوث لاسلكية P9 ، تدعم صوت ستيريو نقي وبطاقة ذاكرة (اسود)"
            },
            {
                id: 15,
                name: "Wireless Gaming Headset p47 Cat Ear LED Light",
                category: "accessories",
                price: 250,
                originalPrice: 300,
                rating: 4.8,
                reviews: 145,
                image: "51hjsXn2Z4L._UF350,350_QL80_.jpg",
                badge: "Value",
                description: " سماعة رأس ستيريو بلوتوث لاسلكية 5الوان متوفره P47m بتصميم قطة وإضاءة لید ملونة RGB ، تأتي مع دعم بطاقة الذاكرة، سماعات رأس للألعاب مع ميكروفون مدمج للاب توب والموبايل والأطفال والبنات والكمبيوتر"
            },
            
            // Watches
            {
                id: 16,
                name: "Headphone SD-1104 Wireless Headset",
                category: "accessories",
                price: 450,
                originalPrice: 500,
                rating: 4.9,
                reviews: 267,
                image: "51gL5uwF7iL._UF894,1000_QL80_.jpg",
                badge: "Value",
                description: "سماعة رأس لاسلكية مزودة ببلوتوث V5.3 مع ميكروفون خارجي وتدعم بطاقة SD ، لون أسود، 1104-SD"
            },
            {
                id: 17,
                name: "nulliplex Gaming Headset Xbox one Headset",
                category: "accessories",
                price: 400,
                originalPrice: 450,
                rating: 4.7,
                reviews: 134,
                image: "22861bb2-cb70-4822-98c1-71a87e02469f.jfif",
                badge: "Gaming Headset",
                description: "سماعة راس للالعاب Xbox one مع ميكروفون ستيريو للالعاب وميكروفون دوار مضاد للضوضاء واضاءة LED وشريط راس للتعليق متوافقة مع بلاي ستيشن 4 وبلاي ستيشن 5 و Xbox One ( بي بلو) سلكي، في الاذن"
            },
            {
                id: 18,
                name: "Wireless Headset SD-1102",
                category: "accessories",
                price: 450,
                originalPrice: 500,
                rating: 4.5,
                reviews: 89,
                image: "af4677f7-1534-412f-bfa5-54ae6e759079.jfif",
                badge: "Attractive",
                description: "سماعة رأس لاسلكية 1102-SD بلوتوث 5.3 مع ميكروفون خارجي ودعم بطاقة SD،فوق الأذن"
            },
            {
                id: 19,
                name: "SODO SD-1003, Wireless Headphone",
                category: "accessories",
                price: 450,
                originalPrice: 500,
                rating: 4.6,
                reviews: 112,
                image: "717YbWuza3L._UF894,1000_QL80_.jpg",
                badge: "Bass Sound",
                description: "سماعة فوق الاذن راس بلوتوث 10035-SD وضع مزدوج"
            },
            {
                id: 20,
                name: "Oraimo OSW-805 Watch 5 Smart Watch with",
                category: "watches",
                price: 1250,
                originalPrice: 1400,
                rating: 4.8,
                reviews: 78,
                image: "ec9a4ad9-5874-4559-9f7d-9ccc36257015.jfif",
                badge: "Sports",
                description: "ساعة سمارت ووتش 2.015 بوصة من اورايمو، مقاومة للماء HD بلون أسود كروم فاتح"
            },
            
            // Tech Accessories
            {
                id: 21,
                name: "Oraimo Watch 2R Bluetooth SmartWatch for Men&Women",
                category: "watches",
                price: 1500,
                originalPrice: 1600,
                rating: 4.9,
                reviews: 203,
                image: "e5ca24e8-fbbb-4cea-92ee-c9e702d88ea9.jfif",
                badge: "Sports",
                description: "ساعة ذكية بلوتوث 2R للرجال والنساء من اورايمو ساعة لياقة بدنية ذكية 1.39 HD مع عداد خطوات ومراقب معدل ضربات القلب، اكثر من 120 وضع رياضي ورد سريع على الرسائل القصيرة اسود، ضمان لمدة عام"
            },
            {
                id: 22,
                name: "Generic T800 Ultra Smart Watch",
                category: "watches",
                price: 450,
                originalPrice: 500,
                rating: 4.8,
                reviews: 167,
                image: "T800-Smart-Watch.jpg",
                badge: "Value",
                description: "ساعة ذكية T800 الترا ان اف سي بمكالمات بلوتوث وشحن لاسلكي (برتقالي)"
            },
            {
                id: 23,
                name: "T900 Ultra 2 big NFC Smart Watch Bluetooth",
                category: "watches",
                price: 550,
                originalPrice: 600,
                rating: 4.6,
                reviews: 89,
                image: "3fa5965a-00c2-4d0a-8263-642d05627647.jfif",
                badge: "Value",
                description: "ساعة ذكية 900T الترا ان اف سي بمكالمات بلوتوث وشحن لاسلكي (برتقالي)"
            },
            {
                id: 24,
                name: "ADHOMAX New 2025 T1000 Ultra2 smart watch",
                category: "watches",
                price: 450,
                originalPrice: 500,
                rating: 4.7,
                reviews: 145,
                image: "3f66b873-5e5f-4bf1-8331-56c49e2d326b.jfif",
                badge: "Value",
                description: "ساعة ذكية 2025 T1000 الترا 2 بتصميم أنيق 2.08 بوصة، ان اف سي شاشة لانهائية لتتبع اللياقة البدنية ومعدل ضربات القلب المكالمات والشحن اللاسلكي لأجهزة IOS وأندرويد للرجال والنساء من ادهوماكس، أزرق غامق"
            },
            {
                id: 25,
                name: "X-Inova Germany MX 10 Smart Watch",
                category: "watches",
                price: 1000,
                originalPrice: 1200,
                rating: 4.8,
                reviews: 112,
                image: "451c9be5-fb36-403c-b51c-1a89c11a68eb.jfif",
                badge: "Premium",
                description: "ساعة ذكية الالمانية ام اكس 10 من اكس - انوفا مع 7 اساور ساعة عصرية وتعمل دائما على مدار اليوم"
            },
            {
                id: 26,
                name: "AM72 MAX Smart Watch",
                category: "watches",
                price: 850,
                originalPrice: 950,
                rating: 4.7,
                reviews: 98,
                image: "9914df91-928c-41b8-ae93-707b57dee28b.jfif",
                badge: "Premium",
                description: "ساعة M72 ماكس ذكية شاشة عالية الدقة 49 HD ملم، وظيفة متتبع اللياقة البدنية تدعم الشحن اللاسلكي وإجراء المكالمات متوافقة مع iOS وأندرويد للرجال والنساء، ساعتان و 7 أساور بأنماط طباعة متنوعة"
            },
            {
                id: 27,
                name: "Anker 511 USB C Charger Block (Nano Pro)",
                category: "tech_accessories",
                price: 510,
                originalPrice: 580,
                rating: 4.9,
                reviews: 234,
                image: "71EUSF2OEnL._AC_SX522_.jpg",
                badge: "Fast",
                description: "شاحن Anker 511 USB C (Nano Pro)، شاحن سريع صغير الحجم PIQ 3.0 لأجهزة iPhone 16/16 Plus/16 Pro/16 Pro Max، سلسلة 15/14/13، Galaxy، Pixel 4/3، iPad (الكابل غير متضمن)"
            },
            {
                id: 28,
                name: "Anker USB C Charger, 20W Fast Charger",
                category: "tech_accessories",
                price: 160,
                originalPrice: 200,
                rating: 4.6,
                reviews: 76,
                image: "images.jfif",
                badge: "Value",
                description: "شاحن Anker USB C، شاحن سريع 20 وات مع قابس قابل للطي، شاحن PowerPort III مكعب 20 وات لهاتف iPhone 14/14 Plus/14 Pro/14 Pro Max/13، Galaxy، Pixel 4/3، iPad/iPad Mini، كابل الشحن غير متضمن"
            },
            {
                id: 29,
                name: "Anker New Nylon USB-C to USB-C Cable",
                category: "tech_accessories",
                price: 210,
                originalPrice: 260,
                rating: 4.5,
                reviews: 67,
                image: "Screenshot 2025-08-25 141838.png",
                badge: "Premium",
                description: "10-inch ring light, 3 color temperatures, Adjustable brightness, Phone holder included"
            },
            {
                id: 30,
                name: "Anker 318 Wireless Charger (Pad) (Wireless Charger, Qi Certified)",
                category: "tech_accessories",
                price: 950,
                originalPrice: 1100,
                rating: 4.4,
                reviews: 89,
                image: "51IZ24O2w5L._AC_SX522_.jpg",
                badge: "Fast Charge",
                description: "شاحن لاسلكي Anker 318 (لوح) (شاحن لاسلكي، معتمد من Qi)، متوافق مع iPhone 14/13، مخرج يصل إلى 10 وات، كابل USB-C وUSB-A متضمن، يدعم مدخل النوع C"
            }
        ];
        // Save default products to localStorage
        localStorage.setItem('techhub_products', JSON.stringify(products));
    }
    filteredProducts = [...products];
}

// Global Variables
let cart = [];
let currentCategory = 'all';
let currentView = 'grid';
let filteredProducts = [...products];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const filterBtn = document.getElementById('filterBtn');
const filterSidebar = document.getElementById('filterSidebar');
const closeFilter = document.getElementById('closeFilter');
const searchInput = document.getElementById('searchInput');
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const modal = document.getElementById('quickViewModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutModal = document.getElementById('closeCheckoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const cancelCheckout = document.getElementById('cancelCheckout');
const submitOrder = document.getElementById('submitOrder');
const checkoutItems = document.getElementById('checkoutItems');
const checkoutTotal = document.getElementById('checkoutTotal');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromStorage();
    setupEventListeners();
    updateCartDisplay();
    loadProducts();
});

// Function to refresh products from admin updates
function refreshProductsFromAdmin() {
    loadProductsFromStorage();
    loadProducts();
}

// Function to check for admin updates periodically
function checkForAdminUpdates() {
    // Check if products have been updated in localStorage
    const currentProducts = localStorage.getItem('techhub_products');
    if (currentProducts) {
        const newProducts = JSON.parse(currentProducts);
        // Compare with current products array
        if (JSON.stringify(newProducts) !== JSON.stringify(products)) {
            refreshProductsFromAdmin();
        }
    }
}

// Set up periodic checking for admin updates
setInterval(checkForAdminUpdates, 2000); // Check every 2 seconds

// Event Listeners
function setupEventListeners() {
    // Cart functionality
    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // Filter functionality
    filterBtn.addEventListener('click', toggleFilter);
    closeFilter.addEventListener('click', toggleFilter);
    
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Mobile menu
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Modal
    closeModal.addEventListener('click', closeQuickView);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeQuickView();
    });
    
    // Checkout functionality
    checkoutBtn.addEventListener('click', openCheckout);
    closeCheckoutModal.addEventListener('click', closeCheckout);
    cancelCheckout.addEventListener('click', closeCheckout);
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckout();
    });
    checkoutForm.addEventListener('submit', handleCheckout);
    
    // Category filters
    document.querySelectorAll('.category-card, .category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.closest('[data-category]').dataset.category;
            filterByCategory(category);
        });
    });
    
    // View toggles
    document.querySelectorAll('.view-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.closest('[data-view]').dataset.view;
            changeView(view);
        });
    });
    
    // Sort functionality
    document.querySelector('.sort-select').addEventListener('change', handleSort);
    
    // Load more
    loadMoreBtn.addEventListener('click', loadMoreProducts);
    
    // Price range
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = `EGP ${e.target.value}`;
        });
    }
    
    // Apply filters
    document.querySelector('.apply-filters').addEventListener('click', applyFilters);
}

// Product Loading
function loadProducts() {
    productsGrid.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card loading';
    
    // Handle image display - check if it's a base64 image or URL
    let imageDisplay;
    if (product.image && product.image.startsWith('data:image')) {
        // Base64 image
        imageDisplay = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">`;
    } else if (product.image && product.image !== '💻' && product.image !== '📱' && product.image !== '🎧' && product.image !== '⌚' && product.image !== '🖱️' && product.image !== '🔋' && product.image !== '🔌' && !product.image.startsWith('http')) {
        // URL or other image format (but not emoji)
        imageDisplay = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">`;
    } else {
        // Emoji fallback
        imageDisplay = `<div style="font-size: 4rem; text-align: center; height: 200px; display: flex; align-items: center; justify-content: center;">${product.image}</div>`;
    }
    
    card.innerHTML = `
        <div class="product-image">
            ${imageDisplay}
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span class="rating-text">(${product.reviews})</span>
            </div>
            <div class="product-price">
                ${product.originalPrice > product.price ? 
                    `<div class="price-container">
                        <span class="currency">EGP</span>
                        <span class="current-price">${product.price.toFixed(0)}</span>
                        <span class="original-price">${product.originalPrice.toFixed(0)}</span>
                        <span class="discount-percentage">${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
                    </div>` : 
                    `<div class="price-container">
                        <span class="currency">EGP</span>
                        <span class="current-price">${product.price.toFixed(0)}</span>
                    </div>`
                }
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="quick-view" onclick="openQuickView(${product.id})">
                    <i class="fas fa-eye"></i> Quick View
                </button>
            </div>
        </div>
    `;
    
    // Add loading animation
    setTimeout(() => card.classList.add('loaded'), 100);
    
    return card;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Cart Functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showToast('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showToast('Product removed from cart!', 'info');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
    }
}

// Delivery cost calculation
function calculateDeliveryCost(subtotal) {
    // Free delivery for orders over 5000 EGP
    if (subtotal >= 5000) {
        return 0;
    }
    // Standard delivery cost of 50 EGP for orders under 5000 EGP
    return 20;
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCost = calculateDeliveryCost(subtotal);
    const totalPrice = subtotal + deliveryCost;
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `EGP ${totalPrice.toFixed(2)}`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
    } else {
        // Add delivery cost breakdown
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryCost = calculateDeliveryCost(subtotal);
        const totalPrice = subtotal + deliveryCost;
        
        const deliveryInfo = deliveryCost > 0 ? `
            <div class="cart-delivery-info">
                <div class="delivery-breakdown">
                    <span>Subtotal:</span>
                    <span>EGP ${subtotal.toFixed(2)}</span>
                </div>
                <div class="delivery-breakdown">
                    <span>Delivery:</span>
                    <span>EGP ${deliveryCost.toFixed(2)}</span>
                </div>
                <div class="delivery-breakdown total">
                    <span>Total:</span>
                    <span>EGP ${totalPrice.toFixed(2)}</span>
                </div>
            </div>
        ` : '';
        cartItems.innerHTML = cart.map(item => {
            // Handle image display in cart
            let cartImageDisplay;
            if (item.image && item.image.startsWith('data:image')) {
                cartImageDisplay = `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">`;
            } else if (item.image && item.image !== '💻' && item.image !== '📱' && item.image !== '🎧' && item.image !== '⌚' && item.image !== '🖱️' && item.image !== '🔋' && item.image !== '🔌' && !item.image.startsWith('http')) {
                cartImageDisplay = `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">`;
            } else {
                cartImageDisplay = `<div style="font-size: 1.5rem; text-align: center; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">${item.image}</div>`;
            }
            
            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        ${cartImageDisplay}
                    </div>
                    <div class="cart-item-details">
                                            <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">EGP ${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('') + deliveryInfo;
    }
}

// Checkout Functionality
function openCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Load checkout items
    loadCheckoutItems();
    
    // Show checkout modal
    checkoutModal.classList.add('active');
    cartSidebar.classList.remove('active');
}

function closeCheckout() {
    checkoutModal.classList.remove('active');
}

function loadCheckoutItems() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCost = calculateDeliveryCost(subtotal);
    const totalPrice = subtotal + deliveryCost;
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-name">${item.name} (x${item.quantity})</div>
            <div class="order-item-price">EGP ${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('') + `
        <div class="order-item delivery-item">
            <div class="order-item-name">Subtotal</div>
            <div class="order-item-price">EGP ${subtotal.toFixed(2)}</div>
        </div>
        <div class="order-item delivery-item">
            <div class="order-item-name">${deliveryCost === 0 ? 'Free Delivery' : 'Delivery Cost'}</div>
            <div class="order-item-price">${deliveryCost === 0 ? 'FREE' : `EGP ${deliveryCost.toFixed(2)}`}</div>
        </div>
    `;
    
    checkoutTotal.textContent = `EGP ${totalPrice.toFixed(2)}`;
}

function handleCheckout(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(checkoutForm);
    const customerData = {
        name: formData.get('customerName'),
        phone: formData.get('customerPhone'),
        address: formData.get('addressLine1'),
        notes: formData.get('notes')
    };
    
    // Validate required fields
    if (!customerData.name || !customerData.phone || !customerData.address) {
        showToast('Please fill in all required fields!', 'error');
        return;
    }
    
    // Show loading state
    submitOrder.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitOrder.disabled = true;
    
    // Prepare order data
    const orderData = {
        customer: customerData,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toLocaleString(),
        orderId: generateOrderId()
    };
    
    // Process order and redirect to WhatsApp
    processOrder(orderData);
}

function processOrder(orderData) {
    // Save order to localStorage for admin page
    saveOrderToAdmin(orderData);
    
    // Redirect customer to WhatsApp with order details
    redirectToWhatsApp(orderData);
    
    // Finalize locally
    handleOrderSuccess(orderData);
}

// Order processing - redirects to WhatsApp

function redirectToWhatsApp(orderData) {
    try {
        const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryCost = calculateDeliveryCost(subtotal);
        const totalPrice = subtotal + deliveryCost;
        
        const itemsText = orderData.items.map(item =>
            `- ${item.name} x${item.quantity} = EGP ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');

        const message = [
            `New Order #${orderData.orderId}`,
            `Name: ${orderData.customer.name}`,
            `Phone: ${orderData.customer.phone}`,
            `Address: ${orderData.customer.address}`,
            `Notes: ${orderData.customer.notes || 'None'}`,
            '',
            'Items:',
            itemsText,
            '',
            `Subtotal: EGP ${subtotal.toFixed(2)}`,
            `Delivery: ${deliveryCost === 0 ? 'FREE' : `EGP ${deliveryCost.toFixed(2)}`}`,
            `Total: EGP ${totalPrice.toFixed(2)}`,
            `Date: ${orderData.orderDate}`
        ].join('\n');

        const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        const appUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

        if (isMobileDevice()) {
            try {
                // Try to open WhatsApp app first
                window.location.href = appUrl;
                // Fallback to web after short delay if app not available
                setTimeout(() => {
                    window.open(webUrl, '_blank');
                }, 1200);
            } catch (e) {
                window.open(webUrl, '_blank');
            }
        } else {
            // Desktop: open WhatsApp Web
            window.open(webUrl, '_blank');
        }
    } catch (err) {
        console.error('Failed to open WhatsApp:', err);
    }
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent);
}

function saveOrderToAdmin(orderData) {
    // Get existing orders from localStorage
    const existingOrders = localStorage.getItem('techhub_orders');
    let orders = existingOrders ? JSON.parse(existingOrders) : [];
    
    // Add status to order data
    orderData.status = 'pending';
    
    // Add new order to beginning of array
    orders.unshift(orderData);
    
    // Save back to localStorage
    localStorage.setItem('techhub_orders', JSON.stringify(orders));
    
    // Try to notify admin page if it's open
    try {
        if (window.opener && window.opener.addNewOrder) {
            window.opener.addNewOrder(orderData);
        }
    } catch (e) {
        // Admin page not open, that's okay
    }
}



// Handle success after order submission
function handleOrderSuccess(orderData) {
    // Reset form
    checkoutForm.reset();
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    // Close checkout modal
    closeCheckout();
    
    // Show success message
    showToast(`The customer's request has been sent. Order #${orderData.orderId}`, 'success');
    
    // Reset submit button
    submitOrder.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Order';
    submitOrder.disabled = false;
    
    // Log order details (for development)
    console.log('Order submitted:', orderData);
    
    // Show additional success message
    setTimeout(() => {
        showToast('Order saved to admin dashboard', 'info');
    }, 2000);
}

function generateOrderId() {
    return 'ORD-' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
}



// Toggle Functions
function toggleCart() {
    cartSidebar.classList.toggle('active');
}

function toggleFilter() {
    filterSidebar.classList.toggle('active');
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Search Functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    loadProducts();
}

// Filter Functionality
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active states
    document.querySelectorAll('.category-card, .category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll(`[data-category="${category}"]`).forEach(btn => {
        btn.classList.add('active');
    });
    
    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    loadProducts();
}

function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('.filter-option input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    
    filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.includes(product.category);
        const priceMatch = product.price <= maxPrice;
        return categoryMatch && priceMatch;
    });
    
    loadProducts();
    toggleFilter();
    showToast('Filters applied!', 'success');
}

// Sort Functionality
function handleSort(e) {
    const sortBy = e.target.value;
    
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Featured - keep original order
            break;
    }
    
    loadProducts();
}

// View Toggle
function changeView(view) {
    currentView = view;
    
    document.querySelectorAll('.view-toggle').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    if (view === 'list') {
        productsGrid.style.gridTemplateColumns = '1fr';
    } else {
        productsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    }
}

// Quick View Modal
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Handle image display in quick view
    let quickViewImageDisplay;
    if (product.image && product.image.startsWith('data:image')) {
        quickViewImageDisplay = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px;">`;
    } else if (product.image && product.image !== '💻' && product.image !== '📱' && product.image !== '🎧' && product.image !== '⌚' && product.image !== '🖱️' && product.image !== '🔋' && product.image !== '🔌' && !product.image.startsWith('http')) {
        quickViewImageDisplay = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px;">`;
    } else {
        quickViewImageDisplay = `<div style="height: 300px; font-size: 5rem; display: flex; align-items: center; justify-content: center;">${product.image}</div>`;
    }
    
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
            <div class="product-image">
                ${quickViewImageDisplay}
            </div>
            <div>
                <div class="product-category">${product.category}</div>
                <h2 style="margin: 1rem 0; color: #1e293b;">${product.name}</h2>
                <div class="product-rating" style="margin-bottom: 1rem;">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price" style="margin-bottom: 1.5rem;">
                    ${product.originalPrice > product.price ? 
                        `<div class="price-container">
                            <span class="currency">EGP</span>
                            <span class="current-price">${product.price.toFixed(0)}</span>
                            <span class="original-price">${product.originalPrice.toFixed(0)}</span>
                            <span class="discount-percentage">${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
                        </div>` : 
                        `<div class="price-container">
                            <span class="currency">EGP</span>
                            <span class="current-price">${product.price.toFixed(0)}</span>
                        </div>`
                    }
                </div>
                <p style="color: #64748b; line-height: 1.6; margin-bottom: 2rem;">
                    ${product.description}
                </p>
                <button class="add-to-cart" onclick="addToCart(${product.id}); closeQuickView();" style="width: 100%; padding: 1rem;">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeQuickView() {
    modal.classList.remove('active');
}

// Load More Products (simulated)
function loadMoreProducts() {
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more products
    setTimeout(() => {
        // In a real app, you would fetch more products from an API
        showToast('More products loaded!', 'success');
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Products';
        loadMoreBtn.disabled = false;
    }, 1500);
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Close sidebars when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.cart-sidebar') && !e.target.closest('.cart-btn')) {
        cartSidebar.classList.remove('active');
    }
    
    if (!e.target.closest('.filter-sidebar') && !e.target.closest('.filter-btn')) {
        filterSidebar.classList.remove('active');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cartSidebar.classList.remove('active');
        filterSidebar.classList.remove('active');
        modal.classList.remove('active');
        checkoutModal.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe product cards for animation
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => observer.observe(card));
    
    // Initialize real-time synchronization
    initializeSocket();
    
    // Load initial data
    loadProductsFromStorage();
    loadProducts();
    setupEventListeners();
}); 





