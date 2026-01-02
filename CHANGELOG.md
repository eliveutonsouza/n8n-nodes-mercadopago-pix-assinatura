# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.3.2] - 2025-01-02

### Changed

- Ícone `mercadopago.svg` movido para o diretório correto do novo node
- Adicionado arquivo `nul` ao `.gitignore` para evitar problemas no Windows

## [1.3.1] - 2025-01-02

### Fixed

- Removidos arquivos do node antigo (`PaymentMercadoPago` e `PixPayment`) do diretório `dist/`
- Corrigido conflito de instalação "There is already an entry with this name"
- Build agora contém apenas o novo node `MercadoPago`
- Adicionada documentação para resolver conflitos de instalação (`docs/RESOLVER_CONFLITO_INSTALACAO.md`)

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
