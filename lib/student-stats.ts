export type MateriaStats = {
  respondidas: number;
  acertos: number;
};

export type SimuladoHistorico = {
  id: string;
  titulo: string;
  data: string;
  acertos: number;
  total: number;
  tempo?: string;
};

export type StudentStats = {
  totalSimulados: number;
  totalRespondidas: number;
  totalAcertos: number;
  porMateria: Record<string, MateriaStats>;
  historico: SimuladoHistorico[];
};

const STORAGE_KEY = "student_stats";

export function loadStudentStats(): StudentStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        totalSimulados: 0,
        totalRespondidas: 0,
        totalAcertos: 0,
        porMateria: {},
        historico: [],
      };
    }
    return JSON.parse(raw) as StudentStats;
  } catch {
    return {
      totalSimulados: 0,
      totalRespondidas: 0,
      totalAcertos: 0,
      porMateria: {},
      historico: [],
    };
  }
}

export function saveStudentStats(stats: StudentStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function addSimuladoResult(params: {
  simuladoId: string;
  titulo: string;
  acertos: number;
  total: number;
  porMateria: Record<string, { acertos: number; total: number }>;
}) {
  const stats = loadStudentStats();
  stats.totalSimulados += 1;
  stats.totalRespondidas += params.total;
  stats.totalAcertos += params.acertos;

  Object.entries(params.porMateria).forEach(([materia, data]) => {
    if (!stats.porMateria[materia]) {
      stats.porMateria[materia] = { respondidas: 0, acertos: 0 };
    }
    stats.porMateria[materia].respondidas += data.total;
    stats.porMateria[materia].acertos += data.acertos;
  });

  stats.historico.unshift({
    id: params.simuladoId,
    titulo: params.titulo,
    data: new Date().toISOString(),
    acertos: params.acertos,
    total: params.total,
  });

  saveStudentStats(stats);
}
