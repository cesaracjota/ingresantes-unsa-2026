import React from 'react';
import { Copy, Check, Eye } from 'lucide-react';
import type { Ingresante } from '../types/ingresantes';

interface TableProps {
  data: Ingresante[];
  selectedCarrera: string;
  selectedModalidad: string;
  copiedScoreId: string | null;
  onCopyScore: (id: string, score: number | string | null) => void;
  onSelectStudent: (student: Ingresante) => void;
}

export function IngresantesTable({
  data,
  selectedCarrera,
  selectedModalidad,
  copiedScoreId,
  onCopyScore,
  onSelectStudent
}: TableProps) {
  return (
    <div className="bg-white border border-slate-300 rounded-xl shadow-xs">
      {/* 1. Header Centrado Institucional con tipografía profesional (Estilo Reporte UNSA) */}
      <div className="bg-slate-200 border-b border-slate-300 p-4 sm:p-5 text-center space-y-2.5 rounded-t-xl">
        <h3 className="text-sm sm:text-base font-black text-slate-950 tracking-wide uppercase font-heading">
          RELACIÓN DE INGRESANTES <span className="text-rose-900">&gt;&gt;</span> ORDEN DE MÉRITO
        </h3>

        {/* Dynamic filters display (Escuela & Proceso) centrado */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-700 uppercase">
          <span className="bg-white px-3 py-1 rounded border border-slate-300 shadow-2xs">
            <span className="text-slate-500 font-semibold">ESCUELA &gt;&gt; </span>
            <span className="text-rose-950 font-black">
              {selectedCarrera === 'TODAS' ? 'TODAS LAS CARRERAS' : selectedCarrera}
            </span>
          </span>

          <span className="hidden sm:inline text-slate-400 font-normal">|</span>

          <span className="bg-white px-3 py-1 rounded border border-slate-300 shadow-2xs">
            <span className="text-slate-500 font-semibold">PROCESO &gt;&gt;&gt;&gt; </span>
            <span className="text-slate-950 font-black">
              {selectedModalidad === 'TODAS' ? 'TODAS LAS MODALIDADES' : selectedModalidad}
            </span>
          </span>
        </div>

        {/* Conteo de postulantes centrado */}
        <p className="text-[11px] font-semibold text-slate-600 pt-0.5">
          {data.length} {data.length === 1 ? 'postulante en nómina' : 'postulantes en nómina'}
        </p>
      </div>

      {/* 2. Tabla con Cabecera Sticky (Fijada al hacer scroll) */}
      <div className="overflow-x-auto rounded-b-xl">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs border-b-2 border-slate-900">
            <tr className="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider">
              <th scope="col" className="py-3 px-3 sm:px-4 w-14 sm:w-16 text-center font-mono bg-slate-100">
                Puesto
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4 bg-slate-100">
                Apellidos y Nombres
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4 text-right font-mono w-36 sm:w-44 bg-slate-100">
                Puntaje
              </th>
              <th scope="col" className="py-3 px-2 sm:px-4 w-12 sm:w-14 text-center no-print bg-slate-100">
                Ficha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map(item => (
              <tr
                key={item.id}
                onClick={() => onSelectStudent(item)}
                className="hover:bg-slate-100/70 transition cursor-pointer group"
              >
                {/* 1. Puesto */}
                <td className="py-3 px-3 sm:px-4 text-center font-mono text-xs sm:text-sm font-bold text-slate-700">
                  {item.numero}
                </td>

                {/* 2. Apellidos y Nombres */}
                <td className="py-3 px-3 sm:px-4">
                  <div className="font-extrabold text-slate-950 group-hover:text-rose-950 transition text-xs sm:text-sm tracking-tight">
                    {item.apellidos}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {item.nombres}
                  </div>
                </td>

                {/* 3. Puntaje con Botón de Copiar */}
                <td className="py-3 px-3 sm:px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5 sm:gap-2">
                    <span className="font-mono font-black text-slate-950 text-xs sm:text-sm tracking-tight">
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
                          : 'bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-900 border-slate-300'
                      }`}
                      title="Copiar puntaje para encuestas"
                    >
                      {copiedScoreId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="text-[10px] hidden md:inline text-emerald-800 font-semibold">Copiado</span>
                        </>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>

                {/* 4. El ojito */}
                <td className="py-3 px-2 sm:px-4 text-center no-print">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectStudent(item);
                    }}
                    className="p-1.5 rounded text-slate-400 group-hover:text-rose-900 group-hover:bg-rose-50 transition"
                    title="Ver ficha completa del ingresante"
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
