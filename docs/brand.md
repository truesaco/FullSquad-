# Fullsquad brand: logo system

Source: Claude Design project "Fullsquad logo design" (`Fullsquad Logo.dc.html`, turn 3a, the final version).

## Logo
- **Symbol:** eleven players in a **1-4-4-2** formation. The keeper dot is Keeper red and the other ten are Pitch (Chalk on dark backgrounds).
  - Geometry at a 14-unit dot: columns 9 apart, rows 7 apart.
  - Columns hold 1 (keeper, vertically centred), 4, 4 and 2 (centred) dots.
- **Wordmark:** `fullsquad`, all lowercase, **Sora 700**, −0.04em tracking, about 4× the dot size.
- **Lockups:** horizontal (the primary one), stacked, symbol only, and mono.
- **Clearspace:** one dot-column width on every side.
- **Small sizes:**
  - 48px and up: the full symbol.
  - 32px: a 3-3-2 grid with the keeper at the top of the last column. This is `public/favicon.svg`.
  - 16px: a 2×2 grid with one red dot.
- **App icon:** the symbol in Chalk on a Pitch rounded square with a 24% corner radius.

In code:
- `Logo` is the lockup and `LogoMark` is the symbol, both in `components/icons.tsx`.
- The icon files are `public/favicon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` and `apple-touch-icon.png`.

## Colour
| Name | Hex | Use |
|---|---|---|
| Pitch | `#1F3D2F` | Brand ink, dark panels, footer, meters, selected states |
| Keeper | `#E0493E` | Keeper dot, headline accents, live indicators |
| Keeper (button) | `#C8392F` | Primary buttons. A deeper shade so white text passes WCAG AA (5.1:1); white on `#E0493E` is only 4.0:1 |
| Chalk | `#FBFAF7` | Page background, text on Pitch |
| Ink | `#1A1A18` | Body text, dark UI |

## Type
- Headlines and the wordmark use **Sora 700** with tight tracking.
- Body and UI text use **Inter**.
