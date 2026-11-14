# Contribuir

Use Node 24.22+, npm ci e uma branch própria. Não use banco de outro projeto. Configure seus próprios arquivos ignorados conforme README. Antes de propor alteração: typecheck, npm test, build, cf:check e E2E. Testes live são separados e requerem serviços reais.

Cada parser deverá ter fixtures versionadas, expectativas de símbolos/intervalos/imports e casos inválidos. Toda relação do grafo deve incluir evidência e resolução. Não executar fixtures, código importado ou scripts de instalação de projetos analisados. Respostas sintéticas em testes de transporte são permitidas e identificadas; nunca usar essas respostas como análises do produto.

Mudanças de esquema exigem migração nova e testes em branch Neon dedicada, incluindo reexecução e falhas transacionais. Não alterar checksums existentes. Não commitar .env, tokens, connection strings, dumps ou código privado. Mudanças de infraestrutura precisam indicar serviço, custo, limites e ambiente alvo.

Relate recursos pendentes como pendentes. Um PR deve explicar problema, resultado observável, testes reais e limitações. O deploy depende de autorização e gates; o CI da Fase 0 valida sem publicar.
