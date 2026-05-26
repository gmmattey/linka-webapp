import type { DeviceInfo, ServerInfo, TestRecord } from '../types';
import type { Settings } from '../hooks/useSettings';
import { Icon } from '../components/icons';
import { AppScaffold, Badge, MetricCard, QuickActionCard, StatusCard } from '../components/ui/app-ui';

interface Props {
  theme: 'dark' | 'light';
  device: DeviceInfo | null;
  server: ServerInfo | null;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  settings: Settings;
  onRetry: () => void;
  lastRecord: TestRecord | null;
  onShowHistory: () => void;
  onNavigateToSpeedTest: () => void;
  onOpenOrbit?: () => void;
  onShowSinal?: () => void;
  onShowDevices?: () => void;
  onRefresh?: () => Promise<void>;
}

export function HomeScreen({
  onNavigateToSpeedTest,
  onShowSinal,
  onShowDevices,
  onShowHistory,
  lastRecord,
  onOpenOrbit,
}: Props) {
  return (
    <AppScaffold>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div aria-hidden="true" style={{ width: 28, height: 28, borderRadius: 99, background: '#e2e8f0', fontWeight: 700, fontSize: 12, display: 'grid', placeItems: 'center', color: '#0f172a' }}>L</div>
        <div style={{ flex: 1 }}>
          <strong style={{ color: '#0f172a', fontSize: 22, lineHeight: 1.15 }}>Olá, Lucas</strong>
          <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Tudo funcionando bem!</p>
        </div>
        <Icon name="notifications" size={16} color="#64748b" />
      </div>

      <StatusCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <strong style={{ color: '#0f172a', fontSize: 16 }}>Status da conexão</strong>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#16a34a', fontWeight: 600, fontSize: 12 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a' }} />Online</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: 18, lineHeight: 1.1 }}>Casa_5G</h3>
            <p style={{ margin: '2px 0 6px', color: '#64748b', fontSize: 12 }}>Conectado · 5 GHz</p>
            <Badge text="Excelente" tone="success" />
          </div>
          <Icon name="wifi" size={34} color="var(--accent)" />
        </div>
      </StatusCard>

      <StatusCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong style={{ color: '#0f172a', fontSize: 16 }}>Último teste de velocidade</strong>
          <small style={{ color: '#64748b', fontSize: 11 }}>Hoje, 09:28</small>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          <MetricCard label="Download" value={lastRecord ? `${Math.round(lastRecord.dl)}` : '524'} unit="Mbps" />
          <MetricCard label="Upload" value={lastRecord ? `${lastRecord.ul.toFixed(1).replace('.', ',')}` : '98,4'} unit="Mbps" />
          <MetricCard label="Ping" value={lastRecord ? `${Math.round(lastRecord.latency)}` : '12'} unit="ms" />
        </div>
        <button type="button" onClick={onShowHistory} style={{ marginTop: 6, color: 'var(--accent)', fontWeight: 600, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Ver detalhes
          <Icon name="chevron" size={12} color="var(--accent)" />
        </button>
      </StatusCard>

      <StatusCard>
        <strong style={{ color: '#0f172a', fontSize: 16, display: 'block', marginBottom: 8 }}>Ações rápidas</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 8 }}>
          <QuickActionCard icon="analytics" label="Teste de velocidade" onClick={onNavigateToSpeedTest} />
          <QuickActionCard icon="wifi" label="Analisar Wi-Fi" onClick={onShowSinal} />
          <QuickActionCard icon="network" label="Ver dispositivos" onClick={onShowDevices} />
          <QuickActionCard icon="shield" label="Diagnóstico inteligente" onClick={onOpenOrbit} />
        </div>
      </StatusCard>
    </AppScaffold>
  );
}
