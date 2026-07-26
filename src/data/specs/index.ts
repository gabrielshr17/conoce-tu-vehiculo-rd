import type { VehicleSpec } from './types';

/**
 * Fichas curadas para los ~20 modelos del catálogo semilla. Contenido de
 * referencia basado en características generales conocidas de cada modelo —
 * no verificado con manuales de fabricante ni mecánicos dominicanos. Ver
 * PLAN.md §7 y MVP.md §3. Un modelo que no aparece aquí muestra un estado
 * honesto en la pantalla de Perfil, no contenido inventado.
 */
export const VEHICLE_SPECS: VehicleSpec[] = [
  {
    modelId: 'toyota-corolla',
    description:
      'Confiable, económico y fácil de mantener. Sus piezas se consiguen fácil en RD y aguanta bien el uso diario — un compañero sin dramas.',
    careTips: [
      { icon: '🛢️', title: 'Aceite a tiempo', description: 'Es lo que más alarga la vida de este motor, que de por sí es longevo.' },
      { icon: '🌡️', title: 'Ojo con el calor', description: 'Revisa el refrigerante seguido; el clima de RD exige más al motor.' },
    ],
    performanceTips: [
      { icon: '🛞', title: 'Presión de gomas correcta', description: 'Ahorra combustible y evita desgaste por los hoyos.' },
    ],
    accessories: ['Tapasol parabrisas', 'Alfombras de goma', 'Cargador USB', 'Filtro de aire deportivo'],
    communities: [
      { name: 'Corolla Club RD', platform: 'Facebook' },
      { name: 'Toyoteros Dominicanos', platform: 'Facebook' },
    ],
    oilCapacity: '4.4 L',
    oilType: '5W-30',
    tireSize: '195/65 R15',
    tirePressure: '32 psi',
  },
  {
    modelId: 'toyota-yaris',
    description:
      'Pequeño, ligero y muy económico en combustible. Ideal para moverte por la ciudad sin gastar mucho en gasolina.',
    careTips: [
      { icon: '❄️', title: 'No abuses del A/C en subidas', description: 'El motor es pequeño; usarlo al máximo cuesta arriba lo fuerza de más.' },
      { icon: '🛢️', title: 'Aceite sintético', description: 'Ayuda a que el motor pequeño rinda mejor con el calor de RD.' },
    ],
    performanceTips: [
      { icon: '🎒', title: 'Viaja ligero', description: 'Cada libra extra le pesa más a un motor pequeño — evita cargarlo de más.' },
    ],
    accessories: ['Cámara de reversa', 'Organizador de maletero', 'Tapasol parabrisas'],
    communities: [{ name: 'Yaris RD', platform: 'Facebook' }],
    oilCapacity: '3.7 L',
    oilType: '0W-20',
    tireSize: '185/65 R15',
    tirePressure: '32 psi',
  },
  {
    modelId: 'toyota-hilux',
    description:
      'Una pickup robusta pensada para trabajar. Su motor diésel aguanta uso pesado y es muy querida en zonas rurales de RD.',
    careTips: [
      { icon: '⛽', title: 'Filtro de combustible limpio', description: 'El diésel en RD a veces trae sedimento; un filtro sucio le resta fuerza al motor.' },
      { icon: '🛢️', title: 'Aceite para diésel', description: 'Usa siempre aceite formulado para motores diésel, no el de gasolina.' },
    ],
    performanceTips: [
      { icon: '⚙️', title: 'Revisa el sistema de tracción 4x4', description: 'Si la usas seguido en modo 4x4, dale una inspección aparte de vez en cuando.' },
    ],
    accessories: ['Roll bar', 'Cama de goma', 'Snorkel (zonas de inundación)'],
    communities: [{ name: 'Toyota 4x4 RD', platform: 'Facebook' }],
    oilCapacity: '6.0 L',
    oilType: '15W-40 (diésel)',
    tireSize: '265/65 R17',
    tirePressure: '35 psi',
  },
  {
    modelId: 'toyota-rav4',
    description:
      'Un buen equilibrio entre espacio de SUV y consumo de sedán. Cómoda para familia y con buena reputación de durabilidad.',
    careTips: [
      { icon: '🔧', title: 'Correas y filtros a tiempo', description: 'Es lo que más alarga la vida del motor en el uso diario.' },
    ],
    performanceTips: [
      { icon: '🛞', title: 'Gomas balanceadas para hoyos', description: 'Sin sacrificar mucho el consumo de combustible.' },
    ],
    accessories: ['Barras de techo', 'Cobertor de asientos', 'Organizador de maletero'],
    communities: [{ name: 'RAV4 Owners RD', platform: 'Facebook' }],
    oilCapacity: '4.8 L',
    oilType: '0W-20',
    tireSize: '225/65 R17',
    tirePressure: '32 psi',
  },
  {
    modelId: 'honda-civic',
    description:
      'Un sedán con motor ágil y buena reputación deportiva. Muy popular para personalizar — solo cuídalo si lo manejas fuerte.',
    careTips: [
      { icon: '🛢️', title: 'Aceite sintético', description: 'Recomendado si sueles llevar el motor a revoluciones altas.' },
    ],
    performanceTips: [
      { icon: '🔌', title: 'Bujías de iridio', description: 'Duran más y ayudan al motor a rendir mejor.' },
    ],
    accessories: ['Spoiler', 'Luces LED', 'Sistema de audio'],
    communities: [
      { name: 'Civic Club Dominicano', platform: 'Facebook' },
      { name: 'Honda Owners RD', platform: 'Facebook' },
    ],
    oilCapacity: '3.7 L',
    oilType: '0W-20',
    tireSize: '215/55 R16',
    tirePressure: '32 psi',
  },
  {
    modelId: 'honda-crv',
    description:
      'Un SUV familiar espacioso y confiable, con fama de aguantar muchos kilómetros sin dar sorpresas.',
    careTips: [
      { icon: '🔄', title: 'Fluido de transmisión', description: 'Si tu versión es automática, revísalo según el manual — no es lo mismo que el aceite del motor.' },
    ],
    performanceTips: [
      { icon: '🛞', title: 'Neumáticos en buen estado', description: 'El peso del vehículo exige gomas sanas para frenar bien.' },
    ],
    accessories: ['Organizador de maletero', 'Protector de parachoques', 'Barras de techo'],
    communities: [{ name: 'CR-V Owners RD', platform: 'Facebook' }],
    oilCapacity: '4.4 L',
    oilType: '0W-20',
    tireSize: '225/65 R17',
    tirePressure: '32 psi',
  },
  {
    modelId: 'honda-fit',
    description:
      'Muy espacioso por dentro pese a su tamaño compacto, gracias a sus asientos abatibles. Económico y práctico para el día a día.',
    careTips: [
      { icon: '🌡️', title: 'Vigila el aceite en climas calientes', description: 'El motor pequeño se beneficia de cambios puntuales.' },
    ],
    performanceTips: [
      { icon: '💨', title: 'No lo sobrecargues', description: 'Aprovecha su espacio, pero no abuses del peso para mantener el buen consumo.' },
    ],
    accessories: ['Rieles de techo', 'Organizador de maletero'],
    communities: [{ name: 'Honda Fit RD', platform: 'Facebook' }],
    oilCapacity: '3.4 L',
    oilType: '0W-20',
    tireSize: '185/60 R15',
    tirePressure: '32 psi',
  },
  {
    modelId: 'hyundai-accent',
    description:
      'Un sedán económico y muy usado en RD para transporte diario. Mantenimiento de bajo costo y piezas fáciles de conseguir.',
    careTips: [
      { icon: '🚧', title: 'Revisa la suspensión seguido', description: 'Si lo usas mucho en la calle, los hoyos la desgastan más rápido.' },
    ],
    performanceTips: [
      { icon: '🪑', title: 'Forros resistentes', description: 'Si el uso es intenso, protegen los asientos del desgaste diario.' },
    ],
    accessories: ['Forros de asiento resistentes', 'Tapasol parabrisas'],
    communities: [{ name: 'Hyundai RD Grupo', platform: 'Facebook' }],
    oilCapacity: '3.5 L',
    oilType: '5W-20',
    tireSize: '195/65 R15',
    tirePressure: '33 psi',
  },
  {
    modelId: 'hyundai-elantra',
    description:
      'Un sedán mediano con buen equipamiento para su precio. Cómodo para viajes largos y para el uso diario.',
    careTips: [
      { icon: '🔌', title: 'Revisa el sistema eléctrico', description: 'Tiene bastantes comodidades — vale la pena chequearlo de vez en cuando.' },
    ],
    performanceTips: [
      { icon: '🛞', title: 'Gomas de buena calidad', description: 'El equipamiento extra le pide un poco más a las gomas.' },
    ],
    accessories: ['Sensores de reversa', 'Cámara de reversa'],
    communities: [{ name: 'Elantra Owners RD', platform: 'Facebook' }],
    oilCapacity: '4.5 L',
    oilType: '5W-20',
    tireSize: '205/55 R16',
    tirePressure: '33 psi',
  },
  {
    modelId: 'hyundai-tucson',
    description:
      'Un SUV compacto muy popular en RD, con buen espacio interior para el tamaño exterior.',
    careTips: [
      { icon: '🔧', title: 'Filtros a tiempo', description: 'Sobre todo si mezclas manejo de ciudad y carretera seguido.' },
    ],
    performanceTips: [
      { icon: '🔄', title: 'Rota las gomas seguido', description: 'El peso del SUV las desgasta de forma despareja si no las rotas.' },
    ],
    accessories: ['Barras de techo', 'Protector de cajuela'],
    communities: [{ name: 'Tucson RD', platform: 'Facebook' }],
    oilCapacity: '5.2 L',
    oilType: '5W-20',
    tireSize: '225/60 R17',
    tirePressure: '33 psi',
  },
  {
    modelId: 'kia-rio',
    description:
      'Un subcompacto económico, cómodo para el día a día y con un consumo de combustible bastante bajo.',
    careTips: [
      { icon: '🛢️', title: 'Aceite sintético en clima cálido', description: 'Ayuda al motor a mantenerse bien lubricado con el calor de RD.' },
    ],
    performanceTips: [
      { icon: '🎒', title: 'Mantenlo ligero', description: 'Así conserva su buen consumo de combustible en ciudad.' },
    ],
    accessories: ['Tapasol parabrisas', 'Cargador USB'],
    communities: [{ name: 'Kia Rio RD', platform: 'Facebook' }],
    oilCapacity: '3.9 L',
    oilType: '5W-20',
    tireSize: '195/65 R15',
    tirePressure: '33 psi',
  },
  {
    modelId: 'kia-sportage',
    description:
      'Un SUV compacto de buen valor, con espacio suficiente para familia y equipaje sin ser aparatoso.',
    careTips: [
      { icon: '🛑', title: 'Revisa los frenos', description: 'El peso del SUV les exige un poco más que a un sedán.' },
    ],
    performanceTips: [
      { icon: '🎯', title: 'Alineación en buen estado', description: 'Los hoyos la descuadran más rápido de lo que crees.' },
    ],
    accessories: ['Barras de techo', 'Alfombras 3D'],
    communities: [{ name: 'Kia Sportage RD', platform: 'Facebook' }],
    oilCapacity: '5.2 L',
    oilType: '5W-20',
    tireSize: '225/60 R17',
    tirePressure: '33 psi',
  },
  {
    modelId: 'nissan-sentra',
    description:
      'Un sedán confiable y muy común en RD — eso significa que sus repuestos son fáciles de conseguir.',
    careTips: [
      { icon: '🛢️', title: 'Aceite a tiempo', description: 'La base de un motor que dura si se cuida.' },
    ],
    performanceTips: [
      { icon: '🛞', title: 'Presión de gomas correcta', description: 'Ayuda a que el motor y la transmisión trabajen menos, y ahorra combustible.' },
    ],
    accessories: ['Forros de asiento', 'Cargador USB'],
    communities: [{ name: 'Sentra Club RD', platform: 'Facebook' }],
    oilCapacity: '4.4 L',
    oilType: '0W-20',
    tireSize: '205/65 R16',
    tirePressure: '32 psi',
  },
  {
    modelId: 'nissan-versa',
    description:
      'Un subcompacto con más espacio interior de lo que su tamaño exterior sugiere. Económico para el día a día.',
    careTips: [
      { icon: '❄️', title: 'No fuerces el A/C constantemente', description: 'El motor es pequeño y se beneficia de un uso moderado.' },
    ],
    performanceTips: [
      { icon: '🏙️', title: 'Buen consumo en ciudad', description: 'Aprovéchalo manteniendo el motor y las gomas en buen estado.' },
    ],
    accessories: ['Tapasol parabrisas', 'Organizador de maletero'],
    communities: [{ name: 'Versa RD', platform: 'Facebook' }],
    oilCapacity: '4.4 L',
    oilType: '0W-20',
    tireSize: '185/65 R15',
    tirePressure: '32 psi',
  },
  {
    modelId: 'nissan-frontier',
    description:
      'Una pickup pensada para el trabajo, con motor diésel que aguanta carga y uso frecuente.',
    careTips: [
      { icon: '🛢️', title: 'Aceite para diésel', description: 'Cámbialo a tiempo si la usas para cargar peso seguido.' },
      { icon: '⛽', title: 'Filtro de combustible', description: 'Revísalo por la calidad variable del diésel en RD.' },
    ],
    performanceTips: [
      { icon: '⚙️', title: 'Revisa la suspensión reforzada', description: 'Si cargas peso seguido, vale la pena chequearla más seguido.' },
    ],
    accessories: ['Cama de goma', 'Roll bar'],
    communities: [{ name: 'Frontier 4x4 RD', platform: 'Facebook' }],
    oilCapacity: '6.4 L',
    oilType: '15W-40 (diésel)',
    tireSize: '265/70 R16',
    tirePressure: '35 psi',
  },
  {
    modelId: 'mitsubishi-lancer',
    description:
      'Un sedán clásico y muy visto en RD. Ya no se fabrica, así que conviene ir un paso adelante con los repuestos.',
    careTips: [
      { icon: '🔍', title: 'Busca repuestos con tiempo', description: 'Al ser un modelo descontinuado, algunas piezas tardan más en conseguirse.' },
    ],
    performanceTips: [
      { icon: '🔧', title: 'Responde bien al mantenimiento regular', description: 'Un motor que se porta bien si no lo descuidas.' },
    ],
    accessories: ['Luces LED', 'Rines'],
    communities: [{ name: 'Lancer Club RD', platform: 'Facebook' }],
    oilCapacity: '4.0 L',
    oilType: '5W-30',
    tireSize: '205/60 R16',
    tirePressure: '32 psi',
  },
  {
    modelId: 'suzuki-grand-vitara',
    description:
      'Un SUV con capacidad real para caminos difíciles, ideal si te mueves seguido por zonas rurales.',
    careTips: [
      { icon: '⚙️', title: 'Revisa la tracción 4x4', description: 'Si la usas en caminos rurales, dale una inspección periódica.' },
    ],
    performanceTips: [
      { icon: '🛞', title: 'Gomas todo terreno', description: 'Le sacan mejor provecho a su capacidad fuera de asfalto.' },
    ],
    accessories: ['Snorkel', 'Barras de techo'],
    communities: [{ name: 'Grand Vitara RD', platform: 'Facebook' }],
    oilCapacity: '4.3 L',
    oilType: '5W-30',
    tireSize: '225/65 R17',
    tirePressure: '30 psi',
  },
  {
    modelId: 'daihatsu-terios',
    description:
      'Un SUV pequeño y económico. Es menos común en RD, así que sus repuestos pueden tardar un poco más en llegar.',
    careTips: [
      { icon: '🔍', title: 'Anticipa los repuestos', description: 'Al ser menos común, pide las piezas con más tiempo de anticipación.' },
    ],
    performanceTips: [
      { icon: '💨', title: 'Buen consumo por ser ligero', description: 'Aprovecha su peso liviano manteniéndolo bien afinado.' },
    ],
    accessories: ['Barras de techo'],
    communities: [{ name: 'SUVs Compactas RD', platform: 'Facebook (comunidad general)' }],
    oilCapacity: '3.5 L',
    oilType: '5W-30',
    tireSize: '215/70 R16',
    tirePressure: '30 psi',
  },
  {
    modelId: 'ford-ranger',
    description:
      'Una pickup robusta con motor diésel potente, buena para trabajo pesado y viajes largos.',
    careTips: [
      { icon: '🛢️', title: 'Aceite para diésel', description: 'Respeta los intervalos, sobre todo si trabajas la pickup seguido.' },
      { icon: '⛽', title: 'Filtro de combustible', description: 'La calidad variable del diésel en RD lo ensucia más rápido.' },
    ],
    performanceTips: [
      { icon: '🛞', title: 'Neumáticos AT', description: 'Buen balance entre trabajo, carretera y caminos de tierra.' },
    ],
    accessories: ['Roll bar', 'Cama de goma'],
    communities: [{ name: 'Ford Ranger RD', platform: 'Facebook' }],
    oilCapacity: '6.0 L',
    oilType: '15W-40 (diésel)',
    tireSize: '265/65 R17',
    tirePressure: '35 psi',
  },
  {
    modelId: 'chevrolet-aveo',
    description:
      'Un sedán/hatchback económico, muy usado también en flotillas y transporte por su bajo costo de mantenimiento.',
    careTips: [
      { icon: '🚧', title: 'Revisa la suspensión', description: 'El uso urbano constante (taxi, apps) la desgasta más rápido.' },
    ],
    performanceTips: [
      { icon: '🔧', title: 'Mantenimiento básico a tiempo', description: 'Es la clave para que este carro dure sin sorpresas.' },
    ],
    accessories: ['Tapasol parabrisas', 'Forros de asiento'],
    communities: [{ name: 'Chevrolet Aveo RD', platform: 'Facebook' }],
    oilCapacity: '3.7 L',
    oilType: '5W-30',
    tireSize: '185/65 R15',
    tirePressure: '32 psi',
  },
];

export function findVehicleSpec(modelId: string): VehicleSpec | undefined {
  return VEHICLE_SPECS.find((s) => s.modelId === modelId);
}

/**
 * No tenemos el link verificado de cada grupo real (los nombres de arriba son
 * sugerencias de referencia, no comunidades confirmadas) — en vez de inventar
 * una URL específica que podría no existir o ser incorrecta, enlazamos a una
 * búsqueda real de Facebook con ese nombre para que el usuario encuentre y
 * verifique la comunidad correcta por sí mismo.
 */
export function communitySearchUrl(name: string): string {
  return `https://www.facebook.com/search/groups/?q=${encodeURIComponent(name)}`;
}
