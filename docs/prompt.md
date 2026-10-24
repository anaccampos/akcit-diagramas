# Prompt de arquitetura

## Contexto fornecido

Proposta de uma aplicação DataSUS Quimioterapia em TypeScript, com acesso autenticado e base PostgreSQL contendo dados históricos de vários anos. A alimentação do banco é responsabilidade de um processo externo e está fora do recorte de consulta.

## Especificação para a geração

> Atue como arquiteto de software e produza uma documentação de discovery em português para o DataSUS Quimioterapia.
>
> Considere uma aplicação web Next.js/React, API Fastify em TypeScript, autenticação delegada a um provedor OpenID Connect e PostgreSQL contendo dados de vários anos. A API deve validar acesso e filtros antes de consultar indicadores agregados. O mecanismo de alimentação da base está fora do escopo, mas sua responsabilidade externa deve ser explícita.
>
> O sistema permite filtrar competências, UFs, CIDs e procedimentos, consultar resumo, tabela paginada e série mensal e exportar CSV. Não confunda APACs distintas com pacientes únicos. Não presuma que todos os períodos estejam completos.
>
> Gere um diagrama estrutural Mermaid inspirado em C4 e uma sequência de autenticação e consulta de resumo. Preserve um rascunho simplificado e revise a versão final para explicitar autorização, fronteiras, cobertura dos dados e principais erros.
>
> Registre as decisões e justificativas. Separe as premissas adotadas dos detalhes ainda pendentes. Não invente volume, SLA, provedor de identidade específico, esquema físico ou garantias de segurança e desempenho. Não descreva a proposta como uma implementação já validada.
>
> Inclua descrição em linguagem natural, diagramas renderizados, ajustes realizados e lacunas que precisam ser resolvidas antes do desenvolvimento.

## Processo

A documentação foi gerada e revisada com assistência de GenAI no Codex. Os rascunhos em `diagramas/inicial/` correspondem à proposta atual com autenticação e PostgreSQL. As versões finais detalham aspectos omitidos nessa visão simplificada. As diferenças estão registradas no README.

As escolhas expressam as premissas e decisões deste discovery. Não são resultados de uma auditoria de código. A responsável pelo projeto deve avaliar a adequação da proposta antes de usá-la como especificação de desenvolvimento.

## Validação documental

A validação verifica sintaxe Mermaid, imagens renderizadas e referências locais do Markdown. Ela não substitui provas de conceito, testes de integração, avaliação de segurança ou medições de desempenho.

O ambiente desta atividade restringe a inicialização do Chromium pelo terminal. As imagens são geradas no navegador local com a versão Mermaid instalada e a configuração do repositório. O script CLI é fornecido como procedimento de reprodução para um ambiente que permita sua execução.
