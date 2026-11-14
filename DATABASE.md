# Banco de dados

Neon exclusivo: projeto `royal-cloud-93187622` (codeatlas), PostgreSQL 17, AWS us-east-1. Desenvolvimento: `br-curly-credit-bb7iooc4` (dev-phase-0). Main não recebeu migrações nem dados de teste. Organização Free verificada; compute 0.25 CU. A política de suspensão é gerida pelo plano, pois a API recusou definir esse intervalo manualmente.

## Migração 0001

- schema_migrations: versão, SHA-256 e data. Reexecução valida checksum.
- projects: UUID, nome limitado, timestamps. Sem rotas de escrita até autenticação/propriedade.
- repository_sources: FK project, provider GitHub, unicidade projeto/owner/repo e índice da FK. Cascade apenas da origem pertencente ao projeto.
- environment_checks: evidência técnica de insert/read após commit, sem código ou credenciais.

`npm run db:migrate` usa conexão direta e aplica todas as instruções + registro da versão em uma única transação HTTP. Não executar em paralelo; serialize migrações no deploy. O runner inicial aceita apenas 0001; novas migrações exigem estender o runner e os testes antes de uso. Não se deve editar uma migração já aplicada.

`npm run db:smoke` insere UUID e lê após commit, falhando se a persistência divergir. Não apaga dados. Usa exclusivamente a branch de desenvolvimento configurada em .env.local. A aplicação usa conexão pooled em .dev.vars; nenhuma URL de conexão deve entrar no Git ou frontend.

O esquema Drizzle descreve as duas entidades de domínio; tabelas operacionais e checks estão no SQL autoritativo. Atualização de updated_at será responsabilidade explícita das operações de escrita quando implementadas.

Pendentes: users, ownership, jobs/runs, files/symbols, nodes/edges, métricas/warnings e preferências. Serão acrescentados junto com operações reais e testes de integridade, sem tabelas especulativas para recursos inexistentes. Isolamento de usuários será obrigatório antes das rotas de projetos/análises serem públicas.
