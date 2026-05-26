# Changelog

All notable changes to Linka WebApp are documented here.

## [1.5.0] — 2026-05-25

### Added
- **Perfil editável** (`SettingsScreen`): modal para editar nome e provedor, persiste em localStorage via `useSettings`
- **Intervalos de monitoramento**: configuração de intervalo (1/5/10/30 min) via ciclo no tap, lida de `settings.checkInterval`
- **Toggle de notificações in-app**: `settings.notificationsEnabled` controlado pelo usuário
- Novos campos na interface `Settings`: `checkInterval` e `notificationsEnabled`

### Fixed
- `SettingsScreen`: removido `void settings` e `void onUpdateSettings` — props agora usadas de verdade
- Dados "Lucas Ferreira" e "Vivo Fibra 500" não são mais hardcoded

### Closes
- #51 — Sistema de Perfil (Meu Perfil e Provedor)
