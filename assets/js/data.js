// ============================================================
// ELITE SARDINIA HOMES — Data Store
// ============================================================
// HOW TO ADD A NEW PROPERTY:
//   1. Choose a slug (lowercase, hyphens only): e.g. "porto-cervo-villa"
//   2. Create folder: assets/images/properties/<slug>/
//   3. Add photos with clean names: cover.png, pool.jpg, interior.jpg, etc.
//   4. (Optional) Add PDFs: assets/docs/<slug>/
//   5. Copy the property object below, paste it at the END of PROPERTIES array
//   6. Update all fields (id must match the folder name)
//   7. Commit & push — GitHub Actions deploys in ~60 seconds
// ============================================================

const SITE_CONFIG = {
  agencyName: "Elite Sardinia Homes",
  tagline: "Ville Esclusive nel Cuore della Gallura",
  taglineEn: "Exclusive Villas in the Heart of Gallura",
  email: "elitesardiniahomes@gmail.com",
  phone: "+39 392 059 1857",
  phonePlain: "+393920591857",
  whatsapp: "393920591857", // E.164 without + for wa.me links
  ownerName: "Giovanni Del Fonso",
  location: "Sardegna, Italia — Area Gallura",
  socialInstagram: "",
  socialFacebook: "",
};

const PROPERTIES = [
  {
    // ── IDENTITY ───────────────────────────────────────────
    id: "via-ariosto",          // must match folder: assets/images/properties/via-ariosto/
    status: "available",        // "available" | "sold" | "reserved"
    featured: true,

    // ── NAMES & LOCATION ───────────────────────────────────
    name: "Villa Via Ariosto",
    subtitle: "Golfo Aranci, Gallura",
    location: {
      address: "Via Ariosto",
      city: "Golfo Aranci",
      area: "Gallura",
      region: "Sardegna",
      country: "Italia",
    },

    // ── PRICE ──────────────────────────────────────────────
    price: {
      display: "Su Richiesta",  // shown to the user; use "€ 1.200.000" for fixed price
      value: null,              // numeric value in EUR, or null for "on request"
    },

    // ── SPECS ──────────────────────────────────────────────
    specs: {
      bedrooms: 4,
      bathrooms: 3,
      sqm: 280,           // interior surface m²
      sqmGarden: 500,     // garden/outdoor m²
      floors: 3,          // including underground level
      pool: true,
      parking: true,
      seaview: true,
    },

    // ── DESCRIPTIONS ───────────────────────────────────────
    description: {
      short: "Villa di pregio con piscina privata e vista panoramica sul mare di Golfo Aranci.",
      long: `Elegante residenza situata in una delle zone più esclusive di Golfo Aranci, nel cuore della Gallura.
La villa si sviluppa su tre livelli, incluso un piano interrato, e offre spazi generosi e rifiniti con materiali di alta qualità.
All'esterno, una lussuosa piscina privata si affaccia su un giardino curato, con vista panoramica sul Golfo di Olbia e sull'Arcipelago della Maddalena.
L'interno è caratterizzato da ambienti luminosi, finiture ricercate e una distribuzione degli spazi pensata per il comfort e la riservatezza.
Una proprietà rara nel suo genere, ideale come residenza principale o dimora di vacanza di alto livello.`,
    },

    // ── FEATURES ───────────────────────────────────────────
    features: [
      "Piscina privata",
      "Vista panoramica sul mare",
      "Giardino privato e terrazza attico",
      "Tre livelli con piano interrato",
      "Finiture di alta qualità",
      "Accesso carrabile privato",
      "Posizione esclusiva a Golfo Aranci",
    ],

    // ── IMAGES ─────────────────────────────────────────────
    // First image = cover card image. All paths relative to site root.
    images: [
      "assets/images/properties/via-ariosto/cover.png",
      "assets/images/properties/via-ariosto/exterior-front.png",
      "assets/images/properties/via-ariosto/exterior-side.png",
      "assets/images/properties/via-ariosto/pool-2.png",
      "assets/images/properties/via-ariosto/interior-living.png",
      "assets/images/properties/via-ariosto/garden-penthouse.png",
    ],
    architecturalImages: [
      "assets/images/properties/via-ariosto/elevations.jpg",
      "assets/images/properties/via-ariosto/sections.png",
    ],

    // ── DOCUMENTS ──────────────────────────────────────────
    documents: [
      { label: "Pianta Piano Secondo", file: "assets/docs/via-ariosto/pianta-piano-secondo.pdf" },
      { label: "Pianta Copertura",     file: "assets/docs/via-ariosto/pianta-copertura.pdf" },
      { label: "Capitolato",           file: "assets/docs/via-ariosto/capitolato.pdf" },
    ],

    // ── CONTACT PRE-FILL ───────────────────────────────────
    contactSubject: "Richiesta informazioni — Villa Via Ariosto, Golfo Aranci",
  },
];
