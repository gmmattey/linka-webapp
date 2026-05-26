import { AppScaffold, SectionTitle, StatusCard } from '../components/ui/app-ui';
import { Icon } from '../components/icons';

interface Props {
  onOpenSpeed?: () => void;
}

export function AiScreen({ onOpenSpeed }: Props) {
  return (
    <AppScaffold>
      <SectionTitle title="Diagnóstico IA" />

      <StatusCard>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Icon name="shield" size={18} color="var(--accent)" />
          <div>
            <strong style={{ fontSize: 14, color: 'var(--text)' }}>Módulo em preparação</strong>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.45 }}>
              Estamos simplificando a experiência de IA para ficar consistente com o novo layout do Linka.
            </p>
          </div>
        </div>
      </StatusCard>

      <StatusCard>
        <strong style={{ fontSize: 14, color: 'var(--text)' }}>Enquanto isso</strong>
        <p style={{ margin: '5px 0 8px', fontSize: 12, color: 'var(--text-2)' }}>
          Use o teste de velocidade e a análise de sinal para diagnosticar sua rede.
        </p>
        <button type="button" className="btn-text" style={{ width: '100%', fontWeight: 600 }} onClick={onOpenSpeed}>
          Ir para teste de velocidade
        </button>
      </StatusCard>
    </AppScaffold>
  );
}

