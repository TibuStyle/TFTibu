import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ArrowRightLeft,
  Flame,
  Shield,
  Sparkles,
  Coins,
  Pin,
} from 'lucide-react';
import { MetaComposition } from '../data/metaComps';
import { CHAMPION_CATALOG } from '../data/tftAssets';
import { ChampionIcon } from './ChampionIcon';
import { ComponentBadge, CompletedItemRow } from './ItemIcon';
import { HexBoard4x7 } from './HexBoard4x7';

export type ActiveBoardLevel = 'lvl_4' | 'lvl_5' | 'lvl_6' | 'lvl_7' | 'lvl_8';

interface CompositionCardProps {
  comp: MetaComposition;
  isExpanded: boolean;
  isPinned: boolean;
  onToggleExpand: () => void;
  onTogglePin: () => void;
  globalLevel: ActiveBoardLevel;
  selectedEarlyChampions: string[];
}

const LEVEL_LABELS: { key: ActiveBoardLevel; label: string; stageHint: string }[] = [
  { key: 'lvl_4', label: 'Nivel 4', stageHint: 'Fase 2-1' },
  { key: 'lvl_5', label: 'Nivel 5', stageHint: 'Fase 2-5' },
  { key: 'lvl_6', label: 'Nivel 6', stageHint: 'Fase 3-2' },
  { key: 'lvl_7', label: 'Nivel 7', stageHint: 'Fase 4-1' },
  { key: 'lvl_8', label: 'Nivel 8 (Final)', stageHint: 'Fase 4-2+' },
];

export const CompositionCard: React.FC<CompositionCardProps> = ({
  comp,
  isExpanded,
  isPinned,
  onToggleExpand,
  onTogglePin,
  globalLevel,
  selectedEarlyChampions,
}) => {
  const [activeLevelTab, setActiveLevelTab] = useState<ActiveBoardLevel>(globalLevel);

  useEffect(() => {
    setActiveLevelTab(globalLevel);
  }, [globalLevel]);

  const matchedEarlyCount = comp.campeonesInicialesCompatibles.filter((id) =>
    selectedEarlyChampions.includes(id)
  ).length;

  const getUnitsForActiveLevel = (): {
    championId: string;
    rol?: 'Carry Principal' | 'Tanque Principal' | 'Carry Secundario' | 'Utilidad';
    estrellas?: 1 | 2 | 3;
  }[] => {
    if (activeLevelTab === 'lvl_8') {
      return comp.mesa_final;
    }
    const list = comp.early_game[activeLevelTab] || [];
    return list.map((champId) => ({
      championId: champId,
      rol:
        champId === comp.early_game.portador_items
          ? 'Carry Principal'
          : CHAMPION_CATALOG[champId]?.rolBase === 'Tanque'
          ? 'Tanque Principal'
          : 'Utilidad',
      estrellas: 2,
    }));
  };

  const holderChamp = CHAMPION_CATALOG[comp.early_game.portador_items];

  return (
    <article
      className={`rounded-xl border transition-colors duration-150 ${
        isPinned
          ? 'bg-[#131B2E] border-amber-500/70'
          : isExpanded
          ? 'bg-[#131B2E] border-slate-700'
          : 'bg-[#131B2E]/90 border-slate-800/90 hover:border-slate-700'
      }`}
    >
      {/* Card Header / Collapsed Preview */}
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Tier + Name + Clean Metadata */}
        <div
          onClick={onToggleExpand}
          className="flex items-start gap-3.5 cursor-pointer flex-1 min-w-0"
        >
          {/* Tier Emblem */}
          <div
            className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center shrink-0 font-display font-bold border ${
              comp.tier === 'S'
                ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                : 'bg-sky-500/15 border-sky-400 text-sky-300'
            }`}
          >
            <span className="text-[10px] font-mono uppercase leading-none opacity-80">
              TIER
            </span>
            <span className="text-lg leading-none mt-0.5">{comp.tier}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-display font-bold text-slate-100 truncate">
                {comp.nombre}
              </h3>
              {matchedEarlyCount > 0 && (
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  · {matchedEarlyCount} {matchedEarlyCount === 1 ? 'ficha inicial coincide' : 'fichas iniciales coinciden'}
                </span>
              )}
            </div>

            {/* Clean unboxed metadata per Zero-Pill Discipline */}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
              <span className="text-amber-300 font-semibold">{comp.arquetipo}</span>
              <span aria-hidden="true">·</span>
              <span>Daño {comp.estiloDano}</span>
              <span aria-hidden="true">·</span>
              <span>Dificultad {comp.dificultad}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300">
                {comp.sinergiasActivas.join(' / ')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Final Board Miniatures + Pin & Expand controls */}
        <div className="flex items-center justify-between lg:justify-end gap-3">
          <div
            onClick={onToggleExpand}
            className="flex items-center gap-1.5 overflow-x-auto py-1 cursor-pointer"
          >
            {comp.mesa_final.map((unit) => (
              <ChampionIcon
                key={unit.championId}
                championId={unit.championId}
                size="sm"
                estrellas={unit.estrellas}
                rol={unit.rol}
                showName={true}
                selected={selectedEarlyChampions.includes(unit.championId)}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onTogglePin}
              title={
                isPinned
                  ? 'Desfijar composición'
                  : 'Fijar esta composición arriba durante mi partida'
              }
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isPinned
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                  : 'bg-[#0B0F17] text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Pin className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToggleExpand}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B0F17] border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{isExpanded ? 'Ocultar' : 'Ver Guía'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-amber-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Tactical Details */}
      {isExpanded && (
        <div className="border-t border-slate-800/90 p-4 sm:p-5 space-y-6 bg-[#0E1422]/90 rounded-b-xl">
          {/* 1. Level-by-Level Progression Bar (Lvl 4, 5, 6, 7, 8) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-display font-bold text-slate-100">
                  1. Qué Jugar Nivel por Nivel (Progresión de Mesa)
                </h4>
                <p className="text-xs text-slate-400">
                  Portador de ítems temprano en Fase 2 y 3:{' '}
                  <strong className="text-amber-300">
                    {holderChamp?.nombre || comp.early_game.portador_items}
                  </strong>{' '}
                  — {comp.early_game.nota_temprana}
                </p>
              </div>

              {/* Segmented Level Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#0B0F17] border border-slate-800 rounded-lg overflow-x-auto">
                {LEVEL_LABELS.map((lvl) => {
                  const active = activeLevelTab === lvl.key;
                  return (
                    <button
                      key={lvl.key}
                      type="button"
                      onClick={() => setActiveLevelTab(lvl.key)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-mono tabular-nums">{lvl.label}</span>
                      <span
                        className={`ml-1 text-[10px] ${
                          active ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        ({lvl.stageHint})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Level Board Units Strip */}
            <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {getUnitsForActiveLevel().map((unit) => (
                  <ChampionIcon
                    key={`${activeLevelTab}-${unit.championId}`}
                    championId={unit.championId}
                    size="md"
                    estrellas={unit.estrellas}
                    rol={unit.rol}
                    showName={true}
                    showCost={true}
                    selected={selectedEarlyChampions.includes(unit.championId)}
                  />
                ))}
              </div>

              <div className="text-right text-xs text-slate-400 font-mono tabular-nums">
                <div>
                  Unidades en mesa:{' '}
                  <strong className="text-slate-100">
                    {getUnitsForActiveLevel().length}
                  </strong>
                </div>
                {activeLevelTab !== 'lvl_8' && (
                  <div className="text-amber-300 mt-0.5">
                    Portador temporal: {holderChamp?.nombre}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Aggressive Pivot Alert Box (Vender X, Y, Z -> Comprar A, B, C) */}
          <div className="bg-[#0B0F17] border border-amber-500/40 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="text-sm font-display font-bold text-amber-300">
                  2. Transición / Pivot Agresivo — {comp.transicion_pivot.momento}
                </h4>
              </div>
              <span className="text-xs font-mono text-slate-300">
                {comp.transicion_pivot.alerta_texto}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sell block */}
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    SALEN DE LA MESA (VENDER)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Véndelos al subir de nivel para recuperar oro y liberar los ítems equipados.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {comp.transicion_pivot.vender.map((id) => (
                    <ChampionIcon
                      key={`sell-${id}`}
                      championId={id}
                      size="sm"
                      showName={true}
                      highlightAction="sell"
                    />
                  ))}
                </div>
              </div>

              {/* Buy block */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    ENTRAN A LA MESA (COMPRAR)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Transfiere inmediatamente los objetos del portador temporal a estos campeones.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {comp.transicion_pivot.comprar.map((id) => (
                    <ChampionIcon
                      key={`buy-${id}`}
                      championId={id}
                      size="sm"
                      showName={true}
                      highlightAction="buy"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Main 2-Column Split: 4x7 Hexagonal Positioning + Exact Item Assignments */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
            {/* Left 7 cols: Hexagonal 4x7 Board */}
            <div className="xl:col-span-7 flex flex-col justify-between">
              <HexBoard4x7
                posicionamiento={comp.posicionamiento}
                asignacionesItems={comp.items.asignaciones}
              />
            </div>

            {/* Right 5 cols: Carousel Priority + Completed Items Assignments */}
            <div className="xl:col-span-5 bg-[#0B0F17] border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-display font-bold text-slate-100">
                  3. Prioridad de Carrusel para esta Compo
                </h4>
                <p className="text-xs text-slate-400 mb-2.5">
                  Orden exacto de componentes sueltos a buscar en el carrusel:
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {comp.items.prioridad_carrusel.map((compId, idx) => (
                    <ComponentBadge
                      key={`${comp.id}-prio-${compId}`}
                      componentId={compId}
                      rankIndex={idx}
                      compact={true}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h4 className="text-sm font-display font-bold text-slate-100">
                  4. Asignación Exacta de Ítems (Español Latino)
                </h4>

                {comp.items.asignaciones.map((asig) => {
                  const champ = CHAMPION_CATALOG[asig.championId];
                  const isMainCarry = asig.rol === 'Carry Principal';
                  const isMainTank = asig.rol === 'Tanque Principal';

                  return (
                    <div
                      key={`${comp.id}-items-${asig.championId}`}
                      className="rounded-lg border border-slate-800/90 bg-[#131B2E]/60 p-3"
                    >
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <ChampionIcon
                            championId={asig.championId}
                            size="xs"
                            showName={false}
                            rol={asig.rol}
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                              <span>{champ?.nombre || asig.championId}</span>
                              <span className="text-slate-500">·</span>
                              <span
                                className={
                                  isMainCarry
                                    ? 'text-amber-300'
                                    : isMainTank
                                    ? 'text-sky-300'
                                    : 'text-purple-300'
                                }
                              >
                                {asig.rol}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {asig.notaItems}
                            </p>
                          </div>
                        </div>
                        {isMainCarry ? (
                          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : isMainTank ? (
                          <Shield className="w-4 h-4 text-sky-400 shrink-0" />
                        ) : null}
                      </div>

                      <div className="divide-y divide-slate-800/60">
                        {asig.itemsIds.map((itemId, idx) => (
                          <CompletedItemRow
                            key={`${asig.championId}-${itemId}-${idx}`}
                            itemId={itemId}
                            showRecipe={true}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Bottom Strip: Top Augments (Tier S) + Fast Economy / Win Condition Tip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
            {/* Top Augments */}
            <div className="lg:col-span-7 bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-slate-200">
                  Mejores Aumentos (Prioridad en Fase 2-1, 3-2 y 4-2)
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {comp.aumentos_top.map((aug, i) => (
                  <div
                    key={`${comp.id}-aug-${i}`}
                    className="p-2.5 rounded-lg bg-[#131B2E]/70 border border-slate-800/90"
                  >
                    <div className="text-xs font-bold text-amber-300">
                      Tier {aug.tier} · {aug.nombre}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                      {aug.efecto}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Economy / Win Condition Tip */}
            <div className="lg:col-span-5 bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1.5">
                <Coins className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-emerald-300">
                  Consejo Rápido de Economía y Condición de Victoria
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {comp.consejo_rapido}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
