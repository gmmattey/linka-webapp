# AGENTS.md - Linka WebApp

Este arquivo define como agentes devem trabalhar neste repositorio.

## Escopo

- Projeto: Linka WebApp PWA.
- Stack: Vite, React, TypeScript, Vitest e Cloudflare Pages.
- Raiz esperada: `C:\Projetos\Linka WebApp`.
- Proibido misturar Android, APK, Gradle, keystore, Capacitor ou plugins nativos neste repositorio.

## Regras Fixas

- Edite somente arquivos deste WebApp.
- Nao crie logica duplicada para diagnostico, speedtest ou recomendacoes.
- Nao exponha recurso nativo como ativo no PWA puro; use fallback indisponivel.
- Se comportamento mudar, atualize a documentacao viva no mesmo trabalho.
- Scripts novos devem ficar somente em `scripts/`.
- Scripts obsoletos devem ser removidos, nao arquivados no projeto "por garantia".

## Scripts

Pasta unica para automacoes:

```txt
scripts/
  qa/        validacao, regressao e evidencias
  release/   automacoes de build/deploy/release
  tooling/   manutencao local
```

Antes de criar script, leia `scripts/README.md`.

## Fluxo de Trabalho

1. Mapear impacto em codigo, docs e testes.
2. Validar limites do navegador/PWA.
3. Alterar o minimo necessario.
4. Atualizar docs quando contratos, fluxos ou estrutura mudarem.
5. Rodar validacoes aplicaveis.

## Validacao Minima

```bash
npm run lint
npm test
npm run build
```

Se algum comando nao foi executado, reporte explicitamente.

## Documentacao Canonica

Prioridade:

1. Mensagem atual do usuario.
2. `AGENTS.md`.
3. `CLAUDE.md`.
4. `README.md`.
5. `docs/architecture`.
6. `docs/product`.
7. Demais documentos em `docs/`.

Arquivos em `docs/archive` sao historicos; nao use como regra atual sem confirmar.
