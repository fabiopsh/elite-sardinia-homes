# Elite Sardinia Homes

Landing page per **Elite Sardinia Homes** — ville di lusso in Gallura, Sardegna.

Sito statico (HTML/CSS/JS vanilla) pubblicato su **GitHub Pages**.

---

## Sviluppo locale

Nessun build step richiesto. Apri direttamente `index.html` nel browser.

---

## Aggiungere una nuova proprietà

1. **Scegli uno slug** — lowercase, solo trattini, senza spazi o accenti
   - Esempio: `porto-cervo-villa`, `olbia-penthouse`

2. **Crea la cartella immagini**
   ```
   assets/images/properties/<slug>/
   ```

3. **Copia le foto** con nomi semantici senza spazi:

   | Nome file         | Contenuto                  |
   |-------------------|----------------------------|
   | `cover.png`       | Foto principale (obbligatoria) |
   | `exterior-front.jpg` | Facciata frontale         |
   | `pool.jpg`        | Piscina                    |
   | `living-room.jpg` | Soggiorno                  |
   | `garden.jpg`      | Giardino/esterno           |
   | `elevations.jpg`  | Prospetti architettonici   |

4. **(Opzionale) Copia PDF** in `assets/docs/<slug>/`

5. **Apri `assets/js/data.js`** e copia l'oggetto proprietà esistente dentro l'array `PROPERTIES`:

   ```js
   {
     id: "<slug>",               // deve corrispondere al nome cartella
     status: "available",        // "available" | "sold" | "reserved"
     featured: true,
     name: "Nome Villa",
     subtitle: "Città, Gallura",
     location: {
       city: "Città",
       area: "Gallura",
       region: "Sardegna",
       country: "Italia",
     },
     price: { display: "€ 1.200.000", value: 1200000 },
     specs: { bedrooms: 4, bathrooms: 3, sqm: 280, pool: true, seaview: true },
     description: {
       short: "Breve descrizione.",
       long: `Descrizione completa...`,
     },
     features: ["Caratteristica 1", "Caratteristica 2"],
     images: [
       "assets/images/properties/<slug>/cover.png",
       "assets/images/properties/<slug>/pool.jpg",
     ],
     architecturalImages: [
       "assets/images/properties/<slug>/elevations.jpg",
     ],
     documents: [
       { label: "Planimetria", file: "assets/docs/<slug>/planimetria.pdf" },
     ],
     contactSubject: "Richiesta informazioni — Nome Villa, Città",
   },
   ```

6. **Commit e push** su `main` → GitHub Actions pubblica automaticamente in ~60 secondi.

---

## Struttura file

```
elite-sardinia-homes/
├── index.html                    ← pagina unica
├── assets/
│   ├── css/style.css             ← tutti gli stili
│   ├── js/
│   │   ├── data.js               ← ⚠ modifica qui per aggiungere proprietà
│   │   ├── main.js               ← navbar, animazioni, form
│   │   ├── property.js           ← cards e modal dettaglio
│   │   └── gallery.js            ← lightbox foto
│   ├── images/
│   │   ├── logo/
│   │   └── properties/
│   └── docs/
├── .github/workflows/deploy.yml  ← deploy automatico GitHub Pages
└── documenti/                    ← asset originali (non pubblicati nel sito)
```

---

## Deploy (GitHub Pages)

1. Vai su **Settings → Pages** del repository
2. Seleziona **Source: GitHub Actions**
3. Ogni push su `main` fa partire il deploy automaticamente
4. Il sito sarà disponibile su `https://<username>.github.io/elite-sardinia-homes/`

---

## Contatti

- Email: elitesardiniahomes@gmail.com
- Telefono: +39 392 059 1857
