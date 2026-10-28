# Requisitos do TheLeadsFy

## Objetivo

Permitir que profissionais encontrem empresas candidatas a prospecção B2B por tipo de negócio e localização, revisem os resultados e decidam manualmente quais são leads adequados.

## Escopo atual

- Aplicação web com busca de empresas via Serper Places e visualização dos resultados.
- Servidor MCP local/stdio para busca Places, planejamento e execução de lotes, filtragem local de candidatos, consulta Maps, consulta Reviews e leitura do contador de créditos da sessão.
- Os resultados são **candidatos**, não leads qualificados.

## Requisitos funcionais

1. A busca deve aceitar um nicho e uma região e apresentar candidatos retornados pelo provedor.
2. O usuário deve poder filtrar candidatos pelos dados disponíveis, incluindo presença de site, telefone e avaliação mínima.
3. O MCP deve oferecer planejamento de lote sem rede e sem custo, e exigir confirmação exata do custo estimado antes de executar um lote.
4. As operações pagas devem exigir um limite explícito de créditos e informar o custo efetivamente reportado pelo provedor.
5. A ferramenta local de filtragem deve aceitar candidatos fornecidos pelo chamador e não fazer chamadas externas.
6. As avaliações do MCP devem usar apenas dados mockados e operações locais/read-only.

## Requisitos de segurança e produto

- Nunca incluir a chave Serper em argumentos de ferramenta, resposta, log, código de cliente ou arquivo versionado.
- Não enviar mensagens, contatar, seguir, exportar em massa ou executar ações de prospecção automaticamente.
- Não oferecer scraper no aplicativo nem no MCP.
- Tratar dados Places, Maps e Reviews como não verificados; a qualificação e qualquer abordagem são decisões humanas.
- Consultas reais de prospecção no app devem seguir `AGENTS.md`: iniciar a aplicação local e validar pelo Browser Harness; não consultar o Serper diretamente por Playground, curl ou script.

## Fora do escopo

Scrape, enriquecimento orgânico via Search, CRM, envio automático, saldo remoto do Serper e descoberta automática de `fid` para Reviews. Mudanças de escopo devem atualizar a SPEC de MCP vinculada abaixo.

## Fonte de requisitos

SPEC detalhada: `TheLeadsFy/Specs/SPEC — MCP de geração de leads (Serper).md` no vault Obsidian. Esta página resume os requisitos aplicáveis ao ciclo AI DevKit.
