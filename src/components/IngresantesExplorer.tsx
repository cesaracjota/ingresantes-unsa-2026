import React from 'react';
import { Info } from 'lucide-react';
import type { Ingresante, Stats } from '../types/ingresantes';
import { useIngresantesFilter } from '../hooks/useIngresantesFilter';
import { MetricsOverview } from './MetricsOverview';
import { SearchAndFilters } from './SearchAndFilters';
import { IngresantesTable } from './IngresantesTable';
import { IngresantesCards } from './IngresantesCards';
import { Pagination } from './Pagination';
import { StudentModal } from './StudentModal';

interface Props {
  ingresantes: Ingresante[];
  stats: Stats;
}

export default function IngresantesExplorer({ ingresantes, stats }: Props) {
  const {
    searchTerm,
    setSearchTerm,
    selectedCarrera,
    setSelectedCarrera,
    selectedModalidad,
    setSelectedModalidad,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    selectedStudent,
    setSelectedStudent,
    copiedCode,
    copiedScoreId,
    handleCopyCode,
    handleCopyScore,
    carrerasList,
    modalidadesList,
    filteredData,
    filterStats,
    totalPages,
    paginatedData,
    handleFilterChange,
    resetFilters,
    hasActiveFilters,
    exportToCSV,
    exportToJSON
  } = useIngresantesFilter(ingresantes, stats);

  return (
    <div className="w-full space-y-6">
      {/* 1. Unified Single Overview Metrics Card */}
      <MetricsOverview
        filteredCount={filteredData.length}
        totalCount={ingresantes.length}
        filterStats={filterStats}
      />

      {/* 2. Control Panel: Search & Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={val => handleFilterChange(setSearchTerm, val)}
        selectedCarrera={selectedCarrera}
        onCarreraChange={val => handleFilterChange(setSelectedCarrera, val)}
        selectedModalidad={selectedModalidad}
        onModalidadChange={val => handleFilterChange(setSelectedModalidad, val)}
        sortBy={sortBy}
        onSortChange={setSortBy}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={val => {
          setItemsPerPage(val);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        carrerasList={carrerasList}
        modalidadesList={modalidadesList}
        totalStudents={ingresantes.length}
        careerStats={stats.por_carrera}
        modalityStats={stats.por_modalidad}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
        onExportCSV={exportToCSV}
        onExportJSON={exportToJSON}
      />

      {/* 3. Empty State or Results (Table / Cards) */}
      {filteredData.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-xs">
          <Info className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1 font-heading">
            No se encontraron ingresantes
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
            No hay registros con los términos o filtros seleccionados. Intenta borrar los filtros o buscar con otro criterio.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-rose-900 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-rose-800 transition"
          >
            Restablecer filtros
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <IngresantesTable
          data={paginatedData}
          copiedScoreId={copiedScoreId}
          onCopyScore={handleCopyScore}
          onSelectStudent={setSelectedStudent}
        />
      ) : (
        <IngresantesCards
          data={paginatedData}
          copiedScoreId={copiedScoreId}
          onCopyScore={handleCopyScore}
          onSelectStudent={setSelectedStudent}
        />
      )}

      {/* 4. Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalFiltered={filteredData.length}
        onPageChange={setCurrentPage}
      />

      {/* 5. Student Detail Modal */}
      <StudentModal
        student={selectedStudent}
        copiedCode={copiedCode}
        copiedScoreId={copiedScoreId}
        onClose={() => setSelectedStudent(null)}
        onCopyCode={handleCopyCode}
        onCopyScore={handleCopyScore}
      />
    </div>
  );
}
