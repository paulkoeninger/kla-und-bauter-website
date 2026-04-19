window.addEventListener('load', () => {
    // -----------------------------------------
    // 1. Loader fade-out + Hero-Reveals (kein Flug mehr).
    // -----------------------------------------
    const loader = document.querySelector('.loader');
    gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
            loader.style.display = 'none';
            loader.style.pointerEvents = 'none';
        }
    });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.from('.menu-toggle .bar', { opacity: 0, duration: 0.5, ease: "power3.out" })
      .from('#home .hero-title', { y: 40, opacity: 0, filter: "blur(12px)", duration: 1.1, ease: "power3.out" }, "-=0.25")
      .from('#home .hero-subtitle', { y: 20, opacity: 0, filter: "blur(8px)", duration: 1.1, ease: "power3.out" }, "-=0.85")
      .from('#home .image-wrapper', { scale: 0.85, opacity: 0, filter: "blur(10px)", duration: 1.3, ease: "expo.out" }, "-=1.0");

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
    
    // Hash-anchor clicks (z. B. Produktion Quick-Nav → #prod-step-01):
    // smooth-scroll und replaceState statt null-state-push, das sonst den
    // popstate-Handler in den home-Fallback zieht.
    document.body.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        if (anchor.hasAttribute('data-route')) return; // data-route links weiter unten behandelt
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try {
            history.replaceState({ route: currentRoute }, '', window.location.pathname + href);
        } catch (err) { /* file:// throws, silently ignore */ }
    });

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('[data-route]');
        if (!link) return;

        e.preventDefault();
        const targetRoute = link.getAttribute('data-route');
        const scrollTo = link.getAttribute('data-scroll-to');

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

        if (targetRoute === currentRoute) {
            console.log('[nav] same-route click → scroll to top', { targetRoute, scrollTo, scrollY: window.scrollY });
            // Schon auf der Zielseite — wenn Anker gesetzt, dorthin; sonst
            // zum Seitenanfang (konsistent: Navigation führt IMMER ans Top).
            if (scrollTo) {
                const target = document.getElementById(scrollTo);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Alle bekannten Scroll-Methoden parallel — deckt Browser-Quirks ab.
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                window.scrollTo(0, 0);
                requestAnimationFrame(() => {
                    document.documentElement.scrollTop = 0;
                    window.scrollTo(0, 0);
                });
                setTimeout(() => window.scrollTo(0, 0), 20);
            }
            return;
        }
        if (isTransitioning) return;

        navigateTo(targetRoute, isMenuLink);

        if (scrollTo) {
            // Nach Page-Transition (≈ 0.9 s) zum Anker scrollen
            setTimeout(() => {
                const target = document.getElementById(scrollTo);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1100);
        }
    });

    // Initialize SPA via native URLs
    let currentRoute = 'home';
    let isTransitioning = false;

    // Boot hook: natively parse deep links
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.route) {
            if (e.state.route !== currentRoute) {
                navigateTo(e.state.route, true, true);
            }
        } else {
            if (currentRoute !== 'home') navigateTo('home', true, true);
        }
    });

    const initialPath = window.location.pathname.replace(/^\/|\/$/g, '');
    const validRoutes = ['home', 'produktion', 'sessions', 'songcamps', 'team', 'releases', 'kontakt', 'impressum', 'datenschutz'];
    
    if (initialPath && validRoutes.includes(initialPath)) {
        setTimeout(() => navigateTo(initialPath, true, true), 50);
    } else {
        try {
            history.replaceState({route: 'home'}, '', '/');
        } catch(e) {
            // Fails on local file:// execution, silently ignore
        }
    }

    function navigateTo(targetRoute, instant = false, skipHistory = false) {
        if (!skipHistory) {
            const urlPath = targetRoute === 'home' ? '/' : '/' + targetRoute;
            try {
                history.pushState({route: targetRoute}, '', urlPath);
            } catch(e) {
                // Silently ignore file:// execution errors
            }
        }

        const incomingSection = document.getElementById(targetRoute);
        if(!incomingSection) return;

        const outgoingSection = document.getElementById(currentRoute);

        // Centralized heavy-duty scroll reset to beat mobile rendering lag
        const forceScrollToTop = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            requestAnimationFrame(() => window.scrollTo(0, 0));
            setTimeout(() => window.scrollTo(0, 0), 10);
            setTimeout(() => window.scrollTo(0, 0), 50);
        };

        if (instant) {
            if (outgoingSection) outgoingSection.classList.remove('active');
            incomingSection.classList.add('active');
            forceScrollToTop();
            currentRoute = targetRoute;
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

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                /* Einmal animiert = fertig. Kein Re-Reveal beim Hochscrollen,
                   keine zurück-Animation. */
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to specific scroll-reveal components globally
    const animatedSections = document.querySelectorAll('.home-entry-section, .home-camp-section, .scroll-anim');
    animatedSections.forEach(sec => scrollObserver.observe(sec));

    // Alumni Pager (Songcamp „Was Artists sagen") — horizontaler Slider mit Pixel-basierter Translation
    const alumniTrack = document.querySelector('.sc-alumni-pager-track');
    const alumniDots = document.querySelectorAll('.sc-alumni-dot');
    const alumniPages = document.querySelectorAll('.sc-alumni-page');
    if (alumniTrack && alumniDots.length) {
        let alumniCurrentPage = 0;

        const getAlumniPageShift = () => {
            const container = alumniTrack.parentElement;
            const gap = parseFloat(getComputedStyle(alumniTrack).gap) || 0;
            return container.offsetWidth + gap;
        };

        const goToAlumniPage = (target) => {
            alumniCurrentPage = target;
            alumniTrack.style.transform = `translateX(-${target * getAlumniPageShift()}px)`;
            alumniDots.forEach((d, idx) => {
                d.classList.toggle('is-active', idx === target);
            });
            alumniPages.forEach((page, idx) => {
                page.classList.toggle('is-active', idx === target);
            });
        };

        alumniDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const target = parseInt(dot.getAttribute('data-page'), 10);
                goToAlumniPage(target);
            });
        });

        // Reposition on window resize so the track stays aligned to the current page
        let alumniResizeRaf;
        window.addEventListener('resize', () => {
            cancelAnimationFrame(alumniResizeRaf);
            alumniResizeRaf = requestAnimationFrame(() => {
                const prevTransition = alumniTrack.style.transition;
                alumniTrack.style.transition = 'none';
                alumniTrack.style.transform = `translateX(-${alumniCurrentPage * getAlumniPageShift()}px)`;
                // force reflow then restore transition
                void alumniTrack.offsetWidth;
                alumniTrack.style.transition = prevTransition;
            });
        });
    }

    // Alumni „Mehr Stimmen"-Button (Mobile) — progressives Reveal, +3 Cards pro Klick
    const alumniPager = document.querySelector('.sc-alumni-pager');
    const alumniMore = document.querySelector('.sc-alumni-more');
    if (alumniPager && alumniMore) {
        let revealStep = 0;
        const maxStep = document.querySelectorAll('.sc-alumni-pager-track > .sc-alumni-page').length - 1;
        alumniMore.addEventListener('click', () => {
            revealStep = Math.min(revealStep + 1, maxStep);
            alumniPager.setAttribute('data-reveal', String(revealStep));
            if (revealStep >= maxStep) alumniMore.hidden = true;
        });
    }

    // Songcamp-Teaser (Home): subtiler Mousefollow im Hintergrundbild.
    // translate-Property greift parallel zum bestehenden scale-Zoom — beide
    // werden vom Browser kombiniert. Max ±12px Offset, 1.2s transition macht
    // das Lag cinematic.
    const teaser = document.querySelector('.home-camp-section.teaser');
    const teaserBg = teaser?.querySelector('.teaser-bg');
    if (teaser && teaserBg && matchMedia('(hover: hover)').matches) {
        let pending = null;
        teaser.addEventListener('mousemove', (e) => {
            const rect = teaser.getBoundingClientRect();
            const xRatio = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 … 0.5
            const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
            if (pending) return;
            pending = requestAnimationFrame(() => {
                teaserBg.style.translate = `${xRatio * 24}px ${yRatio * 24}px`;
                pending = null;
            });
        });
        teaser.addEventListener('mouseleave', () => {
            teaserBg.style.translate = '0 0';
        });
    }

    // Songcamp-Warteliste — Submit → /api/waitlist (Vercel Function) → Resend Mail.
    document.querySelectorAll('.sc-waitlist-form').forEach(form => {
        const submit = form.querySelector('.sc-waitlist-submit');
        const feedback = form.querySelector('.sc-waitlist-feedback');
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const originalLabel = submit.textContent;

        const showFeedback = (msg, isError = false) => {
            feedback.textContent = msg;
            feedback.classList.toggle('is-error', isError);
            feedback.classList.add('is-visible');
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            feedback.classList.remove('is-visible', 'is-error');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            if (!name || !email) {
                showFeedback('Bitte Name und E-Mail eintragen.', true);
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showFeedback('E-Mail-Adresse sieht nicht richtig aus.', true);
                return;
            }

            submit.disabled = true;
            submit.textContent = 'Wird gesendet…';

            try {
                const res = await fetch('/api/waitlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, camp: form.dataset.camp }),
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || 'Etwas ging schief.');

                form.reset();
                submit.textContent = 'Eingetragen ✓';
                showFeedback('Danke — wir melden uns, sobald es losgeht.');
            } catch (err) {
                submit.disabled = false;
                submit.textContent = originalLabel;
                showFeedback(err.message || 'Versuch es gleich nochmal.', true);
            }
        });
    });

    // Releases — Lite-YouTube-Embed: Facade-Thumbnail wird bei Klick durch
    // echten iframe ersetzt. Scharfe Previews, schneller Page-Load, keine
    // YouTube-Cookies bis zur Interaktion.
    document.querySelectorAll('.video-wrapper[data-yt-id]').forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const id = wrapper.dataset.ytId;
            if (!id) return;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
            iframe.title = 'YouTube Release';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.allowFullscreen = true;
            wrapper.innerHTML = '';
            wrapper.appendChild(iframe);
        });
    });

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
