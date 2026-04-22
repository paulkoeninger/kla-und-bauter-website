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
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            menuOverlay.classList.remove('open');
            menuOverlay.style.opacity = 0;
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            // Clean up any stray GSAP transforms from the hover effect
            gsap.set(bars, { clearProps: "x" });
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    // -----------------------------------------
    // 3. SPA Routing & Slide Transitions
    // -----------------------------------------
    const slideSelectors = '.hero-title, .hero-subtitle, .image-wrapper, .section-title, .video-wrapper, .snap-block-inner';
    
    // Hash-anchor clicks (z. B. Produktion Quick-Nav → #arrangement):
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
    const validRoutes = ['home', 'produktion', 'session', 'lab', 'songcamp', 'team', 'releases', 'kontakt', 'impressum', 'datenschutz'];
    
    if (initialPath && validRoutes.includes(initialPath)) {
        setTimeout(() => navigateTo(initialPath, true, true), 50);
    } else {
        try {
            history.replaceState({route: 'home'}, '', '/');
        } catch(e) {
            // Fails on local file:// execution, silently ignore
        }
    }

    // Route-spezifische SEO-Metadaten. Werden bei jedem Route-Wechsel in den
    // <head> geschrieben, damit Google/Social-Shares pro Pfad einen eigenen
    // Titel + Description sehen (sonst wäre bei SPA alles identisch).
    const routeMeta = {
        home: {
            title: 'Kla & Bauter — Songcamp, Sessions & Musikproduktion',
            description: 'Songcamps, Songwriting-Sessions und Musikproduktion. Fünf Tage für die Musik, die längst in dir steckt — mit Paul und Adrian aus Köln.'
        },
        songcamp: {
            title: 'Songcamp — Fünf Tage, ein Haus, deine Musik | Kla & Bauter',
            description: 'Songwriting-Retreat in Deutschland: Sieben Tage, vier garantierte Sessions, ein Haus. Für Artists, die eigene Songs schreiben — nicht lernen.'
        },
        produktion: {
            title: 'Musikproduktion — Dein Song, wie du ihn meinst | Kla & Bauter',
            description: 'Vollproduktion für Artists: Arrangement, Klangwelt, Recording, Mix & Mastering. Wir produzieren nicht für dich, sondern mit dir.'
        },
        session: {
            title: 'Session — Eine Idee, ein Song | Kla & Bauter',
            description: 'Komm mit einer Idee. In ein paar Stunden steht dein Song. Kein Kurs, kein Workshop — nur der Song.'
        },
        lab: {
            title: 'Lab — Dranbleiben. 90 Minuten für deine Musik | Kla & Bauter',
            description: '90 Minuten, im Studio oder remote. Konzentrierte Zeit zu zweit an dem, woran du gerade arbeitest. Kein Unterricht, kein Curriculum — einfach dranbleiben.'
        },
        team: {
            title: 'Das Team — Adrian & Paul | Kla & Bauter',
            description: 'Zwei Musiker, die gelernt haben zuzuhören. Jazz-Hintergrund, Köln, seit 2019 gemeinsam als Kla & Bauter Musikproduktion.'
        },
        releases: {
            title: 'Releases — Was aus den Songs geworden ist | Kla & Bauter',
            description: 'Eine Auswahl der Tracks, an denen wir mitgeschrieben oder produziert haben. Jeder steht für eine Woche, ein Gegenüber, einen Moment.'
        },
        kontakt: {
            title: 'Kontakt — Kla & Bauter Musikproduktion',
            description: 'Schick uns deine Idee — ein Satz zu dir, ein Satz zu dem, was du machst. Wir melden uns persönlich.'
        },
        impressum: {
            title: 'Impressum — Kla & Bauter',
            description: 'Rechtliche Angaben gemäß § 5 DDG.'
        },
        datenschutz: {
            title: 'Datenschutzerklärung — Kla & Bauter',
            description: 'Datenschutzerklärung nach DSGVO. Wie wir mit deinen Daten umgehen.'
        }
    };

    function updateSEOMeta(route) {
        const meta = routeMeta[route] || routeMeta.home;
        const base = 'https://www.klaundbauter-musikproduktion.com';
        const path = route === 'home' ? '/' : '/' + route;

        document.title = meta.title;
        const setMeta = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) el.setAttribute('content', value);
        };
        setMeta('meta[name="description"]', meta.description);
        setMeta('meta[property="og:title"]', meta.title);
        setMeta('meta[property="og:description"]', meta.description);
        setMeta('meta[property="og:url"]', base + path);
        setMeta('meta[name="twitter:title"]', meta.title);
        setMeta('meta[name="twitter:description"]', meta.description);

        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', base + path);
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

        updateSEOMeta(targetRoute);

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

    // -----------------------------------------------------------------
    // Subtile Motion-Layer (2026-04):
    //   A) Section-Enter Stagger — Kicker → Headline → Lead
    //   B) Magnetic Primary Buttons (nur hover:hover + !reduced-motion)
    // Einmal-Erlebnis (unobserve nach Trigger) und respektiert
    // prefers-reduced-motion.
    // -----------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // (Cinematic Image Reveal wurde entfernt — siehe CSS-Kommentar.)

        // A) Section-Enter Stagger
        // Jeder snap-block / sc-block bekommt beim Entry den `.is-revealed`
        // Modifier — CSS staffelt die Kinder (kicker/title/lead) per transition-delay.
        const stagesObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

        document.querySelectorAll('.snap-block, .sc-block').forEach(block => {
            stagesObserver.observe(block);
        });

        // B) Magnetic Primary Buttons — nur auf echten Hover-Geräten (Desktop).
        // Ansatz: kontinuierliche rAF-Loop. Jeder Frame lerpt die aktuelle
        // Button-Position sanft Richtung Ziel (cursor-nah → Pull, sonst → 0).
        // Niedriger LERP-Faktor = weicher, träger, natürlicher Nachlauf.
        // Keine CSS-Transition — sie würde mit ständig neuen Zielen kollidieren
        // und den „hinterherziehen"-Effekt erzeugen.
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (canHover) {
            const PROXIMITY = 110;   // Radius, ab dem der Pull einsetzt (px)
            const MAX_PULL = 4;      // Maximale Verschiebung bei direktem Overlap (px)
            const LERP = 0.10;       // 0..1 — niedriger = trägere, sanftere Bewegung
            const EPSILON = 0.02;    // Unter diesem Wert als 0 behandeln (spart CPU)

            const state = new Map(); // Element → { x, y, tx, ty }
            let magneticBtns = [];
            let mouseX = -9999;
            let mouseY = -9999;
            let rafRunning = false;

            const refreshMagnetic = () => {
                magneticBtns = Array.from(document.querySelectorAll('.kb-btn-primary'));
                magneticBtns.forEach(btn => {
                    if (!state.has(btn)) state.set(btn, { x: 0, y: 0, tx: 0, ty: 0 });
                });
            };
            refreshMagnetic();
            window.__kbRefreshMagnetic = refreshMagnetic;

            const computeTargets = () => {
                const vh = window.innerHeight;
                magneticBtns.forEach(btn => {
                    const s = state.get(btn);
                    if (!s) return;
                    // Hidden (display:none inactive sections) → Ziel 0
                    if (btn.offsetParent === null) {
                        s.tx = 0;
                        s.ty = 0;
                        return;
                    }
                    const rect = btn.getBoundingClientRect();
                    if (rect.bottom < -100 || rect.top > vh + 100) {
                        s.tx = 0;
                        s.ty = 0;
                        return;
                    }
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = mouseX - cx;
                    const dy = mouseY - cy;
                    const dist = Math.hypot(dx, dy);
                    if (dist > PROXIMITY) {
                        s.tx = 0;
                        s.ty = 0;
                        return;
                    }
                    // Weiches Ramp-up: smoothstep statt linear
                    const n = 1 - dist / PROXIMITY;
                    const eased = n * n * (3 - 2 * n); // smoothstep
                    const pull = eased * MAX_PULL;
                    s.tx = dist > 0 ? (dx / dist) * pull : 0;
                    s.ty = dist > 0 ? (dy / dist) * pull : 0;
                });
            };

            const tick = () => {
                computeTargets();
                let anyActive = false;
                state.forEach((s, btn) => {
                    // Lerp current → target
                    s.x += (s.tx - s.x) * LERP;
                    s.y += (s.ty - s.y) * LERP;
                    // Snap to zero when close enough (spart unnötige sub-pixel writes)
                    if (Math.abs(s.x) < EPSILON && Math.abs(s.tx) < EPSILON) s.x = 0;
                    if (Math.abs(s.y) < EPSILON && Math.abs(s.ty) < EPSILON) s.y = 0;
                    btn.style.translate = `${s.x.toFixed(2)}px ${s.y.toFixed(2)}px`;
                    if (s.x !== 0 || s.y !== 0 || s.tx !== 0 || s.ty !== 0) anyActive = true;
                });
                if (anyActive) {
                    requestAnimationFrame(tick);
                } else {
                    rafRunning = false;
                }
            };

            const startTicking = () => {
                if (rafRunning) return;
                rafRunning = true;
                requestAnimationFrame(tick);
            };

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                startTicking();
            }, { passive: true });
        }
    }

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

    // Songcamp-Anfragen — Submit → /api/camp-anfragen (Vercel Function) → Resend Mail.
    document.querySelectorAll('.sc-anfrage-form').forEach(form => {
        const submit = form.querySelector('.sc-anfrage-submit');
        const feedback = form.querySelector('.sc-anfrage-feedback');
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
                const res = await fetch('/api/camp-anfragen', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, camp: form.dataset.camp }),
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || 'Etwas ging schief.');

                form.reset();
                submit.textContent = 'Anfrage gesendet ✓';
                showFeedback('Danke, wir melden uns so bald wie möglich.');
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
    } else if (promiseSection && sharpTextNode) {
        // Mobile / Touch: Auto-Reveal wort-für-wort, sobald die Section
        // ~50 % im Viewport ist. Einmal-Erlebnis (unobserve nach Trigger),
        // passt zur „Musik ist ein Prozess — man schaut dabei zu"-Metapher.
        const mobilePromiseObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                obs.unobserve(entry.target);

                const words = sharpTextNode.querySelectorAll('.reveal-word');
                const STAGGER = 80; // ms pro Wort — ~3.2 s für 40 Wörter

                // Kleiner Delay nach Entry, damit der Reveal bewusst startet
                setTimeout(() => {
                    words.forEach((word, i) => {
                        setTimeout(() => word.classList.add('revealed'), i * STAGGER);
                    });
                    // Closing-Line kommt nach dem letzten Wort
                    setTimeout(() => {
                        if (closingLine) closingLine.classList.add('revealed');
                    }, words.length * STAGGER + 400);
                    // Blurred-Text-Layer ausfaden sobald alle Wörter sichtbar sind
                    setTimeout(() => {
                        if (blurredText) blurredText.classList.add('faded');
                    }, words.length * STAGGER + 200);
                }, 250);
            });
        }, { threshold: 0.5 });

        mobilePromiseObserver.observe(promiseSection);
    }
});
