import React, { useState } from 'react';
import {
  Compass,
  ShieldCheck,
  TrendingUp,
  Truck,
  Anchor,
  Zap,
  Building2,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Award,
  Layers,
  MapPin
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/80">
      {/* Background visual accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#FF6A1A]/10 via-[#00D2D3]/5 to-transparent blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1923] border border-[#FF6A1A]/40 text-[#FF6A1A] text-xs font-mono font-bold tracking-wider uppercase mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-pulse" />
          ARACRUZ · ESPÍRITO SANTO · BRASIL
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Área 03: Ativo Industrial a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A1A] via-[#FF843D] to-amber-400">
                Menos de 10 km
              </span>{' '}
              dos Maiores Portos.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
              Terreno estratégico com mais de <strong>1.200 a 2.000 metros de testada contínua para a Rodovia ES-010</strong>,
              inserido no polo de exportação marítima que concentra Portocel, Suzano, Porto Imetame (Hanseatic) e a montadora GWM.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#mapa-estrategico"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#FF843D] hover:from-[#e5590f] hover:to-[#e6702c] text-white text-sm font-bold shadow-xl shadow-[#FF6A1A]/25 flex items-center gap-2.5 transition-all active:scale-95"
              >
                <Compass className="w-4 h-4" />
                Explorar no Mapa 3D
              </a>
              <a
                href="#contato"
                className="px-6 py-3.5 rounded-xl bg-[#0E1923] hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <span>Qualificação de Ocupação</span>
                <ArrowRight className="w-4 h-4 text-[#FF6A1A]" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="p-5 rounded-2xl bg-[#0E1923]/90 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Distância Portuária</span>
                <Anchor className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-3xl font-display font-black text-white font-mono-num">&lt; 10 km</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Conexão veloz a Portocel e ao novo Porto Imetame
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0E1923]/90 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Frente Rodoviária</span>
                <Truck className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-3xl font-display font-black text-white font-mono-num">2.000 m</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Testada direta para a ES-010 para tráfego pesado
              </p>
            </div>

            <div className="col-span-2 lg:col-span-1 p-5 rounded-2xl bg-[#0E1923]/90 border border-[#FF6A1A]/30 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono tracking-wider text-[#FF6A1A] font-bold">Incentivos Fiscais</span>
                <Award className="w-4 h-4 text-[#FF6A1A]" />
              </div>
              <span className="text-2xl font-display font-bold text-white">SUDENE 75%</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Redução de até 75% no IRPJ + Compete-ES e Invest Indústria
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Trust Banner */}
        <div className="mt-14 pt-8 border-t border-slate-800/80">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4 text-center sm:text-left">
            Gigantes Globais Estabelecidos no Entorno Imediato:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-sm font-bold text-cyan-400 font-display">PORTOCEL</span>
              <span className="block text-[10px] text-slate-500">Terminal Especializado</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-sm font-bold text-cyan-400 font-display">PORTO IMETAME</span>
              <span className="block text-[10px] text-slate-500">Hanseatic / Hapag-Lloyd</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-sm font-bold text-emerald-400 font-display">SUZANO</span>
              <span className="block text-[10px] text-slate-500">Complexo de Celulose</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-sm font-bold text-amber-400 font-display">GWM MOTORS</span>
              <span className="block text-[10px] text-slate-500">Montadora de Veículos</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <span className="text-sm font-bold text-indigo-400 font-display">SEATRIUM</span>
              <span className="block text-[10px] text-slate-500">Estaleiro Offshore</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const StrategicBenefitsSection: React.FC = () => {
  return (
    <section id="diferenciais" className="py-20 bg-[#0A1118] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF6A1A]">
            Diferenciais de Localização
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2 mb-4">
            Infraestrutura Logística Consolidada
          </h2>
          <p className="text-sm text-slate-400">
            Redução direta de custo operacional com acesso marítimo de calado profundo, eixos rodoviários duplicados e corredores de escoamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-7 rounded-2xl bg-[#0E1923] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                <Anchor className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Águas Profundas & Dois Portos
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Portocel com movimentação líder de celulose e o novo Porto Imetame com calado de 17 metros, operado em sociedade com o grupo alemão Hanseatic (Hapag-Lloyd).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400">
              ✓ Menos de 10 km de distância do ativo
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#0E1923] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Conexão Rodoviária ES-010 & ES-445
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Testada de 1.200 a 2.000 metros lineares para a Rodovia ES-010, permitindo fácil manobra e entrada/saída de carretas pesadas, rodotrens e cargas superdimensionadas.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-amber-400">
              ✓ Conexão direta com a BR-101
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#0E1923] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Incentivos Tributários Estruturantes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aracruz integra a área de abrangência da SUDENE, conferindo até 75% de redução do IRPJ e acesso ao FNE, além dos programas estaduais COMPETE-ES, Invest Indústria e FUNDAP.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400">
              ✓ Margem financeira e ganho tributário
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contato" className="py-20 bg-[#080D13]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF6A1A]">
          ACESSO MEDIANTE QUALIFICAÇÃO
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2 mb-4">
          Hoje Disponível. Amanhã Integrado à Sua Operação.
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Gleba industrial e logística de grande porte na região portuária de Aracruz. Atendimento consultivo para operadores, investidores e grupos industriais.
        </p>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-[#0E1923] border border-emerald-500/40 text-emerald-300 max-w-lg mx-auto">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
            <h4 className="text-lg font-bold text-white">Solicitação Recebida com Sucesso</h4>
            <p className="text-xs text-slate-300 mt-2">
              Nossa equipe de estruturação territorial entrará em contato para agendamento técnico e envio do book geoespacial completo.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-[#0E1923] border border-slate-800 text-left max-w-xl mx-auto shadow-2xl space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome do Executivo / Representante
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Mendes"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF6A1A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Empresa / Fundo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Logística Global S.A."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF6A1A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: (27) 99999-9999"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF6A1A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                E-mail Corporativo
              </label>
              <input
                type="email"
                required
                placeholder="Ex: contato@empresa.com.br"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF6A1A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Interesse Operacional
              </label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6A1A]">
                <option>Instalação de Centro de Distribuição / Galpões</option>
                <option>Planta Fabril / Indústria de Transformação</option>
                <option>Operação de Apoio Portuário / Retroárea</option>
                <option>Aquisição Estratégica / Fundo de Investimento</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#FF843D] hover:from-[#e5590f] hover:to-[#e6702c] text-white font-bold text-xs shadow-xl shadow-[#FF6A1A]/30 transition-all active:scale-[0.99]"
            >
              SOLICITAR DOSSIÊ TÉCNICO & AGENDAMENTO
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
