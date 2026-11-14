# Fase 0 — entrega do primeiro incremento

Data: 2026-11-14. **Incremento local validado; Fase 0 ainda tem pendências externas.** O CodeAtlas completo não está concluído e não foi publicado.

## Arquivos

- apps/web/src: App.tsx, main.tsx, style.css — interface, estados de rede e consulta real.
- apps/api/src: app.ts, github.ts, index.ts, openapi.ts — Hono, validação, limites e contrato.
- packages/shared/src/repository.ts — contrato e validação de origem.
- packages/database: migrations/0001_bootstrap.sql e src/schema.ts.
- services/analyzer, packages/graph-core, packages/parser-contracts e tests/fixtures: escopo futuro documentado, sem implementar análises artificiais.
- scripts: migrate.mjs, db-smoke.mjs, live-smoke.mjs, proxy-runtime.mjs.
- tests: repository.test.ts, github.test.ts, integration/api.test.ts e e2e/workspace.spec.ts.
- cloudflare.config.ts, vite.config.ts, vitest.config.ts, playwright.config.ts, tsconfig.json, index.html, package.json e lockfile.
- .github/workflows/ci.yml; README.md, ARCHITECTURE.md, API.md, DATABASE.md, DEPLOYMENT.md, SECURITY.md, CONTRIBUTING.md, CHANGELOG.md e LICENSE.
- docs/ROADMAP.md, TECHNOLOGY_REVIEW.md, este relatório e evidence/workspace.png.
- .env.example/.dev.vars.example contêm placeholders; segredos reais ficam somente nos arquivos ignorados com modo 600.

## Funcionalidades implementadas

Aplicação React ligada à API executada em workerd, health/readiness com falhas finitas, consulta de metadados públicos e commit exato da branch padrão, documentação dentro da interface, layout móvel e erro útil. Banco Neon exclusivo com desenvolvimento isolado, migração transacional com checksum e script de persistência/rollback. Configuração Cloudflare com assets/API, secret, rate limiter e observabilidade; nenhuma criação/deploy remoto de Worker.

## Testes e evidências reais

| Verificação                               | Resultado observado                                                                                  |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| TypeScript strict                         | Aprovado                                                                                             |
| Unitários e integração Hono               | 31 testes aprovados em 3 arquivos                                                                    |
| Build Vite web + Worker                   | Aprovado; bundle Worker aproximadamente 424 KiB, gzip 109 KiB, observado no dry-run; não é benchmark |
| cf deploy --dry-run                       | Aprovado; nenhum upload/deploy                                                                       |
| Migração Neon                             | 0001 aplicada em transação e reexecução com checksum aprovada                                        |
| Persistência Neon                         | Insert/read após commit, CHECK constraint e rollback atômico aprovados                               |
| E2E padrão no Vite/workerd                | 2 testes aprovados: API/erro/documentação e viewport móvel 390 px                                    |
| E2E com serviços reais via executor local | 3 testes aprovados, incluindo consulta GitHub e banco conectado                                      |
| Live smoke workerd → Neon/GitHub          | Aprovado; origem real e commit abaixo                                                                |
| CI remoto                                 | Preparado em arquivo; ainda não executado no GitHub                                                  |

Evidência de persistência mais recente: registro técnico `7b931043-6476-4107-b082-b12b8e424a2c` em environment_checks da branch dev-phase-0. Não contém código de usuário. Uma segunda transação violou propositalmente CHECK e não deixou o primeiro insert persistido.

Origem consultada: https://github.com/octocat/Hello-World, branch master, commit `7fd1a60b01f91b314f59955a4e4d4e80d8edf11d`. Isto comprova consulta de metadados; não comprova parsing/importação de arquivos. [Captura do fluxo real](evidence/workspace.png).

## Problemas encontrados e corrigidos

- gh CLI falhou na autenticação; conector GitHub funciona para buscas, mas não expõe criação de repositórios. Remote não criado.
- Cloudflare subscriptions recusou OAuth (403); faturamento exige Billing Read via API token ou conferência no painel. Nenhum plano alterado.
- Neon Free recusou definir intervalo de suspensão; projeto criado sem modificar a política do plano.
- Sandbox exigiu cache/config em diretórios graváveis; rede Node precisou usar proxy herdado. Não foram removidas restrições de rede/TLS.
- Workerd local não utiliza o proxy de ambiente para fetch nativo. Executor Miniflare local encaminha o bundle real pelo Node e limita destinos ao GitHub/Neon configurado. Respostas reais, sem mocks.
- Fetch Workers não aceita redirect:error: corrigido para manual com rejeição de status 3xx e teste específico.
- Lucide atual não exporta o ícone de marca Github: usado GitFork, mantendo dependência compatível.
- Hono sem bindings nos testes revelou erro 500 em entrada inválida; corrigido acesso opcional ao ambiente.
- Build avisa sobre diretivas use client de dependências em SPA; compilação aprovada, sem React Server Components.

## Limitações e próximo gate

Sem análise estrutural, uploads, grafos, símbolos, Monaco, projetos por usuário, histórico, fila, relatórios ou comparação. Nenhum endpoint de análise ou botão sem ação foi anunciado como disponível. Não existem medidas de desempenho do parser, pois ele ainda não foi implementado. Testes de datasets pequenos/médios/grandes pertencem à Fase 1/5.

Para encerrar a configuração externa da Fase 0: criar/conectar o repositório GitHub independente e conferir plano/permissões Cloudflare, conforme DEPLOYMENT.md. Nenhum recurso pago foi contratado, nenhum outro repositório/Worker/banco foi modificado e nenhum dado existente foi removido.

Próximo incremento independente: implementar motor Tree-sitter local para três linguagens, IR/evidências e fixtures licenciadas, com resultados comparados a expectativas antes da API de jobs. Publicação só após seus gates e autorização.
