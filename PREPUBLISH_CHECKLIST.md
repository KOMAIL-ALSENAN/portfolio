# Portfolio Pre-Publish Checklist

This checklist protects the published portfolio from factual, confidentiality, accessibility, and release mistakes.

## Human confirmation required

- [ ] Confirm permission to publicly publish client/project names, logos, drawings, models, screenshots, and images shown for professional projects.
- [ ] Confirm Qiddiya publication scope and ownership wording.
- [ ] Confirm NEOM publication scope and ownership wording.
- [ ] Confirm NUPCO publication scope and ownership wording.
- [ ] Confirm ZAIN INDUSTRIES publication scope and ownership wording.
- [ ] Confirm Red Sea Turtle Bay Village publication scope and ownership wording.
- [ ] Confirm any other employer/client material is permitted for public portfolio use.
- [ ] Confirm role titles, employer names, and employment dates match the current CV/source record.
- [ ] Confirm certificate names and issuers match the certificate evidence.
- [ ] Confirm no project statement implies sole ownership when the work was collaborative.
- [ ] Manually approve the final desktop, tablet, mobile, English, and Arabic screenshots.

## Automated gates required before merge

- [ ] GitHub repository test jobs pass.
- [ ] Verify jobs pass.
- [ ] Release gates pass.
- [ ] Browser Visual QA passes all scenarios with 0 failures.
- [ ] Automated WCAG-oriented Axe audit passes.
- [ ] RTL/LTR switching passes.
- [ ] Skip navigation passes.
- [ ] 200% text scaling passes.
- [ ] Reduced-motion behavior passes.
- [ ] Internal links pass.
- [ ] SEO/semantic metadata checks pass.
- [ ] Lighthouse pre-publish audit passes configured thresholds.

## Release safety

- [ ] PR remains Draft until all human confirmation items above are resolved.
- [ ] `main` remains unchanged until final approval.
- [ ] `backup/published-20260920-pre-redesign` remains available as the rollback reference.
- [ ] Final merge occurs only after screenshot approval and publish-permission confirmation.
