import React from 'react';
import { X, Navigation2, ExternalLink, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { StrategicLocation } from '../../types/map';
import { CATEGORY_STYLES } from '../../data/aracruzData';

interface LocationCardProps {
  location: StrategicLocation;
  onClose: () => void;
  onFocus: (loc: StrategicLocation) => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onClose,
  onFocus,
}) => {
  const catStyle = CATEGORY_STYLES[location.category] || CATEGORY_STYLES.logistica;

  return (
    <div className="absolute left-4 top-20 z-30 w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-[#0E1923]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-5 text-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5"
            style={{
              backgroundColor: catStyle.bg,
              borderColor: catStyle.border,
              color: catStyle.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: catStyle.color }}
            />
            {location.categoryLabel}
          </span>
          {location.isMainAsset && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FF6A1A]/20 text-[#FF6A1A] border border-[#FF6A1A]/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Destaque
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Fechar detalhes da localização"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white tracking-tight leading-snug mb-1">
        {location.name}
      </h3>

      {/* Quick Metrics Bar */}
      <div className="flex items-center gap-2 my-3 text-xs">
        {location.distanceToPorts && (
          <div className="flex-1 bg-slate-800/80 border border-slate-700/50 rounded-lg p-2">
            <span className="block text-[10px] uppercase font-medium text-slate-400">Distância aos Portos</span>
            <span className="font-semibold text-cyan-400 font-mono-num">{location.distanceToPorts}</span>
          </div>
        )}
        {location.distanceToES010 && (
          <div className="flex-1 bg-slate-800/80 border border-slate-700/50 rounded-lg p-2">
            <span className="block text-[10px] uppercase font-medium text-slate-400">Acesso ES-010</span>
            <span className="font-semibold text-amber-400 font-mono-num">{location.distanceToES010}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        {location.description}
      </p>

      {/* Specs List if provided */}
      {location.specs && location.specs.length > 0 && (
        <div className="space-y-1.5 mb-4 border-t border-slate-700/60 pt-3">
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mb-1">
            Informações Técnicas Validadas
          </span>
          {location.specs.map((spec, i) => (
            <div key={i} className="flex items-start justify-between text-xs py-1 border-b border-slate-800/60 last:border-b-0">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                {spec.label}
              </span>
              <span className="font-medium text-slate-200 text-right ml-2">{spec.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
        <button
          type="button"
          onClick={() => onFocus(location)}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#FF843D] hover:from-[#e5590f] hover:to-[#e6702c] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#FF6A1A]/20 transition-all active:scale-[0.98]"
        >
          <Navigation2 className="w-3.5 h-3.5" />
          Centralizar no Mapa
        </button>
      </div>
    </div>
  );
};
