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
    .from('#home .hero-title', { y: 40, opacity: 0, filter: "blur(12px)", duration: 1.8, ease: "power3.out" }, "-=0.6")
    .from('#home .hero-subtitle', { y: 20, opacity: 0, filter: "blur(8px)", duration: 1.8, ease: "power3.out" }, "-=1.4")
    .from('#home .image-wrapper', { scale: 0.85, opacity: 0, filter: "blur(10px)", duration: 2.2, ease: "expo.out" }, "-=1.6");

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
        
        if (isMenuOpen) {
            // Instant Reset Logo if routing from menu
            if (isMenuLink && !link.classList.contains('logo')) {
                const logo = document.querySelector('.logo');
                logo.style.transition = 'none'; // Lock transition
                toggleMenu();
                // Restore transition after browser applies the snap-back
                setTimeout(() => logo.style.transition = '', 50);
            } else {
                toggleMenu();
            }
        }
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

    // --- EASTER EGG KLABAUTERMANN TRACKER ---
    const klabauter = document.getElementById('klabauter-wrapper');
    if (klabauter) {
        gsap.set(klabauter, { y: 0, opacity: 0 }); // Initial hiding
        
        let hasDroppedInFuerWen = false; // Ensures it only runs exactly once per page load

        const klabauterObserver = new IntersectionObserver((entries) => {
            if (window.innerWidth <= 992) return; // Only process on Desktop
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'sc-hero-block') {
                        // Winched back up to the ceiling silently
                        // Does not explicitly reset the tracking flag so it stays dead.
                        gsap.to(klabauter, {
                            opacity: 0,
                            y: 0,
                            x: window.innerWidth * 0.85, 
                            duration: 1.5,
                            ease: 'power3.inOut',
                            overwrite: 'auto'
                        });
                    } else if (entry.target.id === 'sc-fuer-wen-block' && !hasDroppedInFuerWen) {
                        hasDroppedInFuerWen = true;
                        
                        const whiteBox = document.getElementById('sc-white-box');
                        const sectionRect = entry.target.getBoundingClientRect();
                        const boxRect = whiteBox ? whiteBox.getBoundingClientRect() : { top: 0, bottom: 0 };
                        
                        // Distance to the bottom floor of the section relative to his local starting point
                        const floorDropDistance = sectionRect.bottom - boxRect.top - 80;

                        // Start position behind the left side of the white box
                        gsap.set(klabauter, { x: 0, y: 0, opacity: 0, scaleX: -1, scaleY: 1, rotation: 0, zIndex: 5, transformOrigin: 'bottom center' }); 

                        gsap.killTweensOf('#klabautermann');
                        gsap.set('#klabautermann', { rotation: 0 });

                        // The cliff dive stealth timeline!
                        const tl = gsap.timeline();
                        
                        // 1. Peer out (Pops head up from behind the border box)
                        tl.to(klabauter, { opacity: 1, duration: 0.1, delay: 0.2 })
                          .to(klabauter, { y: -25, duration: 0.6, ease: 'power2.out' }) // Peers head up 
                          
                          // 2. Paranoia Look-Around while half-hidden
                          .to(klabauter, { scaleX: 1, duration: 0.1, delay: 0.2 }) // Looks right
                          .to(klabauter, { scaleX: -1, duration: 0.1, delay: 0.3 }) // Looks left
                          
                          // 3. Climb up actively and change depth (Z-Index) to clear the box edge
                          .to(klabauter, { y: -40, zIndex: 20, duration: 0.3, ease: 'power1.out', delay: 0.2 }) 
                          
                          // 4. Stand fully on the box and look around the cliff
                          .to(klabauter, { scaleX: 1, duration: 0.1, delay: 0.2 })
                          .to(klabauter, { scaleX: -1, duration: 0.1, delay: 0.3 })
                          
                          // 5. Jump off the cliff! (Arc backwards then drop)
                          .to(klabauter, { x: -45, y: -55, duration: 0.2, ease: 'power1.out' }, "+=0.2") 
                          .to(klabauter, { y: floorDropDistance, duration: 0.5, ease: 'power2.in' }) // The long drop mimicking gravity
                          
                          // 6. Tactical Squat upon impact
                          .to(klabauter, { scaleY: 0.5, duration: 0.15, ease: 'power2.out' }) 
                          .to(klabauter, { scaleY: 1, duration: 0.25, ease: 'back.out(2)' })
                          
                          // 6. Sprint away immediately!
                          .addLabel("runStart", "+=0.1")
                          .to(klabauter, { x: -2500, duration: 4.5, ease: 'power2.in' }, "runStart"); // Sprints deeply off any sized screen

                        // Frantic Waddle constraint applied concurrently alongside the sprint ONLY
                        tl.to(klabauter, {
                            rotation: -25, scaleY: 0.85, 
                            yoyo: true, repeat: 35, 
                            duration: 0.12, ease: 'sine.inOut'
                        }, "runStart")
                        .to(klabauter, {
                            y: "-=30", // Bouncing up locally from the floor target!
                            yoyo: true, repeat: 35, 
                            duration: 0.12, ease: 'sine.inOut'
                        }, "runStart+=0.06");
                    }
                }
            });
        }, { threshold: 0.6 }); 
        
        const scHero = document.getElementById('sc-hero-block');
        const scFuerWen = document.getElementById('sc-fuer-wen-block');
        if (scHero) klabauterObserver.observe(scHero);
        if (scFuerWen) klabauterObserver.observe(scFuerWen);
    }

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
    }    // -----------------------------------------
    // 4. Immersive Teaser Mouse Tracking
    // -----------------------------------------
    const teaserSection = document.getElementById('home-camp');
    const teaserBg = document.querySelector('.teaser-bg');
    
    if (teaserSection && teaserBg) {
        let dwellTimeout;
        let lastX = 0;
        let lastY = 0;
        let isDwelling = false;
        const dwellTriggerDistance = 150; // Massively widened: ~300px box allows huge micro-adjustments
        const baseScale = 1.08; // Higher base scale provides wider buffer for visible panning
        const zoomScale = 1.25; // Deeper zoom ceiling
        const panAmount = -80; // Tripled panning distance for extremely noticeable camera swing

        teaserSection.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 992) return; 
            
            const rect = teaserSection.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const normX = (mouseX / rect.width) - 0.5;
            const normY = (mouseY / rect.height) - 0.5;
            
            const deltaX = Math.abs(mouseX - lastX);
            const deltaY = Math.abs(mouseY - lastY);
            
            // Only update the anchor target when NOT actively zooming.
            // This prevents visual snapping and allows smooth micro-panning inside the active zoom.
            if (!isDwelling) {
                const originX = (mouseX / rect.width) * 100;
                const originY = (mouseY / rect.height) * 100;
                gsap.set(teaserBg, { transformOrigin: `${originX}% ${originY}%` });
            }
            
            gsap.to(teaserBg, {
                x: normX * panAmount,
                y: normY * panAmount,
                duration: 2.5, // Perfectly balanced wait/mass ratio
                ease: 'power3.out',
                overwrite: 'auto' // CRITICAL: Fixes GSAP stacking on mousemove
            });

            if (deltaX > dwellTriggerDistance || deltaY > dwellTriggerDistance) {
                clearTimeout(dwellTimeout);
                lastX = mouseX;
                lastY = mouseY;
                
                if (isDwelling) {
                    isDwelling = false;
                    gsap.to(teaserBg, {
                        scale: baseScale,
                        duration: 1.2, // Softer exit
                        ease: 'power3.out'
                    });
                }
                
                dwellTimeout = setTimeout(() => {
                    isDwelling = true;
                    // Execute slow cinematic zoom
                    gsap.to(teaserBg, {
                        scale: zoomScale,
                        duration: 8, // Träge, majestic build up
                        ease: 'power1.inOut' 
                    });
                }, 200); // Trigger deep dwell slightly faster since box is huge
            }
        });

        teaserSection.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 992) return;
            clearTimeout(dwellTimeout);
            isDwelling = false;
            gsap.to(teaserBg, {
                x: 0,
                y: 0,
                scale: baseScale,
                duration: 1.5,
                ease: 'power3.out',
                transformOrigin: "center 40%" 
            });
        });
    }

    // ----------------------------------------------------
    // PROMISE INTERACTIVE TEXT REVEAL LOGIC
    // ----------------------------------------------------
    const promiseSection = document.getElementById('promise-section');
    const blurredText = document.getElementById('blurredText');
    const revealCanvas = document.getElementById('revealCanvas');
    const revealShapes = document.getElementById('revealShapes');
    const closingLine = document.getElementById('closingLine');
    const lightCursor = document.getElementById('lightCursor');
    const sharpTextNode = document.getElementById('sharpText');
    const promiseHint = document.getElementById('promise-hint');

    if (promiseSection && blurredText && window.matchMedia('(hover: hover)').matches && window.innerWidth > 992) {
        
        promiseSection.classList.add('cursor-active');

        // Tracking individual Word Spans natively
        let wordSpans = null;
        let currentUnlockedWordIndex = 0;
        let idleResetTimeout;
        let hintDismissed = false;
        let closingShown = false;

        function addReveal(x, y) {
            // Lazy load the spans array once on first interaction
            if (!wordSpans && sharpTextNode) {
                wordSpans = sharpTextNode.querySelectorAll('.reveal-word');
            }
            if (!wordSpans || wordSpans.length === 0) return;

            // Strict Sequential Zipper Logic
            // We sequentially check if the mouse satisfies the *immediate next* locked word.
            // If you scrub quickly, the loop processes multiple words cascadingly in a single frame.
            while (currentUnlockedWordIndex < wordSpans.length) {
                let targetSpan = wordSpans[currentUnlockedWordIndex];
                let rect = targetSpan.getBoundingClientRect();
                
                // Generous vertical tolerance so your hand doesn't slip off
                let hitTop = rect.top - 80;
                let hitBottom = rect.bottom + 80;
                
                // Forgiving left approach, but STRICT right approach boundary.
                // This prevents "mass pop-in" if you enter the line backwards from the right.
                let hitLeft = rect.left - 40;
                let hitRight = rect.right + 70;
                
                if (x > hitLeft && x < hitRight && y > hitTop && y < hitBottom) {
                    targetSpan.classList.add('revealed');
                    currentUnlockedWordIndex++;
                } else {
                    // You haven't functionally touched this precise next word yet. 
                    // Break stops any future words from unlocking!
                    break;
                }
            }

            if (!hintDismissed && promiseHint) {
                promiseHint.classList.add('hidden');
                hintDismissed = true;
            }

            // Has everything been fully read?
            if (currentUnlockedWordIndex >= wordSpans.length) {
                if (!closingShown && closingLine) {
                    closingLine.classList.add('revealed');
                    closingShown = true;
                }
            }

            resetIdleTimer();
        }

        function resetIdleTimer() {
            clearTimeout(idleResetTimeout);
            idleResetTimeout = setTimeout(() => {
                if (wordSpans) {
                    wordSpans.forEach(span => span.classList.remove('revealed'));
                }
                if (closingLine) closingLine.classList.remove('revealed');
                closingShown = false;
                currentUnlockedWordIndex = 0;
            }, 8000); // Reset sequence automatically if they abandon reading it
        }

        let lastAddX = -9999, lastAddY = -9999;

        promiseSection.addEventListener('mouseenter', () => {
            mouseInsidePromise = true;
            if (lightCursor) lightCursor.classList.add('active');
            updateCanvasSize();
        });

        promiseSection.addEventListener('mouseleave', () => {
            mouseInsidePromise = false;
            if (lightCursor) lightCursor.classList.remove('active');
        });

        let isTicking = false;
        promiseSection.addEventListener('mousemove', (e) => {
            if (lightCursor) {
                lightCursor.style.left = e.clientX + 'px';
                lightCursor.style.top = e.clientY + 'px';
            }

            // Run at full 60FPS fluid logic natively coupled to monitors refresh rate
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    addReveal(e.clientX, e.clientY);
                    isTicking = false;
                });
                isTicking = true;
            }
        });

        // Auto-hide hint after 6 seconds even without interaction
        setTimeout(() => {
            if (!hintDismissed && promiseHint) {
                promiseHint.classList.add('hidden');
                hintDismissed = true;
            }
        }, 6000);
    }
});
