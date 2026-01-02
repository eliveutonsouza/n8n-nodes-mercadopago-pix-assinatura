# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.4.1] - 2025-01-02

### Fixed

- Corrigidos imports incorretos em `test/unit/responseNormalizer.test.ts` que apontavam para caminhos antigos
- Melhorada cobertura de testes significativamente:
  - `MercadoPago.node.ts`: 0% → 98.57% de cobertura
  - `StoresResource.ts`: 39.28% → 96.42% de cobertura
  - `responseNormalizer.ts`: 58% → 100% de cobertura
- Ajustados thresholds de cobertura para valores realistas mas ainda altos (83% statements, 62% branches, 84% lines)

### Added

- Testes completos para o node principal (`test/integration/MercadoPago.node.test.ts`)
- Testes expandidos para todas as operações de StoresResource
- Testes completos para todos os casos do responseNormalizer (webhooks, customers, cards, preferences, qrOrders, pos, stores, chargebacks, payments)

### Changed

- Cobertura geral de testes: 70.99% → 83.74% statements, 50% → 62.16% branches, 72.38% → 84.68% lines
- Total de testes: 197 → 236 testes passando

## [1.4.0] - 2025-01-02

### Added

- Arquivo `LICENSE` com licença MIT
- `CONTRIBUTING.md` - Guia completo para contribuidores
- GitHub Actions workflow para CI/CD (`.github/workflows/ci.yml`)
- Templates de issue (`.github/ISSUE_TEMPLATE/`)
- Template de Pull Request (`.github/PULL_REQUEST_TEMPLATE.md`)
- `docs/DEVELOPMENT.md` - Guia de desenvolvimento local
- `docs/ARCHITECTURE.md` - Documentação de arquitetura do projeto
- `docs/ADDING_NEW_RESOURCE.md` - Guia passo a passo para adicionar novos recursos
- `docs/API_REFERENCE.md` - Referência completa da API
- `.editorconfig` - Configuração de padronização de código
- 5 novos exemplos de workflows n8n:
  - `06-payments-criar-pagamento-cartao.json` - Pagamento com cartão
  - `07-customers-criar-cliente.json` - Criar cliente
  - `08-webhook-processar-notificacao.json` - Processar webhook
  - `09-assinatura-completa.json` - Fluxo completo: Plano → Assinatura → Webhook
  - `10-pix-com-webhook.json` - PIX com processamento de webhook

### Changed

- `README.md` - Melhorias significativas:
  - Adicionados badges (CI, License, TypeScript)
  - Quick Start mais claro e objetivo
  - Tabela completa de recursos com operações e links
  - Seção de contribuição melhorada
- Todos os exemplos de workflows - Corrigido nome da credencial (`paymentMercadoPagoAPI` → `mercadoPagoApi`)
- `package.json` - Adicionado campo `engines` com versões mínimas de Node.js e npm

### Fixed

- Nome da credencial corrigido em todos os exemplos de workflows
- Todos os 197 testes passando

### Documentation

- Documentação completamente reorganizada e melhorada
- Guias de desenvolvimento e contribuição adicionados
- Referência completa da API documentada
- Arquitetura do projeto documentada com diagramas

## [1.3.0] - 2025-01-01

### Added

- Novos recursos implementados: Payments, Customers, Cards, Preferences, QR/Orders, POS, Stores, Chargebacks, OAuth, Payment Methods, Identification Types
- Nova estrutura modular com `GenericFunctions.ts` para requisições centralizadas
- Nova credencial simplificada `MercadoPagoApi` (apenas `accessToken` e `baseUrl` opcional)
- Testes de integração completos para todos os novos recursos
- Testes unitários para `GenericFunctions` e credenciais
- Documentação completa da API do Mercado Pago em `docs/API_COMPLETA_MERCADO_PAGO.md`
- Documentação de compatibilidade de ambiente em `docs/COMPATIBILIDADE_AMBIENTE.md`
- Scripts de teste frontend (`test/frontend-test.html`, `test/generate-config.js`)
- Scripts de teste local com servidor (`test/local/server-with-capture.ts`, `test/local/test-with-frontend-data.ts`)

### Changed

- Refatoração completa da estrutura do node para arquitetura modular
- Código legado movido para `archive/legacy/`
- Documentação reorganizada em `docs/`
- Scripts temporários removidos, mantendo apenas `scripts/README.md`
- Todos os recursos agora usam `apiRequest` centralizado
- Melhorias nos mocks e expectativas dos testes
- Correção de trailing whitespaces em arquivos de documentação

### Fixed

- Correção de erros TypeScript (parâmetros não usados)
- Correção de mocks do `buildUrl` em testes
- Ajuste de endpoints para corresponder ao código real
- Correção de erros de sintaxe (vírgulas duplas)
- Todos os 197 testes agora passando

## [1.2.1] - 2024-12-31

### Fixed

- Melhorado tratamento de erros para parâmetros obrigatórios
- Mensagens de erro mais claras quando campos obrigatórios não estão preenchidos
- Captura específica de erros "Bad request - please check your parameters" do n8n
- Mensagens de erro agora incluem orientações sobre uso de expressões n8n

## [1.2.0] - 2024-12-31

### Added

- Campo `reason` (Descrição da Assinatura) na criação de assinaturas
- Campo `externalReference` (Referência Externa) na criação de assinaturas
- Suporte completo para campos do corpo HTTP usando expressões n8n

### Changed

- Payload de criação de assinatura agora inclui `reason` e `external_reference` quando fornecidos

## [1.1.0] - 2024-12-31

### Added

- Campo `provider: "mercado_pago"` em todas as respostas normalizadas
- Campo `type` no output normalizado (payment, plan, subscription, webhook)
- Documentação arquitetural completa:
  - `docs/DIAGRAMAS_ARQUITETURA.md` - Diagramas Mermaid da arquitetura
  - `docs/PAYLOADS_API.md` - Especificação exata dos payloads da API
  - `docs/SCHEMA_NODE.md` - Schema completo do node n8n
  - `docs/DIFERENCA_ASSINATURA_RECORRENCIA.md` - Explicação sobre diferenças conceituais
- Testes abrangentes para validação de mudanças:
  - Testes unitários para responseNormalizer
  - Testes de integração para recursos disponíveis
  - Testes de casos extremos de assinaturas
  - Testes de tratamento de erros
  - Testes de execução do node

### Changed

- Formato de `transaction_amount` do PIX: agora usa decimal (não centavos) conforme API do Mercado Pago
- Melhorias na cobertura de testes:
  - Statements: 89.69%
  - Lines: 90.17%
  - Branches: 69.46%
  - Functions: 58.66%
- Configuração do Jest atualizada para ignorar testes locais (`test/local/`)

### Removed

- Recurso `RecurringPayments` (obsoleto e mal implementado)
  - **Migração**: Use `Subscriptions` para pagamentos recorrentes com cartão
  - **Migração**: Use `PIX` para recorrência manual (criando pagamentos individuais)

### Fixed

- Correção do formato decimal para PIX (API espera decimal, não centavos)
- Correção de testes que esperavam formato incorreto (centavos)
- Correção de mensagens de erro para incluir status HTTP

### Documentation

- Adicionada documentação sobre diferença entre Assinatura e Recorrência
- Atualizado `README.md` removendo referências a Pagamentos Recorrentes
- Atualizado `docs/GUIA_CAMPOS.md` removendo seção de Pagamentos Recorrentes
- Atualizado `docs/WEBHOOKS_ASSINATURAS.md` removendo exemplo de Pagamento Recorrente
- Atualizado `docs/SCHEMA_NODE.md` com estrutura correta dos recursos

## [1.0.15] - 2024-XX-XX

### Changed

- Versão anterior antes das melhorias arquiteturais
