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
prototipo/      Prototipo visual clickeable (HTML/CSS)
  index.html      Galería de las 5 pantallas del MVP
  capture.html    Página usada para generar capturas
  shots/          Capturas PNG de cada pantalla
presentacion/   Presentación del proyecto
  build.js         Genera el .pptx con pptxgenjs
  *.pptx / *.pdf   Presentación exportada
```

## Uso

**Ver el prototipo:**
```bash
npx serve prototipo -l 4321
```

**Regenerar la presentación:**
```bash
cd presentacion && npm install && node build.js
```

## Estado

Fase de diseño / prototipo. MVP enfocado: Onboarding → Perfil → Mantenimiento → Historial.
Siguiente paso: scaffold de la app web real (React + Vite) reutilizable hacia móvil (Expo),
con motor híbrido de recomendaciones (base curada + IA).
