import React from 'react';
import { Copy, Check, Eye } from 'lucide-react';
import type { Ingresante } from '../types/ingresantes';
import { getCarreraBadgeStyle, getModalidadBadgeStyle } from '../utils/styles';

interface TableProps {
  data: Ingresante[];
  copiedScoreId: string | null;
  onCopyScore: (id: string, score: number | string | null) => void;
  onSelectStudent: (student: Ingresante) => void;
}

export function IngresantesTable({
  data,
  copiedScoreId,
  onCopyScore,
  onSelectStudent
}: TableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Mobile swipe hint */}
      <div className="sm:hidden px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Desliza horizontalmente para ver todas las columnas</span>
        <span className="font-semibold text-rose-800">↔</span>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm border-collapse min-w-[700px] sm:min-w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/90 text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-3 sm:px-4 w-12 text-center sticky left-0 bg-slate-100 z-10">
                N.º
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4 w-28">
                Código
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                Apellidos y Nombres
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4">
                Carrera
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4">
                Modalidad de Ingreso
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4 text-right">
                Puntaje Oficial
              </th>
              <th scope="col" className="py-3.5 px-2 sm:px-4 w-14 text-center no-print">
                Ficha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(item => (
              <tr
                key={item.id}
                onClick={() => onSelectStudent(item)}
                className="hover:bg-slate-50 transition cursor-pointer group"
              >
                {/* Sticky rank number on mobile */}
                <td className="py-3.5 px-3 sm:px-4 text-center font-mono text-xs font-semibold text-slate-500 sticky left-0 bg-white group-hover:bg-slate-50 transition z-10">
                  {item.numero}
                </td>

                {/* Código */}
                <td className="py-3.5 px-3 sm:px-4">
                  <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                    {item.codigo}
                  </span>
                </td>

                {/* Apellidos y nombres */}
                <td className="py-3.5 px-3 sm:px-4">
                  <div className="font-bold text-slate-900 group-hover:text-rose-950 transition text-xs sm:text-sm">
                    {item.apellidos}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.nombres}
                  </div>
                </td>

                {/* Carrera */}
                <td className="py-3.5 px-3 sm:px-4">
                  <span
                    className={`inline-flex items-center text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded border ${getCarreraBadgeStyle(
                      item.carrera
                    )}`}
                  >
                    {item.carrera}
                  </span>
                </td>

                {/* Modalidad */}
                <td className="py-3.5 px-3 sm:px-4">
                  <span
                    className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded border ${getModalidadBadgeStyle(
                      item.modalidad
                    )}`}
                  >
                    {item.modalidad}
                  </span>
                </td>

                {/* Puntaje con Botón de Copiar */}
                <td className="py-3.5 px-3 sm:px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <span className="font-mono font-bold text-slate-950 text-xs sm:text-sm">
                      {item.puntaje_formateado}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onCopyScore(item.id, item.puntaje !== null ? item.puntaje : item.puntaje_formateado);
                      }}
                      className={`p-1 rounded text-xs transition flex items-center gap-1 border ${
                        copiedScoreId === item.id
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-900 border-slate-200'
                      }`}
                      title="Copiar puntaje al portapapeles"
                    >
                      {copiedScoreId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="text-[10px] hidden md:inline text-emerald-800">Copiado</span>
                        </>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Acción Ver Detalle */}
                <td className="py-3.5 px-2 sm:px-4 text-center no-print">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectStudent(item);
                    }}
                    className="p-1.5 rounded text-slate-400 group-hover:text-rose-800 group-hover:bg-rose-50 transition"
                    title="Ver ficha completa"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
