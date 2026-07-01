/* =========================================================
   FumiAgro Villavicencio · Servidor estático para Railway
   Sirve el landing (HTML/CSS/JS + assets) en el puerto que
   asigna Railway mediante la variable de entorno PORT.
========================================================= */
'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// Assets estáticos: Express (send) resuelve MIME types y
// soporta HTTP Range requests, necesario para el video .mp4.
//
// Cache: 'no-cache' NO significa "no cachear", sino "cachear pero
// revalidar siempre" (con ETag -> 304 si no cambió). Como los archivos
// no llevan hash en el nombre, esto evita que tras un redeploy el
// navegador sirva un CSS/JS/HTML viejo y, p. ej., no muestre la imagen.
app.use(
  express.static(ROOT, {
    extensions: ['html'],
    etag: true,
    lastModified: true,
    setHeaders(res) {
      res.setHeader('Cache-Control', 'no-cache');
    },
  })
);

// Health check para Railway.
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// Cualquier otra ruta muestra el landing (una sola página).
app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FumiAgro Villavicencio · servidor activo en el puerto ${PORT}`);
});
