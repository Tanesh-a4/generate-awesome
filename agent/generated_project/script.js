document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    // Function to toggle the mobile navigation menu
    const toggleMobileMenu = () => {
        if (mainNav) {
            mainNav.classList.toggle('nav-open');
        }
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Function to handle scroll animations - this is the IntersectionObserver callback
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a CSS class (e.g., 'fade-in' or 'slide-up')
                // 'is-visible' will trigger the animation defined in CSS
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    };

    // Function to initialize scroll animations
    const initializeScrollAnimations = () => {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observer = new IntersectionObserver(animateOnScroll, observerOptions);

        // Select all elements intended for animation
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    };

    // Call the animation initialization function when the DOM is loaded
    initializeScrollAnimations();
});