document.addEventListener('DOMContentLoaded', function() {
    // --- 1. LOADER ---
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loader.classList.add('fade-out');
                loader.classList.add('hide');
            }, 300);
        });
        // Fallback in case window load event already fired
        if (document.readyState === 'complete') {
            setTimeout(() => {
                loader.classList.add('fade-out');
                loader.classList.add('hide');
            }, 300);
        }
    }

    // --- 2. HEADER SCROLL STATE ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 3. MOBILE MENU ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('open');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile nav when clicking a link (except the dropdown toggle)
        const mobileLinks = mobileNav.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-logo');
        mobileLinks.forEach(link => {
            if (!link.classList.contains('nav-link-dropdown')) {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('open');
                    mobileNav.classList.remove('open');
                    document.body.style.overflow = '';
                });
            }
        });

        // Dropdown accordion logic
        const mobileDropdownToggle = mobileNav.querySelector('.nav-link-dropdown');
        if (mobileDropdownToggle) {
            mobileDropdownToggle.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent navigation to make it act as a toggle
                const group = mobileDropdownToggle.closest('.mobile-dropdown-group');
                if(group) group.classList.toggle('active');
            });
        }
    }

    // --- 4. APPLE CARD HOVER GLOW EFFECT (BENTO CARDS) ---
    const bentoCards = document.querySelectorAll('.bento-card, .stat-box, .contact-card');
    bentoCards.forEach(card => {
        // Create reflector element if not present
        if (!card.querySelector('.glow-reflector')) {
            const reflector = document.createElement('div');
            reflector.className = 'glow-reflector';
            card.appendChild(reflector);
        }

        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate within the element
            const y = e.clientY - rect.top;  // y coordinate within the element
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- 5. APPLE PILL SELECTOR & SEGMENT TAB INDICATOR ---
    const pillSelectors = document.querySelectorAll('.pill-selector-wrapper');
    pillSelectors.forEach(wrapper => {
        const buttons = wrapper.querySelectorAll('.pill-tab-btn');
        
        // Create slide indicator if not present
        let indicator = wrapper.querySelector('.pill-slider-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'pill-slider-indicator';
            wrapper.appendChild(indicator);
        }

        function updateIndicator() {
            const activeBtn = wrapper.querySelector('.pill-tab-btn.active');
            if (activeBtn) {
                indicator.style.width = `${activeBtn.offsetWidth}px`;
                indicator.style.left = `${activeBtn.offsetLeft}px`;
            }
        }

        // Initialize indicator position
        setTimeout(updateIndicator, 100);

        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                updateIndicator();

                // Toggle tabs contents if data-target is defined
                const targetId = this.getAttribute('data-target');
                if (targetId) {
                    const group = this.getAttribute('data-group') || 'default';
                    const tabContents = document.querySelectorAll(`.tab-content[data-group="${group}"]`);
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === targetId) {
                            content.classList.add('active');
                        }
                    });
                }
            });
        });

        // Update on resize
        window.addEventListener('resize', updateIndicator);
    });

    // --- 6. SHIPMENT CALCULATOR & CONFIGURATOR WIDGET ---
    const calcForm = document.getElementById('shipmentCalculator');
    const calcResultBox = document.getElementById('calculatorResults');
    
    if (calcForm) {
        const originSelect = document.getElementById('calcOrigin');
        const destinationSelect = document.getElementById('calcDestination');
        const weightInput = document.getElementById('calcWeight');
        const serviceSelect = document.getElementById('calcService');
        
        const resultType = document.getElementById('resType');
        const resultTime = document.getElementById('resTime');
        const resultPrice = document.getElementById('resPrice');
        const calcWabtn = document.getElementById('calcWhatsAppBtn');

        // Rates data (mock base logic based on typical courier costs)
        function calculateRate() {
            const origin = originSelect.value;
            const destination = destinationSelect.value;
            const weight = parseFloat(weightInput.value) || 0;
            const service = serviceSelect.value;

            if (!origin || !destination || weight <= 0 || !service) {
                if (calcResultBox) calcResultBox.style.display = 'none';
                return;
            }

            let pricePerKg = 8.5; // Base price
            let baseFee = 25;     // Handling fee
            let transitDays = "15-20 días hábiles";

            if (service === 'express') {
                pricePerKg = 12.0;
                baseFee = 35;
                transitDays = "7-10 días hábiles (Aéreo)";
            } else if (service === 'maritimo') {
                pricePerKg = 5.0;
                baseFee = 50;
                transitDays = "45-60 días hábiles (Marítimo)";
            }

            if (origin === 'HN' && destination === 'ES') {
                pricePerKg *= 1.2; // Higher rate inbound
                baseFee *= 1.15;
            }

            const totalEst = (weight * pricePerKg) + baseFee;
            
            // Update results
            if (resultType) resultType.textContent = service === 'express' ? '🚀 Aéreo Express' : (service === 'maritimo' ? '🚢 Marítimo Económico' : '📦 Terrestre/Marítimo');
            if (resultTime) resultTime.textContent = transitDays;
            if (resultPrice) resultPrice.textContent = `€${totalEst.toFixed(2)}`;

            if (calcResultBox) calcResultBox.style.display = 'flex';

            // WhatsApp link setup
            if (calcWabtn) {
                const textMessage = `*Cotización de Envío Realizada*\n\n` +
                                   `*Origen:* ${origin === 'ES' ? 'España 🇪🇸' : 'Honduras 🇭🇳'}\n` +
                                   `*Destino:* ${destination === 'ES' ? 'España 🇪🇸' : 'Honduras 🇭🇳'}\n` +
                                   `*Peso estimado:* ${weight} kg\n` +
                                   `*Servicio:* ${service === 'express' ? 'Aéreo Express ✈️' : (service === 'maritimo' ? 'Marítimo Mar 🚢' : 'Estándar')}\n` +
                                   `*Tarifa estimada:* €${totalEst.toFixed(2)}\n` +
                                   `*Tiempo de tránsito:* ${transitDays}\n\n` +
                                   `¡Hola! Me gustaría coordinar un envío con estas características. ¿Me pueden dar más información?`;
                
                calcWabtn.href = `https://api.whatsapp.com/send?phone=34642900609&text=${encodeURIComponent(textMessage)}`;
            }
        }

        // Attach listeners for recalculating
        [originSelect, destinationSelect, weightInput, serviceSelect].forEach(element => {
            if (element) {
                element.addEventListener('change', calculateRate);
                element.addEventListener('input', calculateRate);
            }
        });

        // Lock destinations logically so you can't select ES -> ES
        if (originSelect && destinationSelect) {
            originSelect.addEventListener('change', function() {
                if (this.value === 'ES') {
                    destinationSelect.value = 'HN';
                } else if (this.value === 'HN') {
                    destinationSelect.value = 'ES';
                }
                calculateRate();
            });
            destinationSelect.addEventListener('change', function() {
                if (this.value === 'ES') {
                    originSelect.value = 'HN';
                } else if (this.value === 'HN') {
                    originSelect.value = 'ES';
                }
                calculateRate();
            });
        }
    }

    // --- 7. FAQ ACCORDIONS (SMOOTH SLIDE HEIGHT) ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Close all other items for clean Apple style
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                        const otherContent = otherItem.querySelector('.faq-content');
                        if (otherContent) otherContent.style.maxHeight = '0px';
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('open');
                    content.style.maxHeight = '0px';
                } else {
                    item.classList.add('open');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    // --- 8. TESTIMONIAL CAROUSEL (TOUCH DRAG & VELOCITY) ---
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (track && slides.length > 0 && dotsContainer) {
        let currentIndex = 0;
        
        // Generate dots
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir al testimonio ${index + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        
        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Auto transition
        let autoPlayTimer = setInterval(nextSlide, 6000);
        
        function nextSlide() {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }
        
        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(nextSlide, 8000);
        }
        
        // Touch Drag gestures
        let startX = 0;
        let isDragging = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            clearInterval(autoPlayTimer);
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (diffX > 50) {
                // Swipe left -> Next
                goToSlide((currentIndex + 1) % slides.length);
            } else if (diffX < -50) {
                // Swipe right -> Prev
                goToSlide((currentIndex - 1 + slides.length) % slides.length);
            }
            isDragging = false;
            resetAutoPlay();
        }, { passive: true });
    }

    // --- 9. CONTACT & LEAD FORM GENERATOR ---
    const contactForm = document.getElementById('contactWhatsAppForm') || document.getElementById('postContactForm');
    const countryOptions = document.querySelectorAll('.country-option');
    
    // Support both ID formats (main form vs post form)
    const getField = (id1, id2) => document.getElementById(id1) || document.getElementById(id2);
    
    const hiddenCountryInput = getField('userCountry', 'pCountry');
    
    if (countryOptions.length > 0 && hiddenCountryInput) {
        countryOptions.forEach(option => {
            option.addEventListener('click', function() {
                countryOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                hiddenCountryInput.value = this.getAttribute('data-value');
            });
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!this.checkValidity()) {
                this.reportValidity();
                return;
            }
            
            const userCountry = hiddenCountryInput ? hiddenCountryInput.value : '';
            const serviceTypeEl = getField('serviceType', 'pService');
            const serviceType = serviceTypeEl ? serviceTypeEl.value : '';
            
            const userMessageEl = getField('userMessage', 'pMsg');
            const userMessage = userMessageEl ? userMessageEl.value : '';
            
            const userNameEl = getField('userName', 'pName');
            const userName = userNameEl ? userNameEl.value : '';
            
            const userPhoneEl = getField('userPhone', 'pPhone');
            const userPhone = userPhoneEl ? userPhoneEl.value : '';
            
            const userEmailEl = getField('userEmail', 'pEmail'); // Note: pEmail might not exist, that's fine
            const userEmail = userEmailEl ? userEmailEl.value : '';
            
            if (!userCountry) {
                alert('Por favor, selecciona dónde te encuentras (España o Honduras).');
                return;
            }
            if (!serviceType) {
                alert('Por favor, selecciona el servicio que necesitas.');
                return;
            }
            
            // Structural WhatsApp lead context
            let whatsappMessage = `*Nueva Solicitud - Encomiendas Mixco*\n\n`;
            
            const postTitleEl = document.getElementById('postTitle');
            if (postTitleEl && postTitleEl.value) {
                whatsappMessage += `*Consulta desde:* ${postTitleEl.value}\n`;
            }
            
            if (userName) whatsappMessage += `*Nombre:* ${userName}\n`;
            if (userPhone) whatsappMessage += `*Teléfono:* ${userPhone}\n`;
            if (userEmail) whatsappMessage += `*Email:* ${userEmail}\n`;
            whatsappMessage += `*Ubicación:* ${userCountry}\n`;
            whatsappMessage += `*Servicio:* ${serviceType}\n`;
            
            // Check for flight-specific fields dynamically
            const originCityEl = document.getElementById('originCity');
            const destCityEl = document.getElementById('destCity');
            const travelDateEl = document.getElementById('travelDate');
            const passengerCountEl = document.getElementById('passengerCount');
            
            if (originCityEl && originCityEl.value) whatsappMessage += `*Origen:* ${originCityEl.value}\n`;
            if (destCityEl && destCityEl.value) whatsappMessage += `*Destino:* ${destCityEl.value}\n`;
            if (travelDateEl && travelDateEl.value) whatsappMessage += `*Fecha de viaje:* ${travelDateEl.value}\n`;
            if (passengerCountEl && passengerCountEl.value) whatsappMessage += `*Pasajeros:* ${passengerCountEl.value}\n`;
            
            whatsappMessage += `\n`;
            
            if (userMessage.trim()) {
                whatsappMessage += `*Mensaje:* ${userMessage}\n`;
            }
            
            const phoneNumber = '34642900609';
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
            
            // Micro-interaction state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>¡Redirigiendo a WhatsApp!</span>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                contactForm.reset();
                if (countryOptions) countryOptions.forEach(opt => opt.classList.remove('selected'));
                if (hiddenCountryInput) hiddenCountryInput.value = '';
            }, 3000);
        });
    }

    // --- 10. INTERSECTION OBSERVER FOR SCROLL REVEALS ---
    const animatedElements = document.querySelectorAll('.bento-card, .stat-box, .faq-item, .contact-card, .animate-reveal');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.05
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            el.classList.add('animate-reveal');
            observer.observe(el);
        });
    } else {
        animatedElements.forEach(el => {
            el.classList.add('active');
        });
    }

    // --- 11. SCROLL PROGRESS INDICATOR ---
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
});
