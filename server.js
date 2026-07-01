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
app.use(
  express.static(ROOT, {
    extensions: ['html'],
    setHeaders(res, filePath) {
      // Cache largo para media/estilos, corto para el HTML.
      if (/\.(?:mp4|jpg|jpeg|png|webp|svg|css|js)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=604800');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    },
  })
);

// Health check para Railway.
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// Cualquier otra ruta muestra el landing (una sola página).
app.get('*', (_req, res) => res.sendFile(path.join(ROOT, 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FumiAgro Villavicencio · servidor activo en el puerto ${PORT}`);
});
