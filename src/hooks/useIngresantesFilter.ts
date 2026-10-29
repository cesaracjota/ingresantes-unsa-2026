import { useState, useMemo } from 'react';
import type { Ingresante, Stats, SortOption, ViewMode } from '../types/ingresantes';

export function useIngresantesFilter(ingresantes: Ingresante[], stats: Stats) {
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarrera, setSelectedCarrera] = useState<string>('TODAS');
  const [selectedModalidad, setSelectedModalidad] = useState<string>('TODAS');
  
  // Por defecto: Mayor puntaje a menor puntaje
  const [sortBy, setSortBy] = useState<SortOption>('puntaje_desc');

  // En móvil y escritorio: Tabla Detallada por defecto siempre
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Selected student for detail modal
  const [selectedStudent, setSelectedStudent] = useState<Ingresante | null>(null);

  // Copy helper states
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedScoreId, setCopiedScoreId] = useState<string | null>(null);

  // Carrera and Modality lists
  const carrerasList = useMemo(() => {
    return ['TODAS', ...Object.keys(stats.por_carrera)];
  }, [stats]);

  const modalidadesList = useMemo(() => {
    return [
      'TODAS',
      'CEPRUNSA I FASE 2026',
      'CEPRUNSA II FASE 2026',
      'ORDINARIO I FASE 2026',
      'ORDINARIO II FASE 2026',
      'CEPRUNSA CICLO QUINTOS 2026',
      'EXTRAORDINARIO 2026'
    ];
  }, []);

  // Filtering & Sorting
  const filteredData = useMemo(() => {
    let result = [...ingresantes];

    if (selectedCarrera !== 'TODAS') {
      result = result.filter(item => item.carrera === selectedCarrera);
    }

    if (selectedModalidad !== 'TODAS') {
      result = result.filter(item => item.modalidad === selectedModalidad);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(item => {
        return (
          item.apellidos.toLowerCase().includes(q) ||
          item.nombres.toLowerCase().includes(q) ||
          item.nombre_completo.toLowerCase().includes(q) ||
          item.codigo.includes(q)
        );
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'puntaje_desc':
          return (b.puntaje ?? 0) - (a.puntaje ?? 0);
        case 'puntaje_asc':
          return (a.puntaje ?? 0) - (b.puntaje ?? 0);
        case 'apellidos_asc':
          return a.apellidos.localeCompare(b.apellidos, 'es');
        case 'apellidos_desc':
          return b.apellidos.localeCompare(a.apellidos, 'es');
        case 'puesto':
        default:
          if (a.carrera === b.carrera) {
            return a.numero - b.numero;
          }
          return a.carrera.localeCompare(b.carrera, 'es');
      }
    });

    return result;
  }, [ingresantes, selectedCarrera, selectedModalidad, searchTerm, sortBy]);

  // Derived metrics
  const filterStats = useMemo(() => {
    if (filteredData.length === 0) return { max: 0, min: 0, avg: 0 };
    const validScores = filteredData.map(d => d.puntaje).filter((p): p is number => p !== null);
    if (validScores.length === 0) return { max: 0, min: 0, avg: 0 };
    const max = Math.max(...validScores);
    const min = Math.min(...validScores);
    const sum = validScores.reduce((acc, curr) => acc + curr, 0);
    const avg = +(sum / validScores.length).toFixed(3);
    return { max, min, avg };
  }, [filteredData]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleFilterChange = (setter: (val: any) => void, val: any) => {
    setter(val);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCarrera('TODAS');
    setSelectedModalidad('TODAS');
    setSortBy('puntaje_desc');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== '' || selectedCarrera !== 'TODAS' || selectedModalidad !== 'TODAS' || sortBy !== 'puntaje_desc';

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyScore = (id: string, score: number | string | null) => {
    if (score === null || score === undefined) return;
    navigator.clipboard.writeText(String(score));
    setCopiedScoreId(id);
    setTimeout(() => setCopiedScoreId(null), 2000);
  };

  return {
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
    hasActiveFilters
  };
}
