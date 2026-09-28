import React, { useState } from 'react';
import {
  ListFilter,
  Navigation2,
  ChevronLeft,
  ChevronRight,
  Anchor,
  Factory,
  Route,
  Layers,
  Search,
  Crosshair
} from 'lucide-react';
import { StrategicLocation, LocationCategory } from '../../types/map';
import { CATEGORY_STYLES } from '../../data/aracruzData';

interface LocationDrawerProps {
  locations: StrategicLocation[];
  activeLocationId?: string;
  onSelectLocation: (loc: StrategicLocation) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const LocationDrawer: React.FC<LocationDrawerProps> = ({
  locations,
  activeLocationId,
  onSelectLocation,
  isOpen,
  onToggle,
}) => {
  const [filterCategory, setFilterCategory] = useState<LocationCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = locations.filter((loc) => {
    const matchesCategory = filterCategory === 'all' || loc.category === filterCategory;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.shortLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Toggle button on the left edge */}
      <button
        type="button"
        onClick={onToggle}
        className={`absolute top-20 z-20 transition-all duration-300 pointer-events-auto bg-[#0E1923]/95 backdrop-blur-md border border-slate-700/80 text-slate-200 hover:text-white p-2.5 rounded-r-xl shadow-xl flex items-center gap-2 ${
          isOpen ? 'left-80 sm:left-96' : 'left-0'
        }`}
        title={isOpen ? 'Recolher lista de pontos' : 'Ver todos os pontos estratégicos'}
        aria-label="Alternar painel de localizações estratégicas"
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-[#FF6A1A]" />
        ) : (
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#FF6A1A]" />
            <span className="text-xs font-bold tracking-wider hidden sm:inline">PONTOS</span>
          </div>
        )}
      </button>

      {/* Main Drawer Panel */}
      <div
        className={`absolute top-0 left-0 bottom-0 z-20 w-80 sm:w-96 bg-[#0A1118]/95 backdrop-blur-2xl border-r border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 pointer-events-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-pulse" />
              <h3 className="text-sm font-bold tracking-wide text-white uppercase">
                Localizações Estratégicas
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
              {filteredLocations.length} locais
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar porto, rodovia ou indústria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#FF6A1A] transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCategory === 'all'
                  ? 'bg-[#FF6A1A] text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('terreno')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCategory === 'terreno'
                  ? 'bg-[#FF6A1A] text-white'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
              }`}
            >
              Terreno
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('porto')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCategory === 'porto'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
              }`}
            >
              Portos
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('industria')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCategory === 'industria'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
              }`}
            >
              Indústrias
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('rodovia')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCategory === 'rodovia'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
              }`}
            >
              Rodovias
            </button>
          </div>
        </div>

        {/* Location List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredLocations.map((loc) => {
            const isSelected = loc.id === activeLocationId;
            const catStyle = CATEGORY_STYLES[loc.category] || CATEGORY_STYLES.logistica;

            return (
              <div
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className={`group p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-800/90 border-[#FF6A1A] shadow-lg shadow-[#FF6A1A]/10 scale-[1.01]'
                    : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 w-5">
                      {String(loc.orderNumber).padStart(2, '0')}
                    </span>
                    <span
                      className="text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: catStyle.bg,
                        borderColor: catStyle.border,
                        color: catStyle.color,
                      }}
                    >
                      {loc.categoryLabel}
                    </span>
                  </div>

                  {loc.distanceToPorts && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                      {loc.distanceToPorts}
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-100 group-hover:text-white leading-tight mb-1">
                  {loc.name}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {loc.description}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/60">
                  <span className="font-mono">
                    Coord: {loc.latitude.toFixed(3)}, {loc.longitude.toFixed(3)}
                  </span>
                  <span className="text-[#FF6A1A] group-hover:underline flex items-center gap-1 font-semibold">
                    Sobrevoar <Navigation2 className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })}

          {filteredLocations.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              Nenhum ponto encontrado com esse termo.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
