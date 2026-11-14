# Plano por fases

| Fase | Gate verificável                                                                                              | Estado nesta versão                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 0    | Estrutura independente, docs atuais, web/API, Neon dedicado, migração/smokes, configuração Cloudflare, testes | Incremento local implementado; repo remoto/provisionamento Cloudflare bloqueados por acessos descritos em DEPLOYMENT.md |
| 1    | Tree-sitter Python/JS/TS, fixtures reais versionadas, IR com intervalos/evidência, resultados esperados       | Pendente                                                                                                                |
| 2    | Modelo de jobs/runs, fila com lease, API de projetos/análises, persistência, autenticação/propriedade         | Pendente                                                                                                                |
| 3    | React Flow, Monaco, filtros/busca, navegação símbolo→código, estados de erro acessíveis                       | Pendente                                                                                                                |
| 4    | SCC/ciclos, fan-in/out documentados, histórico, comparação e JSON export                                      | Pendente                                                                                                                |
| 5    | E2E completo, isolamento/segurança, acessibilidade, fixtures pequenas/médias/grandes e medidas reais          | Pendente                                                                                                                |
| 6    | CI/CD autorizado, HTTPS, smoke remoto, logs e versão publicada                                                | Pendente                                                                                                                |

PDF é posterior a JSON. Nenhuma fase avançada será rotulada como concluída por possuir uma tela, tabela vazia ou contrato planejado.
