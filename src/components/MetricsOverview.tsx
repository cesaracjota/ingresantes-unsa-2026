import React from 'react';

interface MetricsProps {
  filteredCount: number;
  totalCount: number;
  filterStats: {
    max: number;
    min: number;
    avg: number;
  };
}

export function MetricsOverview({ filteredCount, totalCount, filterStats }: MetricsProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Total Muestra */}
        <div className="flex flex-col justify-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Muestra
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {filteredCount}
            </span>
            {filteredCount !== totalCount && (
              <span className="text-xs text-slate-400 font-medium">de {totalCount}</span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">Ingresantes en nómina</span>
        </div>

        {/* Puntaje Máximo */}
        <div className="flex flex-col justify-center pt-3 md:pt-0 md:pl-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
            Puntaje Máximo
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-950 font-mono">
              {filterStats.max > 0 ? filterStats.max.toFixed(3) : '-'}
            </span>
            <span className="text-xs text-rose-600 font-semibold">pts</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">Calificación más alta</span>
        </div>

        {/* Puntaje Promedio */}
        <div className="flex flex-col justify-center pt-3 md:pt-0 md:pl-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
            Puntaje Promedio (Media)
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-mono">
              {filterStats.avg > 0 ? filterStats.avg.toFixed(3) : '-'}
            </span>
            <span className="text-xs text-blue-600 font-semibold">pts</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">Promedio de selección</span>
        </div>

        {/* Puntaje Corte */}
        <div className="flex flex-col justify-center pt-3 md:pt-0 md:pl-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Puntaje Corte (Mínimo)
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-mono">
              {filterStats.min > 0 ? filterStats.min.toFixed(3) : '-'}
            </span>
            <span className="text-xs text-amber-600 font-semibold">pts</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">Calificación de ingreso</span>
        </div>
      </div>
    </div>
  );
}
