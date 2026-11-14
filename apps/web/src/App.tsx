import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Braces,
  Check,
  CircleDot,
  ExternalLink,
  FileCode2,
  GitBranch,
  GitFork as Github,
  LoaderCircle,
  Network,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import type { RepositoryInfo } from "../../../packages/shared/src/repository";

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(20000),
  });
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok)
    throw new Error(body.error ?? "Serviço indisponível. Tente novamente.");
  return body;
}

export function App() {
  const [url, setUrl] = useState("");
  const [tab, setTab] = useState<"workspace" | "docs">("workspace");
  const health = useQuery({
    queryKey: ["health"],
    queryFn: () => json<{ status: string }>("/api/v1/health"),
  });
  const database = useQuery({
    queryKey: ["database"],
    queryFn: () => json<{ database: string }>("/api/v1/readiness"),
    staleTime: 60000,
  });
  const repo = useMutation({
    mutationFn: (input: string) =>
      json<RepositoryInfo>("/api/v1/repositories/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input }),
      }),
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    repo.mutate(url);
  }
  return (
    <div className="shell">
      <a href="#main" className="skip">
        Pular para o conteúdo
      </a>
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="CodeAtlas início">
          <span className="logo">
            <Network size={22} />
          </span>
          CODE<span>ATLAS</span>
        </a>
        <div className="side-label">EXPLORADOR DE CÓDIGO</div>
        <nav aria-label="Principal">
          <button
            className={tab === "workspace" ? "nav active" : "nav"}
            onClick={() => setTab("workspace")}
          >
            <Braces size={18} /> Workspace <span className="key">01</span>
          </button>
          <button
            className={tab === "docs" ? "nav active" : "nav"}
            onClick={() => setTab("docs")}
          >
            <FileCode2 size={18} /> Documentação
          </button>
        </nav>
        <div className="side-project">
          <div className="side-label">SESSÃO ATUAL</div>
          <p>
            <CircleDot size={14} /> Nenhuma análise
          </p>
          <small>Comece verificando um repositório público.</small>
        </div>
        <div className="side-bottom">
          <ShieldCheck size={17} />
          <div>
            Inspeção somente leitura<small>Seu código nunca é executado.</small>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>
            <span className="crumb">CodeAtlas</span>
            <span className="slash">/</span>
            {tab === "docs" ? "Documentação" : "Workspace"}
          </div>
          <span className="phase">
            <span /> Fase 0 · Fundação
          </span>
        </header>
        <main id="main">
          {tab === "docs" ? (
            <section className="docs">
              <div className="eyebrow">DOCUMENTAÇÃO / v0.1.0</div>
              <h1>Uma base verificável.</h1>
              <p>
                Este incremento consulta metadados públicos do GitHub e verifica
                a conexão real com o PostgreSQL. Ainda não baixa arquivos nem
                produz análises.
              </p>
              <h2>Contrato da API</h2>
              <p>
                <code>GET /api/v1/health</code> verifica a API.{" "}
                <code>GET /api/v1/readiness</code> confirma banco e migração.{" "}
                <code>POST /api/v1/repositories/inspect</code> recebe{" "}
                <code>{'{ "url": "https://github.com/owner/repo" }'}</code> e
                retorna a branch padrão e o commit atual.
              </p>
              <a
                className="text-link"
                href="/api/v1/openapi.json"
                target="_blank"
                rel="noreferrer"
              >
                Abrir especificação OpenAPI <ExternalLink size={14} />
              </a>
              <h2>Limites de segurança</h2>
              <p>
                Somente github.com por HTTPS. A API usa api.github.com, recusa
                redirecionamentos, limita as respostas e aplica timeout.
                Consultas anônimas estão sujeitas à cota do GitHub.
              </p>
              <h2>Próximo incremento</h2>
              <p>
                Motor Tree-sitter para Python, JavaScript e TypeScript, com
                evidências de localização e testes por linguagem. Mapas,
                símbolos, histórico e exportação permanecem pendentes.
              </p>
            </section>
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">WORKSPACE / NOVO PROJETO</div>
                  <h1>
                    Conheça o código.
                    <br />
                    <span>Encontre as conexões.</span>
                  </h1>
                  <p>
                    O ponto de partida para explorar a estrutura de um
                    repositório.
                    <br className="desktop-break" /> Primeiro, verifique sua
                    origem e a versão do código.
                  </p>
                </div>
                <div className="heading-mark" aria-hidden="true">
                  <Terminal size={36} />
                  <span>code → structure</span>
                </div>
              </div>
              <section className="import-panel" aria-labelledby="import-title">
                <div className="panel-head">
                  <span className="panel-icon">
                    <Github size={20} />
                  </span>
                  <div>
                    <h2 id="import-title">Conectar repositório público</h2>
                    <p>Consulte a origem antes de iniciar uma análise.</p>
                  </div>
                  <span className="badge">GITHUB</span>
                </div>
                <form onSubmit={submit}>
                  <label htmlFor="repository">URL do repositório</label>
                  <div className="input-row">
                    <div className="input-wrap">
                      <Github size={17} />
                      <input
                        id="repository"
                        type="url"
                        required
                        maxLength={240}
                        placeholder="https://github.com/proprietario/repositorio"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    <button className="primary" disabled={repo.isPending}>
                      {repo.isPending ? (
                        <LoaderCircle className="spin" size={17} />
                      ) : (
                        <ArrowRight size={17} />
                      )}
                      {repo.isPending
                        ? "Verificando…"
                        : "Verificar repositório"}
                    </button>
                  </div>
                </form>
                <p className="hint">
                  <ShieldCheck size={14} /> Apenas metadados públicos. Nenhum
                  arquivo é executado ou instalado.
                </p>
                <div aria-live="polite">
                  {repo.isError && (
                    <p className="error" role="alert">
                      {repo.error.message}
                    </p>
                  )}
                  {repo.data && (
                    <div className="repo-result">
                      <div className="result-title">
                        <Check size={18} />
                        <strong>
                          {repo.data.owner}/{repo.data.repo}
                        </strong>
                        <span>Origem verificada</span>
                      </div>
                      <p>
                        {repo.data.description ?? "Sem descrição no GitHub."}
                      </p>
                      <dl>
                        <div>
                          <dt>Branch padrão</dt>
                          <dd>
                            <GitBranch size={13} />
                            {repo.data.defaultBranch}
                          </dd>
                        </div>
                        <div>
                          <dt>Commit</dt>
                          <dd className="mono">{repo.data.commit}</dd>
                        </div>
                        <div>
                          <dt>Linguagem principal</dt>
                          <dd>{repo.data.language ?? "Não informada"}</dd>
                        </div>
                      </dl>
                      <p className="hint">
                        Verificação concluída. Análise estrutural disponível em
                        uma próxima fase.
                      </p>
                    </div>
                  )}
                </div>
              </section>
              <section className="empty-map" aria-labelledby="map-title">
                <div className="map-grid" aria-hidden="true" />
                <div className="empty-icon">
                  <Network size={29} />
                </div>
                <h2 id="map-title">Seu mapa começa com código real.</h2>
                <p>
                  O motor de análise está na próxima etapa de desenvolvimento.
                  <br />
                  Nenhum grafo é exibido sem evidências extraídas do código.
                </p>
                <span className="outline-badge">
                  MOTOR DE ANÁLISE · PENDENTE
                </span>
              </section>
              <section
                className="system-strip"
                aria-label="Estado dos serviços"
              >
                <div>
                  <span
                    className={
                      "status-dot " + (health.isSuccess ? "green" : "")
                    }
                  />
                  <span>API</span>
                  <strong>
                    {health.isPending
                      ? "Conectando…"
                      : health.isError
                        ? "Indisponível"
                        : "Conectada"}
                  </strong>
                </div>
                <div>
                  <span
                    className={
                      "status-dot " + (database.isSuccess ? "green" : "")
                    }
                  />
                  <span>PostgreSQL</span>
                  <strong>
                    {database.isPending
                      ? "Verificando…"
                      : database.isError
                        ? "Indisponível"
                        : "Conectado"}
                  </strong>
                </div>
                <button
                  onClick={() => {
                    void health.refetch();
                    void database.refetch();
                  }}
                >
                  Verificar serviços
                </button>
              </section>
            </>
          )}
        </main>
        <footer>
          <span>
            CODEATLAS <span className="muted">/</span> v0.1.0
          </span>
          <span>Análise determinística. Estrutura verificável.</span>
        </footer>
      </div>
    </div>
  );
}
