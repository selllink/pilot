# 🎨 Guía de UI/UX: LinkVenta Express

Este documento define la identidad visual, la experiencia de usuario y la estructura de componentes para la plataforma. El objetivo es una interfaz **"Fast & Clean"** optimizada para conversión en móviles, con **tarjetas flotantes (Bento)** y **limpieza visual**.

> **Convención:** Rutas de componentes, nombres de archivos y código en **inglés** (ej. `src/components/ui/Button.tsx`).

---

## 1. Identidad Visual (Design Tokens)

### Colores
| Uso | Hex | Tailwind Class |
| :--- | :--- | :--- |
| **Fondo App** | `#F8FAFC` | `bg-[#F8FAFC]` |
| **Texto Primario** | `#0F172A` | `text-[#0F172A]` |
| **Acento (Primario)** | Degradado logo | `from-blue-600 to-cyan-500` |
| **WhatsApp (Acción)** | `#22C55E` | `bg-green-500` |
| **Error/Expiración** | `#EF4444` | `text-red-500` |

### Tipografía y labels
* **Labels de campos:** `text-[10px]` en **MAYÚSCULAS**, `font-bold`, `tracking-widest`, `text-slate-400`.
* **Cuerpo/UI:** Sans-serif moderna.
* **Precios/Números:** Negrita para protagonismo.

---

## 2. Estructura global (Layout y Header)

- **Fondo:** `#F8FAFC` en todo el layout para que las tarjetas blancas resalten.
- **Header:** Logo a la izquierda (icono + "LinkVenta Express"); avatar del usuario a la derecha con **borde fino** (`border-2 border-slate-200`) para que no se "pegue" al fondo.
- **Contenedor principal:** `max-w-md` o `max-w-lg` centrado, `space-y-6` entre tarjetas.

---

## 3. Pantallas Principales

### A. Generador (Creación) — Bento Style
- **Fondo:** Gris muy suave `#F8FAFC`; elementos en **tarjetas blancas** (`rounded-[2rem]`, `border border-slate-100`, `shadow-sm`).
- **Módulo de fotos:** El más grande. Borde punteado (`border-dashed`) suave en la zona de agregar fotos. Grid: zona principal (2/3) + miniaturas (1/3).
- **Título y Precio:** En grid 50% cada uno en escritorio; cada uno en su tarjeta con `focus-within:ring-2 focus-within:ring-cyan-400`.
- **Precio:** Selector de moneda **integrado** dentro del campo (a la derecha, `bg-slate-100`), no un cuadro aparte.
- **Email:** Icono de candado o escudo cerca del campo; texto de ayuda: "Para editar después necesitarás iniciar sesión con Google".
- **Botón principal:** Variante **"magic"**: degradado azul eléctrico a cian del logo, efecto glow suave, texto "Generar Link Mágico ✨".
- **Debajo del botón:** "El link será válido por **30 días**. Requiere **SSO** para edición posterior."

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

## 4. Mapa de Componentes (React, nombres en inglés)

### `src/components/ui` (atómicos)
- `Button.tsx`: Variantes (Primary, Secondary, Ghost, WhatsApp, **Magic** con degradado y glow).
- `Input.tsx`: Labels en mayúsculas pequeñas (`text-[10px] uppercase tracking-widest`); opción `card` para tarjeta bento con ring cyan en focus.
- `Badge.tsx`: Estados (Active, Expired).

### `src/components/product` (moleculares)
- `ImageUploader.tsx`: Tarjeta bento con módulo de fotos grande (dashed) + miniaturas en columna.
- `PriceInput.tsx`: Precio con moneda integrada a la derecha dentro del campo (`bg-slate-100`).
- `ImageCarousel.tsx`: Slider táctil optimizado para móvil.
- `PriceTag.tsx`: Formateador según `currency_code`.
- `Countdown.tsx`: Días restantes hasta `expires_at`.

### `src/components/modals`
- `SuccessModal.tsx`: Tras crear la ficha: link corto y botón de copiar.
- `AuthModal.tsx`: Invitación a iniciar sesión vía SSO para editar.

---

## 5. Estrategia de UX (Fricción Cero)

1.  **Skeleton states:** Durante el fetch de Supabase, placeholders animados para evitar layout shift.
2.  **Auto-copy:** Al hacer clic en el link generado, copiar al portapapeles y mostrar toast de confirmación.
3.  **Lazy loading:** Imágenes cargadas al entrar en viewport.
4.  **WhatsApp link:** URL generada con `whatsapp_number` y mensaje predefinido, ej.  
    `https://wa.me/{whatsapp_number}?text=Hola, me interesa tu producto: [title] - [listing_url]`