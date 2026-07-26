const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "..", "prototipo", "shots");
const img = (n) => path.join(SHOTS, n);

// ---- Palette (brand blue + DR flag accents) ----
const NAVY_D = "0A2A5E", NAVY = "0D3D7A", BLUE = "1565C0", BLUE_L = "E8F1FB";
const BG = "F4F7FB", INK = "13202E", MUTED = "5B6B7E", LINE = "E3E9F0", WHITE = "FFFFFF";
const ROJO = "E53935", AMBER = "F08C00", VERDE = "2E9E5B", RDRED = "CE1126";
const HEAD = "Trebuchet MS", BODY = "Calibri";

const pres = new pptxgen();
pres.defineLayout({ name: "W", width: 13.33, height: 7.5 });
pres.layout = "W";
pres.author = "Conoce tu Vehículo RD";
pres.title = "Conoce tu Vehículo RD";

const sh = () => ({ type: "outer", color: "0A2A5E", blur: 10, offset: 3, angle: 135, opacity: 0.20 });
const shLite = () => ({ type: "outer", color: "8AA0BC", blur: 8, offset: 2, angle: 135, opacity: 0.18 });

const ASPECT = 600 / 1280; // screenshot w/h

// Phone screenshot with rounded bezel + shadow. Returns width used.
function phone(slide, file, x, y, h) {
  const w = h * ASPECT;
  const pad = 0.06;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x - pad, y: y - pad, w: w + pad * 2, h: h + pad * 2,
    fill: { color: "0A1A2F" }, rectRadius: 0.16, shadow: sh(),
  });
  slide.addImage({ path: file, x, y, w, h });
  return w;
}

// Rounded card
function card(slide, x, y, w, h, fill, opts = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, fill: { color: fill }, rectRadius: opts.r || 0.12,
    line: opts.line ? { color: opts.line, width: 1 } : { type: "none" },
    shadow: opts.shadow ? shLite() : undefined,
  });
}

// Emoji in a colored circle
function bubble(slide, emoji, x, y, d, fill) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill } });
  slide.addText(emoji, { x, y, w: d, h: d, fontSize: d * 36, align: "center", valign: "middle", margin: 0 });
}

// Dominican Republic flag drawn with shapes (flag emoji renders as "DO" in PowerPoint)
function drFlag(slide, x, y, w, h) {
  const pad = h * 0.07;
  const cross = Math.min(w, h) * 0.14;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - pad, y: y - pad, w: w + 2 * pad, h: h + 2 * pad,
    fill: { color: WHITE }, rectRadius: 0.03, shadow: shLite() });
  const cw = (w - cross) / 2, ch = (h - cross) / 2;
  const BLU = "002D62", RED = "CE1126";
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: BLU }, line: { type: "none" } });
  slide.addShape(pres.shapes.RECTANGLE, { x: x + cw + cross, y, w: cw, h: ch, fill: { color: RED }, line: { type: "none" } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y: y + ch + cross, w: cw, h: ch, fill: { color: RED }, line: { type: "none" } });
  slide.addShape(pres.shapes.RECTANGLE, { x: x + cw + cross, y: y + ch + cross, w: cw, h: ch, fill: { color: BLU }, line: { type: "none" } });
}

function kicker(slide, text, x, y, color) {
  slide.addText(text, { x, y, w: 9, h: 0.3, fontFace: HEAD, fontSize: 12, bold: true,
    color, charSpacing: 3, margin: 0 });
}

// ============================================================ SLIDE 1 — Portada
let s = pres.addSlide();
s.background = { color: NAVY_D };
s.addShape(pres.shapes.OVAL, { x: -2.5, y: -3, w: 7, h: 7, fill: { color: NAVY }, line: { type: "none" } });
s.addShape(pres.shapes.OVAL, { x: 8.5, y: 3.8, w: 8, h: 8, fill: { color: "0B3168" }, line: { type: "none" } });

drFlag(s, 0.9, 0.62, 0.52, 0.35);
kicker(s, "APP MÓVIL  ·  REPÚBLICA DOMINICANA", 0.85, 1.3, "8FB4E8");
s.addText("Conoce tu\nVehículo RD", { x: 0.8, y: 1.7, w: 8.2, h: 2.6, fontFace: HEAD, fontSize: 60,
  bold: true, color: WHITE, lineSpacing: 58, margin: 0 });
s.addText("Cuida tu carro como un experto, sin serlo.", { x: 0.85, y: 4.35, w: 8, h: 0.6,
  fontFace: BODY, fontSize: 24, color: "CADCFC", margin: 0 });
s.addText([
  { text: "🚗  ", options: {} },
  { text: "Tu asesor de bolsillo que conoce tu carro y el contexto dominicano.", options: { italic: true } },
], { x: 0.85, y: 5.15, w: 8, h: 0.6, fontFace: BODY, fontSize: 15, color: "9FB6D6", margin: 0 });

phone(s, img("1-bienvenida.png"), 10.05, 0.7, 6.1);

// ============================================================ SLIDE 2 — El problema
s = pres.addSlide();
s.background = { color: BG };
kicker(s, "EL PROBLEMA", 0.7, 0.55, BLUE);
s.addText("Tener carro no significa saber cuidarlo", { x: 0.7, y: 0.85, w: 12, h: 0.8,
  fontFace: HEAD, fontSize: 34, bold: true, color: INK, margin: 0 });

const probs = [
  ["🤷", "Nadie te enseñó", "Tienes un vehículo, pero no sabes cuándo darle mantenimiento ni cómo tratarlo.", BLUE],
  ["🌎", "Apps que no aplican", "Las guías internacionales ignoran el clima, las calles y los repuestos de RD.", AMBER],
  ["💸", "Sale caro", "Un descuido se convierte en reparaciones costosas y en un carro que se daña antes.", ROJO],
];
let cx = 0.7;
const cw = 3.95, gap = 0.25;
probs.forEach((p, i) => {
  const x = 0.7 + i * (cw + gap);
  card(s, x, 2.0, cw, 4.4, WHITE, { shadow: true, r: 0.14 });
  bubble(s, p[0], x + 0.35, 2.4, 1.0, BLUE_L);
  s.addText(p[1], { x: x + 0.35, y: 3.6, w: cw - 0.7, h: 0.5, fontFace: HEAD, fontSize: 21, bold: true, color: INK, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: x + 0.37, y: 4.15, w: 0.7, h: 0.05, fill: { color: p[3] }, line: { type: "none" } });
  s.addText(p[2], { x: x + 0.35, y: 4.35, w: cw - 0.7, h: 1.7, fontFace: BODY, fontSize: 16, color: MUTED, lineSpacing: 22, margin: 0 });
});
s.addText("La mayoría de los dueños aprenden... cuando ya es tarde.", { x: 0.7, y: 6.7, w: 12, h: 0.5,
  fontFace: BODY, fontSize: 16, italic: true, color: BLUE, margin: 0 });

// ============================================================ SLIDE 3 — La solución
s = pres.addSlide();
s.background = { color: NAVY_D };
s.addShape(pres.shapes.OVAL, { x: 9, y: -3.5, w: 9, h: 9, fill: { color: NAVY }, line: { type: "none" } });
kicker(s, "LA SOLUCIÓN", 0.8, 0.7, "8FB4E8");
s.addText("Una app que habla tu idioma", { x: 0.8, y: 1.0, w: 8.5, h: 0.8, fontFace: HEAD,
  fontSize: 34, bold: true, color: WHITE, margin: 0 });

s.addText([
  { text: "“Un asesor de bolsillo que conoce ", options: {} },
  { text: "TU", options: { bold: true, color: "8FE3B0" } },
  { text: " carro y te dice, en cristiano, cómo cuidarlo — aunque no sepas nada de mecánica.”", options: {} },
], { x: 0.8, y: 2.0, w: 7.7, h: 2.2, fontFace: HEAD, fontSize: 30, italic: true, color: "E8F1FB", lineSpacing: 38, margin: 0 });

const sols = [
  ["🔎", "Identifica tu carro en segundos"],
  ["📘", "Aprende a cuidarlo sin jerga técnica"],
  ["🛠️", "Recibe mantenimiento a la medida de RD"],
];
sols.forEach((p, i) => {
  const y = 4.55 + i * 0.82;
  bubble(s, p[0], 0.85, y, 0.6, "12407F");
  s.addText(p[1], { x: 1.65, y: y, w: 7, h: 0.6, fontFace: BODY, fontSize: 18, color: "CADCFC", valign: "middle", margin: 0 });
});

phone(s, img("3-perfil.png"), 10.0, 0.75, 6.0);

// ============================================================ SLIDE 4 — Cómo funciona
s = pres.addSlide();
s.background = { color: BG };
kicker(s, "CÓMO FUNCIONA", 0.7, 0.5, BLUE);
s.addText("Cuatro pasos, cero complicación", { x: 0.7, y: 0.8, w: 12, h: 0.7, fontFace: HEAD,
  fontSize: 32, bold: true, color: INK, margin: 0 });

const steps = [
  ["2-onboarding.png", "1", "Identifica", "Año, marca, modelo y versión — eligiendo de listas."],
  ["3-perfil.png", "2", "Conoce", "Descripción, cuidados, accesorios y comunidades."],
  ["4-mantenimiento.png", "3", "Cuida", "Mantenimiento por edad, km y contexto dominicano."],
  ["5-historial.png", "4", "Registra", "El historial de gastos y reparaciones de tu carro."],
];
const ph = 4.0, pw = ph * ASPECT;
const totalW = steps.length * pw + (steps.length - 1) * 0.85;
let startX = (13.33 - totalW) / 2;
steps.forEach((st, i) => {
  const x = startX + i * (pw + 0.85);
  phone(s, img(st[0]), x, 1.85, ph);
  // step number badge
  s.addShape(pres.shapes.OVAL, { x: x - 0.12, y: 1.7, w: 0.62, h: 0.62, fill: { color: BLUE }, shadow: shLite() });
  s.addText(st[1], { x: x - 0.12, y: 1.7, w: 0.62, h: 0.62, fontFace: HEAD, fontSize: 22, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
  s.addText(st[2], { x: x - 0.3, y: 6.0, w: pw + 0.6, h: 0.4, fontFace: HEAD, fontSize: 18, bold: true, color: INK, align: "center", margin: 0 });
  s.addText(st[3], { x: x - 0.45, y: 6.42, w: pw + 0.9, h: 0.9, fontFace: BODY, fontSize: 12.5, color: MUTED, align: "center", lineSpacing: 15, margin: 0 });
});

// ============================================================ SLIDE 5 — Contexto RD
s = pres.addSlide();
s.background = { color: BG };
kicker(s, "NUESTRO DIFERENCIADOR", 0.7, 0.5, RDRED);
s.addText("Pensada para República Dominicana", { x: 0.7, y: 0.8, w: 10.4, h: 0.7, fontFace: HEAD, fontSize: 32, bold: true, color: INK, margin: 0 });
drFlag(s, 11.95, 0.78, 0.7, 0.47);
s.addText("Ninguna app internacional considera lo que tu carro vive aquí.", { x: 0.7, y: 1.5, w: 12, h: 0.4, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0 });

const rd = [
  ["☀️", "Calor y humedad", "Batería, A/C, gomas y correas se gastan más rápido."],
  ["🕳️", "Hoyos y badenes", "Cuida la suspensión y las gomas en cada viaje."],
  ["🌧️", "Lluvias e inundaciones", "Alertas de frenos y sistema eléctrico por temporada."],
  ["⛽", "Combustible variable", "Recomendaciones de limpieza de inyectores y aditivos."],
  ["🔧", "Conversión a GLP/gas", "Mantenimiento específico para taxis y conchos."],
  ["📄", "Marbete y seguro", "Recordatorios de los trámites obligatorios cada año."],
];
const gw = 3.95, gh = 1.95, gx0 = 0.7, gy0 = 2.1, ggap = 0.25;
rd.forEach((it, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = gx0 + col * (gw + ggap), y = gy0 + row * (gh + 0.3);
  card(s, x, y, gw, gh, WHITE, { shadow: true, r: 0.12 });
  s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.12, w: 0.08, h: gh - 0.24, fill: { color: RDRED }, line: { type: "none" } });
  bubble(s, it[0], x + 0.28, y + 0.32, 0.78, "FDEBEC");
  s.addText(it[1], { x: x + 1.2, y: y + 0.3, w: gw - 1.4, h: 0.55, fontFace: HEAD, fontSize: 17, bold: true, color: INK, valign: "middle", margin: 0 });
  s.addText(it[2], { x: x + 1.2, y: y + 0.85, w: gw - 1.4, h: 0.9, fontFace: BODY, fontSize: 13, color: MUTED, lineSpacing: 16, margin: 0 });
});

// ============================================================ SLIDE 6 — Funcionalidades
s = pres.addSlide();
s.background = { color: NAVY_D };
s.addShape(pres.shapes.OVAL, { x: -3, y: 4, w: 8, h: 8, fill: { color: NAVY }, line: { type: "none" } });
kicker(s, "FUNCIONALIDADES CLAVE", 0.8, 0.6, "8FB4E8");
s.addText("Todo lo que tu carro necesita, en un solo lugar", { x: 0.8, y: 0.9, w: 12, h: 0.7,
  fontFace: HEAD, fontSize: 30, bold: true, color: WHITE, margin: 0 });

const feats = [
  ["🚙", "Perfil del vehículo", "Conoce tu carro y cómo darle el mejor trato.", "MVP"],
  ["🛠️", "Mantenimiento inteligente", "Sugerencias según edad, km e historial.", "MVP"],
  ["📋", "Historial", "La hoja de vida de tu carro y sus gastos.", "MVP"],
  ["🤖", "Mecánico Virtual", "Describe un ruido o síntoma y recibe respuestas claras.", "Fase 2"],
  ["🔔", "Recordatorios", "Aceite, marbete, seguro y revisiones a tiempo.", "Fase 2"],
  ["💰", "Estimador en RD$", "Sabe cuánto costaría cada reparación aquí.", "Fase 2"],
];
const fw = 3.9, fh = 2.35, fx0 = 0.8, fy0 = 1.95, fgap = 0.3;
feats.forEach((it, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = fx0 + col * (fw + fgap), y = fy0 + row * (fh + 0.3);
  card(s, x, y, fw, fh, "0E335F", { r: 0.14, line: "1C4A86" });
  bubble(s, it[0], x + 0.3, y + 0.3, 0.8, "12407F");
  // badge MVP / Fase 2
  const badgeC = it[3] === "MVP" ? "8FE3B0" : "F3C96B";
  s.addText(it[3], { x: x + fw - 1.35, y: y + 0.32, w: 1.05, h: 0.32, fontFace: HEAD, fontSize: 10, bold: true,
    color: NAVY_D, align: "center", valign: "middle", fill: { color: badgeC }, margin: 0 });
  s.addText(it[1], { x: x + 0.3, y: y + 1.25, w: fw - 0.6, h: 0.45, fontFace: HEAD, fontSize: 17, bold: true, color: WHITE, margin: 0 });
  s.addText(it[2], { x: x + 0.3, y: y + 1.68, w: fw - 0.6, h: 0.6, fontFace: BODY, fontSize: 13, color: "AFC4E0", lineSpacing: 16, margin: 0 });
});

// ============================================================ SLIDE 7 — Tecnología
s = pres.addSlide();
s.background = { color: BG };
kicker(s, "CÓMO LO CONSTRUIMOS", 0.7, 0.55, BLUE);
s.addText("Tecnología confiable + inteligencia artificial", { x: 0.7, y: 0.85, w: 12, h: 0.7,
  fontFace: HEAD, fontSize: 32, bold: true, color: INK, margin: 0 });

const tech = [
  ["📱", "Web y móvil", "Una sola base de código para llegar a todos: navegador hoy, app iOS y Android después.", BLUE],
  ["🧠", "Motor híbrido", "Base de datos curada y confiable + IA (Claude) que lo explica en lenguaje sencillo.", VERDE],
  ["📚", "Datos confiables", "Manuales de fabricante, guías de mecánicos y la sabiduría de las comunidades RD.", AMBER],
];
tech.forEach((p, i) => {
  const x = 0.7 + i * (cw + gap);
  card(s, x, 2.1, cw, 3.7, WHITE, { shadow: true, r: 0.14 });
  bubble(s, p[0], x + 0.35, 2.5, 1.0, BLUE_L);
  s.addText(p[1], { x: x + 0.35, y: 3.7, w: cw - 0.7, h: 0.5, fontFace: HEAD, fontSize: 20, bold: true, color: INK, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: x + 0.37, y: 4.2, w: 0.7, h: 0.05, fill: { color: p[3] }, line: { type: "none" } });
  s.addText(p[2], { x: x + 0.35, y: 4.4, w: cw - 0.7, h: 1.3, fontFace: BODY, fontSize: 15, color: MUTED, lineSpacing: 21, margin: 0 });
});
card(s, 0.7, 6.15, 11.95, 0.95, "0E335F", { r: 0.12 });
s.addText([
  { text: "🤖  Potenciado por IA: ", options: { bold: true, color: "8FE3B0" } },
  { text: "explicaciones simples, recomendaciones a la medida y un Mecánico Virtual que responde tus dudas.", options: { color: "E8F1FB" } },
], { x: 1.0, y: 6.15, w: 11.4, h: 0.95, fontFace: BODY, fontSize: 15, valign: "middle", margin: 0 });

// ============================================================ SLIDE 8 — Roadmap
s = pres.addSlide();
s.background = { color: BG };
kicker(s, "HACIA DÓNDE VAMOS", 0.7, 0.55, BLUE);
s.addText("Un camino por fases", { x: 0.7, y: 0.85, w: 12, h: 0.7, fontFace: HEAD,
  fontSize: 32, bold: true, color: INK, margin: 0 });

const phases = [
  [BLUE, "FASE 1 · MVP", "Lo esencial", ["Identifica tu vehículo", "Perfil del vehículo", "Mantenimiento básico", "Historial manual"]],
  [VERDE, "FASE 2", "Más inteligente", ["Mecánico Virtual (IA)", "Recordatorios", "Estimador en RD$", "Mi Garaje (varios autos)"]],
  [AMBER, "FASE 3", "A lo grande", ["App móvil nativa", "Modo offline", "Comunidad integrada", "Alianzas con talleres"]],
];
phases.forEach((p, i) => {
  const x = 0.7 + i * (cw + gap);
  card(s, x, 2.05, cw, 4.55, WHITE, { shadow: true, r: 0.14 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.05, w: cw, h: 1.0, fill: { color: p[0] }, rectRadius: 0.14 });
  s.addShape(pres.shapes.RECTANGLE, { x, y: 2.5, w: cw, h: 0.55, fill: { color: p[0] }, line: { type: "none" } });
  s.addText(p[1], { x: x + 0.35, y: 2.18, w: cw - 0.7, h: 0.35, fontFace: HEAD, fontSize: 13, bold: true, color: WHITE, charSpacing: 2, margin: 0 });
  s.addText(p[2], { x: x + 0.35, y: 2.5, w: cw - 0.7, h: 0.5, fontFace: HEAD, fontSize: 22, bold: true, color: WHITE, margin: 0 });
  p[3].forEach((it, j) => {
    const y = 3.4 + j * 0.72;
    s.addShape(pres.shapes.OVAL, { x: x + 0.4, y: y + 0.06, w: 0.22, h: 0.22, fill: { color: p[0] } });
    s.addText("✓", { x: x + 0.4, y: y + 0.06, w: 0.22, h: 0.22, fontFace: HEAD, fontSize: 11, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
    s.addText(it, { x: x + 0.75, y: y, w: cw - 1.05, h: 0.45, fontFace: BODY, fontSize: 15, color: INK, valign: "middle", margin: 0 });
  });
});

// ============================================================ SLIDE 9 — Cierre
s = pres.addSlide();
s.background = { color: NAVY_D };
s.addShape(pres.shapes.OVAL, { x: -3, y: -3.5, w: 8, h: 8, fill: { color: NAVY }, line: { type: "none" } });
s.addShape(pres.shapes.OVAL, { x: 9, y: 3, w: 8, h: 8, fill: { color: "0B3168" }, line: { type: "none" } });
drFlag(s, 6.27, 1.35, 0.8, 0.53);
s.addText("Conoce tu Vehículo RD", { x: 1, y: 2.55, w: 11.33, h: 1.0, fontFace: HEAD, fontSize: 48, bold: true, color: WHITE, align: "center", margin: 0 });
s.addText("Cuidar tu carro nunca fue tan fácil — ni tan dominicano.", { x: 1, y: 3.75, w: 11.33, h: 0.6, fontFace: BODY, fontSize: 22, color: "CADCFC", align: "center", margin: 0 });
s.addText("Hecho para República Dominicana", { x: 1, y: 4.8, w: 11.33, h: 0.5, fontFace: HEAD, fontSize: 15, bold: true, color: "8FB4E8", align: "center", charSpacing: 2, margin: 0 });
s.addText("¡Gracias!", { x: 1, y: 5.7, w: 11.33, h: 0.6, fontFace: HEAD, fontSize: 20, italic: true, color: "8FE3B0", align: "center", margin: 0 });

pres.writeFile({ fileName: path.join(__dirname, "Conoce-tu-Vehiculo-RD.pptx") }).then((f) => {
  console.log("OK ->", f);
});
