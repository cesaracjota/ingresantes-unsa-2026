import { useState, useMemo, useEffect } from 'react';
import type { Ingresante, Stats, SortOption, ViewMode } from '../types/ingresantes';

export function useIngresantesFilter(ingresantes: Ingresante[], stats: Stats) {
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarrera, setSelectedCarrera] = useState<string>('TODAS');
  const [selectedModalidad, setSelectedModalidad] = useState<string>('TODAS');
  const [sortBy, setSortBy] = useState<SortOption>('puesto');

  // In mobile screens, default view mode ALWAYS to 'cards'
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'cards';
    }
    return 'table';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewMode('cards');
    }
  }, []);

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
    setSortBy('puesto');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== '' || selectedCarrera !== 'TODAS' || selectedModalidad !== 'TODAS' || sortBy !== 'puesto';

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

  const exportToCSV = () => {
    const headers = ['N.º', 'Carrera', 'Modalidad', 'Código', 'Apellidos', 'Nombres', 'Puntaje'];
    const rows = filteredData.map(item => [
      item.numero,
      `"${item.carrera}"`,
      `"${item.modalidad}"`,
      `"${item.codigo}"`,
      `"${item.apellidos}"`,
      `"${item.nombres}"`,
      item.puntaje ?? ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ingresantes_unsa_2026_${selectedCarrera.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(filteredData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `ingresantes_unsa_2026_${selectedCarrera.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
    hasActiveFilters,
    exportToCSV,
    exportToJSON
  };
}
