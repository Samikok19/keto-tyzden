# Keto týždeň · 21.–25. 9. 2026

Mobilný statický meal-pack pre Samuela (slovenčina). Čistý HTML/CSS/JS — bez buildu.

## Súbory

- `index.html` — obsah (dni, nákup, recept, zvyšky)
- `styles.css` — mobile-first dark-green dizajn
- `app.js` — localStorage pre checkboxy a otvorené dni

## Lokálne

Otvor `index.html` v prehliadači, alebo:

```bash
cd keto-tyzden
python3 -m http.server 8080
# → http://localhost:8080
```

## Deploy na GitHub Pages

### Varianta A — root repozitára

1. Vytvor nový repo (napr. `keto-tyzden`).
2. Nahraj obsah tohto priečinka do **rootu** (nie do podpriečinka).
3. **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: `main` (alebo `master`), folder: **/ (root)**
4. Po 1–2 minútach: `https://<user>.github.io/keto-tyzden/`

```bash
git init
git add index.html styles.css app.js README.md
git commit -m "Keto týždeň 21.–25. 9. 2026"
git branch -M main
git remote add origin https://github.com/<user>/keto-tyzden.git
git push -u origin main
```

### Varianta B — priečinok `/docs`

1. V existujúcom repo vytvor `docs/` a skopíruj sem súbory.
2. Pages → Branch `main`, folder: **/docs**.

### Varianta C — GitHub CLI

```bash
gh repo create keto-tyzden --public --source=. --remote=origin --push
# potom v UI zapni Pages (main / root), alebo:
gh api -X PUT repos/<user>/keto-tyzden/pages \
  -f build_type=legacy \
  -f source[branch]=main \
  -f source[path]=/
```

## Poznámky

- Checkboxy nákupu sa ukladajú do `localStorage` (kľúč `keto-tyzden-2026-09-21`).
- Tlačidlo **Reset** odškrtne všetky položky.
- Žiadny service worker / CDN build — funguje aj offline po prvom načítaní fontov (Google Fonts; bez siete ostane systémový font).

## Obsah týždňa (zámok)

~10 620 kcal · P ~870 g · T ~705 g · S ~112 g · vláknina ~89 g  
Po–Pia podľa `index.html`. Nesmú sa meniť gramáže bez súhlasu.
