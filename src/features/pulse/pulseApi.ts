import type { AiAnalysisEntry } from './types';
import type { SpeedTestResult } from '../../types';
import { localAnalysisText, severityFromResult } from './rulesAdapter';

const WORKER_URL = 'https://linka-ai-diagnosis-worker.giammattey-luiz.workers.dev';
const AI_TIMEOUT_MS = 15000;

interface WorkerResponse {
  modeloIa?: {
    nomeExibicao?: string;
    textoRodape?: string;
  };
  resumo: string;
  textoLaudo: string;
}

async function callWorker(trigger: string, context: string, result?: SpeedTestResult): Promise<string> {
  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), AI_TIMEOUT_MS);

  try {
    const body = {
      schemaVersion: '3',
      generatedAtEpochMs: Date.now(),
      connectionType: 'unknown',
      metricasAtuais: result ? {
        downloadMbps: result.dl,
        uploadMbps: result.ul,
        latenciaMs: result.latency,
        jitterMs: result.jitter,
        perdaPacotesPercentual: result.packetLoss,
      } : undefined,
      feedbackUsuario: context,
      evidencias: [
        { label: 'trigger', valor: trigger },
      ],
    };
    const res = await fetch(`${WORKER_URL}/api/ai/diagnostico-conexao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Worker error ${res.status}`);
    const data = (await res.json()) as WorkerResponse;
    const mainText = (data.textoLaudo || data.resumo || '').trim();
    const footer = data.modeloIa?.textoRodape?.trim();
    return footer ? `${mainText}\n\n${footer}` : mainText;
  } catch {
    clearTimeout(timeoutId);
    throw new Error('Worker unavailable');
  }
}

export async function generateInitialAnalysis(
  result: SpeedTestResult,
  contextAccumulated: string,
  trigger: string,
): Promise<AiAnalysisEntry> {
  try {
    const text = await callWorker(trigger, contextAccumulated, result);
    if (text) {
      return { trigger, content: text, isFallback: false, timestamp: Date.now() };
    }
  } catch { /* fall through */ }

  const severity = severityFromResult(result);
  const fallbackText = localAnalysisText(result, severity);
  return { trigger, content: fallbackText, isFallback: true, timestamp: Date.now() };
}

export async function generateFollowUpAnalysis(
  result: SpeedTestResult,
  contextAccumulated: string,
  trigger: string,
): Promise<AiAnalysisEntry> {
  return generateInitialAnalysis(result, contextAccumulated, trigger);
}

export function localFallback(result: SpeedTestResult): AiAnalysisEntry {
  const severity = severityFromResult(result);
  return {
    trigger: 'fallback',
    content: localAnalysisText(result, severity),
    isFallback: true,
    timestamp: Date.now(),
  };
}
