# Estratégia e evidências de teste

## Comandos locais

```bash
npm test
npx tsc --noEmit
npm run build
npm run lint
```

`npm test` inclui testes dos casos de uso/API, helper de WhatsApp e ferramentas MCP (`mcp/*.test.ts`). Os testes MCP usam handlers mockados; não precisam de rede Serper nem consomem créditos.

## Cobertura do MCP

- Contrato Places, deduplicação, limite de páginas e erros do provedor.
- Planejamento de lote sem chamadas externas.
- Confirmação obrigatória do custo do lote, parada no alvo e tratamento de erros HTTP.
- Filtragem local por site, telefone e avaliação mínima.
- Presença das ferramentas Maps/Reviews e ausência explícita de Scrape.
- Avaliações: `mcp/evaluation.xml` contém dez tarefas mockadas; cada resposta foi verificada chamando duas vezes a ferramenta local `leadsfy_filter_candidates`. As verificações retornaram zero créditos.

## Validação de integração

Para inspecionar a superfície MCP sem executar busca paga:

```bash
npx @modelcontextprotocol/inspector --cli --method tools/list npm run mcp
```

Não execute `leadsfy_search_places`, `leadsfy_search_places_pages`, `leadsfy_run_batch`, `leadsfy_maps_search` ou `leadsfy_place_reviews` durante uma avaliação sem autorização e orçamento explícitos: podem consumir créditos.

## Buscas reais

Não são parte da suíte automatizada. Quando solicitadas, seguir o fluxo de validação manual em `AGENTS.md` (iniciar o app local e usar Browser Harness), limitar páginas e revisar o custo antes da execução. Tratar todo resultado como candidato não verificado.

## Estado das últimas verificações

Na conclusão da Fase 4, as dez respostas mockadas foram verificadas via MCP local e `npm test` passou com 30 testes. `npx tsc --noEmit` e `npm run build` também passaram. Após criar estes documentos, `npx ai-devkit@latest lint` passou nos cinco checks de estrutura.
