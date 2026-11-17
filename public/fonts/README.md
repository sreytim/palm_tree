# Self-hosted webfonts

These files are served directly by the app (`/fonts/<name>.woff2`) and declared
with `@font-face` in `app/globals.css`. Nothing is requested from Google Fonts,
so development, builds and deployments work without network access to the font
CDN.

| File                    | Family          | Subset | Axis / weights  | Source |
| ----------------------- | --------------- | ------ | --------------- | ------ |
| `fraunces-1.woff2`       | Fraunces        | latin  | 100–900 italic  | Google Fonts |
| `fraunces-2.woff2`       | Fraunces        | latin  | 100–900 upright | Google Fonts |
| `work-sans-1.woff2`      | Work Sans       | latin  | 300–700         | Google Fonts |
| `ibm-plex-mono-1.woff2`  | IBM Plex Mono   | latin  | 400             | Google Fonts |
| `ibm-plex-mono-2.woff2`  | IBM Plex Mono   | latin  | 500             | Google Fonts |
| `noto-sans-khmer-1.woff2`| Noto Sans Khmer | khmer  | 400–700         | Google Fonts |

All four families are licensed under the **SIL Open Font License 1.1**, which
permits bundling and self-hosting. The full licence text is in `OFL.txt`.

- Fraunces — © Undercase Type, SIL OFL 1.1
- Work Sans — © Wei Huang, SIL OFL 1.1
- IBM Plex Mono — © IBM, SIL OFL 1.1
- Noto Sans Khmer — © Google, SIL OFL 1.1

To change a font, drop the new `.woff2` file in this folder, point the matching
`@font-face` block at it, and update the `--font-*` stack in `app/globals.css`.
