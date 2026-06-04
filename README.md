# Portafolio — Diseño Multidisciplinario

Stack: **React + Vite + Tailwind + Framer Motion + React Router** (cliente) y **Node.js + Express** (API).

## Desarrollo local

```bash
# Raíz: instala concurrently
npm install

# Cliente y servidor
npm install --prefix client
npm install --prefix server

# Copia variables del servidor
copy server\.env.example server\.env

# Arranca ambos (API :3001, web :5173)
npm run dev
```

- Sitio: http://localhost:5173
- Admin: http://localhost:5173/admin (contraseña por defecto: `portfolio2024`)
- API: http://localhost:3001/api/projects

## Deploy

| Parte | Recomendación |
|-------|----------------|
| **Frontend** | Vercel → root `client`, build `npm run build`, output `dist` |
| **Backend** | Railway, Render o Fly.io → carpeta `server` |

En Vercel, define `VITE_API_URL` si la API está en otro dominio y ajusta las llamadas en `client/src/api/client.ts`.

## Estructura

```
client/     → UI pública + panel /admin
server/     → Express + projects.json
```
