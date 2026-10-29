import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import type { Ingresante } from '../types/ingresantes';
import { getCarreraBadgeStyle, getModalidadBadgeStyle } from '../utils/styles';

interface ModalProps {
  student: Ingresante | null;
  copiedCode: boolean;
  copiedScoreId: string | null;
  onClose: () => void;
  onCopyCode: (code: string) => void;
  onCopyScore: (id: string, score: number | string | null) => void;
}

export function StudentModal({
  student,
  copiedCode,
  copiedScoreId,
  onClose,
  onCopyCode,
  onCopyScore
}: ModalProps) {
  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-300 rounded-xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          title="Cerrar ficha"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-rose-900 text-white">
            Ficha de Ingresante
          </span>
          <span className="text-xs font-mono font-semibold text-slate-500">
            Puesto #{student.numero}
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 leading-snug font-heading">
          {student.apellidos}
        </h3>
        <p className="text-sm font-medium text-slate-600 mb-5">
          {student.nombres}
        </p>

        <div className="space-y-3.5 border-t border-b border-slate-200 py-4 mb-6 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Carrera</span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getCarreraBadgeStyle(
                student.carrera
              )}`}
            >
              {student.carrera}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider pt-0.5">
              Modalidad / Proceso
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border text-right max-w-[240px] ${getModalidadBadgeStyle(
                student.modalidad
              )}`}
            >
              {student.modalidad}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Código de Postulante
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300 font-bold text-slate-900">
                {student.codigo}
              </span>
              <button
                onClick={() => onCopyCode(student.codigo)}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition"
                title="Copiar código de postulante"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Puntaje con botón directo de copia para encuestas */}
          <div className="flex justify-between items-center bg-rose-50/50 p-3 rounded-lg border border-rose-100">
            <div>
              <span className="text-rose-900 text-xs font-bold uppercase tracking-wider block">
                Puntaje Obtenido
              </span>
              <span className="font-mono text-xl font-black text-rose-950">
                {student.puntaje_formateado} pts
              </span>
            </div>

            <button
              onClick={() =>
                onCopyScore(
                  `modal-${student.id}`,
                  student.puntaje ?? student.puntaje_formateado
                )
              }
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-2xs ${
                copiedScoreId === `modal-${student.id}`
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-900 hover:bg-rose-800 text-white'
              }`}
              title="Copiar puntaje exacto para tu encuesta de investigación"
            >
              {copiedScoreId === `modal-${student.id}` ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Puntaje Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Puntaje</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition shadow-xs"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
