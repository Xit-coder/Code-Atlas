# Tecnologias verificadas — 2026-11-14

Versões consultadas no registro npm antes da instalação; Node real 24.22.1, npm 11.9.0, Python 3.12.14. Versões exatas em package.json/package-lock.json. Sem instalação de dependências de repositórios analisados.

| Tecnologia                                | Decisão/verificação                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React 19.3.1 + TS 7.0.2                   | Strict, unchecked indexes e exact optional properties; typecheck obrigatório                                                                            |
| Vite 8.3.8                                | Node >=22.12 compatível com ambiente 24.22; builds web/Worker separados pelo plugin                                                                     |
| Tailwind 4.3.5                            | Plugin Vite na mesma versão, peer Vite 8 compatível                                                                                                     |
| Hono 4.13.18 / Zod 4.6.7                  | API padrão Fetch em Worker, limites/erros centralizados                                                                                                 |
| Neon driver 1.2.1 / Drizzle 0.45.4        | HTTP disponível em Worker; transações em lote suportadas, parâmetros para dados                                                                         |
| cf 1.0.0-beta.32 / plugin 2.0.0-beta.v.17 | Documentação atual pede cf para projetos novos, cloudflare.config.ts; beta é risco conhecido, mitigado por lockfile e testes em runtime                 |
| Vitest 5.1.0 / Playwright 1.65.1          | Testes de contrato/segurança e navegador; live explícito para serviços reais                                                                            |
| Tree-sitter                               | API/arquitetura consultadas; compatibilidade de gramáticas e versões Python será medida e fixada na Fase 1; não instalado nem anunciado como disponível |

Fontes oficiais consultadas:

- https://developers.cloudflare.com/cf/agents/ e https://developers.cloudflare.com/cf/projects/cloudflare-config/
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/workers/platform/pricing/ e https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- https://neon.com/docs/guides/cloudflare-workers
- https://neon.com/docs/serverless/serverless-driver
- https://neon.com/docs/introduction/plans
- https://vite.dev/guide/ e https://react.dev/learn
- https://www.typescriptlang.org/tsconfig/strict.html
- https://tailwindcss.com/docs/installation/using-vite
- https://hono.dev/docs/getting-started/cloudflare-workers
- https://orm.drizzle.team/docs/connect-neon
- https://docs.github.com/en/rest/repos/repos
- https://tree-sitter.github.io/tree-sitter/using-parsers/

Limites consultados: Worker Free 100 mil requests/dia e 10 ms CPU/invocação; static assets sem cobrança de requests quando não invocam Worker. Neon Free: 100 projetos, 100 CU-hours/projeto/mês, 1 GB/projeto (20 GB total), 5 GB egress/projeto, 10 branches/projeto. Organização tinha 2 projetos antes do CodeAtlas. Não foi contratado plano pago. Valores podem mudar; rever antes de provisionar/publicar. Plano Cloudflare da conta não pôde ser consultado por OAuth.

Validação em workerd revelou que redirect:error não é aceito no runtime; usar redirect:manual e rejeitar status não-2xx. O teste cobre 302 sem seguir destino. O build produz avisos de diretivas use client em bibliotecas; esta aplicação é SPA sem React Server Components. Avisos não equivalem a falha e são registrados na evidência.
