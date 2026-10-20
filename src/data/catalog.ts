export type BranchId = "parana" | "oroverde";

export type Branch = {
  id: BranchId;
  name: string;
  address: string;
  city: string;
  phone: string;
  phoneHref: string;
  wa: string;
  maps: string;
  embed: string;
};

export const branches: Branch[] = [
  {
    id: "parana",
    name: "Paraná",
    address: "Av. de las Américas 2705",
    city: "Paraná, Entre Ríos",
    phone: "+54 9 343 612-4634",
    phoneHref: "tel:+5493436124634",
    wa: "5493436124634",
    maps: "https://www.google.com/maps/search/?api=1&query=Avenida+de+las+Am%C3%A9ricas+2705,+Paran%C3%A1,+Entre+R%C3%ADos",
    embed:
      "https://maps.google.com/maps?q=Avenida+de+las+Am%C3%A9ricas+2705,+Paran%C3%A1,+Entre+R%C3%ADos&z=16&hl=es&output=embed",
  },
  {
    id: "oroverde",
    name: "Oro Verde",
    address: "Los Zorzales 304, esq. Los Eucaliptos",
    city: "Oro Verde, Entre Ríos",
    phone: "+54 9 343 505-0098",
    phoneHref: "tel:+5493435050098",
    wa: "5493435050098",
    maps: "https://www.google.com/maps/search/?api=1&query=Los+Zorzales+304,+Oro+Verde,+Entre+R%C3%ADos",
    embed:
      "https://maps.google.com/maps?q=Los+Zorzales+304,+Oro+Verde,+Entre+R%C3%ADos&z=16&hl=es&output=embed",
  },
];

export const socials = {
  instagram: "https://www.instagram.com/nattul.almacennatural/",
  facebook: "https://www.facebook.com/profile.php?id=61560636547815",
  email: "naturalmente.diet4@gmail.com",
};

export type Product = {
  id: string;
  name: string;
  note: string;
  image?: string;
  tags: string[];
  gramsOptions: number[];
  defaultGrams: number;
};

export type Category = {
  id: string;
  index: string;
  name: string;
  kicker: string;
  description: string;
  products: Product[];
};

const bulk = [100, 250, 500, 1000];

export const categories: Category[] = [
  {
    id: "frutos",
    index: "01",
    name: "Frutos secos",
    kicker: "A granel",
    description: "El corazón de la dietética. Elegís los gramos y te llevás justo lo que vas a comer.",
    products: [
      {
        id: "almendras",
        name: "Almendras",
        note: "Enteras, con piel. Para snack, leches o picadas.",
        image: "/products/almendras.jpg",
        tags: ["A granel", "Sin TACC"],
        gramsOptions: bulk,
        defaultGrams: 250,
      },
      {
        id: "nueces",
        name: "Nueces",
        note: "Mariposa. Ricas en grasas buenas para el desayuno.",
        image: "/products/nueces.jpg",
        tags: ["A granel", "Sin TACC"],
        gramsOptions: bulk,
        defaultGrams: 250,
      },
      {
        id: "caju",
        name: "Castañas de cajú",
        note: "Suaves y dulces. Ideales tostadas un minuto en la sartén.",
        image: "/products/caju.jpg",
        tags: ["A granel", "Vegano"],
        gramsOptions: bulk,
        defaultGrams: 250,
      },
    ],
  },
  {
    id: "semillas",
    index: "02",
    name: "Semillas",
    kicker: "A granel",
    description: "Chía, zapallo y el resto de la góndola chica: un puñado cambia el yogur, la ensalada o el pan.",
    products: [
      {
        id: "chia",
        name: "Semillas de chía",
        note: "Se hidratan en minutos. Pudín, agua fresca o granola.",
        image: "/products/chia.jpg",
        tags: ["A granel", "Sin TACC"],
        gramsOptions: bulk,
        defaultGrams: 250,
      },
      {
        id: "zapallo",
        name: "Semillas de zapallo",
        note: "Peladas. Crocantes, con un punto salado natural.",
        image: "/products/zapallo.jpg",
        tags: ["A granel", "Vegano"],
        gramsOptions: bulk,
        defaultGrams: 250,
      },
    ],
  },
  {
    id: "cereales",
    index: "03",
    name: "Cereales y granos",
    kicker: "A granel",
    description: "La base de la semana: avena para el desayuno, quinoa y lentejas para la olla.",
    products: [
      {
        id: "avena",
        name: "Avena arrollada",
        note: "Fina, de cocción rápida. Porridge, cookies o pan.",
        image: "/products/avena.jpg",
        tags: ["A granel"],
        gramsOptions: bulk,
        defaultGrams: 500,
      },
      {
        id: "quinoa",
        name: "Quinoa",
        note: "Grano entero. Se enjuaga y está lista en un cuarto de hora.",
        image: "/products/quinoa.jpg",
        tags: ["A granel", "Sin TACC"],
        gramsOptions: bulk,
        defaultGrams: 250,
      },
      {
        id: "lentejas",
        name: "Lentejas",
        note: "Clásicas. Guiso, ensalada tibia o hamburguesas caseras.",
        image: "/products/lentejas.jpg",
        tags: ["A granel", "Vegano"],
        gramsOptions: bulk,
        defaultGrams: 500,
      },
    ],
  },
  {
    id: "super",
    index: "04",
    name: "Superalimentos",
    kicker: "Polvos",
    description: "Lo que más se consulta en el mostrador: cacao de verdad y cúrcuma para la cocina diaria.",
    products: [
      {
        id: "cacao",
        name: "Cacao amargo",
        note: "En polvo, sin azúcar. No todo el cacao es igual: este es el de cocina.",
        image: "/products/cacao.jpg",
        tags: ["A granel", "Sin azúcar"],
        gramsOptions: bulk,
        defaultGrams: 100,
      },
      {
        id: "curcuma",
        name: "Cúrcuma",
        note: "Molida. Con pimienta negra rinde más en el cuerpo y en el guiso.",
        image: "/products/curcuma.jpg",
        tags: ["A granel", "Vegano"],
        gramsOptions: [50, 100, 250, 500],
        defaultGrams: 100,
      },
    ],
  },
  {
    id: "yerba",
    index: "05",
    name: "Yerba mate",
    kicker: "Paquete",
    description: "El mate de todos los días y las que valen la pena probar.",
    products: [
      {
        id: "yerba-palo",
        name: "Yerba con palo",
        image: "/products/yerba-con-palo.jpg",
        note: "La de todos los días. Equilibrada, de estacionamiento medio.",
        tags: ["Paquete", "Tradicional"],
        gramsOptions: [500, 1000],
        defaultGrams: 500,
      },
      {
        id: "yerba-despalada",
        name: "Yerba despalada",
        image: "/products/yerba-despalada.jpg",
        note: "Sin palo. Más intensa, para quienes toman mate largo.",
        tags: ["Paquete", "Intensa"],
        gramsOptions: [500, 1000],
        defaultGrams: 500,
      },
      {
        id: "yerba-organica",
        name: "Yerba orgánica",
        image: "/products/yerba-organica.jpg",
        note: "Cultivo sin agroquímicos. Sabor más verde y limpio.",
        tags: ["Paquete", "Orgánica"],
        gramsOptions: [500, 1000],
        defaultGrams: 500,
      },
      {
        id: "yerba-hierbas",
        name: "Yerba con hierbas",
        note: "Compuesta con hierbas serranas. Un mate más fresco a la tarde.",
        tags: ["Paquete", "Hierbas"],
        gramsOptions: [500, 1000],
        defaultGrams: 500,
      },
    ],
  },
  {
    id: "mostrador",
    index: "06",
    name: "Mostrador",
    kicker: "Novedades",
    description:
      "Lo que se está moviendo en el local: gelatina sin sabor, urucum y un mix para la cartera.",
    products: [
      {
        id: "gelatina",
        name: "Gelatina sin sabor",
        image: "/products/gelatina-sin-sabor.jpg",
        note: "No es solo para postres. Una fuente simple de colágeno para sumar al día.",
        tags: ["Sobre", "Sin sabor"],
        gramsOptions: [100, 250],
        defaultGrams: 100,
      },
      {
        id: "urucum",
        name: "Urucum",
        image: "/products/urucum.jpg",
        note: "El color natural del verano. Semillas con betacaroteno, para condimentar.",
        tags: ["Semillas", "A granel"],
        gramsOptions: [50, 100, 250],
        defaultGrams: 100,
      },
      {
        id: "snack-mix",
        name: "Mix de snacks",
        image: "/products/mix-de-snacks.jpg",
        note: "Frutos secos y pasas. El paquete que entra en la mochila.",
        tags: ["Paquete", "Snack"],
        gramsOptions: [150, 300],
        defaultGrams: 150,
      },
    ],
  },
];

export const allProducts = categories.flatMap((category) =>
  category.products.map((product) => ({ ...product, category: category.name })),
);

export function formatGrams(grams: number) {
  if (grams >= 1000) return grams % 1000 === 0 ? `${grams / 1000} kg` : `${grams} g`;
  return `${grams} g`;
}

export function waHref(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
