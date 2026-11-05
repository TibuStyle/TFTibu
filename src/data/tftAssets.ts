export interface ChampionCatalogItem {
  id: string;
  nombre: string;
  coste: 1 | 2 | 3 | 4 | 5;
  ddragonKey: string;
  sinergias: string[];
  rolBase: 'AD' | 'AP' | 'Tanque' | 'Utilidad';
}

export interface ItemComponent {
  id: string;
  nombre: string;
  abreviatura: string;
  estadistica: string;
  categoria: 'AD' | 'AP' | 'Tanque' | 'Utilidad';
  iconUrl: string;
  colorHex: string;
}

export interface CompletedItem {
  id: string;
  nombre: string;
  componentes: [string, string]; // IDs of two ItemComponents
  efectoCorto: string;
  iconUrl: string;
  tipo: 'AD' | 'AP' | 'Tanque' | 'Utilidad';
}

const DDRAGON_VER = '14.23.1';

export const CHAMPION_CATALOG: Record<string, ChampionCatalogItem> = {
  // Coste 1 (14 campeones iniciales para el filtro temprano)
  caitlyn: { id: 'caitlyn', nombre: 'Caitlyn', coste: 1, ddragonKey: 'Caitlyn', sinergias: ['Francotirador', 'Artillero'], rolBase: 'AD' },
  kogmaw: { id: 'kogmaw', nombre: "Kog'Maw", coste: 1, ddragonKey: 'KogMaw', sinergias: ['Francotirador', 'Místico'], rolBase: 'AP' },
  garen: { id: 'garen', nombre: 'Garen', coste: 1, ddragonKey: 'Garen', sinergias: ['Vanguardia', 'Radiante'], rolBase: 'Tanque' },
  maokai: { id: 'maokai', nombre: 'Maokai', coste: 1, ddragonKey: 'Maokai', sinergias: ['Bosqueviejo', 'Matón'], rolBase: 'Tanque' },
  blitzcrank: { id: 'blitzcrank', nombre: 'Blitzcrank', coste: 1, ddragonKey: 'Blitzcrank', sinergias: ['Vanguardia', 'Tecno'], rolBase: 'Tanque' },
  zoe: { id: 'zoe', nombre: 'Zoe', coste: 1, ddragonKey: 'Zoe', sinergias: ['Tejehechizos', 'Erudito'], rolBase: 'AP' },
  darius: { id: 'darius', nombre: 'Darius', coste: 1, ddragonKey: 'Darius', sinergias: ['Segador', 'Coloso'], rolBase: 'AD' },
  yasuo: { id: 'yasuo', nombre: 'Yasuo', coste: 1, ddragonKey: 'Yasuo', sinergias: ['Duelista', 'Espiritual'], rolBase: 'AD' },
  lillia: { id: 'lillia', nombre: 'Lillia', coste: 1, ddragonKey: 'Lillia', sinergias: ['Bosqueviejo', 'Invocador'], rolBase: 'Tanque' },
  jax: { id: 'jax', nombre: 'Jax', coste: 1, ddragonKey: 'Jax', sinergias: ['Matón', 'Ascendido'], rolBase: 'Tanque' },
  ahri: { id: 'ahri', nombre: 'Ahri', coste: 1, ddragonKey: 'Ahri', sinergias: ['Tejehechizos', 'Espiritual'], rolBase: 'AP' },
  sivir: { id: 'sivir', nombre: 'Sivir', coste: 1, ddragonKey: 'Sivir', sinergias: ['Artillero', 'Duelista'], rolBase: 'AD' },
  amumu: { id: 'amumu', nombre: 'Amumu', coste: 1, ddragonKey: 'Amumu', sinergias: ['Vanguardia', 'Porcelana'], rolBase: 'Tanque' },
  zyra: { id: 'zyra', nombre: 'Zyra', coste: 1, ddragonKey: 'Zyra', sinergias: ['Invocador', 'Erudito'], rolBase: 'AP' },

  // Coste 2 (12 campeones tempranos clave para el filtro)
  gnar: { id: 'gnar', nombre: 'Gnar', coste: 2, ddragonKey: 'Gnar', sinergias: ['Bosqueviejo', 'Matón'], rolBase: 'AD' },
  katarina: { id: 'katarina', nombre: 'Katarina', coste: 2, ddragonKey: 'Katarina', sinergias: ['Segador', 'Asesino'], rolBase: 'AP' },
  senna: { id: 'senna', nombre: 'Senna', coste: 2, ddragonKey: 'Senna', sinergias: ['Francotirador', 'Artillero'], rolBase: 'AD' },
  shen: { id: 'shen', nombre: 'Shen', coste: 2, ddragonKey: 'Shen', sinergias: ['Coloso', 'Espiritual'], rolBase: 'Tanque' },
  lux: { id: 'lux', nombre: 'Lux', coste: 2, ddragonKey: 'Lux', sinergias: ['Porcelana', 'Tejehechizos'], rolBase: 'AP' },
  janna: { id: 'janna', nombre: 'Janna', coste: 2, ddragonKey: 'Janna', sinergias: ['Invocador', 'Místico'], rolBase: 'Utilidad' },
  reksai: { id: 'reksai', nombre: "Rek'Sai", coste: 2, ddragonKey: 'RekSai', sinergias: ['Matón', 'Segador'], rolBase: 'Tanque' },
  yorick: { id: 'yorick', nombre: 'Yorick', coste: 2, ddragonKey: 'Yorick', sinergias: ['Coloso', 'Umbrío'], rolBase: 'Tanque' },
  kindred: { id: 'kindred', nombre: 'Kindred', coste: 2, ddragonKey: 'Kindred', sinergias: ['Segador', 'Bosqueviejo'], rolBase: 'AP' },
  tristana: { id: 'tristana', nombre: 'Tristana', coste: 2, ddragonKey: 'Tristana', sinergias: ['Artillero', 'Duelista'], rolBase: 'AD' },
  neeko: { id: 'neeko', nombre: 'Neeko', coste: 2, ddragonKey: 'Neeko', sinergias: ['Tejehechizos', 'Bosqueviejo'], rolBase: 'Tanque' },
  aatrox: { id: 'aatrox', nombre: 'Aatrox', coste: 2, ddragonKey: 'Aatrox', sinergias: ['Ascendido', 'Matón'], rolBase: 'Tanque' },

  // Coste 3
  aphelios: { id: 'aphelios', nombre: 'Aphelios', coste: 3, ddragonKey: 'Aphelios', sinergias: ['Artillero', 'Francotirador'], rolBase: 'AD' },
  alune: { id: 'alune', nombre: 'Alune (Diana)', coste: 3, ddragonKey: 'Diana', sinergias: ['Invocador', 'Umbrío'], rolBase: 'AP' },
  thresh: { id: 'thresh', nombre: 'Thresh', coste: 3, ddragonKey: 'Thresh', sinergias: ['Vanguardia', 'Umbrío'], rolBase: 'Tanque' },
  illaoi: { id: 'illaoi', nombre: 'Illaoi', coste: 3, ddragonKey: 'Illaoi', sinergias: ['Matón', 'Tejehechizos'], rolBase: 'Tanque' },
  soraka: { id: 'soraka', nombre: 'Soraka', coste: 3, ddragonKey: 'Soraka', sinergias: ['Bosqueviejo', 'Místico'], rolBase: 'Utilidad' },
  yone: { id: 'yone', nombre: 'Yone', coste: 3, ddragonKey: 'Yone', sinergias: ['Segador', 'Duelista'], rolBase: 'AD' },
  tahmkench: { id: 'tahmkench', nombre: 'Tahm Kench', coste: 3, ddragonKey: 'TahmKench', sinergias: ['Matón', 'Místico'], rolBase: 'Tanque' },
  bard: { id: 'bard', nombre: 'Bardo', coste: 3, ddragonKey: 'Bard', sinergias: ['Erudito', 'Místico'], rolBase: 'Utilidad' },
  volibear: { id: 'volibear', nombre: 'Volibear', coste: 3, ddragonKey: 'Volibear', sinergias: ['Duelista', 'Coloso'], rolBase: 'Tanque' },
  zoe3: { id: 'zoe3', nombre: 'Vex', coste: 3, ddragonKey: 'Vex', sinergias: ['Tejehechizos', 'Umbrío'], rolBase: 'Tanque' },

  // Coste 4
  ezreal: { id: 'ezreal', nombre: 'Ezreal', coste: 4, ddragonKey: 'Ezreal', sinergias: ['Artillero', 'Bosqueviejo'], rolBase: 'AD' },
  morgana: { id: 'morgana', nombre: 'Morgana', coste: 4, ddragonKey: 'Morgana', sinergias: ['Tejehechizos', 'Místico'], rolBase: 'AP' },
  ornn: { id: 'ornn', nombre: 'Ornn', coste: 4, ddragonKey: 'Ornn', sinergias: ['Bosqueviejo', 'Coloso'], rolBase: 'Tanque' },
  ashe: { id: 'ashe', nombre: 'Ashe', coste: 4, ddragonKey: 'Ashe', sinergias: ['Porcelana', 'Francotirador'], rolBase: 'AD' },
  nautilus: { id: 'nautilus', nombre: 'Nautilus', coste: 4, ddragonKey: 'Nautilus', sinergias: ['Vanguardia', 'Místico'], rolBase: 'Tanque' },
  syndra: { id: 'syndra', nombre: 'Syndra', coste: 4, ddragonKey: 'Syndra', sinergias: ['Invocador', 'Tejehechizos'], rolBase: 'AP' },
  kayn: { id: 'kayn', nombre: 'Kayn', coste: 4, ddragonKey: 'Kayn', sinergias: ['Segador', 'Umbrío'], rolBase: 'AD' },
  sylas: { id: 'sylas', nombre: 'Sylas', coste: 4, ddragonKey: 'Sylas', sinergias: ['Matón', 'Umbrío'], rolBase: 'Tanque' },
  annie: { id: 'annie', nombre: 'Annie', coste: 4, ddragonKey: 'Annie', sinergias: ['Invocador', 'Vanguardia'], rolBase: 'Tanque' },
  jinx: { id: 'jinx', nombre: 'Jinx', coste: 4, ddragonKey: 'Jinx', sinergias: ['Artillero', 'Tecno'], rolBase: 'AD' },
  vi: { id: 'vi', nombre: 'Vi', coste: 4, ddragonKey: 'Vi', sinergias: ['Matón', 'Vanguardia'], rolBase: 'Tanque' },
  galio: { id: 'galio', nombre: 'Galio', coste: 4, ddragonKey: 'Galio', sinergias: ['Matón', 'Radiante'], rolBase: 'Tanque' },

  // Coste 5
  azir: { id: 'azir', nombre: 'Azir', coste: 5, ddragonKey: 'Azir', sinergias: ['Bosqueviejo', 'Invocador'], rolBase: 'AP' },
  sett: { id: 'sett', nombre: 'Sett', coste: 5, ddragonKey: 'Sett', sinergias: ['Coloso', 'Umbrío'], rolBase: 'Tanque' },
  irelia: { id: 'irelia', nombre: 'Irelia', coste: 5, ddragonKey: 'Irelia', sinergias: ['Duelista', 'Artillero'], rolBase: 'AD' },
  lissandra: { id: 'lissandra', nombre: 'Lissandra', coste: 5, ddragonKey: 'Lissandra', sinergias: ['Porcelana', 'Tejehechizos'], rolBase: 'AP' },
  udyr: { id: 'udyr', nombre: 'Udyr', coste: 5, ddragonKey: 'Udyr', sinergias: ['Matón', 'Espiritual'], rolBase: 'Tanque' },
  hwei: { id: 'hwei', nombre: 'Hwei', coste: 5, ddragonKey: 'Hwei', sinergias: ['Erudito', 'Místico'], rolBase: 'AP' },
  wukong: { id: 'wukong', nombre: 'Wukong', coste: 5, ddragonKey: 'MonkeyKing', sinergias: ['Sabio', 'Vanguardia'], rolBase: 'AD' },
  rakan: { id: 'rakan', nombre: 'Rakan', coste: 5, ddragonKey: 'Rakan', sinergias: ['Altruista', 'Místico'], rolBase: 'Tanque' },
};

export function getChampionPortraitUrl(champId: string): string {
  const champ = CHAMPION_CATALOG[champId];
  const key = champ ? champ.ddragonKey : 'Ezreal';
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/champion/${key}.png`;
}

export const ITEM_COMPONENTS: Record<string, ItemComponent> = {
  espadon: {
    id: 'espadon',
    nombre: 'Espadón',
    abreviatura: 'ESP',
    estadistica: '+10% Daño de Ataque',
    categoria: 'AD',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/1038.png`,
    colorHex: '#EF4444',
  },
  arco: {
    id: 'arco',
    nombre: 'Arco Curvo',
    abreviatura: 'ARC',
    estadistica: '+10% Velocidad de Ataque',
    categoria: 'AD',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/1043.png`,
    colorHex: '#F59E0B',
  },
  vara: {
    id: 'vara',
    nombre: 'Vara Innecesariamente Grande',
    abreviatura: 'VAR',
    estadistica: '+10 Poder de Habilidad',
    categoria: 'AP',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/1058.png`,
    colorHex: '#A855F7',
  },
  lagrima: {
    id: 'lagrima',
    nombre: 'Lágrima de la Diosa',
    abreviatura: 'LAG',
    estadistica: '+15 Maná Inicial',
    categoria: 'AP',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3070.png`,
    colorHex: '#38BDF8',
  },
  chaleco: {
    id: 'chaleco',
    nombre: 'Chaleco de Cadenas',
    abreviatura: 'CHA',
    estadistica: '+20 Armadura',
    categoria: 'Tanque',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/1031.png`,
    colorHex: '#FB923C',
  },
  capa: {
    id: 'capa',
    nombre: 'Capa Negatrón',
    abreviatura: 'CAP',
    estadistica: '+20 Resistencia Mágica',
    categoria: 'Tanque',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/1057.png`,
    colorHex: '#2DD4BF',
  },
  cinturon: {
    id: 'cinturon',
    nombre: 'Cinturón de Gigante',
    abreviatura: 'CIN',
    estadistica: '+150 Vida Máxima',
    categoria: 'Tanque',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/1011.png`,
    colorHex: '#22C55E',
  },
  guantes: {
    id: 'guantes',
    nombre: 'Guantes de Combate',
    abreviatura: 'GUA',
    estadistica: '+20% Prob. Crítico',
    categoria: 'Utilidad',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/1051.png`,
    colorHex: '#F43F5E',
  },
};

export const COMPLETED_ITEMS: Record<string, CompletedItem> = {
  filo_infinito: {
    id: 'filo_infinito',
    nombre: 'Filo del Infinito',
    componentes: ['espadon', 'guantes'],
    efectoCorto: 'Las habilidades pueden asestar golpes críticos (+35% AD)',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3031.png`,
    tipo: 'AD',
  },
  ultimo_suspiro: {
    id: 'ultimo_suspiro',
    nombre: 'Último Suspiro',
    componentes: ['arco', 'guantes'],
    efectoCorto: 'Reduce un 30% la Armadura del objetivo al infligir daño físico',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3035.png`,
    tipo: 'AD',
  },
  lanza_shojin: {
    id: 'lanza_shojin',
    nombre: 'Lanza de Shojin',
    componentes: ['espadon', 'lagrima'],
    efectoCorto: 'Los ataques restauran +5 de Maná adicional (+15% AD y AP)',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3161.png`,
    tipo: 'AP',
  },
  verdugo_gigantes: {
    id: 'verdugo_gigantes',
    nombre: 'Verdugo de Gigantes',
    componentes: ['espadon', 'arco'],
    efectoCorto: '+25% de daño adicional contra tanques con más de 1750 de Vida',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3036.png`,
    tipo: 'AD',
  },
  espada_furia_guinsoo: {
    id: 'espada_furia_guinsoo',
    nombre: 'Espada de Furia de Guinsoo',
    componentes: ['arco', 'vara'],
    efectoCorto: 'Los ataques otorgan +5% de Velocidad de Ataque acumulable sin límite',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3124.png`,
    tipo: 'AD',
  },
  sanguinaria: {
    id: 'sanguinaria',
    nombre: 'La Sanguinaria',
    componentes: ['espadon', 'capa'],
    efectoCorto: '+20% Omnivampirismo y escudo del 25% de Vida al bajar del 40%',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3072.png`,
    tipo: 'AD',
  },
  valor_titan: {
    id: 'valor_titan',
    nombre: 'Valor del Titán',
    componentes: ['arco', 'chaleco'],
    efectoCorto: 'Otorga AD y AP hasta 25 cargas; al máximo da +20 Armadura y RM',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3053.png`,
    tipo: 'AD',
  },
  mano_justicia: {
    id: 'mano_justicia',
    nombre: 'Mano de la Justicia',
    componentes: ['lagrima', 'guantes'],
    efectoCorto: 'Duplica AD/AP (+30%) o el Omnivampirismo (+30%) cada ronda',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3140.png`,
    tipo: 'Utilidad',
  },
  guantelete_deslumbrante: {
    id: 'guantelete_deslumbrante',
    nombre: 'Guantelete Deslumbrante',
    componentes: ['vara', 'guantes'],
    efectoCorto: 'El daño mágico y verdadero de habilidades puede ser crítico',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/4645.png`,
    tipo: 'AP',
  },
  sombrero_rabadon: {
    id: 'sombrero_rabadon',
    nombre: 'Sombrero Mortífero de Rabadon',
    componentes: ['vara', 'vara'],
    efectoCorto: '+50 Poder de Habilidad y +20% de amplificación de daño total',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3089.png`,
    tipo: 'AP',
  },
  diente_nashor: {
    id: 'diente_nashor',
    nombre: 'Diente de Nashor',
    componentes: ['arco', 'cinturon'],
    efectoCorto: 'Al lanzar habilidad, gana +60% de Velocidad de Ataque por 5s',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3115.png`,
    tipo: 'AP',
  },
  mejora_azul: {
    id: 'mejora_azul',
    nombre: 'Mejora Azul',
    componentes: ['lagrima', 'lagrima'],
    efectoCorto: 'Reduce en 10 el Maná máximo; al lograr derribos amplifica el daño +8%',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3003.png`,
    tipo: 'AP',
  },
  morellonomicon: {
    id: 'morellonomicon',
    nombre: 'Morellonomicón',
    componentes: ['vara', 'cinturon'],
    efectoCorto: 'Quema 1% de Vida máx. por segundo y aplica 33% de Heridas Graves',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3165.png`,
    tipo: 'AP',
  },
  baston_arcangel: {
    id: 'baston_arcangel',
    nombre: 'Bastón del Arcángel',
    componentes: ['vara', 'lagrima'],
    efectoCorto: 'Otorga +30 de Poder de Habilidad cada 5 segundos de combate',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3040.png`,
    tipo: 'AP',
  },
  gargola: {
    id: 'gargola',
    nombre: 'Armadura Pétrea de Gárgola',
    componentes: ['chaleco', 'capa'],
    efectoCorto: '+10 Armadura y +10 RM por cada enemigo que ataque al portador',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3193.png`,
    tipo: 'Tanque',
  },
  warmog: {
    id: 'warmog',
    nombre: 'Armadura de Warmog',
    componentes: ['cinturon', 'cinturon'],
    efectoCorto: '+600 de Vida adicional y +12% de Vida máxima total',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3083.png`,
    tipo: 'Tanque',
  },
  garra_dragon: {
    id: 'garra_dragon',
    nombre: 'Garra de Dragón',
    componentes: ['capa', 'capa'],
    efectoCorto: '+65 Resistencia Mágica y regenera 5% de Vida máx. cada 2s',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3065.png`,
    tipo: 'Tanque',
  },
  chaleco_zarzas: {
    id: 'chaleco_zarzas',
    nombre: 'Chaleco de Zarzas',
    componentes: ['chaleco', 'chaleco'],
    efectoCorto: '+65 Armadura y reduce el daño de golpes críticos recibidos',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3075.png`,
    tipo: 'Tanque',
  },
  capa_fuego_solar: {
    id: 'capa_fuego_solar',
    nombre: 'Capa de Fuego Solar',
    componentes: ['chaleco', 'cinturon'],
    efectoCorto: 'Cada 2s quema a un enemigo a 2 hexágonos y corta curaciones 33%',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3068.png`,
    tipo: 'Tanque',
  },
  redencion: {
    id: 'redencion',
    nombre: 'Redención',
    componentes: ['lagrima', 'cinturon'],
    efectoCorto: 'Cura un 15% de la Vida faltante a los aliados cercanos cada 5s',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3107.png`,
    tipo: 'Tanque',
  },
  chispa_ionica: {
    id: 'chispa_ionica',
    nombre: 'Chispa Iónica',
    componentes: ['vara', 'capa'],
    efectoCorto: 'Reduce un 30% la Resistencia Mágica de los enemigos a 2 hexágonos',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3102.png`,
    tipo: 'Tanque',
  },
  mortaja_firmeza: {
    id: 'mortaja_firmeza',
    nombre: 'Corazón Firme',
    componentes: ['chaleco', 'guantes'],
    efectoCorto: 'Recibe un 15% menos de daño mientras tiene más del 50% de Vida',
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/3143.png`,
    tipo: 'Tanque',
  },
};

export const CAROUSEL_PRIORITIES = {
  AD: {
    etiqueta: 'Ruta AD / Velocidad',
    resumen: 'Prioriza armas de daño físico y crítico para carries de ataque.',
    orden: ['espadon', 'arco', 'guantes', 'cinturon', 'chaleco'],
    recetasClave: ['filo_infinito', 'ultimo_suspiro', 'espada_furia_guinsoo', 'verdugo_gigantes'],
  },
  AP: {
    etiqueta: 'Ruta AP / Lanzadores',
    resumen: 'Prioriza generación de maná inmediata y amplificación mágica.',
    orden: ['lagrima', 'vara', 'espadon', 'guantes', 'cinturon'],
    recetasClave: ['lanza_shojin', 'guantelete_deslumbrante', 'diente_nashor', 'sombrero_rabadon'],
  },
  Tanque: {
    etiqueta: 'Ruta Tanque / Racha de Victorias',
    resumen: 'Estabiliza Fase 2 y 3 armando línea frontal irrompible temprano.',
    orden: ['cinturon', 'chaleco', 'capa', 'lagrima', 'guantes'],
    recetasClave: ['warmog', 'gargola', 'capa_fuego_solar', 'chispa_ionica'],
  },
};
