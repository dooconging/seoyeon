Seoyeon Portfolio (Planner)

English API docs; Korean comments in code.

Overview
Interactive portfolio showcasing planning capabilities, projects, and statement. Built with semantic HTML, responsive CSS, and vanilla JS.

Run
- Open `index.html` in a modern browser.
- No build step required.

Structure
- `index.html`: Semantic sections (Header, Hero, Education, Projects, Statement, Footer)
- `styles.css`: Light, minimal theme, responsive layout, animations
- `script.js`: Smooth scroll, filtering, accordion, tabs, reveal animations, a11y helpers

Functional Highlights
- Sticky header with smooth section navigation
- Hero: 4 capability cards + global tag filter
- Education: rounded table style
- Projects: left tag filters + accordion cards with tabs (Overview/Process/Outcome)
- Statement: card layout
- Footer: visible projects counter (live)

Interaction & Accessibility
- Tabs support keyboard navigation (ArrowLeft/Right, Home/End)
- All interactive controls are focusable and labeled
- Animations: fade-in on scroll; tab fade transitions
- WCAG-conscious contrast and non-color cues

Responsive
- ≥1200px: 2-column projects layout
- ≤960px: single column, sidebar filters collapse into a select
- ≤480px: compact paddings and font sizes

External Links
- Figma and Drive links open in new tabs with `rel="noopener noreferrer"`.

Customization
- Update copy, education rows, and project items in `index.html`
- Adjust palette and radii in `:root` of `styles.css`

License
This project content is © Seoyeon Lee. Code is MIT.



