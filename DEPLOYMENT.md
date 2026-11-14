# Publicação

URL pública da Fase 0: **https://codeatlas.erickhatano.workers.dev**.

Interface e API publicadas na Cloudflare e conectadas ao Neon. **Readiness responde 200/ready e o banco aparece conectado na interface.** O motor de análise permanece pendente.

## Versão e recursos

- Código da aplicação: commit 1dd40be706e9c84092e1ea3990d540c4b4efe642.
- Worker codeatlas; versão 1e343c96-cd9c-44b5-bbec-6a74dd49f589, implantação cf4cc2c9-135f-48c4-8543-72ba5b12e6b8, 100% do tráfego.
- Static Assets: três arquivos, SPA fallback e prioridade /api/*. INSPECT_LIMITER: 10 inspeções/minuto/IP/localidade. Logs e traces habilitados.
- Neon exclusivo: PostgreSQL 17, main migrada em transação; runtime codeatlas_runtime somente de leitura. Desenvolvimento isolado na dev-phase-0.
- Repositório único: https://github.com/Xit-coder/Code-Atlas. GitHub Actions Validate valida sem deploy automático.

## Segredo e permissões

Após autorização explícita do usuário, DATABASE_URL do papel codeatlas_runtime foi configurada como secret_text no Worker codeatlas. O valor foi enviado por HTTPS e não aparece no site nem no GitHub. O papel é somente de leitura, sem INSERT em projects. A primeira publicação sem segredo foi substituída pela versão integrada.

Readiness 200, smoke live e três testes E2E públicos de banco/GitHub foram aprovados após configurar o segredo. Não ampliar permissões do papel nem expor o valor em logs.

## Reproduzir e atualizar

1. Node 24.22+, npm ci; usar exclusivamente o repositório e o banco dedicados.
2. Rodar npm run typecheck, npm test, npm run build, npm run cf:check e os testes E2E.
3. CLI autenticada: cf deploy --mode production --prebuilt. Depois de autorizado o segredo, usar JSON protegido via --secrets-file. Arquivos .dev.vars não são publicados automaticamente. Não usar --force sobre alterações remotas desconhecidas.
4. Sem sessão CLI, usar a API oficial pelo conector: sessão de assets, upload multipart dos hashes e PUT do módulo ES com os bindings permitidos. Essa foi a rota da primeira publicação. Não extrair tokens OAuth internos; assets usam somente o JWT temporário emitido para seu upload.
5. Confirmar versão, tráfego, HTTPS, assets, health, erros, consulta real GitHub e readiness; conferir logs sem segredos.

Cloudflare Billing Read não está disponível pelo OAuth: subscriptions retorna 403. Nenhuma assinatura foi criada ou alterada e nenhum produto pago foi habilitado. Não foram criados Render, R2, Queues, Workflows ou domínio comprado. O Worker de outro projeto permaneceu intacto. Rever cotas/preços antes de ampliar uso; não prometer custo ilimitado.

## Testar a publicação

CODEATLAS_BASE_URL=https://codeatlas.erickhatano.workers.dev npm run test:e2e

Testes externos respeitam HTTPS_PROXY/HTTP_PROXY. Chromium precisa acessar seu NSS de certificados confiáveis; manter validação TLS habilitada. Para incluir o teste real de banco, adicionar CODEATLAS_LIVE=1. Para o smoke, usar CODEATLAS_SMOKE_URL=https://codeatlas.erickhatano.workers.dev npm run test:live.

Resultados e evidências: [relatório da publicação](docs/DEPLOYMENT_2026-11-14.md).
