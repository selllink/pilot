# 🏗️ Arquitectura e Infraestructura: LinkVenta Express

Este documento detalla el stack tecnológico seleccionado para la plataforma. El enfoque principal es **Serverless**, priorizando la velocidad de desarrollo (Vite) y eliminando la necesidad de gestionar servidores backend tradicionales.

> **Convención:** Nombres de tablas, columnas y entidades en **inglés**.

---

## 🛠️ Stack Tecnológico (The Tech Stack)

### 1. Frontend (Interface de Usuario)
* **Framework:** [Vite.js](https://vitejs.dev/) + **React**.
* **Estilos:** **Tailwind CSS** (Para un diseño rápido y mobile-first).
* **Estado & Datos:** **TanStack Query** (React Query) para manejar las peticiones a la base de datos de forma eficiente.
* **Enrutado:** **React Router** para las vistas de creación, éxito y visualización de fichas.

### 2. Backend-as-a-Service (Infraestructura de Datos)
* **Plataforma:** [Supabase](https://supabase.com/).
* **Base de Datos:** **PostgreSQL** (Relacional, ideal para manejar emails y expiraciones).
* **Autenticación:** **Supabase Auth** con proveedores **SSO (Google/Apple)**.
* **Storage:** **Supabase Storage** (Para el alojamiento y optimización de las fotos de los productos).

### 3. Lógica de Servidor (Serverless)
* **Seguridad:** **Row Level Security (RLS)** de Postgres para validar que solo el dueño del email pueda editar su ficha tras loguearse.
* **Automatización:** **Edge Functions** (Deno/TypeScript) para el envío de correos electrónicos y validaciones pesadas.
* **Tareas Programadas:** **pg_cron** (disponible en Supabase) para la limpieza automática de links expirados.

---

## ☁️ Infraestructura y Despliegue

| Componente | Proveedor | Modelo |
| :--- | :--- | :--- |
| **Hosting Frontend** | [Vercel](https://vercel.com/) | Global Edge Network (CDN) |
| **Base de Datos** | [Supabase](https://supabase.com/) | Managed PostgreSQL |
| **Imágenes** | Supabase Storage | S3-Compatible Storage |
| **Dominio/DNS** | Cloudflare | DNS + Protección Anti-DDoS |

---

## 📊 Modelo de Datos (tablas en inglés)

| Tabla | Descripción |
| :--- | :--- |
| **listings** | Fichas de venta: `id`, `short_slug`, `title`, `price`, `currency_code`, `description`, `whatsapp_number`, `creator_email`, `expires_at`, `created_at`, etc. |
| **listing_events** | Eventos para métricas: `id`, `listing_id` (FK), `event_type` (`'view'` \| `'whatsapp_click'`), `created_at`. RLS: solo el dueño de la ficha puede leer; inserción de eventos permitida de forma controlada (p. ej. Edge Function o policy que permita INSERT anónimo solo para `event_type` válido). |

---

## 🔄 Flujo de Datos y Operaciones

### 1. Creación de Ficha (Flujo Anónimo)
1. El cliente (Vite) envía los datos directamente a Supabase (tabla `listings`).
2. Un **Trigger** en la base de datos genera un `short_slug` único.
3. Se establece la columna `expires_at` automáticamente a `now() + 30 days`.

### 2. Vinculación y Edición (Flujo SSO)
1. El usuario inicia sesión con Google/Apple (Supabase Auth).
2. El sistema compara el email del SSO con el campo `creator_email` de la tabla `listings`.
3. Si coinciden, la **RLS Policy** habilita `SELECT`, `UPDATE` y `DELETE` sobre sus filas en `listings`.

### 3. Métricas (vistas y clics WhatsApp)
- **Registro:** Al cargar la ficha pública se registra un evento `view` en `listing_events`. Al hacer clic en el botón WhatsApp se registra `whatsapp_click` (p. ej. desde el frontend vía Edge Function o endpoint que haga INSERT en `listing_events`).
- **Lectura:** El dashboard, una vez autenticado, consulta agregados (COUNT por `listing_id` y `event_type`) sobre `listing_events` uniendo con `listings` donde `creator_email` = usuario; RLS restringe a solo sus fichas.

### 4. Expiración de Links
* **Visualización:** Las consultas públicas siempre filtran `WHERE expires_at > now()`.
* **Limpieza:** Tarea programada (pg_cron) elimina o desactiva registros en `listings` con `expires_at < now()`.

---

## 💰 Estimación de Costos (MVP)

| Servicio | Nivel Gratuito | Costo Inicial |
| :--- | :--- | :--- |
| **Vercel** | Hasta 100GB ancho de banda | $0 |
| **Supabase** | 500MB BD / 5GB Storage | $0 |
| **SSO Auth** | Usuarios ilimitados | $0 |
| **Total** | | **$0 / mes** |