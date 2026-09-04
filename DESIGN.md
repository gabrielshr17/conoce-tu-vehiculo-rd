# Guía de Diseño — Conoce tu Vehículo RD 🏁

> Identidad visual: **racing / pit lane**. Negro, rojo carrera, fibra de carbono.
> La estética cambia; la regla de oro de [PLAN.md](PLAN.md) no: **noob friendly**,
> WCAG AA, sin sacrificar legibilidad por estilo.

---

## 1. Paleta

| Token | Valor | Uso |
|---|---|---|
| `--fondo` | `#0c0c0d` | Fondo base de toda la app (negro carbón) |
| `--superficie` | `#1c1c1f` | Fondo de cards, inputs, tarjetas |
| `--superficie-alta` | `#242427` | Elementos elevados sobre una card (hover, tabbar activo) |
| `--linea` | `rgba(255,255,255,0.10)` | Bordes y separadores sobre fondo oscuro |
| `--tinta` | `#f2f2f0` | Texto principal (blanco hueso, no blanco puro — menos deslumbre) |
| `--gris` | `#9ca0a8` | Texto secundario / metadatos. 7.3:1 sobre `--fondo`, 6.3:1 sobre `--superficie` |
| `--rojo` | `#e10600` | Rojo carrera (F1). Marca, botones primarios, barra de prioridad urgente |
| `--rojo-osc` | `#8f0000` | Rojo oscuro. Estados pressed/hover de elementos rojos |
| `--rojo-brillante` | `#ff5b52` | Rojo claro **solo para texto** sobre fondo oscuro (enlaces, seleccionado, tips) — `--rojo` puro no cumple 4.5:1 como texto |
| `--rojo-tint` | `#2a1012` | Superficie roja oscura (chips, fila seleccionada) |
| `--amarillo` | `#ffc400` | Bandera amarilla — prioridad "pronto" |
| `--verde` | `#00c853` | Bandera verde — prioridad "más adelante" / éxito |

**Regla de contraste:** `--rojo` (#e10600) es para *rellenos* (fondos de botón, barras, bordes
gruesos) con texto blanco encima — nunca como color de texto sobre `--fondo` o `--superficie`
directamente (da 3.9:1, no pasa AA). Para texto o íconos rojos sobre fondo oscuro, usar
siempre `--rojo-brillante`.

No existe modo claro. Es una decisión de marca (identidad "pit lane"), no un tema que siga
`prefers-color-scheme`.

---

## 2. Escalas de espaciado y tipografía

Todo `padding`, `margin` y `gap` del sistema se elige de `--space-1` (4px) hasta `--space-16`
(64px), en pasos de 8px con un medio-paso en 4px — no valores sueltos como `13px` o `9px`.
Todo `font-size` se elige de `--text-2xs` (10px) a `--text-4xl` (40px) — nunca un tamaño con
decimales (`12.5px`, `14.5px`); esos eran artefactos del export original del prototipo.

**Excepción deliberada:** geometría decorativa calculada (el offset de -22px del punto de la
línea de tiempo en Historial, el grosor de 2-3px de un borde de acento, el tamaño de un ícono
dentro de `Wrench`/`Circle`) no es "espaciado" en el sentido del sistema de diseño — son
constantes geométricas de un elemento específico, y se quedan como número literal.

## 3. Tipografía

- **Encabezados, títulos de pantalla, números grandes (costos, km):** `Rajdhani` (Google
  Fonts, pesos 600/700) — condensada, técnica, look de tablero de carreras.
- **Texto de cuerpo, listas, botones, formularios:** se mantiene la fuente del sistema
  (`Segoe UI`/`system-ui`). Un usuario que "no sabe nada de carros" lee párrafos de cuerpo
  todo el tiempo — la fuente estilizada se reserva para donde aporta identidad sin costar
  legibilidad.
- Nunca usar `Rajdhani` en párrafos largos (`.meta`, `.desc`, `.tip`) — solo en títulos y
  cifras destacadas.

---

## 4. Fibra de carbono

Patrón CSS puro (sin imágenes), definido una vez en `tokens.css` como `--carbon-bg` /
`--carbon-size` y aplicado con la propiedad abreviada `background` (no `background-image`:
`--carbon-bg` codifica posición por capa, y `background-image` no acepta eso — el valor
queda inválido en silencio y se resuelve a `none`). Se usa con moderación, solo en elementos
de "marca" (TopBar, sidebar/tabbar de escritorio) — **no** en cards de contenido, donde el
texto necesita un fondo plano para legibilidad.

```css
background: var(--carbon-bg);
background-size: var(--carbon-size);
background-color: var(--superficie); /* fallback, va después del shorthand */
```

---

## 5. Componentes

- **Botón primario:** fondo `--rojo`, texto blanco, sombra roja difusa (`--rojo` a 35%
  opacidad) — simula un "glow" de luz trasera. Esquinas en `--radio-md`, no completamente
  rectas (no queremos look de formulario legal, pero tampoco pastilla suave: el racing es
  anguloso pero no hostil).
- **Botón ghost:** transparente, borde `--linea`, texto `--rojo-brillante`.
- **Barra de prioridad** (`PriorityCard`): franja izquierda de color por semáforo de
  carrera — 🔴 `--rojo` urgente, 🟡 `--amarillo` pronto, 🟢 `--verde` más adelante. Esto ya
  era el patrón antes del rediseño; se mantiene porque es la única codificación de color
  funcional de la app y **no debe romperse** por estética.
- **Chip / etiqueta seleccionada:** fondo `--rojo-tint`, texto `--rojo-brillante` — nunca
  `--rojo` puro como texto.
- **TopBar y sidebar (escritorio):** fondo con textura de fibra de carbono + filete inferior
  o lateral en `--rojo` de 3px (referencia visual a una línea de meta / pit wall).
- **Tarjetas de contenido:** fondo plano `--superficie`, borde `1px solid var(--linea)`.
  Sin textura — priorizan lectura.
- **Íconos de interfaz** (tabs, TopBar, encabezados de sección, botones): `lucide-react`,
  nunca emoji — heredan color vía `currentColor`, así que basta con fijar `color` en el
  contenedor. El texto curado de `src/data/specs/` (tips, descripciones) es la excepción:
  ahí el emoji es voz editorial del contenido, no iconografía de navegación, y se queda.

---

## 6. Accesibilidad (no negociable)

- Todo texto de cuerpo ≥ 4.5:1 de contraste contra su fondo real (verificado arriba).
- Objetivos táctiles ≥ 44px (ya cumplido antes del rediseño — no reducir con el nuevo
  look).
- Foco visible en todo elemento interactivo (outline rojo brillante, nunca `outline: none`
  sin reemplazo).
- El semáforo de prioridad no depende solo del color: cada `PriorityCard` ya incluye texto
  (`dueReason`) — mantener eso al tocar el componente.

---

## 7. Qué NO cambia

El rediseño es visual, no de producto. Se mantienen intactos: `src/core/` (motor de
mantenimiento), la estructura de pantallas, y el criterio "noob friendly" de PLAN.md. Si
un ajuste visual obliga a añadir jerga, reducir contraste o esconder información, el
ajuste está mal y se revierte.
