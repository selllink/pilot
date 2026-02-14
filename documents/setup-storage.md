# Crear el bucket de Storage (Bucket not found)

## ¿Supabase soporta buckets?

**Sí.** Supabase tiene **Storage** y los buckets son una función normal del producto: puedes crearlos desde el Dashboard, desde la API o desde el cliente (JavaScript, etc.). El error "Bucket not found" solo significa que **en tu proyecto** ese bucket todavía no existe; hay que crearlo una vez.

Lo que **no** existe es un recurso de **Terraform** para buckets: el [provider oficial de Supabase](https://registry.terraform.io/providers/supabase/supabase/latest) solo incluye `supabase_project`, `supabase_branch` y `supabase_settings`. Por eso en este repo el bucket se crea con un **script** que Terraform puede ejecutar, o manualmente en el Dashboard.

---

Si ves **"Bucket not found"**, crea el bucket `product-images` de una de estas dos formas:

---

## Opción 1: Con Terraform (script + variables)

Como el provider no tiene recurso para buckets, usamos un script que Terraform ejecuta (o lo ejecutas tú a mano).

1. En `infra/terraform.tfvars` define:
   - `supabase_url` = tu URL del proyecto (ej. `https://xxxx.supabase.co`)
   - `supabase_service_role_key` = la **service role key** (Dashboard → Project Settings → API → **service_role**, la clave **secret**). No uses la anon/publishable: crear el bucket requiere service_role.
   - Si ya tienes el proyecto, deja `organization_id` y `db_password` vacíos (`""`) para que Terraform no intente crear otro proyecto.

2. Desde la raíz del repo:
   ```bash
   cd infra
   terraform apply
   ```
   Si ya tienes el proyecto en Terraform, el `null_resource` ejecutará el script y creará el bucket `product-images`.

3. Si solo quieres crear el bucket (sin aplicar el resto de Terraform):
   ```bash
   SUPABASE_URL=https://tu-proyecto.supabase.co SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key node infra/scripts/create-storage-bucket.mjs
   ```

---

## Opción 2: Manual en Supabase Dashboard

1. Entra a [Supabase Dashboard](https://supabase.com/dashboard) y abre tu proyecto.
2. En el menú izquierdo, ve a **Storage**.
3. Pulsa **"New bucket"**.
4. Configura:
   - **Name:** `product-images` (exactamente este nombre).
   - **Public bucket:** activado.
   - **File size limit:** 5 MB (opcional).
   - **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp` (opcional).
5. Guarda el bucket.

Después de crearlo, la app debería poder subir y mostrar imágenes sin el error "Bucket not found".
