import React, { useState } from 'react';
import { CHAMPION_CATALOG, getChampionPortraitUrl } from '../data/tftAssets';

interface ChampionIconProps {
  championId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  estrellas?: 1 | 2 | 3;
  rol?: 'Carry Principal' | 'Tanque Principal' | 'Carry Secundario' | 'Utilidad';
  showName?: boolean;
  showCost?: boolean;
  selected?: boolean;
  highlightAction?: 'sell' | 'buy' | 'none';
  onClick?: () => void;
}

const COST_BORDER_STYLES: Record<number, string> = {
  1: 'border-slate-500 text-slate-300',
  2: 'border-emerald-500 text-emerald-400',
  3: 'border-sky-400 text-sky-300',
  4: 'border-purple-500 text-purple-300',
  5: 'border-amber-400 text-amber-300',
};

const COST_BG_FALLBACK: Record<number, string> = {
  1: 'bg-slate-800 text-slate-200',
  2: 'bg-emerald-950 text-emerald-200',
  3: 'bg-sky-950 text-sky-200',
  4: 'bg-purple-950 text-purple-200',
  5: 'bg-amber-950 text-amber-200',
};

const SIZE_MAP = {
  xs: 'w-9 h-9 text-[10px]',
  sm: 'w-11 h-11 text-xs',
  md: 'w-14 h-14 text-xs',
  lg: 'w-16 h-16 text-sm',
};

export const ChampionIcon: React.FC<ChampionIconProps> = ({
  championId,
  size = 'md',
  estrellas,
  rol,
  showName = true,
  showCost = false,
  selected = false,
  highlightAction = 'none',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const champ = CHAMPION_CATALOG[championId] || {
    id: championId,
    nombre: championId,
    coste: 1 as const,
    ddragonKey: 'Ezreal',
    sinergias: [],
    rolBase: 'AD' as const,
  };

  const borderStyle = COST_BORDER_STYLES[champ.coste] || COST_BORDER_STYLES[1];
  const fallbackBg = COST_BG_FALLBACK[champ.coste] || COST_BG_FALLBACK[1];
  const sizeClass = SIZE_MAP[size];

  const isCarry = rol === 'Carry Principal';
  const isTank = rol === 'Tanque Principal';

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      title={`${champ.nombre} ($${champ.coste}) — ${champ.sinergias.join(' · ')}`}
      className={`group relative inline-flex flex-col items-center select-none transition-transform duration-150 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-amber-400 rounded-lg' : ''
      }`}
    >
      {/* Stars indicator on top */}
      {estrellas && estrellas >= 2 && (
        <span
          className={`mb-0.5 font-mono text-[10px] font-bold leading-none tracking-tighter ${
            estrellas === 3 ? 'text-amber-400' : 'text-slate-300'
          }`}
        >
          {estrellas === 3 ? '★★★' : '★★'}
        </span>
      )}

      {/* Portrait frame */}
      <div
        className={`relative ${sizeClass} rounded-lg overflow-hidden border-2 ${borderStyle} ${
          selected
            ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0B0F17]'
            : isCarry
            ? 'ring-1 ring-amber-400/70'
            : isTank
            ? 'ring-1 ring-sky-400/70'
            : ''
        } ${
          highlightAction === 'sell'
            ? 'opacity-80 ring-2 ring-rose-500'
            : highlightAction === 'buy'
            ? 'ring-2 ring-emerald-400'
            : ''
        }`}
      >
        {!imgError ? (
          <img
            src={getChampionPortraitUrl(championId)}
            alt={champ.nombre}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover scale-110 group-hover:scale-115 transition-transform duration-150"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center font-display font-bold ${fallbackBg}`}>
            {champ.nombre.slice(0, 3).toUpperCase()}
          </div>
        )}

        {/* Cost indicator corner */}
        {showCost && (
          <span className="absolute bottom-0 right-0 bg-[#0B0F17]/90 px-1 py-0.2 font-mono tabular-nums text-[10px] font-bold text-slate-200">
            ${champ.coste}
          </span>
        )}

        {/* Role marker corner */}
        {(isCarry || isTank) && (
          <span
            className={`absolute top-0 left-0 px-1 py-0.2 font-mono text-[9px] font-bold uppercase leading-tight ${
              isCarry ? 'bg-amber-500 text-slate-950' : 'bg-sky-500 text-slate-950'
            }`}
          >
            {isCarry ? 'CARRY' : 'TANQUE'}
          </span>
        )}
      </div>

      {/* Champion Name */}
      {showName && (
        <span
          className={`mt-1 max-w-[68px] truncate text-[11px] font-medium leading-tight ${
            selected
              ? 'text-amber-300 font-semibold'
              : isCarry
              ? 'text-amber-200 font-semibold'
              : isTank
              ? 'text-sky-200 font-semibold'
              : 'text-slate-300'
          }`}
        >
          {champ.nombre.replace(' (Diana)', '')}
        </span>
      )}
    </Wrapper>
  );
};
