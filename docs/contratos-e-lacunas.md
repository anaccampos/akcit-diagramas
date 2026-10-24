# Contratos propostos e decisões pendentes

Este documento complementa a proposta com autenticação e base histórica em PostgreSQL. Os contratos abaixo são uma referência inicial de projeto, não a descrição de endpoints já implementados.

## Acesso e identidade

A aplicação web utiliza OpenID Connect com Authorization Code e PKCE. As requisições à API incluem um token de acesso em `Authorization: Bearer <token>`. A API valida assinatura, emissor, audiência e expiração antes de verificar a permissão de consulta. O ID token não deve ser usado como credencial da API.

A API não recebe senhas. Chaves públicas do provedor são mantidas em cache, com política de atualização e rotação ainda a definir. Produto de identidade, mapeamento de claims/permissões, armazenamento dos tokens no cliente, renovação, logout e recuperação de sessão precisam ser especificados antes da implementação. Nenhum segredo de cliente deve ser incorporado ao navegador.

## Rotas propostas

Todas as rotas abaixo exigem autenticação e autorização, inclusive o catálogo de períodos.

| Método e rota | Entrada | Resultado |
|---|---|---|
| `GET /analytics/metadata` | Sem corpo | Competências, UFs e cobertura disponível |
| `POST /analytics/summary` | Intervalo e filtros opcionais | Registros, APACs distintas, valor aprovado e cobertura |
| `POST /analytics/table` | Filtros e paginação | Linhas agregadas por UF, CID e procedimento |
| `POST /analytics/timeseries` | Intervalo e filtros | Agregações mensais e cobertura |
| `POST /analytics/export.csv` | Intervalo e filtros | CSV agregado, sujeito aos limites a definir |

Exemplo sintético de entrada:

```json
{
  "competenciaInicio": "2020-01",
  "competenciaFim": "2025-12",
  "ufs": ["SP", "GO"]
}
```

Esse exemplo não declara quais anos estão disponíveis. A lista real deve vir do catálogo da base.

### Regras propostas

- Início e fim são obrigatórios, no formato `AAAA-MM`, com início menor ou igual ao fim.
- UF, CID e procedimento são filtros opcionais. Sua ausência significa não restringir por essa dimensão.
- A API valida os filtros e usa consultas parametrizadas.
- A tabela possui paginação e ordenação estável, cujos campos, limites e desempates precisam ser definidos.
- A resposta diferencia ausência de cobertura de ausência de ocorrências. O catálogo deve representar disponibilidade por competência e UF, inclusive quando uma combinação coberta não possui ocorrências.
- A definição de APAC distinta, sua chave e seu comportamento ao agregar vários meses precisam ser acordados; essa contagem não representa pessoas únicas.
- O formato e a precisão de valores monetários devem ser definidos sem perda silenciosa na serialização.

### Respostas de erro

| HTTP | Situação | Comportamento esperado |
|---|---|---|
| 400 | Filtros inválidos | Informar os campos que precisam de correção |
| 401 | Token ausente, inválido ou expirado | Solicitar autenticação ou recuperação de sessão |
| 403 | Identidade válida sem permissão | Informar acesso não autorizado |
| 503 | Banco indisponível ou timeout de consulta | Informar indisponibilidade temporária e um identificador de requisição |

O payload completo dos erros, os limites de tempo e a política de tentativas continuam pendentes. Falhas internas não devem expor SQL, credenciais ou detalhes do banco ao cliente.

## Modelo conceitual de dados

O PostgreSQL mantém os registros analíticos de vários anos e um catálogo de cobertura. Os registros devem permitir relacionar competência, UF, CID, procedimento, identificação analítica da APAC e valor aprovado. O catálogo deve identificar os recortes disponíveis e a versão/data de atualização.

Esse desenho é conceitual: nomes de tabelas, chaves, granularidade, relacionamentos, nulabilidade, índices e regras de deduplicação exigem definição. Não se assume que uma tabela única ou particionamento sejam obrigatórios. Índices e pré-agregações devem responder a volumes e consultas medidos.

A API usa credencial somente de leitura; o processo externo de atualização usa credencial de escrita separada. A publicação de novos dados deve ser coordenada com o catálogo para evitar resultados inconsistentes. O mecanismo e o contrato dessa publicação ainda precisam ser definidos.

## Lacunas para implementação

| Tema | Definições necessárias |
|---|---|
| Dados | Modelo físico, dicionário, granularidade, campos permitidos e semântica das contagens |
| Histórico | Anos e UFs cobertos, períodos incompletos e tratamento de correções |
| Atualização | Frequência, consistência, identificação de versões, validação e recuperação |
| API | OpenAPI, esquemas completos, paginação, ordenação, limites e exemplos de respostas |
| Identidade | Provedor, clientes OIDC, permissões, armazenamento e ciclo de vida de tokens |
| Segurança | Acesso ao banco, proteção de segredos, logs e regras para pequenas agregações |
| Desempenho | Volume, concorrência, latência-alvo, timeouts, limites de exportação e plano de medição |
| Operação | Ambiente, monitoramento, alertas, disponibilidade, backups e recuperação |
| Aceitação | Dados sintéticos e casos de sucesso, acesso negado, cobertura incompleta e falhas |

Essas lacunas não autorizam um agente a escolher silenciosamente os detalhes. Cada decisão relevante deve ser registrada e revisada antes de orientar a implementação.
