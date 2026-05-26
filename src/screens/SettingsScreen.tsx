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
  void settings;
  void onUpdateSettings;

  return (
    <AppScaffold>
      <AppHeader title="Ajustes" />

      <p style={{ color: 'var(--text-2)', margin: '2px 0 6px', fontSize: 12 }}>Perfil</p>
      <SettingsRow title="Meu perfil" subtitle="Lucas Ferreira" icon="person" onClick={() => alert('Em breve: Edição de perfil')} />

      <p style={{ color: 'var(--text-2)', margin: '8px 0 6px', fontSize: 12 }}>Provedor</p>
      <SettingsRow title="Provedor de internet" subtitle="Vivo Fibra 500" icon="business" onClick={onShowFibra} />

      <p style={{ color: 'var(--text-2)', margin: '8px 0 6px', fontSize: 12 }}>Tema</p>
      <SettingsRow title="Aparência" subtitle={theme === 'dark' ? 'Escuro' : 'Claro'} icon="sun" onClick={onToggleTheme} />

      <p style={{ color: 'var(--text-2)', margin: '8px 0 6px', fontSize: 12 }}>Monitoramento</p>
      <SettingsRow title="Monitoramento contínuo" subtitle="Ativado" icon="history" onClick={onShowHistory} />
      <SettingsRow title="Intervalo de verificação" subtitle="1 minuto" icon="refresh" onClick={() => alert('Em breve: Configurar intervalo')} />

      <p style={{ color: 'var(--text-2)', margin: '8px 0 6px', fontSize: 12 }}>Alertas</p>
      <SettingsRow title="Notificações" subtitle="Ativadas" icon="notifications" onClick={() => alert('Em breve: Configurar notificações')} />
      <SettingsRow title="Alertas de queda" subtitle="Ativados" icon="loss" onClick={() => alert('Em breve: Alertas de queda')} />

      <p style={{ color: 'var(--text-2)', margin: '8px 0 6px', fontSize: 12 }}>Avançado</p>
      <SettingsRow title="Resetar Onboarding" subtitle="Ver tutorial novamente" icon="refresh" onClick={onResetOnboarding} />
    </AppScaffold>
  );
}
