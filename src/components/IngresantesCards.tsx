import React from 'react';
import { Copy, Check } from 'lucide-react';
import type { Ingresante } from '../types/ingresantes';
import { getCarreraBadgeStyle, getModalidadBadgeStyle } from '../utils/styles';

interface CardsProps {
  data: Ingresante[];
  copiedScoreId: string | null;
  onCopyScore: (id: string, score: number | string | null) => void;
  onSelectStudent: (student: Ingresante) => void;
}

export function IngresantesCards({
  data,
  copiedScoreId,
  onCopyScore,
  onSelectStudent
}: CardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {data.map(item => (
        <div
          key={item.id}
          onClick={() => onSelectStudent(item)}
          className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono font-bold text-slate-500 text-xs">
                Puesto #{item.numero}
              </span>
              <span className="font-mono bg-slate-100 text-slate-800 font-semibold border border-slate-200 px-2 py-0.5 rounded text-xs">
                {item.codigo}
              </span>
            </div>

            <h4 className="font-bold text-slate-900 text-sm leading-snug">
              {item.apellidos}
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              {item.nombres}
            </p>

            <div className="space-y-1.5 mb-3">
              <div>
                <span
                  className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border ${getCarreraBadgeStyle(
                    item.carrera
                  )}`}
                >
                  {item.carrera}
                </span>
              </div>
              <div>
                <span
                  className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border ${getModalidadBadgeStyle(
                    item.modalidad
                  )}`}
                >
                  {item.modalidad}
                </span>
              </div>
            </div>
          </div>

          {/* Puntaje con botón de copia directo */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                Puntaje Oficial
              </span>
              <span className="font-mono font-extrabold text-slate-950 text-sm">
                {item.puntaje_formateado} pts
              </span>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                onCopyScore(item.id, item.puntaje !== null ? item.puntaje : item.puntaje_formateado);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition border ${
                copiedScoreId === item.id
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-900 border-slate-200'
              }`}
              title="Copiar puntaje para encuestas"
            >
              {copiedScoreId === item.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
