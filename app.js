(function () {
  "use strict";

  /* ===== Weeks data (newest first in ORDER) ===== */
  var DEFAULT_WEEK = "2026-10-26";
  var WEEK_ORDER = ["2026-10-26", "2026-10-19", "2026-10-12", "2026-10-05", "2026-10-04", "2026-09-28", "2026-09-21"];
  var SELECT_KEY = "keto-tyzden-selected-week";
  var VIEW_KEY = "keto-tyzden-view"; // "week" or "list"

  /* =====================================================================
     SHOPPING_LIST — Standalone persistent shopping list
     =====================================================================
     This list is NOT tied to any specific meal week. Samuel (or bots) can
     edit this list directly in the repo, push, and GitHub Pages redeploys.

     UPDATE MODES (for future edits by bots or humans):
     ---------------------------------------------------
     1. REPLACE MODE — overwrite the entire items array:
        Simply replace the SHOPPING_LIST.items array with a new array.

     2. APPEND MODE — keep existing items + add new ones:
        Push new item objects to the end of SHOPPING_LIST.items array.
        Each item needs a unique "key" property.

     Item structure:
       { key: "unique-key", text: "Item name", em: "optional amount/note" }

     The "key" must be unique across all items (used for localStorage state).
     The "em" field is optional — displays as lighter text after the item name.
     ===================================================================== */
  var SHOPPING_LIST = {
    storageKey: "keto-standalone-shopping-list",
    items: [
      // Seed with placeholder — delete or replace as needed
      // { key: "example-item", text: "Príklad položky", em: "1 ks" }
    ]
  };

  var WEEKS = {
    "2026-09-21": {
      id: "2026-09-21",
      storageKey: "keto-tyzden-2026-09-21",
      dayKey: "keto-tyzden-days-open-2026-09-21",
      label: "21. 9. – 25. 9. 2026",
      title: "Týždeň 21.–25.\u00a09.\u00a02026",
      foot: "Samuelov keto pack · 21.–25.\u00a09.\u00a02026",
      summary: {
        kcal: "10\u00a0620",
        macros: [
          { k: "P", v: "~870\u00a0g" },
          { k: "T", v: "~705\u00a0g" },
          { k: "S", v: "~112\u00a0g" },
          { k: "V", v: "~89\u00a0g" }
        ],
        note: "Tréningový deň ⌀ ~2370 kcal · pri hladu +olej/orechy",
        shake: "kokosové mlieko + proteín + kakao + chia · ~280 kcal",
        shakePill: "Shake Po–Št"
      },
      shopTitle: "Nákup & spotreba",
      buyTitle: "Dokúpiť (mini)",
      haveTitle: "Už mám — skontrolovať",
      buy: [
        { key: "buy-almond", text: "Mandľová múka", em: "150\u00a0g" },
        { key: "buy-bp", text: "Prášok do pečiva", em: "1 balenie" }
      ],
      have: [
        { key: "have-chicken", text: "Kuracie mäso", em: "790\u00a0g" },
        { key: "have-salmon", text: "Losos", em: "500\u00a0g" },
        { key: "have-burger", text: "Hamburgery", em: "300\u00a0g" },
        { key: "have-tartar", text: "Tatár / mleté", em: "200\u00a0g" },
        { key: "have-steak", text: "Steak", em: "239\u00a0g" },
        { key: "have-bacon", text: "Slanina", em: "250\u00a0g" },
        { key: "have-bryndza", text: "Bryndza", em: "250\u00a0g" },
        { key: "have-mozarella", text: "Mozzarella" },
        { key: "have-cheddar", text: "Cheddar" },
        { key: "have-gouda", text: "Gouda" },
        { key: "have-tvaroh", text: "Tvaroh" },
        { key: "have-butter", text: "Maslo" },
        { key: "have-eggs", text: "Vajcia", em: "~14 ks" },
        { key: "have-oil", text: "Olej" },
        { key: "have-mayo", text: "Majoneza" },
        { key: "have-cabbage", text: "Kapusta", em: "~1\u00a0kg" },
        { key: "have-broc", text: "Brokolica", em: "350\u00a0g" },
        { key: "have-iceberg", text: "Ľadový šalát" },
        { key: "have-bagged", text: "Balený šalát" },
        { key: "have-cuke", text: "Uhorky", em: "3 ks" },
        { key: "have-peanuts", text: "Arašidy", em: "~150\u00a0g" },
        { key: "have-psyllium", text: "Psyllium" },
        { key: "have-shake", text: "Shake pantrý" }
      ],
      dont: [
        "extra mleté kura (mimo plánu)",
        "olivy",
        "huby",
        "cuketa"
      ],
      dontNote: "Šunka OK. Smotana len bezlaktózová a striedmo — nie navždy von.",
      days: [
        {
          id: "po",
          name: "Pondelok",
          totals: "~2660 kcal · P215 · T175 · S28 · V22",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia na masle s bryndzou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 žĺtky + 1 celé vajce", hint: "(alebo 2 celé)" },
                { t: "maslo na pečenie" },
                { t: "bryndza", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná + kapusta + bryndza",
              items: [
                { t: "kuracie stehná", g: "300\u00a0g" },
                { t: "kapusta", g: "200\u00a0g" },
                { t: "bryndza", g: "50\u00a0g" },
                { t: "+ olej / majo" }
              ],
              tip: "Restovať stehná na cesnakovom masle; kapustu krátko na oleji."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Hovädzí hamburger + kapusta + cheddar",
              items: [
                { t: "hamburger", g: "300\u00a0g" },
                { t: "kapusta", g: "200\u00a0g" },
                { t: "cheddar", g: "40\u00a0g" }
              ],
              tip: "Placky poriadne prepiecť; syr pridať na koniec."
            }
          ],
          shake: true
        },
        {
          id: "ut",
          name: "Utorok",
          totals: "~2235 kcal · P195 · T140 · S26 · V20",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia + uhorka",
              items: [
                { t: "1 keto žemľa" },
                { t: "2 vajcia" },
                { t: "olej" },
                { t: "uhorka" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kura + brokolica + gouda",
              items: [
                { t: "kuracie mäso", g: "250\u00a0g" },
                { t: "brokolica", g: "175\u00a0g" },
                { t: "gouda", g: "40\u00a0g" },
                { t: "maslo" }
              ],
              tip: "Brokolicu neprevariť; stehná do zlata."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Losos + ľadový šalát + mozzarella",
              items: [
                { t: "losos", g: "250\u00a0g", hint: "(2×125\u00a0g)" },
                { t: "ľadový šalát" },
                { t: "mozzarella", g: "50\u00a0g" },
                { t: "+ olej / majo" }
              ],
              tip: "Losos na masle, citrón ak je; šalát s majo."
            }
          ],
          shake: true
        },
        {
          id: "st",
          name: "Streda",
          totals: "~2240 kcal · P200 · T145 · S24 · V19",
          dayNote: "Posledné kura pred 24.\u00a09.",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou",
              items: [
                { t: "1 keto žemľa" },
                { t: "2 vajcia" },
                { t: "slanina", g: "40\u00a0g" },
                { t: "syr", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kura + kapusta + bryndza",
              items: [
                { t: "kuracie mäso", g: "240\u00a0g" },
                { t: "kapusta", g: "200\u00a0g" },
                { t: "bryndza", g: "50\u00a0g" }
              ],
              tip: "Kapustu krátko restovať; bryndzu na koniec."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Losos + brokolica",
              items: [
                { t: "losos", g: "250\u00a0g" },
                { t: "brokolica", g: "175\u00a0g" },
                { t: "maslo" }
              ],
              tip: "Dojesť losos pred 24.\u00a09.",
              tipWarn: true
            }
          ],
          shake: true
        },
        {
          id: "stv",
          name: "Štvrtok",
          totals: "~2350 kcal · P190 · T155 · S22 · V18",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou",
              items: [
                { t: "1 keto žemľa" },
                { t: "2 vajcia" },
                { t: "slanina", g: "40\u00a0g" },
                { t: "syr", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Hovädzí steak + kapusta",
              items: [
                { t: "steak", g: "239\u00a0g" },
                { t: "kapusta", g: "200\u00a0g" },
                { t: "maslo" }
              ],
              tip: "Steak na horúcej panvici; odpočinok 3\u00a0min."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Tatár / mleté (upečené!) + šalát + bryndza",
              items: [
                { t: "tatár / mleté", g: "200\u00a0g", after: " — <strong>upečené</strong>, nie surové" },
                { t: "šalát" },
                { t: "bryndza", g: "50\u00a0g" },
                { t: "+ olej / majo" }
              ],
              tip: "Dobre orestovať — nie jesť surové.",
              tipWarn: true
            }
          ],
          shake: true
        },
        {
          id: "pia",
          name: "Piatok",
          totals: "~1135 kcal · P70 · T90 · S12 · V10 · len R+O",
          light: true,
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou",
              items: [
                { t: "1 keto žemľa" },
                { t: "2 vajcia" },
                { t: "slanina", g: "40\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Zvyšky — slanina, zelenina, syry, arašidy",
              items: [
                { t: "zvyšková slanina", g: "~70\u00a0g" },
                { t: "zvyšková kapusta / šalát" },
                { t: "zvyškové syry" },
                { t: "arašidy" }
              ]
            }
          ],
          footerNote: "Bez večere a bez shake — ľahký deň."
        }
      ],
      recipe: {
        yield: "6 žemlí · 175\u00a0°C · 50–60\u00a0min · nechať úplne vychladnúť",
        ingredients: [
          { g: "150\u00a0g", t: "mandľová múka" },
          { g: "25\u00a0g", t: "psyllium" },
          { g: "2 lyžičky", t: "prášok do pečiva" },
          { g: "½ lyžičky", t: "soľ" },
          { g: "3", t: "bielka" },
          { t: "voliteľne ocot" },
          { g: "200–230\u00a0ml", t: "horúca voda" }
        ],
        steps: [
          "Zmiešať suché suroviny.",
          "Pridať bielka, ocot (ak používaš) a horúcu vodu — rýchlo vymiešať.",
          "Tvarovať 6 žemlí, piecť 50–60\u00a0min pri 175\u00a0°C.",
          "Nechať úplne vychladnúť — inak budú gumové."
        ]
      },
      leftovers: [
        { t: "1 žemľa" },
        { t: "slanina", g: "~130\u00a0g" },
        { t: "arašidy" },
        { t: "zvyškový syr / bryndza" },
        { t: "šalát / kapusta (ak ostane)" },
        { t: "nepoužité konzervy tuniaka" }
      ]
    },

    "2026-09-28": {
      id: "2026-09-28",
      storageKey: "keto-tyzden-2026-09-28",
      dayKey: "keto-tyzden-days-open-2026-09-28",
      label: "28. 9. – 2. 10. 2026",
      title: "Týždeň 28.\u00a09.–2.\u00a010.\u00a02026",
      foot: "Samuelov keto pack · 28.\u00a09.–2.\u00a010.\u00a02026 · Kaufland Sekčov",
      summary: {
        kcal: "13\u00a0000",
        macros: [
          { k: "P", v: "~940\u00a0g" },
          { k: "T", v: "~875\u00a0g" },
          { k: "S", v: "~120\u00a0g" },
          { k: "V", v: "~94\u00a0g" }
        ],
        note: "Tréning Po–Št ⌀ ~2800–3000 kcal · Pia len R+O · pri hladu +olej/orechy",
        shake: "kokosové mlieko + proteín + kakao + chia · ~280 kcal · P~35",
        shakePill: "Shake Po–Št (pantrý)"
      },
      shopTitle: "Nákup — Kaufland Sekčov",
      buyTitle: "Kúpiť (checklist)",
      haveTitle: "Pantrý — skontrolovať doma",
      buy: [
        { key: "buy-chicken", text: "Kuracie stehná", em: "~800\u00a0g" },
        { key: "buy-beef", text: "Hovädzie mleté 100\u00a0%", em: "2×500\u00a0g = 1000\u00a0g" },
        { key: "buy-salmon", text: "Losos", em: "2×250\u00a0g = 500\u00a0g" },
        { key: "buy-shrimp", text: "Krevety mrazené", em: "1×500\u00a0g" },
        { key: "buy-bacon", text: "Slanina", em: "250\u00a0g" },
        { key: "buy-ham", text: "Šunka", em: "2×100\u00a0g = 200\u00a0g" },
        { key: "buy-eggs", text: "Vajcia", em: "20 ks" },
        { key: "buy-butter", text: "Maslo", em: "250\u00a0g" },
        { key: "buy-bryndza", text: "Bryndza", em: "250\u00a0g" },
        { key: "buy-cheese", text: "Cheddar / eidam", em: "200\u00a0g" },
        { key: "buy-broc", text: "Brokolica", em: "2×350\u00a0g = 700\u00a0g" },
        { key: "buy-cabbage", text: "Kapusta", em: "1 hlávka" },
        { key: "buy-pepper", text: "Paprika", em: "~400\u00a0g (3–4 ks)" },
        { key: "buy-salad", text: "Šalát", em: "1 ks / ~350\u00a0g" },
        { key: "buy-pickles", text: "Kyslé uhorky", em: "1 pohár" },
        { key: "buy-garlic", text: "Cesnak", em: "1 balenie" },
        { key: "buy-lemon", text: "Citrón", em: "1–2 ks" },
        { key: "buy-almond", text: "Mandľová múka ALEBO mleté mandle", em: "200–250\u00a0g" },
        { key: "buy-bp", text: "Prášok do pečiva", em: "1 balenie" }
      ],
      have: [
        { key: "have-psyllium", text: "Psyllium" },
        { key: "have-protein", text: "Proteín (shake)" },
        { key: "have-coco-milk", text: "Kokosové mlieko (nesladené)" },
        { key: "have-cocoa", text: "Kakao" },
        { key: "have-chia", text: "Chia" },
        { key: "have-oil", text: "Olej / majonéza" },
        { key: "have-salt", text: "Soľ" }
      ],
      dont: [
        "kokos",
        "ocot",
        "ketomúka",
        "olivy",
        "huby",
        "cuketa"
      ],
      dontNote: "Šunka OK (je v nákupnom zozname). Shake pantrý nekupovať — doma.",
      days: [
        {
          id: "po",
          name: "Pondelok",
          totals: "~2950 kcal · P215 · T200 · S28 · V22",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia na masle s bryndzou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia na masle", hint: "(~15\u00a0g masla)" },
                { t: "bryndza", g: "30\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná + brokolica",
              items: [
                { t: "kuracie stehná", g: "300\u00a0g" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "+ olej / majonéza", hint: "(~20\u00a0ml)" }
              ],
              tip: "Stehná na cesnakovom masle; brokolicu neprevariť."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Hovädzie mleté + kapusta + syr",
              items: [
                { t: "hovädzie mleté (placky)", g: "350\u00a0g" },
                { t: "kapusta restovaná", g: "200\u00a0g" },
                { t: "cheddar / eidam", g: "40\u00a0g" },
                { t: "+ olej" }
              ],
              tip: "Placky poriadne prepiecť; syr pridať na koniec."
            }
          ],
          shake: true
        },
        {
          id: "ut",
          name: "Utorok",
          totals: "~2850 kcal · P205 · T190 · S26 · V20",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "slanina", g: "60\u00a0g" },
                { t: "syr", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná + paprika + šalát",
              items: [
                { t: "kuracie stehná", g: "250\u00a0g" },
                { t: "paprika", g: "1 ks" },
                { t: "šalát" },
                { t: "+ majonéza" }
              ],
              tip: "Stehná do zlata; paprika krátko restovať alebo surová."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Losos + brokolica + maslo + citrón",
              items: [
                { t: "losos", g: "250\u00a0g" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "maslo", g: "~15\u00a0g" },
                { t: "citrón" }
              ],
              tip: "Losos na masle s citrónom; brokolica s maslom."
            }
          ],
          shake: true
        },
        {
          id: "st",
          name: "Streda",
          totals: "~3000 kcal · P220 · T195 · S24 · V18",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so šunkou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "šunka", g: "70\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná + kapusta + bryndza",
              items: [
                { t: "kuracie stehná", g: "250\u00a0g" },
                { t: "kapusta", g: "200\u00a0g" },
                { t: "bryndza", g: "50\u00a0g" },
                { t: "+ olej" }
              ],
              tip: "Kapustu krátko restovať; bryndzu na koniec."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Krevety + šalát + syr",
              items: [
                { t: "krevety", g: "500\u00a0g", hint: "(celé balenie)" },
                { t: "šalát" },
                { t: "majonéza / olej" },
                { t: "eidam", g: "~30\u00a0g" }
              ],
              tip: "Krevety krátko restovať na masle/oleji — neprevariť."
            }
          ],
          shake: true
        },
        {
          id: "stv",
          name: "Štvrtok",
          totals: "~3000 kcal · P220 · T205 · S30 · V24",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "slanina", g: "60\u00a0g" },
                { t: "syr", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Hovädzie mleté + brokolica + syr",
              items: [
                { t: "hovädzie mleté", g: "300\u00a0g" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "syr", g: "30\u00a0g" },
                { t: "maslo" }
              ],
              tip: "Placky alebo restované mleté; brokolica s maslom."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Mini keto pizza (mandľová / mleté mandle)",
              items: [
                { t: "cesto: mandľová múka / mleté mandle", g: "~60–80\u00a0g" },
                { t: "+ psyllium (doma) + 1 vajce + štipka soli" },
                { t: "hovädzie mleté na vrch", g: "350\u00a0g" },
                { t: "eidam", g: "~50\u00a0g" },
                { t: "paprika" }
              ],
              tip: "Bez olív, húb a cukety. Piecť do zlata.",
              tipWarn: true
            }
          ],
          shake: true
        },
        {
          id: "pia",
          name: "Piatok",
          totals: "~1200 kcal · P80 · T85 · S12 · V10 · len R+O",
          light: true,
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so šunkou",
              items: [
                { t: "1 keto žemľa" },
                { t: "2 vajcia" },
                { t: "šunka", g: "70\u00a0g" },
                { t: "uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Losos + zelenina",
              items: [
                { t: "losos", g: "250\u00a0g" },
                { t: "zvyšok zeleniny", g: "~150\u00a0g" },
                { t: "+ majonéza / maslo" }
              ],
              tip: "Losos na masle; dojesť zvyšky zeleniny."
            }
          ],
          footerNote: "Bez večere, bez shake, bez víkendu — len R+O."
        }
      ],
      recipe: {
        yield: "6 žemlí · 175\u00a0°C · 50–60\u00a0min · nechať úplne vychladnúť · chladnička 4–5 dní",
        ingredients: [
          { g: "150\u00a0g", t: "mandľová múka" },
          { g: "25\u00a0g", t: "psyllium (doma)" },
          { g: "~8\u00a0g", t: "prášok do pečiva" },
          { g: "~3\u00a0g", t: "soľ" },
          { g: "3", t: "bielka" },
          { t: "voliteľne citrón" },
          { g: "200–230\u00a0ml", t: "horúca voda" }
        ],
        steps: [
          "Zmiešať suché suroviny.",
          "Pridať bielka, citrón (ak používaš) a horúcu vodu — rýchlo vymiešať.",
          "Tvarovať 6 žemlí, piecť 50–60\u00a0min pri 175\u00a0°C.",
          "Nechať úplne vychladnúť — inak budú gumové."
        ]
      },
      leftovers: [
        { t: "1 žemľa (ak ostane)" },
        { t: "zvyšný syr / bryndza" },
        { t: "slanina (rezerva z 250\u00a0g)" },
        { t: "šunka", g: "~60\u00a0g" },
        { t: "šalát / kapusta (ak ostane)" }
      ]
    },

    "2026-10-04": {
      id: "2026-10-04",
      storageKey: "keto-tyzden-2026-10-04",
      dayKey: "keto-tyzden-days-open-2026-10-04",
      label: "4. 10. 2026 (nedeľa)",
      title: "Nedeľa 4.\u00a010.\u00a02026",
      foot: "Samuelov keto mini-balík · nedeľa 4.\u00a010.\u00a02026 · Kaufland Sekčov",
      summary: {
        kcal: "2\u00a0950",
        macros: [
          { k: "P", v: "~215\u00a0g" },
          { k: "T", v: "~200\u00a0g" },
          { k: "S", v: "~25\u00a0g" },
          { k: "V", v: "~18\u00a0g" }
        ],
        note: "Mini nedeľa · Pia večer + So mimo · tréning ~2800–3000 · shake pantrý",
        shake: "kokosové mlieko + proteín + kakao + chia · ~280 kcal · P~35 (pantrý)",
        shakePill: "Shake ak tréning (pantrý)"
      },
      shopTitle: "Nákup — Kaufland Sekčov (nedeľa)",
      buyTitle: "Dokúpiť (checklist)",
      haveTitle: "Pantrý / zvyšky — skontrolovať",
      buy: [
        { key: "n1004-buy-chicken", text: "Kuracie stehná", em: "~400\u00a0g" },
        { key: "n1004-buy-beef", text: "Hovädzie mleté 100\u00a0%", em: "1×500\u00a0g" },
        { key: "n1004-buy-veg", text: "Brokolica / zelenina", em: "~300–400\u00a0g (len ak nemá zvyšok)" },
        { key: "n1004-buy-eggs", text: "Vajcia", em: "+6–10 ks (len ak treba)" },
        { key: "n1004-buy-butter", text: "Maslo / majonéza", em: "len ak treba" }
      ],
      have: [
        { key: "n1004-have-bacon", text: "Slanina (zvyšok)" },
        { key: "n1004-have-ham", text: "Šunka (zvyšok)" },
        { key: "n1004-have-cheese", text: "Syr / bryndza" },
        { key: "n1004-have-cabbage", text: "Kapusta / šalát (zvyšok)" },
        { key: "n1004-have-bun", text: "Keto žemľa (ak ostala)" },
        { key: "n1004-have-eggs", text: "Vajcia" },
        { key: "n1004-have-butter", text: "Maslo" },
        { key: "n1004-have-oil", text: "Olej / majonéza" },
        { key: "n1004-have-pickles", text: "Kyslé uhorky" },
        { key: "n1004-have-shake", text: "Shake pantrý" }
      ],
      dont: [
        "kokos",
        "ocot",
        "olivy",
        "huby",
        "cuketa",
        "ketomúka"
      ],
      dontNote: "Preferencia A: kura ~400\u00a0g obed + hovädzie 1×500\u00a0g večera. Fallback B: kura ~800\u00a0g obed+večera (bez hovädzieho). Fallback C: obed kura 400 + večera losos 2×250 alebo krevety 500\u00a0g. Šunka OK.",
      days: [
        {
          id: "ne",
          name: "Nedeľa",
          totals: "~2950 kcal · P215 · T200 · S25 · V18",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa alebo vajcia + slanina/šunka",
              items: [
                { t: "1 keto žemľa (ak ostala)", hint: "ALEBO" },
                { t: "3 vajcia na masle", hint: "(~15\u00a0g masla)" },
                { t: "slanina", g: "50\u00a0g", hint: "(zvyšok) ALEBO šunka ~50\u00a0g" },
                { t: "bryndza / syr", g: "~25\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná + zelenina",
              items: [
                { t: "kuracie stehná", g: "400\u00a0g" },
                { t: "kapusta / šalát / brokolica", g: "~200\u00a0g" },
                { t: "olej", g: "~15\u00a0ml" },
                { t: "majonéza", g: "~20\u00a0g" }
              ],
              tip: "Stehná pečené/restované; zeleninu neprevariť."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Hovädzie placky 500\u00a0g + zelenina + syr",
              items: [
                { t: "hovädzie mleté (placky)", g: "500\u00a0g", hint: "(celé balenie)" },
                { t: "zelenina", g: "~150–200\u00a0g" },
                { t: "syr / bryndza", g: "~40\u00a0g" },
                { t: "+ majo / olej" }
              ],
              tip: "Celé 500\u00a0g — zero waste, žiadne zvyšky mäsa. Placky poriadne prepiecť."
            }
          ],
          shake: true
        }
      ],
      recipe: {
        yield: "Žemľa zo zvyškov, ak je · inak raňajky bez pečenia (vajcia)",
        ingredients: [
          { t: "ak pečieš nové: mandľová múka + psyllium (doma) — tento mini-balík pečenie nevyžaduje" }
        ],
        steps: [
          "Ak ostala žemľa z minulého týždňa — použiť na raňajky.",
          "Ak nie — 3 vajcia na masle + slanina/šunka + bryndza/syr.",
          "Pečenie nových žemlí tento mini-balík nevyžaduje."
        ]
      },
      leftovers: [
        { t: "mäso by nemalo zostať (celé balenia)" },
        { t: "zvyšok zeleniny / šalátu (ak ostane)" },
        { t: "syr / bryndza (ak ostane)" },
        { t: "slanina / šunka (ak ostane)" }
      ]
    },

    "2026-10-05": {
      id: "2026-10-05",
      storageKey: "keto-tyzden-2026-10-05",
      dayKey: "keto-tyzden-days-open-2026-10-05",
      label: "5. 10. – 9. 10. 2026",
      title: "Týždeň 5.–9.\u00a010.\u00a02026",
      foot: "Samuelov keto pack · 5.–9.\u00a010.\u00a02026 · Kaufland Sekčov",
      summary: {
        kcal: "13\u00a0050",
        macros: [
          { k: "P", v: "~945\u00a0g" },
          { k: "T", v: "~880\u00a0g" },
          { k: "S", v: "~120\u00a0g" },
          { k: "V", v: "~94\u00a0g" }
        ],
        note: "Po–Št plné · Pia len R+O · bez Pia večere, bez víkendu · Kaufland Sekčov",
        shake: "kokosové mlieko LEN nesladené + proteín + kakao + chia · ~280 kcal · ak niet nesladeného → shake z pantrý bez nového kartónu",
        shakePill: "Shake Po–Št (ak tréning)"
      },
      shopTitle: "Nákup — Kaufland Sekčov",
      buyTitle: "Kúpiť (checklist)",
      haveTitle: "Pantrý — skontrolovať doma",
      buy: [
        { key: "w1005-chicken", text: "Kuracie stehná", em: "~800\u00a0g vážené" },
        { key: "w1005-beef", text: "Hovädzie mleté 100\u00a0%", em: "2×500\u00a0g = 1000\u00a0g (nie bravčové)" },
        { key: "w1005-salmon", text: "Losos čerstvý", em: "~500\u00a0g (alebo 2×250\u00a0g mrazený, ak je v mrazáku)" },
        { key: "w1005-shrimp", text: "Krevety", em: "1×~500\u00a0g alebo 2×225–250\u00a0g" },
        { key: "w1005-bacon", text: "Slanina", em: "2×100\u00a0g = 200\u00a0g" },
        { key: "w1005-ham", text: "Šunka", em: "2×100\u00a0g = 200\u00a0g" },
        { key: "w1005-eggs", text: "Vajcia", em: "20 ks (alebo 2×10)" },
        { key: "w1005-butter", text: "Maslo", em: "250\u00a0g" },
        { key: "w1005-bryndza", text: "Bryndza", em: "250\u00a0g alebo 2×110\u00a0g" },
        { key: "w1005-eidam", text: "Eidam", em: "2×100\u00a0g (cheddar ak je 200\u00a0g blok)" },
        { key: "w1005-broc", text: "Brokolica", em: "~700\u00a0g" },
        { key: "w1005-cabbage", text: "Kapusta", em: "1 hlávka" },
        { key: "w1005-pepper", text: "Paprika", em: "~400\u00a0g (3–4 ks)" },
        { key: "w1005-salad", text: "Šalát ľadový", em: "1 ks" },
        { key: "w1005-pickles", text: "Kyslé uhorky", em: "1 pohár" },
        { key: "w1005-garlic", text: "Cesnak", em: "1×~100\u00a0g" },
        { key: "w1005-lemon", text: "Citrón", em: "1 balenie ~500\u00a0g" },
        { key: "w1005-almond", text: "Mandľová múka alebo mleté mandle", em: "~200–250\u00a0g · NIE pšeničná, NIE ketomúka" },
        { key: "w1005-bp", text: "Prášok do pečiva", em: "1 balenie" },
        { key: "w1005-coco", text: "Kokosové mlieko LEN nesladené", em: "1–2×~400\u00a0ml · sladené NIE" },
        { key: "w1005-acv", text: "Jablčný ocot", em: "1 malá fľaša" }
      ],
      have: [
        { key: "w1005-have-psyllium", text: "Psyllium (doma — nekupovať)" },
        { key: "w1005-have-protein", text: "Proteín (shake)" },
        { key: "w1005-have-cocoa", text: "Kakao" },
        { key: "w1005-have-chia", text: "Chia" },
        { key: "w1005-have-ery", text: "Erytritol" },
        { key: "w1005-have-oil", text: "Olej / majonéza" },
        { key: "w1005-have-salt", text: "Soľ" }
      ],
      dont: [
        "olivy",
        "huby",
        "cuketa",
        "bravčové mleté",
        "pšeničná múka",
        "sladené kokosové mlieko",
        "ketomúka"
      ],
      dontNote: "Kokosové mlieko len nesladené (sladené NIE). Mandľová múka alebo mleté mandle — nie pšeničná, nie ketomúka. Jablčný ocot (ak nie je jablčný → kvasný na žemle; citrón už je v košíku). Ak niet mandľovej: Št večera hovädzie placky 350\u00a0g + paprika/brokolica + eidam, nie pizza. Psyllium je doma.",
      days: [
        {
          id: "po",
          name: "Pondelok",
          totals: "~2950 kcal · P215 · T200 · S28 · V22",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia na masle s bryndzou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia na masle", hint: "(~15\u00a0g masla)" },
                { t: "bryndza", g: "30\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná + brokolica",
              items: [
                { t: "kuracie stehná", g: "300\u00a0g" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "+ olej / majonéza", hint: "(~20\u00a0ml)" }
              ],
              tip: "Stehná na cesnakovom masle; brokolicu neprevariť."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Hovädzie placky + kapusta + eidam",
              items: [
                { t: "hovädzie mleté (placky)", g: "350\u00a0g" },
                { t: "kapusta", g: "200\u00a0g" },
                { t: "eidam", g: "40\u00a0g" },
                { t: "+ olej" }
              ],
              tip: "Placky poriadne prepiecť; syr pridať na koniec. Nie bravčové."
            }
          ],
          shake: true
        },
        {
          id: "ut",
          name: "Utorok",
          totals: "~2900 kcal · P210 · T195 · S26 · V20",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "slanina", g: "60\u00a0g" },
                { t: "syr", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná + paprika + šalát",
              items: [
                { t: "kuracie stehná", g: "250\u00a0g" },
                { t: "paprika", g: "1 ks" },
                { t: "šalát" },
                { t: "+ majonéza" }
              ],
              tip: "Stehná do zlata; paprika krátko restovať alebo surová."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Losos + brokolica + maslo + citrón",
              items: [
                { t: "losos", g: "250\u00a0g" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "maslo", g: "~15\u00a0g" },
                { t: "citrón" }
              ],
              tip: "Losos na masle s citrónom; brokolica s maslom. Preferuj čerstvý losos."
            }
          ],
          shake: true
        },
        {
          id: "st",
          name: "Streda",
          totals: "~3000 kcal · P220 · T195 · S24 · V18",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so šunkou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "šunka", g: "70\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná + kapusta + bryndza",
              items: [
                { t: "kuracie stehná", g: "250\u00a0g" },
                { t: "kapusta", g: "200\u00a0g" },
                { t: "bryndza", g: "50\u00a0g" },
                { t: "+ olej" }
              ],
              tip: "Kapustu krátko restovať; bryndzu na koniec."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Krevety + šalát + eidam",
              items: [
                { t: "krevety (celé balenie)", g: "450–500\u00a0g", hint: "(1×~500 alebo 2×225–250)" },
                { t: "šalát" },
                { t: "majonéza / olej" },
                { t: "eidam", g: "~30\u00a0g" }
              ],
              tip: "Krevety krátko restovať — neprevariť. Ak len 225–250\u00a0g, použiť 2 balenia."
            }
          ],
          shake: true
        },
        {
          id: "stv",
          name: "Štvrtok",
          totals: "~3000 kcal · P220 · T205 · S30 · V24",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "slanina", g: "60\u00a0g" },
                { t: "syr", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Hovädzie mleté + brokolica + syr",
              items: [
                { t: "hovädzie mleté", g: "300\u00a0g" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "syr", g: "30\u00a0g" },
                { t: "maslo" }
              ],
              tip: "Placky alebo restované mleté; brokolica s maslom."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Mini keto pizza (mandľová / mleté mandle)",
              items: [
                { t: "cesto: mandľová múka / mleté mandle", g: "~60–80\u00a0g", hint: "(nie pšeničná, nie ketomúka)" },
                { t: "+ psyllium (doma) + 1 vajce" },
                { t: "navrch hovädzie mleté", g: "350\u00a0g" },
                { t: "eidam", g: "~50\u00a0g" },
                { t: "paprika" }
              ],
              tip: "Bez olív, húb a cukety. Ak niet mandľovej múky ani mletých mandlí: nie pizza — hovädzie placky 350\u00a0g + paprika/brokolica + eidam.",
              tipWarn: true
            }
          ],
          shake: true
        },
        {
          id: "pia",
          name: "Piatok",
          totals: "~1200 kcal · P80 · T85 · S12 · V10 · len R+O",
          light: true,
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so šunkou",
              items: [
                { t: "1 keto žemľa" },
                { t: "2 vajcia" },
                { t: "šunka", g: "70\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Losos + zvyšok zeleniny",
              items: [
                { t: "losos", g: "250\u00a0g" },
                { t: "zvyšok zeleniny", g: "~150\u00a0g" },
                { t: "+ majonéza / maslo" }
              ],
              tip: "Losos na masle; dojesť zvyšky zeleniny."
            }
          ],
          footerNote: "Bez večere, bez víkendu — len raňajky a obed."
        }
      ],
      recipe: {
        yield: "6 žemlí · nedeľa večer / Po ráno · 175\u00a0°C · 50–60\u00a0min · úplne vychladnúť",
        ingredients: [
          { g: "150\u00a0g", t: "mandľová múka (nie pšeničná, nie ketomúka)" },
          { g: "25\u00a0g", t: "psyllium (doma)" },
          { g: "~8\u00a0g", t: "prášok do pečiva" },
          { g: "~3\u00a0g", t: "soľ" },
          { g: "3", t: "bielka" },
          { t: "2 lyžičky jablčného octu alebo citrón" },
          { g: "200–230\u00a0ml", t: "horúca voda" }
        ],
        steps: [
          "Zmiešať suché suroviny (mandľová múka, psyllium, prášok, soľ).",
          "Pridať 3 bielka, 2 lyžičky jablčného octu (alebo citrón) a 200–230\u00a0ml horúcej vody — rýchlo vymiešať.",
          "Tvarovať 6 žemlí, piecť 50–60\u00a0min pri 175\u00a0°C.",
          "Nechať úplne vychladnúť — inak budú gumové."
        ]
      },
      leftovers: [
        { t: "1 žemľa (ak ostane)" },
        { t: "syr / bryndza" },
        { t: "slanina", g: "~80\u00a0g" },
        { t: "šunka", g: "~60\u00a0g" },
        { t: "šalát / kapusta" },
        { t: "otvorené kokosové mlieko" }
      ]
    },

    "2026-10-12": {
      id: "2026-10-12",
      storageKey: "keto-tyzden-2026-10-12",
      dayKey: "keto-tyzden-days-open-2026-10-12",
      label: "12. 10. – 16. 10. 2026",
      title: "Týždeň 12.–16.\u00a010.\u00a02026",
      foot: "Samuelov keto pack · 12.–16.\u00a010.\u00a02026 · Kaufland Sekčov",
      summary: {
        kcal: "12\u00a0600",
        macros: [
          { k: "P", v: "~945\u00a0g" },
          { k: "T", v: "~860\u00a0g" },
          { k: "S", v: "~113\u00a0g" },
          { k: "V", v: "~94\u00a0g" }
        ],
        note: "Po–Št plné · Pia len R+O · bez Pia večere, bez víkendu · Kaufland Sekčov",
        shake: "kokosové mlieko LEN nesladené + proteín + kakao + chia · ak niet nesladeného → shake z pantrý",
        shakePill: "Shake Po–Št"
      },
      shopTitle: "Nákup — Kaufland Sekčov",
      buyTitle: "Kúpiť (checklist)",
      haveTitle: "Pantrý — skontrolovať doma",
      buy: [
        { key: "w1012-chicken", text: "Kuracie stehná", em: "~800\u00a0g vážené (Po O 400 + Ut O 400)" },
        { key: "w1012-beef", text: "Hovädzie mleté 100\u00a0%", em: "1×1\u00a0kg (K-Purland, akcia) · ak nie je → 2×500\u00a0g · nie bravčové, nie mix" },
        { key: "w1012-salmon", text: "Losos čerstvý filet s kožou", em: "~500\u00a0g vážený (Ut V 250 + St V 250)" },
        { key: "w1012-shrimp", text: "Krevety mrazené", em: "1×500\u00a0g alebo 2×250\u00a0g · overiť mrazák · ak nie sú → kura +400\u00a0g" },
        { key: "w1012-bacon", text: "Slanina", em: "2×100\u00a0g = 200\u00a0g" },
        { key: "w1012-ham", text: "Šunka", em: "2×100\u00a0g = 200\u00a0g" },
        { key: "w1012-eggs", text: "Vajcia", em: "20 ks (2×10)" },
        { key: "w1012-butter", text: "Maslo", em: "250\u00a0g" },
        { key: "w1012-bryndza", text: "Bryndza", em: "~250\u00a0g alebo 2×110\u00a0g" },
        { key: "w1012-eidam", text: "Eidam", em: "2×100\u00a0g" },
        { key: "w1012-broc", text: "Brokolica", em: "~750\u00a0g čerstvá/mrazená" },
        { key: "w1012-cabbage", text: "Kapusta", em: "1 menšia hlávka (biela; červená v akcii OK)" },
        { key: "w1012-pepper", text: "Paprika", em: "1×500\u00a0g balenie (~3 ks)" },
        { key: "w1012-salad", text: "Šalát ľadový", em: "1 ks" },
        { key: "w1012-pickles", text: "Kyslé uhorky", em: "1 pohár (ak doma nie je načatý)" },
        { key: "w1012-lemon", text: "Citrón", em: "2–3 ks (ak doma nie je)" },
        { key: "w1012-almond", text: "Mandľová múka alebo mleté mandle", em: "~250\u00a0g · NIE pšeničná · fallback: lúpané mandle 3×100\u00a0g zomlieť" },
        { key: "w1012-coco", text: "Kokosové mlieko LEN nesladené", em: "1–2×400\u00a0ml · sladené NIE" }
      ],
      have: [
        { key: "w1012-have-psyllium", text: "Psyllium (doma — nekupovať)" },
        { key: "w1012-have-acv", text: "Jablčný ocot (doma z minulého týždňa — nekupovať)" },
        { key: "w1012-have-protein", text: "Proteín (shake)" },
        { key: "w1012-have-cocoa", text: "Kakao" },
        { key: "w1012-have-chia", text: "Chia" },
        { key: "w1012-have-ery", text: "Erytritol" },
        { key: "w1012-have-oil", text: "Olej / majonéza" },
        { key: "w1012-have-garlic", text: "Cesnak" },
        { key: "w1012-have-bp", text: "Prášok do pečiva, soľ" }
      ],
      dont: [
        "jablčný ocot (doma)",
        "ketomúka",
        "olivy",
        "huby",
        "cuketa",
        "bravčové mleté",
        "pšeničná múka",
        "sladené kokosové mlieko"
      ],
      dontNote: "Etikety: kokosové mlieko LEN nesladené (sladené NIE; ak nie je → shake z pantrý). Mandľová múka / mleté mandle, NIE pšeničná (ak nie je → lúpané mandle 3×100\u00a0g a zomlieť doma). Hovädzie 1×1\u00a0kg: Po V 400 + St O 300 + Št pizza 300. Ak nie sú krevety: kuracie stehná +400\u00a0g, v pondelok zamraziť, v stredu večer do chladničky → Št O 200\u00a0g + Pia O 200\u00a0g, tá istá príloha.",
      days: [
        {
          id: "po",
          name: "Pondelok",
          totals: "~2950 kcal · P220 · T205 · S25 · V20",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia na masle so slaninou a bryndzou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia na masle" },
                { t: "slanina", g: "60\u00a0g" },
                { t: "bryndza", g: "30\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná pečené + restovaná kapusta",
              items: [
                { t: "kuracie stehná", g: "400\u00a0g" },
                { t: "kapusta restovaná", g: "200\u00a0g" },
                { t: "+ olej + cesnak" }
              ],
              tip: "Ak nie sú krevety: dnes zamraziť extra 400\u00a0g kuracích stehien (na Št + Pia obed)."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Hovädzie burger placky + eidam + šalát",
              items: [
                { t: "hovädzie mleté (placky)", g: "400\u00a0g" },
                { t: "eidam", g: "40\u00a0g" },
                { t: "kyslé uhorky" },
                { t: "ľadový šalát" },
                { t: "+ majonéza" }
              ],
              tip: "Z 1\u00a0kg balenia: 400\u00a0g dnes, zvyšok 300 + 300\u00a0g na St a Št. Placky poriadne prepiecť."
            }
          ],
          shake: true
        },
        {
          id: "ut",
          name: "Utorok",
          totals: "~2850 kcal · P215 · T195 · S24 · V19",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so šunkou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "šunka", g: "70\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná + paprika + šalát + bryndza",
              items: [
                { t: "kuracie stehná", g: "400\u00a0g" },
                { t: "paprika", g: "1 ks" },
                { t: "šalát" },
                { t: "bryndza", g: "50\u00a0g" },
                { t: "+ olej" }
              ]
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Losos + brokolica + maslo + citrón",
              items: [
                { t: "losos", g: "250\u00a0g" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "maslo", g: "15\u00a0g" },
                { t: "citrón" }
              ],
              tip: "Losos na masle s citrónom; brokolicu neprevariť."
            }
          ],
          shake: true
        },
        {
          id: "st",
          name: "Streda",
          totals: "~2850 kcal · P210 · T195 · S26 · V22",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou a syrom",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "slanina", g: "60\u00a0g" },
                { t: "syr", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Hovädzie mleté s kapustou a bryndzou",
              items: [
                { t: "hovädzie mleté", g: "300\u00a0g" },
                { t: "kapusta", g: "200\u00a0g" },
                { t: "cesnak" },
                { t: "bryndza navrch", g: "50\u00a0g" },
                { t: "2 vajcia natvrdo" }
              ]
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Losos + brokolica + citrón",
              items: [
                { t: "losos", g: "250\u00a0g" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "maslo / majonéza" },
                { t: "citrón" }
              ],
              tip: "Fallback (ak neboli krevety): večer presunúť zamrazené kura 400\u00a0g do chladničky."
            }
          ],
          shake: true
        },
        {
          id: "stv",
          name: "Štvrtok",
          totals: "~2800 kcal · P215 · T185 · S28 · V24",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so šunkou a syrom",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "šunka", g: "70\u00a0g" },
                { t: "syr", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Krevety na masle s cesnakom + brokolica",
              items: [
                { t: "krevety", g: "250\u00a0g" },
                { t: "brokolica", g: "150\u00a0g" },
                { t: "maslo + cesnak + citrón" }
              ],
              tip: "Ak nie sú krevety: kuracie stehná 200\u00a0g (rozmrazené od stredy večer), tá istá príloha.",
              tipWarn: true
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Mini keto pizza",
              items: [
                { t: "cesto: mandľová múka / mleté mandle", g: "~70\u00a0g", hint: "(nie pšeničná)" },
                { t: "+ psyllium (doma) + 1 vajce + soľ" },
                { t: "navrch hovädzie mleté", g: "300\u00a0g" },
                { t: "eidam", g: "70\u00a0g" },
                { t: "paprika" }
              ],
              tip: "Bez olív, húb a cukety. Mandľová nie pšeničná — ak nie je, zomlieť lúpané mandle.",
              tipWarn: true
            }
          ],
          shake: true
        },
        {
          id: "pia",
          name: "Piatok",
          totals: "~1150 kcal · P85 · T80 · S10 · V9 · len R+O",
          light: true,
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou",
              items: [
                { t: "1 keto žemľa" },
                { t: "2 vajcia" },
                { t: "slanina", g: "40\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Krevety + zvyšok šalátu/papriky",
              items: [
                { t: "krevety", g: "250\u00a0g" },
                { t: "zvyšok šalátu / papriky" },
                { t: "+ majonéza" },
                { t: "1 vajce natvrdo" }
              ],
              tip: "Ak nie sú krevety: kuracie stehná 200\u00a0g (rozmrazené od stredy večer), tá istá príloha.",
              tipWarn: true
            }
          ],
          footerNote: "Bez večere, bez víkendu — len raňajky a obed."
        }
      ],
      recipe: {
        yield: "6 žemlí · nedeľa večer / Po ráno · 175\u00a0°C · 50–60\u00a0min · úplne vychladnúť",
        ingredients: [
          { g: "150\u00a0g", t: "mandľová múka (nie pšeničná)" },
          { g: "25\u00a0g", t: "psyllium (doma)" },
          { g: "~8\u00a0g", t: "prášok do pečiva" },
          { g: "~3\u00a0g", t: "soľ" },
          { g: "3", t: "bielka" },
          { t: "2 lyžičky jablčného octu (doma)" },
          { g: "200–230\u00a0ml", t: "horúca voda" }
        ],
        steps: [
          "Zmiešať suché suroviny (mandľová múka, psyllium, prášok, soľ).",
          "Pridať 3 bielka, 2 lyžičky jablčného octu a 200–230\u00a0ml horúcej vody — rýchlo vymiešať.",
          "Tvarovať 6 žemlí, piecť 50–60\u00a0min pri 175\u00a0°C.",
          "Nechať úplne vychladnúť — inak budú gumové."
        ]
      },
      leftovers: [
        { t: "1 žemľa" },
        { t: "zvyšok bryndze / eidamu" },
        { t: "slanina", g: "~40\u00a0g" },
        { t: "šunka", g: "~60\u00a0g" },
        { t: "kus kapusty" },
        { t: "otvorené kokosové mlieko" },
        { t: "kyslé uhorky" }
      ]
    },

    "2026-10-19": {
      id: "2026-10-19",
      storageKey: "keto-tyzden-2026-10-19",
      dayKey: "keto-tyzden-days-open-2026-10-19",
      label: "19. 10. – 23. 10. 2026",
      title: "Týždeň 19.–23.\u00a010.\u00a02026",
      foot: "Samuelov keto pack · 19.–23.\u00a010.\u00a02026 · v2 podľa reálneho nákupu",
      summary: {
        kcal: "12\u00a0700",
        macros: [
          { k: "P", v: "~945\u00a0g" },
          { k: "T", v: "~865\u00a0g" },
          { k: "S", v: "~97\u00a0g" },
          { k: "V", v: "~84\u00a0g" }
        ],
        note: "v2 podľa reálneho nákupu · Po–Št plné · Pia len R+O · bez Pia večere, bez víkendu · dokúp netreba",
        shake: "kokosové mlieko LEN nesladené + proteín + kakao + chia",
        shakePill: "Shake Po–Št"
      },
      shopTitle: "Nákup hotový — dokúp netreba",
      buyTitle: "Kúpené 19. 10. (reálne množstvá)",
      haveTitle: "Doma — mraznička, chladnička, pantrý",
      buy: [
        { key: "w1019v2-beef", text: "Hovädzie mleté", em: "len 300\u00a0g → Po večera (pizza)" },
        { key: "w1019v2-salmon", text: "Nórsky losos", em: "~500\u00a0g · spotreba 20. 10. → celý v utorok (O 250 + V 250)" },
        { key: "w1019v2-chicken", text: "Kuracie prsia", em: "800\u00a0g · spotreba 21.–22. 10. → St O 400 + Št O 400" },
        { key: "w1019v2-shrimp", text: "Krevety", em: "440\u00a0g (2×220\u00a0g) · spotreba 4. 11. → Po O 220 + Pia O 220" },
        { key: "w1019v2-eggs", text: "Vajcia", em: "18 ks · vychádza presne (žemle, pizza, raňajky)" },
        { key: "w1019v2-bacon", text: "Slanina", em: "2 balenia (~200\u00a0g použité, druhé balenie čiastočne ostane)" },
        { key: "w1019v2-ham", text: "Šunka", em: "~170\u00a0g použité" },
        { key: "w1019v2-butter", text: "Maslo" },
        { key: "w1019v2-bryndza", text: "Bryndza" },
        { key: "w1019v2-eidam", text: "Eidam" },
        { key: "w1019v2-broc", text: "Brokolica" },
        { key: "w1019v2-cabbage", text: "Kapusta", em: "veľká hlávka · tento týždeň ~600\u00a0g, zvyšok na budúci týždeň" },
        { key: "w1019v2-salad", text: "Šalát ľadový" },
        { key: "w1019v2-lemon", text: "Citróny" },
        { key: "w1019v2-almond", text: "Mandľová múka" }
      ],
      have: [
        { key: "w1019v2-have-steaks", text: "Hovädzie steaky v mrazničke (~200\u00a0g surové/ks) — 2 ks na St a Št večeru namiesto chýbajúceho mletého" },
        { key: "w1019v2-have-philly", text: "Philadelphia (Ut a Št ráno, do ~30\u00a0g)" },
        { key: "w1019v2-have-cream", text: "Kyslá smotana (Po obed a Št večera, do ~30\u00a0g)" },
        { key: "w1019v2-have-pickles", text: "Kyslé uhorky (chladnička)" },
        { key: "w1019v2-have-coco", text: "Kokosové mlieko LEN nesladené (shake)" },
        { key: "w1019v2-have-psyllium", text: "Psyllium" },
        { key: "w1019v2-have-acv", text: "Jablčný ocot" },
        { key: "w1019v2-have-protein", text: "Proteín, kakao, chia" },
        { key: "w1019v2-have-oil", text: "Olej / olivový olej / majonéza" },
        { key: "w1019v2-have-garlic", text: "Cesnak, soľ, oregano, prášok do pečiva" },
        { key: "w1019v2-have-tuna", text: "Tuniak 2× — tento týždeň sa nepočíta" }
      ],
      dont: [
        "dokúp netreba",
        "paprika (vypadla z receptov)",
        "ketomúka",
        "olivy",
        "huby",
        "cuketa"
      ],
      dontNote: "Plán v2 je prerobený podľa toho, čo si reálne kúpil 19. 10. — plnené papriky vypadli, pizza je bez papriky, tuniak sa nepočíta. Mleté je len 300\u00a0g (Po pizza), St a Št večer nahrádzajú hovädzie steaky z mrazničky. Kapustu tento týždeň minieš len ~600\u00a0g, zvyšok ostáva na budúci týždeň.",
      days: [
        {
          id: "po",
          name: "Pondelok",
          totals: "~2900 kcal · P220 · T205 · S25 · V20",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia na masle so slaninou a bryndzou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia na masle + 3 žĺtky od žemlí" },
                { t: "slanina", g: "60\u00a0g" },
                { t: "bryndza", g: "30\u00a0g" }
              ],
              tip: "3 žĺtky, ktoré ostanú z bielok na žemle, pridaj do dnešných vajec."
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Krevety na masle s cesnakom + restovaná kapusta",
              items: [
                { t: "krevety", g: "220\u00a0g" },
                { t: "maslo", g: "15\u00a0g" },
                { t: "cesnak" },
                { t: "kapusta restovaná", g: "200\u00a0g" },
                { t: "kyslá smotana", g: "30\u00a0g" },
                { t: "citrón" }
              ],
              tip: "Rozmrazovanie: krevety (1 balenie 220\u00a0g) daj do studenej vody ~15\u00a0min pred varením."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Mini keto pizza bez papriky",
              items: [
                { t: "cesto: mandľová múka", g: "~70\u00a0g" },
                { t: "+ psyllium + 1 vajce + soľ" },
                { t: "navrch hovädzie mleté", g: "300\u00a0g" },
                { t: "slanina", g: "40\u00a0g" },
                { t: "eidam", g: "60\u00a0g" },
                { t: "oregano / cesnak" },
                { t: "k tomu šalát + kyslé uhorky" }
              ],
              tip: "Celých 300\u00a0g mletého dnes — iné mleté tento týždeň nie je. Bez olív, húb a cukety."
            }
          ],
          shake: true
        },
        {
          id: "ut",
          name: "Utorok",
          totals: "~2850 kcal · P205 · T200 · S18 · V14",
          dayNote: "Losos má spotrebu 20. 10. — dnes celý (obed + večera).",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa s Philadelphiou + vajcia so šunkou",
              items: [
                { t: "1 keto žemľa" },
                { t: "Philadelphia", g: "25\u00a0g" },
                { t: "3 vajcia" },
                { t: "šunka", g: "100\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Losos na masle + brokolica + bryndza",
              items: [
                { t: "losos", g: "250\u00a0g" },
                { t: "maslo" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "bryndza", g: "40\u00a0g" },
                { t: "citrón" }
              ]
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Losos pečený s cesnakom + šalát",
              items: [
                { t: "losos", g: "250\u00a0g" },
                { t: "cesnak" },
                { t: "ľadový šalát" },
                { t: "majonéza", g: "25\u00a0g" },
                { t: "olivový olej" }
              ],
              tip: "Ak losos váži menej ako ~450\u00a0g: dnes večer pridaj 1 steak (~200\u00a0g) z mrazničky a vo štvrtok ostane steak v mrazničke. Večer prelož 1 steak z mrazničky do chladničky na stredu.",
              tipWarn: true
            }
          ],
          shake: true
        },
        {
          id: "st",
          name: "Streda",
          totals: "~2850 kcal · P215 · T185 · S22 · V20",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou a eidamom",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "slanina", g: "60\u00a0g" },
                { t: "eidam", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie prsia s cesnakom + brokolica zapečená s bryndzou",
              items: [
                { t: "kuracie prsia", g: "400\u00a0g" },
                { t: "maslo / olej + cesnak" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "bryndza navrch zapečená", g: "50\u00a0g" }
              ]
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Hovädzí steak + kapusta na slanine",
              items: [
                { t: "hovädzí steak (z mrazničky)", g: "~200\u00a0g" },
                { t: "maslo", g: "20\u00a0g" },
                { t: "kapusta restovaná na slanine", g: "200\u00a0g" },
                { t: "kyslé uhorky" }
              ],
              tip: "Steak rozmrazený od utorka večera v chladničke. Dnes večer prelož ďalší steak z mrazničky do chladničky na štvrtok."
            }
          ],
          shake: true
        },
        {
          id: "stv",
          name: "Štvrtok",
          totals: "~2850 kcal · P215 · T185 · S22 · V20",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa s Philadelphiou + vajcia so šunkou",
              items: [
                { t: "1 keto žemľa" },
                { t: "Philadelphia", g: "25\u00a0g" },
                { t: "3 vajcia" },
                { t: "šunka", g: "70\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie prsia + šalát s majonézou a eidamom",
              items: [
                { t: "kuracie prsia", g: "400\u00a0g" },
                { t: "ľadový šalát" },
                { t: "majonéza", g: "30\u00a0g" },
                { t: "eidam", g: "30\u00a0g" },
                { t: "citrón" }
              ],
              tip: "Kuracie prsia majú spotrebu 21. 10., do dnes (22. 10.) vydržia — zjedz ich dnes."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Hovädzí steak + kapusta + cesnakový dip",
              items: [
                { t: "hovädzí steak (z mrazničky)", g: "~200\u00a0g" },
                { t: "maslo" },
                { t: "kapusta", g: "200\u00a0g" },
                { t: "kyslá smotana s cesnakom (dip)", g: "30\u00a0g" }
              ],
              tip: "Steak rozmrazený od stredy večera v chladničke. Ak si v utorok pridal steak k lososovi, tento ostáva v mrazničke."
            }
          ],
          shake: true
        },
        {
          id: "pia",
          name: "Piatok",
          totals: "~1250 kcal · P90 · T90 · S10 · V10 · len R+O",
          light: true,
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "2 žemle + vajcia so slaninou",
              items: [
                { t: "2 keto žemle (posledné z dávky)" },
                { t: "2 vajcia" },
                { t: "slanina", g: "40\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Krevetový šalát",
              items: [
                { t: "krevety", g: "220\u00a0g" },
                { t: "zvyšok šalátu" },
                { t: "brokolica", g: "150\u00a0g" },
                { t: "majonéza", g: "25\u00a0g" },
                { t: "citrón" }
              ],
              tip: "Druhé balenie kreviet (220\u00a0g) rozmraz v studenej vode ~15\u00a0min."
            }
          ],
          footerNote: "Bez večere, bez víkendu — len raňajky a obed."
        }
      ],
      recipe: {
        yield: "6 žemlí · dnes (Po) · 175\u00a0°C · 50–60\u00a0min · úplne vychladnúť · spotreba všetkých 6 (Pia 2 ks)",
        ingredients: [
          { g: "150\u00a0g", t: "mandľová múka" },
          { g: "25\u00a0g", t: "psyllium (doma)" },
          { g: "~8\u00a0g", t: "prášok do pečiva" },
          { g: "~3\u00a0g", t: "soľ" },
          { g: "3", t: "bielka (žĺtky do pondelňajších raňajok)" },
          { t: "2 lyžičky jablčného octu (doma)" },
          { g: "200–230\u00a0ml", t: "horúca voda" }
        ],
        steps: [
          "Zmiešať suché suroviny (mandľová múka, psyllium, prášok, soľ).",
          "Pridať 3 bielka, 2 lyžičky jablčného octu a 200–230\u00a0ml horúcej vody — rýchlo vymiešať.",
          "Tvarovať 6 žemlí, piecť 50–60\u00a0min pri 175\u00a0°C.",
          "Nechať úplne vychladnúť — inak budú gumové."
        ]
      },
      leftovers: [
        { t: "kapusta — zvyšok hlávky na budúci týždeň (tento týždeň ~600\u00a0g)", g: "~1\u00a0kg+" },
        { t: "hovädzie steaky v mrazničke (všetky okrem 2)" },
        { t: "Philadelphia", g: "~100\u00a0g" },
        { t: "kyslá smotana", g: "~100+\u00a0g" },
        { t: "slanina (druhé balenie)", g: "~100+\u00a0g" },
        { t: "šunka", g: "~30\u00a0g" },
        { t: "bryndza", g: "~130\u00a0g" },
        { t: "eidam", g: "~90\u00a0g" },
        { t: "tuniak 2× (nepočítaný)" },
        { t: "kyslé uhorky, otvorené kokosové mlieko, citróny" }
      ]
    },
    "2026-10-26": {
      id: "2026-10-26",
      storageKey: "keto-tyzden-2026-10-26",
      dayKey: "keto-tyzden-days-open-2026-10-26",
      label: "26. 10. – 30. 10. 2026",
      title: "Týždeň 26.–30.\u00a010.\u00a02026",
      foot: "Samuelov keto pack · 26.–30.\u00a010.\u00a02026 · Kaufland Sekčov",
      driveUrl: "https://docs.google.com/spreadsheets/d/1cgBCn6Y0WYSug6dKJjIJDedjiBefvIuo9O52Lgv7c0o/edit",
      summary: {
        kcal: "13\u00a0350",
        macros: [
          { k: "P", v: "~1045\u00a0g" },
          { k: "T", v: "~975\u00a0g" },
          { k: "S", v: "~127\u00a0g" },
          { k: "V", v: "~100\u00a0g" }
        ],
        note: "Po–Št plné dni (tréning ~2800–3050 kcal, P nad 200\u00a0g) · Pia len R+O · bez Pia večere, bez víkendu · len Kaufland Sekčov",
        shake: "nesladené kokosové mlieko 200\u00a0ml + proteín + kakao + chia",
        shakePill: "Shake Po–Št"
      },
      macroTable: {
        rows: [
          { d: "Po 26. 10.", kcal: "~3050", p: "~235", t: "~220", s: "~30", v: "~20" },
          { d: "Ut 27. 10.", kcal: "~2800", p: "~225", t: "~210", s: "~22", v: "~18" },
          { d: "St 28. 10.", kcal: "~2950", p: "~225", t: "~210", s: "~35", v: "~22" },
          { d: "Št 29. 10.", kcal: "~3050", p: "~245", t: "~225", s: "~28", v: "~27" },
          { d: "Pia 30. 10. (R+O, bez shaku)", kcal: "~1500", p: "~115", t: "~110", s: "~12", v: "~13" }
        ],
        total: { d: "Týždeň", kcal: "~13\u00a0350", p: "~1045", t: "~975", s: "~127", v: "~100" },
        notes: [
          "Fallback (mleté 2×500\u00a0g + Št pizza zo steakov): Po ~3200 kcal / P~255 · St ~3200 / P~245 · Št ~2800 / P~255 · Ut a Pia bez zmeny → týždeň ~13\u00a0500 kcal, P~1100\u00a0g (T~990, S~127, V~100).",
          "Bez pretlaku: S o ~5\u00a0g nižšie v St a Št, inak bez zmeny. Náhrada shaku (kokosový krém / smotana + maslo): makrá približne rovnaké.",
          "Odhady bez váženia surovín. Všetky dni Po–Št nad 200\u00a0g bielkovín."
        ]
      },
      shopTitle: "Nákup — Kaufland Sekčov",
      buyTitle: "Kúpiť (leták 22.–28. 10. ≠ polica, over etiketu)",
      haveTitle: "Doma — míňať NAJSKÔR (nekupuje sa)",
      buy: [
        { key: "w1026-beef", text: "Mäso · Hovädzie mleté 100 %", em: "3×400\u00a0g z police (Po burger / St papriky / Št pizza) · NIE MIX bravč.+hov. 1\u00a0kg z letáku · fallback 2×500\u00a0g → Po 500 (bez majonézy), St 500, Št pizza zo 2 steakov z mrazničky" },
        { key: "w1026-salmon", text: "Mäso · Losos čerstvý filet", em: "~500\u00a0g vážený · akcia 1,39\u00a0€/100\u00a0g, do 28. 10. · Ut V 250 + St O 250" },
        { key: "w1026-chicken", text: "Mäso · Kuracie rezne stehenné / vykostené stehná", em: "~800\u00a0g · 4,69\u00a0€/kg · OVERIŤ, že NIE sú obaľované, inak stehná z police · Po O 400 + Ut O 400" },
        { key: "w1026-bacon", text: "Mäso · Slanina (oravská)", em: "2×100\u00a0g · 0,79\u00a0€/100\u00a0g" },
        { key: "w1026-ham", text: "Mäso · Šunka (strojová)", em: "2×100\u00a0g · 0,75\u00a0€/100\u00a0g" },
        { key: "w1026-eggs", text: "Mliečne · Vajcia", em: "20 ks (2×10) · vychádza presne" },
        { key: "w1026-eidam", text: "Mliečne · Eidam", em: "2×100\u00a0g · 0,69\u00a0€/100\u00a0g" },
        { key: "w1026-butter", text: "Mliečne · Maslo", em: "1×200\u00a0g LEN ak doma dochádza (akcia 1,05\u00a0€)" },
        { key: "w1026-broc", text: "Zelenina · Brokolica", em: "1×500\u00a0g · 2. kus z akcie 2 za 1 NEbrať" },
        { key: "w1026-pepper", text: "Zelenina · Paprika", em: "500\u00a0g balenie alebo 3 ks voľne · NIE 1\u00a0kg z akcie" },
        { key: "w1026-salad", text: "Zelenina · Ľadový šalát", em: "1 ks" },
        { key: "w1026-garlic", text: "Zelenina · Cesnak, citrón, kyslé uhorky", em: "len ak doma nie sú" },
        { key: "w1026-coco", text: "Špeciál · Kokosové mlieko NESLADENÉ", em: "2×400\u00a0ml · POVINNÉ · polica (ázijská/trvanlivá), etiketa len kokos + voda · „výrobok z kokosového mlieka“ nebrať · ak nie je → kokosový krém ~100\u00a0ml + voda, alebo bezlaktózová smotana ~50\u00a0ml + voda a v ten deň maslo +15\u00a0g k obedu" },
        { key: "w1026-almond", text: "Špeciál · Mandľová múka / mleté mandle", em: "~250\u00a0g · fallback lúpané mandle 3×100\u00a0g zomlieť" },
        { key: "w1026-paste", text: "Špeciál · Paradajkový pretlak", em: "1× 70\u00a0g plechovka/tuba · NIE 700\u00a0g · ak nie je → papriky aj pizza bez pretlaku (postup nižšie)" },
        { key: "w1026-bp", text: "Špeciál · Prášok do pečiva", em: "len ak dochádza" },
        { key: "w1026-coconut", text: "Voliteľne · Strúhaný kokos", em: "1 malé vrecko, ak chceš · do makier sa nepočíta" }
      ],
      have: [
        { key: "w1026-have-cabbage", text: "Kapusta (zvyšok veľkej hlávky) — Po O, Ut V šalát, Št O, Pia O" },
        { key: "w1026-have-steaks", text: "Hovädzie steaky v mrazničke (~200\u00a0g/ks) — 1 ks Št obed; pri fallbacku +2 ks na Št pizzu" },
        { key: "w1026-have-bryndza", text: "Bryndza ~130\u00a0g — Po R, Ut O, St R" },
        { key: "w1026-have-eidam", text: "Eidam ~90\u00a0g — Po V, Ut R (doraziť zvyšok)" },
        { key: "w1026-have-philly", text: "Philadelphia + kyslá smotana — malé dávky (Ut R, Št R, Št O); ak sú po dátume, vyhodiť" },
        { key: "w1026-have-bacon", text: "Slanina ~100\u00a0g — Po R + Po O" },
        { key: "w1026-have-tuna", text: "Tuniak 2 konzervy — až Pia obed" },
        { key: "w1026-have-shrimp", text: "Krevety v mrazničke — záloha" },
        { key: "w1026-have-pantry", text: "Kyslé uhorky, citróny, psyllium, proteín, kakao, chia, olivový olej, majonéza, jablčný ocot, korenie" }
      ],
      dont: [
        "kapusta",
        "bryndza",
        "Philadelphia",
        "kyslá smotana",
        "tuniak",
        "krevety",
        "MIX bravčové+hovädzie 1\u00a0kg",
        "paprika 1\u00a0kg",
        "pretlak 700\u00a0g",
        "2. brokolica z akcie",
        "olivy",
        "huby",
        "cuketa"
      ],
      dontNote: "Trvanlivosť: mleté na Št ZAMRAZIŤ hneď v pondelok (v stredu večer do chladničky). Mleté na St zamraziť, ak má spotrebu pred 28. 10. (v utorok večer do chladničky). Losos čo najčerstvejší, minúť do St obeda. Steak na Št obed (a pri fallbacku 2 steaky na pizzu) v stredu večer z mrazničky do chladničky.",
      days: [
        {
          id: "po",
          name: "Pondelok",
          totals: "~3050 kcal · P235 · T220 · S30 · V20",
          dayNote: "Ráno (alebo v Ne večer) upiecť 6 keto žemlí (recept nižšie). Mleté na štvrtok hneď zamraziť.",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so žĺtkami, slaninou a bryndzou",
              items: [
                { t: "1 keto žemľa" },
                { t: "2 vajcia + 3 žĺtky (od žemlí) na masle" },
                { t: "slanina", g: "40\u00a0g" },
                { t: "bryndza", g: "30\u00a0g" }
              ],
              tip: "Ak žemle ešte nie sú hotové: dnes bez žemle, šiesta žemľa sa zje v piatok."
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná s cesnakom + kapusta na slanine",
              items: [
                { t: "kuracie stehná na panvici s cesnakom", g: "400\u00a0g" },
                { t: "kapusta restovaná", g: "250\u00a0g" },
                { t: "slanina", g: "30\u00a0g" }
              ]
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Hovädzie burger placky + eidam + šalát",
              items: [
                { t: "hovädzie mleté (placky)", g: "400\u00a0g", hint: "fallback 500\u00a0g, potom bez majonézy" },
                { t: "eidam", g: "30\u00a0g" },
                { t: "ľadový šalát + 1 paprika + kyslé uhorky" },
                { t: "majonéza", g: "15\u00a0g" }
              ],
              tip: "Placky: 4 kusy, panvica stredne-vysoký ohrev, 4–5\u00a0min z každej strany, eidam navrch poslednú minútu pod pokrievkou."
            }
          ],
          shake: true
        },
        {
          id: "ut",
          name: "Utorok",
          totals: "~2800 kcal · P225 · T210 · S22 · V18",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa s Philadelphiou + vajcia so šunkou",
              items: [
                { t: "1 keto žemľa" },
                { t: "Philadelphia", g: "25\u00a0g" },
                { t: "3 vajcia" },
                { t: "šunka", g: "80\u00a0g" },
                { t: "eidam", g: "20\u00a0g" },
                { t: "kyslé uhorky" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Kuracie stehná + brokolica s bryndzou",
              items: [
                { t: "kuracie stehná", g: "400\u00a0g" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "maslo", g: "10\u00a0g" },
                { t: "bryndza navrch", g: "50\u00a0g" }
              ]
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Losos na masle + kapustový šalát",
              items: [
                { t: "losos na masle / pečený", g: "250\u00a0g" },
                { t: "kapusta nadrobno", g: "200\u00a0g" },
                { t: "majonéza", g: "30\u00a0g" },
                { t: "citrón, soľ" },
                { t: "olivový olej", g: "10\u00a0g" }
              ],
              tip: "Ak má mleté na stredu spotrebu pred 28. 10. a je zamrazené, dnes večer ho prelož do chladničky."
            }
          ],
          shake: true
        },
        {
          id: "st",
          name: "Streda",
          totals: "~2950 kcal · P225 · T210 · S35 · V22",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa + vajcia so slaninou a bryndzou",
              items: [
                { t: "1 keto žemľa" },
                { t: "3 vajcia" },
                { t: "slanina", g: "60\u00a0g" },
                { t: "bryndza", g: "30\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Losos + brokolica na masle",
              items: [
                { t: "losos", g: "250\u00a0g" },
                { t: "brokolica", g: "200\u00a0g" },
                { t: "maslo", g: "15\u00a0g" },
                { t: "citrón" }
              ]
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Zapekané plnené papriky bez ryže",
              items: [
                { t: "hovädzie mleté", g: "400\u00a0g", hint: "fallback 500\u00a0g" },
                { t: "3 papriky" },
                { t: "1 vajce + 2 strúčiky cesnaku" },
                { t: "paradajkový pretlak", g: "~35\u00a0g", hint: "½ konzervy; voliteľný" },
                { t: "eidam", g: "60\u00a0g" }
              ],
              tip: "Postup krok za krokom: 200\u00a0°C, 25\u00a0min prikryté + 10\u00a0min so syrom — recept nižšie. Dnes večer prelož z mrazničky do chladničky: mleté na Št pizzu + 1 steak na Št obed (pri fallbacku 3 steaky).",
              tipWarn: true
            }
          ],
          shake: true
        },
        {
          id: "stv",
          name: "Štvrtok",
          totals: "~3050 kcal · P245 · T225 · S28 · V27",
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "Žemľa s Philadelphiou + vajcia so šunkou",
              items: [
                { t: "1 keto žemľa" },
                { t: "Philadelphia", g: "25\u00a0g" },
                { t: "3 vajcia" },
                { t: "šunka", g: "70\u00a0g" },
                { t: "eidam", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Hovädzí steak + kapusta + cesnakový dip",
              items: [
                { t: "hovädzí steak (z mrazničky) na masle 10\u00a0g", g: "~200\u00a0g" },
                { t: "kapusta restovaná", g: "250\u00a0g" },
                { t: "kyslá smotana s cesnakom (dip)", g: "30\u00a0g" }
              ],
              tip: "Ak sú v mrazničke len 2 steaky a ideš cez fallback: namiesto steaku krevety z mrazničky ~220\u00a0g + maslo 20\u00a0g."
            },
            {
              tag: "v",
              tagLabel: "Večera",
              name: "Mini keto pizza s hovädzím",
              items: [
                { t: "cesto: mandľová múka 70\u00a0g + psyllium 10\u00a0g + 1 vajce" },
                { t: "hovädzie mleté", g: "400\u00a0g", hint: "fallback 2 steaky ~400\u00a0g na kocky" },
                { t: "paradajkový pretlak", g: "~35\u00a0g", hint: "druhá polovica; voliteľný" },
                { t: "eidam", g: "60\u00a0g" },
                { t: "cesnak, oregano" },
                { t: "k tomu ľadový šalát + kyslé uhorky" }
              ],
              tip: "Postup krok za krokom: 200\u00a0°C, korpus 10–12\u00a0min + s plnkou 8–10\u00a0min — recept nižšie.",
              tipWarn: true
            }
          ],
          shake: true
        },
        {
          id: "pia",
          name: "Piatok",
          totals: "~1500 kcal · P115 · T110 · S12 · V13 · len R+O",
          light: true,
          meals: [
            {
              tag: "r",
              tagLabel: "Raňajky",
              name: "2 žemle + vajcia so slaninou a šunkou",
              items: [
                { t: "2 keto žemle (posledné)" },
                { t: "2 vajcia" },
                { t: "slanina", g: "40\u00a0g" },
                { t: "šunka", g: "50\u00a0g" },
                { t: "eidam", g: "20\u00a0g" }
              ]
            },
            {
              tag: "o",
              tagLabel: "Obed",
              name: "Tuniakový šalát s vajcom a kapustou",
              items: [
                { t: "tuniak 2 konzervy (doma, scedené)" },
                { t: "2 vajcia natvrdo" },
                { t: "kapusta nadrobno", g: "150\u00a0g" },
                { t: "zvyšok ľadového šalátu" },
                { t: "majonéza", g: "30\u00a0g" },
                { t: "citrón + kyslé uhorky" }
              ]
            }
          ],
          footerNote: "Bez večere, bez víkendu — len raňajky a obed."
        }
      ],
      recipe: {
        yield: "6 žemlí · Po ráno (alebo Ne večer) · 175\u00a0°C · 50–60\u00a0min · úplne vychladnúť · v chladničke 4–5 dní",
        ingredients: [
          { g: "150\u00a0g", t: "jemná mandľová múka" },
          { g: "25\u00a0g", t: "psyllium (doma)" },
          { g: "~8\u00a0g", t: "prášok do pečiva" },
          { g: "~3\u00a0g", t: "soľ" },
          { g: "3", t: "bielka (žĺtky do pondelňajších raňajok)" },
          { t: "2 ČL jablčného octu (doma)" },
          { g: "200–230\u00a0ml", t: "horúca voda" },
          { t: "voliteľne sezam / rasca" }
        ],
        steps: [
          "Rúru predhriať na 175\u00a0°C (horný + dolný ohrev), plech vyložiť papierom.",
          "V mise zmiešať mandľovú múku, psyllium, prášok do pečiva a soľ.",
          "Pridať 3 bielka a ocot, krátko premiešať (žĺtky odložiť do chladničky na Po raňajky).",
          "Priliať horúcu vodu (najprv 200\u00a0ml) a rýchlo vymiesiť ~30\u00a0s; ak je cesto drobivé, prilievať do 230\u00a0ml. Nechať 2–3\u00a0min stáť.",
          "Navlhčenými rukami vytvarovať 6 žemlí, dať na plech, navrch voliteľne sezam/rasca.",
          "Piecť 50–60\u00a0min pri 175\u00a0°C, kým nie sú pevné a pri poklepe znejú duto.",
          "Nechať úplne vychladnúť na mriežke (inak budú gumové). V chladničke 4–5 dní."
        ]
      },
      extraRecipes: [
        {
          id: "papriky",
          title: "Zapekané plnené papriky bez ryže (St večera)",
          yield: "1 porcia · 200\u00a0°C · 25\u00a0min prikryté (pri 500\u00a0g mäsa 30\u00a0min) + 10\u00a0min so syrom",
          ingredients: [
            { g: "400\u00a0g", t: "hovädzie mleté (fallback 500\u00a0g)" },
            { g: "3", t: "papriky" },
            { g: "1", t: "vajce" },
            { g: "2", t: "strúčiky cesnaku" },
            { g: "~35\u00a0g", t: "paradajkový pretlak (½ konzervy 70\u00a0g)" },
            { g: "60\u00a0g", t: "eidam" },
            { t: "soľ, korenie, sladká paprika, oregano" },
            { g: "5\u00a0g", t: "maslo na misu" }
          ],
          steps: [
            "Rúru predhriať na 200\u00a0°C.",
            "Papriky prekrojiť pozdĺžne na polovice, vybrať jadrovník a semienka.",
            "V mise zmiešať mleté mäso, vajce, pretlačený cesnak, ~15\u00a0g pretlaku, soľ, korenie a sladkú papriku.",
            "Polovice paprík naplniť mäsom, uložiť do vymastenej zapekacej misy plnkou hore.",
            "Navrch rozotrieť zvyšok pretlaku (~20\u00a0g) zriedený 2 lyžicami vody; do misy podliať ~50\u00a0ml vody.",
            "Piecť 25\u00a0min pri 200\u00a0°C prikryté alobalom (pri 500\u00a0g mäsa 30\u00a0min), potom alobal dať dole.",
            "Posypať strúhaným eidamom 60\u00a0g a zapiecť ešte 10\u00a0min bez alobalu, kým syr nie je zlatý a šťava z mäsa číra.",
            "Nechať 5\u00a0min postáť, podávať s kyslými uhorkami."
          ],
          fallbacks: [
            "Bez pretlaku: v kroku 3 pridať navyše 1 ČL sladkej papriky + oregano, v kroku 5 len podliať ~70\u00a0ml vody (nič nerozotierať). Čas a teplota rovnaké."
          ]
        },
        {
          id: "pizza",
          title: "Mini keto pizza (Št večera)",
          yield: "1 veľká alebo 2 menšie · 200\u00a0°C · korpus 10–12\u00a0min + s plnkou 8–10\u00a0min",
          ingredients: [
            { g: "70\u00a0g", t: "mandľová múka" },
            { g: "10\u00a0g", t: "psyllium" },
            { g: "1", t: "vajce" },
            { t: "½ ČL prášku do pečiva + štipka soli" },
            { g: "~60\u00a0ml", t: "horúca voda" },
            { g: "400\u00a0g", t: "hovädzie mleté (fallback: 2 steaky ~400\u00a0g, rozmrazené, na malé kocky/prúžky)" },
            { g: "~35\u00a0g", t: "paradajkový pretlak (druhá polovica konzervy)" },
            { g: "1", t: "strúčik cesnaku" },
            { g: "60\u00a0g", t: "eidam" },
            { t: "oregano" }
          ],
          steps: [
            "Rúru predhriať na 200\u00a0°C, plech vyložiť papierom.",
            "Mäso pripraviť: mleté opiecť na suchej panvici ~8\u00a0min do rozsypania a zhnednutia, osoliť, okoreniť, pridať cesnak; odstaviť. (Fallback steaky: kocky opiecť na rozpálenej panvici s 5\u00a0g masla 3–4\u00a0min — len zatiahnuť, dopečú sa v rúre; osoliť, okoreniť, pridať cesnak.)",
            "Zmiešať mandľovú múku, psyllium, prášok do pečiva a soľ; pridať vajce a horúcu vodu, vymiesiť hladké cesto, 2\u00a0min nechať stáť.",
            "Cesto rozvaľkať medzi dvoma papiermi na pečenie na tenký plát (~3–4\u00a0mm) alebo na 2 menšie kruhy.",
            "Korpus predpiecť 10–12\u00a0min pri 200\u00a0°C, kým nie je na povrchu suchý.",
            "Korpus potrieť pretlakom, rozložiť mäso, posypať eidamom a oreganom.",
            "Dopiecť 8–10\u00a0min pri 200\u00a0°C, kým sa syr neroztopí a okraje nie sú zlaté (voliteľne 1–2\u00a0min gril).",
            "Nechať 3\u00a0min postáť, nakrájať. K tomu ľadový šalát + kyslé uhorky."
          ],
          fallbacks: [
            "Bez pretlaku (krok 6): korpus len potrieť 1 lyžicou olivového oleja s pretlačeným cesnakom a oreganom (biela pizza), potom mäso a eidam.",
            "Fallback steaky (ak si kúpil 2×500\u00a0g mletého): 2 steaky v stredu večer do chladničky, v kroku 2 len zatiahnuť 3–4\u00a0min, ostatné rovnaké."
          ]
        }
      ],
      tips: [
        "Pondelok: mleté na štvrtok hneď zamraziť. Mleté na stredu zamraziť, ak má spotrebu pred 28. 10.",
        "Utorok večer: (ak je zamrazené) mleté na stredu do chladničky.",
        "Streda večer: mleté na Št pizzu + 1 steak na Št obed z mrazničky do chladničky (pri fallbacku 3 steaky).",
        "Losos kúpiť čo najčerstvejší a minúť do stredy obeda.",
        "Philadelphia / kyslá smotana: ak sú po dátume, vyhodiť (v pláne len po 25–30\u00a0g).",
        "Vajcia presne 20 ks: žemle 3 bielka · Po 2 · Ut 3 · St 3 · Št 3 · Pia R 2 · Pia O 2 · papriky 1 · pizza 1."
      ],
      leftovers: [
        { t: "kapusta — zvyšok hlávky", g: "~0–300\u00a0g" },
        { t: "hovädzie steaky v mrazničke (všetky okrem 1; pri fallbacku okrem 3)" },
        { t: "krevety v mrazničke (ak sa nepoužili ako záloha)" },
        { t: "Philadelphia", g: "~50\u00a0g" },
        { t: "kyslá smotana (ak ešte dobrá)", g: "~50\u00a0g" },
        { t: "bryndza", g: "~20\u00a0g" },
        { t: "eidam", g: "~20\u00a0g" },
        { t: "slanina", g: "~30\u00a0g" },
        { t: "mandľová múka", g: "~30\u00a0g" },
        { t: "maslo (ak sa kupovalo), kyslé uhorky, citróny" },
        { t: "1 paprika len ak bolo v balení 4+ ks; pretlak a kokosové mlieko sa minú celé" }
      ]
    }

  };

  /* ===== Helpers ===== */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function loadJson(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveJson(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
      /* quota / private */
    }
  }

  var DEFAULT_SEEN_KEY = "keto-tyzden-default-seen";

  function getSelectedWeekId() {
    try {
      if (localStorage.getItem(DEFAULT_SEEN_KEY) !== DEFAULT_WEEK) {
        localStorage.setItem(DEFAULT_SEEN_KEY, DEFAULT_WEEK);
        localStorage.setItem(SELECT_KEY, DEFAULT_WEEK);
        return DEFAULT_WEEK;
      }
      var stored = localStorage.getItem(SELECT_KEY);
      if (stored && WEEKS[stored]) return stored;
    } catch (e) {
      /* ignore */
    }
    return DEFAULT_WEEK;
  }

  function setSelectedWeekId(id) {
    try {
      localStorage.setItem(SELECT_KEY, id);
    } catch (e) {
      /* ignore */
    }
  }

  /* ===== Render ===== */
  function renderItem(it) {
    var html = esc(it.t);
    if (it.g) html += " <strong>" + esc(it.g) + "</strong>";
    if (it.hint) html += ' <span class="hint">' + esc(it.hint) + "</span>";
    if (it.after) html += it.after; /* trusted static markup from our data */
    return "<li>" + html + "</li>";
  }

  function renderMeal(m) {
    var tipClass = m.tipWarn ? "tip tip--warn" : "tip";
    var tipHtml = m.tip
      ? '<p class="' + tipClass + '" role="note"><span class="tip__label">Tip</span> ' + esc(m.tip) + "</p>"
      : "";
    return (
      '<div class="meal">' +
      '<div class="meal__tag meal__tag--' + esc(m.tag) + '">' + esc(m.tagLabel) + "</div>" +
      '<h3 class="meal__name">' + esc(m.name) + "</h3>" +
      '<ul class="meal__grams">' +
      m.items.map(renderItem).join("") +
      "</ul>" +
      tipHtml +
      "</div>"
    );
  }

  function renderDay(d) {
    var cls = "day" + (d.light ? " day--light" : "");
    var note = d.dayNote ? '<p class="day-note">' + esc(d.dayNote) + "</p>" : "";
    var shake = d.shake
      ? '<p class="shake-line"><span class="pill pill--sm">+ shake</span> kokosové mlieko · proteín · kakao · chia</p>'
      : "";
    var footer = d.footerNote
      ? '<p class="day-note day-note--muted">' + esc(d.footerNote) + "</p>"
      : "";
    return (
      '<article id="' + esc(d.id) + '" class="' + cls + '" data-day="' + esc(d.id) + '">' +
      '<button type="button" class="day__toggle" aria-expanded="true" aria-controls="' + esc(d.id) + '-body" id="' + esc(d.id) + '-btn">' +
      '<span class="day__name">' + esc(d.name) + "</span>" +
      '<span class="day__totals">' + esc(d.totals) + "</span>" +
      '<span class="day__chev" aria-hidden="true"></span>' +
      "</button>" +
      '<div class="day__body" id="' + esc(d.id) + '-body" role="region" aria-labelledby="' + esc(d.id) + '-btn">' +
      note +
      d.meals.map(renderMeal).join("") +
      shake +
      footer +
      "</div></article>"
    );
  }

  function renderCheck(item) {
    var em = item.em ? " <em>" + esc(item.em) + "</em>" : "";
    return (
      "<li><label class=\"check\">" +
      '<input type="checkbox" data-key="' + esc(item.key) + '" />' +
      '<span class="check__box" aria-hidden="true"></span>' +
      '<span class="check__text">' + esc(item.text) + em + "</span>" +
      "</label></li>"
    );
  }

  /* ===== Render Standalone Shopping List ===== */
  function renderShoppingList() {
    var items = SHOPPING_LIST.items;
    var isEmpty = items.length === 0;

    var content;
    if (isEmpty) {
      content =
        '<p class="shop-empty">Zoznam je prázdny. Pridaj položky do <code>SHOPPING_LIST.items</code> v app.js.</p>';
    } else {
      content =
        '<ul class="checklist' + (items.length > 4 ? " checklist--grid" : "") + '" data-store="standalone">' +
        items.map(renderCheck).join("") +
        "</ul>";
    }

    return (
      '<section class="card card--shop" aria-labelledby="list-title">' +
      '<div class="card__head">' +
      '<h2 id="list-title">Nákupný zoznam</h2>' +
      '<button type="button" class="btn-ghost" id="reset-list-checks" title="Odškrtnúť všetko">Reset</button>' +
      "</div>" +
      '<div class="shop-block">' + content + "</div>" +
      "</section>" +
      '<footer class="site-foot">' +
      "<p>Samostatný nákupný zoznam</p>" +
      '<p class="site-foot__sub">Zaškrtnutia sa pamätajú v prehliadači. Položky edituj v app.js.</p>' +
      "</footer>"
    );
  }

  function bindShoppingList() {
    var state = loadJson(SHOPPING_LIST.storageKey);
    var boxes = document.querySelectorAll('input[type="checkbox"][data-key]');

    boxes.forEach(function (input) {
      var key = input.getAttribute("data-key");
      if (state[key]) input.checked = true;
      input.addEventListener("change", function () {
        state[key] = input.checked;
        saveJson(SHOPPING_LIST.storageKey, state);
      });
    });

    var resetBtn = document.getElementById("reset-list-checks");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        boxes.forEach(function (input) {
          input.checked = false;
          state[input.getAttribute("data-key")] = false;
        });
        saveJson(SHOPPING_LIST.storageKey, state);
      });
    }
  }

  function renderWeek(week) {
    var s = week.summary;
    var macros = s.macros
      .map(function (m) {
        return "<span><b>" + esc(m.k) + "</b> " + esc(m.v) + "</span>";
      })
      .join("");

    var buyBlock =
      '<div class="shop-block">' +
      '<h3 class="shop-block__title shop-block__title--buy">' + esc(week.buyTitle) + "</h3>" +
      '<ul class="checklist' + (week.buy.length > 4 ? " checklist--grid" : "") + '" data-store="buy">' +
      week.buy.map(renderCheck).join("") +
      "</ul></div>";

    var haveBlock =
      '<div class="shop-block">' +
      '<h3 class="shop-block__title">' + esc(week.haveTitle) + "</h3>" +
      '<ul class="checklist checklist--grid" data-store="have">' +
      week.have.map(renderCheck).join("") +
      "</ul></div>";

    var dontBlock =
      '<div class="shop-block shop-block--dont">' +
      '<h3 class="shop-block__title">Nekupovať</h3>' +
      '<ul class="dont-list">' +
      week.dont.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul>" +
      (week.dontNote ? '<p class="shop-note">' + esc(week.dontNote) + "</p>" : "") +
      "</div>";

    var recipeIng = week.recipe.ingredients
      .map(function (i) {
        if (i.g) return "<li><strong>" + esc(i.g) + "</strong> " + esc(i.t) + "</li>";
        return "<li>" + esc(i.t) + "</li>";
      })
      .join("");
    var recipeSteps = week.recipe.steps
      .map(function (st) { return "<li>" + esc(st) + "</li>"; })
      .join("");

    function renderRecipeCard(r) {
      var ing = (r.ingredients || []).map(function (i) {
        if (i.g) return "<li><strong>" + esc(i.g) + "</strong> " + esc(i.t) + "</li>";
        return "<li>" + esc(i.t) + "</li>";
      }).join("");
      var steps = (r.steps || []).map(function (st) { return "<li>" + esc(st) + "</li>"; }).join("");
      var fb = (r.fallbacks || []).map(function (f) {
        return '<p class="tip tip--warn" role="note"><span class="tip__label">Fallback</span> ' + esc(f) + "</p>";
      }).join("");
      return (
        '<section id="' + esc(r.id) + '" class="card card--recipe" aria-labelledby="' + esc(r.id) + '-title">' +
        '<h2 id="' + esc(r.id) + '-title">' + esc(r.title) + "</h2>" +
        (r.yield ? '<p class="recipe__yield">' + esc(r.yield) + "</p>" : "") +
        '<ul class="recipe__ing">' + ing + "</ul>" +
        '<ol class="recipe__steps">' + steps + "</ol>" +
        fb +
        "</section>"
      );
    }
    var extraRecipes = (week.extraRecipes || []).map(renderRecipeCard).join("");

    var macroTableHtml = "";
    if (week.macroTable) {
      var mt = week.macroTable;
      var row = function (r, isTotal) {
        var tag = isTotal ? "th" : "td";
        return "<tr" + (isTotal ? ' class="macro-table__total"' : "") + ">" +
          "<" + tag + ' scope="row">' + esc(r.d) + "</" + tag + ">" +
          "<td>" + esc(r.kcal) + "</td><td>" + esc(r.p) + "</td><td>" + esc(r.t) + "</td><td>" + esc(r.s) + "</td><td>" + esc(r.v) + "</td></tr>";
      };
      macroTableHtml =
        '<section id="makra" class="card" aria-labelledby="makra-title">' +
        '<h2 id="makra-title">Makrá — denne + týždeň</h2>' +
        '<div class="macro-table__wrap"><table class="macro-table">' +
        "<thead><tr><th>Deň</th><th>kcal</th><th>P (g)</th><th>T (g)</th><th>S (g)</th><th>V (g)</th></tr></thead>" +
        "<tbody>" + mt.rows.map(function (r) { return row(r, false); }).join("") + "</tbody>" +
        (mt.total ? "<tfoot>" + row(mt.total, true) + "</tfoot>" : "") +
        "</table></div>" +
        (mt.notes || []).map(function (n) { return '<p class="shop-note">' + esc(n) + "</p>"; }).join("") +
        "</section>";
    }

    var tipsHtml = week.tips && week.tips.length
      ? '<section id="trvanlivost" class="card" aria-labelledby="trvanlivost-title">' +
        '<h2 id="trvanlivost-title">Trvanlivosť a príprava</h2>' +
        '<ul class="parents-list">' + week.tips.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        "</section>"
      : "";

    var driveHtml = week.driveUrl
      ? '<p class="shop-note"><a href="' + esc(week.driveUrl) + '" target="_blank" rel="noopener">Checklist v Google Sheets (Drive) ↗</a></p>'
      : "";

    var leftovers = week.leftovers
      .map(function (i) {
        var html = esc(i.t);
        if (i.g) html += " <strong>" + esc(i.g) + "</strong>";
        return "<li>" + html + "</li>";
      })
      .join("");

    return (
      '<section class="summary" aria-labelledby="summary-title">' +
      '<h2 id="summary-title" class="sr-only">Súhrn týždňa</h2>' +
      '<div class="summary__grid">' +
      '<div class="summary__stat summary__stat--kcal">' +
      '<span class="summary__label">Týždeň</span>' +
      "<strong>~" + s.kcal + "</strong>" +
      '<span class="summary__unit">kcal</span>' +
      "</div>" +
      '<div class="summary__macros" aria-label="Makrá týždňa">' + macros + "</div>" +
      '<p class="summary__note">' + esc(s.note) + "</p>" +
      '<p class="summary__shake"><span class="pill">' + esc(s.shakePill) + "</span> " + esc(s.shake) + "</p>" +
      "</div></section>" +

      '<section id="nakup" class="card card--shop" aria-labelledby="nakup-title">' +
      '<div class="card__head">' +
      '<h2 id="nakup-title">' + esc(week.shopTitle) + "</h2>" +
      '<button type="button" class="btn-ghost" id="reset-checks" title="Odškrtnúť všetko">Reset</button>' +
      "</div>" +
      driveHtml + buyBlock + haveBlock + dontBlock +
      "</section>" +

      macroTableHtml +

      '<section class="days" aria-label="Dni týždňa">' +
      week.days.map(renderDay).join("") +
      "</section>" +

      '<section id="zemle" class="card card--recipe" aria-labelledby="zemle-title">' +
      '<h2 id="zemle-title">Keto žemle</h2>' +
      '<p class="recipe__yield">' + esc(week.recipe.yield) + "</p>" +
      '<ul class="recipe__ing">' + recipeIng + "</ul>" +
      '<ol class="recipe__steps">' + recipeSteps + "</ol>" +
      "</section>" +

      extraRecipes +
      tipsHtml +

      '<section id="zvysky" class="card card--parents" aria-labelledby="zvysky-title">' +
      '<h2 id="zvysky-title">Zvyšky pre rodičov</h2>' +
      '<ul class="parents-list">' + leftovers + "</ul>" +
      "</section>" +

      '<footer class="site-foot">' +
      "<p>" + esc(week.foot) + "</p>" +
      '<p class="site-foot__sub">Lokálne úložisko: zaškrtnutia nákupu sa pamätajú v prehliadači (samostatne pre každý týždeň).</p>' +
      "</footer>"
    );
  }

  /* ===== Bind interactions for current week ===== */
  function bindWeek(week) {
    var state = loadJson(week.storageKey);
    var boxes = document.querySelectorAll('input[type="checkbox"][data-key]');

    boxes.forEach(function (input) {
      var key = input.getAttribute("data-key");
      if (state[key]) input.checked = true;
      input.addEventListener("change", function () {
        state[key] = input.checked;
        saveJson(week.storageKey, state);
      });
    });

    var resetBtn = document.getElementById("reset-checks");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        boxes.forEach(function (input) {
          input.checked = false;
          state[input.getAttribute("data-key")] = false;
        });
        saveJson(week.storageKey, state);
      });
    }

    var dayState = loadJson(week.dayKey);
    var toggles = document.querySelectorAll(".day__toggle");
    toggles.forEach(function (btn) {
      var day = btn.closest(".day");
      var id = day && day.getAttribute("data-day");
      if (!id) return;
      if (Object.prototype.hasOwnProperty.call(dayState, id)) {
        btn.setAttribute("aria-expanded", dayState[id] ? "true" : "false");
      }
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        dayState[id] = !open;
        saveJson(week.dayKey, dayState);
      });
    });
  }

  var JUMP_SHORT = {
    po: "Po",
    ut: "Ut",
    st: "St",
    stv: "Št",
    pia: "Pia",
    ne: "Ne"
  };

  function updateJumpNav(week) {
    var jumpNav = document.getElementById("jump-nav");
    if (!jumpNav || !week) return;
    var parts = ['<a href="#nakup">Nákup</a>'];
    (week.days || []).forEach(function (d) {
      var short = JUMP_SHORT[d.id] || (d.name ? d.name.slice(0, 2) : d.id);
      parts.push('<a href="#' + esc(d.id) + '">' + esc(short) + "</a>");
    });
    parts.push('<a href="#air-fryer-recepty">Air fryer</a>');
    jumpNav.innerHTML = parts.join("\n        ");
  }

  function showWeek(id) {
    var week = WEEKS[id];
    if (!week) return;
    setSelectedWeekId(id);

    var titleEl = document.getElementById("week-title");
    if (titleEl) titleEl.innerHTML = week.title;

    document.title = "Keto týždeň · " + week.label;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Samuelov keto týždenný meal pack — " + week.label);

    updateJumpNav(week);

    var root = document.getElementById("app-root");
    root.innerHTML = renderWeek(week);
    bindWeek(week);

    var sel = document.getElementById("week-select");
    if (sel && sel.value !== id) sel.value = id;
  }

  function showShoppingListView() {
    var titleEl = document.getElementById("week-title");
    if (titleEl) titleEl.innerHTML = "Nákupný zoznam";

    document.title = "Nákupný zoznam";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Samostatný nákupný zoznam");

    var root = document.getElementById("app-root");
    root.innerHTML = renderShoppingList();
    bindShoppingList();
  }

  /* ===== View switching ===== */
  function getView() {
    try {
      var v = localStorage.getItem(VIEW_KEY);
      return v === "list" ? "list" : "week";
    } catch (e) {
      return "week";
    }
  }

  function setView(v) {
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch (e) {
      /* ignore */
    }
  }

  function updateNavActive(view) {
    var weekTab = document.getElementById("nav-week");
    var listTab = document.getElementById("nav-list");
    if (weekTab) weekTab.classList.toggle("nav__tab--active", view === "week");
    if (listTab) listTab.classList.toggle("nav__tab--active", view === "list");
  }

  function updateHeaderForView(view) {
    var weekPicker = document.querySelector(".week-picker");
    var jumpNav = document.getElementById("jump-nav");
    if (view === "list") {
      if (weekPicker) weekPicker.style.display = "none";
      if (jumpNav) jumpNav.style.display = "none";
    } else {
      if (weekPicker) weekPicker.style.display = "";
      if (jumpNav) jumpNav.style.display = "";
    }
  }

  function switchToView(view) {
    setView(view);
    updateNavActive(view);
    updateHeaderForView(view);
    if (view === "list") {
      showShoppingListView();
    } else {
      showWeek(getSelectedWeekId());
    }
  }

  function initSelect() {
    var sel = document.getElementById("week-select");
    if (!sel) return;
    sel.innerHTML = WEEK_ORDER.map(function (id) {
      var w = WEEKS[id];
      return '<option value="' + esc(id) + '">' + esc(w.label) + "</option>";
    }).join("");
    sel.value = getSelectedWeekId();
    sel.addEventListener("change", function () {
      showWeek(sel.value);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initNav() {
    var weekTab = document.getElementById("nav-week");
    var listTab = document.getElementById("nav-list");

    if (weekTab) {
      weekTab.addEventListener("click", function (e) {
        e.preventDefault();
        switchToView("week");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    if (listTab) {
      listTab.addEventListener("click", function (e) {
        e.preventDefault();
        switchToView("list");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* Migrate old day-open key once (week 1) */
  try {
    var legacyDay = localStorage.getItem("keto-tyzden-days-open");
    if (legacyDay && !localStorage.getItem("keto-tyzden-days-open-2026-09-21")) {
      localStorage.setItem("keto-tyzden-days-open-2026-09-21", legacyDay);
    }
  } catch (e) {
    /* ignore */
  }

  initSelect();
  initNav();
  var currentView = getView();
  updateNavActive(currentView);
  updateHeaderForView(currentView);
  if (currentView === "list") {
    showShoppingListView();
  } else {
    showWeek(getSelectedWeekId());
  }

  /* Re-apply #anchor after dynamic render (e.g. #air-fryer-recepty below the week) */
  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      setTimeout(function () { target.scrollIntoView(); }, 0);
    }
  }
})();
