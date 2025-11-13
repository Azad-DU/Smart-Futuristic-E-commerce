// NeoShop - Futuristic E-Commerce JavaScript
// Advanced interactions and animations

class NeoShop {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('neoshop-cart')) || [];
        this.init();
    }
    
    init() {
        this.initP5Background();
        this.initTypewriter();
        this.initScrollReveal();
        this.initProductFiltering();
        this.initCartFunctionality();
        this.initSmoothScrolling();
        this.initAISearch();
        this.updateCartCount();
    }
    
    // P5.js Background Animation
    initP5Background() {
        new p5((p) => {
            let particles = [];
            let numParticles = 50;
            
            p.setup = () => {
                let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('p5-background');
                
                // Create particles
                for (let i = 0; i < numParticles; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(2, 6),
                        opacity: p.random(0.3, 0.8)
                    });
                }
            };
            
            p.draw = () => {
                p.clear();
                
                // Draw connections
                p.stroke(0, 212, 255, 30);
                p.strokeWeight(1);
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        let dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        if (dist < 100) {
                            p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        }
                    }
                }
                
                // Draw and update particles
                p.noStroke();
                for (let particle of particles) {
                    p.fill(0, 212, 255, particle.opacity * 255);
                    p.circle(particle.x, particle.y, particle.size);
                    
                    // Update position
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;
                }
            };
            
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        });
    }
    
    // Typewriter Effect
    initTypewriter() {
        const typed = new Typed('#typed-text', {
            strings: ['Smart Living', 'Technology', 'Innovation', 'Tomorrow'],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    // Scroll Reveal Animation
    initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Stagger animation for product cards
                    if (entry.target.classList.contains('product-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                        entry.target.style.transitionDelay = `${delay}ms`;
                    }
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.reveal-element').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Product Filtering
    initProductFiltering() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                categoryBtns.forEach(b => {
                    b.classList.remove('active', 'bg-electric-blue', 'text-white');
                    b.classList.add('bg-dark-slate', 'text-silver-chrome');
                });
                
                btn.classList.add('active', 'bg-electric-blue', 'text-white');
                btn.classList.remove('bg-dark-slate', 'text-silver-chrome');
                
                // Filter products
                const category = btn.dataset.category;
                
                productCards.forEach((card, index) => {
                    const cardCategory = card.dataset.category;
                    const shouldShow = category === 'all' || cardCategory === category;
                    
                    if (shouldShow) {
                        card.style.display = 'block';
                        anime({
                            targets: card,
                            opacity: [0, 1],
                            translateY: [30, 0],
                            delay: index * 100,
                            duration: 600,
                            easing: 'easeOutQuart'
                        });
                    } else {
                        anime({
                            targets: card,
                            opacity: 0,
                            translateY: -30,
                            duration: 300,
                            complete: () => {
                                card.style.display = 'none';
                            }
                        });
                    }
                });
            });
        });
    }
    
    // Cart Functionality
    initCartFunctionality() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const productId = btn.dataset.product;
                const price = parseFloat(btn.dataset.price);
                
                // Add to cart
                this.addToCart(productId, price);
                
                // Visual feedback
                const originalText = btn.textContent;
                btn.textContent = 'Added!';
                btn.classList.add('bg-green-500');
                btn.classList.remove('bg-electric-blue');
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('bg-green-500');
                    btn.classList.add('bg-electric-blue');
                }, 1500);
                
                // Cart animation
                anime({
                    targets: '#cart-count',
                    scale: [1, 1.5, 1],
                    duration: 600,
                    easing: 'easeOutElastic(1, .8)'
                });
            });
        });
    }
    
    addToCart(productId, price) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                price: price,
                quantity: 1
            });
        }
        
        localStorage.setItem('neoshop-cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }
    
    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = totalItems;
        }
    }
    
    // Smooth Scrolling
    initSmoothScrolling() {
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
    }
    
    // AI Search Interface
    initAISearch() {
        const searchInput = document.querySelector('input[placeholder="Ask me anything about our products..."]');
        const voiceBtn = document.querySelector('.glass-morphism button');
        
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                // Simulate voice recognition
                anime({
                    targets: voiceBtn,
                    scale: [1, 0.9, 1],
                    duration: 200,
                    complete: () => {
                        this.simulateVoiceSearch();
                    }
                });
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.processAISearch(searchInput.value);
                }
            });
        }
    }
    
    simulateVoiceSearch() {
        const searchInput = document.querySelector('input[placeholder="Ask me anything about our products..."]');
        const responses = [
            "I found some great health monitoring devices for you!",
            "Based on your interests, I recommend checking out our smart home collection.",
            "Here are the latest AR glasses that match your tech preferences.",
            "I've identified some perfect wearable devices for your lifestyle."
        ];
        
        // Show typing indicator
        searchInput.placeholder = "Listening...";
        
        setTimeout(() => {
            const response = responses[Math.floor(Math.random() * responses.length)];
            searchInput.value = response;
            
            // Process the search
            setTimeout(() => {
                this.processAISearch(response);
                searchInput.value = '';
                searchInput.placeholder = "Ask me anything about our products...";
            }, 2000);
        }, 1500);
    }
    
    processAISearch(query) {
        console.log('AI Search:', query);
        
        // Animate search results
        const productGrid = document.getElementById('product-grid');
        if (productGrid) {
            anime({
                targets: productGrid.children,
                scale: [1, 0.95, 1],
                duration: 600,
                delay: anime.stagger(100),
                easing: 'easeOutQuart'
            });
        }
        
        // Show AI recommendations
        this.showAIRecommendation();
    }
    
    showAIRecommendation() {
        // Create floating recommendation
        const recommendation = document.createElement('div');
        recommendation.className = 'fixed top-32 right-8 glass-morphism p-4 rounded-xl z-50 max-w-sm';
        recommendation.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-electric-blue rounded-full animate-pulse"></div>
                <span class="text-sm font-mono">AI Recommendation</span>
            </div>
            <p class="mt-3 text-sm text-silver-chrome">Based on your search, you might also like our smart health monitoring devices!</p>
            <button class="mt-3 text-electric-blue text-sm hover:text-white transition-colors">View Recommendations →</button>
        `;
        
        document.body.appendChild(recommendation);
        
        // Animate in
        anime({
            targets: recommendation,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutQuart'
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            anime({
                targets: recommendation,
                translateX: 300,
                opacity: 0,
                duration: 400,
                complete: () => {
                    recommendation.remove();
                }
            });
        }, 5000);
    }
    
    // Advanced hover effects for product cards
    initProductCardEffects() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    rotateX: 5,
                    rotateY: 5,
                    scale: 1.02,
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            });
        });
    }
    
    // Navigation scroll effect
    initNavigationEffects() {
        const nav = document.querySelector('nav');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                nav.classList.add('glass-morphism');
            } else {
                nav.classList.remove('glass-morphism');
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    // Utility: Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    // Utility: Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-electric-blue'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 400,
            easing: 'easeOutQuart'
        });
        
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: 300,
                opacity: 0,
                duration: 400,
                complete: () => notification.remove()
            });
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new NeoShop();
    
    // Initialize additional effects
    app.initProductCardEffects();
    app.initNavigationEffects();
    
    // Add click handlers for buttons
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.classList.contains('add-to-cart') && !btn.classList.contains('category-btn')) {
            btn.addEventListener('click', () => {
                if (btn.textContent.includes('Explore Products')) {
                    window.location.href = 'products.html';
                } else if (btn.textContent.includes('Watch Demo')) {
                    app.showNotification('Demo feature coming soon!', 'info');
                } else {
                    app.showNotification('Feature coming soon!', 'info');
                }
            });
        }
    });
    
    // Add navigation handlers
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#')) {
                // Allow normal navigation
                return;
            }
            e.preventDefault();
            
            if (href === '#') {
                app.showNotification('Page coming soon!', 'info');
            }
        });
    });
});

// Export for use in other pages
window.NeoShop = NeoShop;