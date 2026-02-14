# 🎨 Guía de UI/UX: LinkVenta Express

Este documento define la identidad visual, la experiencia de usuario y la estructura de componentes para la plataforma. El objetivo es una interfaz **"Fast & Clean"** optimizada para conversión en móviles.

> **Convención:** Rutas de componentes, nombres de archivos y código en **inglés** (ej. `src/components/ui/Button.tsx`).

---

## 1. Identidad Visual (Design Tokens)

### Colores
| Uso | Hex | Tailwind Class |
| :--- | :--- | :--- |
| **Fondo App** | `#F8FAFC` | `bg-slate-50` |
| **Texto Primario** | `#0F172A` | `text-slate-900` |
| **Acento (Primario)** | `#4F46E5` | `bg-indigo-600` |
| **WhatsApp (Acción)** | `#22C55E` | `bg-green-500` |
| **Error/Expiración** | `#EF4444` | `text-red-500` |

### Tipografía
* **Cuerpo/UI:** `Inter` o `Geist` (Sans-serif moderna).
* **Precios/Números:** `JetBrains Mono` (Para legibilidad y estética de "etiqueta").

---

## 2. Pantallas Principales

### A. Generador (Creación)
- **Foco:** Cero distracciones. Un solo flujo vertical.
- **Componentes clave:**
    - `ImageUploader`: Preview de miniaturas con botón de eliminar.
    - `PriceInput`: Campo numérico con selector de moneda (`currency_code`) integrado.
    - `EmailField`: Input obligatorio con validación visual.
    - `WhatsAppNumberInput`: Número en formato internacional, validado.
- **Micro-interacción:** Barra de progreso sutil en la parte superior.

### B. Ficha Pública (Visualización)
- **Foco:** El producto es el protagonista.
- **Layout:**
    - **Header:** Botón "Compartir" y "Atrás".
    - **Carrusel:** Imágenes en ratio 1:1 o 4:3 con indicadores de puntos.
    - **Body:** Precio (H1, con `currency_code`), Título (H2), Descripción (P), Badge de expiración.
    - **Footer Sticky:** Botón ancho de WhatsApp (genera `wa.me/{number}?text=...`) que no desaparece al hacer scroll.
- **Métricas:** Al montar la vista se registra un evento `view` en `listing_events`; al clic en WhatsApp se registra `whatsapp_click`.

### C. Dashboard (Gestión SSO)
- **Foco:** Control y métricas rápidas.
- **Vista:** Lista de tarjetas compactas (datos de `listings` + agregados de `listing_events`).
- **Acciones:** Editar, Eliminar, Duplicar (clonar ficha: nuevo `short_slug`, nueva `expires_at`).
- **Métricas:** Contador de vistas y de clics en WhatsApp por ficha.

---

## 3. Mapa de Componentes (React, nombres en inglés)

### `src/components/ui` (atómicos)
- `Button.tsx`: Variantes (Primary, Secondary, Ghost, WhatsApp).
- `Input.tsx`: Estilo minimalista con focus state en Indigo.
- `Badge.tsx`: Estados (Active, Expired).

### `src/components/product` (moleculares)
- `ImageCarousel.tsx`: Slider táctil optimizado para móvil.
- `PriceTag.tsx`: Formateador según `currency_code`.
- `Countdown.tsx`: Días restantes hasta `expires_at`.

### `src/components/modals`
- `SuccessModal.tsx`: Tras crear la ficha: link corto y botón de copiar.
- `AuthModal.tsx`: Invitación a iniciar sesión vía SSO para editar.

---

## 4. Estrategia de UX (Fricción Cero)

1.  **Skeleton states:** Durante el fetch de Supabase, placeholders animados para evitar layout shift.
2.  **Auto-copy:** Al hacer clic en el link generado, copiar al portapapeles y mostrar toast de confirmación.
3.  **Lazy loading:** Imágenes cargadas al entrar en viewport.
4.  **WhatsApp link:** URL generada con `whatsapp_number` y mensaje predefinido, ej.  
    `https://wa.me/{whatsapp_number}?text=Hola, me interesa tu producto: [title] - [listing_url]`