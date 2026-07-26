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

### 2.1 Tipos de item

| Tipo | Se calcula por | Ejemplo |
|---|---|---|
| `recurring` | Km **o** meses — lo que llegue primero | Aceite: 5,000 km / 6 meses |
| `milestone` | Un umbral único de odómetro | Correa de tiempo: 120,000 km |
| `inspection` | Revisión periódica, no reemplazo | Suspensión, frenos |
| `legal` | Solo fecha | Marbete, seguro |

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

**Si nunca se hizo** y no hay historial: se asume vencido y se le pide al usuario que
confirme o registre la última vez. Nunca se inventa una fecha.

### 2.3 Modificadores RD

El factor acorta el intervalo efectivo. Valores **iniciales, a validar** con mecánicos locales:

| Factor | Items afectados | Factor |
|---|---|---|
| ☀️ Calor y humedad | Batería, A/C, correas, mangueras | 0.75 |
| 🕳️ Hoyos y badenes | Amortiguadores, alineación, gomas | 0.70 |
| ⛽ Calidad de combustible | Inyectores, bujías, filtro de combustible | 0.80 |
| 🌧️ Lluvias (may–nov) | Frenos, limpiaparabrisas | Aviso estacional, no factor |
| 🔧 GLP/gas | Válvulas, sistema de gas | Plan aparte |

Ejemplo real: batería estándar 4 años × 0.75 = **3 años en RD** — coincide con lo que
muestra el prototipo.

### 2.4 Casos de prueba (M3 no está listo sin esto)

```
Corolla 2015, 98,500 km, aceite hecho a los 97,300 km hace 5 meses
  → progreso = 1,200/5,000 = 0.24 → 🟢

Mismo carro, aceite hecho a los 92,000 km hace 8 meses
  → km: 6,500/5,000 = 1.30 → 🔴 Urgente (vencido por km)

Batería instalada hace 3 años y 1 mes
  → meses: 37/36 (48 × 0.75) = 1.03 → 🔴  ← el modificador RD la adelantó

Correa de tiempo, umbral 120,000 km, carro en 98,500
  → milestone lejano → 🟢

Marbete vencido el mes pasado
  → legal, por fecha → 🔴
```

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

### M0 — Fundación
- [ ] `npm create vite` con React + TypeScript en la raíz del repo
- [ ] Extraer colores y tipografía del prototipo a `ui/tokens.css`
- [ ] Componentes base: `Button`, `Card`, `Chip`, `Stepper`
- [ ] Rutas y shell de navegación (tab bar inferior)
- **Listo cuando:** la shell corre en el navegador y se ve como el prototipo

### M1 — Catálogo + Onboarding
- [ ] Tipos en `core/types.ts`
- [ ] Catálogo semilla en `data/catalog/`
- [ ] Pantalla de Bienvenida
- [ ] Los 4 pasos (Año → Marca → Modelo → Versión), todo por lista, con búsqueda
- [ ] `storage/repository.ts` + implementación en localStorage
- **Listo cuando:** selecciono mi carro y sobrevive al refresh

### M2 — Perfil del Vehículo
- [ ] Fichas curadas de los modelos semilla en `data/specs/`
- [ ] Descripciones pre-generadas y revisadas
- [ ] Pantalla de Perfil: descripción, cómo tratarlo, rendimiento, accesorios, comunidades, ficha
- [ ] Estado honesto para vehículos fuera de la semilla
- **Listo cuando:** veo mi carro descrito en lenguaje humano, sin jerga

### M3 — Motor de Mantenimiento ⭐
- [ ] `catalog.ts` con los items genéricos
- [ ] `rdModifiers.ts`
- [ ] `engine.ts` con `recommend()`
- [ ] **Pruebas unitarias** con los casos de §2.4
- [ ] Pantalla de Mantenimiento: prioridades por color, costos, tip RD estacional
- **Listo cuando:** las pruebas pasan y las prioridades cambian bien según km y edad

### M4 — Historial
- [ ] Alta y edición de registros (fecha, km, tipo, costo, taller)
- [ ] Línea de tiempo + total gastado
- [ ] **Realimentación:** registrar algo reordena las recomendaciones
- [ ] Acción "Marcar hecho" desde Mantenimiento crea el registro
- **Listo cuando:** marco un cambio de aceite y esa tarjeta pasa de 🔴 a 🟢

### M5 — Pulido
- [ ] Responsive (móvil primero) y estados vacíos
- [ ] Revisión de **todos** los textos: cero jerga
- [ ] Accesibilidad: contraste, tamaños táctiles, navegación por teclado
- [ ] Validar precios RD$ con talleres reales
- **Listo cuando:** pasa la prueba del §6

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
