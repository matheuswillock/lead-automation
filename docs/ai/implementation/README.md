# Registro de implementação

## Estado atual

O repositório contém a aplicação TheLeadsFy e um servidor MCP local para operações controladas de prospecção com Serper. As fases 0–4 do plano MCP estão concluídas, incluindo Maps/Reviews opcionais e as avaliações mockadas. Scrape não é oferecido.

## Componentes principais

- Interface e rotas: `src/app/`.
- Busca e integração Serper: `src/app/api/useCases/`, `src/app/api/externalHandlers/SerperExternalHandler.ts` e `src/services/SerperService/`.
- Servidor MCP: `mcp/server.ts`.
- Ferramentas Places, lotes e filtros: `mcp/tools.ts`.
- Ferramentas Maps/Reviews: `mcp/phase3.ts`.
- Contador de créditos: `mcp/credits.ts`.
- Avaliações read-only: `mcp/evaluation.xml`, com validação estrutural em `mcp/evaluation.test.ts`.

## Contratos importantes

- Ferramentas de busca retornam candidatos e nunca os qualificam ou contatam automaticamente.
- Operações pagas têm limite explícito de créditos; `leadsfy_run_batch` exige confirmação idêntica à estimativa do plano.
- Filtragem, planejamento e contador de sessão são locais e não consultam o provedor.
- A chave Serper é carregada no servidor a partir do ambiente e não pertence a arquivos de configuração versionados.
- `npm run mcp` inicia o servidor por stdio; `.mcp.json` configura o cliente local sem armazenar a chave.

## Mudanças recentes registradas

- Lotes passaram a limitar a busca ao necessário para alcançar `targetCandidates` e preservar mensagens HTTP úteis.
- O onboarding distingue ausência de autenticação de perfil ausente.
- Links WhatsApp usam o código do país selecionado e não inventam prefixos para países desconhecidos.
- A Fase 4 adicionou 10 avaliações independentes de filtragem local, sem chamadas reais ao Serper.

## Fonte de verdade

Para decisões de produto e histórico do contrato Serper, consulte `TheLeadsFy/Specs/SPEC — MCP de geração de leads (Serper).md` no vault Obsidian. Para o estado executável, prevalecem o código e os testes deste checkout.
