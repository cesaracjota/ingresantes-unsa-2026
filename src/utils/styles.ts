/**
 * Career badge color styling
 */
export function getCarreraBadgeStyle(carrera: string): string {
  switch (carrera) {
    case 'Medicina':
      return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    case 'Ingeniería Civil':
      return 'bg-sky-50 text-sky-800 border-sky-300';
    case 'Economía':
      return 'bg-indigo-50 text-indigo-800 border-indigo-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
}

/**
 * Modality / Process badge color styling
 */
export function getModalidadBadgeStyle(modalidad: string): string {
  if (modalidad.includes('CEPRUNSA I FASE')) {
    return 'bg-blue-50 text-blue-800 border-blue-200';
  }
  if (modalidad.includes('CEPRUNSA II FASE')) {
    return 'bg-cyan-50 text-cyan-800 border-cyan-200';
  }
  if (modalidad.includes('ORDINARIO I FASE')) {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }
  if (modalidad.includes('ORDINARIO II FASE')) {
    return 'bg-orange-50 text-orange-800 border-orange-200';
  }
  if (modalidad.includes('CICLO QUINTOS')) {
    return 'bg-purple-50 text-purple-800 border-purple-200';
  }
  if (modalidad.includes('EXTRAORDINARIO')) {
    return 'bg-rose-50 text-rose-800 border-rose-200';
  }
  return 'bg-slate-50 text-slate-700 border-slate-200';
}
