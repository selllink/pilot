# LinkVenta Express

Plataforma para crear fichas de venta con link corto y expiración. Stack: Vite + React, Supabase (PostgreSQL, Auth, Storage).

## Cómo correr el proyecto

1. **Instalar dependencias** (solo la primera vez):
   ```bash
   npm install
   ```

2. **Variables de entorno**  
   En la raíz del repo debe existir un archivo `.env` con:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```
   (Anon key en Dashboard → Project Settings → API.)

3. **Arrancar en desarrollo**:
   ```bash
   npm run dev
   ```
   Se abre en `http://localhost:5173` (o el puerto que indique Vite).

4. **Build para producción**:
   ```bash
   npm run build
   ```
   La salida queda en `dist/`. Para probar el build localmente: `npm run preview`.

## Desplegar en Vercel

### Opción 1: Vercel CLI

1. **Instalar la CLI** (una vez):
   ```bash
   npm i -g vercel
   ```

2. **Desde la raíz del proyecto**:
   ```bash
   vercel
   ```
   La primera vez te pedirá login (si no estás logueado) y asociar el proyecto. Responde a las preguntas; Vite se detecta solo.

3. **Variables de entorno**  
   Configúralas en el [Dashboard de Vercel](https://vercel.com/dashboard) → tu proyecto → Settings → Environment Variables:
   - `VITE_SUPABASE_URL` = tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu anon key

   O por CLI (en la raíz del repo):
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```
   (te pedirá el valor para cada una.)

4. **Deploy a producción**:
   ```bash
   vercel --prod
   ```

### Opción 2: Conectar el repo en vercel.com

1. Entra a [vercel.com](https://vercel.com) e importa el repo de Git (GitHub/GitLab/Bitbucket).
2. Vercel detecta Vite; deja **Build Command**: `npm run build` y **Output Directory**: `dist`.
3. Añade las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Cada push a la rama principal puede configurarse para que haga deploy automático.

## Documentación

- [documents/requirements.md](documents/requirements.md) – Requisitos
- [documents/arqandinfra.md](documents/arqandinfra.md) – Arquitectura
- [documents/ui.md](documents/ui.md) – UI/UX
- [documents/setup-storage.md](documents/setup-storage.md) – Bucket de Storage
