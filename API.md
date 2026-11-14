# API v1

Contrato executável: `GET /api/v1/openapi.json`, código em apps/api/src/openapi.ts.

| Método e rota                     | Comportamento implementado                                                                          |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| GET /api/v1/health                | 200: liveness da API e versão; não comprova banco                                                   |
| GET /api/v1/readiness             | 200 quando Neon responde e migração 0001 existe; 503 sem configuração, sem migração ou indisponível |
| POST /api/v1/repositories/inspect | Consulta repositório público e commit da branch padrão; não importa arquivos                        |
| GET /api/v1/openapi.json          | OpenAPI 3.1                                                                                         |

POST recebe JSON estrito `{ "url": "https://github.com/octocat/Hello-World" }`. Retorna owner, repo, URL canônica, descrição, defaultBranch, commit SHA de 40 caracteres, language e sizeKiB informado pelo GitHub (não é tamanho de download medido). Branch arbitrária ainda não suportada. Essa inspeção não é persistida como análise.

Erros: 400 entrada/JSON inválidos, 403 origem cruzada, 404 repositório/rota ausente, 413 corpo >1 KiB, 415 media type, 429 quota GitHub ou rate limiter, 502 timeout/erro/limite de resposta upstream. Erros de aplicação incluem requestId; diagnósticos têm schema próprio. x-request-id acompanha as respostas. Cache de API desativado; headers de segurança Hono.

Limiter configurado: 10 inspeções/60 s por IP/localidade Cloudflare. Não é uma garantia global exata; CF-Connecting-IP é confiável somente no edge. Sem binding nos testes unitários, o limiter é injetado explicitamente para verificar rejeição. Nenhuma lista pública de projetos, conta ou análise foi exposta; paginação e autorização por recurso serão implementadas com essas rotas.

Exemplo local:

```sh
curl http://localhost:5173/api/v1/health
curl -X POST http://localhost:5173/api/v1/repositories/inspect \
  -H 'Content-Type: application/json' \
  --data '{"url":"https://github.com/octocat/Hello-World"}'
```
