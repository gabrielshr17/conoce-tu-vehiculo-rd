# Plan del MVP — Conoce tu Vehículo RD

> Plan de ejecución. Para el "por qué" y la visión, ver [PLAN.md](PLAN.md).

**Meta del MVP:** que una persona que no sabe nada de carros pueda identificar el suyo,
entender cómo cuidarlo y saber qué necesita **ahora mismo** — sin que nadie le explique.

---

## 1. Estructura de archivos

```
src/
  core/                          ← TypeScript puro. Sin React, sin DOM. Portable a móvil.
    types.ts                       Vehicle, MaintenanceItem, HistoryEntry, Recommendation
    maintenance/
      catalog.ts                   Items de mantenimiento genéricos (aceite, frenos…)
      rdModifiers.ts               Modificadores del contexto dominicano
      engine.ts                    recommend() ← el corazón
      engine.test.ts               Pruebas unitarias
    format.ts                      RD$, kilómetros, fechas en español

  data/
    catalog/                       Año / marca / modelo / versión (semilla RD)
    specs/                         Fichas curadas por modelo (aceite, gomas, intervalos)
    descriptions/                  Descripciones pre-generadas (ver §4)
    accessories.ts
    communities.ts

  storage/
    repository.ts                  Interfaz (para poder cambiar a backend sin tocar la UI)
    localStorage.ts                Implementación del MVP

  ui/
    tokens.css                     Colores y tipografía extraídos del prototipo
    components/                    Button, Card, PriorityCard, Chip, Stepper, Timeline
    screens/
      Welcome/  Onboarding/  Profile/  Maintenance/  History/

  App.tsx
  main.tsx
```

**Regla:** `src/core/` no importa nada de React ni del navegador. Se copia tal cual al móvil.

---

## 2. El motor de mantenimiento

La pieza más importante del MVP. Función **pura** — misma entrada, misma salida, siempre:

```ts
recommend(vehicle, history, specs, today) → Recommendation[]
```

`today` se pasa como parámetro (no `new Date()` adentro) para que las pruebas sean
deterministas.

### 2.1 Tipos de item — **implementado más simple de lo planeado**

Al construir el motor, `milestone`/`inspection`/`recurring` resultaron ser matemáticamente
idénticos (todos son "intervalo por km y/o por meses, lo que llegue primero" — la
diferencia era solo de nombre/copy, no de cálculo). `MaintenanceItem` quedó unificado:
todo item tiene `intervalKm?` y/o `intervalMonths?`, y el nombre (`"Cambio de aceite"`,
`"Correa de tiempo"`) ya comunica el tipo sin necesitar un enum aparte.

`legal` (marbete, seguro) se **sacó del motor calculado**: requeriría pedirle al usuario
la fecha exacta de vencimiento, algo que no se recolecta en ningún punto de la app todavía.
En vez de fabricar un cálculo con datos que no tenemos, el MVP los muestra como
recordatorio estático en la pantalla de Mantenimiento. Se retoma cuando exista un lugar
natural en la UX para pedir esas fechas (candidato: Fase 2).

| Concepto | Se calcula por | Ejemplo |
|---|---|---|
| Item con intervalo | Km **y/o** meses — lo que llegue primero | Aceite: 5,000 km / 6 meses · Batería: solo meses |
| Legal (fuera del motor) | Solo fecha, no implementado aún | Marbete, seguro → recordatorio estático |

### 2.2 Cálculo

```
kmDesde      = kmActual − kmÚltimaVez
mesesDesde   = meses entre últimaFecha y hoy

intervaloEfectivoKm = intervaloKm × factorRD        ← aquí entra el contexto dominicano

progreso = max( kmDesde / intervaloEfectivoKm ,  mesesDesde / intervaloMeses )
```

| Progreso | Prioridad |
|---|---|
| ≥ 1.0 | 🔴 **Urgente** (vencido) |
| ≥ 0.8 | 🟡 **Pronto** |
| < 0.8 | 🟢 **Más adelante** |

**Si nunca se hizo** y no hay historial: se calcula "como si el carro fuera nuevo" (0 km /
año del vehículo) — no se inventa una fecha de último servicio. `hasHistory: false` viaja
en cada `Recommendation` para que la UI lo señale (ver hallazgo en §2.4).

### 2.3 Modificadores RD

El factor acorta el intervalo efectivo. Valores **iniciales, a validar** con mecánicos
locales. Implementado en `rdModifiers.ts`, con un modificador por cada item afectado
(no por categoría genérica, para no aplicarlo de más a items no relacionados):

| Factor | Item afectado | Factor |
|---|---|---|
| ☀️ Calor y humedad | Batería | 0.75 |
| 🕳️ Hoyos y badenes | Gomas, alineación | 0.70 |
| ⛽ Calidad de combustible | Bujías | 0.80 |
| 🌧️ Lluvias (may–nov) | Aviso estacional (frenos/limpiaparabrisas) — no ajusta intervalos, solo un tip en pantalla | — |
| 🔧 GLP/gas | No implementado — la app no sabe si el vehículo fue convertido (ver nota abajo) | — |

**GLP/gas:** ninguna pantalla recolecta todavía si el dueño convirtió su carro a gas (es
una modificación posterior, no un dato del catálogo). Queda como hueco conocido para una
futura pantalla de "información adicional del vehículo".

Ejemplo real: batería estándar 4 años × 0.75 = **3 años en RD** — coincide con lo que
muestra el prototipo.

### 2.4 Casos de prueba — verificados en `engine.test.ts` (6 pruebas, todas pasan)

```
Corolla 2015, 98,500 km, aceite hecho a los 97,300 km hace 3 meses
  → km: 1,200/5,000=0.24, meses: 3/6=0.5 → progreso=max(0.24,0.5)=0.5 → 🟢

Mismo carro, aceite hecho a los 92,000 km hace 8 meses
  → km: 6,500/5,000=1.30, meses: 8/6=1.33 → progreso=1.33 → 🔴 Urgente

Batería instalada hace 3 años y 1 mes (37 meses)
  → sin modificador: 37/48=0.77 (later) — con modificador RD (0.75): 37/36=1.03 → 🔴
  ← el modificador es lo que cambia el resultado, ese es el punto de la prueba

Correa de tiempo en un carro 2023 con 30,000 km, sin historial
  → km: 30,000/100,000=0.30, meses (desde 2023): 42/84=0.5 → progreso=0.5 → 🟢
  hasHistory=false ✓
```

**Hallazgo al implementar:** para un carro *viejo* sin ningún historial, la fórmula
"asumir desde el año del vehículo" hace que TODO salga 🔴 a la vez (11 años > cualquier
intervalo). Matemáticamente correcto, pero se siente como una alarma falsa/poco confiable
para alguien que recién termina el onboarding. Se resolvió en la UI (Maintenance.tsx), no
en el motor: un banner explica la situación ("como es la primera vez, asumimos que nunca
se le ha hecho mantenimiento...") e invita a registrar el historial real para afinar. El
motor y sus pruebas se dejaron intactos — es un problema de presentación, no de cálculo.

---

## 3. Datos: el catálogo semilla

**No intentar cubrir todos los vehículos.** Arrancar con ~20 modelos comunes en RD y
expandir según uso real.

Lista **inicial a validar** (no es dato verificado — confirmar con concesionarios,
talleres y comunidades antes de fijarla):

> Toyota Corolla · Yaris · Hilux · RAV4 — Honda Civic · CR-V · Fit — Hyundai Accent ·
> Elantra · Tucson — Kia Rio · Sportage — Nissan Sentra · Versa · Frontier —
> Mitsubishi Lancer — Suzuki Grand Vitara — Daihatsu Terios — Ford Ranger — Chevrolet Aveo

**Arquitectura de datos en dos capas:**

1. **Catálogo genérico** — intervalos estándar por tipo de vehículo (sedán, SUV, pickup)
2. **Override por modelo** — lo que dice el manual del fabricante, cuando lo tengamos

Si un vehículo no está en la semilla: mostrar recomendaciones genéricas por tipo y
**decirlo honestamente** ("Aún no tenemos datos específicos de tu versión; esto es lo
general para un sedán de este año").

### Sobre los precios en RD$

Los costos del prototipo (aceite ~RD$2,500, gomas ~RD$16,000, batería ~RD$4,500) son
**estimados de referencia, no verificados**. Antes de M5 hay que contrastarlos con
talleres reales y mostrarlos siempre como rango aproximado, nunca como precio fijo.

---

## 4. La IA en el MVP (decisión que simplifica mucho)

La descripción de un vehículo **no cambia por usuario** — el texto de un Corolla 2015 LE
es el mismo para todos. Entonces:

> **Se pre-generan las descripciones de los ~20 modelos semilla y se guardan como datos
> estáticos en `src/data/descriptions/`.**

Consecuencias:
- ✅ El MVP **no necesita llamadas a la API en tiempo de ejecución**
- ✅ Sin costo por usuario, sin latencia, funciona sin conexión
- ✅ **No hace falta el proxy serverless todavía** — se difiere a Fase 2
- ✅ Cada texto se revisa a mano antes de entrar (calidad garantizada)

El proxy serverless y las llamadas en vivo llegan con el **Mecánico Virtual (Fase 2)**,
que sí es conversacional y no se puede pre-generar.

---

## 5. Milestones y tareas

### M0 — Fundación ✅
- [x] `npm create vite` con React + TypeScript en la raíz del repo
- [x] Extraer colores y tipografía del prototipo a `ui/tokens.css`
- [x] Componentes base: `Button`, `Card`, `Chip`, `Stepper`
- [x] Rutas y shell de navegación (tab bar inferior)
- **Listo cuando:** la shell corre en el navegador y se ve como el prototipo

### M1 — Catálogo + Onboarding ✅
- [x] Tipos en `core/types.ts`
- [x] Catálogo semilla en `data/catalog/`
- [x] Pantalla de Bienvenida
- [x] Los 4 pasos (Año → Marca → Modelo → Versión), todo por lista, con búsqueda
- [x] `storage/repository.ts` + implementación en localStorage
- **Listo cuando:** selecciono mi carro y sobrevive al refresh

### M3 — Motor de Mantenimiento ⭐ ✅
- [x] `catalog.ts` con los items genéricos
- [x] `rdModifiers.ts`
- [x] `engine.ts` con `recommend()`
- [x] **Pruebas unitarias** con los casos de §2.4 (6 pruebas, ver hallazgo documentado ahí)
- [x] Pantalla de Mantenimiento: prioridades por color, costos, tip RD estacional
- **Listo cuando:** las pruebas pasan y las prioridades cambian bien según km y edad

### M4 — Historial ✅
- [x] Alta y edición de registros (fecha, km, tipo, costo, taller)
- [x] Línea de tiempo + total gastado
- [x] **Realimentación:** registrar algo reordena las recomendaciones (verificado en navegador)
- [x] Acción "Marcar hecho" desde Mantenimiento crea el registro
- **Listo cuando:** marco un cambio de aceite y esa tarjeta pasa de 🔴 a 🟢

### M2 — Perfil del Vehículo ✅
- [x] Fichas curadas de los modelos semilla en `data/specs/` (los 20 modelos, contenido
      diferenciado por tipo de vehículo — no plantilla genérica repetida)
- [x] Descripciones pre-generadas y revisadas
- [x] Pantalla de Perfil: descripción, cómo tratarlo, rendimiento, accesorios, comunidades, ficha
- [x] Estado honesto para vehículos fuera de la semilla (verificado en navegador)
- **Listo cuando:** veo mi carro descrito en lenguaje humano, sin jerga

### M5 — Pulido ✅
- [x] Responsive: columna centrada tipo celular en pantallas anchas (`max-width: 480px`),
      fluida en móvil real; verificado que la altura del shell sigue llenando el viewport
- [x] Estados vacíos (historial sin registros, búsqueda sin resultados — ya cubiertos en
      M1/M4)
- [x] Revisión de textos: se encontraron y corrigieron 3 términos técnicos sin explicar
      ("CVT", "diferencial") en las fichas de M2
- [x] Accesibilidad: contraste de `--gris` subido de 4.38:1 a 5.46:1 (no cumplía WCAG AA),
      tamaños táctiles de 44px en botones pequeños (atrás, marcar hecho, editar/eliminar),
      foco visible restaurado en el buscador (tenía `outline:none` sin reemplazo),
      confirmado que todo elemento clicable es `<button>`/`<input>` real (nav. por teclado
      nativa, sin `tabIndex` roto)
- [ ] Validar precios RD$ con talleres reales — **no se puede hacer sin contacto real
      con talleres**; queda marcado como estimado sin validar en toda la UI
- **Listo cuando:** pasa la prueba del §6 — pendiente de una prueba con un usuario real

**Bug encontrado y corregido durante el pulido:** rehacer el onboarding con un vehículo
ya guardado generaba un `id` nuevo, dejando huérfano el historial existente (los
registros seguían en localStorage pero invisibles, porque `historyRepository.getAll`
filtra por `vehicleId`). Ahora el onboarding reutiliza el `id`, `createdAt` y `currentKm`
del vehículo existente si lo hay — verificado en navegador: el historial sobrevive a un
re-onboarding que corrige la versión elegida.

---

## 6. La prueba que decide si el MVP sirve

> Dárselo a alguien que **no sepa nada de carros**, sin explicarle nada, y pedirle que
> averigüe qué necesita su vehículo.

Si pregunta "¿y ahora qué hago?" o "¿qué significa esto?", **no está listo** — se rediseña
esa pantalla. Ese es el criterio de aceptación real del MVP, por encima de cualquier
checklist técnico.

---

## 7. Orden recomendado

```
M0 → M1 → M3 → M4 → M2 → M5
```

**M3 (el motor) antes que M2 (el perfil)** a propósito: el motor es donde está el valor
y el riesgo técnico. El perfil es mayormente contenido curado y se puede ir llenando en
paralelo. Si el motor no funciona bien, el proyecto no sirve — mejor descubrirlo temprano.
