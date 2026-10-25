// Catálogo compartido por Inicio, Menú y Pedidos.
// Catálogo y precios vigentes para las páginas públicas.
import tablaDeQuesosImage from "./assets/menu/tabla-de-quesos.jpg";
import costillaBBQImage from "./assets/menu/costilla-de-cerdo-bbq.jpg";
import lomoAgridulceImage from "./assets/menu/lomo-de-cerdo-agridulce.jpg";
import picadaTresCarnesImage from "./assets/menu/picada-tres-carnes.jpg";
import pinchosTresCarnesImage from "./assets/menu/pinchos-tres-carnes.jpg";
import rolloPolloImage from "./assets/menu/rollo-de-pollo-salsa-quesos.jpg";

export const products = [
  {
    id: "tabla-de-quesos",
    name: "Tabla de quesos",
    description: "Una Tabla especial de varias elecciones de quesos, carnes frías, frutas y otros snacks ideales para reuniones.",
    price: 80000,
    category: "Entradas",
    image: tablaDeQuesosImage,
    tag: "Para compartir",
    featured: true,
  },
  {
    id: "costilla-de-cerdo-bbq",
    name: "Costilla de cerdo en salsa BBQ",
    description: "Costilla de cerdo cubierta con salsa BBQ y servida con acompañamientos.",
    price: 22000,
    category: "Platos fuertes",
    image: costillaBBQImage,
    tag: "De la casa",
    featured: true,
  },
  {
    id: "lomo-de-cerdo-agridulce",
    name: "Lomo de cerdo en salsa agridulce",
    description: "Lomo de cerdo en salsa agridulce, acompañado con guarniciones.",
    price: 20000,
    category: "Platos fuertes",
    image: lomoAgridulceImage,
    tag: "Sabor especial",
    featured: false,
  },
  {
    id: "picada-tres-carnes",
    name: "Picada tres carnes",
    description: "Una combinación de carnes y acompañamientos, ideal para compartir.",
    price: 27000,
    category: "Para compartir",
    image: picadaTresCarnesImage,
    tag: "Favorita para compartir",
    featured: true,
  },
  {
    id: "pinchos-tres-carnes",
    name: "Pinchos tres carnes",
    description: "Pinchos con tres tipos de carne, vegetales y acompañamientos.",
    price: 18000,
    category: "Platos fuertes",
    image: pinchosTresCarnesImage,
    tag: "A la parrilla",
    featured: false,
  },
  {
    id: "rollo-de-pollo-salsa-quesos",
    name: "Rollo de pollo en salsa de quesos",
    description: "Rollo de pollo bañado en salsa de quesos y servido con acompañamientos.",
    price: 23000,
    category: "Platos fuertes",
    image: rolloPolloImage,
    tag: "Especialidad",
    featured: false,
  },
];

export const categories = ["Todos", "Entradas", "Platos fuertes", "Para compartir"];

export const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
