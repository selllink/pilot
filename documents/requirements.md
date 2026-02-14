# 📋 Especificaciones de Proyecto: LinkVenta Express

Plataforma web minimalista para la creación de fichas de venta rápidas, diseñada para compartir en redes sociales y apps de mensajería sin fricción inicial.

> **Convención:** Componentes, tablas, columnas y código se nombran en **inglés** (ej. tabla `listings`, componente `ImageUploader`).

---

## 🚀 Flujo de Usuario

1.  **Creación:** El usuario completa un formulario (Fotos, Título, Precio, Moneda, Descripción, Email, WhatsApp).
2.  **Publicación:** Se genera una URL única de visualización pública (ej. `app.com/v/a1b2c3d4`).
3.  **Gestión:** Para editar o eliminar, el usuario debe autenticarse vía SSO (Google/Apple) utilizando el mismo email de creación.
4.  **Expiración:** Los links caducan automáticamente a los 30 días (configurable).

---

## 🛠️ Requerimientos Funcionales

### 1. Generador de Fichas (Frontend Público)
- [ ] **Formulario sin registro:** Campos para Título, Precio, Moneda (`currency_code` ISO, ej. USD, MXN), Descripción y Contacto WhatsApp.
- [ ] **Contacto WhatsApp:** Solo número de teléfono. Validación en formato internacional (ej. 5215512345678). El mensaje predefinido se construye en frontend: `wa.me/{number}?text=...` con título y link de la ficha.
- [ ] **Carga de imágenes:** Soporte para hasta 5 fotos con previsualización.
- [ ] **Campo de Email:** Requerido para futura vinculación de cuenta (no se muestra en la ficha pública).
- [ ] **Generación de URL:** Slug aleatorio único (`short_slug`) generado en backend.

### 2. Panel de Gestión (Requiere SSO)
- [ ] **Autenticación:** Login social (Google/Apple) con Supabase Auth.
- [ ] **Dashboard:** Lista de fichas asociadas al email del usuario (tabla `listings`, filtro por `creator_email`).
- [ ] **Acciones:** Editar datos, reemplazar fotos, eliminar ficha, **duplicar ficha** (clonar: mismo contenido, nuevo `short_slug` y nueva `expires_at`).
- [ ] **Estado:** Indicador de días restantes antes de la expiración.
- [ ] **Métricas:** Contador de vistas y de clics en WhatsApp (datos desde tabla `listing_events`).

### 3. Lógica de Negocio & Backend
- [ ] **Configuración de Expiración:** Variable global de sistema (default: 30 días). Columna `expires_at` en `listings`.
- [ ] **Cron Job:** Tarea programada (pg_cron) para desactivar/eliminar registros con `expires_at < now()`.
- [ ] **Eventos para métricas:** Registro de `view` y `whatsapp_click` en tabla `listing_events` (ver arqandinfra.md).
- [ ] **SEO & Social Share:** Etiquetas OpenGraph dinámicas para previsualizaciones en WhatsApp.

---

## 🧱 Requerimientos Técnicos (Stack unificado)

| Componente | Tecnología |
| :--- | :--- |
| **Frontend** | Vite + React |
| **Auth / SSO** | Supabase Auth (Google/Apple) |
| **Base de Datos** | PostgreSQL (Supabase) |
| **Storage (Fotos)** | Supabase Storage |
| **Despliegue** | Vercel |

---

## 🎨 Requerimientos de Diseño (UX/UI)

- **Mobile First:** Interfaz optimizada para pulgares y navegación vertical.
- **Micro-interacciones:** Feedback al copiar el link y al subir imágenes.
- **Modo Oscuro/Claro:** Adaptable según la configuración del sistema del usuario.
- **Ficha de Venta:** Diseño limpio, tipografía legible y botón de CTA (WhatsApp) destacado.

---

## 🔒 Seguridad y Privacidad

- **Protección Anti-Bot:** Implementar CAPTCHA invisible en el formulario de creación.
- **Validación de Archivos:** Restringir tipos de archivo (JPG, PNG, WEBP) y tamaño máximo (5MB).
- **Privacidad de Email:** El email del vendedor nunca debe ser visible en la ficha pública.