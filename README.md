# Nuroburst marketing website

Static HTML, CSS, and JavaScript at the repository root. No build step or dependencies.

## Design

A bright, grown-up brand system with bold navy typography, electric blue/violet/magenta accents, and an original flowing-light background. The story centers on gamified learning, Bursts, spaced repetition, and mastery Levels 1–10. The hero is labeled as an illustrative preview, not a product screenshot or measured performance data.

The original logo is preserved. `logo-fix.css` places it on a fully opaque white background on every page. Client reference graphics are not shipped. There are no customer-specific offers, names, images, or outcome statistics in the redesign.

## Pages

`/`, `/product.html`, `/how-it-works.html`, `/create.html`, `/pricing.html`, `/compare.html`, `/pilot.html`, `/about.html`, `/privacy.html`, `/terms.html`.

## Asset

`assets/learning-wave.webp`: 1536 × 1024, encoded from an original built-in ImageGen result. Prompt: Bright white landscape website background, flowing fine luminous blue, cyan, violet and magenta fiber waves across the bottom quarter, gentle sweep lifting at the right edge, upper 70% almost pure white, restrained light dispersion and fine mesh detail. No text, logos, people, brands, UI, watermark, or busy starfield.

## Validation and behavior

Run `node --check main.js` for JavaScript syntax. Serve the repository root with a static HTTP server when reviewing locally. Absolute asset paths require serving from the domain root.

The pilot form opens the visitor’s email client to info@nuroburst.com; it does not submit to a backend. Pricing values and legal terms are retained. Mobile navigation supports expanded state, Escape, outside click, and the 1000px desktop breakpoint. Focus styles, skip links, reduced-motion and forced-color preferences are supported.
