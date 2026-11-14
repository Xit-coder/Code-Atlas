# Arquitetura

## Decisão para o produto

React/TypeScript strict + Vite/Tailwind em Static Assets e API Hono/Zod no mesmo Cloudflare Worker: uma origem para web/API, sem CORS amplo nem outro servidor web. TanStack Query controla timeout, erros e cache local de diagnóstico. React Flow e Monaco entrarão na Fase 3, quando existirem resultados reais; Zustand somente se necessário.

Neon PostgreSQL 17 exclusivo, região AWS us-east-1, branch dev-phase-0 isolada de main. Driver @neondatabase/serverless por HTTP para consultas curtas e transações em lote; sem pool TCP residente no Worker. Drizzle tipa o esquema; SQL versionado é a fonte de verdade das migrações nesta fase. Hyperdrive com pg permanece uma otimização a avaliar com medições, não um segundo caminho simultâneo de conexão.

O Worker HTTP não fará parsing de repositórios inteiros. O Worker Free tem 10 ms CPU por invocação, insuficientes para essa promessa. Motor planejado: Python isolado, Tree-sitter com gramáticas Python/JS/TS e representação intermediária própria, sem executar conteúdo importado. Runner local primeiro; serviço Render somente se os testes e limites do runtime justificarem hospedagem e os custos forem autorizados.

Para trabalhos duráveis, a decisão é usar inicialmente fila PostgreSQL com lease, heartbeat, SKIP LOCKED, concorrência limitada e tentativas finitas consumida pelo motor isolado. A gravação do job e da origem será transacional, evitando inconsistência DB/fila. Ainda não implementado. Queues/Workflows não serão provisionados antes da avaliação de custo/CPU e não substituem isolamento do parser. R2 privado para artefatos grandes, somente quando necessário e após verificação de elegibilidade/custo.

## Estado implementado

`web → /api/v1 → Hono → GitHub oficial ou Neon HTTP`.

`cloudflare.config.ts` e plugin Cloudflare executam a API em workerd. A CLI cf e plugin 2 são beta; versões estão fixadas no lockfile, e build/dry-run fazem parte do CI. Migrações e smoke de persistência executam no Node, com conexão direta. Nenhum processamento é escondido em waitUntil.

Estrutura modular por apps/packages/services. Um package.json e lockfile na raiz controlam as dependências da Fase 0; workspaces separados serão introduzidos quando o motor e bibliotecas tiverem builds independentes. Diretórios reservados contêm documentação, não implementações vazias anunciadas como funcionais.

## Contrato planejado do motor

Nós: Repository, Directory, File, Module, Class, Function, Method e Interface quando suportado. Relações: CONTAINS, IMPORTS, CALLS, EXTENDS, IMPLEMENTS, REFERENCES, DEPENDS_ON. Toda relação terá arquivo/intervalo de origem, versão do parser e resolução confirmed/inferred/unresolved. Referências não resolvidas não produzirão destinos inventados.

Estados planejados: PENDING → FETCHING → PARSING → RESOLVING → BUILDING_GRAPH → COMPLETED; alternativas FAILED/CANCELLED/PARTIAL. Progresso, cancelamento cooperativo, idempotência e recuperação exigem testes antes de ativar a API de análises.

DFS/BFS, SCC e ordenação topológica: O(V+E), com adjacências; graus O(V+E). Acoplamento inicial: fan-in/fan-out por módulo, explicitando o conjunto de relações contado. Limiares configuráveis não serão apresentados como defeitos comprovados. Imports dinâmicos, reflexão, aliases complexos e despacho polimórfico terão avisos explícitos.
