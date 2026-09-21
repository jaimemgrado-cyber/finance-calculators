# ClearSum — Bloque 16: Infraestructura / Deployment

Estado: CERRADO 🟢

## Comprobaciones
- Vercel configurado con `buildCommand: node build/build.js`.
- `outputDirectory: dist` correctamente definido.
- El proyecto es estático y no requiere servidor de aplicación en producción.
- `dist/` contiene el sitio desplegable generado.
- Cache de largo plazo configurada para assets versionados/estáticos.
- Cabeceras de seguridad de producción configuradas en `vercel.json`.
- HSTS configurado.
- Sitemap, robots.txt, ads.txt y webmanifest generados dentro de `dist/`.
- Build local comprobado correctamente.
- 77/77 tests pasan.
- No hay dependencias npm externas de runtime/build, reduciendo superficie de supply-chain.
- El proyecto puede desplegarse desde el repositorio ejecutando el build definido por Vercel.

## Mejora pendiente no bloqueante
No existe `package-lock.json`/lockfile. Al no haber dependencias npm externas, el riesgo práctico es bajo, pero un lockfile sería una mejora de reproducibilidad si posteriormente se incorporan dependencias.

## Nota
La comprobación de disponibilidad, DNS, TLS, caché efectiva y cabeceras debe validarse también contra el dominio público después del despliegue. Esta auditoría valida la configuración del proyecto y el pipeline definido en el repositorio, no una prueba externa del servidor.

## Resultado
**9.7/10 — Bloque 16 cerrado 🟢**
