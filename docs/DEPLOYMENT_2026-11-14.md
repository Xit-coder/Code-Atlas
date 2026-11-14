# Publicação da Fase 0 — 2026-11-14

URL: https://codeatlas.erickhatano.workers.dev

Interface React e API Hono da Fase 0 publicadas. Consulta GitHub real, sem importação de arquivos ou análise estrutural. O motor continua pendente.

## Identificadores

- Código da aplicação: `1dd40be706e9c84092e1ea3990d540c4b4efe642`.
- Worker: codeatlas. Versão: `ebf6fd73-c14a-4728-8817-3bdf2c370736`.
- Implantação: `fd7b9983-1941-4fc4-bad1-68a0b7ccd559`, 100% do tráfego, criada em `2026-11-14T16:21:32.744815Z`.
- Banco preparado: projeto Neon royal-cloud-93187622, main br-spring-credit-bbkol88o. Migração 0001 e smoke com commit/rollback aprovados; registro técnico `464349a4-4b2e-45c2-a13e-fe00e90c0795`.
- Papel codeatlas_runtime: leitura do esquema permitida; INSERT em projects negado. Nenhuma credencial Neon configurada no Worker.

## Testes reais

| Verificação                     | Resultado                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| TypeScript e build              | Aprovados                                                                             |
| Unitários/API locais            | 31 aprovados                                                                          |
| HTTPS página e health           | 200; API v0.1.0/Fase 0                                                                |
| OpenAPI / rota inexistente      | 200 / 404 JSON                                                                        |
| Origem interna inválida         | 400, sem requisição interna                                                           |
| GitHub público                  | 200 para octocat/Hello-World, master, commit 7fd1a60b01f91b314f59955a4e4d4e80d8edf11d |
| Static Assets                   | Três arquivos públicos coincidem com hashes locais                                    |
| E2E no endereço público         | 2 aprovados: fluxo/erros/documentação e viewport móvel                                |
| Navegador, consulta real GitHub | Aprovado; captura abaixo                                                              |
| Conexão pública ao Neon         | Pendente: readiness 503/not_configured, explícito na interface                        |

Problemas locais de teste corrigidos sem ignorar certificados: Chromium recebeu acesso ao NSS já configurado com a CA do proxy; o contexto HTTP do Playwright respeita HTTPS_PROXY/HTTP_PROXY ao testar URL externa. Não foram usadas respostas simuladas.

[Captura da versão publicada](evidence/production.png).

## Bloqueio restante

A revisão automática de aprovação rejeitou transmitir DATABASE_URL como segredo à Cloudflare por exigir autorização explícita para essa credencial e destino. Essa autorização foi solicitada. A alternativa publicada contém interface/API sem segredo de banco; o estado indisponível aparece corretamente.

Para concluir: obter autorização para configurar a credencial somente de leitura do Neon no segredo DATABASE_URL do Worker codeatlas, configurar, validar readiness 200, smoke e E2E live. Não tratar a conexão com o banco nem o produto completo como concluídos antes disso.

## Infraestrutura e custos

Nenhum plano foi alterado ou contratado. Não foram criados Render, R2, Queues ou Workflows. A consulta Cloudflare subscriptions retorna 403 com este OAuth; não há confirmação do faturamento da conta pelo conector. Foram consultadas as cotas e preços oficiais; nenhum endpoint de assinatura foi acionado.

Nenhum outro repositório, banco de outro sistema ou Worker existente foi alterado. Segredos e JWTs temporários ficam fora do Git. Os JWTs de assets foram usados somente para a finalidade oficial de upload.
