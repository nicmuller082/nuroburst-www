# Nuroburst marketing website

Static HTML, CSS, and JavaScript at the repository root. No build step or dependencies.

## Design

A bright, grown-up brand system with bold navy typography, electric blue/violet/magenta accents, and an original flowing-light background. The story centers on gamified learning, Bursts, spaced repetition, and mastery Levels 1–10. The hero is labeled as an illustrative preview, not a product screenshot or measured performance data.

The original logo is preserved in the repository. Pages use a 204px lossless WebP with a baked-in opaque white canvas. White-plate rules from `logo-fix.css` are included in the main stylesheet to avoid a second blocking stylesheet request. Client reference graphics are not shipped. There are no customer-specific offers, names, images, or outcome statistics in the redesign.

## Pages

`/`, `/product.html`, `/how-it-works.html`, `/create.html`, `/pricing.html`, `/compare.html`, `/pilot.html`, `/about.html`, `/privacy.html`, `/terms.html`.

## Asset

`assets/learning-wave.webp`: 1536 × 1024, encoded from an original built-in ImageGen result. Prompt: Bright white landscape website background, flowing fine luminous blue, cyan, violet and magenta fiber waves across the bottom quarter, gentle sweep lifting at the right edge, upper 70% almost pure white, restrained light dispersion and fine mesh detail. No text, logos, people, brands, UI, watermark, or busy starfield.

## Validation and behavior

Run `node --check main.js` for JavaScript syntax. Serve the repository root with a static HTTP server when reviewing locally. Absolute asset paths require serving from the domain root.

The pilot form opens the visitor’s email client to info@nuroburst.com; it does not submit to a backend. Pricing values and legal terms are retained. Mobile navigation supports expanded state, Escape, outside click, and the 1000px desktop breakpoint. Focus styles, skip links, reduced-motion and forced-color preferences are supported.

## Loading performance

Pages use a single same-origin stylesheet and a preloaded, locally hosted Plus Jakarta Sans variable WOFF2 (Latin subset, weights 400–800, font-display swap). The SIL OFL license is included beside the font. There are no Google Fonts requests at runtime. The logo payload is reduced from 729,441 bytes to 37,834 bytes; the original remains available. The font is 27,348 bytes.

Inspection found the site sends `Cache-Control: public, max-age=0, s-maxage=300` for shared assets, which requires browser revalidation. Changing browser cache policy requires hosting configuration; this patch does not claim to change it. Raw test timings include the remote testing environment’s connection overhead and are not representative visitor benchmarks.
