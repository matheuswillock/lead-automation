# Plano de trabalho

## Estado das fases do MCP Serper

| Fase | Escopo | Estado |
|---|---|---|
| 0 | Confirmar contrato, parâmetros, custos e mini-batch do Serper | Concluída; evidências registradas na SPEC do Obsidian |
| 1 | Núcleo Places, planejamento de lote, contador e testes sem rede | Concluída |
| 2 | Execução de lotes com confirmação e filtragem local | Concluída |
| 3 | Ferramentas opcionais Maps e Reviews; excluir Scrape | Concluída; Scrape permanece fora do escopo |
| 4 | Dez avaliações read-only com dados mockados e respostas verificadas | Concluída; `mcp/evaluation.xml` |

## Próximas ações conhecidas

Não há fase de implementação subsequente definida na SPEC atual. Os itens abaixo são pendências não bloqueantes e exigem escopo aprovado antes de implementação:

- Confirmar limites de taxa do provedor.
- Investigar se Maps/Places permite descobrir `fid` necessário para Reviews; hoje o chamador fornece o identificador.
- Atualizar esta página e a SPEC se uma nova fase for aprovada.

## Regras de execução

- Para buscas exploratórias com dados reais, seguir o fluxo de `AGENTS.md`: app local + Browser Harness.
- Antes de qualquer operação Serper paga, explicitar número de páginas/consultas e custo estimado; não repetir uma solicitação paga por falha sem verificar seu estado.
- Testes e avaliações devem preferir mocks e ferramentas locais; não gastar créditos sem autorização explícita.
- Manter mudanças alheias ao escopo intactas; não fazer commit ou push sem pedido.
