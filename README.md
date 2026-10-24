<div align="center">

# Proyecto Final de Grado - Jóvenes CreaTIvos 2026
### Makarios: Food & Handicrafts Company  &nbsp; &nbsp; By: David Santiago Charrys Pacheco

</div>

## Introducción

Makarios es un emprendimiento del sector gastronómico enfocado en la comercialización de alimentos de tipo gourmet y comida rápida. Nuestro nombre significa "Bienaventurado", 

## Objetivo del Proyecto
Desarrollar una aplicación pública donde cualquier persona pueda conocer el negocio y sus ofertas, y si es de su interés, contactar al restaurante y solicitar pedidos directamente desde la propia página web. A su vez, desarrollar una aplicación privada donde los administradores puedan revisar los formularios enviados por las persona, ya sea para responder a las solicitudes de contacto o empezar a procesar un pedido.

## Argumento
Las interfaces de usuario de ambas aplicaciones se construyen sobre React, y se hace uso de Node.js y MongoDB para actualizar y visualizar los pedidos. En el caso de la aplicación de clientes, esta debe permitirles enviar un formulario de contacto o registrar un pedido, información que queda registrada en la Base de Datos de MongoDB Atlas; se hace uso de Mongoose para evitar inconsistencias en los formularios y que los usuarios solo llenen lo que deben.

Por su parte, la aplicación privada debe ser capaz de recuperar los registros de la base de datos por medio de llamadas API y presentarla en un panel de administrador al que solo debe poder acceder personal autorizado a través de un código otorgado.