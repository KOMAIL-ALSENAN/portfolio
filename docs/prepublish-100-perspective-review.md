# Pre-Publish 100-Perspective Expert Review

> This is a structured simulated expert-panel review: 20 professional disciplines × 5 reviewer perspectives = 100 review lenses. It is not a claim that 100 external people were individually contacted.

## Panel composition

1. Architecture portfolio reviewers — 5
2. BIM managers — 5
3. BIM coordinators — 5
4. Revit specialists — 5
5. AEC digital-delivery leads — 5
6. Engineering recruiters — 5
7. Technical recruiters — 5
8. Hiring managers — 5
9. UX designers — 5
10. UI / visual designers — 5
11. Brand strategists — 5
12. Front-end engineers — 5
13. Accessibility specialists — 5
14. Arabic / RTL UX reviewers — 5
15. Mobile UX reviewers — 5
16. Web-performance reviewers — 5
17. SEO / discoverability reviewers — 5
18. Content / case-study editors — 5
19. Privacy / confidentiality reviewers — 5
20. Portfolio conversion / CTA reviewers — 5

## Consensus strengths

### 1. Stronger professional identity
The cinematic navy system, architectural imagery, and Blueprint → Reality motion create a distinctive BIM / architecture identity without turning the site into a generic technology portfolio.

### 2. Better recruiter scan path
The homepage moves from selected work into professional experience, capabilities, tools / workflow, products, credentials, profile, and contact. That supports a fast recruiter scan while still allowing deeper exploration.

### 3. Real work is now the visual evidence
Using real project imagery instead of logo-only cards materially improves credibility and immediately communicates the type of work in the portfolio.

### 4. BIM specialization is visible
Revit, coordination, documentation, automation, Navisworks, Dynamo, Revit API and technical delivery are visible throughout the experience rather than being buried in a skills list.

### 5. Motion supports the narrative
The blueprint reveal, restrained scroll reveal, project image interaction, and progress indicator reinforce the architectural / BIM story instead of acting as decorative animation.

### 6. Bilingual capability is a differentiator
English / Arabic switching and RTL support are valuable for the Saudi / GCC context and demonstrate attention to communication quality.

### 7. Technical quality gates are unusually strong for a personal portfolio
The redesign has automated browser testing, responsive checks, RTL / LTR checks, console-error detection, broken-image checks, reduced-motion checks, 200% text-scaling checks, and automated WCAG audits.

## Consensus weaknesses / risks

### P0 — Publication rights and confidentiality
Professional project drawings, screenshots, model views, logos, and project names must be cleared for public portfolio use. This is the only item the codebase cannot prove automatically.

**Release condition:** confirm that every published professional image / drawing is approved for public display and contains no confidential client, contractor, internal-model, revision, personal, security, or commercial information.

### P1 — Case-study evidence depth is uneven
The strongest case studies now identify role, scope, software / workflow and deliverables. However, some projects still have stronger visual evidence than narrative evidence.

**Recommendation:** progressively add verified project facts where available: project phase, package type, discipline interface, authored deliverables, coordination responsibilities, and verified outcome. Do not invent metrics.

### P1 — Attribution should remain precise
The portfolio must clearly describe the user's contribution without implying sole authorship of large multidisciplinary projects.

**Current mitigation:** recruiter-facing copy has been tightened toward role / scope / contribution language rather than ownership language.

### P1 — CMS / rendered-site content drift
The Sveltia CMS edits `content/portfolio.json`, while the current rendered homepage / project archive primarily use static HTML / JavaScript data. That means a future CMS edit can be stored successfully without automatically changing every public-facing section.

**Recommendation:** treat CMS integration as a content-governance task: either wire the rendered project / product / certificate components to the JSON source with static fallbacks, or make the CMS clearly editorial-only. Do not assume a saved CMS edit is live until this is resolved.

### P1 — Content density on deep technical galleries
Large drawing galleries are useful to BIM reviewers but can feel heavy to general recruiters.

**Recommendation:** keep the homepage concise; let technical galleries remain optional deep dives. Prefer 3–6 strongest evidence images before the full drawing archive when future project curation is performed.

### P1 — Accessibility localization must be maintained
Visible Arabic content was strong, but hidden accessibility labels and gallery controls also need localization.

**Current mitigation:** bilingual labels are being normalized for language toggle, navigation, skip link, gallery controls, and project image actions.

### P2 — The homepage can become long
Experience, capabilities, tools, products, certificates, about and contact together create a substantial page.

**Recommendation:** maintain strong section spacing and use the homepage only for selected evidence. Avoid adding additional large sections unless one replaces an existing section.

### P2 — Products can distract from the BIM portfolio if over-emphasized
Software products are a differentiator, but recruiters for architecture / BIM roles should still see project delivery first.

**Current mitigation:** products remain after project work / experience / capabilities and link to the separate developer portfolio.

### P2 — Visual polish depends heavily on image quality
The dark premium interface makes low-resolution or inconsistent project imagery more visible.

**Recommendation:** use curated, high-resolution covers while keeping heavy full-resolution images inside galleries.

### P2 — SEO social image must be purpose-built
A project screenshot is weaker than a dedicated social-preview card.

**Current mitigation:** social metadata now uses the dedicated social-card asset.

## Release gates

### Automated gates
- Desktop, tablet and mobile browser validation
- English / Arabic and RTL / LTR
- WCAG automated audit
- Keyboard skip navigation
- 200% text scale
- Reduced motion
- Broken loaded images
- JavaScript console / page errors
- Internal-link / semantic / SEO checks
- Existing repository release gates

### Human gates
- Final visual acceptance by portfolio owner
- Public-display / confidentiality clearance for professional project material
- Final factual check of role titles, dates, project contributions and credentials

## Publish recommendation

**Technical readiness:** publishable after all current checks pass on the final HEAD.

**Professional readiness:** strong, provided the publication-rights / confidentiality review is explicitly cleared.

**Do not merge the draft PR solely because automated checks pass.** Keep the PR in Draft until both human gates above are confirmed.


## Manual visual QA checklist

This checklist complements the automated browser gates. It is reviewed against rendered Chromium screenshots before publication.

- [ ] Hero communicates BIM / architecture clearly without looking like a generic tech landing page.
- [ ] Cinematic navy palette remains legible in Arabic and English.
- [ ] Primary CTA is obvious; secondary actions do not compete with it.
- [ ] Homepage sections appear continuously with no large blank gaps caused by motion / lazy-loading.
- [ ] Selected project cards remain readable at desktop, tablet and mobile widths.
- [ ] Watermark protection stays inside project image areas and never overlaps project text.
- [ ] Arabic headings do not create awkward single-word or orphaned line breaks where avoidable.
- [ ] Experience timeline remains scannable and does not dominate selected project evidence.
- [ ] Capabilities / tools / products remain visually distinct without repeating the same message.
- [ ] Certificate imagery loads after viewport approach and does not create empty card states.
- [ ] Deep technical project pages remain optional detail, not a barrier to recruiter scanning.
- [ ] Contact block remains a clear final conversion point.
- [ ] Mobile navigation, language switching and project galleries feel intentional, not compressed desktop UI.
- [ ] No visual regression appears after 200% text scale or reduced-motion preference.
- [ ] Final screenshots are reviewed after all automated gates pass on the same final HEAD.
