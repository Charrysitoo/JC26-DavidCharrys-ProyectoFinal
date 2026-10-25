<div align="center">

# Proyecto Final de Grado — Jóvenes CreaTIvos 2026
### Makarios: Food & Handicrafts Company
**Autor:** David Santiago Charrys Pacheco

</div>

## Introducción

Makarios es un emprendimiento del sector gastronómico enfocado en la comercialización de alimentos gourmet y comida rápida. Mantener un establecimiento físico puede representar costos elevados, mientras que gestionar todas las solicitudes únicamente por aplicaciones de mensajería puede resultar poco práctico. Por ello, se propone una plataforma web que permita dar a conocer el negocio, consultar su oferta gastronómica y facilitar el contacto y la realización de pedidos.

## Objetivo del proyecto

Desarrollar una aplicación pública para que los clientes conozcan el restaurante, consulten el menú, realicen pedidos y envíen mensajes de contacto desde el sitio web. Como complemento, se desarrollará una aplicación privada para que el personal autorizado pueda consultar y administrar los pedidos y mensajes recibidos.

## Estado actual del proyecto

Actualmente se está trabajando en el **frontend de la aplicación pública**, desarrollado con React. Las páginas implementadas hasta el momento son:

- **Inicio (`Home.jsx`, ruta `/`):** presenta el restaurante y destaca tres productos del catálogo.
- **Menú (`Menu.jsx`, ruta `/menu`):** muestra los seis platos del catálogo con sus fotografías, nombres, categorías y precios.
- **Pedidos (`Order.jsx`, ruta `/pedidos`):** permite seleccionar productos, modificar cantidades, revisar el carrito e introducir los datos necesarios para realizar un pedido.
- **Contacto (`Contact.jsx`, ruta `/contacto`):** contiene un formulario independiente con nombres, apellidos, correo electrónico, teléfono y mensaje. Todos los campos son obligatorios.

La navegación entre páginas se gestiona con **React Router**. Para evitar duplicaciones, el encabezado y el pie de página se encuentran en componentes compartidos (`SiteHeader.jsx` y `SiteFooter.jsx`). Los datos de los productos están centralizados en `products.js`, y el manejo del carrito en el navegador se apoya en `cartStorage.js`. Los estilos generales están separados de los estilos particulares de cada página.

### Catálogo actual

El catálogo contiene estos seis productos:

1. Tabla de quesos.
2. Costilla de cerdo en salsa BBQ.
3. Lomo de cerdo en salsa agridulce.
4. Picada tres carnes.
5. Pinchos tres carnes.
6. Rollo de pollo en salsa de quesos.

Tres productos se muestran como destacados en la página de inicio. Los precios actuales son provisionales y deben sustituirse por los precios confirmados del emprendimiento antes de publicar la aplicación.

## Tecnologías y arquitectura previstas

### Aplicación pública

- **React y JSX:** construcción de la interfaz mediante componentes reutilizables.
- **CSS:** estilos y diseño adaptable a distintos tamaños de pantalla.
- **React Router:** navegación entre las páginas públicas.
- **JavaScript:** gestión del catálogo, la interfaz y el estado del carrito en el frontend.

### Backend, base de datos y aplicación privada

La arquitectura prevista contempla:

- **Node.js y Express:** API para validar solicitudes y conectar las aplicaciones con la base de datos.
- **MongoDB Atlas:** almacenamiento de productos, pedidos, usuarios autorizados y mensajes de contacto.
- **Mongoose:** definición de modelos y validación de los datos que recibe el backend.
- **Aplicación privada del personal:** inicio de sesión y panel para consultar y gestionar pedidos, productos y mensajes, con acceso restringido a personal autorizado.
- **Chatbot de inteligencia artificial:** asistente para responder preguntas sobre el restaurante y recomendar platos a partir de la información real del catálogo.

El repositorio incluye un backend Express con persistencia en MongoDB cuando se configura `MONGODB_URI`, y almacenamiento en memoria para desarrollo. Los formularios públicos ya envían pedidos y mensajes a la API. El panel administrativo se mantiene en el repositorio `FinalProject-AdminPanel`.

El sitio también incluye un chatbot de orientación conectado a Gemini desde el backend. Para activarlo, configura `GEMINI_API_KEY` en el entorno del servidor (nunca en React) y, opcionalmente, `GEMINI_MODEL`. El asistente responde sobre el menú y la navegación; no recibe datos de pedidos ni información personal.

Al crear un pedido, el servidor emite un código privado de seguimiento aleatorio. El cliente debe guardarlo junto con el número de pedido para consultar el estado en el asistente. El servidor conserva únicamente el hash del código y la consulta devuelve el estado y la fecha de actualización, sin exponer datos del cliente. Los pedidos creados antes de activar esta función no tienen código privado y no podrán consultarse por este mecanismo.

## Objetivo de integración

Cuando el backend esté disponible, la aplicación pública enviará los pedidos y mensajes mediante llamadas a la API. El servidor validará los datos y los almacenará en MongoDB Atlas usando Mongoose. La aplicación privada consumirá los mismos endpoints con autenticación y permisos adecuados, de modo que el personal pueda consultar la información registrada y actualizar el estado de los pedidos.

El chatbot se integrará a través del backend para mantener protegidas las claves de la API de IA y limitar sus respuestas a información autorizada, como los productos, precios y disponibilidad del restaurante.

## Principios de desarrollo

- Mantener una separación clara entre páginas, componentes compartidos, datos y lógica de negocio.
- Reutilizar componentes y evitar duplicar información del catálogo.
- Validar los datos tanto en el frontend como en el backend.
- Proteger las credenciales y restringir el acceso a las funciones administrativas.
- Documentar las decisiones técnicas para facilitar el mantenimiento y la sustentación académica.

## Ejecución del frontend

Desde la carpeta raíz del proyecto, instala las dependencias y ejecuta el servidor de desarrollo:

```bash
npm install
npm run dev
```

Estos comandos corresponden a un proyecto React configurado con Vite. Si el proyecto usa otra configuración, consulta los scripts disponibles en `package.json`. Asegúrate de conservar los archivos de configuración y las imágenes del proyecto al actualizar el contenido de `src`.

## Próximas etapas

1. Finalizar y probar la interfaz pública.
2. Confirmar y documentar cuál backend se desplegará como API compartida para el sitio público y el panel.
3. Confirmar precios, ingredientes, alérgenos, disponibilidad y horarios para que el chatbot pueda responder con información de negocio verificada.
4. Configurar `GEMINI_API_KEY`, MongoDB y los orígenes CORS en el entorno de despliegue.
5. Verificar autenticación, consulta privada de pedidos, cuotas y comportamiento del chatbot antes de publicar.
6. Publicar las aplicaciones y monitorear el uso de Gemini.
