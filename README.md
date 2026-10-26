<div align="center">

# Proyecto Final de Grado — Jóvenes CreaTIvos 2026
### Makarios: Food & Handicrafts Company
**Autor:** David Santiago Charrys Pacheco

</div>

## Introducción

Makarios es un emprendimiento del sector gastronómico enfocado en la comercialización de alimentos gourmet y comida rápida. Mantener un establecimiento físico puede representar costos elevados, mientras que gestionar todas las solicitudes únicamente por aplicaciones de mensajería puede resultar poco práctico. Por ello, se propone una plataforma web que permita dar a conocer el negocio, consultar su oferta gastronómica y facilitar el contacto y la realización de pedidos.

## Objetivo del proyecto

Ofrecer una experiencia web completa para Makarios: un sitio público para descubrir el menú, hacer pedidos y contactar al restaurante, más un panel privado para que el personal autorizado administre los pedidos y mensajes recibidos.

## Estado actual del proyecto

El sistema está dividido en dos aplicaciones mantenidas en repositorios separados:

- **Sitio público:** este repositorio, desarrollado con React y Vite.
- **Panel administrativo:** `FinalProject-AdminPanel`, con su propio frontend y backend.

Ambos backends guardan y consultan los pedidos y mensajes en la base de datos compartida de MongoDB Atlas. Cada aplicación tiene su propia API: las operaciones de consulta y administración del personal pasan por el backend administrativo autenticado.

El sitio público incluye estas páginas:

- **Inicio (`Home.jsx`, ruta `/`):** presenta el restaurante y destaca tres productos del catálogo.
- **Menú (`Menu.jsx`, ruta `/menu`):** muestra los seis platos del catálogo con sus fotografías, nombres, categorías y precios.
- **Pedidos (`Order.jsx`, ruta `/pedidos`):** permite seleccionar productos, modificar cantidades, revisar el carrito e introducir los datos necesarios para realizar un pedido.
- **Contacto (`Contact.jsx`, ruta `/contacto`):** contiene un formulario independiente con nombres, apellidos, correo electrónico, teléfono y mensaje. Todos los campos son obligatorios.

La navegación entre páginas se gestiona con **React Router**. Para evitar duplicaciones, el encabezado y el pie de página se encuentran en componentes compartidos (`SiteHeader.jsx` y `SiteFooter.jsx`). Los datos de los productos están centralizados en `products.js`, y el manejo del carrito en el navegador se apoya en `cartStorage.js`. Los estilos generales están separados de los estilos particulares de cada página.

El sitio incorpora un asistente con Gemini para orientar al cliente sobre el menú, pedir recomendaciones, consultar los horarios y explicar cómo realizar un pedido. También permite consultar el estado de un pedido con su número y un código privado.

### Catálogo actual

El catálogo y los precios vigentes están centralizados en `frontend/src/products.js`:

| Producto | Precio |
| --- | ---: |
| Tabla de quesos | $80.000 COP |
| Costilla de cerdo en salsa BBQ | $22.000 COP |
| Lomo de cerdo en salsa agridulce | $20.000 COP |
| Picada tres carnes | $27.000 COP |
| Pinchos tres carnes | $18.000 COP |
| Rollo de pollo en salsa de quesos | $23.000 COP |

Tres productos se muestran como destacados en la página de inicio. El asistente tiene una descripción y una copia de los precios en `backend/src/routes/chat.js`; al cambiar el catálogo, actualiza también ese contexto para evitar recomendaciones con datos desactualizados.

## Tecnologías y arquitectura

### Aplicación pública

- **React y JSX:** construcción de la interfaz mediante componentes reutilizables.
- **CSS:** estilos y diseño adaptable a distintos tamaños de pantalla.
- **React Router:** navegación entre las páginas públicas.
- **JavaScript:** gestión del catálogo, la interfaz y el estado del carrito en el frontend.

### Backend, base de datos y aplicación privada

El sistema utiliza:

- **Node.js y Express:** API para validar solicitudes y conectar las aplicaciones con la base de datos.
- **MongoDB Atlas:** almacenamiento compartido de pedidos, mensajes y miembros de personal autorizados.
- **Mongoose:** definición de modelos y validación de los datos que recibe el backend.
- **Aplicación privada del personal:** inicio de sesión y panel para consultar y gestionar pedidos y mensajes, con acceso restringido a personal autorizado.
- **Chatbot de inteligencia artificial:** asistente para responder preguntas sobre el restaurante y recomendar platos a partir de la información real del catálogo.

El backend público valida y registra pedidos y mensajes. Usa MongoDB cuando `MONGODB_URI` está configurada; sin esa variable inicia en modo de demostración y mantiene los registros solo en memoria. El modelo de productos está en el frontend, no en una colección administrable de MongoDB.

El chatbot llama a Gemini desde el backend. `GEMINI_API_KEY` se configura como secreto del servidor, nunca en React. Las preguntas escritas en el chat se envían a Gemini; no se envían el número ni el código privado al chatbot. El seguimiento del pedido usa una ruta separada del backend.

Al crear un pedido, el servidor emite un código privado aleatorio junto con el número de pedido. El cliente debe guardar ambos: el código privado solo se muestra al crear el pedido y no se puede recuperar después. El servidor conserva únicamente el hash del código. La consulta devuelve el estado y las fechas del pedido, sin exponer nombre, teléfono, dirección ni otros datos del cliente. Los pedidos anteriores a esta función no tienen ese código y no pueden consultarse por este mecanismo.

El horario publicado es de lunes a sábado, de 12:00 p. m. a 7:00 p. m., hora de Colombia. Tanto la interfaz como el backend rechazan pedidos fuera de ese horario, incluidos los domingos. El servidor vuelve a comprobar la hora al recibir cada solicitud. El restaurante opera únicamente a domicilio.

## API y privacidad

La API pública permite crear pedidos y mensajes, conversar con el asistente y consultar el estado de un pedido individual. No ofrece rutas para listar pedidos o mensajes. La consulta de estado requiere el número de pedido y un código aleatorio privado; el servidor conserva solo el hash del código y responde con el estado y sus fechas, sin datos personales.

Las operaciones de listado y administración se realizan desde el backend privado del panel, con autenticación JWT. La API pública no debe exponer información de clientes ni depender de CORS como mecanismo de autorización.

| Método y ruta | Uso | Acceso |
| --- | --- | --- |
| `POST /api/orders` | Crear pedido a domicilio (lunes a sábado, 12:00 p. m. a 7:00 p. m., hora de Colombia) | Público, con validación del servidor |
| `POST /api/orders/track` | Consultar el estado usando número de pedido y código privado | Público, limitado por intentos y sin datos personales |
| `POST /api/messages` | Enviar mensaje de contacto | Público, con validación del servidor |
| `POST /api/chat` | Consultar el asistente Gemini | Público, limitado por solicitudes |
| Listados de pedidos y mensajes | No están disponibles en el backend público | El personal los consulta por el backend administrativo autenticado |

El límite de consultas del chatbot es de 12 solicitudes por minuto por IP y el del seguimiento es de 20 por cada 15 minutos por IP. Estos contadores están en memoria del proceso; con varias instancias del backend no constituyen un límite compartido.

## Principios de desarrollo

- Mantener una separación clara entre páginas, componentes compartidos, datos y lógica de negocio.
- Reutilizar componentes y evitar duplicar información del catálogo.
- Validar los datos tanto en el frontend como en el backend.
- Proteger las credenciales y restringir el acceso a las funciones administrativas.
- Documentar las decisiones técnicas para facilitar el mantenimiento y la sustentación académica.

## Ejecución local

Necesitas Node.js y npm. El proyecto no tiene un `package.json` en la raíz: instala y ejecuta cada parte desde su propia carpeta.

1. En una terminal, prepara el backend:

   ```bash
   cd backend
   npm install
   ```

   Copia `backend/.env.example` como `backend/.env` y configura `MONGODB_URI`. Para activar Gemini, agrega `GEMINI_API_KEY`; el modelo predeterminado está indicado en la plantilla como `GEMINI_MODEL`. Si no configuras MongoDB, el backend usa memoria de demostración.

   Inicia la API:

   ```bash
   npm run dev
   ```

2. En otra terminal, instala e inicia el frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Vite publica el frontend en `http://localhost:5173` y redirige `/api` al backend local en `http://localhost:4000`. Para producción o una API en otra dirección, define `VITE_API_URL` con la URL base de la API, incluyendo `/api`.

Los archivos `.env` están excluidos de Git. No pongas claves ni credenciales en variables `VITE_*`, ya que esas variables se incorporan al frontend.

### Comprobaciones disponibles

Desde `frontend/` puedes ejecutar `npm run build` y `npm run lint`. El backend tiene `npm run dev` y `npm start`; el script `npm test` es solo un marcador y no ejecuta una suite de pruebas.

## Despliegue inicial en Vercel y Render

- **Vercel (sitio):** configura `frontend/` como directorio raíz, usa `npm run build` como comando de compilación y `dist` como directorio de salida. Define `VITE_API_URL` con el origen del backend público de Render y el prefijo `/api`, por ejemplo `https://<api-publica>.onrender.com/api`.
- **Render (API pública):** configura `backend/` como directorio raíz, `npm ci` como comando de compilación e `npm start` como comando de inicio. Usa `/api/health` como comprobación de salud y configura `MONGODB_URI`, `CORS_ORIGIN` con el origen exacto del sitio Vercel, y `GEMINI_API_KEY`. Render proporciona `PORT`.
- Permite en MongoDB Atlas la conexión desde el servicio de Render y usa la misma base de datos prevista para el panel.
- Después del primer despliegue, verifica en el navegador las rutas `/`, `/menu`, `/pedidos` y `/contacto`; `frontend/vercel.json` redirige las rutas de la SPA a `index.html`.

El seguimiento del pedido consulta únicamente el backend público. No se debe configurar `GEMINI_API_KEY`, `MONGODB_URI` ni otros secretos como variables `VITE_*` de Vercel.

## Próximas etapas

1. Confirmar ingredientes, alérgenos, disponibilidad y cobertura de domicilios para que el chatbot use información completa y verificada.
2. Mantener sincronizados el catálogo del frontend y el contexto de productos del backend del chatbot.
3. Verificar que los entornos desplegados mantengan el acceso correcto a MongoDB Atlas y que los orígenes CORS solo incluyan los sitios autorizados.
4. Revisar autenticación administrativa, consulta privada de pedidos, cuotas y experiencia completa antes de la entrega final.
5. Publicar las aplicaciones y monitorear el uso de Gemini.
