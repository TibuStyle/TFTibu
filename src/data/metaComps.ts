export interface BoardUnitPosition {
  championId: string;
  fila: 0 | 1 | 2 | 3; // 0 = Primera línea (Arriba), 3 = Última línea (Abajo)
  columna: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  rol: 'Carry Principal' | 'Tanque Principal' | 'Carry Secundario' | 'Utilidad';
  estrellas: 2 | 3;
  notaPosicion?: string;
}

export interface ItemAssignment {
  championId: string;
  rol: 'Carry Principal' | 'Tanque Principal' | 'Carry Secundario';
  itemsIds: [string, string, string]; // IDs from COMPLETED_ITEMS
  notaItems: string;
}

export interface AugmentRecommendation {
  nombre: string;
  tier: 'S' | 'A';
  efecto: string;
}

export interface MetaComposition {
  id: string;
  nombre: string;
  arquetipo: 'Fast 8' | 'Slow Roll Lvl 6' | 'Reroll Lvl 7' | 'Fast 9 Flex';
  tier: 'S' | 'A';
  dificultad: 'Baja' | 'Media' | 'Alta';
  estiloDano: 'AD' | 'AP' | 'Híbrido';
  sinergiasActivas: string[];
  campeonesInicialesCompatibles: string[]; // Coste 1 y 2 que habilitan esta línea
  early_game: {
    portador_items: string;
    lvl_4: string[];
    lvl_5: string[];
    lvl_6: string[];
    lvl_7: string[];
    nota_temprana: string;
  };
  transicion_pivot: {
    momento: string;
    vender: string[];
    comprar: string[];
    alerta_texto: string;
  };
  mesa_final: {
    championId: string;
    rol: 'Carry Principal' | 'Tanque Principal' | 'Carry Secundario' | 'Utilidad';
    estrellas: 2 | 3;
  }[];
  posicionamiento: BoardUnitPosition[];
  items: {
    prioridad_carrusel: string[]; // IDs from ITEM_COMPONENTS
    asignaciones: ItemAssignment[];
  };
  aumentos_top: AugmentRecommendation[];
  consejo_rapido: string;
}

export const INITIAL_META_COMPOSITIONS: MetaComposition[] = [
  {
    id: 'ezreal-bosqueviejo-flex',
    nombre: 'Ezreal & Ornn Bosqueviejo Artilleros (Fast 8)',
    arquetipo: 'Fast 8',
    tier: 'S',
    dificultad: 'Media',
    estiloDano: 'AD',
    sinergiasActivas: ['4 Bosqueviejo', '4 Artillero', '2 Coloso', '2 Místico'],
    campeonesInicialesCompatibles: ['caitlyn', 'sivir', 'maokai', 'gnar', 'tristana', 'senna'],
    early_game: {
      portador_items: 'sivir',
      lvl_4: ['sivir', 'caitlyn', 'maokai', 'gnar'],
      lvl_5: ['sivir', 'caitlyn', 'tristana', 'maokai', 'gnar'],
      lvl_6: ['sivir', 'tristana', 'senna', 'maokai', 'gnar', 'yorick'],
      lvl_7: ['aphelios', 'tristana', 'senna', 'maokai', 'gnar', 'soraka', 'thresh'],
      nota_temprana: 'Equipa todos los ítems de AD en Sivir o Tristana 2★ y los de tanque en Maokai para asegurar racha en Fase 2.',
    },
    transicion_pivot: {
      momento: 'Fase 4-2 (Subir a Nivel 8 con 40+ de oro)',
      vender: ['sivir', 'caitlyn', 'yorick'],
      comprar: ['ezreal', 'ornn', 'azir'],
      alerta_texto: 'Vender Sivir, Caitlyn, Yorick -> Comprar Ezreal, Ornn, Azir (Pasar ítems AD a Ezreal y Tanque a Ornn)',
    },
    mesa_final: [
      { championId: 'ezreal', rol: 'Carry Principal', estrellas: 2 },
      { championId: 'ornn', rol: 'Tanque Principal', estrellas: 2 },
      { championId: 'aphelios', rol: 'Carry Secundario', estrellas: 2 },
      { championId: 'azir', rol: 'Utilidad', estrellas: 2 },
      { championId: 'sett', rol: 'Utilidad', estrellas: 2 },
      { championId: 'soraka', rol: 'Utilidad', estrellas: 2 },
      { championId: 'gnar', rol: 'Utilidad', estrellas: 2 },
      { championId: 'tristana', rol: 'Utilidad', estrellas: 2 },
    ],
    posicionamiento: [
      { championId: 'ornn', fila: 0, columna: 3, rol: 'Tanque Principal', estrellas: 2, notaPosicion: 'Centro de 1ra línea para absorber foco y forjar artefacto a Ezreal.' },
      { championId: 'sett', fila: 0, columna: 2, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Al lado de Ornn para ganar AD al levantar al tanque principal.' },
      { championId: 'gnar', fila: 0, columna: 4, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Flanco derecho para flanquear tras saltar.' },
      { championId: 'soraka', fila: 3, columna: 1, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Atrás izquierda para silenciar al grupo enemigo.' },
      { championId: 'azir', fila: 3, columna: 3, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Centro atrás generando soldados de arena.' },
      { championId: 'tristana', fila: 3, columna: 4, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Cerca de los carries para carnada de asesinos.' },
      { championId: 'aphelios', fila: 3, columna: 5, rol: 'Carry Secundario', estrellas: 2, notaPosicion: 'Aplica reducción de armadura al mismo lado que Ezreal.' },
      { championId: 'ezreal', fila: 3, columna: 6, rol: 'Carry Principal', estrellas: 2, notaPosicion: 'Esquina inferior derecha alineado con Aphelios.' },
    ],
    items: {
      prioridad_carrusel: ['espadon', 'guantes', 'arco', 'cinturon', 'chaleco'],
      asignaciones: [
        {
          championId: 'ezreal',
          rol: 'Carry Principal',
          itemsIds: ['filo_infinito', 'ultimo_suspiro', 'mejora_azul'],
          notaItems: 'Filo del Infinito es obligatorio; puedes cambiar Mejora Azul por Verdugo de Gigantes.',
        },
        {
          championId: 'ornn',
          rol: 'Tanque Principal',
          itemsIds: ['warmog', 'gargola', 'redencion'],
          notaItems: 'Maximiza vida para que Ornn aguante hasta forjar el ítem de artefacto.',
        },
        {
          championId: 'aphelios',
          rol: 'Carry Secundario',
          itemsIds: ['espada_furia_guinsoo', 'verdugo_gigantes', 'sanguinaria'],
          notaItems: 'Recibe el exceso de arcos y espadones en Fase 4 y 5.',
        },
      ],
    },
    aumentos_top: [
      { nombre: 'Emblema de Bosqueviejo', tier: 'S', efecto: 'Permite alcanzar 6 Bosqueviejo en Nivel 8 sin depender de Azir.' },
      { nombre: 'Forja Viviente', tier: 'S', efecto: 'Otorga artefactos de Ornn que multiplican el daño de Ezreal.' },
      { nombre: ' Lluvia de Balas (Artilleros)', tier: 'A', efecto: 'Aumenta explosivamente el daño de ráfaga en los primeros 8 segundos.' },
    ],
    consejo_rapido: 'No gastes oro buscando en Nivel 6 o 7. Sube a Nivel 8 en la ronda 4-2 con mínimo 40 de oro y haz el cambio completo de mesa.',
  },
  {
    id: 'alune-morgana-tejehechizos',
    nombre: 'Alune & Morgana Tejehechizos Umbrío (Reroll Lvl 7)',
    arquetipo: 'Reroll Lvl 7',
    tier: 'S',
    dificultad: 'Media',
    estiloDano: 'AP',
    sinergiasActivas: ['4 Umbrío', '4 Invocador', '3 Tejehechizos', '2 Coloso'],
    campeonesInicialesCompatibles: ['zoe', 'ahri', 'zyra', 'yorick', 'lux', 'janna', 'lillia'],
    early_game: {
      portador_items: 'ahri',
      lvl_4: ['ahri', 'zoe', 'lillia', 'yorick'],
      lvl_5: ['ahri', 'zoe', 'lillia', 'yorick', 'janna'],
      lvl_6: ['ahri', 'lux', 'lillia', 'yorick', 'thresh', 'janna'],
      lvl_7: ['alune', 'yorick', 'thresh', 'lillia', 'janna', 'zoe3', 'illaoi'],
      nota_temprana: 'Pon Lanza de Shojin y Morellonomicón en Ahri o Zyra temprano; cuando salga Alune en Nivel 6/7, véndela y pásale todo.',
    },
    transicion_pivot: {
      momento: 'Fase 3-5 / 4-1 (Slow Roll en Nivel 7 por Alune 3★)',
      vender: ['ahri', 'zoe', 'lux'],
      comprar: ['alune', 'morgana', 'sylas'],
      alerta_texto: 'Vender Ahri, Zoe, Lux -> Comprar Alune, Morgana, Sylas (Mantener 50g en Lvl 7 hasta sacar Alune 3★)',
    },
    mesa_final: [
      { championId: 'alune', rol: 'Carry Principal', estrellas: 3 },
      { championId: 'sylas', rol: 'Tanque Principal', estrellas: 2 },
      { championId: 'morgana', rol: 'Carry Secundario', estrellas: 2 },
      { championId: 'sett', rol: 'Utilidad', estrellas: 2 },
      { championId: 'yorick', rol: 'Utilidad', estrellas: 2 },
      { championId: 'thresh', rol: 'Utilidad', estrellas: 2 },
      { championId: 'lillia', rol: 'Utilidad', estrellas: 2 },
      { championId: 'azir', rol: 'Utilidad', estrellas: 2 },
    ],
    posicionamiento: [
      { championId: 'sylas', fila: 0, columna: 2, rol: 'Tanque Principal', estrellas: 2, notaPosicion: 'En casilla iluminada de Umbrío para recibir el escudo al inicio.' },
      { championId: 'sett', fila: 0, columna: 3, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Centro de primera línea para ejecutar enemigos debilitados.' },
      { championId: 'yorick', fila: 0, columna: 4, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Absorbe daño inicial y activa Coloso.' },
      { championId: 'thresh', fila: 0, columna: 5, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Otorga escudos a Sylas y Sett.' },
      { championId: 'lillia', fila: 3, columna: 0, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Esquina izquierda para activar Invocador.' },
      { championId: 'azir', fila: 3, columna: 2, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Coloca soldados frente a Alune.' },
      { championId: 'morgana', fila: 3, columna: 5, rol: 'Carry Secundario', estrellas: 2, notaPosicion: 'Aplica tormenta en área sobre la fila donde Alune lanza meteoros.' },
      { championId: 'alune', fila: 2, columna: 3, rol: 'Carry Principal', estrellas: 3, notaPosicion: 'Fila 3 (segunda desde abajo) para dar velocidad de ataque a aliados adyacentes.' },
    ],
    items: {
      prioridad_carrusel: ['lagrima', 'vara', 'espadon', 'capa', 'cinturon'],
      asignaciones: [
        {
          championId: 'alune',
          rol: 'Carry Principal',
          itemsIds: ['lanza_shojin', 'morellonomicon', 'baston_arcangel'],
          notaItems: 'Shojin + Morellonomicón derriten la mesa entera en el segundo lanzamiento.',
        },
        {
          championId: 'sylas',
          rol: 'Tanque Principal',
          itemsIds: ['chispa_ionica', 'gargola', 'warmog'],
          notaItems: 'Chispa Iónica es crucial para reducir un 30% la Resistencia Mágica enemiga.',
        },
        {
          championId: 'morgana',
          rol: 'Carry Secundario',
          itemsIds: ['lanza_shojin', 'guantelete_deslumbrante', 'diente_nashor'],
          notaItems: 'Cualquier ítem de maná o AP sobrante va directo a Morgana 2★.',
        },
      ],
    },
    aumentos_top: [
      { nombre: 'Ira de la Luna (Umbrío)', tier: 'S', efecto: 'Incrementa el umbral de ejecución de Umbrío y otorga botín adicional.' },
      { nombre: 'Boleto Dorado / Compra Rápida', tier: 'S', efecto: 'Facilita conseguir Alune 3★ en Fase 4 sin perder economía.' },
      { nombre: 'Fuente de Maná (Invocadores)', tier: 'A', efecto: 'Otorga maná extra cada 3 segundos a toda la línea trasera.' },
    ],
    consejo_rapido: 'Estabiliza en Nivel 7 (Fase 4-1). Coloca siempre a Alune en la misma fila que Morgana para compartir el bono de velocidad de ataque.',
  },
  {
    id: 'gnar-maokai-matones-reroll',
    nombre: 'Gnar & Kindred Bosqueviejo Matones (Slow Roll Lvl 6)',
    arquetipo: 'Slow Roll Lvl 6',
    tier: 'S',
    dificultad: 'Baja',
    estiloDano: 'Híbrido',
    sinergiasActivas: ['6 Bosqueviejo', '4 Matón', '2 Segador'],
    campeonesInicialesCompatibles: ['gnar', 'maokai', 'reksai', 'kindred', 'jax', 'aatrox'],
    early_game: {
      portador_items: 'gnar',
      lvl_4: ['gnar', 'maokai', 'reksai', 'kindred'],
      lvl_5: ['gnar', 'maokai', 'reksai', 'kindred', 'aatrox'],
      lvl_6: ['gnar', 'maokai', 'reksai', 'kindred', 'neeko', 'illaoi'],
      lvl_7: ['gnar', 'maokai', 'reksai', 'kindred', 'soraka', 'illaoi', 'tahmkench'],
      nota_temprana: 'No necesitas vender a nadie: tus fichas iniciales SON tu mesa final. Haz economía hasta 50 de oro en Fase 3-1.',
    },
    transicion_pivot: {
      momento: 'Fase 3-2 (Slow Roll en Nivel 6 sin bajar de 50 de oro)',
      vender: ['jax', 'aatrox'],
      comprar: ['ornn', 'azir', 'kayn'],
      alerta_texto: 'Vender Jax, Aatrox -> Comprar Ornn, Azir al subir a Nivel 7/8 tras conseguir Gnar 3★ y Kindred 3★',
    },
    mesa_final: [
      { championId: 'gnar', rol: 'Carry Principal', estrellas: 3 },
      { championId: 'maokai', rol: 'Tanque Principal', estrellas: 3 },
      { championId: 'kindred', rol: 'Carry Secundario', estrellas: 3 },
      { championId: 'ornn', rol: 'Utilidad', estrellas: 2 },
      { championId: 'reksai', rol: 'Utilidad', estrellas: 3 },
      { championId: 'soraka', rol: 'Utilidad', estrellas: 2 },
      { championId: 'azir', rol: 'Utilidad', estrellas: 2 },
      { championId: 'kayn', rol: 'Utilidad', estrellas: 2 },
    ],
    posicionamiento: [
      { championId: 'maokai', fila: 0, columna: 2, rol: 'Tanque Principal', estrellas: 3, notaPosicion: 'Recibe el primer impacto para que Gnar acumule Valor del Titán sin morir.' },
      { championId: 'gnar', fila: 0, columna: 1, rol: 'Carry Principal', estrellas: 3, notaPosicion: 'Segunda casilla desde la izquierda; recibe daño moderado para cargar Titán.' },
      { championId: 'ornn', fila: 0, columna: 3, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Tanque central y generador de artefactos.' },
      { championId: 'reksai', fila: 0, columna: 4, rol: 'Utilidad', estrellas: 3, notaPosicion: 'Aturde al grupo frontal enemigo.' },
      { championId: 'kayn', fila: 1, columna: 0, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Segunda fila izquierda para activar Segador para Kindred.' },
      { championId: 'kindred', fila: 3, columna: 1, rol: 'Carry Secundario', estrellas: 3, notaPosicion: 'Detrás de Gnar para enfocar al mismo tanque que Gnar golpea.' },
      { championId: 'soraka', fila: 3, columna: 3, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Cura y silencia desde el centro.' },
      { championId: 'azir', fila: 3, columna: 5, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Cierra 6 Bosqueviejo en Nivel 8.' },
    ],
    items: {
      prioridad_carrusel: ['arco', 'chaleco', 'espadon', 'capa', 'lagrima'],
      asignaciones: [
        {
          championId: 'gnar',
          rol: 'Carry Principal',
          itemsIds: ['valor_titan', 'sanguinaria', 'mortaja_firmeza'],
          notaItems: 'Doble Valor del Titán + Sanguinaria convierte a Gnar 3★ en un coloso inmortal.',
        },
        {
          championId: 'kindred',
          rol: 'Carry Secundario',
          itemsIds: ['mejora_azul', 'guantelete_deslumbrante', 'morellonomicon'],
          notaItems: 'Aprovecha todas las lágrimas y varas que no usa Gnar.',
        },
        {
          championId: 'maokai',
          rol: 'Tanque Principal',
          itemsIds: ['gargola', 'warmog', 'garra_dragon'],
          notaItems: 'Si no sale Maokai 3★, mueve estos ítems a Ornn 2★ en Fase 4.',
        },
      ],
    },
    aumentos_top: [
      { nombre: 'Crecimiento Mulch (Bosqueviejo)', tier: 'S', efecto: 'Gana vida permanente cada ronda por cada Bosqueviejo activo.' },
      { nombre: 'Resolución Titánica', tier: 'S', efecto: 'Valor del Titán acumula hasta 40 cargas en vez de 25.' },
      { nombre: 'Sector de Intercambio', tier: 'A', efecto: 'Un giro de tienda gratis por ronda para sacar Gnar y Kindred 3★ rápido.' },
    ],
    consejo_rapido: 'Si al inicio de Fase 3 tienes 4+ copias de Gnar o Kindred, quédate en Nivel 6 buscando con el interés sobre 50 de oro.',
  },
  {
    id: 'ashe-porcelana-francotiradores',
    nombre: 'Ashe & Nautilus Porcelana Guardián (Fast 8)',
    arquetipo: 'Fast 8',
    tier: 'S',
    dificultad: 'Media',
    estiloDano: 'AD',
    sinergiasActivas: ['4 Porcelana', '4 Francotirador', '4 Vanguardia', '2 Místico'],
    campeonesInicialesCompatibles: ['caitlyn', 'kogmaw', 'amumu', 'garen', 'lux', 'senna'],
    early_game: {
      portador_items: 'kogmaw',
      lvl_4: ['caitlyn', 'kogmaw', 'amumu', 'garen'],
      lvl_5: ['caitlyn', 'kogmaw', 'senna', 'amumu', 'garen'],
      lvl_6: ['caitlyn', 'senna', 'lux', 'amumu', 'garen', 'thresh'],
      lvl_7: ['aphelios', 'senna', 'lux', 'amumu', 'thresh', 'illaoi', 'caitlyn'],
      nota_temprana: 'Amumu 2★ con Gárgola + Senna/Caitlyn 2★ con Guinsoo dominan toda la Fase 2 y 3.',
    },
    transicion_pivot: {
      momento: 'Fase 4-2 (Subir a Nivel 8)',
      vender: ['kogmaw', 'garen'],
      comprar: ['ashe', 'nautilus', 'lissandra'],
      alerta_texto: 'Vender KogMaw, Garen -> Comprar Ashe, Nautilus, Lissandra (Pasar Guinsoo + Filo a Ashe)',
    },
    mesa_final: [
      { championId: 'ashe', rol: 'Carry Principal', estrellas: 2 },
      { championId: 'nautilus', rol: 'Tanque Principal', estrellas: 2 },
      { championId: 'lissandra', rol: 'Carry Secundario', estrellas: 2 },
      { championId: 'amumu', rol: 'Tanque Principal', estrellas: 3 },
      { championId: 'aphelios', rol: 'Utilidad', estrellas: 2 },
      { championId: 'lux', rol: 'Utilidad', estrellas: 2 },
      { championId: 'senna', rol: 'Utilidad', estrellas: 2 },
      { championId: 'caitlyn', rol: 'Utilidad', estrellas: 2 },
    ],
    posicionamiento: [
      { championId: 'amumu', fila: 0, columna: 2, rol: 'Tanque Principal', estrellas: 3, notaPosicion: 'Con 4 Porcelana activos reduce muchísimo el daño recibido.' },
      { championId: 'nautilus', fila: 0, columna: 3, rol: 'Tanque Principal', estrellas: 2, notaPosicion: 'Centro de 1ra línea para aturdir en línea recta hacia el carry rival.' },
      { championId: 'lissandra', fila: 1, columna: 4, rol: 'Carry Secundario', estrellas: 2, notaPosicion: 'Segunda fila para meter al tanque principal enemigo en la tetera.' },
      { championId: 'caitlyn', fila: 3, columna: 0, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Esquina opuesta para atraer habilidades de largo alcance.' },
      { championId: 'lux', fila: 3, columna: 1, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Apunta su rayo cruzado hacia la esquina opuesta.' },
      { championId: 'senna', fila: 3, columna: 4, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Al lado izquierdo de Ashe para darle el bono de AD.' },
      { championId: 'aphelios', fila: 3, columna: 5, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Aplica reducción de armadura para que Ashe derrita.' },
      { championId: 'ashe', fila: 3, columna: 6, rol: 'Carry Principal', estrellas: 2, notaPosicion: 'Esquina inferior derecha para máxima distancia de Francotirador.' },
    ],
    items: {
      prioridad_carrusel: ['arco', 'espadon', 'vara', 'chaleco', 'capa'],
      asignaciones: [
        {
          championId: 'ashe',
          rol: 'Carry Principal',
          itemsIds: ['espada_furia_guinsoo', 'ultimo_suspiro', 'filo_infinito'],
          notaItems: 'Guinsoo + Último Suspiro son innegociables en Ashe.',
        },
        {
          championId: 'amumu',
          rol: 'Tanque Principal',
          itemsIds: ['gargola', 'warmog', 'redencion'],
          notaItems: 'Equipa en Amumu 3★ o en Nautilus 2★ según quién suba primero.',
        },
        {
          championId: 'lissandra',
          rol: 'Carry Secundario',
          itemsIds: ['lanza_shojin', 'morellonomicon', 'baston_arcangel'],
          notaItems: 'Lissandra con Shojin inutiliza al tanque enemigo y genera oro/objetos.',
        },
      ],
    },
    aumentos_top: [
      { nombre: 'Punto de Ebullición (Porcelana)', tier: 'S', efecto: 'Los ataques de campeones Porcelana regeneran vida y maná.' },
      { nombre: 'Emblema de Porcelana', tier: 'S', efecto: 'Permite activar 4 Porcelana en Nivel 7 sin necesitar a Lissandra.' },
      { nombre: 'Nido del Francotirador', tier: 'A', efecto: 'Otorga hasta +32% de amplificación de daño si Ashe no se mueve de su casilla.' },
    ],
    consejo_rapido: 'Si encuentras una Espátula en carrusel, combínala con Arco Curvo para crear Emblema de Porcelana y ponlo en Aphelios.',
  },
  {
    id: 'katarina-yone-segadores',
    nombre: 'Yone & Katarina Segadores Duelistas (Reroll Lvl 6/7)',
    arquetipo: 'Slow Roll Lvl 6',
    tier: 'A',
    dificultad: 'Media',
    estiloDano: 'Híbrido',
    sinergiasActivas: ['4 Segador', '4 Duelista', '2 Coloso', '2 Umbrío'],
    campeonesInicialesCompatibles: ['darius', 'yasuo', 'katarina', 'shen', 'reksai', 'kindred'],
    early_game: {
      portador_items: 'darius',
      lvl_4: ['darius', 'yasuo', 'katarina', 'shen'],
      lvl_5: ['darius', 'yasuo', 'katarina', 'shen', 'reksai'],
      lvl_6: ['yone', 'katarina', 'darius', 'yasuo', 'shen', 'volibear'],
      lvl_7: ['yone', 'katarina', 'kayn', 'kindred', 'yasuo', 'volibear', 'shen'],
      nota_temprana: 'Darius 2★ con Sanguinaria + Valor del Titán gana toda la Fase 2 hasta encontrar a Yone.',
    },
    transicion_pivot: {
      momento: 'Fase 3-2 / 4-1 (Reroll en Nivel 6/7 por Katarina 3★ y Yone 3★)',
      vender: ['darius', 'reksai'],
      comprar: ['yone', 'kayn', 'irelia'],
      alerta_texto: 'Vender Darius (pasar ítems a Yone), RekSai -> Comprar Yone, Kayn, Volibear',
    },
    mesa_final: [
      { championId: 'yone', rol: 'Carry Principal', estrellas: 3 },
      { championId: 'katarina', rol: 'Carry Secundario', estrellas: 3 },
      { championId: 'volibear', rol: 'Tanque Principal', estrellas: 3 },
      { championId: 'kayn', rol: 'Carry Secundario', estrellas: 2 },
      { championId: 'irelia', rol: 'Utilidad', estrellas: 2 },
      { championId: 'shen', rol: 'Utilidad', estrellas: 2 },
      { championId: 'yasuo', rol: 'Utilidad', estrellas: 2 },
      { championId: 'kindred', rol: 'Utilidad', estrellas: 2 },
    ],
    posicionamiento: [
      { championId: 'volibear', fila: 0, columna: 3, rol: 'Tanque Principal', estrellas: 3, notaPosicion: 'Recibe el foco inicial mientras Yone y Katarina entran por los costados.' },
      { championId: 'shen', fila: 0, columna: 2, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Bloquea ataques básicos junto a Volibear.' },
      { championId: 'yasuo', fila: 0, columna: 4, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Activa Duelista y Coloso.' },
      { championId: 'yone', fila: 0, columna: 0, rol: 'Carry Principal', estrellas: 3, notaPosicion: 'Extremo izquierdo o derecho para saltar directo a la esquina del carry enemigo.' },
      { championId: 'katarina', fila: 1, columna: 1, rol: 'Carry Secundario', estrellas: 3, notaPosicion: 'Segunda fila detrás de Yone para saltar al grupo trasero.' },
      { championId: 'kayn', fila: 1, columna: 5, rol: 'Carry Secundario', estrellas: 2, notaPosicion: 'Flanco derecho para limpiar objetivos tocados.' },
      { championId: 'kindred', fila: 3, columna: 1, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Completa 4 Segador (las habilidades sangran y hacen crítico).' },
      { championId: 'irelia', fila: 3, columna: 6, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Aporta 4 Duelista y reducción de armadura en Nivel 8.' },
    ],
    items: {
      prioridad_carrusel: ['espadon', 'arco', 'guantes', 'capa', 'chaleco'],
      asignaciones: [
        {
          championId: 'yone',
          rol: 'Carry Principal',
          itemsIds: ['sanguinaria', 'valor_titan', 'espada_furia_guinsoo'],
          notaItems: 'Sanguinaria + Titán son obligatorios para que Yone no muera al saltar atrás.',
        },
        {
          championId: 'katarina',
          rol: 'Carry Secundario',
          itemsIds: ['mano_justicia', 'guantelete_deslumbrante', 'chispa_ionica'],
          notaItems: 'Con 4 Segador ya tiene crítico en habilidad; puedes darle Mano de la Justicia + Sombrero.',
        },
        {
          championId: 'volibear',
          rol: 'Tanque Principal',
          itemsIds: ['warmog', 'gargola', 'capa_fuego_solar'],
          notaItems: 'Capa de Fuego Solar corta la curación de la línea frontal enemiga.',
        },
      ],
    },
    aumentos_top: [
      { nombre: 'Cosecha Implacable (Segadores)', tier: 'S', efecto: 'Los Segadores ganan +15% de Omnivampirismo y ejecutan bajo el 10% de vida.' },
      { nombre: 'Resolución Titánica', tier: 'S', efecto: 'Convierte a Yone 3★ en una unidad imposible de bajar.' },
      { nombre: 'Vampirismo Cibernético', tier: 'A', efecto: 'Otorga vida y robo de vida a todas las fichas con ítem.' },
    ],
    consejo_rapido: 'Inspecciona el tablero rival cada ronda y coloca a Yone en el mismo lado (izquierda o derecha) que el carry principal enemigo.',
  },
  {
    id: 'syndra-annie-invocadores',
    nombre: 'Syndra & Annie Invocadores Místicos (Fast 8 AP)',
    arquetipo: 'Fast 8',
    tier: 'A',
    dificultad: 'Baja',
    estiloDano: 'AP',
    sinergiasActivas: ['6 Invocador', '3 Tejehechizos', '2 Vanguardia', '2 Místico'],
    campeonesInicialesCompatibles: ['ahri', 'zoe', 'zyra', 'lillia', 'garen', 'janna', 'neeko'],
    early_game: {
      portador_items: 'ahri',
      lvl_4: ['ahri', 'zyra', 'lillia', 'garen'],
      lvl_5: ['ahri', 'zyra', 'lillia', 'neeko', 'janna'],
      lvl_6: ['ahri', 'zyra', 'lillia', 'neeko', 'janna', 'alune'],
      lvl_7: ['ahri', 'alune', 'lillia', 'neeko', 'janna', 'soraka', 'illaoi'],
      nota_temprana: 'Ahri 2★ con Mejora Azul + Diente de Nashor elimina tanques de un solo hechizo en Fase 2 y 3.',
    },
    transicion_pivot: {
      momento: 'Fase 4-2 (Subir a Nivel 8)',
      vender: ['ahri', 'zyra', 'garen'],
      comprar: ['syndra', 'annie', 'azir'],
      alerta_texto: 'Vender Ahri (pasar Mejora Azul a Syndra), Zyra, Garen -> Comprar Syndra, Annie, Azir',
    },
    mesa_final: [
      { championId: 'syndra', rol: 'Carry Principal', estrellas: 2 },
      { championId: 'annie', rol: 'Tanque Principal', estrellas: 2 },
      { championId: 'azir', rol: 'Carry Secundario', estrellas: 2 },
      { championId: 'alune', rol: 'Utilidad', estrellas: 2 },
      { championId: 'nautilus', rol: 'Utilidad', estrellas: 2 },
      { championId: 'lillia', rol: 'Utilidad', estrellas: 2 },
      { championId: 'janna', rol: 'Utilidad', estrellas: 2 },
      { championId: 'neeko', rol: 'Utilidad', estrellas: 2 },
    ],
    posicionamiento: [
      { championId: 'annie', fila: 0, columna: 3, rol: 'Tanque Principal', estrellas: 2, notaPosicion: 'Sola o con Nautilus en primera línea para lanzar a Tibbers en 2 segundos.' },
      { championId: 'nautilus', fila: 0, columna: 2, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Aporta Vanguardia y control de masas.' },
      { championId: 'neeko', fila: 0, columna: 4, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Activa Tejehechizos y absorbe daño.' },
      { championId: 'lillia', fila: 3, columna: 0, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Activa 6 Invocador.' },
      { championId: 'janna', fila: 3, columna: 1, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Otorga escudos a Syndra y Azir.' },
      { championId: 'alune', fila: 3, columna: 4, rol: 'Utilidad', estrellas: 2, notaPosicion: 'Reduce resistencia mágica y aporta daño en área.' },
      { championId: 'azir', fila: 3, columna: 5, rol: 'Carry Secundario', estrellas: 2, notaPosicion: 'Sus soldados protegen a Syndra de incursiones.' },
      { championId: 'syndra', fila: 3, columna: 6, rol: 'Carry Principal', estrellas: 2, notaPosicion: 'Esquina inferior derecha acumulando mariposas en cada lanzamiento.' },
    ],
    items: {
      prioridad_carrusel: ['lagrima', 'vara', 'cinturon', 'arco', 'capa'],
      asignaciones: [
        {
          championId: 'syndra',
          rol: 'Carry Principal',
          itemsIds: ['mejora_azul', 'diente_nashor', 'sombrero_rabadon'],
          notaItems: 'Con 6 Invocador, Mejora Azul + Diente de Nashor permiten lanzar cada 1.5 segundos.',
        },
        {
          championId: 'annie',
          rol: 'Tanque Principal',
          itemsIds: ['gargola', 'warmog', 'garra_dragon'],
          notaItems: 'Annie se cura un porcentaje de su vida máxima al subir a Tibbers.',
        },
        {
          championId: 'azir',
          rol: 'Carry Secundario',
          itemsIds: ['lanza_shojin', 'guantelete_deslumbrante', 'morellonomicon'],
          notaItems: 'Cualquier ítem de AP extra va para Azir en Nivel 8/9.',
        },
      ],
    },
    aumentos_top: [
      { nombre: 'Emblema de Invocador', tier: 'S', efecto: 'Ponlo en Nautilus o Morgana para llegar a 6 Invocador en Nivel 7.' },
      { nombre: 'Batería Azul', tier: 'S', efecto: 'Syndra recupera 10 de maná adicional después de cada lanzamiento.' },
      { nombre: 'Varita Mágica', tier: 'A', efecto: 'Otorga una Vara Innecesariamente Grande y +18 AP a todo el equipo.' },
    ],
    consejo_rapido: 'No busques ítems de crítico si no tienes Guantelete Deslumbrante; Sombrero de Rabadon + Mejora Azul + Nashor rinde mejor en Syndra.',
  },
];
