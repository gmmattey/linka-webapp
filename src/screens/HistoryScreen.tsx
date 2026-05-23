import { useCallback, useMemo, useRef, useState } from 'react';
import { Icon, ConnectionIcon, IconPdf } from '../components/icons';
import { TopBar } from '../components/TopBar';
import { PageHeader } from '../components/PageHeader';
import { PullToRefreshIndicator } from '../components/PullToRefreshIndicator';
import { useScrollHeader } from '../hooks/useScrollHeader';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import type { TestRecord } from '../types';
import { loadHistory } from '../utils/history';
import { formatDate, formatMbps, formatMs } from '../utils/format';
import { exportHistoryPdf } from '../utils/pdfExport';
import {
  computeWeeklyTrend,
  computeMonthlyTrend,
  describeTrend,
  isTrendSignificant,
} from '../utils/historyTrends';
import './HistoryScreen.css';

interface Props {
  theme: 'dark' | 'light';
  unit?: 'mbps' | 'gbps';
  initialSelectedId?: string;
  onBack?: () => void;
  onRefresh?: () => Promise<void>;
}

/* ── Helpers ────────────────────────────────────────────────────────── */

function formatFullDate(timestamp: number): string {
  const d = new Date(timestamp);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} às ${hh}:${min}`;
}

function tipoLabel(connectionType: string): string {
  if (connectionType === 'wifi') return 'Wi-Fi';
  if (connectionType === 'mobile') return 'Celular';
  if (connectionType === 'cable') return 'Cabo';
  return connectionType;
}

function streamingVeredito(r: TestRecord): string {
  if (r.dl >= 25) return 'Bom';
  if (r.dl >= 8) return 'Aceitável';
  return 'Ruim';
}

function gamerVeredito(r: TestRecord): string {
  if (r.dl >= 15 && r.latency <= 50) return 'Bom';
  if (r.dl >= 5 && r.latency <= 100) return 'Aceitável';
  return 'Ruim';
}

function videoChamadaVeredito(r: TestRecord): string {
  if (r.dl >= 2 && r.ul >= 1 && r.latency <= 100) return 'Bom';
  if (r.dl >= 1 && r.latency <= 200) return 'Aceitável';
  return 'Ruim';
}

function gargaloLabel(r: TestRecord): string | null {
  if (r.packetLoss > 2) return 'Perda de pacotes';
  if (r.bufferbloatSeverity === 'high' || r.bufferbloatSeverity === 'critical') return 'Bufferbloat';
  if (r.jitter > 30) return 'Oscilação';
  if (r.latency > 150) return 'Latência';
  return null;
}

function bufferbloatLabel(severity: string | undefined): string | null {
  if (severity === 'moderate') return 'Moderado';
  if (severity === 'high') return 'Alto';
  if (severity === 'critical') return 'Crítico';
  return null;
}

function average(records: TestRecord[], pick: (record: TestRecord) => number): number {
  if (records.length === 0) return 0;
  return records.reduce((sum, record) => sum + pick(record), 0) / records.length;
}

function recentTrendSummary(items: TestRecord[]): { title: string; body: string; severity: 'good' | 'neutral' | 'bad' } {
  if (items.length < 3) {
    return {
      title: 'Ainda não há base para tendência',
      body: 'Faça mais alguns testes em horários diferentes para comparar a evolução da conexão.',
      severity: 'neutral',
    };
  }

  const newest = items.slice(0, Math.min(3, items.length));
  const older = items.slice(Math.min(3, items.length), Math.min(6, items.length));
  if (older.length === 0) {
    return {
      title: 'Primeiros registros salvos',
      body: 'Acompanhe os próximos testes para saber se a conexão melhora, piora ou fica estável.',
      severity: 'neutral',
    };
  }

  const newestDl = average(newest, (record) => record.dl);
  const olderDl = average(older, (record) => record.dl);
  const newestLatency = average(newest, (record) => record.latency);
  const olderLatency = average(older, (record) => record.latency);
  const dlChange = olderDl > 0 ? ((newestDl - olderDl) / olderDl) * 100 : 0;
  const latencyChange = olderLatency > 0 ? ((newestLatency - olderLatency) / olderLatency) * 100 : 0;

  if (dlChange >= 10) {
    return {
      title: 'A conexão melhorou nos testes recentes',
      body: `O download médio subiu ${Math.round(dlChange)}% em relação aos registros anteriores.`,
      severity: 'good',
    };
  }
  if (dlChange <= -10) {
    return {
      title: 'A conexão piorou nos testes recentes',
      body: `O download médio caiu ${Math.abs(Math.round(dlChange))}% em relação aos registros anteriores.`,
      severity: 'bad',
    };
  }
  if (latencyChange >= 20) {
    return {
      title: 'A resposta da conexão ficou mais lenta',
      body: `O tempo de resposta médio subiu ${Math.round(latencyChange)}% nos testes recentes.`,
      severity: 'bad',
    };
  }
  if (latencyChange <= -20) {
    return {
      title: 'A resposta da conexão melhorou',
      body: `O tempo de resposta médio caiu ${Math.abs(Math.round(latencyChange))}% nos testes recentes.`,
      severity: 'good',
    };
  }

  return {
    title: 'A conexão está estável nos testes recentes',
    body: 'Os últimos registros estão parecidos com os anteriores. Continue testando em horários diferentes.',
    severity: 'neutral',
  };
}

function historySummary(items: TestRecord[], unit: 'mbps' | 'gbps') {
  const latest = items[0];
  return {
    title: `${items.length} teste${items.length > 1 ? 's' : ''} salvo${items.length > 1 ? 's' : ''}`,
    body: `Último teste: ${latest ? `${formatMbps(latest.dl, unit)} de download e resposta em ${formatMs(latest.latency)} ms.` : 'Nenhum teste salvo.'}`,
    avgDownload: formatMbps(average(items, (record) => record.dl), unit),
    avgUpload: formatMbps(average(items, (record) => record.ul), unit),
    avgLatency: `${formatMs(average(items, (record) => record.latency))} ms`,
    trend: recentTrendSummary(items),
  };
}

/* ── SpeedBar ───────────────────────────────────────────────────────── */

function SpeedBar({ value, maxValue, color, arrow, unit }: {
  value: number; maxValue: number; color: string; arrow: string; unit: 'mbps' | 'gbps';
}) {
  const progress = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
  const unitLabel = unit === 'gbps' ? 'Gbps' : 'Mbps';
  return (
    <div className="lk-hist-speedbar">
      <div className="lk-hist-speedbar__track">
        <div
          className="lk-hist-speedbar__fill"
          style={{ width: `${progress * 100}%`, background: color }}
        />
      </div>
      <span className="lk-hist-speedbar__label" style={{ color }}>
        {arrow} {formatMbps(value, unit)} {unitLabel}
      </span>
    </div>
  );
}

/* ── HistoricoCard ──────────────────────────────────────────────────── */

function HistoricoCard({ record, maxValue, unit, onClick }: {
  record: TestRecord; maxValue: number; unit: 'mbps' | 'gbps'; onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="lk-hist-card"
      onClick={onClick}
      aria-label={`Ver detalhes do teste de ${formatDate(record.timestamp)}`}
    >
      <div className="lk-hist-card__header">
        <span className="lk-hist-card__date">{formatDate(record.timestamp)}</span>
        <div className="lk-hist-card__header-right">
          <ConnectionIcon kind={record.connectionType} size={14} />
          <span className="lk-hist-card__tipo">{tipoLabel(record.connectionType)}</span>
        </div>
      </div>
      <SpeedBar value={record.dl} maxValue={maxValue} color="var(--dl)" arrow="↓" unit={unit} />
      <SpeedBar value={record.ul} maxValue={maxValue} color="var(--ul)" arrow="↑" unit={unit} />
      <div className="lk-hist-card__footer">
        <Icon name="globe" size={14} color="var(--text-3)" />
        <span>{tipoLabel(record.connectionType)} · resposta em {formatMs(record.latency)} ms</span>
      </div>
    </button>
  );
}

function HistorySummaryCard({ items, unit }: { items: TestRecord[]; unit: 'mbps' | 'gbps' }) {
  const summary = historySummary(items, unit);

  return (
    <section className={`lk-history__summary lk-history__summary--${summary.trend.severity}`} aria-label="Resumo do histórico">
      <div className="lk-history__summary-copy">
        <p className="lk-history__summary-title">{summary.trend.title}</p>
        <p className="lk-history__summary-body">{summary.trend.body}</p>
        <p className="lk-history__summary-last">{summary.body}</p>
      </div>
      <div className="lk-history__summary-grid" aria-label={summary.title}>
        <div>
          <span>Média para receber</span>
          <strong>{summary.avgDownload}</strong>
        </div>
        <div>
          <span>Média para enviar</span>
          <strong>{summary.avgUpload}</strong>
        </div>
        <div>
          <span>Resposta média</span>
          <strong>{summary.avgLatency}</strong>
        </div>
      </div>
    </section>
  );
}

/* ── EmptyHistorico ─────────────────────────────────────────────────── */

function EmptyHistorico() {
  return (
    <div className="lk-history__empty">
      <Icon name="history" size={48} color="var(--text-3)" />
      <p className="lk-history__empty-title">Nenhum teste realizado ainda</p>
      <p className="lk-history__empty-sub">
        Os resultados dos testes de velocidade aparecerão aqui.
      </p>
    </div>
  );
}

/* ── SheetRow (detail) ──────────────────────────────────────────────── */

function SheetRow({ label, value, valueColor }: {
  label: string; value: string; valueColor?: string;
}) {
  return (
    <div className="lk-hist-detail__row">
      <span className="lk-hist-detail__row-label">{label}</span>
      <span
        className="lk-hist-detail__row-value"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

/* ── HistoricoDetailSheet ───────────────────────────────────────────── */

function HistoricoDetailSheet({ record, unit, onClose }: {
  record: TestRecord; unit: 'mbps' | 'gbps'; onClose: () => void;
}) {
  const unitLabel = unit === 'gbps' ? 'Gbps' : 'Mbps';
  const bbLabel = bufferbloatLabel(record.bufferbloatSeverity);
  const gargalo = gargaloLabel(record);

  return (
    <div className="lk-medicao-overlay" onClick={onClose}>
      <div className="lk-medicao-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="lk-medicao-sheet__handle-row">
          <div className="lk-medicao-sheet__handle" />
        </div>

        {/* Cabeçalho */}
        <div className="lk-hist-detail__header">
          <p className="lk-hist-detail__sheet-title">Detalhes do teste</p>
          <p className="lk-hist-detail__sheet-date">{formatFullDate(record.timestamp)}</p>
        </div>
        <div className="lk-hist-detail__divider" />

        {/* Hero: DL + UL grandes lado a lado */}
        <div className="lk-hist-detail__primary-row">
          <div className="lk-hist-detail__primary">
            <span className="lk-hist-detail__arrow" style={{ color: 'var(--dl)' }}>↓</span>
            <div className="lk-hist-detail__primary-nums">
              <span className="lk-hist-detail__big">{formatMbps(record.dl, unit)}</span>
              <span className="lk-hist-detail__unit">{unitLabel}</span>
            </div>
            <span className="lk-hist-detail__primary-label">Download</span>
          </div>
          <div className="lk-hist-detail__divider-v" />
          <div className="lk-hist-detail__primary">
            <span className="lk-hist-detail__arrow" style={{ color: 'var(--ul)' }}>↑</span>
            <div className="lk-hist-detail__primary-nums">
              <span className="lk-hist-detail__big">{formatMbps(record.ul, unit)}</span>
              <span className="lk-hist-detail__unit">{unitLabel}</span>
            </div>
            <span className="lk-hist-detail__primary-label">Upload</span>
          </div>
        </div>

        {/* Secundárias: Latência | Oscilação | Perda */}
        <div className="lk-hist-detail__secondary-row">
          <div className="lk-hist-detail__secondary">
            <span className="lk-hist-detail__sec-value">{formatMs(record.latency)} ms</span>
            <span className="lk-hist-detail__sec-label">Tempo de resposta</span>
          </div>
          <div className="lk-hist-detail__secondary">
            <span className="lk-hist-detail__sec-value">{record.jitter.toFixed(1)} ms</span>
            <span className="lk-hist-detail__sec-label">Variação</span>
          </div>
          <div className="lk-hist-detail__secondary">
            <span className="lk-hist-detail__sec-value">{record.packetLoss.toFixed(1)}%</span>
            <span className="lk-hist-detail__sec-label">Falhas</span>
          </div>
        </div>

        <div className="lk-hist-detail__divider" />

        {/* Rows de detalhe */}
        <div className="lk-hist-detail__rows">
          <SheetRow label="Tipo de rede" value={tipoLabel(record.connectionType)} />
          <div className="lk-hist-detail__divider" />
          {bbLabel && (
            <>
              <SheetRow label="Atraso sob carga" value={bbLabel} />
              <div className="lk-hist-detail__divider" />
            </>
          )}
          <SheetRow label="Streaming" value={streamingVeredito(record)} />
          <div className="lk-hist-detail__divider" />
          <SheetRow label="Jogos online" value={gamerVeredito(record)} />
          <div className="lk-hist-detail__divider" />
          <SheetRow label="Vídeo chamada" value={videoChamadaVeredito(record)} />
          {gargalo && (
            <>
              <div className="lk-hist-detail__divider" />
              <SheetRow label="Gargalo identificado" value={gargalo} valueColor="var(--warn)" />
            </>
          )}
        </div>

        <div className="lk-hist-detail__safe-bottom" />
      </div>
    </div>
  );
}

/* ── HistoryScreen ──────────────────────────────────────────────────── */

export function HistoryScreen({ theme, unit = 'mbps', initialSelectedId, onBack, onRefresh }: Props) {
  const [items] = useState<TestRecord[]>(() => loadHistory());
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null);
  const selected = items.find((r) => r.id === selectedId) ?? null;

  const maxValue = useMemo(
    () => Math.max(...items.flatMap((r) => [r.dl, r.ul]), 100),
    [items],
  );

  const trendCard = useMemo(() => {
    const weekly = computeWeeklyTrend(items);
    const monthly = computeMonthlyTrend(items);
    const trend = (weekly && isTrendSignificant(weekly)) ? weekly
                : (monthly && isTrendSignificant(monthly)) ? monthly
                : null;
    if (!trend) return null;
    return { trend, description: describeTrend(trend) };
  }, [items]);

  const handlePdf = async () => {
    try { await exportHistoryPdf(items); } catch { /* silencioso */ }
  };

  const { scrolled, topBarOpacity, scrollContainerRef, sentinelRef } = useScrollHeader();
  const ptrContainerRef = useRef<HTMLElement | null>(null);
  const setScrollContainer = useCallback((el: HTMLElement | null) => {
    ptrContainerRef.current = el;
    scrollContainerRef(el);
  }, [scrollContainerRef]);
  const noopRefresh = useCallback(() => Promise.resolve(), []);
  const ptr = usePullToRefresh(
    ptrContainerRef,
    onRefresh ?? noopRefresh,
    { enabled: !!onRefresh && !selected },
  );

  return (
    <div className="lk-history" data-theme={theme}>
      <TopBar
        onBack={onBack}
        scrolled={scrolled}
        opacity={topBarOpacity}
        title="Histórico"
        showTitle={scrolled}
        rightActions={items.length > 0 ? [
          { icon: <IconPdf size={18} />, onClick: handlePdf, ariaLabel: 'Exportar histórico em PDF' },
        ] : undefined}
      />

      <PullToRefreshIndicator
        pullDistance={ptr.pullDistance}
        isRefreshing={ptr.isRefreshing}
        isReady={ptr.isReady}
      />

      <main className="lk-history__scroll" ref={setScrollContainer}>
        <PageHeader ref={sentinelRef} size="md" title="Histórico" />

        {items.length === 0 ? (
          <EmptyHistorico />
        ) : (
          <div className="lk-history__content">
            <HistorySummaryCard items={items} unit={unit} />

            {trendCard && (
              <section
                className={`lk-history__trend lk-history__trend--${trendCard.description.severity}`}
                aria-label="Tendência da sua internet"
              >
                <p className="lk-history__trend-headline">{trendCard.description.headline}</p>
                <p className="lk-history__trend-comparison">{trendCard.description.comparison}</p>
              </section>
            )}

            {items.map((r) => (
              <HistoricoCard
                key={r.id}
                record={r}
                maxValue={maxValue}
                unit={unit}
                onClick={() => setSelectedId(r.id)}
              />
            ))}
          </div>
        )}
      </main>

      {selected && (
        <HistoricoDetailSheet
          record={selected}
          unit={unit}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
