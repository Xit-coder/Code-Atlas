const error = {
  description: "Erro com identificador da requisição",
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["error", "requestId"],
        properties: {
          error: { type: "string" },
          requestId: { type: "string" },
        },
      },
    },
  },
};
export const openapi = {
  openapi: "3.1.0",
  info: {
    title: "CodeAtlas API",
    version: "0.1.0",
    description:
      "Fase 0. Inspeção de origem e diagnóstico; análise estrutural ainda não implementada.",
  },
  paths: {
    "/api/v1/health": {
      get: {
        summary: "Liveness da API",
        responses: { "200": { description: "Processo disponível" } },
      },
    },
    "/api/v1/readiness": {
      get: {
        summary: "Conexão PostgreSQL e migração",
        responses: {
          "200": { description: "Banco conectado e migrado" },
          "503": { description: "Banco indisponível ou migração pendente" },
        },
      },
    },
    "/api/v1/repositories/inspect": {
      post: {
        summary:
          "Consulta metadados e commit da branch padrão de um repositório público",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                additionalProperties: false,
                properties: {
                  url: { type: "string", maxLength: 240, format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Origem real verificada; nenhum código analisado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "owner",
                    "repo",
                    "url",
                    "description",
                    "defaultBranch",
                    "commit",
                    "language",
                    "sizeKiB",
                  ],
                  properties: {
                    owner: { type: "string" },
                    repo: { type: "string" },
                    url: { type: "string", format: "uri" },
                    description: { type: ["string", "null"] },
                    defaultBranch: { type: "string" },
                    commit: { type: "string", pattern: "^[a-f0-9]{40}$" },
                    language: { type: ["string", "null"] },
                    sizeKiB: { type: "number" },
                  },
                },
              },
            },
          },
          "400": error,
          "403": error,
          "404": error,
          "413": error,
          "415": error,
          "429": error,
          "502": error,
        },
      },
    },
    "/api/v1/openapi.json": {
      get: {
        summary: "Este contrato",
        responses: { "200": { description: "OpenAPI 3.1" } },
      },
    },
  },
};
