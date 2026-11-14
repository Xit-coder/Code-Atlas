# Publicação

URL pública da Fase 0: **https://codeatlas.erickhatano.workers.dev**.

Interface e API publicadas na Cloudflare. **A conexão do Worker com o Neon aguarda autorização explícita para configurar DATABASE_URL.** Readiness responde 503/not_configured e a interface mostra PostgreSQL indisponível. O motor de análise permanece pendente.

## Versão e recursos

- Código da aplicação: commit 1dd40be706e9c84092e1ea3990d540c4b4efe642.
- Worker codeatlas; versão ebf6fd73-c14a-4728-8817-3bdf2c370736, implantação fd7b9983-1941-4fc4-bad1-68a0b7ccd559, 100% do tráfego.
- Static Assets: três arquivos, SPA fallback e prioridade /api/*. INSPECT_LIMITER: 10 inspeções/minuto/IP/localidade. Logs e traces habilitados.
- Neon exclusivo: PostgreSQL 17, main migrada em transação; runtime codeatlas_runtime somente de leitura. Desenvolvimento isolado na dev-phase-0.
- Repositório único: https://github.com/Xit-coder/Code-Atlas. GitHub Actions Validate valida sem deploy automático.

## Autorização pendente

A revisão automática bloqueou o envio da credencial Neon como secret_text, exigindo autorização explícita para transferi-la à Cloudflare. A publicação prosseguiu sem credencial de banco. A permissão solicitada é configurar DATABASE_URL do papel codeatlas_runtime como segredo no Worker codeatlas, por HTTPS. O valor não será publicado no site nem no GitHub.

Após autorização: configurar o segredo sem exibir seu valor, testar readiness 200, smoke live e E2E de banco/GitHub e registrar a nova versão. Não transmitir a credencial antes da autorização.

## Reproduzir e atualizar

1. Node 24.22+, npm ci; usar exclusivamente o repositório e o banco dedicados.
2. Rodar npm run typecheck, npm test, npm run build, npm run cf:check e os testes E2E.
3. CLI autenticada: cf deploy --mode production --prebuilt. Depois de autorizado o segredo, usar JSON protegido via --secrets-file. Arquivos .dev.vars não são publicados automaticamente. Não usar --force sobre alterações remotas desconhecidas.
4. Sem sessão CLI, usar a API oficial pelo conector: sessão de assets, upload multipart dos hashes e PUT do módulo ES com os bindings permitidos. Essa foi a rota da primeira publicação. Não extrair tokens OAuth internos; assets usam somente o JWT temporário emitido para seu upload.
5. Confirmar versão, tráfego, HTTPS, assets, health, erros, consulta real GitHub e readiness; conferir logs sem segredos.

Cloudflare Billing Read não está disponível pelo OAuth: subscriptions retorna 403. Nenhuma assinatura foi criada ou alterada e nenhum produto pago foi habilitado. Não foram criados Render, R2, Queues, Workflows ou domínio comprado. O Worker de outro projeto permaneceu intacto. Rever cotas/preços antes de ampliar uso; não prometer custo ilimitado.

## Testar a publicação

CODEATLAS_BASE_URL=https://codeatlas.erickhatano.workers.dev npm run test:e2e

Testes externos respeitam HTTPS_PROXY/HTTP_PROXY. Chromium precisa acessar seu NSS de certificados confiáveis; manter validação TLS habilitada. Após autorizar o banco, adicionar CODEATLAS_LIVE=1 e executar o smoke live com a URL pública.

Resultados e evidências: [relatório da publicação](docs/DEPLOYMENT_2026-11-14.md).
