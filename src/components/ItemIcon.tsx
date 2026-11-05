import React, { useState } from 'react';
import { COMPLETED_ITEMS, ITEM_COMPONENTS } from '../data/tftAssets';

interface ComponentBadgeProps {
  componentId: string;
  rankIndex?: number;
  compact?: boolean;
  onClick?: () => void;
  active?: boolean;
}

export const ComponentBadge: React.FC<ComponentBadgeProps> = ({
  componentId,
  rankIndex,
  compact = false,
  onClick,
  active = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const comp = ITEM_COMPONENTS[componentId];
  if (!comp) return null;

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      title={`${comp.nombre} (${comp.estadistica})`}
      className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-colors duration-150 ${
        active
          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
          : 'bg-[#131B2E] border-slate-800 text-slate-200 hover:border-slate-700'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {typeof rankIndex === 'number' && (
        <span className="font-mono tabular-nums text-xs font-bold text-amber-400">
          #{rankIndex + 1}
        </span>
      )}
      <div className="w-6 h-6 rounded overflow-hidden border border-slate-700 shrink-0 bg-slate-900 flex items-center justify-center">
        {!imgError ? (
          <img
            src={comp.iconUrl}
            alt={comp.nombre}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="font-mono text-[9px] font-bold"
            style={{ color: comp.colorHex }}
          >
            {comp.abreviatura}
          </span>
        )}
      </div>
      <div className="text-left">
        <div className="text-xs font-semibold leading-tight whitespace-nowrap">
          {comp.nombre}
        </div>
        {!compact && (
          <div className="text-[10px] text-slate-400 leading-tight whitespace-nowrap">
            {comp.estadistica}
          </div>
        )}
      </div>
    </Tag>
  );
};

interface CompletedItemCardProps {
  itemId: string;
  showRecipe?: boolean;
}

export const CompletedItemRow: React.FC<CompletedItemCardProps> = ({
  itemId,
  showRecipe = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const [comp1Err, setComp1Err] = useState(false);
  const [comp2Err, setComp2Err] = useState(false);

  const item = COMPLETED_ITEMS[itemId];
  if (!item) return null;

  const c1 = ITEM_COMPONENTS[item.componentes[0]];
  const c2 = ITEM_COMPONENTS[item.componentes[1]];

  return (
    <div
      title={item.efectoCorto}
      className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-800/70 last:border-b-0"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-md overflow-hidden border border-amber-500/40 shrink-0 bg-slate-900 flex items-center justify-center">
          {!imgError ? (
            <img
              src={item.iconUrl}
              alt={item.nombre}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-mono text-[10px] font-bold text-amber-300">
              {item.nombre.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-100 truncate">
            {item.nombre}
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            {c1?.nombre} + {c2?.nombre}
          </div>
        </div>
      </div>

      {showRecipe && c1 && c2 && (
        <div className="flex items-center gap-1 shrink-0">
          <div
            title={c1.nombre}
            className="w-5 h-5 rounded overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center"
          >
            {!comp1Err ? (
              <img
                src={c1.iconUrl}
                alt={c1.nombre}
                referrerPolicy="no-referrer"
                onError={() => setComp1Err(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-mono text-[8px] font-bold text-slate-300">
                {c1.abreviatura}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">+</span>
          <div
            title={c2.nombre}
            className="w-5 h-5 rounded overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center"
          >
            {!comp2Err ? (
              <img
                src={c2.iconUrl}
                alt={c2.nombre}
                referrerPolicy="no-referrer"
                onError={() => setComp2Err(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-mono text-[8px] font-bold text-slate-300">
                {c2.abreviatura}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
