window.addEventListener('load', () => {
    document.documentElement.classList.add('snap-active');

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

    // -----------------------------------------
    // 2. Fullscreen Menu Logic (Instant)
    // -----------------------------------------
    const menuOverlay = document.getElementById('fullscreen-menu');
    let isMenuOpen = false;

    // Menu Hover Effect
    const menuToggle = document.querySelector('.menu-toggle');
    const bars = document.querySelectorAll('.bar');
    
    menuToggle.addEventListener('mouseenter', () => {
        if (!isMenuOpen) {
            gsap.to(bars[0], { x: 8, duration: 0.3, ease: 'power2.out' });
            gsap.to(bars[1], { x: -8, duration: 0.3, ease: 'power2.out' });
        }
    });
    menuToggle.addEventListener('mouseleave', () => {
        if (!isMenuOpen) {
            gsap.to(bars, { x: 0, duration: 0.3, ease: 'power2.out' });
        }
    });

    // Remove old GSAP styles from menu texts if they accidentally received any
    const menuLinksItems = document.querySelectorAll('.menu-links li a');
    const menuFooter = document.querySelector('.menu-footer');
    gsap.set([menuLinksItems, menuFooter], { opacity: 1, y: 0 });

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuToggle.classList.toggle('open', isMenuOpen);
        
        if (isMenuOpen) {
            menuOverlay.classList.add('open');
            menuOverlay.style.opacity = 1;
        } else {
            menuOverlay.classList.remove('open');
            menuOverlay.style.opacity = 0;
            // Clean up any stray GSAP transforms from the hover effect
            gsap.set(bars, { clearProps: "x" });
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    // -----------------------------------------
    // 3. SPA Routing & Slide Transitions
    // -----------------------------------------
    const slideSelectors = '.hero-title, .hero-subtitle, .image-wrapper, .section-title, .service-item, .page-title, .text-content, .image-content, .video-wrapper, .contact-info, .contact-form, .legal-text, .produktion-intro, .process-step, .detail-section, .songcamp-headline, .feature-list, .info-items, .songcamp-banner, .snap-block-inner';
    
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

        // Preemptively disable snap to prevent browser layout engine fighting during route transition
        document.documentElement.classList.remove('snap-active');

        // Centralized heavy-duty scroll reset to beat mobile rendering lag
        const forceScrollToTop = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            // Defer scroll to next render frames to guarantee layout height has updated
            requestAnimationFrame(() => window.scrollTo(0, 0));
            setTimeout(() => window.scrollTo(0, 0), 10);
            setTimeout(() => window.scrollTo(0, 0), 50);
        };

        if (instant) {
            outgoingSection.classList.remove('active');
            incomingSection.classList.add('active');
            forceScrollToTop();
            currentRoute = targetRoute;
            if (['home', 'produktion', 'songcamps'].includes(targetRoute)) document.documentElement.classList.add('snap-active');
            return;
        }

        isTransitioning = true;
        
        let outgoingElements = outgoingSection.querySelectorAll(slideSelectors);
        if(outgoingElements.length === 0) outgoingElements = outgoingSection.children;
        
        let winWidth = window.innerWidth;
        
        // SLIDE OUT: Elements move to the left
        gsap.to(outgoingElements, {
            x: -window.innerWidth * 0.5, 
            opacity: 0,
            duration: 0.4,
            stagger: { amount: 0.15, from: "start" },
            ease: "power2.in",
            onComplete: () => {
                // DOM Layout Swap
                outgoingSection.classList.remove('active');
                incomingSection.classList.add('active');
                
                // Immediately force scroll to top before next paint
                forceScrollToTop();
                
                // Reset outgoing styling
                gsap.set(outgoingElements, { clearProps: "all" });

                // SLIDE IN logic
                let incomingElements = incomingSection.querySelectorAll(slideSelectors);
                if(incomingElements.length === 0) incomingElements = incomingSection.children;
                
                gsap.set(incomingElements, {
                    x: window.innerWidth * 0.5,
                    opacity: 0
                });
                
                gsap.to(incomingElements, {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: { amount: 0.15, from: "start" },
                    ease: "power3.out",
                    onComplete: () => {
                        currentRoute = targetRoute;
                        if (['home', 'produktion', 'songcamps'].includes(targetRoute)) document.documentElement.classList.add('snap-active');
                        isTransitioning = false;
                        gsap.set(incomingElements, { clearProps: "all" });
                    }
                });
            }
        });
    }

    // GSAP Vibe Logic removed to streamline UI

    // Intersection Observer for elegant Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px',
        threshold: 0.15 /* Triggers when 15% of the section is visible */
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                /* Remove class so the animation gracefully replays when snapping back */
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Apply observer to specific scroll-reveal components globally
    const animatedSections = document.querySelectorAll('.home-entry-section, .home-camp-section, .scroll-anim');
    animatedSections.forEach(sec => scrollObserver.observe(sec));

    // Extremely sluggish cinematic GSAP Mouse Parallax
    const campSection = document.querySelector('.home-camp-section');
    const campImg = document.querySelector('.camp-bg-img');

    if (campSection && campImg) {
        // Set base scale larger than window to hide any map bleed when panning
        gsap.set(campImg, { scale: 1.06 });

        campSection.addEventListener('mousemove', (e) => {
            const rect = campSection.getBoundingClientRect();
            // X and Y cursor offset from the literal center of the section frame
            const xPos = (e.clientX - rect.left) / rect.width - 0.5;
            const yPos = (e.clientY - rect.top) / rect.height - 0.5;
            
            gsap.to(campImg, {
                x: xPos * -50, // Inverse mouse tracking up to 50 pixels
                y: yPos * -50,
                duration: 3, // Highly sluggish responsive time creates weight mass
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        // Gently re-center when leaving
        campSection.addEventListener('mouseleave', () => {
            gsap.to(campImg, {
                x: 0,
                y: 0,
                duration: 4,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    }

    // -----------------------------------------
    // 4. Interactive Mindmap Logic
    // -----------------------------------------
    const mindmapSection = document.getElementById('home-camp');
    const mindmap = document.querySelector('.mindmap-container');
    const mmCenter = document.getElementById('mm-center');
    const mmWinter = document.getElementById('mm-winter');
    const mmSummer = document.getElementById('mm-summer');
    const winterWords = document.querySelectorAll('.mm-word.winter');
    const summerWords = document.querySelectorAll('.mm-word.summer');
    
    if (mmCenter && mindmapSection) {
        let currentMapState = 'none';

        // Helper functions mapped to node states
        function activateWinter() {
            if (currentMapState === 'winter') return;
            currentMapState = 'winter';
            gsap.to(mmWinter, { opacity: 1, textShadow: '0 0 20px rgba(255,255,255,0.6)', duration: 0.5 });
            gsap.to(winterWords, { opacity: 1, pointerEvents: 'auto', duration: 1, ease: 'power2.out', stagger: 0.05 });
            gsap.to(summerWords, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
            gsap.to(mmSummer, { opacity: 0.3, textShadow: '0 0 0px rgba(255,255,255,0)', duration: 0.5 });
        }
        
        function activateSummer() {
            if (currentMapState === 'summer') return;
            currentMapState = 'summer';
            gsap.to(mmSummer, { opacity: 1, textShadow: '0 0 20px rgba(255,255,255,0.6)', duration: 0.5 });
            gsap.to(summerWords, { opacity: 1, pointerEvents: 'auto', duration: 1, ease: 'power2.out', stagger: 0.05 });
            gsap.to(winterWords, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
            gsap.to(mmWinter, { opacity: 0.3, textShadow: '0 0 0px rgba(255,255,255,0)', duration: 0.5 });
        }
        
        function resetToCenter() {
            if (currentMapState === 'center') return;
            currentMapState = 'center';
            gsap.to([mmWinter, mmSummer], { opacity: 0.6, textShadow: '0 0 15px rgba(255,255,255,0.2)', duration: 1.2, ease: 'power2.out' });
            gsap.to([winterWords, summerWords], { opacity: 0, pointerEvents: 'none', duration: 0.8 });
        }

        // --- DESKTOP FLUID ZONES ---
        mindmapSection.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 992) return;
            
            const rect = mindmapSection.getBoundingClientRect();
            const xPercentage = (e.clientX - rect.left) / rect.width;
            
            if (xPercentage < 0.42) { // Left 42% of the screen
                activateWinter();
            } else if (xPercentage > 0.58) { // Right 42% of the screen
                activateSummer();
            } else { // Center 16% safety margin
                resetToCenter();
            }
        });

        // Desktop Total Reset when leaving section
        mindmapSection.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 992) return;
            currentMapState = 'none';
            gsap.to([mmWinter, mmSummer], { opacity: 0, textShadow: '0 0 0px rgba(255,255,255,0)', duration: 1.5 });
            gsap.to([winterWords, summerWords], { opacity: 0, pointerEvents: 'none', duration: 1.0 });
        });

        // --- MOBILE TAP TOGGLES ---
        if(window.innerWidth <= 992) {
            gsap.set([mmWinter, mmSummer], { opacity: 0.6 });
            currentMapState = 'center';
        }
        // Universal listeners filtered dynamically
        mmWinter.addEventListener('click', () => { if(window.innerWidth <= 992) activateWinter(); });
        mmSummer.addEventListener('click', () => { if(window.innerWidth <= 992) activateSummer(); });
        mmCenter.addEventListener('click', () => { if(window.innerWidth <= 992) resetToCenter(); });
    }

});
