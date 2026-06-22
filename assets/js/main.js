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
        '<a href="index.html" class="logo">Finateo<span class="logo-dot">.</span></a>' +
        '<button class="menu-toggle" aria-label="Menu" aria-expanded="false">' +
        '<span></span><span></span><span></span></button>' +
        '<div class="nav-links">' +

        '<div class="nav-dropdown">' +
        '<a href="services.html"' + (page.indexOf('service') === 0 || page === 'lectures' ? ' class="active"' : '') + '>Services &#9662;</a>' +
        '<div class="dropdown-menu">' +
        '<a href="services.html">All Services</a>' +
        '<div class="dropdown-divider"></div>' +
        '<span class="dropdown-group-label">Advisory &amp; Delivery</span>' +
        '<a href="finance-transformation.html">Finance Transformation Design</a>' +
        '<a href="post-merger-integration.html">Post-Merger Finance Integration</a>' +
        '<a href="entity-governance.html">Entity Governance &amp; Structuring</a>' +
        '<a href="shared-services.html">Shared Services Center</a>' +
        '<div class="dropdown-divider"></div>' +
        '<span class="dropdown-group-label">Lectures &amp; Training</span>' +
        '<a href="lectures.html">Executive Lectures &amp; Briefings</a>' +
        '</div></div>' +

        '<a href="north-macedonia.html"' + active('north-macedonia') + '>North Macedonia</a>' +

        '<div class="nav-dropdown">' +
        '<a href="insights.html"' + (page.indexOf('insight') === 0 ? ' class="active"' : '') + '>Insights &#9662;</a>' +
        '<div class="dropdown-menu">' +
        '<a href="insights.html">All Insights</a>' +
        '<div class="dropdown-divider"></div>' +
        '<a href="insights.html#articles">Articles</a>' +
        '<a href="insights.html#cases">Case Studies</a>' +
        '</div></div>' +

        '<a href="about.html"' + active('about') + '>About</a>' +
        '<a href="portal.html" class="nav-portal' + (page === 'portal' ? ' active' : '') + '">Client Portal</a>' +
        '<a href="contact.html" class="nav-cta">Get in Touch</a>' +
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
        '<a href="index.html" class="logo">Finateo<span class="logo-dot">.</span></a>' +
        '<p>Deal &amp; growth finance advisory for mid-market companies and the investors behind them. We design the finance function — and we can run it, through our shared services center in Tetovo and a broader professional network across several countries.</p>' +
        '</div>' +
        '<div class="footer-col"><h5>Services</h5>' +
        '<a href="finance-transformation.html">Finance Transformation Design</a>' +
        '<a href="post-merger-integration.html">Post-Merger Integration</a>' +
        '<a href="entity-governance.html">Entity Governance</a>' +
        '<a href="shared-services.html">Shared Services Center</a>' +
        '<a href="lectures.html">Lectures &amp; Training</a>' +
        '</div>' +
        '<div class="footer-col"><h5>Company</h5>' +
        '<a href="about.html">About Finateo</a>' +
        '<a href="north-macedonia.html">Why North Macedonia</a>' +
        '<a href="insights.html">Insights</a>' +
        '<a href="contact.html">Contact</a>' +
        '</div>' +
        '<div class="footer-col"><h5>Clients</h5>' +
        '<a href="portal.html">Client Portal</a>' +
        '<a href="mailto:hello@finateo.com">hello@finateo.com</a>' +
        '<a href="https://www.linkedin.com" target="_blank" rel="noopener">LinkedIn</a>' +
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

    // Mobile menu toggle
    var toggle = nav.querySelector('.menu-toggle');
    var links = nav.querySelector('.nav-links');
    toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close mobile menu on outside click or link click
    document.addEventListener('click', function (e) {
        if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) {
            links.classList.remove('open');
        }
    });
    links.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { links.classList.remove('open'); });
    });

    // Reveal-on-scroll
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

    // Insights + case-studies feed (no-op on pages without it)
    var feed = document.querySelector('.insights-feed');
    if (feed) {
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var feedPrev = document.querySelector('.feed-arrow[data-dir="prev"]');
        var feedNext = document.querySelector('.feed-arrow[data-dir="next"]');

        function feedStep() {
            var card = feed.querySelector('.feed-card');
            if (!card) { return feed.clientWidth; }
            var s = getComputedStyle(feed);
            var gap = parseFloat(s.columnGap || s.gap) || 0;
            return card.getBoundingClientRect().width + gap;
        }
        function scrollFeed(dir) {
            feed.scrollBy({ left: dir * feedStep(), behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        function updateArrows() {
            var maxScroll = feed.scrollWidth - feed.clientWidth - 2;
            if (feedPrev) { feedPrev.disabled = feed.scrollLeft <= 0; }
            if (feedNext) { feedNext.disabled = feed.scrollLeft >= maxScroll; }
        }
        if (feedPrev) { feedPrev.addEventListener('click', function () { scrollFeed(-1); }); }
        if (feedNext) { feedNext.addEventListener('click', function () { scrollFeed(1); }); }
        feed.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        feed.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { scrollFeed(1); e.preventDefault(); }
            else if (e.key === 'ArrowLeft') { scrollFeed(-1); e.preventDefault(); }
        });
        updateArrows();

        // Expand / collapse the inline case-study cards
        feed.querySelectorAll('.feed-expand').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var card = btn.closest('.feed-card');
                var more = card ? card.querySelector('.feed-more') : null;
                var open = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', open ? 'false' : 'true');
                if (more) { more.hidden = open; }
                btn.textContent = open ? 'Read more →' : 'Show less →';
                updateArrows();
            });
        });
    }
})();
