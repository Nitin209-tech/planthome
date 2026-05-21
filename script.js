/* ==========================================================================
   INTERACTIVE SCRIPT - SAINI PLANT HOME NURSERY
   Premium Client-Side UX & Dynamic WhatsApp Inquiry Generator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Header & Sticky Navbar Shrink on Scroll
  const header = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy: Highlight active nav link based on scroll position
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Mobile Hamburger Menu Toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('overflow-hidden'); // Disable background scrolling when menu open
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }

  // 4. Before/After Landscaping Slider Pointer-Events
  const slider = document.getElementById('before-after-slider');
  const beforeContainer = document.getElementById('before-img-container');
  const handle = document.getElementById('slider-handle');

  if (slider && beforeContainer && handle) {
    let isDragging = false;

    const updateSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      
      // Boundary constraints
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      
      const percentage = (offsetX / rect.width) * 100;
      
      // Update DOM
      beforeContainer.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    // Mouse Events
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    // Touch Events (for mobile responsiveness)
    handle.addEventListener('touchstart', (e) => {
      isDragging = true;
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        updateSlider(e.touches[0].clientX);
      }
    });

    // Click on slider bar to jump
    slider.addEventListener('click', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      updateSlider(e.clientX);
    });
  }

  // 5. Testimonials Slider Carousel
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');
  const indicatorsContainer = document.getElementById('t-indicators');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  if (track && testimonialCards.length > 0) {
    let currentIndex = 0;
    const totalSlides = testimonialCards.length;

    // Generate Dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('t-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(i);
      });
      indicatorsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.t-dot');

    const updateSliderPosition = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateSliderPosition();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSliderPosition();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSliderPosition();
    };

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto slide every 8 seconds
    let autoPlayInterval = setInterval(nextSlide, 8000);

    // Reset interval on manual user interaction
    const resetInterval = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 8000);
    };

    [prevBtn, nextBtn].forEach(btn => btn.addEventListener('click', resetInterval));
    dots.forEach(dot => dot.addEventListener('click', resetInterval));
  }

  // 6. FAQ Accordion Panels with Dynamic height
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const faqItem = trigger.parentElement;
      const faqPanel = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other active FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          item.querySelector('.faq-panel').style.maxHeight = '0';
        }
      });

      // Toggle current FAQ item
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        faqItem.classList.remove('active');
        faqPanel.style.maxHeight = '0';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        faqItem.classList.add('active');
        // Set max-height precisely to scrollHeight to support smooth transitions
        faqPanel.style.maxHeight = `${faqPanel.scrollHeight}px`;
      }
    });
  });

  // 7. Interactive WhatsApp Lead Message Generator
  const ctaForm = document.getElementById('whatsapp-generator-form');
  
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('user-name').value.trim();
      const categorySelect = document.getElementById('interest-category');
      const categoryLabel = categorySelect.options[categorySelect.selectedIndex].text;
      const customDetail = document.getElementById('custom-detail').value.trim();

      const baseNumber = '919811234567'; // Owner WhatsApp Number
      
      // Constructing detailed message
      let message = `Hi Saini Plant Home Nursery! I'm ${name}.\n\n`;
      message += `I saw your premium business website and would like a consultation on: \n*${categoryLabel}*\n\n`;
      
      if (customDetail) {
        message += `My details/special requests:\n_"${customDetail}"_\n\n`;
      }
      
      message += `Please share catalog and wholesale quotation coordinates. Thank you!`;

      // Generate direct WhatsApp link
      const waUrl = `https://wa.me/${baseNumber}?text=${encodeURIComponent(message)}`;
      
      // Open in a new tab
      window.open(waUrl, '_blank');
    });
  }
});

/* ==========================================================================
   DYNAMIC POPUPS LOGIC (CATEGORIES & PROJECT GALLERY MODALS)
   ========================================================================== */

// Top Botanical Catalog Data
const categoriesData = {
  indoor: {
    title: "Indoor Foliage & Air-Purifiers",
    subtitle: "Premium shade-loving species optimized for Delhi rooms and offices.",
    items: [
      { name: "Monstera Deliciosa", common: "Swiss Cheese Plant", price: "₹250 - ₹650", icon: "leaf" },
      { name: "Ficus Lyrata", common: "Fiddle Leaf Fig", price: "₹450 - ₹1,200", icon: "tree" },
      { name: "Areca Palm", common: "Natural Air-Filter", price: "₹180 - ₹450", icon: "wind" },
      { name: "Sansevieria", common: "Snake Plant (Laurentii)", price: "₹120 - ₹280", icon: "sparkles" },
      { name: "Zamioculcas Zamiifolia", common: "ZZ Tabletop Plant", price: "₹200 - ₹380", icon: "award" }
    ]
  },
  outdoor: {
    title: "Sun-Loving Structure & Ornamental Plants",
    subtitle: "Acclimated outdoor greenery that stands strong against Delhi summers.",
    items: [
      { name: "Wodyetia Bifurcata", common: "Foxtail Palm Tree", price: "₹600 - ₹2,500", icon: "tree" },
      { name: "Bougainvillea Spectabilis", common: "Flowering Climber", price: "₹150 - ₹350", icon: "flower" },
      { name: "Bambusa Vulgaris", common: "Golden Hedge Bamboo", price: "₹250 - ₹480", icon: "align-justify" },
      { name: "Plumeria Rubra", common: "Champa Tree", price: "₹350 - ₹1,100", icon: "sun" },
      { name: "Hibiscus Rosa-sinensis", common: "Gudhal Flowering Shrub", price: "₹90 - ₹180", icon: "flower-2" }
    ]
  },
  succulents: {
    title: "Minimalist Succulents & Tabletop Cacti",
    subtitle: "Drought-resilient miniature setups in designer clay and ceramic pots.",
    items: [
      { name: "Echeveria Elegans", common: "Mexicana Rose Succulent", price: "₹80 - ₹150", icon: "sun" },
      { name: "Haworthia Fasciata", common: "Zebra Succulent", price: "₹70 - ₹130", icon: "grid" },
      { name: "Crassula Ovata", common: "Prosperity Jade Plant", price: "₹90 - ₹220", icon: "heart" },
      { name: "Aloe Barbadensis", common: "Medicinal Aloe Vera", price: "₹60 - ₹140", icon: "activity" },
      { name: "Othonna Capensis", common: "Ruby Necklace Hanging Succulent", price: "₹120 - ₹250", icon: "link" }
    ]
  },
  flowering: {
    title: "Fragrant & Exotic Flowering Beauties",
    subtitle: "Vibrant clusters of seasonal and perennial Delhi blooms.",
    items: [
      { name: "Spathiphyllum", common: "Peace Lily (White Blooms)", price: "₹180 - ₹350", icon: "wind" },
      { name: "Anthurium Scherzerianum", common: "Laceleaf (Red Exotic)", price: "₹300 - ₹550", icon: "heart-handshake" },
      { name: "Jasminum Sambac", common: "Fragrant Mogra Climber", price: "₹80 - ₹160", icon: "sun" },
      { name: "Orchidaceae Hybrid", common: "Premium Cut Orchid", price: "₹450 - ₹800", icon: "star" },
      { name: "Adenium Obesum", common: "Desert Rose Bonsai", price: "₹220 - ₹600", icon: "award" }
    ]
  },
  pots: {
    title: "Designer Pots & Styling Elements",
    subtitle: "Premium curated pots in ceramic, terracotta, fiber and metals.",
    items: [
      { name: "Matte Ceramic Cylinder", common: "Luxury Desk Pots", price: "₹350 - ₹850", icon: "container" },
      { name: "Terracotta Ribbed Basin", common: "Organic Clay Pots", price: "₹120 - ₹380", icon: "disc" },
      { name: "Fiber-Reinforced Planter", common: "Heavy-Duty Lobby Pots", price: "₹550 - ₹2,200", icon: "box" },
      { name: "Self-Watering Compact", common: "Smart Watering Pot", price: "₹90 - ₹180", icon: "droplet" },
      { name: "Coconut Coir Hanging Basket", common: "Organic Fiber Basket", price: "₹110 - ₹240", icon: "compass" }
    ]
  },
  landscaping: {
    title: "Institutional & Residential Landscaping",
    subtitle: "Professional design, execution, and irrigation services.",
    items: [
      { name: "Vertical Living Wall", common: "Real Automated Plant Wall", price: "₹450 / sq.ft.", icon: "layers" },
      { name: "Backyard Stone & Turf", common: "Lawn and Grass Grassways", price: "₹180 / sq.ft.", icon: "layout" },
      { name: "Balcony Decking Setup", common: "Premium Wood-Laminate package", price: "₹12,000 onwards", icon: "hammer" },
      { name: "Drip Irrigation Automatic", common: "Water-Saving Smart System", price: "₹3,500 package", icon: "droplet" }
    ]
  }
};

// Open Category Drawer Modal
function openCategoryDrawer(categoryKey) {
  const drawer = document.getElementById('category-drawer');
  const container = document.getElementById('drawer-dynamic-content');
  const data = categoriesData[categoryKey];

  if (!drawer || !container || !data) return;

  // Generate dynamic HTML for list
  let itemsHtml = '';
  data.items.forEach(item => {
    itemsHtml += `
      <div class="drawer-product-item">
        <div class="item-badge-icon">
          <i data-lucide="${item.icon}"></i>
        </div>
        <div class="item-details">
          <h4 class="item-name">${item.name}</h4>
          <span class="item-common">${item.common}</span>
        </div>
        <div class="item-price">${item.price}</div>
      </div>
    `;
  });

  const contentHtml = `
    <div class="drawer-header">
      <h3 class="drawer-title">${data.title}</h3>
      <p class="drawer-subtitle">${data.subtitle}</p>
    </div>
    <div class="drawer-product-list">
      ${itemsHtml}
    </div>
    <div class="drawer-footer-actions">
      <a href="https://wa.me/919811234567?text=Hi%20Saini%20Plant%20Home%20Nursery,%20I'm%20inquiring%20about%20prices%20and%20catalogs%20for%20*${encodeURIComponent(data.title)}*" 
         class="btn btn-primary" 
         target="_blank">
        <i data-lucide="message-circle" class="btn-icon"></i>
        <span>Request Catalog Coordinates</span>
      </a>
    </div>
  `;

  container.innerHTML = contentHtml;
  
  // Re-create lucide icons inside drawer
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  drawer.classList.add('active');
  document.body.classList.add('overflow-hidden');
}

// Close Category Drawer Modal
function closeCategoryDrawer() {
  const drawer = document.getElementById('category-drawer');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }
}

// Close category drawer on backdrop click
document.getElementById('category-drawer')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    closeCategoryDrawer();
  }
});


// 8. Projects Showcase Gallery Data
const projectData = {
  1: {
    title: "Cafe Terrace Oasis",
    loc: "Chanakyapuri, New Delhi",
    desc: "We transformed a plain concrete, hot terrace space into an elegant, sun-shaded Mediterranean garden retreat for a boutique cafe in Chanakyapuri. We built heavy timber-reinforced planters, integrated an automatic drip line, and planted mature golden bamboo and white plumeria (champa) trees to block street noise and create natural organic privacy partitions.",
    meta: {
      duration: "4 Working Days",
      cost: "₹1,25,000",
      plants: "Foxtail Palms, Golden Bamboo, Champa, Mogra",
      irrigation: "Automatic Smart Drip"
    }
  },
  2: {
    title: "Corporate Vertical Living Wall",
    loc: "Sector 62, Noida",
    desc: "Created an immersive 400 sq.ft. indoor vertical living plant wall for a leading technology firm's headquarters reception lobby. Features a fully self-watering automatic sub-irrigation grid and a carefully designed mosaic layout using air-purifying, indoor-acclimated plants that significantly enhance lobby air quality and acoustic insulation.",
    meta: {
      duration: "5 Working Days",
      cost: "₹1,80,000",
      plants: "Philodendron Xanadu, Scindapsus, Chlorophytum",
      irrigation: "Recirculating Automated Sub-irrigation"
    }
  },
  3: {
    title: "Modern Penthouse Courtyard",
    loc: "Barakhamba Road, Connaught Place",
    desc: "A luxury high-rise penthouse courtyard designed to feel like an organic sanctuary. Features clean stone paths, premium evergreen grass turf, minimalist grey structural pots, and massive Fiddle Leaf Fig and Areca Palm accent structures that survive Delhi's harsh rooftop summer wind cycles.",
    meta: {
      duration: "3 Working Days",
      cost: "₹95,000",
      plants: "Ficus Lyrata, Areca Palms, Agave, Cycas",
      irrigation: "Manual Sprinkler Grid"
    }
  }
};

// Open Project Case Modal
function openGalleryModal(projectId) {
  const modal = document.getElementById('gallery-modal');
  const container = document.getElementById('gallery-dynamic-details');
  const data = projectData[projectId];

  if (!modal || !container || !data) return;

  const contentHtml = `
    <h3 class="project-case-title">${data.title}</h3>
    <span class="project-case-loc"><i data-lucide="map-pin" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>${data.loc}</span>
    <p class="project-case-desc">${data.desc}</p>
    <div class="project-case-meta">
      <div>
        <span class="project-meta-lbl">Project Cost</span>
        <span class="project-meta-val">${data.meta.cost}</span>
      </div>
      <div>
        <span class="project-meta-lbl">Duration</span>
        <span class="project-meta-val">${data.meta.duration}</span>
      </div>
      <div style="grid-column: span 2; margin-top: 10px;">
        <span class="project-meta-lbl">Main Flora Species Used</span>
        <span class="project-meta-val">${data.meta.plants}</span>
      </div>
      <div style="grid-column: span 2;">
        <span class="project-meta-lbl">Watering Mechanism</span>
        <span class="project-meta-val">${data.meta.irrigation}</span>
      </div>
    </div>
    <div class="drawer-footer-actions">
      <a href="https://wa.me/919811234567?text=Hi%20Saini%20Plant%20Home!%20I'm%20interested%20in%20a%20landscaping%20project%20similar%20to%20*${encodeURIComponent(data.title)}*%20in%20${encodeURIComponent(data.loc)}" 
         class="btn btn-primary" 
         target="_blank">
        <i data-lucide="phone-call" class="btn-icon"></i>
        <span>Request Site Visit & Consultation</span>
      </a>
    </div>
  `;

  container.innerHTML = contentHtml;

  // Re-create icons inside modal
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  modal.classList.add('active');
  document.body.classList.add('overflow-hidden');
}

// Close Project Case Modal
function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }
}

// Close gallery modal on backdrop click
document.getElementById('gallery-modal')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    closeGalleryModal();
  }
});
