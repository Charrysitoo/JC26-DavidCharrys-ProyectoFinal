# Makarios — sitio público

Proyecto Final de Grado de Jóvenes CreaTIvos 2026
**Autor:** David Santiago Charrys Pacheco

Makarios es una plataforma web para **Makarios: Food & Handicrafts Company**. Este repositorio contiene el sitio para clientes y su API pública. El panel del personal se encuentra en el repositorio independiente **FinalProject-AdminPanel**. Ambos backends consultan las colecciones compartidas de MongoDB Atlas.

## Funciones del sitio

- **Inicio (/):** presentación del negocio, platos destacados y horario.
- **Menú (/menu):** catálogo, categorías, búsqueda y precios.
- **Pedidos (/pedidos):** carrito, datos de entrega, método de pago preferido y confirmación.
- **Contacto (/contacto):** formulario para consultas generales.
- **Asistente:** responde preguntas sobre el menú, recomendaciones, horario y cómo pedir.
- **Seguimiento:** permite consultar el estado con el número del pedido y el código privado emitido al crearlo.

La aplicación solo recibe pedidos a domicilio, de lunes a sábado entre las **12:00 p. m. y las 7:00 p. m.**, hora de Colombia (America/Bogota). La interfaz informa cuándo está cerrada y la API vuelve a comprobar el horario antes de guardar un pedido.

### Catálogo vigente

Los datos visibles al cliente están en **frontend/src/products.js**. El backend tiene el catálogo autoritativo de precios en **backend/src/catalog.js**; ambos archivos deben mantenerse sincronizados.

| Producto | Precio |
| --- | ---: |
| Tabla de quesos | $80.000 COP |
| Costilla de cerdo en salsa BBQ | $22.000 COP |
| Lomo de cerdo en salsa agridulce | $20.000 COP |
| Picada tres carnes | $27.000 COP |
| Pinchos tres carnes | $18.000 COP |
| Rollo de pollo en salsa de quesos | $23.000 COP |

El backend reconstruye los productos y el subtotal a partir de sus identificadores y precios vigentes. No toma como autoridad los nombres ni los precios enviados por el navegador. El chatbot obtiene nombres, descripciones y precios del catálogo del backend.

## Arquitectura

- **frontend/**: React, Vite, React Router y CSS adaptable.
- **backend/**: Node.js, Express y Mongoose.
- **backend/src/routes/**: rutas de pedidos, contacto y asistente.
- **backend/src/models/**: modelos MongoDB de pedidos y mensajes.
- **backend/src/catalog.js**: catálogo autoritativo para la API.
- **frontend/src/components/ChatWidget.jsx**: chat y formulario seguro de seguimiento.

MongoDB Atlas guarda pedidos y mensajes. El catálogo se mantiene en código; no existe una colección administrativa de productos.

### API pública

| Método y ruta | Función |
| --- | --- |
| GET /api/health | Estado del backend |
| POST /api/orders | Crear pedido a domicilio dentro del horario |
| POST /api/orders/track | Consultar estado con código del pedido y código privado |
| POST /api/messages | Guardar una consulta del formulario de contacto |
| POST /api/chat | Enviar la conversación a Gemini y recibir una respuesta |

No hay rutas públicas para listar pedidos ni mensajes. La consulta de seguimiento devuelve código, estado y fechas, sin datos personales. El código privado se muestra al cliente una sola vez; MongoDB conserva únicamente su hash. No se envía al chatbot.

Las rutas públicas validan sus solicitudes y tienen límites por IP: 10 pedidos cada 15 minutos, 5 mensajes cada 15 minutos, 12 consultas al chatbot por minuto y 20 consultas de seguimiento cada 15 minutos. Los contadores se guardan en memoria del proceso; no se comparten entre instancias.

## Privacidad y configuración de Gemini

La API Key de Gemini se configura únicamente en el backend con **GEMINI_API_KEY**. El texto que el cliente escribe en el asistente y el historial reciente se envían a Gemini para generar respuestas. El asistente pide no ingresar información personal; el número y código de seguimiento se envían a una ruta separada y nunca al modelo.

El modelo predeterminado es **gemini-3.5-flash-lite**; se puede cambiar con **GEMINI_MODEL**. Si no hay clave configurada, la API responde que el asistente no está disponible. No se incluyen claves en variables VITE_: Vite incorpora esas variables al JavaScript público.

## Desarrollo local

Requisitos: Node.js 20.19 o posterior (o 22.12 o posterior) y npm. Backend y frontend tienen dependencias independientes.

1. Inicia la API desde **backend/**:

   ~~~bash
   npm ci
   npm run dev
   ~~~

   Copia **backend/.env.example** como **backend/.env**. Para persistir datos, configura **MONGODB_URI**; si se omite fuera de producción, la API usa memoria temporal. Para el chatbot agrega **GEMINI_API_KEY**. La plantilla contiene **GEMINI_MODEL** y **CORS_ORIGIN**.

2. En otra terminal, inicia el sitio desde **frontend/**:

   ~~~bash
   npm ci
   npm run dev
   ~~~

Vite publica el sitio en **http://localhost:5173** y redirige **/api** al backend local en el puerto 4000. En producción, **VITE_API_URL** debe ser el origen del backend público, por ejemplo **https://<api-publica>.onrender.com**. El cliente agrega **/api** automáticamente si falta, así que también acepta el origen terminado en **/api**.

| Variable del backend | Uso |
| --- | --- |
| PORT | Puerto HTTP; Render lo proporciona automáticamente |
| MONGODB_URI | Conexión a Atlas; obligatoria cuando NODE_ENV=production |
| CORS_ORIGIN | Origen u orígenes del sitio, separados por comas |
| GEMINI_API_KEY | Secreto de Gemini, solo en el backend |
| GEMINI_MODEL | Modelo Gemini; predeterminado gemini-3.5-flash-lite |

Los archivos .env están excluidos de Git. En producción la API se detiene si falta MongoDB o CORS_ORIGIN, para evitar aceptar solicitudes con almacenamiento temporal o una configuración abierta.

## Despliegue en Vercel y Render

- **Vercel:** importa este repositorio, define **frontend/** como directorio raíz, comando **npm run build** y salida **dist**. Configura **VITE_API_URL** como **Config** con el origen público de la API Render (por ejemplo, **https://<api-publica>.onrender.com**). El cliente agrega **/api** automáticamente si hace falta. Es una dirección pública, no un secreto. El archivo **frontend/vercel.json** permite abrir directamente las rutas de React Router.
- **Render:** crea un Web Service desde este repositorio, con **backend/** como directorio raíz, **npm ci** para instalar y **npm start** para iniciar. Configura **MONGODB_URI**, **CORS_ORIGIN**, **GEMINI_API_KEY** y, opcionalmente, **GEMINI_MODEL**. Usa **/api/health** como health check.
- En Atlas, permite la conexión de salida del servicio Render mediante su lista de IPs/rangos y usa un usuario de base de datos con permisos para la base del proyecto.

## Comprobaciones para la entrega

Desde **frontend/**:

~~~bash
npm run build
npm run lint
~~~

El backend no tiene una suite automatizada configurada. Para la comprobación manual de producción, crea un pedido dentro del horario, verifica que aparezca en el panel, cambia su estado, consulta el seguimiento con el código privado y envía un mensaje desde Contacto. La API rechaza pedidos fuera del horario.
