(function () {
  "use strict";

  /* ===== Weeks data (newest first in ORDER) ===== */
  var DEFAULT_WEEK = "2026-10-04";
  var WEEK_ORDER = ["2026-10-04", "2026-09-28", "2026-09-21"];
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

  function getSelectedWeekId() {
    try {
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
      buyBlock + haveBlock + dontBlock +
      "</section>" +

      '<section class="days" aria-label="Dni týždňa">' +
      week.days.map(renderDay).join("") +
      "</section>" +

      '<section id="zemle" class="card card--recipe" aria-labelledby="zemle-title">' +
      '<h2 id="zemle-title">Keto žemle</h2>' +
      '<p class="recipe__yield">' + esc(week.recipe.yield) + "</p>" +
      '<ul class="recipe__ing">' + recipeIng + "</ul>" +
      '<ol class="recipe__steps">' + recipeSteps + "</ol>" +
      "</section>" +

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
})();
