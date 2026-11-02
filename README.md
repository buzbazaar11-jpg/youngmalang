# Remix of Young Malang

me tumhe eik code de rha muje is ko fix enhance arrange step by step order m har eik chez aur update kr k do make sure that dont remove any line single character or any letter bs is m kuch static foods add kro har section m static data ta k muje structuer ki smj aye aur is ko update karo eng m means next level par
 
<?php include('partials-front/menu.php'); ?>
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Foodie - Order Your Favourite Food</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#c8102e', // KFC / food red
                        primaryDark: '#a30824',
                        secondary: '#ffcc00', // yellow accent
                        dark: '#1a1a1a',
                    },
                    fontFamily: {
                        heading: ['Poppins', 'sans-serif'],
                        body: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    animation: {
                        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                        'pulse-slow': 'pulseSlow 3s infinite',
                    },
                    keyframes: {
                        fadeInUp: {
                            '0%': { opacity: '0', transform: 'translateY(30px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        pulseSlow: {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.04)' },
                        }
                    }
                }
            }
        }
    </script>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" defer></script>
    <style>
        .hero-bg {
            background: linear-gradient(rgba(0,0,0,0.58), rgba(0,0,0,0.72)),
                        url('https://images.unsplash.com/photo-1600891964096-4316024c7c8f?auto=format&fit=crop&q=80&w=2000') center/cover no-repeat;
        }
        .nav-blur {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
    </style>
</head>
<body class="bg-gray-50 font-body text-gray-800">
    <!-- ========================
          HEADER / NAVIGATION
    ========================= -->
    <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <nav class="nav-blur bg-white/80 border-b border-gray-200/50">
            <div class="container mx-auto px-5 lg:px-12">
                <div class="flex items-center justify-between h-16 md:h-20">
                    <!-- Logo -->
                    <a href="<?php echo SITEURL; ?>" class="flex items-center gap-3 font-heading font-extrabold text-2xl md:text-3xl text-primary">
                        <span class="text-secondary">F</span>oodie
                    </a>
                    <!-- Desktop Menu (you can keep your existing menu.php logic here) -->
                    <div class="hidden md:flex items-center gap-8">
                        <a href="#" class="font-medium hover:text-primary transition-colors">Home</a>
                        <a href="#" class="font-medium hover:text-primary transition-colors">Restaurants</a>
                        <a href="#" class="font-medium hover:text-primary transition-colors">Deals</a>
                        <a href="#" class="font-medium hover:text-primary transition-colors">Contact</a>
                    </div>
                    <!-- Right Side Icons / Actions -->
                    <div class="flex items-center gap-4 md:gap-6">
                        <!-- Search Icon (mobile) -->
                        <button class="md:hidden text-2xl text-gray-700 hover:text-primary">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                        <!-- Cart -->
                        <a href="#" class="relative text-2xl text-gray-700 hover:text-primary transition-colors">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            <span class="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                0
                            </span>
                        </a>
                        <!-- Login / Profile -->
                        <a href="#" class="hidden md:inline-flex items-center gap-2 font-medium hover:text-primary">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <span>Sign In</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </header>
    <!-- ========================
            HERO SECTION
    ========================= -->
    <section class="hero-bg min-h-screen flex items-center pt-20 md:pt-0">
        <div class="container mx-auto px-5 lg:px-12">
            <div class="max-w-4xl mx-auto text-center text-white">
                <h1 class="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold leading-tight mb-6 drop-shadow-2xl"
                    data-aos="fade-up" data-aos-duration="900">
                    Hungry? <span class="text-secondary">Order Now!</span>
                </h1>
                <p class="text-lg md:text-2xl font-light mb-10 md:mb-12 drop-shadow-lg max-w-3xl mx-auto"
                   data-aos="fade-up" data-aos-delay="150" data-aos-duration="900">
                    Get your favourite food delivered fast from the best restaurants around you.
                </p>
                <!-- Search Form -->
                <form action="<?php echo SITEURL; ?>food-search.php" method="POST"
                      class="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 md:gap-5"
                      data-aos="zoom-in" data-aos-delay="300" data-aos-duration="800">
                    <input
                        type="search"
                        name="search"
                        placeholder="Search for restaurants, cuisines or dishes..."
                        required
                        class="flex-1 px-6 py-5 rounded-full text-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-secondary focus:border-transparent shadow-xl transition-all"
                    >
                    <button
                        type="submit"
                        name="submit"
                        class="bg-primary hover:bg-primaryDark text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-red-700/40 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 justify-center"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        Search
                    </button>
                </form>
                <!-- Quick tags / popular searches -->
                <div class="mt-10 flex flex-wrap justify-center gap-3 md:gap-4 opacity-90"
                     data-aos="fade-up" data-aos-delay="500">
                    <span class="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium">Pizza</span>
                    <span class="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium">Burger</span>
                    <span class="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium">Biryani</span>
                    <span class="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium">Rolls</span>
                    <span class="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium">Deals</span>
                </div>
            </div>
        </div>
    </section>
    <!-- Session Message (just below hero) -->
    <?php
    if(isset($_SESSION['order'])) {
        echo '<div class="container mx-auto px-5 lg:px-12 py-6">';
        echo '<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-5 rounded-r-lg">';
        echo $_SESSION['order'];
        unset($_SESSION['order']);
        echo '</div>';
        echo '</div>';
    }
    ?>
    <!-- AOS Initialization -->
    <script>
        AOS.init({
            once: true,
            duration: 800,
            easing: 'ease-out'
        });
    </script>
    <!-- Abhi ke liye yahan tak hi – categories aur baaki sections agle part mein -->
    <!-- ========================
     FLASH DEALS / CURRENT OFFERS SECTION
     (Polished + Structured + Comments for easy backend integration)
     Features:
     - 2 static cards for quick preview / fallback
     - Dynamic cards from database
     - Horizontal scroll + snap on mobile
     - Hover scale + shadow effects
     - Discount badge + timer placeholder
========================= -->
<section class="py-14 md:py-20 bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto px-5 lg:px-12">
        <!-- Section Heading -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900"
                data-aos="fade-right" data-aos-duration="900">
                🔥 Flash Deals & Limited Offers
            </h2>
            <a href="<?php echo SITEURL; ?>deals.php"
               class="text-primary font-semibold hover:text-primaryDark transition-colors flex items-center gap-2 text-lg group">
                View All Deals
                <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
        <!-- Deals Wrapper - Horizontal scroll on mobile, natural layout on desktop -->
        <div class="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide"
             data-aos="fade-up" data-aos-delay="150">
            <!-- =====================================
                 STATIC CARD 1 - Example / Fallback
                 (No database needed - just for structure understanding)
            ====================================== -->
            <div class="min-w-[320px] sm:min-w-[360px] bg-white rounded-3xl shadow-lg overflow-hidden
                        transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl snap-start group">
                <div class="relative">
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Pizza Deal"
                        class="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    >
                    <div class="absolute top-5 right-5 bg-red-600 text-white font-bold px-5 py-2 rounded-full text-sm shadow-lg animate-pulse">
                        40% OFF
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent h-32"></div>
                    <div class="absolute bottom-6 left-6 text-white">
                        <p class="text-sm font-medium opacity-90">Today Only</p>
                        <h3 class="text-2xl font-bold">Buy 1 Get 1 Free Pizza</h3>
                    </div>
                </div>
                <div class="p-6">
                    <p class="text-gray-600 mb-5 line-clamp-2">
                        Cheesy loaded pizza with your favorite toppings. Limited stock – grab fast!
                    </p>
                    <!-- Timer placeholder - backend mein yahan dynamic countdown JS daal sakte ho -->
                    <!-- <div class="text-sm text-red-600 font-medium mb-4">Ends in: <span id="timer-1">02:47:19</span></div> -->
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-2xl font-bold text-primary">$11.99</span>
                            <span class="text-gray-400 line-through ml-2">$19.99</span>
                        </div>
                        <a href="#" class="bg-primary hover:bg-primaryDark text-white px-7 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg">
                            Grab Deal
                        </a>
                    </div>
                </div>
            </div>
            <!-- =====================================
                 STATIC CARD 2 - Another example card
            ====================================== -->
            <div class="min-w-[320px] sm:min-w-[360px] bg-white rounded-3xl shadow-lg overflow-hidden
                        transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl snap-start group">
                <div class="relative">
                    <img
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Burger Deal"
                        class="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    >
                    <div class="absolute top-5 left-5 bg-yellow-500 text-black font-bold px-5 py-2 rounded-full text-sm shadow-lg">
                        Combo Deal
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-2xl font-bold mb-3">Burger + Fries + Drink</h3>
                    <p class="text-gray-600 mb-5 line-clamp-2">
                        Classic burger meal – choose any burger + fries + soft drink.
                    </p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-primary">$7.99</span>
                        <a href="#" class="bg-primary hover:bg-primaryDark text-white px-7 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg">
                            Order Now
                        </a>
                    </div>
                </div>
            </div>
            <?php
            // =============================================
            // DYNAMIC DEALS FROM DATABASE
            // =============================================
            // Important Notes for Integration:
            // 1. Table name: tbl_deals (ya jo bhi naam rakha hai)
            // 2. Columns example: id, title, description, price, old_price, discount_text, image_name, active, featured, end_time
            // 3. Image path: images/deals/ folder mein save karo
            // 4. Admin panel se deals add karne ka option banao
            $sql = "SELECT * FROM tbl_deals WHERE active = 'Yes' AND featured = 'Yes' ORDER BY id DESC LIMIT 8";
            $res = mysqli_query($conn, $sql);
            if ($res && mysqli_num_rows($res) > 0) {
                while ($row = mysqli_fetch_assoc($res)) {
                    $deal_id = $row['id'];
                    $title = htmlspecialchars($row['title']);
                    $description = htmlspecialchars($row['description']);
                    $price = $row['price'];
                    $old_price = $row['old_price'] ?? '';
                    $discount_text = $row['discount_text'] ?? 'Hot Deal';
                    $image_name = $row['image_name'];
                    $end_time = $row['end_time'] ?? ''; // for future timer
            ?>
                    <!-- DYNAMIC DEAL CARD -->
                    <div class="min-w-[320px] sm:min-w-[360px] bg-white rounded-3xl shadow-lg overflow-hidden
                                transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl snap-start group">
                        <div class="relative">
                            <?php if (!empty($image_name)) { ?>
                                <img src="<?php echo SITEURL; ?>images/deals/<?php echo $image_name; ?>"
                                     alt="<?php echo $title; ?>"
                                     class="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-1000 ease-out">
                            <?php } else { ?>
                                <div class="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            <?php } ?>
                            <div class="absolute top-5 right-5 bg-red-600 text-white font-bold px-5 py-2 rounded-full text-sm shadow-lg">
                                <?php echo $discount_text; ?>
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent h-32"></div>
                            <div class="absolute bottom-6 left-6 text-white">
                                <p class="text-sm opacity-90">Limited Time</p>
                                <h3 class="text-2xl font-bold"><?php echo $title; ?></h3>
                            </div>
                        </div>
                        <div class="p-6">
                            <p class="text-gray-600 mb-5 line-clamp-2"><?php echo $description; ?></p>
                            <!-- Timer placeholder - future mein JS se countdown add kar sakte ho -->
                            <!-- <div class="text-sm text-red-600 font-medium mb-4">Ends in: <span class="countdown" data-end="<?php //echo $end_time; ?>"></span></div> -->
                            <div class="flex items-center justify-between">
                                <div>
                                    <span class="text-2xl font-bold text-primary">$<?php echo number_format($price, 2); ?></span>
                                    <?php if ($old_price) { ?>
                                        <span class="text-gray-400 line-through ml-2">$<?php echo number_format($old_price, 2); ?></span>
                                    <?php } ?>
                                </div>
                                <a href="<?php echo SITEURL; ?>order.php?deal_id=<?php echo $deal_id; ?>"
                                   class="bg-primary hover:bg-primaryDark text-white px-7 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg">
                                    Grab Deal
                                </a>
                            </div>
                        </div>
                    </div>
            <?php
                }
            } else {
                // No dynamic deals found
            ?>
                <div class="min-w-full text-center py-16 text-gray-600 text-lg">
                    No active flash deals right now. Check back soon!
                </div>
            <?php } ?>
        </div>
        <!-- Mobile "See More" button -->
        <div class="text-center mt-8 md:hidden">
            <a href="<?php echo SITEURL; ?>deals.php"
               class="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-full font-bold shadow-xl hover:bg-primaryDark transition-all duration-300 hover:shadow-2xl">
                See All Deals
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
    </div>
</section>
<!-- Required style for smooth horizontal scroll -->
<style>
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
<!-- ========================
     CATEGORIES SECTION - Explore Foods
     (Modern grid + hover effects + dynamic from DB)
     Features:
     - Responsive grid (1 col mobile → 3-4 col desktop)
     - Image zoom on hover
     - Overlay title with gradient
     - Static examples + dynamic loop
     - Easy to integrate with your existing tbl_category
========================= -->
<section class="py-14 md:py-20 bg-white">
    <div class="container mx-auto px-5 lg:px-12">
        <!-- Section Heading -->
        <div class="text-center mb-10 md:mb-14">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900"
                data-aos="fade-up" data-aos-duration="900">
                Explore Our Categories
            </h2>
            <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
               data-aos="fade-up" data-aos-delay="150">
                Discover delicious cuisines and dishes from your favorite categories
            </p>
        </div>
        <!-- Categories Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <!-- =====================================
                 STATIC CATEGORY 1 - Example / Fallback
            ====================================== -->
            <a href="<?php echo SITEURL; ?>category-foods.php?category_id=example1"
               class="group block bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div class="relative h-56 md:h-64 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Pizza"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <h3 class="absolute bottom-6 left-6 right-6 text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                        Pizza
                    </h3>
                </div>
            </a>
            <!-- STATIC CATEGORY 2 -->
            <a href="<?php echo SITEURL; ?>category-foods.php?category_id=example2"
               class="group block bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div class="relative h-56 md:h-64 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Burger"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <h3 class="absolute bottom-6 left-6 right-6 text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                        Burgers
                    </h3>
                </div>
            </a>
            <!-- STATIC CATEGORY 3 (optional third example) -->
            <a href="<?php echo SITEURL; ?>category-foods.php?category_id=example3"
               class="group block bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hidden lg:block">
                <div class="relative h-56 md:h-64 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Biryani"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <h3 class="absolute bottom-6 left-6 right-6 text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                        Biryani
                    </h3>
                </div>
            </a>
            <?php
            // =============================================
            // DYNAMIC CATEGORIES FROM DATABASE
            // =============================================
            // Using your existing table: tbl_category
            // Only featured & active categories
            // You already have similar code in original - just modernized
            $sql = "SELECT * FROM tbl_category WHERE active='Yes' AND featured='Yes' ORDER BY id DESC LIMIT 8";
            $res = mysqli_query($conn, $sql);
            if ($res && mysqli_num_rows($res) > 0) {
                while ($row = mysqli_fetch_assoc($res)) {
                    $cat_id = $row['id'];
                    $cat_title = htmlspecialchars($row['title']);
                    $cat_image = $row['image_name'];
            ?>
                    <!-- DYNAMIC CATEGORY CARD -->
                    <a href="<?php echo SITEURL; ?>category-foods.php?category_id=<?php echo $cat_id; ?>"
                       class="group block bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                        <div class="relative h-56 md:h-64 overflow-hidden">
                            <?php
                            if (!empty($cat_image)) {
                            ?>
                                <img src="<?php echo SITEURL; ?>images/category/<?php echo $cat_image; ?>"
                                     alt="<?php echo $cat_title; ?>"
                                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out">
                            <?php } else { ?>
                                <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
                                    No Image
                                </div>
                            <?php } ?>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            <h3 class="absolute bottom-6 left-6 right-6 text-white text-2xl md:text-3xl font-bold drop-shadow-lg text-center">
                                <?php echo $cat_title; ?>
                            </h3>
                        </div>
                    </a>
            <?php
                }
            } else {
                // No categories found
            ?>
                <div class="col-span-full text-center py-16 text-gray-600 text-xl">
                    No featured categories available right now.
                </div>
            <?php } ?>
        </div>
        <!-- Optional: See More Categories Button -->
        <div class="text-center mt-12">
            <a href="<?php echo SITEURL; ?>categories.php"
               class="inline-flex items-center gap-3 bg-gray-800 hover:bg-gray-900 text-white px-10 py-5 rounded-full font-bold shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
                View All Categories
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
    </div>
</section>
<!-- ========================
     POPULAR FOODS / BEST SELLERS SECTION
     AL Maalik Foods Special Dishes
     Fully responsive, animated, with static examples + dynamic from database
========================= -->
<section class="py-16 md:py-24 bg-gray-50">
    <div class="container mx-auto px-5 lg:px-12">
        <!-- Heading -->
        <div class="text-center mb-12 md:mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
                data-aos="fade-up" data-aos-duration="900">
                AL Maalik Foods ke Mashhoor Dishes
            </h2>
            <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
               data-aos="fade-up" data-aos-delay="150">
                Customers ki pasandida cheezein – fresh, tasty aur har roz banayi jaati hain!
            </p>
        </div>
        <!-- Foods Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <!-- STATIC EXAMPLE 1 -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group">
                <div class="relative h-48 md:h-56 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Chicken Biryani - AL Maalik Foods"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-800 ease-out"
                    >
                    <div class="absolute top-4 right-4 bg-red-600 text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-md">
                        Best Seller
                    </div>
                </div>
                <div class="p-5 md:p-6">
                    <h4 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">Chicken Biryani</h4>
                    <p class="text-gray-600 mb-4 line-clamp-2 text-sm md:text-base">
                        Perfectly spiced chicken biryani with raita & salad – AL Maalik Foods ka signature dish!
                    </p>
                    <div class="flex items-center mb-4">
                        <span class="text-yellow-500 text-lg">★★★★★</span>
                        <span class="ml-2 text-sm text-gray-600">(4.8)</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-red-600 font-bold text-2xl">Rs. 550</span>
                        <a href="<?php echo SITEURL; ?>order.php?food_id=example-biryani"
                           class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg">
                            Order Now
                        </a>
                    </div>
                </div>
            </div>
            <!-- STATIC EXAMPLE 2 -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group">
                <div class="relative h-48 md:h-56 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Beef Burger - AL Maalik Foods"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-800 ease-out"
                    >
                    <div class="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-4 py-1.5 rounded-full text-sm shadow-md">
                        Most Ordered
                    </div>
                </div>
                <div class="p-5 md:p-6">
                    <h4 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">Beef Zinger Burger</h4>
                    <p class="text-gray-600 mb-4 line-clamp-2 text-sm md:text-base">
                        Crispy fried beef patty, cheese, fresh veggies & special sauce – unbeatable taste!
                    </p>
                    <div class="flex items-center mb-4">
                        <span class="text-yellow-500 text-lg">★★★★☆</span>
                        <span class="ml-2 text-sm text-gray-600">(4.6)</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-red-600 font-bold text-2xl">Rs. 480</span>
                        <a href="<?php echo SITEURL; ?>order.php?food_id=example-burger"
                           class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg">
                            Order Now
                        </a>
                    </div>
                </div>
            </div>
            <!-- DYNAMIC FOODS FROM DATABASE -->
            <?php
            // =============================================
            // DYNAMIC SECTION – Your real menu items
            // =============================================
            // Table: tbl_food
            // Important columns: id, title, price, description, image_name, active, featured
            $sql = "SELECT * FROM tbl_food
                    WHERE active = 'Yes' AND featured = 'Yes'
                    ORDER BY id DESC
                    LIMIT 10";
            $res = mysqli_query($conn, $sql);
            if ($res && mysqli_num_rows($res) > 0) {
                while ($row = mysqli_fetch_assoc($res)) {
                    $food_id = $row['id'];
                    $title = htmlspecialchars($row['title']);
                    $price = $row['price'];
                    $description = htmlspecialchars($row['description']);
                    $image_name = $row['image_name'];
            ?>
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group">
                        <div class="relative h-48 md:h-56 overflow-hidden">
                            <?php if (!empty($image_name)) { ?>
                                <img src="<?php echo SITEURL; ?>images/food/<?php echo $image_name; ?>"
                                     alt="<?php echo $title; ?>"
                                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-800 ease-out">
                            <?php } else { ?>
                                <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            <?php } ?>
                            <div class="absolute top-4 right-4 bg-red-600 text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-md">
                                Popular
                            </div>
                        </div>
                        <div class="p-5 md:p-6">
                            <h4 class="text-xl md:text-2xl font-bold text-gray-900 mb-2"><?php echo $title; ?></h4>
                            <p class="text-gray-600 mb-4 line-clamp-2 text-sm md:text-base">
                                <?php echo $description; ?>
                            </p>
                            <div class="flex items-center mb-4">
                                <span class="text-yellow-500 text-lg">★★★★★</span>
                                <span class="ml-2 text-sm text-gray-600">(4.7)</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-red-600 font-bold text-2xl">Rs. <?php echo number_format($price, 0); ?></span>
                                <a href="<?php echo SITEURL; ?>order.php?food_id=<?php echo $food_id; ?>"
                                   class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg">
                                    Order Now
                                </a>
                            </div>
                        </div>
                    </div>
            <?php
                }
            } else {
            ?>
                <div class="col-span-full text-center py-16 text-gray-700 text-xl">
                    Abhi koi featured items nahi hain. Jald hi naye dishes add honge!
                </div>
            <?php } ?>
        </div>
        <!-- See All Foods Button -->
        <div class="text-center mt-12 md:mt-16">
            <a href="<?php echo SITEURL; ?>foods.php"
               class="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
                Saare Dishes Dekhein →
            </a>
        </div>
    </div>
</section>
<?php
// =============================================
// AL Maalik Foods - Full Homepage Source Code
// =============================================
// This is the complete, fully loaded index.php for AL Maalik Foods website.
// Features:
// - Sticky Header with branding, menu, cart, login
// - Hero Section with search and quick tags
// - Flash Deals: 3-4 static examples + dynamic from tbl_deals (admin can add/edit in panel)
// - Categories: 3-4 static examples + dynamic from tbl_category
// - Popular Foods: 3-4 static examples + dynamic from tbl_food
// - All data dynamic where possible – admin panel se control (e.g., add categories, foods, deals via your admin backend)
// - Comments everywhere for easy understanding and integration
// - Responsive, animated (AOS + Tailwind transitions)
// - Images from online sources (Unsplash etc.) for static, DB for dynamic
// - Session message handled
// - Footer at end (assume your footer.php)
// Important Integration Notes:
// 1. DB Tables:
// - tbl_deals: id, title, description, price, old_price, discount_text, image_name, active (Yes/No), featured (Yes/No)
// - tbl_category: already in your code
// - tbl_food: already in your code
// 2. Admin Panel: Create pages to INSERT/UPDATE/DELETE these tables (e.g., add_deal.php with form for title, price, image upload)
// 3. Colors: Red theme for AL Maalik Foods
// 4. Test: Paste this as index.php, ensure conn and SITEURL defined
// 5. Enhancements: Add real ratings, timers, cart count in future
include('partials-front/menu.php');
?>
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AL Maalik Foods - Order Delicious Food Online</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#c8102e', // AL Maalik red
                        primaryDark: '#a30824',
                        secondary: '#ffcc00', // Accent yellow
                        dark: '#1a1a1a',
                    },
                    fontFamily: {
                        heading: ['Poppins', 'sans-serif'],
                        body: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    animation: {
                        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                        'pulse-slow': 'pulseSlow 3s infinite',
                    },
                    keyframes: {
                        fadeInUp: {
                            '0%': { opacity: '0', transform: 'translateY(30px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        pulseSlow: {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.04)' },
                        }
                    }
                }
            }
        }
    </script>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- AOS Animation -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" defer></script>
    <style>
        .hero-bg { background: linear-gradient(rgba(0,0,0,0.58), rgba(0,0,0,0.72)), url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=2000&q=80') center/cover no-repeat; }
        .nav-blur { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-gray-50 font-body text-gray-800">
    <!-- HEADER: Sticky nav with AL Maalik Foods branding -->
    <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <nav class="nav-blur bg-white/80 border-b border-gray-200/50">
            <div class="container mx-auto px-5 lg:px-12">
                <div class="flex items-center justify-between h-16 md:h-20">
                    <!-- Logo: AL Maalik Foods -->
                    <a href="<?php echo SITEURL; ?>" class="flex items-center gap-3 font-heading font-extrabold text-2xl md:text-3xl text-primary">
                        AL Maalik Foods
                    </a>
                    <!-- Menu: Add your links or include from menu.php -->
                    <div class="hidden md:flex items-center gap-8">
                        <a href="#" class="font-medium hover:text-primary transition-colors">Home</a>
                        <a href="#" class="font-medium hover:text-primary transition-colors">Menu</a>
                        <a href="#" class="font-medium hover:text-primary transition-colors">Deals</a>
                        <a href="#" class="font-medium hover:text-primary transition-colors">Contact</a>
                    </div>
                    <!-- Actions: Cart (dynamic count in future), Login -->
                    <div class="flex items-center gap-4 md:gap-6">
                        <a href="#" class="relative text-2xl text-gray-700 hover:text-primary">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            <span class="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span> <!-- Dynamic karo session se -->
                        </a>
                        <a href="#" class="hidden md:flex items-center gap-2 font-medium hover:text-primary">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            Sign In
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </header>
    <!-- HERO SECTION: Big banner with search for AL Maalik Foods -->
    <section class="hero-bg min-h-screen flex items-center pt-20 md:pt-0">
        <div class="container mx-auto px-5 lg:px-12">
            <div class="max-w-4xl mx-auto text-center text-white">
                <h1 class="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold leading-tight mb-6 drop-shadow-2xl"
                    data-aos="fade-up" data-aos-duration="900">
                    AL Maalik Foods – <span class="text-secondary">Tasty & Fresh!</span>
                </h1>
                <p class="text-lg md:text-2xl font-light mb-10 md:mb-12 drop-shadow-lg max-w-3xl mx-auto"
                   data-aos="fade-up" data-aos-delay="150" data-aos-duration="900">
                    Order your favorite dishes from AL Maalik Foods – delivered hot and fresh!
                </p>
                <!-- Search Form: Dynamic action to your search page -->
                <form action="<?php echo SITEURL; ?>food-search.php" method="POST"
                      class="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 md:gap-5"
                      data-aos="zoom-in" data-aos-delay="300" data-aos-duration="800">
                    <input type="search" name="search" placeholder="Search for dishes, cuisines..." required
                           class="flex-1 px-6 py-5 rounded-full text-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-secondary shadow-xl transition-all">
                    <button type="submit" name="submit"
                            class="bg-primary hover:bg-primaryDark text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-red-700/40 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        Search
                    </button>
                </form>
                <!-- Quick Tags: Static, but admin can change in code or make dynamic -->
                <div class="mt-10 flex flex-wrap justify-center gap-3 md:gap-4 opacity-90"
                     data-aos="fade-up" data-aos-delay="500">
                    <span class="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium">Biryani</span>
                    <span class="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium">Burger</span>
                    <span class="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium">Pizza</span>
                    <span class="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium">Karahi</span>
                    <span class="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium">Deals</span>
                </div>
            </div>
        </div>
    </section>
    <!-- SESSION MESSAGE: Dynamic from PHP session -->
    <?php
    if(isset($_SESSION['order'])) {
        echo '<div class="container mx-auto px-5 lg:px-12 py-6">';
        echo '<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-5 rounded-r-lg">';
        echo $_SESSION['order'];
        unset($_SESSION['order']);
        echo '</div>';
        echo '</div>';
    }
    ?>
    <!-- FLASH DEALS SECTION: 3-4 static + dynamic from tbl_deals (admin controls via panel) -->
    <section class="py-14 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div class="container mx-auto px-5 lg:px-12">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900"
                    data-aos="fade-right" data-aos-duration="900">
                    AL Maalik Foods ke Flash Deals
                </h2>
                <a href="<?php echo SITEURL; ?>deals.php" class="text-primary font-semibold hover:text-primaryDark transition-colors flex items-center gap-2 text-lg group">
                    All Deals
                    <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
            <div class="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide"
                 data-aos="fade-up" data-aos-delay="150">

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://youngmalang.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/74dace10-7813-4ae1-9b49-011e7c2d01d5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
