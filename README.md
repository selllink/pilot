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

## Documentación

- [documents/requirements.md](documents/requirements.md) – Requisitos
- [documents/arqandinfra.md](documents/arqandinfra.md) – Arquitectura
- [documents/ui.md](documents/ui.md) – UI/UX
- [documents/setup-storage.md](documents/setup-storage.md) – Bucket de Storage
