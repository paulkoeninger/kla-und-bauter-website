window.addEventListener('load', () => {
    // -----------------------------------------
    // 1. Flying Logo & Intro Animation
    // -----------------------------------------
    const loader = document.querySelector('.loader');
    const loaderLogo = document.querySelector('.loader-logo');
    const navLogoImg = document.querySelector('.nav-logo-img');
    
    // Stop CSS pulse and set explicit origins to prevent jumps
    loaderLogo.style.animation = 'none';
    navLogoImg.style.opacity = 0; // hide actual logo during flight

    // Calculate center-to-center distance
    const startRect = loaderLogo.getBoundingClientRect();
    const targetRect = navLogoImg.getBoundingClientRect();
    
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;
    
    const destX = targetX - startX;
    const destY = targetY - startY;
    const scale = targetRect.width / startRect.width;

    const tl = gsap.timeline();
    
    tl.to(loaderLogo, {
        x: destX,
        y: destY,
        scale: scale,
        duration: 1.2,
        ease: "power3.inOut"
    }, "+=0.3") // slight delay before flying
    .to(loader, {
        backgroundColor: "rgba(250, 250, 250, 0)", // Fade out loader background
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
             // Clean up and disable pointer events
             loader.style.pointerEvents = 'none';
        }
    }, "<")
    .add(() => {
        // Swap flying logo with the real one
        navLogoImg.style.opacity = 1;
        loader.style.display = 'none';
    })
    .from('.menu-toggle .bar', { opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
    .from('#home .hero-title', { y: 120, opacity: 0, duration: 1.2, ease: "power4.out" }, "-=0.6")
    .from('#home .hero-subtitle', { width: 0, opacity: 0, duration: 1, ease: "power3.inOut" }, "-=0.8")
    .from('#home .image-wrapper', { scale: 0.85, opacity: 0, duration: 2, ease: "expo.out" }, "-=1.2");

    // Menu Hover Effect
    const menuToggle = document.querySelector('.menu-toggle');
    const bars = document.querySelectorAll('.bar');
    
    menuToggle.addEventListener('mouseenter', () => {
        gsap.to(bars[0], { x: 8, duration: 0.3, ease: 'power2.out' });
        gsap.to(bars[1], { x: -8, duration: 0.3, ease: 'power2.out' });
    });
    menuToggle.addEventListener('mouseleave', () => {
        gsap.to(bars, { x: 0, duration: 0.3, ease: 'power2.out' });
    });

    // -----------------------------------------
    // 2. Fullscreen Menu Logic (Instant)
    // -----------------------------------------
    const menuOverlay = document.getElementById('fullscreen-menu');
    let isMenuOpen = false;

    // Remove old GSAP styles from menu texts if they accidentally received any
    const menuLinksItems = document.querySelectorAll('.menu-links li a');
    const menuFooter = document.querySelector('.menu-footer');
    gsap.set([menuLinksItems, menuFooter], { opacity: 1, y: 0 });

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            menuOverlay.classList.add('open');
            menuOverlay.style.opacity = 1;
            
            // Transform hamburger to 'X' (keep animation)
            gsap.to(bars[0], { rotation: 45, y: 5.5, x: 0, duration: 0.3 });
            gsap.to(bars[1], { rotation: -45, y: -5.5, x: 0, duration: 0.3 });
        } else {
            menuOverlay.classList.remove('open');
            menuOverlay.style.opacity = 0;
            
            // Transform hamburger back
            gsap.to(bars[0], { rotation: 0, y: 0, x: 0, duration: 0.3 });
            gsap.to(bars[1], { rotation: 0, y: 0, x: 0, duration: 0.3 });
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    // -----------------------------------------
    // 3. SPA Routing & Slide Transitions
    // -----------------------------------------
    const slideSelectors = '.hero-title, .hero-subtitle, .image-wrapper, .section-title, .service-item, .page-title, .text-content, .image-content, .video-wrapper, .contact-info, .contact-form, .legal-text, .produktion-intro, .process-step, .detail-section, .songcamp-headline, .feature-list, .info-items, .songcamp-banner';
    
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('[data-route]');
        if (!link) return;
        
        e.preventDefault();
        const targetRoute = link.getAttribute('data-route');
        
        // If the link is inside the menu, it's instant
        const isMenuLink = link.closest('#fullscreen-menu') !== null || link.classList.contains('logo');
        
        if (isMenuOpen) toggleMenu();
        if (targetRoute === currentRoute || isTransitioning) return;
        
        navigateTo(targetRoute, isMenuLink);
    });

    let currentRoute = 'home';
    let isTransitioning = false;

    function navigateTo(targetRoute, instant = false) {
        const incomingSection = document.getElementById(targetRoute);
        if(!incomingSection) return;

        const outgoingSection = document.getElementById(currentRoute);

        if (instant) {
            outgoingSection.classList.remove('active');
            incomingSection.classList.add('active');
            window.scrollTo(0, 0);
            currentRoute = targetRoute;
            return;
        }

        isTransitioning = true;
        
        let outgoingElements = outgoingSection.querySelectorAll(slideSelectors);
        if(outgoingElements.length === 0) outgoingElements = outgoingSection.children;
        
        let winWidth = window.innerWidth;
        
        // SLIDE OUT: Elements move to the left
        gsap.to(outgoingElements, {
            x: -window.innerWidth * 0.5, // Slide out left
            opacity: 0,
            duration: 0.4,
            stagger: { amount: 0.15, from: "start" }, // Staggered to feel organic
            ease: "power2.in",
            onComplete: () => {
                outgoingSection.classList.remove('active');
                incomingSection.classList.add('active');
                
                // Reset outgoing styling
                gsap.set(outgoingElements, { clearProps: "all" });
                window.scrollTo(0, 0);

                // SLIDE IN logic
                let incomingElements = incomingSection.querySelectorAll(slideSelectors);
                if(incomingElements.length === 0) incomingElements = incomingSection.children;
                
                // Start from the right
                gsap.set(incomingElements, {
                    x: window.innerWidth * 0.5,
                    opacity: 0
                });
                
                // Sweep into position
                gsap.to(incomingElements, {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: { amount: 0.15, from: "start" },
                    ease: "power3.out",
                    onComplete: () => {
                        currentRoute = targetRoute;
                        isTransitioning = false;
                        gsap.set(incomingElements, { clearProps: "all" });
                    }
                });
            }
        });
    }
});
