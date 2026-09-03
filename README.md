# Komail Jaffar Al Senan — Portfolio

Professional bilingual portfolio website for **Komail Jaffar Al Senan**, presented as an **Architecture BIM Modeler** with a supporting focus on **BIM coordination, Revit automation, multidisciplinary delivery, and digital AEC workflows**.

## Live Portfolio

The website is deployed with GitHub Pages from the repository's `main` branch and root directory. HTTPS is enforced.

## Main Portfolio Sections

- About / professional profile
- Experience Summary
- Core Competencies
- Featured Projects
- All Projects with category filters
- Featured Certificates
- All Certificates with issuing-organization filters
- Skills & Software
- Contact and CV
- English / Arabic language support

## Professional Focus

- Architecture BIM Modeling
- Autodesk Revit
- BIM Coordination
- Navisworks Manage
- Clash Detection
- Dynamo Automation
- Revit API / C# Workflows
- Model QA / QC
- 4D Coordination
- ISO 19650 Information Management

## Featured Projects

The home page currently highlights six selected projects:

- Qiddiya Project
- Red Sea Turtle Bay Village
- NEOM
- ZAIN INDUSTRIES
- Nesma Car Parking Building
- NUPCO

Additional projects remain available through the **All Projects** page.

## Project Pages

- `index.html` — Main portfolio and featured content
- `projects.html` — All projects with interactive filtering
- `project.html` — Shared project gallery page used by Qiddiya, Red Sea, Nesma, Villas, Health Gym and other project entries
- `neom.html` — NEOM project overview and building galleries
- `neom-professional-village.html` — NEOM Professional Village multi-building gallery
- `nupco.html` — NUPCO multi-building overview; Building 01 links to the published Warehouse gallery while Buildings 02–04 remain unpublished placeholders
- `nupco-warehouse.html` — Bilingual NUPCO Warehouse gallery, organized by Revit sheet groups from AR-0000 through AR-1700 and loaded from a static local manifest
- `zain-industries.html` — ZAIN INDUSTRIES Warehouse and HCL Tank Farm galleries
- `certificates.html` — Full certificate library with organization filters and Featured certificates

## Shared Front-End Structure

- `assets/css/main.css` — Shared portfolio identity, navigation, accessibility, About enhancements, and responsive behavior
- `assets/css/project-gallery.css` — Shared project gallery and lightbox presentation
- `assets/js/main.js` — Shared identity normalization, SEO support, accessibility helpers, media optimization, and About content
- `assets/js/project-gallery.js` — Shared image viewer, previous/next navigation, counter, keyboard controls, focus handling, and bilingual UI helper
- `assets/favicon.svg` — KA browser tab icon
- `assets/social-card-v1.jpg` — Open Graph / social sharing preview image
- `assets/documents/Komail Jaffar Al Senan-Architectural BIM Modeler.pdf` — Portfolio CV

## NUPCO Image Pipeline

NUPCO Warehouse source sheets are processed by `scripts/optimize_nupco.py` and `.github/workflows/optimize-nupco.yml`.

The optimizer:

- Converts the Warehouse drawing images to web-optimized WebP assets with a maximum dimension of 1600 px
- Organizes generated images into Revit sheet groups such as `AR-0000`, `AR-0100`, and `AR-0300`
- Generates `assets/projects/nupco/building-01-web/manifest.json`
- Removes the original heavy Warehouse image copies from the current `main` tree after successful conversion
- Preserves recoverability through repository history and the dedicated backup branches

The current manifest contains **255 optimized drawings**, all **255 matched** to known Revit groups with **0 uncategorized files**. It also flags **3 expected sheet numbers** that were not present in the uploaded source set.

The public Warehouse page reads the local manifest; it does **not** query the GitHub API in visitors' browsers.

## Asset Structure

```text
assets/
├── certificates/
├── css/
│   ├── main.css
│   └── project-gallery.css
├── documents/
│   └── Komail Jaffar Al Senan-Architectural BIM Modeler.pdf
├── js/
│   ├── main.js
│   └── project-gallery.js
├── projects/
│   ├── health-gym/
│   ├── neom/
│   ├── nesma-car-parking-building/
│   ├── nupco/
│   │   ├── building-01/
│   │   └── building-01-web/
│   ├── qiddiya/
│   ├── red-sea-turtle-bay-village/
│   └── zain-industries/
├── favicon.svg
└── social-card-v1.jpg
```

## Responsive & Accessibility Features

- Responsive layouts for desktop, tablet, and mobile
- Touch-friendly controls
- Keyboard focus states
- Skip-to-content support where applicable
- Accessible navigation labels
- Responsive galleries and lightboxes
- Previous / next image navigation and image counters in the shared gallery viewer
- Escape and arrow-key lightbox controls
- Lazy image loading and asynchronous decoding where appropriate
- External-link security using `noopener` and `noreferrer`
- English / Arabic direction switching on updated project galleries

## SEO & Sharing

Primary pages include:

- Meta descriptions
- Canonical URLs
- Open Graph metadata
- Twitter summary cards
- Shared `assets/social-card-v1.jpg` social image
- Favicon and theme color

## GitHub Pages

GitHub Pages is configured to publish from:

- Branch: `main`
- Path: `/`
- HTTPS: enforced

The NUPCO optimization workflow is an asset-processing workflow; it is not the GitHub Pages deployment mechanism.

## Repository Safety

Branch cleanup is complete:

- `backup/pre-code-cleanup-2026-08-11` retains the earlier portfolio state.
- `backup/legacy-agent-fix-portfolio-2026-08-16` preserves the three unique historical fixes from the former `agent/fix-portfolio` branch.
- Temporary `agent/*` branches and incomplete Nesma staging branches have been removed.

The heavy historical image blobs are intentionally still recoverable through Git history and backup references; the published `main` tree now uses the optimized NUPCO web assets instead.

## العربية

هذا المستودع يحتوي على موقع البورتفوليو الشخصي لـ **كميل جعفر آل سنان** بصفته **Architecture BIM Modeler** مع تركيز إضافي على تنسيق BIM وأتمتة Revit وسير العمل الرقمي في مشاريع AEC.

الموقع يدعم العربية والإنجليزية، ويحتوي على صفحات المشاريع والشهادات والمهارات والسيرة الذاتية. معرض مستودع NUPCO منظم حسب مجموعات لوحات Revit ويعتمد على صور WebP محسنة وملف Manifest محلي ثابت بدل طلب GitHub API أثناء تصفح الموقع.

---

**Komail Jaffar Al Senan**  
Architecture BIM Modeler  
BIM Specialist · Revit Automation
