import { AppHeader, AppScaffold, SettingsRow } from '../components/ui/app-ui';
import type { Settings } from '../hooks/useSettings';

interface Props {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  settings: Settings;
  onUpdateSettings: (patch: Partial<Settings>) => void;
  onShowHistory?: () => void;
  onResetOnboarding?: () => void;
  onShowFibra?: () => void;
}

export function SettingsScreen({
  theme,
  onToggleTheme,
  settings,
  onUpdateSettings,
  onShowHistory,
  onResetOnboarding,
  onShowFibra,
}: Props) {
  void theme;
  void onToggleTheme;
  void settings;
  void onUpdateSettings;
  void onShowHistory;
  void onResetOnboarding;
  void onShowFibra;

  return (
    <AppScaffold>
      <AppHeader title="Ajustes" />

      <p style={{ color: '#64748b', margin: '2px 0 6px', fontSize: 12 }}>Perfil</p>
      <SettingsRow title="Meu perfil" subtitle="Lucas Ferreira" icon="person" />

      <p style={{ color: '#64748b', margin: '8px 0 6px', fontSize: 12 }}>Provedor</p>
      <SettingsRow title="Provedor de internet" subtitle="Vivo Fibra 500" icon="business" />

      <p style={{ color: '#64748b', margin: '8px 0 6px', fontSize: 12 }}>Tema</p>
      <SettingsRow title="Aparência" subtitle="Claro" icon="sun" />

      <p style={{ color: '#64748b', margin: '8px 0 6px', fontSize: 12 }}>Monitoramento</p>
      <SettingsRow title="Monitoramento contínuo" subtitle="Ativado" icon="history" />
      <SettingsRow title="Intervalo de verificação" subtitle="1 minuto" icon="refresh" />

      <p style={{ color: '#64748b', margin: '8px 0 6px', fontSize: 12 }}>Alertas</p>
      <SettingsRow title="Notificações" subtitle="Ativadas" icon="notifications" />
      <SettingsRow title="Alertas de queda" subtitle="Ativados" icon="loss" />
    </AppScaffold>
  );
}
