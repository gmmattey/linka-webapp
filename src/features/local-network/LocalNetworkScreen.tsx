import { AppHeader, AppScaffold, DeviceRow } from '../../components/ui/app-ui';
import { connectedDevices } from '../../mocks/linkaUiMock';
import { Icon } from '../../components/icons';

interface Props { onBack: () => void; }

export function LocalNetworkScreen({ onBack }: Props) {
  return (
    <AppScaffold>
      <AppHeader
        title="Dispositivos conectados"
        subtitle="8 dispositivos no total"
        showBack
        onBack={onBack}
        rightAction={<Icon name="cmp" size={14} color="var(--text-3)" />}
      />
      {connectedDevices.map((device) => <DeviceRow key={device.ip} device={device} />)}
    </AppScaffold>
  );
}
