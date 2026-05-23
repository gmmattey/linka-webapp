# Telas do PWA

## Mapa

- `HomeScreen`: entrada, proposta de valor, consumo por modo, ultimo resultado e atalhos.
- `SpeedTestScreen`: preparacao e inicio do teste, com o painel "Como o teste sera feito" explicando aparelho, rede atual e servidor externo em linguagem simples.
- `RunningScreen`: progresso da medicao em linguagem humana, com etapa atual, percentual, duracao esperada e cancelamento explicito.
- `ResultScreen`: resultado, diagnostico e detalhes.
- `HistoryScreen`: historico local.
- `ExploreScreen`: ajustes e recursos adicionais.
- `DNSBenchmarkScreen`: comparacao de DNS.
- `DNSGuideScreen`: orientacao para DNS.
- `LocalWifiScreen`: diagnostico Wi-Fi com fallback web.
- `LocalNetworkScreen`: descoberta de rede local com fallback web.
- `FibraScreen`: explicacao e limitacoes de diagnostico de fibra no navegador.
- `PulseScreen`: diagnostico guiado.
- `OnboardingScreen`: primeira experiencia.

## Regras

- Telas devem funcionar em mobile e desktop.
- Limitacoes do navegador devem ser explicitas.
- Quando o navegador nao identificar o tipo de rede, a interface deve informar "Rede nao identificada" e nao deve assumir Wi-Fi, cabo, dados moveis ou desconexao.
- Cancelar uma medicao deve encerrar o fluxo com aviso claro de que o teste foi interrompido e nenhum resultado novo foi salvo.
- Nenhuma tela deve depender de runtime nativo.
