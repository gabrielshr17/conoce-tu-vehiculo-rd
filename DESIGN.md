# Guía de Diseño — Conoce tu Vehículo RD

> Identidad visual: **Gran Turismo**. Pizarra oscura, rojo carrera, tipografía técnica.
> Fuente de verdad visual: `design.pen` (frames "Gran Turismo – Perfil" y "Gran Turismo –
> Mantenimiento"). La regla de oro de [PLAN.md](PLAN.md) no cambia: **noob friendly**, WCAG AA,
> y **ningún número inventado** — si el diseño muestra un dato que la app no puede calcular,
> ese elemento se reemplaza por uno real o se omite.

---

## 1. Paleta

| Token | Valor | Uso |
|---|---|---|
| `--fondo` | `#0b0e14` | Fondo base de toda la app |
| `--superficie` | `#131923` | Cards, inputs, filas de lista |
| `--superficie-alta` | `#1c2433` | Cajas de ícono, botones secundarios, elementos sobre una card |
| `--superficie-hero` | gradiente `#1a2230 → #101520` | Solo la card héroe del vehículo y el resumen de estado |
| `--barra` | `#101622` | Barra de pestañas / sidebar |
| `--linea` | `#222d3e` | Bordes y separadores |
| `--linea-fuerte` | `#2a364d` | Borde de card héroe, botones secundarios, bordes punteados |
| `--tinta` | `#f1f5f9` | Texto principal |
| `--tinta-suave` | `#cbd5e1` | Texto de lectura larga (cita del vehículo). 11.9:1 sobre `--superficie` |
| `--gris` | `#94a3b8` | Texto secundario / metadatos. 6.9:1 sobre `--superficie` |
| `--gris-tenue` | `#8a98ae` | Etiquetas pequeñas y pestañas inactivas. 6.0:1 sobre `--superficie`, 6.2:1 sobre `--barra` |
| `--rojo` | `#e53935` | Acento de marca: íconos, bordes, barra de prioridad urgente, pestaña activa |
| `--rojo-relleno` | `#d32f2f` | Fondo de botones/pastillas con texto blanco (4.98:1) |
| `--sobre-rojo` | `#ffffff` | Texto e íconos sobre `--rojo-relleno` |
| `--rojo-osc` | `#b71c1c` | Estado pressed de botones rojos |
| `--rojo-brillante` | `#ff6b6b` | Rojo **para texto** sobre fondo oscuro (6.4–7.0:1) |
| `--rojo-tint` | `#2a1618` | Superficie roja oscura (chips, badge urgente, avisos) |
| `--amarillo` / `--amarillo-tint` | `#f59e0b` / `#2a1e10` | Prioridad "pronto" (7.6:1 texto sobre tint) |
| `--amarillo-suave` | `#f3d9a4` | Texto de tips RD sobre `--amarillo-tint` (11.8:1) |
| `--verde` / `--verde-texto` / `--verde-tint` | `#10b981` / `#34d399` / `#10261e` | Prioridad "más adelante" / estado al día / éxito |

**Correcciones de contraste respecto a `design.pen`** (verificadas con la fórmula WCAG 2.x):

- Blanco sobre `#e53935` da 4.23:1 → no pasa AA en texto pequeño. Todo relleno con texto blanco
  (botón primario, filtro activo, "Guardar") usa `--rojo-relleno`.
- `#e53935` como texto da ~4.5:1 solo sobre `--fondo`, y menos sobre cualquier superficie. Texto
  rojo → siempre `--rojo-brillante` ("Ver todos", chips, badge urgente).
- `#64748b` (etiquetas y pestañas inactivas del pen) da 3.6–3.8:1 → reemplazado por
  `--gris-tenue`.
- Etiquetas de 9px del pen → mínimo `--text-2xs` (10px).

No existe modo claro. Es una decisión de marca, no un tema que siga `prefers-color-scheme`.

---

## 2. Escalas

**Espaciado:** todo `padding`, `margin` y `gap` sale de `--space-1` (4px) a `--space-16` (64px),
base-8 con medio-paso en 4px.

**Tipografía:** todo `font-size` sale de `--text-2xs` (10px) a `--text-4xl` (40px). Sin decimales.

**Radios:** `--radio-2xs` 6px (badges) · `--radio-xs` 8px (cajas de ícono, botones pequeños) ·
`--radio-sm` 12px (filas, datos clave) · `--radio-md` 14px (cards de servicio) · `--radio-lg`
18px (barra de pestañas, resumen) · `--radio` 20px (card héroe) · `--radio-pill` (filtros,
pastilla de estado). Mayor jerarquía → radio mayor.

**Excepción deliberada:** geometría decorativa de un elemento concreto (offset del punto de la
línea de tiempo, grosor de 2–3px de un borde de acento, 44px de objetivo táctil, tamaño de caja de
ícono de 32/36px, anillo de 52px) se queda como número literal.

---

## 3. Tipografía

Tres familias (Google Fonts), cada una con un rol único:

- **Space Grotesk** (`--font-display`, 600/700) — nombre del vehículo, títulos de pantalla,
  títulos de card, encabezados de sección, cifras destacadas.
- **Outfit** (`--font-label`, 500/700/800) — etiquetas cortas: badges, pestañas, filtros,
  etiquetas de métricas, costos y texto de botones.
- **Inter** (`--font`, 400/500/600) — todo texto de lectura: descripciones, avisos, formularios.

Nunca Space Grotesk ni Outfit en párrafos. Los encabezados de sección y etiquetas de métrica van
en mayúsculas con tracking (1–1.5px) — es parte de la identidad del pen, pero solo en textos de
≤3 palabras.

---

## 4. Componentes

- **Card héroe del vehículo** (Perfil): `--superficie-hero`, marca/modelo en Space Grotesk
  mayúsculas, subtítulo año · versión · combustible, badge de categoría (Sedán/SUV/…) del
  catálogo, silueta SVG genérica (`CarSilhouette`) y fila de 3 métricas reales: odómetro,
  servicios pendientes, combustible.
  - La foto del pen (`generated.png`) **no** se usa: es imagen de marca de terceros y no tenemos
    una por modelo.
  - "Rendimiento km/g" y "GT Edition" del pen se reemplazaron porque la app no tiene esos datos.
- **Pastilla de estado** (`Badge shape="pill" dot`): Al día / Pronto / Atención, derivada de
  `summarizeRecommendations` (el peor estado manda).
- **Resumen de estado** (Mantenimiento): título + anillo con ícono (escudo / reloj / alerta) en
  el color del estado y conteo de pendientes. Reemplaza el "92% Óptimo" del pen, que no tiene
  fórmula real detrás.
- **Card de servicio** (`PriorityCard`): caja de ícono por categoría, título, badge de
  prioridad, tip RD en ámbar (mismo tratamiento que el tip de temporada — el rojo es solo urgencia), fila inferior con ícono `Timer` + `dueReason` y costo estimado del
  catálogo, botón "Marcar hecho". Conserva la **franja izquierda de 3px** con el semáforo:
  `--rojo` urgente, `--amarillo` pronto, `--verde` más adelante. Es la codificación de color funcional
  de la app — se acompaña siempre de texto (badge + `dueReason`).
- **Filtros**: pastillas Todos / Urgente / Pronto / Más adelante con conteo; solo aparecen las
  prioridades con elementos (si un filtro se queda en 0, vuelve a Todos). Activo = `--rojo-relleno` + blanco. `aria-pressed`.
- **Chip** (`Chip`): etiqueta pasiva (accesorios). Neutra — `--superficie-alta`, borde
  `--linea`, texto `--tinta-suave`. El rojo queda para lo seleccionado o accionable.
- **Badge** (`Badge`): tonos `danger` / `warning` / `success` sobre su tint. Nunca color solo.
  La prioridad `later` dice "Más adelante", no "Al día" como el pen: un servicio sin registro
  no está "al día", solo no toca todavía según el estimado.
- **Botón primario:** `--rojo-relleno`, texto blanco, sombra roja difusa, `--radio-md`.
- **Botón secundario** ("Editar km", "Marcar hecho"): `--superficie-alta`, borde
  `--linea-fuerte`, borde `--rojo` en hover.
- **Barra de pestañas (móvil):** flotante, `--barra`, `--radio-lg`, 4 pestañas — Vehículo,
  Servicios, Historial, Consejos. Activa: ícono `--rojo`, texto `--tinta` en 700. "Salir" vive en
  el encabezado de Perfil.
- **Sidebar (≥768px):** la misma navegación en columna, con marca "RD" arriba y "Salir" abajo.
- **Íconos:** `lucide-react`, nunca emoji. El texto curado de `src/data/specs/` conserva su emoji
  como voz editorial del contenido.

---

## 5. Pantallas y flujo móvil

| Pestaña | Ruta | Contenido |
|---|---|---|
| Vehículo | `/perfil` | Card héroe, "Tu carro en pocas palabras", próximos 2 servicios + "Ver todos (n)", datos clave |
| Servicios | `/mantenimiento` | Resumen de estado, editar km, filtros, cards de servicio, tip RD, trámites |
| Historial | `/historial` | Sin cambios de estructura |
| Consejos | `/consejos` | Cuidados, rendimiento, accesorios, comunidades (movidos desde Perfil) |

**Breakpoints:** diseño base 375px. `768px` → sidebar en lugar de barra inferior y contenido con
`max-width: 1100px`. `1024px` → Perfil y Consejos pasan a dos columnas.

---

## 6. Accesibilidad (no negociable)

- Todo texto ≥ 4.5:1 contra su fondo real (tabla §1).
- Objetivos táctiles ≥ 44px (pestañas, filtros, "Editar km", "Salir", "Ver todos").
- Foco visible en todo elemento interactivo (`outline` `--rojo-brillante`).
- Prioridad nunca solo por color: badge con texto + `dueReason`.

---

## 7. Qué NO cambia

El rediseño es visual, no de producto. `src/core/` sigue siendo la única fuente de cálculos (el
único agregado es `summarizeRecommendations`, que resume la salida del motor sin inventar datos).
Si un ajuste visual obliga a añadir jerga, reducir contraste, esconder información o mostrar un
número sin fuente, el ajuste está mal y se revierte.
