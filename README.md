# Conoce tu Vehículo RD 🚗🇩🇴

App para dueños de vehículos en República Dominicana — especialmente para quienes
no saben nada de carros. Ingresas año, marca, modelo y versión, y recibes:

- Un **perfil** del vehículo con cómo tratarlo, mejor rendimiento, accesorios y comunidades.
- **Mantenimiento inteligente** según edad, kilometraje e historial, con contexto dominicano
  (calor, hoyos, lluvias, combustible, GLP, marbete/seguro).
- Un **historial** de reparaciones y gastos.

> Un asesor de bolsillo que conoce tu carro y te dice, en cristiano, cómo cuidarlo.

## Estructura

```
src/            App web (React + Vite + TypeScript)
  core/           Tipos de dominio + motor de mantenimiento puro (recommend())
    maintenance/    catalog.ts, rdModifiers.ts, engine.ts + pruebas (vitest)
  data/catalog/   Catálogo semilla de ~20 modelos comunes en RD
  storage/        Persistencia del vehículo + historial (localStorage)
  ui/             tokens.css, componentes base, layout con tab bar
  screens/        Welcome, Onboarding, Profile, Maintenance, History
prototipo/      Prototipo visual clickeable (HTML/CSS)
  index.html      Galería de las 5 pantallas del MVP
  capture.html    Página usada para generar capturas
  shots/          Capturas PNG de cada pantalla
presentacion/   Presentación del proyecto
  build.js         Genera el .pptx con pptxgenjs
  *.pptx / *.pdf   Presentación exportada
PLAN.md         Visión, arquitectura y decisiones del proyecto
MVP.md          Plan de ejecución del MVP, milestone por milestone
```

## Uso

**Correr la app:**
```bash
npm install
npm run dev
```

**Ver el prototipo:**
```bash
npx serve prototipo -l 4321
```

**Regenerar la presentación:**
```bash
cd presentacion && npm install && node build.js
```

**Correr las pruebas del motor de mantenimiento:**
```bash
npm test
```

## Estado

- **M0 (Fundación):** shell de React Router con tab bar inferior, tokens de diseño
  portados del prototipo, y componentes base (Button, Card, Chip, Stepper, TopBar).
- **M1 (Catálogo + Onboarding):** flujo real de 4 pasos (Año → Marca → Modelo → Versión)
  sobre un catálogo semilla de ~20 modelos, con búsqueda en cada paso. El vehículo elegido
  se guarda en localStorage y sobrevive al refresh; sin vehículo guardado, el shell
  redirige automáticamente a la Bienvenida.
- **M3 (Motor de Mantenimiento):** `recommend()` puro y testeado (6 pruebas) con
  modificadores del contexto RD (calor, hoyos, combustible) y tip estacional de lluvias.
  Pantalla de Mantenimiento con prioridades por color y prompt de odómetro.
- **M4 (Historial):** alta, edición y borrado de registros con línea de tiempo y gasto
  total. "Marcar hecho" desde Mantenimiento crea un registro y **reordena las
  recomendaciones al instante** (verificado en navegador).

Siguiente: M2, el Perfil del Vehículo con contenido curado (ver [MVP.md](MVP.md)).
