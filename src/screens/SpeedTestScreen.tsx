import type { DeviceInfo, ServerInfo, TestRecord } from '../types';
import type { Settings } from '../hooks/useSettings';
import { Icon } from '../components/icons';
import { AppHeader, Badge, QuickActionCard, SectionTitle, SpeedGauge, StatusCard, AppScaffold } from '../components/ui/app-ui';

interface Props {
  theme: 'dark' | 'light';
  onStart: (mode: 'fast' | 'complete') => void;
  onOpenDiagnostico: () => void;
  lastRecord: TestRecord | null;
  device: DeviceInfo | null;
  server: ServerInfo | null;
  settings: Settings;
  onUpdateSettings: (patch: Partial<Settings>) => void;
  cancelledNotice?: boolean;
  onDismissCancelledNotice?: () => void;
}

export function SpeedTestScreen({ onStart, lastRecord }: Props) {
  const value = Math.round(lastRecord?.dl ?? 524);
  return (
    <AppScaffold>
      <AppHeader
        title="Teste de velocidade"
        rightAction={<Icon name="info" size={16} color="#475569" />}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Badge text="Rápido" tone="info" />
        <Badge text="Completo" />
        <Badge text="Triplo" />
      </div>

      <StatusCard>
        <SpeedGauge value={value} />
      </StatusCard>

      <StatusCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="check-circle" size={18} color="#16a34a" />
          <div style={{ flex: 1 }}>
            <strong style={{ color: '#0f172a', fontSize: 14 }}>Teste concluído</strong>
            <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Excelente desempenho!</p>
            <small style={{ color: '#64748b', fontSize: 11 }}>Hoje, 09:28 · Servidor: São Paulo</small>
          </div>
          <Icon name="chevron" size={12} color="#64748b" />
        </div>
      </StatusCard>

      <SectionTitle title="Ferramentas" compact />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        <QuickActionCard icon="ping" label="Ping" />
        <QuickActionCard icon="cmp" label="Traceroute" />
        <QuickActionCard icon="globe" label="DNS Lookup" />
        <QuickActionCard icon="network" label="Port Scan" />
      </div>

      <button type="button" className="btn-text" style={{ width: '100%', marginTop: 6, fontWeight: 600 }} onClick={() => onStart('fast')}>
        Iniciar novo teste
      </button>
    </AppScaffold>
  );
}
