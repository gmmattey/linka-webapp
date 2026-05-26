import { AppHeader, AppScaffold, Badge, ChartCard, StatusCard } from '../components/ui/app-ui';
import { uptimeData, uptimeLabels } from '../mocks/linkaUiMock';
import { Icon } from '../components/icons';

interface Props {
  theme: 'dark' | 'light';
  unit?: 'mbps' | 'gbps';
  initialSelectedId?: string;
  onBack?: () => void;
  onRefresh?: () => Promise<void>;
}

export function HistoryScreen({ theme, unit, initialSelectedId, onBack, onRefresh }: Props) {
  void theme;
  void unit;
  void initialSelectedId;
  void onBack;
  void onRefresh;
  return (
    <AppScaffold>
      <AppHeader title="Histórico" />
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        <Badge text="7 dias" tone="info" onClick={() => alert('Filtrar 7 dias')} />
        <Badge text="30 dias" onClick={() => alert('Filtrar 30 dias')} />
        <Badge text="90 dias" onClick={() => alert('Filtrar 90 dias')} />
        <Badge text="Personalizado" onClick={() => alert('Abrir seletor de período personalizado')} />
      </div>

      <ChartCard percent="99,2%" labels={uptimeLabels} values={uptimeData} />

      <StatusCard>
        <h3 style={{ marginTop: 0, marginBottom: 10, color: '#0f172a', fontSize: 16 }}>Resumo</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <Icon name="security" size={18} color="#16a34a" />
          <div>
            <strong style={{ color: '#0f172a', fontSize: 14 }}>Sua rede está estável e saudável.</strong>
            <p style={{ margin: '5px 0', color: '#64748b', fontSize: 11, lineHeight: 1.45 }}>Excelente desempenho nos últimos 7 dias. Houve uma pequena instabilidade no dia 19/05, mas tudo voltou ao normal.</p>
            <button type="button" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => alert('Abrir relatório completo')}>
              Ver relatório completo
              <Icon name="chevron" size={12} color="var(--accent)" />
            </button>
          </div>
        </div>
      </StatusCard>
    </AppScaffold>
  );
}
