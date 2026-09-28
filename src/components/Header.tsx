import React from 'react';
import { Compass, Shield, MapPin, PhoneCall, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A1118]/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A1A] to-[#FF843D] flex items-center justify-center shadow-lg shadow-[#FF6A1A]/20">
            <span className="font-display font-black text-white text-lg tracking-wider">03</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-white tracking-wider text-base">
                ÁREA 03
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#FF6A1A]/15 text-[#FF6A1A] border border-[#FF6A1A]/30 px-1.5 py-0.5 rounded font-bold">
                ARACRUZ
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block tracking-tight">
              Polo Logístico & Industrial do Espírito Santo
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a
            href="#mapa-estrategico"
            className="hover:text-[#FF6A1A] transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#FF6A1A]" />
            Mapa 3D Interativo
          </a>
          <a href="#diferenciais" className="hover:text-white transition-colors">
            Diferenciais Estratégicos
          </a>
          <a href="#complexo-portuario" className="hover:text-white transition-colors">
            Complexo Portuário
          </a>
          <a href="#incentivos" className="hover:text-white transition-colors">
            Incentivos SUDENE
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#contato"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#FF843D] hover:from-[#e5590f] hover:to-[#e6702c] text-white text-xs font-bold shadow-lg shadow-[#FF6A1A]/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Qualificação de Ativo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
