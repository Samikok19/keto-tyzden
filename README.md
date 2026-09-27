# Keto týždeň

Mobilný statický meal-pack pre Samuela (slovenčina). Čistý HTML/CSS/JS — bez buildu.

**Live:** https://samikok19.github.io/keto-tyzden/

## Súbory

- `index.html` — shell + dropdown týždňov
- `styles.css` — mobile-first dark-green dizajn
- `app.js` — dáta týždňov, render, localStorage (samostatný kľúč na týždeň)

## Týždne (história)

| Od–do | Poznámka |
|-------|----------|
| 28. 9. – 2. 10. 2026 | predvolený (nový) |
| 21. 9. – 25. 9. 2026 | archív (pôvodný obsah) |

Dropdown hore prepína týždne. URL stránky ostáva rovnaká.

## Lokálne

```bash
cd keto-tyzden
python3 -m http.server 8080
# → http://localhost:8080
```

## Deploy (GitHub Pages)

Branch `master`, folder `/ (root)` → `https://samikok19.github.io/keto-tyzden/`

## Poznámky

- Checkboxy: `keto-tyzden-2026-09-21` / `keto-tyzden-2026-09-28` (+ day-open kľúče).
- Tlačidlo **Reset** odškrtne položky aktuálneho týždňa.
- Žiadny service worker — funguje offline po načítaní fontov.
