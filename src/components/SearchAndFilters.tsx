import React from 'react';
import { Search, X } from 'lucide-react';
import type { SortOption, ViewMode } from '../types/ingresantes';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCarrera: string;
  onCarreraChange: (value: string) => void;
  selectedModalidad: string;
  onModalidadChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  carrerasList: string[];
  modalidadesList: string[];
  totalStudents: number;
  careerStats: Record<string, number>;
  modalityStats: Record<string, number>;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedCarrera,
  onCarreraChange,
  selectedModalidad,
  onModalidadChange,
  sortBy,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  viewMode,
  onViewModeChange,
  carrerasList,
  modalidadesList,
  totalStudents,
  careerStats,
  modalityStats,
  hasActiveFilters,
  onResetFilters,
  onExportCSV,
  onExportJSON
}: SearchAndFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Search Input */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-slate-500" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Búsqueda avanzada por apellidos, nombres o código de postulante..."
          className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50/80 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 focus:bg-white transition"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition"
            title="Borrar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Carrera */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Carrera Profesional
          </label>
          <select
            value={selectedCarrera}
            onChange={e => onCarreraChange(e.target.value)}
            className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 transition"
          >
            {carrerasList.map(c => (
              <option key={c} value={c}>
                {c === 'TODAS' ? `Todas las carreras (${totalStudents})` : `${c} (${careerStats[c] || 0})`}
              </option>
            ))}
          </select>
        </div>

        {/* Modalidad */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Proceso / Modalidad
          </label>
          <select
            value={selectedModalidad}
            onChange={e => onModalidadChange(e.target.value)}
            className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 transition"
          >
            {modalidadesList.map(m => (
              <option key={m} value={m}>
                {m === 'TODAS' ? `Todas las modalidades (${totalStudents})` : `${m} (${modalityStats[m] || 0})`}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Ordenar Lista
          </label>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value as SortOption)}
            className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 transition"
          >
            <option value="puesto">Puesto en nómina (N.º)</option>
            <option value="puntaje_desc">Mayor Puntaje (Descendente)</option>
            <option value="puntaje_asc">Menor Puntaje (Ascendente)</option>
            <option value="apellidos_asc">Apellidos (A - Z)</option>
            <option value="apellidos_desc">Apellidos (Z - A)</option>
          </select>
        </div>

        {/* Por Página & Reset */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Por Página
            </label>
            <select
              value={itemsPerPage}
              onChange={e => onItemsPerPageChange(Number(e.target.value))}
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 transition"
            >
              <option value={15}>15 registros</option>
              <option value={25}>25 registros</option>
              <option value={50}>50 registros</option>
              <option value={100}>100 registros</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2 text-xs sm:text-sm bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg font-semibold transition flex items-center justify-center gap-1.5"
              title="Limpiar filtros activos"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Career Quick-filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-500 mr-1">Filtrar Carrera:</span>
        {carrerasList.map(c => {
          const isActive = selectedCarrera === c;
          return (
            <button
              key={c}
              onClick={() => onCarreraChange(c)}
              className={`text-xs px-2.5 py-1 rounded-full border transition font-semibold ${
                isActive
                  ? 'bg-rose-900 text-white border-rose-900 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c === 'TODAS' ? 'Todas' : c}
              <span className={`ml-1 text-[10px] ${isActive ? 'text-rose-200' : 'text-slate-400'}`}>
                ({c === 'TODAS' ? totalStudents : careerStats[c]})
              </span>
            </button>
          );
        })}
      </div>

      {/* View Mode Toggle (Clean without icons) & Export Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Formato de vista:</span>
          <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-0.5">
            <button
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabla Detallada
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tarjetas Móvil
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 mr-1">Exportar:</span>
          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition"
            title="Descargar tabla en formato CSV para Excel/Stata"
          >
            CSV
          </button>
          <button
            onClick={onExportJSON}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition"
            title="Descargar datos en formato JSON"
          >
            JSON
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition no-print"
            title="Imprimir nómina"
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
