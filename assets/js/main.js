/* ════════════════════════════════════════════════════════════
   FINATEO — Shared site script
   Injects the navigation + footer on every page (single source
   of truth) and wires up scroll/menu behaviour.
   To change the menu or footer, edit ONLY this file.
   ════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var page = document.body.getAttribute('data-page') || '';

    function active(name) { return page === name ? ' class="active"' : ''; }

    /* ── NAVIGATION ── */
    var navHTML =
        '<a href="/" class="logo">Finateo<span class="logo-dot">.</span></a>' +
        '<button class="menu-toggle" aria-label="Menu" aria-expanded="false">' +
        '<span></span><span></span><span></span></button>' +
        '<div class="nav-links">' +

        '<div class="nav-dropdown">' +
        '<a href="/services"' + (page.indexOf('service') === 0 || page === 'lectures' ? ' class="active"' : '') + '>Services <span class="nav-caret">&#9662;</span></a>' +
        '<div class="dropdown-menu">' +
        '<a href="/services">All Services</a>' +
        '<div class="dropdown-divider"></div>' +
        '<span class="dropdown-group-label">Advisory &amp; Delivery</span>' +
        '<a href="/finance-transformation">Finance Transformation Design</a>' +
        '<a href="/post-merger-integration">M&amp;A Finance</a>' +
        '<a href="/entity-governance">Entity Governance &amp; Structuring</a>' +
        '<a href="/shared-services">Shared Services Center</a>' +
        '<div class="dropdown-divider"></div>' +
        '<span class="dropdown-group-label">Lectures &amp; Training</span>' +
        '<a href="/lectures">Executive Lectures &amp; Briefings</a>' +
        '</div></div>' +

        '<a href="/north-macedonia"' + active('north-macedonia') + '>North Macedonia</a>' +

        '<div class="nav-dropdown">' +
        '<a href="/insights"' + (page.indexOf('insight') === 0 ? ' class="active"' : '') + '>Insights <span class="nav-caret">&#9662;</span></a>' +
        '<div class="dropdown-menu">' +
        '<a href="/insights">All Insights</a>' +
        '<div class="dropdown-divider"></div>' +
        '<a href="/insights#articles">Articles</a>' +
        '<a href="/insights#cases">Case Studies</a>' +
        '</div></div>' +

        '<a href="/about"' + active('about') + '>About</a>' +
        '<a href="/portal" class="nav-portal' + (page === 'portal' ? ' active' : '') + '">Client Portal</a>' +
        '<a href="/contact" class="nav-cta">Get in Touch</a>' +
        '</div>';

    var nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.id = 'mainNav';
    nav.innerHTML = navHTML;
    document.body.insertBefore(nav, document.body.firstChild);

    /* ── FOOTER ── */
    var year = new Date().getFullYear();
    var footerHTML =
        '<div class="footer-grid">' +
        '<div class="footer-brand">' +
        '<a href="/" class="logo">Finateo<span class="logo-dot">.</span></a>' +
        '<p>Deal &amp; growth finance advisory for companies navigating deals, growth and change. We design the finance function — and we can run it, through our shared services center in Tetovo and a broader professional network across several countries.</p>' +
        '</div>' +
        '<div class="footer-col"><h5>Services</h5>' +
        '<a href="/finance-transformation">Finance Transformation Design</a>' +
        '<a href="/post-merger-integration">M&amp;A Finance</a>' +
        '<a href="/entity-governance">Entity Governance</a>' +
        '<a href="/shared-services">Shared Services Center</a>' +
        '<a href="/lectures">Lectures &amp; Training</a>' +
        '</div>' +
        '<div class="footer-col"><h5>Company</h5>' +
        '<a href="/about">About Finateo</a>' +
        '<a href="/north-macedonia">Why North Macedonia</a>' +
        '<a href="/insights">Insights</a>' +
        '<a href="/contact">Contact</a>' +
        '</div>' +
        '<div class="footer-col"><h5>Clients</h5>' +
        '<a href="/portal">Client Portal</a>' +
        '<a href="mailto:hello@finateo.com">hello@finateo.com</a>' +
        '<a href="https://www.linkedin.com/company/finateo/" target="_blank" rel="noopener">LinkedIn</a>' +
        '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
        '<span>&copy; ' + year + ' Finateo. All rights reserved.</span>' +
        '<span>Copenhagen &middot; Tetovo</span>' +
        '</div>';

    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = footerHTML;
    document.body.appendChild(footer);

    /* ── BEHAVIOUR ── */

    // Nav shadow on scroll
    window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Mobile menu toggle + tap-to-expand accordions
    var toggle = nav.querySelector('.menu-toggle');
    var links = nav.querySelector('.nav-links');

    // Scrim that dims the page behind the mobile dropdown menu (tap it to close)
    var navScrim = document.createElement('div');
    navScrim.className = 'nav-scrim';
    document.body.appendChild(navScrim);

    // Publish the bar height so the dropdown + scrim sit exactly beneath the bar
    function setNavHeight() {
        // sub-pixel precise so the dropdown can sit truly flush under the bar
        document.documentElement.style.setProperty('--nav-h', nav.getBoundingClientRect().height + 'px');
    }
    setNavHeight();
    window.addEventListener('resize', setNavHeight);
    window.addEventListener('load', setNavHeight);

    function isMobileNav() { return window.matchMedia('(max-width: 900px)').matches; }

    function closeMenu() {
        links.classList.remove('open');
        navScrim.classList.remove('open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        nav.querySelectorAll('.nav-dropdown.expanded').forEach(function (drop) {
            drop.classList.remove('expanded');
            var pa = drop.querySelector('a');
            if (pa) { pa.setAttribute('aria-expanded', 'false'); }
        });
    }

    toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navScrim.classList.toggle('open', open);
        document.body.classList.toggle('nav-open', open);
        if (!open) { closeMenu(); }
    });

    // On mobile, tapping a dropdown parent expands its sub-items inline instead of navigating
    nav.querySelectorAll('.nav-dropdown').forEach(function (drop) {
        var parentLink = drop.querySelector('a');
        if (!parentLink) { return; }
        parentLink.setAttribute('aria-haspopup', 'true');
        parentLink.setAttribute('aria-expanded', 'false');
        parentLink.addEventListener('click', function (e) {
            if (isMobileNav()) {
                e.preventDefault();
                var expanded = drop.classList.toggle('expanded');
                parentLink.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            }
        });
    });

    // Close the menu on an outside click
    document.addEventListener('click', function (e) {
        if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Tapping a real navigation link closes the menu (accordion parents are excluded above)
    links.querySelectorAll('a').forEach(function (link) {
        if (link.parentElement && link.parentElement.classList.contains('nav-dropdown')) { return; }
        link.addEventListener('click', function () { closeMenu(); });
    });

    // Reveal-on-scroll
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

    // Insights / case-study feeds (no-op on pages without them; supports several per page)
    var feeds = document.querySelectorAll('.insights-feed');
    if (feeds.length) {
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var allCards = document.querySelectorAll('.feed-card');
        var updaters = [];

        // Give every collapsed card one shared height across all feeds; an expanded card grows freely.
        function equalizeAll() {
            var i, max = 0;
            for (i = 0; i < allCards.length; i++) { allCards[i].style.height = 'auto'; }
            for (i = 0; i < allCards.length; i++) {
                if (!allCards[i].classList.contains('feed-card--open')) { max = Math.max(max, allCards[i].offsetHeight); }
            }
            for (i = 0; i < allCards.length; i++) {
                if (!allCards[i].classList.contains('feed-card--open')) { allCards[i].style.height = max + 'px'; }
            }
        }

        function initFeed(feed) {
            var shell = feed.closest('.feed-shell');
            var prev = shell ? shell.querySelector('.feed-arrow[data-dir="prev"]') : null;
            var next = shell ? shell.querySelector('.feed-arrow[data-dir="next"]') : null;

            function step() {
                var card = feed.querySelector('.feed-card');
                if (!card) { return feed.clientWidth; }
                var s = getComputedStyle(feed);
                var gap = parseFloat(s.columnGap || s.gap) || 0;
                return card.getBoundingClientRect().width + gap;
            }
            function scrollFeed(dir) {
                feed.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
            }
            function updateArrows() {
                var maxScroll = feed.scrollWidth - feed.clientWidth - 2;
                if (prev) { prev.disabled = feed.scrollLeft <= 0; }
                if (next) { next.disabled = feed.scrollLeft >= maxScroll; }
            }
            if (prev) { prev.addEventListener('click', function () { scrollFeed(-1); }); }
            if (next) { next.addEventListener('click', function () { scrollFeed(1); }); }
            feed.addEventListener('scroll', updateArrows, { passive: true });
            feed.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowRight') { scrollFeed(1); e.preventDefault(); }
                else if (e.key === 'ArrowLeft') { scrollFeed(-1); e.preventDefault(); }
            });
            feed.querySelectorAll('.feed-expand').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var card = btn.closest('.feed-card');
                    var more = card ? card.querySelector('.feed-more') : null;
                    var open = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
                    if (more) { more.hidden = open; }
                    if (card) { card.classList.toggle('feed-card--open', !open); }
                    btn.textContent = open ? 'Read more →' : 'Show less →';
                    equalizeAll();
                    updateArrows();
                });
            });
            updaters.push(updateArrows);
        }

        feeds.forEach(initFeed);

        function refreshAll() {
            equalizeAll();
            updaters.forEach(function (u) { u(); });
        }
        window.addEventListener('resize', refreshAll);
        window.addEventListener('load', refreshAll);
        refreshAll();
    }
})();
