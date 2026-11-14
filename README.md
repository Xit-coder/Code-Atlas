# CodeAtlas

Exploração determinística da estrutura de código-fonte. **v0.1.0 — incremento da Fase 0; produto completo ainda não entregue.**

Implementado: React com TypeScript strict, Vite e Tailwind; API Hono no Worker; inspeção real de metadados GitHub e commit da branch padrão; diagnóstico PostgreSQL; migração transacional versionada; testes e configuração Cloudflare. Não há análises, grafos ou símbolos fictícios.

## Executar

Node 24.22+ (linha 24), npm e Chromium/Playwright.

```sh
npm ci
cp .env.example .env.local
cp .dev.vars.example .dev.vars
# Preencha DATABASE_URL direta em .env.local; pooled em .dev.vars.
npm run db:migrate
npm run dev
```

Abra http://localhost:5173. Sem banco, a API de saúde funciona e a interface informa PostgreSQL indisponível. Use exclusivamente um projeto/branch próprio; nunca um banco de outro sistema.

Ambientes com proxy HTTP obrigatório: execute `NODE_USE_ENV_PROXY=1 npm run db:migrate`. Se o runtime local não usar o proxy, execute `npm run build` e depois `npm run dev:proxy`; abra http://127.0.0.1:8787. Esse executor usa o bundle real em workerd e encaminha tráfego real por Node; não simula respostas. Ele é apenas para desenvolvimento, sem hot reload. Em sandboxes com home somente leitura, prefixe comandos Cloudflare com `XDG_CONFIG_HOME=/tmp/codeatlas-config` e configure o cache npm em um diretório gravável.

## Verificar

```sh
npm run typecheck
npm test
npm run build
npm run cf:check
npm exec playwright install chromium
npm run test:e2e
npm run db:smoke
# Com dev:proxy em execução e conexões reais:
npm run test:live
CODEATLAS_BASE_URL=http://127.0.0.1:8787 CODEATLAS_LIVE=1 npm run test:e2e
```

Para Chromium instalado no sistema, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Os testes padrão não consultam GitHub/Neon; testes live são explícitos e dependem de rede/cotas. O smoke de banco grava um registro técnico persistente, sem dados de código.

## Documentação

- [Arquitetura](ARCHITECTURE.md), [API](API.md), [Banco](DATABASE.md).
- [Publicação e bloqueios de acesso](DEPLOYMENT.md), [Segurança](SECURITY.md).
- [Contribuição](CONTRIBUTING.md), [Changelog](CHANGELOG.md).
- [Plano por fases](docs/ROADMAP.md), [evidências da Fase 0](docs/PHASE_0.md), [fontes consultadas](docs/TECHNOLOGY_REVIEW.md).

Pendentes: parser Tree-sitter, processamento assíncrono, persistência de análises, contas e propriedade, React Flow, Monaco, relatórios, comparações e publicação. Java/Go/Rust/C# são expansões futuras. A inspeção de origem não importa arquivos nem inicia análise.

Licença: MIT. Repositório remoto ainda não criado; não há link GitHub ou deploy publicado.
