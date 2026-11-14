# Segurança

Fase 0: nenhuma execução de código, Git clone, archive upload, instalação de dependências de repositórios, hooks ou acesso a repositórios privados. Nenhum endpoint grava projetos ou expõe dados entre usuários.

URL de entrada: HTTPS, hostname github.com exato, sem credenciais, query, fragmento, porta não padrão ou caminhos extras. Segmentos owner/repo validados; a URL nunca é usada diretamente no fetch. Requests são construídos para api.github.com e recusam redirecionamentos. Metadados limitados a 64 KiB/resposta, timeout 8 s por chamada, JSON de entrada 1 KiB. Limites excedidos produzem erro, não resultados parciais inventados.

Rate limiter 10/min por IP/localidade. CORS amplo não habilitado; POST com Origin diferente é recusado. Não é autenticação. Antes de dados privados/recursos persistentes de usuário, será obrigatório um provedor de identidade seguro e autorização por recurso.

SQL de aplicação parametrizado; SQL bruto somente para arquivo de migração versionado e confiável. .env.local/.dev.vars ignorados, acesso restrito ao usuário do ambiente. Nenhuma conexão ou segredo é enviado à SPA. Logs de erros incluem apenas evento/tipo/requestId, sem SQL, tokens ou conteúdo de código.

O executor local opcional proxy-runtime.mjs aceita saídas somente para GitHub oficial e host Neon derivado da configuração do operador, mantendo proxy e TLS. Não é um serviço de proxy público e não deve ser publicado. Só serve bundle local previamente compilado; reinicie após rebuild.

Pendentes antes de uploads/análises: limites por arquivo/total/quantidade/tempo, symlinks e path traversal, arquivos binários e exclusões, quotas por usuário, isolamento de parser e memória, fila recuperável, retenção/exclusão e autenticação do motor. Aceitar compactados está fora desta fase; futura importação deverá resistir a zip bombs.

Para reportar uma vulnerabilidade, contate o mantenedor por canal privado do GitHub quando o repositório existir; não publique credenciais ou código privado em issues. Não há canal remoto de segurança configurado ainda.
