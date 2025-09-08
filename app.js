// BTW with AI Marketplace JavaScript - Fixed Critical Bugs

// Global state
let currentTool = '';
let isLeadCaptured = false;
let userData = null;
let currentTestimonial = 0;
let testimonialInterval = null;
let isCarouselPaused = false;

// DOM Elements
let navToggle, navMenu, leadModal, toolsModal, leadForm, contactForm;
let testimonialTrack, testimonialSlides, testimonialDots;

// Initialize website
document.addEventListener('DOMContentLoaded', function() {
    console.log('BTW AI Marketplace - Initializing...');
    
    // Get DOM elements
    initializeDOMElements();
    
    // Initialize all functionality
    initializeNavigation();
    initializeForms();
    initializeClickHandlers();
    initializeTestimonialCarousel();
    checkUserStatus();
    initializeNavbarHighlight();
    
    console.log('BTW AI Marketplace initialized successfully!');
});

function initializeDOMElements() {
    navToggle = document.getElementById('navToggle');
    navMenu = document.getElementById('navMenu');
    leadModal = document.getElementById('leadModal');
    toolsModal = document.getElementById('toolsModal');
    leadForm = document.getElementById('leadForm');
    contactForm = document.getElementById('contactForm');
    
    // Testimonial elements
    testimonialTrack = document.getElementById('testimonialTrack');
    testimonialSlides = document.querySelectorAll('.testimonial-slide');
    testimonialDots = document.querySelectorAll('.testimonial-dots .dot');

    console.log('DOM Elements Status:', {
        navToggle: !!navToggle,
        navMenu: !!navMenu,
        leadModal: !!leadModal,
        toolsModal: !!toolsModal,
        leadForm: !!leadForm,
        contactForm: !!contactForm,
        testimonialTrack: !!testimonialTrack,
        testimonialSlides: testimonialSlides.length,
        testimonialDots: testimonialDots.length
    });
}

// Initialize click handlers - FIXED FOR CRITICAL BUGS
function initializeClickHandlers() {
    console.log('Setting up click handlers...');
    
    // 1. FIXED: Access Free Tools buttons - More specific targeting
    document.addEventListener('click', function(e) {
        const target = e.target;
        const buttonText = target.textContent.toLowerCase();
        
        // Lead capture buttons
        if (target.classList.contains('btn') && target.classList.contains('btn--primary') && 
            (buttonText.includes('access free') || buttonText.includes('free tools'))) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Lead capture button clicked:', buttonText);
            
            let toolType = 'general';
            if (buttonText.includes('climate')) toolType = 'climate-scenario';
            else if (buttonText.includes('esg score')) toolType = 'esg-score';
            else if (buttonText.includes('esg reports')) toolType = 'esg-reports';
            
            showLeadForm(toolType);
            return;
        }
        
        // 2. FIXED: Book Consultation buttons
        if (target.tagName === 'A' && target.textContent.toLowerCase().includes('consultation')) {
            // Let default behavior handle external links
            console.log('Consultation button clicked:', target.href);
            trackEvent('consultation_clicked', { url: target.href });
            return;
        }
        
        // 3. Tool-specific access buttons in tool cards
        if (target.classList.contains('btn--primary') && target.closest('.tool-card')) {
            e.preventDefault();
            e.stopPropagation();
            
            const toolCard = target.closest('.tool-card');
            const title = toolCard.querySelector('h4');
            
            if (title) {
                const toolType = determineToolTypeFromTitle(title.textContent);
                console.log('Tool-specific button clicked:', toolType);
                showLeadForm(toolType);
            }
            return;
        }
        
        // 4. Modal close handlers
        if (target.classList.contains('modal-close')) {
            e.preventDefault();
            const modal = target.closest('.modal');
            if (modal) {
                if (modal.id === 'leadModal') {
                    hideLeadForm();
                } else if (modal.id === 'toolsModal') {
                    hideToolsModal();
                }
            }
            return;
        }
        
        // 5. Modal backdrop clicks
        if (target.classList.contains('modal-backdrop')) {
            const modal = target.closest('.modal');
            if (modal) {
                if (modal.id === 'leadModal') {
                    hideLeadForm();
                } else if (modal.id === 'toolsModal') {
                    hideToolsModal();
                }
            }
            return;
        }
        
        // 6. Tool access buttons in modal
        if (target.textContent && target.textContent.includes('Launch Dashboard')) {
            e.preventDefault();
            const toolType = determineToolTypeFromContext(target);
            console.log('Tool launch requested:', toolType);
            accessTool(toolType);
            return;
        }
    });
    
    // 7. Premium tool links
    const premiumLinks = document.querySelectorAll('a[href*="topmate.io"]');
    premiumLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Premium tool link clicked:', this.href);
            trackEvent('premium_tool_clicked', { url: this.href });
        });
    });
    
    // 8. Social media and community links
    const socialLinks = document.querySelectorAll('a[href*="linkedin.com"], a[href*="youtube.com"], a[href*="whatsapp.com"]');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('External link clicked:', this.href);
            let platform = 'unknown';
            if (this.href.includes('linkedin.com/in/') || this.href.includes('youtube.com')) {
                platform = this.href.includes('linkedin') ? 'linkedin' : 'youtube';
                trackEvent('social_link_clicked', { platform });
            } else if (this.href.includes('linkedin.com/groups') || this.href.includes('whatsapp.com')) {
                platform = this.href.includes('whatsapp') ? 'whatsapp' : 'linkedin_group';
                trackEvent('community_link_clicked', { platform });
            }
        });
    });
    
    console.log('Click handlers setup complete');
}

// FIXED: Enhanced Navigation with proper section targeting
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Mobile menu toggled');
            navMenu.classList.toggle('active');
        });
    }

    // FIXED: Navigation links with proper section mapping
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            let targetElement = document.querySelector(targetId);
            
            // FIXED: Handle special cases for section targeting
            if (!targetElement) {
                // Map navigation items to actual sections
                const sectionMap = {
                    '#testimonials': '.testimonials',
                    '#community': '.community',
                    '#academy': '.academy, .upcoming-projects'
                };
                
                if (sectionMap[targetId]) {
                    targetElement = document.querySelector(sectionMap[targetId]);
                }
            }
            
            console.log('Navigation clicked:', targetId, 'Element found:', !!targetElement);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                
                // Calculate scroll position
                const navbar = document.querySelector('.navbar');
                const offset = navbar ? navbar.offsetHeight + 20 : 120;
                const targetPosition = targetElement.offsetTop - offset;
                
                // Smooth scroll
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                console.log('Scrolled to:', targetId);
                trackEvent('navigation_clicked', { section: targetId });
            } else {
                console.error('Target element not found:', targetId);
            }
        });
    });
    
    // Close mobile menu on outside click
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && 
            !navToggle.contains(e.target) && 
            !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
    
    console.log('Navigation initialized');
}

// Initialize Testimonial Carousel
function initializeTestimonialCarousel() {
    console.log('Initializing testimonial carousel...');
    
    if (!testimonialTrack || testimonialSlides.length === 0) {
        console.log('No testimonial elements found');
        return;
    }
    
    // Set initial state
    updateTestimonialDisplay();
    
    // Start auto-rotation
    startTestimonialRotation();
    
    // Add hover events to pause/resume
    const testimonialContainer = document.querySelector('.testimonials-carousel');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', pauseTestimonialRotation);
        testimonialContainer.addEventListener('mouseleave', resumeTestimonialRotation);
    }
    
    // Add touch support for mobile
    let startX = 0;
    let endX = 0;
    
    if (testimonialContainer) {
        testimonialContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        testimonialContainer.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    nextTestimonial();
                } else {
                    previousTestimonial();
                }
            }
        });
    }
    
    console.log('Testimonial carousel initialized');
}

function updateTestimonialDisplay() {
    if (!testimonialSlides || testimonialSlides.length === 0) return;
    
    // Update slides
    testimonialSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentTestimonial);
    });
    
    // Update dots
    testimonialDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
    
    // Update track position for smooth transition
    if (testimonialTrack) {
        testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    }
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
    updateTestimonialDisplay();
    trackEvent('testimonial_viewed', { index: currentTestimonial });
}

function previousTestimonial() {
    currentTestimonial = currentTestimonial === 0 ? testimonialSlides.length - 1 : currentTestimonial - 1;
    updateTestimonialDisplay();
    trackEvent('testimonial_viewed', { index: currentTestimonial });
}

function goToSlide(index) {
    if (index >= 0 && index < testimonialSlides.length) {
        currentTestimonial = index;
        updateTestimonialDisplay();
        trackEvent('testimonial_dot_clicked', { index: currentTestimonial });
        
        // Reset rotation timer
        if (!isCarouselPaused) {
            stopTestimonialRotation();
            startTestimonialRotation();
        }
    }
}

function startTestimonialRotation() {
    if (testimonialInterval) clearInterval(testimonialInterval);
    
    testimonialInterval = setInterval(() => {
        if (!isCarouselPaused) {
            nextTestimonial();
        }
    }, 5000); // 5 seconds
    
    console.log('Testimonial auto-rotation started');
}

function stopTestimonialRotation() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
    }
}

function pauseTestimonialRotation() {
    isCarouselPaused = true;
    console.log('Testimonial rotation paused');
}

function resumeTestimonialRotation() {
    isCarouselPaused = false;
    console.log('Testimonial rotation resumed');
}

function determineToolTypeFromTitle(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('climate scenario')) return 'climate-scenario';
    if (titleLower.includes('esg score') || titleLower.includes('sustainalytics')) return 'esg-score';
    if (titleLower.includes('esg reports') || titleLower.includes('sasb')) return 'esg-reports';
    
    return 'general';
}

function determineToolTypeFromContext(element) {
    const container = element.closest('.tool-access-item');
    if (!container) return 'general';
    
    const title = container.querySelector('h4');
    if (!title) return 'general';
    
    return determineToolTypeFromTitle(title.textContent);
}

// FIXED: Lead Capture Functions
function showLeadForm(toolType = '') {
    console.log('Showing lead form for tool:', toolType);
    
    if (!leadModal) {
        console.error('Lead modal not found');
        showNotification('Error: Registration form not available', 'error');
        return;
    }
    
    currentTool = toolType;
    
    // Show modal
    leadModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
        const firstInput = leadForm?.querySelector('input[type="text"]');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
    
    trackEvent('lead_modal_opened', { tool: toolType });
    console.log('Lead form modal opened successfully');
}

function hideLeadForm() {
    console.log('Hiding lead form');
    if (leadModal) {
        leadModal.classList.add('hidden');
        document.body.style.overflow = '';
        currentTool = '';
        
        if (leadForm) {
            leadForm.reset();
            clearFormErrors(leadForm);
        }
    }
}

function showToolsModal() {
    console.log('Showing tools modal');
    if (toolsModal) {
        toolsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideToolsModal() {
    console.log('Hiding tools modal');
    if (toolsModal) {
        toolsModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Form handling - FIXED
function initializeForms() {
    console.log('Initializing forms...');
    
    // Lead capture form
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLeadSubmission();
        });
        console.log('Lead form handler attached');
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmission();
        });
        console.log('Contact form handler attached');
    }
}

function handleLeadSubmission() {
    console.log('Processing lead form submission...');
    
    if (!leadForm) {
        console.error('Lead form not found');
        return;
    }
    
    // Get form data
    const formData = new FormData(leadForm);
    const leadData = {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        designation: formData.get('designation'),
        timestamp: new Date().toISOString(),
        toolRequested: currentTool
    };
    
    console.log('Lead data:', leadData);
    
    // Validate
    if (!validateLeadForm(leadData)) {
        showNotification('Please correct the form errors', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = leadForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
    }
    
    // Simulate processing
    setTimeout(() => {
        console.log('Lead submission processed');
        
        // Store data
        sessionStorage.setItem('btwUserData', JSON.stringify(leadData));
        sessionStorage.setItem('btwLeadCaptured', 'true');
        userData = leadData;
        isLeadCaptured = true;
        
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Access Free Tools';
        }
        
        // Hide lead form
        hideLeadForm();
        
        // Show success and tools
        showNotification(`Welcome ${leadData.name}! Access granted to free tools.`, 'success');
        
        setTimeout(() => {
            showToolsModal();
        }, 1000);
        
        trackEvent('lead_captured', { tool: currentTool, company: leadData.company });
        
    }, 1500);
}

function handleContactSubmission() {
    console.log('Processing contact form...');
    
    if (!contactForm) return;
    
    const formData = new FormData(contactForm);
    const contactData = {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };
    
    if (!validateContactForm(contactData)) {
        showNotification('Please correct the form errors', 'error');
        return;
    }
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }
    
    setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
        showNotification('Thank you! We\'ll get back to you within 24 hours.', 'success');
        trackEvent('contact_submitted', { company: contactData.company });
    }, 1500);
}

// Tool access function - FIXED
function accessTool(toolType) {
    console.log('Accessing tool:', toolType);
    
    if (!isLeadCaptured) {
        showNotification('Please complete registration first', 'warning');
        showLeadForm(toolType);
        return;
    }
    
    const toolUrls = {
        'esg-score': 'https://topmate.io/jay_shah_btw/1712978',
        'esg-reports': 'https://topmate.io/jay_shah_btw/1703812'
    };
    
    showNotification(`Launching ${toolType} dashboard...`, 'info');
    
    setTimeout(() => {
        if (toolUrls[toolType]) {
            window.open(toolUrls[toolType], '_blank');
            hideToolsModal();
        } else {
            // Demo for climate scenario tool
            alert(`Welcome to the ${toolType} Dashboard!\n\nRegistration confirmed for: ${userData?.name}\nCompany: ${userData?.company}\n\nIn the full implementation, you would be redirected to the actual dashboard with your credentials.`);
            hideToolsModal();
        }
        
        trackEvent('tool_accessed', { tool: toolType });
    }, 1000);
}

// Form validation functions
function validateLeadForm(data) {
    let isValid = true;
    clearFormErrors(leadForm);
    
    if (!data.name || data.name.length < 2) {
        showFieldError('leadName', 'Please enter your full name');
        isValid = false;
    }
    
    if (!data.company || data.company.length < 2) {
        showFieldError('leadCompany', 'Please enter your company');
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError('leadEmail', 'Please enter a valid email');
        isValid = false;
    }
    
    if (!data.phone || data.phone.length < 6) {
        showFieldError('leadPhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (!data.designation || data.designation.length < 2) {
        showFieldError('leadDesignation', 'Please enter your designation');
        isValid = false;
    }
    
    return isValid;
}

function validateContactForm(data) {
    let isValid = true;
    clearFormErrors(contactForm);
    
    if (!data.name || data.name.length < 2) {
        showFieldError('contactName', 'Please enter your name');
        isValid = false;
    }
    
    if (!data.company || data.company.length < 2) {
        showFieldError('contactCompany', 'Please enter your company');
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError('contactEmail', 'Please enter a valid email');
        isValid = false;
    }
    
    if (!data.phone || data.phone.length < 6) {
        showFieldError('contactPhone', 'Please enter a valid phone');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
        
        let errorDiv = field.parentNode.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }
}

function clearFormErrors(form) {
    if (!form) return;
    
    const errors = form.querySelectorAll('.error');
    const errorMessages = form.querySelectorAll('.error-message');
    
    errors.forEach(el => el.classList.remove('error'));
    errorMessages.forEach(el => el.remove());
}

// User status check
function checkUserStatus() {
    const stored = sessionStorage.getItem('btwUserData');
    if (stored) {
        userData = JSON.parse(stored);
        isLeadCaptured = true;
        console.log('User already registered:', userData.name);
    }
}

// Navbar highlighting
function initializeNavbarHighlight() {
    const sections = document.querySelectorAll('section[id], .testimonials, .community');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    function updateHighlight() {
        let current = '';
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < top + height) {
                // Map section classes to nav ids
                if (section.classList.contains('testimonials')) {
                    current = 'testimonials';
                } else if (section.classList.contains('community')) {
                    current = 'community';
                } else if (section.id) {
                    current = section.id;
                }
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateHighlight);
    updateHighlight();
}

// Notification system
function showNotification(message, type = 'info', duration = 4000) {
    // Remove existing
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create new
    const notification = document.createElement('div');
    notification.className = `notification status status--${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;padding:0 0 0 10px;font-size:16px;">&times;</button>
    `;
    
    // Style
    Object.assign(notification.style, {
        position: 'fixed',
        top: '120px',
        right: '20px',
        zIndex: '9999',
        padding: '12px 16px',
        borderRadius: '6px',
        maxWidth: '300px',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.style.transform = 'translateX(0)', 50);
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
}

// Analytics tracking
function trackEvent(eventName, properties = {}) {
    console.log('📊 Event:', eventName, properties);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (leadModal && !leadModal.classList.contains('hidden')) {
            hideLeadForm();
        }
        if (toolsModal && !toolsModal.classList.contains('hidden')) {
            hideToolsModal();
        }
    }
    
    // Arrow keys for testimonials
    if (testimonialSlides && testimonialSlides.length > 0) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousTestimonial();
            pauseTestimonialRotation();
            setTimeout(resumeTestimonialRotation, 3000);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextTestimonial();
            pauseTestimonialRotation();
            setTimeout(resumeTestimonialRotation, 3000);
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    stopTestimonialRotation();
});

// Visibility API to pause/resume carousel when tab is not active
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        pauseTestimonialRotation();
    } else {
        resumeTestimonialRotation();
    }
});

// Performance tracking
window.addEventListener('load', function() {
    console.log('Page loaded successfully');
    trackEvent('page_loaded');
});

// Global function exports
window.showLeadForm = showLeadForm;
window.hideLeadForm = hideLeadForm;
window.showToolsModal = showToolsModal;
window.hideToolsModal = hideToolsModal;
window.accessTool = accessTool;
window.goToSlide = goToSlide;
window.nextTestimonial = nextTestimonial;
window.previousTestimonial = previousTestimonial;

console.log('🚀 BTW AI Marketplace JavaScript - All Critical Bugs Fixed!');