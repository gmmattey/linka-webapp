import { Icon } from '../../components/icons';
import { AppHeader, AppScaffold, Badge, SectionTitle, StatusCard, WifiNetworkRow } from '../../components/ui/app-ui';
import { wifiNetworks } from '../../mocks/linkaUiMock';

interface Props { onBack: () => void; onOpenDevices?: () => void; }

export function LocalWifiScreen({ onOpenDevices }: Props) {
  void onOpenDevices;
  return (
    <AppScaffold>
      <AppHeader title="Sinal" />
      <StatusCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 10, background: '#fee2e2' }}>
          <Icon name="wifi" size={14} color="#dc2626" />
          <div style={{ flex: 1 }}><strong style={{ color: '#b91c1c', fontSize: 13 }}>Você está offline</strong><p style={{ margin: 0, color: '#b91c1c', fontSize: 11 }}>Sem conexão com a internet</p></div>
          <Icon name="refresh" size={14} color="#dc2626" />
        </div>
      </StatusCard>
      <SectionTitle title="Redes Wi-Fi próximas" compact right={<Icon name="refresh" size={14} color="var(--text-3)" />} />
      {wifiNetworks.map((network) => <WifiNetworkRow key={network.name} network={network} />)}
      <StatusCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><strong style={{ color: 'var(--text)', fontSize: 14 }}>Análise de canal</strong><p style={{ margin: '2px 0', color: 'var(--text-3)', fontSize: 11 }}>Melhor canal em 5 GHz</p></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Badge text="Canal 36" tone="info" /><Icon name="chevron" size={12} color="var(--text-3)" /></div>
        </div>
      </StatusCard>
    </AppScaffold>
  );
}
