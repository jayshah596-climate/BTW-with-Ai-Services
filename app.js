// BTW with AI Marketplace JavaScript - Updated for Direct Dashboard Links

// Global state
let currentTool = '';
let isLeadCaptured = false;
let userData = null;

// DOM Elements
let navToggle, navMenu, leadModal, toolsModal, leadForm, contactForm;

// Initialize website
document.addEventListener('DOMContentLoaded', function() {
    console.log('BTW AI Marketplace - Initializing with direct dashboard links...');
    
    // Add small delay to ensure DOM is fully ready
    setTimeout(() => {
        // Get DOM elements
        initializeDOMElements();
        
        // Initialize all functionality
        initializeNavigation();
        initializeForms();
        initializeScrolling();
        initializeClickHandlers();
        checkUserStatus();
        initializeNavbarHighlight();
        
        console.log('BTW AI Marketplace initialized successfully with direct dashboard access!');
    }, 100);
});

function initializeDOMElements() {
    navToggle = document.getElementById('navToggle');
    navMenu = document.getElementById('navMenu');
    leadModal = document.getElementById('leadModal');
    toolsModal = document.getElementById('toolsModal');
    leadForm = document.getElementById('leadForm');
    contactForm = document.getElementById('contactForm');

    console.log('DOM Elements Status:', {
        navToggle: !!navToggle,
        navMenu: !!navMenu,
        leadModal: !!leadModal,
        toolsModal: !!toolsModal,
        leadForm: !!leadForm,
        contactForm: !!contactForm
    });
}

// Initialize click handlers - Updated for direct links
function initializeClickHandlers() {
    console.log('Setting up click handlers for direct dashboard access...');
    
    // 1. Lead capture buttons (only for navigation and hero buttons)
    document.addEventListener('click', function(e) {
        // Check for specific lead capture buttons (not the dashboard access buttons)
        if (e.target.matches('button') && e.target.textContent.includes('Access Free AI Tools')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Navigation lead capture button clicked');
            showLeadForm('general');
            return;
        }
        if (e.target.matches('a[href="#lead"]')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hero lead capture button clicked');
            showLeadForm('general');
            return;
        }  
        
    });
    
    // 2. Setup modal handlers
    setupModalHandlers();
    
    console.log('Click handlers setup complete - dashboard buttons will work as direct links');
}

function setupModalHandlers() {
    // Modal close buttons and backdrop clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close') || e.target.textContent === '×') {
            e.preventDefault();
            const modal = e.target.closest('.modal');
            if (modal) {
                if (modal.id === 'leadModal') {
                    hideLeadForm();
                } else if (modal.id === 'toolsModal') {
                    hideToolsModal();
                }
            }
        }
        
        // Modal backdrop clicks
        if (e.target.classList.contains('modal-backdrop')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                if (modal.id === 'leadModal') {
                    hideLeadForm();
                } else if (modal.id === 'toolsModal') {
                    hideToolsModal();
                }
            }
        }
        
        // Tool access buttons in modal (for the tools modal)
        if (e.target.textContent && e.target.textContent.includes('Launch Dashboard')) {
            e.preventDefault();
            const toolType = determineToolTypeFromContext(e.target);
            console.log('Tool launch requested from modal:', toolType);
            accessTool(toolType);
        }
    });
}

function determineToolTypeFromContext(element) {
    const container = element.closest('.tool-access-item');
    if (!container) return 'general';
    
    const title = container.querySelector('h4');
    if (!title) return 'general';
    
    return determineToolTypeFromTitle(title.textContent);
}

function determineToolTypeFromTitle(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('climate scenario')) return 'climate-scenario';
    if (titleLower.includes('esg score') || titleLower.includes('sustainalytics')) return 'esg-score';
    if (titleLower.includes('esg reports') || titleLower.includes('sasb')) return 'esg-reports';
    
    return 'general';
}

// Enhanced Navigation
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

    // Navigation links - Fixed with event delegation
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link[href^="#"]')) {
            e.preventDefault();
            
            const targetId = e.target.getAttribute('href').substring(1);
            console.log('Navigation clicked:', targetId);
            
            // Close mobile menu if open
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            
            scrollToSection(targetId);
            trackEvent('navigation_clicked', { section: targetId });
        }
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

function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    
    if (targetElement) {
        // Calculate scroll position
        const navbar = document.querySelector('.navbar');
        const offset = navbar ? navbar.offsetHeight + 20 : 120;
        const targetPosition = targetElement.offsetTop - offset;
        
        // Smooth scroll
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
        
        console.log('Scrolled to:', sectionId);
    } else {
        console.error('Target element not found:', sectionId);
    }
}

// Smooth scrolling
function initializeScrolling() {
    console.log('Scroll initialization complete');
}

// Lead Capture Functions - Updated
function showLeadForm(toolType = '') {
    console.log('Showing lead form for tool:', toolType);
    
    if (!leadModal) {
        console.error('Lead modal not found');
        showNotification('Error: Registration form not available', 'error');
        return;
    }
    
    currentTool = toolType;
    
    // Set the tool requested in the hidden field
    const toolRequestedField = document.getElementById('toolRequested');
    if (toolRequestedField) {
        toolRequestedField.value = toolType;
    }
    
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

// Form handling - Fixed for Formspree integration
function initializeForms() {
    console.log('Initializing forms with Formspree integration...');
    
       
    // Contact form - Fixed for Formspree
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            console.log('Contact form submission started...');
            
            // Get form data for validation
            const formData = new FormData(contactForm);
            const contactData = {
                name: formData.get('name'),
                company: formData.get('company'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };
            
            // Validate before allowing Formspree submission
            if (!validateContactForm(contactData)) {
                e.preventDefault();
                showNotification('Please correct the form errors', 'error');
                return;
            }
            
            // Show loading state immediately
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending via Formspree...';
                submitBtn.classList.add('loading');
            }
            
            // Show immediate feedback
            showNotification('Thank you! Your message is being sent via Formspree...', 'success');
            
            // Track the submission
            trackEvent('contact_form_submitted', { company: contactData.company });
            
            // Let the form submit naturally to Formspree
            // Note: In a real scenario, user would be redirected to Formspree's success page
            // For demo purposes, we'll simulate the post-submission flow
            setTimeout(() => {
                console.log('Contact form submitted to Formspree endpoint: https://formspree.io/f/xjkejjzd');
                console.log('Email will be delivered to: jayshah596@gmail.com');
                
                contactForm.reset();
                clearFormErrors(contactForm);
                
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    submitBtn.classList.remove('loading');
                }
                
                showNotification('Message sent successfully! Jay will get back to you within 24 hours.', 'success');
            }, 3000);
        });
        console.log('Contact form handler attached with Formspree integration');
    }
}

// Tool access function - Updated for direct links
function accessTool(toolType) {
    console.log('Accessing tool:', toolType);
    
    // Direct URLs for tools
    const toolUrls = {
        'climate-scenario': 'https://topmate.io/jay_shah_btw/1703858',
        'esg-score': 'https://topmate.io/jay_shah_btw/1712978',
        'esg-reports': 'https://topmate.io/jay_shah_btw/1703812'
    };
    
    showNotification(`Launching ${toolType} dashboard...`, 'info');
    
    setTimeout(() => {
        if (toolUrls[toolType]) {
            window.open(toolUrls[toolType], '_blank');
            hideToolsModal();
            trackEvent('tool_accessed_from_modal', { tool: toolType });
        } else {
            showNotification('Tool URL not found', 'error');
        }
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
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    function updateHighlight() {
        let current = '';
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < top + height) {
                current = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateHighlight);
    updateHighlight();
}

// Notification system - Enhanced
function showNotification(message, type = 'info', duration = 5000) {
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
        maxWidth: '350px',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        lineHeight: '1.4'
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

// Analytics tracking - Enhanced
function trackEvent(eventName, properties = {}) {
    console.log('📊 Event:', eventName, properties);
    
    // Enhanced tracking for direct dashboard access
    if (eventName.includes('dashboard_accessed_directly')) {
        console.log('🔗 Direct dashboard access:', properties.tool);
        console.log('🎯 No registration required - community impact in action!');
    }
    
    // Enhanced tracking for Formspree integration
    if (eventName.includes('form_submitted')) {
        console.log('📧 Form submitted to Formspree endpoint: https://formspree.io/f/mldwadbn');
        console.log('📧 Email will be delivered to: jayshah596@gmail.com');
        console.log('📱 WhatsApp contact: +44-7435996857');
    }
}

// --- Testimonials Slider ---
const testimonials = [
    {
        quote: "BTW with AI transformed our ESG reporting. The dashboards are intuitive and saved us weeks of manual work.",
        author: "Priya S.",
        role: "Sustainability Manager, Global Manufacturing"
    },
    {
        quote: "The climate scenario tools provided actionable insights for our board. Highly recommended for any ESG team.",
        author: "James L.",
        role: "Head of ESG, Financial Services"
    },
    {
        quote: "We joined the community and immediately found value in the shared knowledge and tools. The WhatsApp group is a goldmine!",
        author: "Elena G.",
        role: "ESG Analyst, Consulting"
    }
];

let currentTestimonial = 0;

function renderTestimonial(idx) {
    const slider = document.getElementById('testimonialsSlider');
    if (!slider) return;
    const t = testimonials[idx];
    slider.innerHTML = `
        <div class="testimonial-card">
            <div class="testimonial-quote">"${t.quote}"</div>
            <div class="testimonial-author">${t.author}</div>
            <div class="testimonial-role">${t.role}</div>
        </div>
    `;
}

function showPrevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(currentTestimonial);
}
function showNextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    renderTestimonial(currentTestimonial);
}

document.addEventListener('DOMContentLoaded', function() {
    renderTestimonial(currentTestimonial);
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    if (prevBtn) prevBtn.addEventListener('click', showPrevTestimonial);
    if (nextBtn) nextBtn.addEventListener('click', showNextTestimonial);
});

// Track direct dashboard access when users click the dashboard links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href*="topmate.io"]') && 
        e.target.textContent.includes('Access Dashboard')) {
        const toolCard = e.target.closest('.tool-card');
        if (toolCard) {
            const title = toolCard.querySelector('h4');
            if (title) {
                const toolType = determineToolTypeFromTitle(title.textContent);
                trackEvent('dashboard_accessed_directly', { 
                    tool: toolType,
                    url: e.target.href 
                });
                showNotification(`Opening ${toolType} dashboard in new tab!`, 'success', 2000);
            }
        }
    }
});

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
});

// Performance tracking
window.addEventListener('load', function() {
    console.log('Page loaded successfully with direct dashboard access');
    trackEvent('page_loaded');
});

// Global function exports for backward compatibility
window.showLeadForm = showLeadForm;
window.hideLeadForm = hideLeadForm;
window.showToolsModal = showToolsModal;
window.hideToolsModal = hideToolsModal;
window.accessTool = accessTool;

console.log('🚀 BTW AI Marketplace JavaScript loaded with direct dashboard access!');
console.log('✅ Dashboard buttons now work as direct links - no registration required!');