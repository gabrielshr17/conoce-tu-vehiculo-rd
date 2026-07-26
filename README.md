# Conoce tu Vehículo RD 🚗🇩🇴

App para dueños de vehículos en República Dominicana — especialmente para quienes
no saben nada de carros. Ingresas año, marca, modelo y versión, y recibes:

- Un **perfil** del vehículo con cómo tratarlo, mejor rendimiento, accesorios y comunidades.
- **Mantenimiento inteligente** según edad, kilometraje e historial, con contexto dominicano
  (calor, hoyos, lluvias, combustible, marbete/seguro).
- Un **historial** de reparaciones y gastos.

> Un asesor de bolsillo que conoce tu carro y te dice, en cristiano, cómo cuidarlo.

## Estructura

```
src/            App web (React + Vite + TypeScript)
  core/           Tipos de dominio + motor de mantenimiento puro (recommend())
    maintenance/    catalog.ts, rdModifiers.ts, engine.ts + pruebas (vitest)
  data/catalog/   Catálogo semilla de ~20 modelos comunes en RD
  data/specs/     Fichas curadas por modelo (descripción, cuidados, accesorios...)
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

**MVP completo (M0–M5).** Las 5 pantallas funcionan de punta a punta:

- **Onboarding** de 4 pasos sobre un catálogo semilla de 20 modelos comunes en RD.
- **Perfil** con contenido curado y diferenciado por modelo (no plantilla genérica):
  descripción, cuidados, rendimiento, accesorios, comunidad y ficha técnica. Estado
  honesto para vehículos fuera de la semilla.
- **Mantenimiento** con un motor puro y testeado (`recommend()`, 6 pruebas unitarias)
  que calcula prioridades por km/meses con modificadores del contexto RD (calor, hoyos,
  combustible) y un tip estacional de lluvias.
- **Historial** con alta, edición y borrado de registros. Marcar un servicio como hecho
  **reordena las recomendaciones al instante** (realimentación verificada en navegador).
- Responsive (columna centrada tipo celular en pantallas anchas), contraste y tamaños
  táctiles ajustados a WCAG AA, sin jerga técnica sin explicar.

Todo el vehículo/historial persiste en localStorage y sobrevive a un refresh real.

**Pendiente, fuera del alcance de este entorno:** validar precios RD$ y la lista de
modelos semilla con talleres/mecánicos reales (ver PLAN.md §7); ejecutar la prueba de
usuario real del §6 de [MVP.md](MVP.md).

**Siguiente fase** (ver [PLAN.md](PLAN.md)): Mecánico Virtual (IA), recordatorios,
estimador de costos, Mi Garaje (multi-vehículo), y eventualmente la versión móvil (Expo).
