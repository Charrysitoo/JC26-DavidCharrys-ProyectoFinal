// Catálogo compartido por la página de menú y la página de pedidos.
// Estos datos son de demostración; más adelante pueden venir de la API.
export const products = [
  {
    id: "burger-criollo",
    name: "Burger criollo",
    description: "Carne jugosa, queso, vegetales frescos y salsa de la casa.",
    price: 24000,
    category: "Hamburguesas",
    image: "/images/burger-criollo.png",
    tag: "Favorito",
  },
  {
    id: "arepa-gourmet",
    name: "Arepa gourmet",
    description: "Arepa dorada con relleno generoso e ingredientes locales.",
    price: 18000,
    category: "Arepas",
    image: "/images/arepa-gourmet.png",
    tag: "Tradición",
  },
  {
    id: "patacon-especial",
    name: "Patacón especial",
    description: "Patacón crujiente con una combinación fresca y sabrosa.",
    price: 22000,
    category: "Patacones",
    image: "/images/patacon-especial.png",
    tag: "De la casa",
  },
];

export const categories = ["Todos", "Hamburguesas", "Arepas", "Patacones"];

export const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
