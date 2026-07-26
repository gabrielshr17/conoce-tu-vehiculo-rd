# Plan del Proyecto — Conoce tu Vehículo RD 🚗🇩🇴

> Documento vivo. Última actualización: 26 de julio de 2026.

---

## 1. Contexto

Mucha gente en República Dominicana tiene un carro pero **nadie le enseñó a cuidarlo**:
no sabe cuándo darle mantenimiento, qué le conviene, ni a quién preguntarle. Las apps
y guías que existen son internacionales e ignoran lo que un vehículo vive aquí — el
calor, los hoyos, las lluvias, la calidad del combustible, las conversiones a GLP,
la disponibilidad de repuestos y los trámites (marbete, seguro).

**Resultado:** los dueños aprenden cuando ya es tarde y caro.

### La idea en una frase

> Un asesor de bolsillo que conoce **TU** carro y te dice, en cristiano, cómo cuidarlo
> en el contexto dominicano — aunque no sepas nada de mecánica.

### Restricción rectora

**Noob friendly.** Si una persona que no sabe nada de carros no lo entiende, está mal
diseñado. Sin jerga, sin campos que haya que escribir a mano, sin decisiones que el
usuario no sepa tomar.

---

## 2. Estado actual

| Entregable | Estado |
|---|---|
| Prototipo visual clickeable (5 pantallas) | ✅ Hecho — `prototipo/` |
| Presentación del proyecto (pptx + pdf) | ✅ Hecho — `presentacion/` |
| Repositorio git + GitHub (privado) | ✅ Hecho |
| App real | ⬜ Por construir — este plan |

---

## 3. Decisiones tomadas

| Decisión | Elección | Razón |
|---|---|---|
| **Plataforma** | Web primero, móvil después | Web se prototipa y verifica rápido; la lógica se reusa en móvil |
| **Recomendaciones** | Híbrido: base curada + IA | Los números vienen de datos confiables; la IA solo explica |
| **MVP** | Enfocado (4 módulos) | Validar la idea antes de invertir en features avanzadas |
| **Idioma** | Español dominicano, tono cercano | Es el diferenciador y la restricción principal |

---

## 4. Arquitectura

### 4.1 Stack

```
React + Vite + TypeScript          ← app web (MVP)
  ├── src/core/       lógica pura, sin DOM ni React  ← se reusa en móvil tal cual
  ├── src/data/       catálogo de vehículos + datos curados RD
  ├── src/ui/         componentes y pantallas
  └── src/services/   llamadas a APIs
api/ (serverless)                  ← proxy para la API de Claude
```

**Regla de oro:** `src/core/` no importa React ni nada del navegador. Es TypeScript puro
(reglas de mantenimiento, cálculos, tipos). Cuando llegue el móvil con Expo, esa carpeta
se copia sin tocar una línea.

### 4.2 El motor híbrido (lo más importante)

```
   Base curada  ──────┐
   (intervalos,       │
    fluidos, presión) ├──►  Motor de reglas  ──►  Recomendaciones priorizadas
                      │      (TypeScript puro)      🔴 Urgente
   Datos del usuario ─┤                             🟡 Pronto
   (año, km, historial)                             🟢 Más adelante
                      │
                      └──►  Claude  ──►  Lo explica en lenguaje sencillo
```

**La IA nunca inventa números.** No decide cada cuántos kilómetros cambiar el aceite —
eso sale de la base curada. La IA:
- Escribe la descripción humana del vehículo ("Confiable, económico, sin dramas...")
- Traduce lo técnico a lenguaje simple
- Sugiere accesorios y responde dudas (Mecánico Virtual, Fase 2)

> ⚠️ **Seguridad:** la API key de Claude **nunca** va en el frontend. Toda llamada pasa
> por una función serverless. Modelo sugerido: `claude-sonnet-4-6` (balance costo/calidad).

### 4.3 Modelo de datos

```ts
Vehicle        { id, year, make, model, trim, fuelType, currentKm, ownedSince }
VehicleSpec    { oilCapacity, oilType, tireSize, tirePressure, serviceIntervals[] }
MaintenanceItem{ id, name, category, intervalKm, intervalMonths, costDOP, rdModifier? }
HistoryEntry   { id, vehicleId, date, km, type, description, costDOP, shop }
Recommendation { item, priority, reason, dueIn, rdTip? }   // ← calculado, no guardado
```

**Función central del motor** (pura, testeable, sin dependencias):

```ts
recommend(vehicle, history, specs, today) → Recommendation[]
```

Prioridad calculada por: km desde la última vez vs. intervalo, meses transcurridos,
edad del vehículo, y **modificadores RD**.

### 4.4 Modificadores del contexto dominicano

Aquí vive el diferenciador. Cada factor acorta intervalos o levanta avisos:

| Factor | Afecta | Efecto en el motor |
|---|---|---|
| ☀️ Calor y humedad | Batería, A/C, correas, gomas | Intervalo reducido ~20% |
| 🕳️ Hoyos y badenes | Suspensión, gomas, alineación | Revisión más frecuente |
| 🌧️ Época de lluvias (may–nov) | Frenos, limpiaparabrisas, eléctrico | Aviso estacional |
| ⛽ Calidad de combustible | Inyectores, bujías | Limpieza recomendada |
| 🔧 Conversión a GLP | Sistema de gas, válvulas | Plan de mantenimiento aparte |
| 🔩 Repuestos escasos | Piezas específicas por modelo | "Consíguelo con tiempo" |
| 📄 Marbete y seguro | Trámite legal anual | Recordatorio por fecha |

---

## 5. Alcance del MVP

### Pantallas (ya diseñadas en `prototipo/`)

1. **Bienvenida** — entrada, sin fricción
2. **Identifica tu vehículo** — 4 pasos: Año → Marca → Modelo → Versión (todo por lista)
3. **Perfil del Vehículo** — descripción, cómo tratarlo, rendimiento, accesorios, comunidades, ficha
4. **Mantenimiento** — lista priorizada por colores, con costos en RD$ y tips locales
5. **Historial** — línea de tiempo de gastos y reparaciones

### Fuera del MVP (a propósito)

Mecánico Virtual, recordatorios push, cuentas de usuario, multi-vehículo, modo offline.

---

## 6. Milestones

| # | Milestone | Qué incluye | Listo cuando... |
|---|---|---|---|
| **M0** | Fundación | Vite + React + TS, rutas, tokens de diseño extraídos del prototipo | La shell corre y se ve como el prototipo |
| **M1** | Catálogo + Onboarding | Los 4 pasos, catálogo de vehículos, persistencia local | Puedo seleccionar mi carro y sobrevive al refresh |
| **M2** | Perfil del Vehículo | Ficha técnica curada + descripción generada por IA | Veo mi carro descrito en lenguaje humano |
| **M3** | Motor de Mantenimiento | Reglas puras + modificadores RD, con pruebas unitarias | Las recomendaciones cambian correctamente según km y edad |
| **M4** | Historial | Alta/edición de registros, línea de tiempo, realimenta el motor | Registrar un cambio de aceite reordena las prioridades |
| **M5** | Pulido | Responsive, estados vacíos, revisión de textos, accesibilidad | Se lo puedo dar a alguien que no sabe de carros y lo usa solo |

### Después del MVP

- **Fase 2:** Mecánico Virtual (chat IA), recordatorios, estimador de costos RD$, Mi Garaje
- **Fase 3:** App móvil (Expo, reusando `src/core/`), modo offline, cuentas y sincronización, alianzas con talleres

---

## 7. El riesgo real: los datos curados

**Este es el cuello de botella del proyecto, no el código.**

Las APIs públicas (NHTSA vPIC) dan año/marca/modelo gratis y sin llave, pero **no dan**
intervalos de servicio, capacidades de aceite ni presiones de gomas — y mucho menos el
contexto dominicano. Eso hay que curarlo a mano.

**Estrategia:** no intentar cubrir todos los vehículos. Arrancar con los **~20 modelos más
comunes en RD** (Corolla, Civic, CR-V, Hilux, Accent, Elantra, Sentra, Tucson, Rio, Yaris…)
y expandir según demanda. Para lo no cubierto, mostrar recomendaciones genéricas por tipo
de vehículo y decirlo honestamente.

**Fuentes:** manuales del fabricante, guías de mecánicos, comunidades y grupos locales.

---

## 8. Verificación

Cada milestone se comprueba corriendo la app de verdad, no solo leyendo el código:

- **Motor de mantenimiento (M3):** pruebas unitarias sobre `recommend()` con casos concretos
  — carro de 11 años con 98,500 km y aceite vencido debe dar 🔴; correa de tiempo a 120k debe dar 🟢.
- **Flujos (M1, M2, M4):** levantar el dev server y recorrer el flujo en el navegador,
  revisando consola y capturas.
- **La prueba que importa (M5):** dárselo a alguien que no sepa nada de carros y ver si
  entiende qué hacer **sin que nadie le explique**. Si hay que explicarle, hay que rediseñar.

---

## 9. Próximo paso

**M0 — Fundación:** inicializar React + Vite + TypeScript en este repo y portar los tokens
visuales del prototipo (`prototipo/index.html`) a componentes.
