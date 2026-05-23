# Linka WebApp

PWA standalone para medir velocidade e qualidade de conexao de internet com diagnostico claro para usuario final.

Este repositorio e somente o WebApp/PWA. Android, APK, Gradle, keystore, Capacitor e plugins nativos pertencem a outro projeto.

## Stack

- Vite
- React
- TypeScript
- Vitest
- Recharts
- jsPDF
- html2canvas
- vite-plugin-pwa
- Cloudflare Pages

## Estrutura

```txt
src/                 Codigo da aplicacao
public/              Assets publicos do PWA
scripts/             Automacoes locais do projeto
docs/                Documentacao viva e arquivo historico
.github/workflows/   CI e release PWA
.claude/commands/    Comandos auxiliares de IA para este WebApp
```

## Scripts npm

```bash
npm run dev       # desenvolvimento local
npm run build     # typecheck + build de producao
npm run preview   # preview local do build
npm run lint      # lint
npm test          # testes unitarios
```

Todos os scripts operacionais do repositorio devem ficar em `scripts/`. Veja `scripts/README.md` antes de adicionar novas automacoes.

## Desenvolvimento

```bash
npm install
npm run dev
```

Para testar em outro dispositivo na mesma rede:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

## Validacao

Antes de abrir PR, release ou deploy:

```bash
npm run lint
npm test
npm run build
```

Fluxos manuais minimos:

- Home/inicio do teste
- Medicao em andamento
- Resultado
- Historico
- Instalacao/atualizacao PWA
- Recursos nativos indisponiveis sem erro no console

## Deploy

O deploy alvo e Cloudflare Pages:

```txt
Build command: npm run build
Build output directory: dist
```

O workflow `.github/workflows/release.yml` faz somente build, testes e deploy do PWA.

## Documentacao

- `docs/architecture`: estrutura, contratos tecnicos e capacidades web.
- `docs/product`: telas, comportamento funcional, branding e componentes.
- `docs/qa`: pendencias, regressao e evidencias PWA.
- `docs/release`: CI/CD, release e fluxo Git.
- `docs/ai`: regras para agentes, skills e operacao assistida.
- `docs/archive`: historico util que nao e documentacao viva.
