// Catálogo autoritativo del backend. Mantenerlo sincronizado con frontend/src/products.js.
const products = [
  {
    id: "tabla-de-quesos",
    name: "Tabla de quesos",
    category: "Entradas",
    description: "Una Tabla especial de varias elecciones de quesos, carnes frías, frutas y otros snacks ideales para reuniones.",
    price: 80000,
  },
  {
    id: "costilla-de-cerdo-bbq",
    name: "Costilla de cerdo en salsa BBQ",
    category: "Platos fuertes",
    description: "Costilla de cerdo cubierta con salsa BBQ y servida con acompañamientos.",
    price: 22000,
  },
  {
    id: "lomo-de-cerdo-agridulce",
    name: "Lomo de cerdo en salsa agridulce",
    category: "Platos fuertes",
    description: "Lomo de cerdo en salsa agridulce, acompañado con guarniciones.",
    price: 20000,
  },
  {
    id: "picada-tres-carnes",
    name: "Picada tres carnes",
    category: "Para compartir",
    description: "Una combinación de carnes y acompañamientos, ideal para compartir.",
    price: 27000,
  },
  {
    id: "pinchos-tres-carnes",
    name: "Pinchos tres carnes",
    category: "Platos fuertes",
    description: "Pinchos con tres tipos de carne, vegetales y acompañamientos.",
    price: 18000,
  },
  {
    id: "rollo-de-pollo-salsa-quesos",
    name: "Rollo de pollo en salsa de quesos",
    category: "Platos fuertes",
    description: "Rollo de pollo bañado en salsa de quesos y servido con acompañamientos.",
    price: 23000,
  },
];

const productsById = new Map(products.map((product) => [product.id, product]));

module.exports = { products, productsById };
