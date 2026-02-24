# 🎨 Guía de UI/UX: LinkVenta Express

Este documento define la identidad visual, la experiencia de usuario y la estructura de componentes para la plataforma. El objetivo es una interfaz **"Fast & Clean"** optimizada para conversión en móviles, con **tarjetas flotantes (Bento)** y **limpieza visual**.

> **Convención:** Rutas de componentes, nombres de archivos y código en **inglés** (ej. `src/components/ui/Button.tsx`).

---

## 1. Identidad Visual (Design Tokens)

### Colores
| Uso | Hex / referencia | Tailwind Class |
| :--- | :--- | :--- |
| **Fondo página** | `#F8FAFC` | `bg-[#F8FAFC]` |
| **Header** | Blanco | `bg-white` |
| **Texto primario** | `#0F172A` | `text-[#0F172A]` |
| **Acento / CTA** | Degradado logo | `from-blue-600 to-cyan-500` |
| **Glow cyan (focus)** | Cyan suave | `shadow-[0_0_0_2px_rgba(34,211,238,0.35)]`, focus más intenso |
| **WhatsApp / SSO** | Verde | `bg-green-500`, texto blanco |
| **Error / expiración** | Rojo | `text-red-500` |

### Tipografía
* **Títulos hero:** `text-3xl` / `sm:text-4xl`, `font-extrabold`, `tracking-tight`, `text-[#0F172A]`.
* **Acento en hero:** "solo link" con `bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent`.
* **Cuerpo / subtítulos:** `text-sm`, `text-slate-600`.
* **Campos:** Sin labels externos; solo placeholders (ej. "¿Qué vendes?", "Describe tu producto", "WhatsApp number").
* **Precios / números:** `font-bold`, `tabular-nums` donde aplique.

---

## 2. Estructura global (Layout y Header)

- **Fondo app:** `#F8FAFC` en el contenedor principal; el **header** es blanco (`bg-white`) con `border-b border-slate-100`.
- **Header:**
  - Izquierda: logo (icono) + **"LinkVenta"** en negrita `text-[#0F172A]` + **"Express"** en gris (`text-slate-400`).
  - Derecha: botón **"Mis Listings"** (pill sutil: `rounded-full`, `border border-slate-200/80`, `bg-white/90`, `text-xs font-medium text-slate-500`) y, si hay usuario logueado, **avatar** (UserMenu).
- **Contenedor principal:** `max-w-md` o `max-w-lg` centrado; en CreatePage el formulario usa `space-y-4`.

---

## 3. Pantalla de creación (CreatePage)

La página de crear listing (`src/pages/CreatePage.tsx`) se compone de: **hero** + **formulario**. Sin labels externos en los campos; el texto va en placeholders o dentro del componente.

### 3.1 Hero (arriba del formulario)

- **Título:**  
  "Tus ventas, a un **solo link** de distancia."  
  - "solo link" con degradado `from-blue-600 to-cyan-500`; el resto en `text-[#0F172A]`.
- **Subtítulo:**  
  "Diseñado para vendedores de redes sociales. Crea listings rápidos que tus clientes amarán."  
  - `text-sm`, `text-slate-600`, `mt-4`.
- **Pasos (1. Crea, 2. Comparte, 3. Vende):**  
  - Iconos (lápiz, compartir, chat) sin círculo, `h-5 w-5`, `text-slate-600`.  
  - Texto: `text-sm font-bold uppercase tracking-widest text-slate-600`, en una fila con `gap-6`.
- **Pill informativa:**  
  "Links activos por **30 días** • Edita con **SSO**"  
  - `rounded-2xl bg-slate-100 px-4 py-3`, icono de reloj pequeño (`h-3.5 w-3.5`) a la izquierda, texto `text-xs font-medium text-slate-600`; "30 días" y "SSO" en negrita.
- **Espaciado:** sección con `mb-5`.

### 3.2 Formulario (orden de campos)

1. **Título (¿Qué vendes?)**  
   - `Input` con `card`, solo placeholder "¿Qué vendes?", sin label. Primero que completa el usuario.

2. **Fotos del producto**  
   - `ImageUploader` con `showTitle={false}`.  
   - Texto principal: "Agrega fotos de tu producto"; secundario: "Hasta 5 fotos · JPG, PNG o WebP · máx. 5 MB".  
   - Zona con borde dashed, hover cyan suave; botón "Agregar" en miniaturas.

3. **Precio**  
   - `PriceInput`: solo input numérico + selector de moneda (ARS / USD) a la derecha, sin label "PRICE".  
   - Monedas definidas en `src/lib/localeCurrency.ts` (por ahora solo ARS y USD).

4. **Descripción**  
   - `Input` con `card`, placeholder "Describe tu producto", sin label.

5. **WhatsApp**  
   - Un solo bloque: input + badge "Protected by SSO" en la misma fila.  
   - Contenedor: `rounded-[2.5rem]`, fondo blanco, borde y sombra cyan (`shadow-[0_0_0_2px_rgba(34,211,238,0.35)]` y más intenso en `focus-within`).  
   - Placeholder del input: "WhatsApp number".  
   - Badge verde: `rounded-xl bg-green-500`, texto blanco "Protected by SSO", a la derecha del input.

6. **Email (si no hay Google)**  
   - Bloque con icono de candado; campo "Tu email", placeholder "tú@ejemplo.com".  
   - Texto de ayuda: "Para editar después necesitarás iniciar sesión con Google."

7. **Botón principal**  
   - "Generar mi Link Mágico ✨" (o "Generando…" al enviar).  
   - `Button` variante `magic`, `py-5`, `text-[11px] font-extrabold uppercase tracking-[0.2em]`.

8. **Footer del formulario**  
   - "Únete a +1000 vendedores que ya usan LinkVenta para sus historias."  
   - `text-xs font-medium text-slate-500`, centrado.

---

## 4. Otras pantallas (resumen)

### Ficha pública (ViewPage)
- Header con "Compartir" y "Atrás"; carrusel de imágenes; precio, título, descripción, badge de expiración; footer sticky con botón WhatsApp.

### Dashboard
- Mismo header global (logo, Mis Listings, avatar). Contenido: botón "Create new listing ✨", bloque "Compartir mi tienda", lista de listings con métricas (vistas, WhatsApp), acciones Editar / Ver / Duplicar / Eliminar.

---

## 5. Mapa de componentes (React)

### `src/components/ui`
- **Button.tsx:** Variantes Primary, Secondary, Ghost, WhatsApp, **Magic** (degradado azul–cian y glow).
- **Input.tsx:** Soporte `card` (tarjeta bento con ring cyan en focus); labels opcionales en mayúsculas pequeñas.

### `src/components/product`
- **ImageUploader.tsx:** Tarjeta bento, zona principal dashed + miniaturas; textos "Agrega fotos de tu producto" y límites; sin label superior si `showTitle={false}`.
- **PriceInput.tsx:** Campo numérico + select de moneda (ARS/USD) a la derecha; sin label; estilos focus cyan.
- **WhatsAppNumberInput.tsx:** Input tel con placeholder "WhatsApp number"; usado con `hideLabel` cuando el padre controla el bloque (placeholder + badge SSO).
- **PriceTag.tsx**, **ImageCarousel.tsx**, etc.: para ficha pública y listados.

### `src/lib/localeCurrency.ts`
- Monedas del selector: `getLocaleCurrencies()` → ARS y USD.
- Moneda por defecto al crear: `getLocaleCurrencyCode()` → `'ARS'`.

---

## 6. Estrategia de UX (Fricción Cero)

1. **Sin doble etiqueta:** Campos con solo placeholder o texto dentro del componente (ej. WhatsApp, precio, título).
2. **Hero claro:** Mensaje "solo link", pasos 1–2–3 y pill de 30 días/SSO para dar contexto antes de completar.
3. **Orden del formulario:** Título → Fotos → Precio → Descripción → WhatsApp → Email (si aplica) → Botón.
4. **Auto-copy / toasts:** Al copiar el link generado, feedback claro.
5. **WhatsApp:** Link `wa.me/{number}?text=...` desde el número del listing.
