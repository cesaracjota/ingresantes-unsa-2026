const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

async function extractAndExport() {
  console.log('Leyendo INGRESANTES 2026.pdf...');
  const dataBuffer = fs.readFileSync(path.join(__dirname, 'INGRESANTES 2026.pdf'));
  const parser = new PDFParse({ data: dataBuffer });
  await parser.load();
  const textResult = await parser.getText();
  const raw = textResult.text || textResult;

  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.match(/^--\s*\d+\s*of\s*\d+\s*--$/));

  let studentStarts = [];
  let currentExpectedNum = 1;
  let currentCareer = '';

  lines.forEach((l, idx) => {
    if (l === 'MEDICINA' || l === 'ING. CIVIL' || l === 'ECONOMÍA') {
      currentCareer = l;
      currentExpectedNum = 1;
      return;
    }
    if (l.includes('N.º Proceso')) return;
    if (l.match(/^\d{1,3}\.\d+/)) return; // Excluye líneas de puntaje que empiezan con números decimales

    const m = l.match(/^(\d{1,3})\s*(.*)$/);
    if (m) {
      const num = parseInt(m[1], 10);
      if (num === currentExpectedNum) {
        studentStarts.push({ lineIdx: idx, career: currentCareer, num, rest: m[2] });
        currentExpectedNum++;
      }
    }
  });

  const parsedStudents = [];

  for (let k = 0; k < studentStarts.length; k++) {
    const current = studentStarts[k];
    const startIdx = current.lineIdx;
    
    let endIdx = lines.length;
    if (k + 1 < studentStarts.length) {
      endIdx = studentStarts[k + 1].lineIdx;
    }
    
    const blockLines = [];
    for (let j = startIdx; j < endIdx; j++) {
      if (lines[j] === 'MEDICINA' || lines[j] === 'ING. CIVIL' || lines[j] === 'ECONOMÍA' || lines[j].includes('N.º Proceso')) {
        break;
      }
      blockLines.push(lines[j]);
    }
    
    let codeIdxInBlock = -1;
    let code = '';
    for (let b = 0; b < blockLines.length; b++) {
      const cm = blockLines[b].match(/^(\d{6})\b(.*)$/);
      if (cm) {
        codeIdxInBlock = b;
        code = cm[1];
        break;
      }
    }
    
    if (codeIdxInBlock === -1) continue;
    
    const modalityParts = [];
    if (current.rest) modalityParts.push(current.rest);
    for (let b = 1; b < codeIdxInBlock; b++) {
      modalityParts.push(blockLines[b]);
    }
    let modalidad = modalityParts.join(' ').replace(/\s+/g, ' ').trim();
    
    const restLines = [];
    const firstRest = blockLines[codeIdxInBlock].replace(/^\d{6}\s*/, '').trim();
    if (firstRest) restLines.push(firstRest);
    for (let b = codeIdxInBlock + 1; b < blockLines.length; b++) {
      restLines.push(blockLines[b]);
    }
    
    const candidateText = restLines.join(' ').replace(/\s+/g, ' ').trim();
    
    const scoreMatch = candidateText.match(/(\d{1,3}\.\d{4,8})$/);
    let puntaje = null;
    let nombre_crudo = candidateText;
    
    if (scoreMatch) {
      puntaje = parseFloat(scoreMatch[1]);
      nombre_crudo = candidateText.substring(0, candidateText.length - scoreMatch[0].length).trim();
    } else {
      const sm2 = candidateText.match(/(\d+\.\d+)\s*$/);
      if (sm2) {
        puntaje = parseFloat(sm2[1]);
        nombre_crudo = candidateText.substring(0, candidateText.length - sm2[0].length).trim();
      }
    }
    
    let apellidos = '';
    let nombres = '';
    if (nombre_crudo.includes(',')) {
      const parts = nombre_crudo.split(',');
      apellidos = parts[0].replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
      nombres = parts.slice(1).join(',').trim();
    } else {
      apellidos = nombre_crudo.replace(/\//g, ' ').trim();
    }

    let carreraNombre = current.career;
    if (carreraNombre === 'ING. CIVIL') {
      carreraNombre = 'Ingeniería Civil';
    } else if (carreraNombre === 'MEDICINA') {
      carreraNombre = 'Medicina';
    } else if (carreraNombre === 'ECONOMÍA') {
      carreraNombre = 'Economía';
    }
    
    let modNorm = modalidad;
    let modCategory = 'Ordinario';
    if (/CEPREUNSA.*1ra.*Fase/i.test(modalidad) || /CEPRUNSA.*1.*Fase/i.test(modalidad) || /CEPRUNSA.*I.*FASE/i.test(modalidad)) {
      modNorm = 'CEPRUNSA I FASE 2026';
      modCategory = 'CEPRUNSA';
    } else if (/CEPREUNSA.*2da.*Fase/i.test(modalidad) || /CEPRUNSA.*2.*Fase/i.test(modalidad) || /CEPRUNSA.*II.*FASE/i.test(modalidad)) {
      modNorm = 'CEPRUNSA II FASE 2026';
      modCategory = 'CEPRUNSA';
    } else if (/1ra.*Fase.*Ordinario/i.test(modalidad) || /Ordinario.*1ra.*Fase/i.test(modalidad) || /ORDINARIO.*I.*FASE/i.test(modalidad)) {
      modNorm = 'ORDINARIO I FASE 2026';
      modCategory = 'Ordinario';
    } else if (/2da.*Fase.*Ordinario/i.test(modalidad) || /Ordinario.*2da.*Fase/i.test(modalidad) || /ORDINARIO.*II.*FASE/i.test(modalidad)) {
      modNorm = 'ORDINARIO II FASE 2026';
      modCategory = 'Ordinario';
    } else if (/CEPREQUINTOS/i.test(modalidad) || /CICLO.*QUINTO/i.test(modalidad)) {
      modNorm = 'CEPRUNSA CICLO QUINTOS 2026';
      modCategory = 'CEPRUNSA';
    } else if (/Extraordinario/i.test(modalidad)) {
      modNorm = 'EXTRAORDINARIO 2026';
      modCategory = 'Extraordinario';
    }

    parsedStudents.push({
      id: `${carreraNombre.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${current.num}`,
      numero: current.num,
      carrera: carreraNombre,
      modalidad: modNorm,
      modalidad_categoria: modCategory,
      codigo: code,
      apellidos: apellidos,
      nombres: nombres,
      nombre_completo: `${apellidos}, ${nombres}`,
      puntaje: puntaje,
      puntaje_formateado: puntaje !== null ? puntaje.toFixed(3) : '-'
    });
  }

  const stats = {
    total_ingresantes: parsedStudents.length,
    por_carrera: {},
    por_modalidad: {},
    puntaje_max: Math.max(...parsedStudents.map(s => s.puntaje || 0)),
    puntaje_min: Math.min(...parsedStudents.map(s => s.puntaje || 100)),
    puntaje_promedio: +(parsedStudents.reduce((acc, s) => acc + (s.puntaje || 0), 0) / parsedStudents.length).toFixed(3),
    actualizado: 'Proceso de Admisión 2026'
  };

  parsedStudents.forEach(s => {
    stats.por_carrera[s.carrera] = (stats.por_carrera[s.carrera] || 0) + 1;
    stats.por_modalidad[s.modalidad] = (stats.por_modalidad[s.modalidad] || 0) + 1;
  });

  const output = {
    meta: {
      universidad: 'Universidad Nacional de San Agustín de Arequipa (UNSA)',
      proceso: 'Admisión 2026',
      subtitulo: 'Investigación Formativa - Econometría II',
      titulo_investigacion: 'Influencia de factores individuales, socioeconómicos en el puntaje de admisión a Medicina, Ingeniería Civil y Economía de la Universidad Nacional de San Agustín de Arequipa, proceso 2026: un modelo econométrico',
      proposito: 'Este visualizador es para la accesibilidad a los encuestados para encontrar una variable para nuestro trabajo de investigación formativa del curso de Econometría II de la Universidad para fines académicos e investigación titulada "Influencia de factores individuales, socioeconómicos en el puntaje de admisión a Medicina, Ingeniería Civil y Economía de la Universidad Nacional de San Agustín de Arequipa, proceso 2026: un modelo econométrico".',
      fecha_extraccion: new Date().toISOString()
    },
    stats,
    ingresantes: parsedStudents
  };

  const targetDir = path.join(__dirname, 'src', 'data');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const outPath = path.join(targetDir, 'ingresantes.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`¡Éxito! Se generó ${outPath} con ${parsedStudents.length} registros extraídos directamente del PDF.`);
}

extractAndExport().catch(console.error);
