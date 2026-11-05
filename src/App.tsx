/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  RotateCcw,
  Search,
  ShoppingBag,
  Layers,
  Play,
  Pause,
  ChevronRight,
  Wrench,
} from 'lucide-react';
import {
  CHAMPION_CATALOG,
  CAROUSEL_PRIORITIES,
  ITEM_COMPONENTS,
  COMPLETED_ITEMS,
} from './data/tftAssets';
import { INITIAL_META_COMPOSITIONS, MetaComposition } from './data/metaComps';
import { ChampionIcon } from './components/ChampionIcon';
import { ComponentBadge, CompletedItemRow } from './components/ItemIcon';
import { CompositionCard, ActiveBoardLevel } from './components/CompositionCard';
import { DesktopExportModal } from './components/DesktopExportModal';

const STAGE_PHASES: {
  level: ActiveBoardLevel;
  stageCode: string;
  title: string;
  actionDirective: string;
}[] = [
  {
    level: 'lvl_4',
    stageCode: 'Fase 2-1',
    title: 'Nivel 4 — Apertura',
    actionDirective:
      'Sube a Nivel 4 en 2-1 si tienes racha o pares fuertes. Equipa ítems completos en tu portador temporal.',
  },
  {
    level: 'lvl_5',
    stageCode: 'Fase 2-5',
    title: 'Nivel 5 — Pre-Krugs',
    actionDirective:
      'Sube a Nivel 5 tras el carrusel 2-4. Prioriza alcanzar 20–30 de oro para generar interés en Rocosos.',
  },
  {
    level: 'lvl_6',
    stageCode: 'Fase 3-2',
    title: 'Nivel 6 — Estabilización / Slow Roll',
    actionDirective:
      'Sube a Nivel 6 en 3-2. Si juegas Slow Roll Lvl 6, mantén 50g y busca tus 3★. Si vas Fast 8, ahorra oro.',
  },
  {
    level: 'lvl_7',
    stageCode: 'Fase 4-1',
    title: 'Nivel 7 — Preparación de Pivot',
    actionDirective:
      'Si juegas Reroll Lvl 7 (ej. Alune), busca aquí. Si juegas Fast 8, aguanta una ronda más para subir en 4-2.',
  },
  {
    level: 'lvl_8',
    stageCode: 'Fase 4-2+',
    title: 'Nivel 8 — Pivot Agresivo y Mesa Final',
    actionDirective:
      '¡MOMENTO DE PIVOT! Vende tus portadores temporales de coste 1/2, compra tus Coste 4/5 y transfiere todos los ítems.',
  },
];

export default function App() {
  const [compositions, setCompositions] = useState<MetaComposition[]>(() => {
    try {
      const saved = localStorage.getItem('tft_meta_compositions_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial meta compositions
    }
    return INITIAL_META_COMPOSITIONS;
  });

  // Early champion filter state (Cost 1 & Cost 2)
  const [selectedEarlyChampions, setSelectedEarlyChampions] = useState<string[]>([]);
  const [costFilterTab, setCostFilterTab] = useState<'all' | 1 | 2>('all');

  // Carousel route priority state
  const [carouselRoute, setCarouselRoute] = useState<'AD' | 'AP' | 'Tanque'>('AD');
  const [selectedInspectorComp, setSelectedInspectorComp] = useState<string>('espadon');

  // Global game stage / level sync
  const [globalLevel, setGlobalLevel] = useState<ActiveBoardLevel>('lvl_4');
  const [matchClockRunning, setMatchClockRunning] = useState<boolean>(false);
  const [matchSeconds, setMatchSeconds] = useState<number>(95); // 2-1 starts around 1m35s
  const [liveBridgeActive, setLiveBridgeActive] = useState<boolean>(false);
  const [liveBridgeStatus, setLiveBridgeStatus] = useState<string>(
    'Modo Manual / Reloj Web'
  );

  // Composition list filters & accordion state
  const [tierFilter, setTierFilter] = useState<'ALL' | 'S' | 'A'>('ALL');
  const [damageFilter, setDamageFilter] = useState<'ALL' | 'AD' | 'AP' | 'Híbrido'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<string[]>([
    INITIAL_META_COMPOSITIONS[0]?.id || '',
  ]);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  // Desktop .EXE & JSON modal
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [modalInitialTab, setModalInitialTab] = useState<
    'live_bridge' | 'github_pages' | 'json' | 'exe_python'
  >('live_bridge');

  // Save custom JSON compositions to localStorage
  const handleUpdateCompositions = (newComps: MetaComposition[]) => {
    setCompositions(newComps);
    try {
      localStorage.setItem('tft_meta_compositions_v1', JSON.stringify(newComps));
    } catch {
      // Ignore storage quota errors
    }
  };

  // Real TFT Match Clock (1-click sync at Stage 2-1 for 100% browser / GitHub Pages use)
  useEffect(() => {
    if (!matchClockRunning) return;
    const interval = setInterval(() => {
      setMatchSeconds((prev) => {
        const next = prev + 1;
        if (next < 190) setGlobalLevel('lvl_4');
        else if (next < 360) setGlobalLevel('lvl_5');
        else if (next < 580) setGlobalLevel('lvl_6');
        else if (next < 780) setGlobalLevel('lvl_7');
        else setGlobalLevel('lvl_8');
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [matchClockRunning]);

  // Automatic Riot Client Bridge Poller (connects to tft_live_bridge.py at 127.0.0.1:5123)
  useEffect(() => {
    if (!liveBridgeActive) return;
    let cancelled = false;

    const pollBridge = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5123/status');
        if (!res.ok) throw new Error('No response');
        const data = await res.json();
        if (cancelled) return;
        if (data.inGame && data.level) {
          setGlobalLevel(data.level as ActiveBoardLevel);
          setMatchSeconds(Number(data.seconds) || 0);
          setLiveBridgeStatus(
            `Conectado a Riot (${data.summonerName || 'En partida'} · ${data.stage})`
          );
        } else {
          setLiveBridgeStatus('Puente activo · Esperando que inicies partida de TFT');
        }
      } catch {
        if (!cancelled) {
          setLiveBridgeStatus(
            'Puente local no detectado en 127.0.0.1:5123 (Haz clic en Configurar)'
          );
        }
      }
    };

    pollBridge();
    const timer = setInterval(pollBridge, 3500);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [liveBridgeActive]);

  const formatClock = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // All Cost 1 & Cost 2 champions for the early game selector
  const earlyCatalogChampions = useMemo(() => {
    return Object.values(CHAMPION_CATALOG).filter((c) => {
      if (costFilterTab === 1) return c.coste === 1;
      if (costFilterTab === 2) return c.coste === 2;
      return c.coste === 1 || c.coste === 2;
    });
  }, [costFilterTab]);

  const toggleEarlyChampion = (champId: string) => {
    setSelectedEarlyChampions((prev) =>
      prev.includes(champId) ? prev.filter((id) => id !== champId) : [...prev, champId]
    );
  };

  // Filtered and sorted compositions based on early game selection, tier, damage, and pinned status
  const filteredCompositions = useMemo(() => {
    return compositions
      .filter((comp) => {
        // 1. Early champion filter: if user selected early champions, keep only compositions compatible with at least one selected champion (and prioritize those matching ALL or most)
        if (selectedEarlyChampions.length > 0) {
          const hasMatch = selectedEarlyChampions.some(
            (selId) =>
              comp.campeonesInicialesCompatibles.includes(selId) ||
              comp.early_game.lvl_4.includes(selId) ||
              comp.early_game.lvl_5.includes(selId)
          );
          if (!hasMatch) return false;
        }

        // 2. Tier filter
        if (tierFilter !== 'ALL' && comp.tier !== tierFilter) return false;

        // 3. Damage style filter
        if (damageFilter !== 'ALL' && comp.estiloDano !== damageFilter) return false;

        // 4. Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const inName = comp.nombre.toLowerCase().includes(q);
          const inSynergy = comp.sinergiasActivas.some((s) =>
            s.toLowerCase().includes(q)
          );
          const inUnits = comp.mesa_final.some((u) =>
            (CHAMPION_CATALOG[u.championId]?.nombre || u.championId)
              .toLowerCase()
              .includes(q)
          );
          if (!inName && !inSynergy && !inUnits) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned first
        const aPin = pinnedIds.includes(a.id) ? 1 : 0;
        const bPin = pinnedIds.includes(b.id) ? 1 : 0;
        if (aPin !== bPin) return bPin - aPin;

        // Number of matched early champions second
        if (selectedEarlyChampions.length > 0) {
          const aMatches = a.campeonesInicialesCompatibles.filter((id) =>
            selectedEarlyChampions.includes(id)
          ).length;
          const bMatches = b.campeonesInicialesCompatibles.filter((id) =>
            selectedEarlyChampions.includes(id)
          ).length;
          if (aMatches !== bMatches) return bMatches - aMatches;
        }

        // Tier S before Tier A
        if (a.tier !== b.tier) return a.tier === 'S' ? -1 : 1;
        return 0;
      });
  }, [
    compositions,
    selectedEarlyChampions,
    tierFilter,
    damageFilter,
    searchQuery,
    pinnedIds,
  ]);

  // Calculate "Campeones que debes buscar en la tienda para completar estas composiciones" when early champions are selected
  const recommendedShopTargets = useMemo(() => {
    if (selectedEarlyChampions.length === 0 || filteredCompositions.length === 0) {
      return { earlyTargets: [] as string[], coreTargets: [] as string[] };
    }

    const earlySet = new Set<string>();
    const coreSet = new Set<string>();

    filteredCompositions.forEach((comp) => {
      comp.early_game.lvl_4.forEach((id) => {
        if (!selectedEarlyChampions.includes(id)) earlySet.add(id);
      });
      comp.early_game.lvl_5.forEach((id) => {
        if (!selectedEarlyChampions.includes(id)) earlySet.add(id);
      });
      comp.mesa_final.forEach((u) => {
        if (
          !selectedEarlyChampions.includes(u.championId) &&
          (u.rol === 'Carry Principal' ||
            u.rol === 'Tanque Principal' ||
            u.rol === 'Carry Secundario')
        ) {
          coreSet.add(u.championId);
        }
      });
    });

    return {
      earlyTargets: Array.from(earlySet).slice(0, 8),
      coreTargets: Array.from(coreSet).slice(0, 8),
    };
  }, [selectedEarlyChampions, filteredCompositions]);

  // Recipes that use the selected base component
  const recipesForSelectedComponent = useMemo(() => {
    return Object.values(COMPLETED_ITEMS).filter((item) =>
      item.componentes.includes(selectedInspectorComp)
    );
  }, [selectedInspectorComp]);

  const activeStageObj =
    STAGE_PHASES.find((s) => s.level === globalLevel) || STAGE_PHASES[0];

  const toggleExpandCard = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const togglePinCard = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (!expandedIds.includes(id)) {
      setExpandedIds((prev) => [...prev, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F1F5F9] flex flex-col">
      {/* Top Bar Contract: Strict 3-Zone Header */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800/90 bg-[#0B0F17]/95 sticky top-0 z-30 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-lg font-display font-bold tracking-tight text-amber-400 whitespace-nowrap shrink-0"
        >
          TFT Tactical Overlay
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#carrusel-fijo"
            className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Prioridad Carrusel
          </a>
          <a
            href="#selector-temprano"
            className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Filtro Campeones ($1-$2)
          </a>
          <a
            href="#composiciones-meta"
            className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Composiciones Meta
          </a>
          <a
            href="#recetas-items"
            className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Armador de Ítems
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Descargar .EXE / JSON
          </button>
        </div>
      </header>

      {/* Main 1440px Desktop Tactical Workspace */}
      <main id="top" className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-5 space-y-5 flex-1">
        {/* 1. FIXED CAROUSEL PRIORITY & REAL-TIME PHASE BAR */}
        <section
          id="carrusel-fijo"
          className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch"
        >
          {/* Left 7 cols: Fixed Carousel Priority Banner (AD, AP, Tanque) */}
          <div className="xl:col-span-7 bg-[#131B2E] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-display font-bold text-slate-100">
                  Prioridad de Carrusel Fija — ¿Qué Componente Tomar?
                </h2>
                <p className="text-xs text-slate-400">
                  {CAROUSEL_PRIORITIES[carouselRoute].resumen}
                </p>
              </div>

              {/* Segmented Route Switcher (AD / AP / Tanque) */}
              <div className="flex items-center gap-1 p-1 bg-[#0B0F17] border border-slate-800 rounded-lg">
                {(['AD', 'AP', 'Tanque'] as const).map((route) => (
                  <button
                    key={route}
                    type="button"
                    onClick={() => {
                      setCarouselRoute(route);
                      setSelectedInspectorComp(
                        CAROUSEL_PRIORITIES[route].orden[0]
                      );
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      carouselRoute === route
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Ruta {route}
                  </button>
                ))}
              </div>
            </div>

            {/* Ordered Components #1 to #5 */}
            <div className="flex flex-wrap items-center gap-2">
              {CAROUSEL_PRIORITIES[carouselRoute].orden.map((compId, idx) => (
                <React.Fragment key={compId}>
                  <ComponentBadge
                    componentId={compId}
                    rankIndex={idx}
                    compact={false}
                    active={selectedInspectorComp === compId}
                    onClick={() => setSelectedInspectorComp(compId)}
                  />
                  {idx < CAROUSEL_PRIORITIES[carouselRoute].orden.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:block shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right 5 cols: Game Phase / Level Synchronizer (Auto-adjusts all cards to your current round) */}
          <div className="xl:col-span-5 bg-[#131B2E] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div>
                <h2 className="text-sm sm:text-base font-display font-bold text-slate-100">
                  Sincronizador de Partida en Vivo ({formatClock(matchSeconds)})
                </h2>
                <p className="text-xs text-slate-400">
                  {liveBridgeStatus}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (!matchClockRunning) {
                      setMatchSeconds(95);
                      setGlobalLevel('lvl_4');
                      setMatchClockRunning(true);
                    } else {
                      setMatchClockRunning(false);
                    }
                  }}
                  title="Inicia el reloj oficial de tiempos de TFT al empezar la Ronda 2-1 (100% Web)"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    matchClockRunning
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-[#0B0F17] border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {matchClockRunning ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {matchClockRunning ? 'Pausar Reloj' : 'Iniciar en 2-1'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLiveBridgeActive((prev) => !prev);
                  }}
                  title="Conectar con tft_live_bridge.py para leer el cliente de Riot (127.0.0.1:2999)"
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    liveBridgeActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-[#0B0F17] border-slate-800 text-amber-300 hover:border-amber-400/50'
                  }`}
                >
                  {liveBridgeActive ? 'Riot Live: ON' : 'Auto-Riot API'}
                </button>
              </div>
            </div>

            {/* Level Selector Buttons */}
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {STAGE_PHASES.map((st) => {
                const isCurrent = globalLevel === st.level;
                return (
                  <button
                    key={st.level}
                    type="button"
                    onClick={() => setGlobalLevel(st.level)}
                    className={`py-2 px-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-[#0B0F17] text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-mono tabular-nums text-xs font-bold leading-none">
                      {st.level === 'lvl_8' ? 'LVL 8+' : st.level.replace('lvl_', 'LVL ')}
                    </div>
                    <div
                      className={`text-[10px] mt-1 leading-none ${
                        isCurrent ? 'text-slate-900 font-semibold' : 'text-slate-500'
                      }`}
                    >
                      {st.stageCode}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Directive for current phase */}
            <div className="bg-[#0B0F17] border border-slate-800/90 rounded-lg px-3 py-2 text-xs text-slate-300">
              <span className="font-bold text-amber-300">
                {activeStageObj.title}:
              </span>{' '}
              {activeStageObj.actionDirective}
            </div>
          </div>
        </section>

        {/* 2. EARLY CHAMPION SELECTOR (COST 1 & COST 2) + SHOP TARGETS */}
        <section
          id="selector-temprano"
          className="bg-[#131B2E] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-slate-100">
                Selector de Campeones Tempranos (Filtro Rápido Fase 1 y Fase 2)
              </h2>
              <p className="text-xs text-slate-400">
                Haz clic en los campeones de <strong className="text-slate-200">Coste 1 ($1)</strong> o{' '}
                <strong className="text-emerald-400">Coste 2 ($2)</strong> que te salieron en tienda para descartar composiciones inviables al instante.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Cost 1 / Cost 2 filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#0B0F17] border border-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCostFilterTab('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    costFilterTab === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Todos ($1 y $2)
                </button>
                <button
                  type="button"
                  onClick={() => setCostFilterTab(1)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    costFilterTab === 1
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Coste $1
                </button>
                <button
                  type="button"
                  onClick={() => setCostFilterTab(2)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    costFilterTab === 2
                      ? 'bg-emerald-600 text-slate-950 font-bold'
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  Coste $2
                </button>
              </div>

              {selectedEarlyChampions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedEarlyChampions([])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-xs font-semibold text-rose-300 hover:bg-rose-500/25 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpiar Selección ({selectedEarlyChampions.length})
                </button>
              )}
            </div>
          </div>

          {/* Faces of Cost 1 and Cost 2 Champions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {earlyCatalogChampions.map((champ) => {
              const isSelected = selectedEarlyChampions.includes(champ.id);
              return (
                <ChampionIcon
                  key={champ.id}
                  championId={champ.id}
                  size="sm"
                  showName={true}
                  showCost={true}
                  selected={isSelected}
                  onClick={() => toggleEarlyChampion(champ.id)}
                />
              );
            })}
          </div>

          {/* Dynamic Banner: "Campeones que debes buscar en la tienda para completar estas composiciones" */}
          {selectedEarlyChampions.length > 0 && (
            <div className="bg-[#0B0F17] border border-amber-500/50 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                  <h3 className="text-sm font-display font-bold text-amber-300">
                    Campeones que debes buscar en la tienda para completar estas composiciones
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  {filteredCompositions.length}{' '}
                  {filteredCompositions.length === 1
                    ? 'composición viable encontrada'
                    : 'composiciones viables encontradas'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Early Game Shop Targets (Lvl 4 - Lvl 6) */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    1. Cómpralos YA para completar tu mesa de Nivel 4 y Nivel 5:
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {recommendedShopTargets.earlyTargets.map((id) => (
                      <ChampionIcon
                        key={`shop-early-${id}`}
                        championId={id}
                        size="sm"
                        showName={true}
                        showCost={true}
                        highlightAction="buy"
                        onClick={() => toggleEarlyChampion(id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Core Late Game Carries & Tanks to Hold */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    2. Carries y Tanques Principales a buscar en Nivel 7 y Nivel 8:
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {recommendedShopTargets.coreTargets.map((id) => (
                      <ChampionIcon
                        key={`shop-core-${id}`}
                        championId={id}
                        size="sm"
                        showName={true}
                        showCost={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3. INTERACTIVE COMPOSITION CARDS SECTION */}
        <section id="composiciones-meta" className="space-y-4">
          {/* Filter & Action Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#131B2E] border border-slate-800 rounded-xl p-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-display font-bold text-slate-100 whitespace-nowrap">
                  Composiciones Dominantes ({filteredCompositions.length})
                </h2>
              </div>

              {/* Tier Filter */}
              <div className="flex items-center gap-1 p-1 bg-[#0B0F17] border border-slate-800 rounded-lg">
                {(['ALL', 'S', 'A'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTierFilter(t)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      tierFilter === t
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t === 'ALL' ? 'Todos los Tiers' : `Tier ${t}`}
                  </button>
                ))}
              </div>

              {/* Damage Type Filter */}
              <div className="flex items-center gap-1 p-1 bg-[#0B0F17] border border-slate-800 rounded-lg">
                {(['ALL', 'AD', 'AP', 'Híbrido'] as const).map((dmg) => (
                  <button
                    key={dmg}
                    type="button"
                    onClick={() => setDamageFilter(dmg)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      damageFilter === dmg
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {dmg === 'ALL' ? 'Todo Daño' : dmg}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Quick Search */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar campeón o sinergia..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0B0F17] border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (expandedIds.length === filteredCompositions.length) {
                    setExpandedIds([]);
                  } else {
                    setExpandedIds(filteredCompositions.map((c) => c.id));
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0B0F17] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {expandedIds.length === filteredCompositions.length
                  ? 'Colapsar Todas'
                  : 'Expandir Todas'}
              </button>
            </div>
          </div>

          {/* Composition Cards Accordion List */}
          {filteredCompositions.length > 0 ? (
            <div className="space-y-3.5">
              {filteredCompositions.map((comp) => (
                <CompositionCard
                  key={comp.id}
                  comp={comp}
                  isExpanded={expandedIds.includes(comp.id)}
                  isPinned={pinnedIds.includes(comp.id)}
                  onToggleExpand={() => toggleExpandCard(comp.id)}
                  onTogglePin={() => togglePinCard(comp.id)}
                  globalLevel={globalLevel}
                  selectedEarlyChampions={selectedEarlyChampions}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#131B2E] border border-slate-800 rounded-xl p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                No hay composiciones que coincidan con todos los filtros seleccionados.
              </p>
              <p className="text-xs text-slate-400">
                Prueba desmarcando alguno de los campeones iniciales o restableciendo el filtro de daño.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedEarlyChampions([]);
                  setTierFilter('ALL');
                  setDamageFilter('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Restablecer Todos los Filtros
              </button>
            </div>
          )}
        </section>

        {/* 4. QUICK COMPONENT RECIPE BUILDER (ARMADOR DE ÍTEMS EN ESPAÑOL LATINO) */}
        <section
          id="recetas-items"
          className="bg-[#131B2E] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <div>
                <h2 className="text-base font-display font-bold text-slate-100">
                  Armador Rápido de Componentes (Español Latino)
                </h2>
                <p className="text-xs text-slate-400">
                  Selecciona un componente suelto de tu banca para ver qué ítems completos puedes fabricar ahora mismo:
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {Object.values(ITEM_COMPONENTS).map((comp) => (
              <ComponentBadge
                key={`builder-${comp.id}`}
                componentId={comp.id}
                compact={true}
                active={selectedInspectorComp === comp.id}
                onClick={() => setSelectedInspectorComp(comp.id)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {recipesForSelectedComponent.map((item) => (
              <div
                key={`recipe-card-${item.id}`}
                className="bg-[#0B0F17] border border-slate-800 rounded-lg px-3.5 py-2"
              >
                <CompletedItemRow itemId={item.id} showRecipe={true} />
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {item.efectoCorto}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 mt-6 text-center text-xs text-slate-500">
        TFT Tactical Overlay — Asistente de Segunda Pantalla · Arquitectura modular mediante{' '}
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="text-amber-400 hover:underline cursor-pointer"
        >
          meta_comps.json y empaquetado .EXE
        </button>
      </footer>

      {/* Modal for Live Game Detection, GitHub Pages, Live JSON Editing & Desktop .EXE Packaging */}
      <DesktopExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        compositions={compositions}
        onUpdateCompositions={handleUpdateCompositions}
        initialTab={modalInitialTab}
      />
    </div>
  );
}
