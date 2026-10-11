# Architecture diagram

`architecture.mmd` is the reviewed Mermaid source for `public/architecture.svg`.
The site serves the generated SVG as an image; it does not execute Mermaid in the visitor's browser.

To regenerate it with Mermaid CLI 12.0.0:

```sh
npx -p @mermaid-js/mermaid-cli@12.0.0 mmdc \
  -i src/diagrams/architecture.mmd \
  -o public/architecture.svg \
  -c src/diagrams/mermaid-config.json \
  -b transparent
```

Review the source and the resulting SVG before publishing. Do not render visitor-supplied Mermaid content.
