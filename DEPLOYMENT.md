# Publicação

**Nenhum deploy remoto realizado.** Build e dry-run não publicam recursos. Não ativar produção até validar a fase, conferir plano/cotas e obter autorização de publicação.

## Recursos preparados

- cloudflare.config.ts: Worker codeatlas em production; codeatlas-dev nos outros modos, compatibilidade 2026-11-14, nodejs_compat, assets com SPA fallback e prioridade /api/*, secret DATABASE_URL, rate limiter, logs e traces.
- Neon exclusivo, branch de desenvolvimento migrada e main intacta.
- Git local independente em /workspace/codeatlas, branch main, com origin em https://github.com/Xit-coder/Code-Atlas.git. O commit inicial remoto é preservado por merge, sem force push.
- GitHub Actions de validação; deploy automático deliberadamente ausente nesta fase.

## Bloqueios e resolução

GitHub: repositório existente confirmado como [Xit-coder/Code-Atlas](https://github.com/Xit-coder/Code-Atlas), com acesso pelo conector e origin local configurado. Não criar outro repositório. O histórico remoto inicial e o commit local ce233ca devem ser preservados por merge e push normal. A autenticação da CLI Git é independente do conector; se falhar, conectar a credencial ao ambiente com acesso Contents: Read and write e Workflows: Read and write (o projeto contém um workflow), ou token clássico com repo e workflow. Não envie tokens no chat nem os coloque na URL do remote. A confirmação de publicação exige comparar o SHA de refs/heads/main e a árvore remota após o push.

Cloudflare: OAuth acessa conta e lista Workers. A consulta de subscriptions retornou 403: o endpoint não oferece OAuth scope e exige API token com Billing Read (ou conferência humana no painel). Não alterar planos. O dry-run funciona sem credenciais de deploy. Para provisionar/publicar, confirmar plano/limites e conectar token com Workers Scripts Write, Account Settings Read e permissões específicas dos bindings necessários, por variável protegida CLOUDFLARE_API_TOKEN. O token do conector não é automaticamente uma credencial da CLI.

Não há domínio solicitado. Render, R2, Queues e Workflows não foram criados.

## Caminho de publicação após os gates

1. Validar CI, testes live e versão revisada; configurar ambiente GitHub `production` com aprovação.
2. Configurar um projeto/branch Neon próprio para staging; aplicar migrações nessa branch antes de produção. Nunca copiar .env.local ao GitHub.
3. Usar secret DATABASE_URL da branch alvo por arquivo protegido/stdin conforme `cf deploy --secrets-file` da versão fixada; local .dev.vars não é publicado automaticamente. Inspecionar build output e bindings sem imprimir valores.
4. `npm run build` e `npm run cf:check`; depois `cf deploy --mode staging` apenas com autorização para staging. Usar production somente após autorização específica. Não alterar o Worker existente de outro projeto.
5. Testar HTTPS, health/readiness, inspeção real, erros, headers e logs na URL retornada pelo deploy. Registrar URL/versão reais; ausência de exceção no upload não comprova funcionamento.

O namespace do rate limiter é preparado; antes do deploy, confirmar que não colide com namespaces usados por outros Workers. Nenhuma configuração de recursos existentes foi alterada.
