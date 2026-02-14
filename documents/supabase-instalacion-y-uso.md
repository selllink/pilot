# Instalar y usar Supabase (CLI y proyecto)

Guía para instalar la CLI de Supabase, enlazar tu proyecto y aplicar migraciones en LinkVenta Express.

---

## 1. Instalar la CLI de Supabase

No hace falta instalar la CLI de forma global. Puedes usar **npx** desde la raíz del repo:

```bash
npx supabase --version
```

Si quieres instalarla globalmente:

- **Windows (PowerShell):**  
  ```powershell
  scoop install supabase
  ```
  O descarga el ejecutable desde [GitHub Releases](https://github.com/supabase/cli/releases) y añade la carpeta al PATH.

- **macOS / Linux:**  
  ```bash
  brew install supabase/tap/supabase
  ```

En este proyecto se usa **npx**, así que no es obligatorio instalarla.

---

## 2. Iniciar sesión

Desde la raíz del proyecto:

```bash
npx supabase login
```

Se abrirá el navegador para que inicies sesión en Supabase. Al terminar, la CLI quedará autenticada.

---

## 3. Enlazar el proyecto local con Supabase

Para usar `db push` y otros comandos contra tu proyecto en la nube, hay que enlazarlo una vez.

1. En [Supabase Dashboard](https://supabase.com/dashboard) abre tu proyecto.
2. El **Project ref** está en la URL:  
   `https://XXXXX.supabase.co` → el ref es `XXXXX`.  
   (En este proyecto: `wiwmqgcjzbyrlyubhxom`.)
3. En la terminal, desde la raíz del repo:

```bash
npx supabase link --project-ref TU_PROJECT_REF
```

Ejemplo:

```bash
npx supabase link --project-ref wiwmqgcjzbyrlyubhxom
```

Solo hace falta hacerlo una vez por máquina/repo.

---

## 4. Aplicar migraciones (subir esquema a la base de datos)

Las migraciones están en `supabase/migrations/`. Para aplicarlas al proyecto enlazado:

```bash
npx supabase db push
```

Te preguntará si quieres aplicar las migraciones pendientes. Confirma con **Y**.

- Si el proyecto es nuevo, se crearán tablas, RLS, triggers, etc.
- Si ya aplicaste migraciones antes, solo se ejecutarán las nuevas.

---

## 5. Comandos útiles

| Comando | Descripción |
|--------|-------------|
| `npx supabase login` | Iniciar sesión en tu cuenta Supabase |
| `npx supabase link --project-ref REF` | Enlazar este repo con un proyecto remoto |
| `npx supabase db push` | Aplicar migraciones al proyecto enlazado |
| `npx supabase db pull` | Descargar el esquema actual del remoto a migraciones (cuidado: puede sobrescribir) |
| `npx supabase status` | Ver estado del proyecto enlazado (solo si hay Supabase local) |

---

## 6. Variables de entorno del proyecto

La app (Vite) usa estas variables en un archivo `.env` en la raíz:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

- **URL:** la misma que usas en el Dashboard.
- **Anon key:** en Dashboard → Project Settings → API → **anon** (public).  
  No uses la **service_role** en el frontend.

---

## 7. Resumen rápido (primera vez en un repo)

```bash
cd pilot
npx supabase login
npx supabase link --project-ref wiwmqgcjzbyrlyubhxom
npx supabase db push
```

Después, cuando cambies o añadas migraciones en `supabase/migrations/`:

```bash
npx supabase db push
```

---

## 8. Documentación oficial

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Migraciones con Supabase](https://supabase.com/docs/guides/cli/local-development#database-migrations)
