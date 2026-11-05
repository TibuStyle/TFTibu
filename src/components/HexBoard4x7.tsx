import React, { useState } from 'react';
import { FlipHorizontal, Crosshair } from 'lucide-react';
import { BoardUnitPosition, ItemAssignment } from '../data/metaComps';
import { CHAMPION_CATALOG, COMPLETED_ITEMS, getChampionPortraitUrl } from '../data/tftAssets';

interface HexBoard4x7Props {
  posicionamiento: BoardUnitPosition[];
  asignacionesItems: ItemAssignment[];
}

const ROWS = [0, 1, 2, 3] as const;
const COLS = [0, 1, 2, 3, 4, 5, 6] as const;
const ROW_LABELS = ['Fila 1 (Frente)', 'Fila 2', 'Fila 3', 'Fila 4 (Fondo)'];

export const HexBoard4x7: React.FC<HexBoard4x7Props> = ({
  posicionamiento,
  asignacionesItems,
}) => {
  const [mirrored, setMirrored] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<BoardUnitPosition | null>(
    posicionamiento.find((u) => u.rol === 'Carry Principal') || posicionamiento[0] || null
  );
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const getUnitAt = (fila: number, col: number): BoardUnitPosition | undefined => {
    const targetCol = mirrored ? 6 - col : col;
    return posicionamiento.find((u) => u.fila === fila && u.columna === targetCol);
  };

  const getItemsForChampion = (champId: string) => {
    const found = asignacionesItems.find((a) => a.championId === champId);
    return found ? found.itemsIds : [];
  };

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="text-sm font-display font-bold text-slate-100">
            Tablero Hexagonal 4×7 — Posicionamiento Exacto
          </h4>
          <p className="text-xs text-slate-400">
            Haz clic en cualquier ficha para ver el motivo táctico de su casilla ·{' '}
            <span className="text-amber-300 font-medium">Borde Dorado = Carry</span> ·{' '}
            <span className="text-sky-300 font-medium">Borde Celeste = Tanque</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMirrored((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-[#131B2E] text-slate-200 hover:border-amber-400/60 hover:text-amber-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
          {mirrored ? 'Vista: Espejada (Der ⇄ Izq)' : 'Espejar Lado (Izq ⇄ Der)'}
        </button>
      </div>

      {/* Frontline indicator */}
      <div className="text-center text-[11px] font-mono text-slate-400 tracking-wider pb-2 border-b border-slate-800/80 mb-3">
        ▲ LÍNEA FRONTAL (CONTACTO ENEMIGO) ▲
      </div>

      {/* 4x7 Hex Grid */}
      <div className="flex flex-col items-center gap-1.5 py-1 overflow-x-auto">
        {ROWS.map((fila) => (
          <div
            key={fila}
            className={`flex items-center gap-1.5 sm:gap-2 ${
              fila % 2 === 1 ? 'translate-x-5 sm:translate-x-6' : ''
            }`}
          >
            {COLS.map((col) => {
              const unit = getUnitAt(fila, col);
              const champ = unit ? CHAMPION_CATALOG[unit.championId] : null;
              const isSelected =
                unit && selectedUnit && selectedUnit.championId === unit.championId;
              const unitItems = unit ? getItemsForChampion(unit.championId) : [];

              const ringColor = !unit
                ? 'bg-[#131B2E]/70 border-slate-800/90'
                : unit.rol === 'Carry Principal'
                ? 'bg-amber-500 p-[2px]'
                : unit.rol === 'Tanque Principal'
                ? 'bg-sky-400 p-[2px]'
                : unit.rol === 'Carry Secundario'
                ? 'bg-purple-500 p-[2px]'
                : 'bg-emerald-500/80 p-[2px]';

              return (
                <div key={`${fila}-${col}`} className="relative flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => unit && setSelectedUnit(unit)}
                    disabled={!unit}
                    title={
                      unit && champ
                        ? `${champ.nombre} (${unit.rol}) — ${ROW_LABELS[fila]}, Casilla ${col + 1}`
                        : `Casilla vacía (${ROW_LABELS[fila]}, Columna ${col + 1})`
                    }
                    className={`w-11 h-12 sm:w-13 sm:h-14 hex-clip flex items-center justify-center transition-transform duration-150 ${ringColor} ${
                      unit
                        ? 'cursor-pointer hover:scale-105'
                        : 'cursor-default opacity-45'
                    } ${isSelected ? 'scale-105 brightness-110' : ''}`}
                  >
                    {unit && champ ? (
                      <div className="w-full h-full hex-clip bg-slate-950 relative flex flex-col items-center justify-center overflow-hidden">
                        {!failedImages[unit.championId] ? (
                          <img
                            src={getChampionPortraitUrl(unit.championId)}
                            alt={champ.nombre}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImages((prev) => ({
                                ...prev,
                                [unit.championId]: true,
                              }))
                            }
                            className="w-full h-full object-cover scale-115"
                          />
                        ) : (
                          <span className="font-mono text-[10px] font-bold text-slate-100">
                            {champ.nombre.slice(0, 3).toUpperCase()}
                          </span>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/80 py-0.5 text-center">
                          <span className="block text-[9px] font-semibold text-white truncate px-1 leading-none">
                            {champ.nombre.replace(' (Diana)', '')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="font-mono text-[9px] text-slate-600 select-none">
                        {fila + 1}-{col + 1}
                      </span>
                    )}
                  </button>

                  {/* Tiny item dots on top of hex if unit carries items */}
                  {unit && unitItems.length > 0 && (
                    <div className="absolute -top-1.5 z-10 flex items-center gap-0.5 bg-slate-950/90 px-1 py-0.5 rounded border border-slate-700">
                      {unitItems.map((itemId, idx) => {
                        const itemObj = COMPLETED_ITEMS[itemId];
                        return (
                          <span
                            key={`${itemId}-${idx}`}
                            title={itemObj?.nombre}
                            className="w-2 h-2 rounded-full bg-amber-400"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected unit tactical note bar */}
      {selectedUnit && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-start sm:items-center gap-2">
            <Crosshair className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-semibold text-slate-100">
                {CHAMPION_CATALOG[selectedUnit.championId]?.nombre || selectedUnit.championId}
              </span>
              <span className="text-slate-500 mx-1.5">·</span>
              <span className="text-amber-300 font-medium">{selectedUnit.rol}</span>
              <span className="text-slate-500 mx-1.5">·</span>
              <span className="font-mono tabular-nums text-slate-400">
                Fila {selectedUnit.fila + 1}, Casilla {(mirrored ? 6 - selectedUnit.columna : selectedUnit.columna) + 1}
              </span>
              {selectedUnit.notaPosicion && (
                <p className="text-slate-300 mt-0.5">{selectedUnit.notaPosicion}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
