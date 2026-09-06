# Nuroburst marketing website

Static HTML, CSS, and JavaScript at the repository root. No build step or dependencies.

The design uses the supplied opaque logo, consistent navigation and footers, and a retention-first LMS narrative focused on spaced repetition, short Bursts, and mastery. The homepage learning journey is explicitly illustrative; it is not a live product screenshot or customer performance data.

## Pages

`/`, `/product.html`, `/how-it-works.html`, `/create.html`, `/pricing.html`, `/compare.html`, `/pilot.html`, `/about.html`, `/privacy.html`, `/terms.html`.

## Validation

Run `node --check main.js` for JavaScript syntax. Serve the repository root with a static HTTP server when reviewing locally. Absolute asset paths require serving from the domain root.

The pilot form retains its email-client handoff to info@nuroburst.com; it does not submit to a backend. Pricing and legal terms are retained from the existing site. The mobile navigation supports expanded state, Escape, and keyboard focus. Reduced-motion preferences are respected.
