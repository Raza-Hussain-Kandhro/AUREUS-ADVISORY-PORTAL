# Competitor & Reference Research

Four real examples informed the design and architecture decisions in this build, spanning both
the "gated portal" side and the "public marketing site" side of the product.

## 1. Private Wealth Systems (platform UX by UXDA)

Private Wealth Systems is a US-based wealth-tech company built specifically for ultra-high-net-
worth individuals — its design agency, UXDA, published a detailed case study on the project
(theuxda.com). A few details are notable: the firm manages an average of roughly $233M in assets
per client, and the brief was explicitly to make a "premium-feel, easy-to-understand" multi-
asset-class portfolio and reporting tool rather than a conventional dashboard. That framing —
performance data has to be immediately legible *and* feel like a luxury product, not a spreadsheet
— is the same tension the supplied Design Spec is solving with the "Digital Wealth Vault" concept.

**What made it professional-grade:** restraint. The case study repeatedly emphasizes clarity over
density — showing less, not more, per screen. That directly informed keeping this build's
Overview page to three focal elements (net worth, allocation, performance) rather than cramming
every PRD data point onto one screen.

Source: https://theuxda.com/blog/ux-case-study-bugatti-caliber-experience-uhnwi-200-billion-assets

## 2. Pathstone

Pathstone is a real multi-family office managing well over $150B in aggregate client assets, with
a public site (pathstone.com) that segments visitors into "Individuals & Families," "Family
Offices," and "Institutions" before showing them anything specific — the public site's whole job
is qualifying and routing a visitor, not displaying portfolio data.

**What made it professional-grade, and what it changed in this build:** this is the direct source
for the decision to build a separate public marketing site (Home/About/Services/Contact) in front
of the authenticated portal, rather than making the dashboard the front door. The original PRD
described only the client portal; adding the public layer matches how real advisory firms
actually structure client acquisition — trust and qualification happen before login, not after.

Source: https://pathstone.com

## 3. Addepar

Addepar is the dominant portfolio-aggregation platform used by RIAs and family offices to report
performance to UHNW clients — it's the de facto industry benchmark for "what a serious wealth
reporting tool looks like" in this category, the way Stripe is a benchmark for payments UX.

**What it validated:** the emphasis on tabular numeral formatting, a dedicated performance-history
view, and treating asset allocation as a first-class, interactive visual (not a static pie chart)
are all patterns Addepar popularized in this category. The donut chart's tap-to-expand interaction
in this build follows that "make allocation data explorable, not just displayed" pattern.

## 4. Mass-market robo-advisors (Wealthfront / Betterment-class apps)

Used here as a *contrast* point rather than a direct model. These platforms are excellent
products, but they're built for a self-directed, high-volume audience — dense information,
frequent notifications, gamified progress indicators. HNW-focused UX research (including UXDA's
published perspective on 2026 wealth-management design trends) frames private wealth UX as the
opposite: fewer prompts, more restraint, privacy-first, "simplicity as sophistication" rather than
feature density. This is the direct justification for this build's motion language deliberately
avoiding bouncy/springy animation and gamification patterns (streaks, badges, notification
nudges) that would read as mass-market rather than boutique.

## What this changed in the final build

| Research finding | Change made |
|---|---|
| Real advisory firms front-load a public, qualifying marketing site | Added Home/About/Services/Contact + lead-capture form, not in the original PRD |
| UHNW platforms favor restraint over density | Kept Overview to 3 focal panels; moved Insights to its own page rather than cramming a carousel onto the dashboard |
| Allocation data should be explorable | Kept the donut's tap-to-expand interaction rather than a static chart |
| Boutique ≠ mass-market gamification | No streaks/badges/push-nudge patterns; motion stays deliberate per the Design Spec's "luxury watch" brief |
