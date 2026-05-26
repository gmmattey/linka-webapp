/**
 * Cloudflare Worker Integration para Diagnóstico IA
 *
 * Alinhado ao fluxo Android:
 * - endpoint canônico: /api/ai/diagnostico-conexao
 * - fallback automático para Rules Engine
 */

import type { DiagnosisRecommendation, DiagnosisEngineInput, DiagnosisCause, Severity } from './types';
import { rulesEngine } from './rulesEngine';

const API_TIMEOUT_MS = 15000;
const WORKER_URL = 'https://linka-ai-diagnosis-worker.giammattey-luiz.workers.dev/api/ai/diagnostico-conexao';

interface WorkerResponse {
  status?: string;
  titulo?: string;
  resumo?: string;
  textoLaudo?: string;
  problemaPrincipal?: { tipo?: string };
  acoesRecomendadas?: Array<{
    titulo?: string;
    descricao?: string;
    prioridade?: string;
    tipo?: string;
  }>;
}

function mapStatusToSeverity(status?: string): Severity {
  switch ((status ?? '').toLowerCase()) {
    case 'excelente':
    case 'bom':
    case 'ok':
      return 'healthy';
    case 'ruim':
    case 'critico':
    case 'crítico':
      return 'fail';
    default:
      return 'warn';
  }
}

function mapProblemToCause(problemType?: string): DiagnosisCause {
  const t = (problemType ?? '').toLowerCase();
  if (!t || t === 'sem_problema') return 'healthy';
  if (t.includes('dns')) return 'dns';
  if (t.includes('wifi')) return 'wifi';
  if (t.includes('provedor') || t.includes('isp')) return 'isp_limit';
  if (t.includes('wan')) return 'wan_issue';
  if (t.includes('congestion')) return 'congestion';
  if (t.includes('device') || t.includes('dispositivo')) return 'device';
  return 'unknown';
}

function mapPriority(priority?: string): 'high' | 'medium' | 'low' {
  switch ((priority ?? '').toLowerCase()) {
    case 'alta':
    case 'high':
      return 'high';
    case 'baixa':
    case 'low':
      return 'low';
    default:
      return 'medium';
  }
}

async function callWorker(input: DiagnosisEngineInput): Promise<WorkerResponse> {
  const { testResult } = input;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const payload = {
      schemaVersion: '3',
      generatedAtEpochMs: Date.now(),
      connectionType: testResult.connectionType,
      metricasAtuais: {
        downloadMbps: testResult.dl,
        uploadMbps: testResult.ul,
        latenciaMs: testResult.ping,
        jitterMs: testResult.jitter,
        perdaPacotesPercentual: testResult.packetLoss,
      },
      dispositivos: {
        modelo: testResult.deviceInfo?.model ?? null,
        sistema: testResult.deviceInfo?.os ?? null,
      },
    };

    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Worker API error: ${response.status} - ${error}`);
    }

    return (await response.json()) as WorkerResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Worker API timeout (${API_TIMEOUT_MS}ms)`, { cause: error });
    }
    throw new Error('Falha ao chamar Worker API', { cause: error });
  }
}

export async function checkDiagnosisAvailability(): Promise<boolean> {
  try {
    const response = await fetch(WORKER_URL, { method: 'HEAD' });
    return response.ok || response.status === 405;
  } catch {
    return false;
  }
}

export async function cloudflareDiagnosis(
  input: DiagnosisEngineInput,
): Promise<DiagnosisRecommendation> {
  const startTime = Date.now();

  try {
    const response = await callWorker(input);
    const severity = mapStatusToSeverity(response.status);
    const cause = mapProblemToCause(response.problemaPrincipal?.tipo);

    return {
      id: `diag-cf-${Date.now()}`,
      timestamp: Date.now(),
      cause,
      severity,
      title: response.titulo ?? 'Diagnóstico de conexão',
      summary: response.resumo ?? response.textoLaudo ?? 'Análise completa da sua conexão',
      problems: [],
      recommendations: (response.acoesRecomendadas ?? []).slice(0, 5).map((r, idx) => ({
        id: `rec-${idx + 1}`,
        action: r.titulo ?? 'Ação recomendada',
        description: r.descricao ?? '',
        priority: mapPriority(r.prioridade),
        category: 'general',
      })),
      confidence: severity === 'healthy' ? 0.9 : 0.8,
      source: 'cloudflare-ai',
      processingTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
    console.warn('[cloudflareDiagnosis] Erro ao chamar Worker:', errorMsg);

    // Fallback para Rules Engine
    return rulesEngine(input);
  }
}

export async function combinedDiagnosis(
  input: DiagnosisEngineInput,
): Promise<DiagnosisRecommendation> {
  return cloudflareDiagnosis(input);
}

// Alias legado para evitar quebra de import durante migração.
export const claudeDiagnosis = cloudflareDiagnosis;
