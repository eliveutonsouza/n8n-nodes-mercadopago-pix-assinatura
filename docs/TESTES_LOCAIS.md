# Testes Locais com Variáveis de Ambiente

Este documento explica como executar testes locais do node do n8n usando credenciais reais do Mercado Pago através de variáveis de ambiente.

## Pré-requisitos

1. Node.js instalado (versão 14 ou superior)
2. Credenciais do Mercado Pago (Access Token)
3. Dependências do projeto instaladas (`npm install`)

## Configuração Inicial

### 1. Instalar Dependências

As dependências necessárias já estão no `package.json`. Execute:

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e preencha com suas credenciais:

```env
# Token de acesso do Mercado Pago (obrigatório)
MP_ACCESS_TOKEN=TEST-123456789-123456-abcdef-123456789-abcdef

# ID do cliente (opcional)
MP_CLIENT_ID=seu_client_id_aqui

# Secret do cliente (opcional)
MP_CLIENT_SECRET=seu_client_secret_aqui

# Ambiente: sandbox ou production (padrão: sandbox)
MP_ENVIRONMENT=sandbox
```

**Importante:**
- Use tokens de **sandbox** para testes
- O arquivo `.env` está no `.gitignore` e não será commitado
- Nunca compartilhe suas credenciais

### 3. Obter Credenciais do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Crie uma aplicação ou use uma existente
3. Copie o **Access Token** (teste para sandbox, produção para produção)
4. Cole no arquivo `.env`

## Executando os Testes

### Menu Interativo (Recomendado)

Execute o script principal que oferece um menu interativo:

```bash
npm run test:local
```

O menu permite escolher:
1. **PIX**: Testa criação, consulta e reembolso de pagamentos PIX
2. **Planos**: Testa criação, consulta, listagem e atualização de planos
3. **Assinaturas**: Testa criação, pausa, retomada e cancelamento de assinaturas
4. **Webhooks**: Testa registro, consulta, listagem e exclusão de webhooks
5. **Todos**: Executa todos os testes em sequência

### Executar Testes Específicos

Você também pode executar testes específicos diretamente:

#### Testes de PIX
```bash
npx ts-node test/local/pix.test.ts
```

#### Testes de Planos
```bash
npx ts-node test/local/plans.test.ts
```

#### Testes de Assinaturas
```bash
npx ts-node test/local/subscriptions.test.ts <planId>
```

**Nota:** Para testes de assinaturas, é necessário fornecer um Plan ID válido.

#### Testes de Webhooks
```bash
npx ts-node test/local/webhooks.test.ts
```

## Estrutura dos Testes

Cada arquivo de teste contém funções que testam operações específicas:

### PIX (`test/local/pix.test.ts`)
- `testCreatePixPayment()`: Cria um pagamento PIX
- `testGetPixPayment(paymentId)`: Consulta um pagamento PIX
- `testRefundPixPayment(paymentId)`: Reembolsa um pagamento PIX

### Planos (`test/local/plans.test.ts`)
- `testCreatePlan()`: Cria um plano de assinatura
- `testGetPlan(planId)`: Consulta um plano
- `testListPlans()`: Lista todos os planos
- `testUpdatePlan(planId)`: Atualiza um plano

### Assinaturas (`test/local/subscriptions.test.ts`)
- `testCreateSubscription(planId)`: Cria uma assinatura
- `testGetSubscription(subscriptionId)`: Consulta uma assinatura
- `testPauseSubscription(subscriptionId)`: Pausa uma assinatura
- `testResumeSubscription(subscriptionId)`: Retoma uma assinatura
- `testCancelSubscription(subscriptionId)`: Cancela uma assinatura
- `testListSubscriptions()`: Lista todas as assinaturas

### Webhooks (`test/local/webhooks.test.ts`)
- `testRegisterWebhook()`: Registra um webhook
- `testGetWebhook(webhookId)`: Consulta um webhook
- `testListWebhooks()`: Lista todos os webhooks
- `testDeleteWebhook(webhookId)`: Exclui um webhook

## Exemplos de Uso

### Exemplo 1: Testar Criação de Plano

```typescript
import { testCreatePlan } from './test/local/plans.test';

const planId = await testCreatePlan();
console.log('Plano criado:', planId);
```

### Exemplo 2: Testar Fluxo Completo de PIX

```typescript
import { 
  testCreatePixPayment, 
  testGetPixPayment, 
  testRefundPixPayment 
} from './test/local/pix.test';

// Criar pagamento
const paymentId = await testCreatePixPayment();

// Aguardar processamento
await new Promise(resolve => setTimeout(resolve, 2000));

// Consultar pagamento
await testGetPixPayment(paymentId);

// Reembolsar (opcional)
// await testRefundPixPayment(paymentId);
```

## Troubleshooting

### Erro: "Variáveis de ambiente obrigatórias faltando"

**Solução:** Verifique se o arquivo `.env` existe na raiz do projeto e contém as variáveis `MP_ACCESS_TOKEN` e `MP_ENVIRONMENT`.

### Erro: "401 Unauthorized"

**Solução:** 
- Verifique se o Access Token está correto
- Certifique-se de estar usando o token correto para o ambiente (sandbox vs production)
- Tokens expiram periodicamente, gere um novo se necessário

### Erro: "Could not get parameter"

**Solução:** Este erro geralmente indica que os parâmetros do node não estão sendo configurados corretamente. Verifique se está usando `setParams()` antes de executar o node.

### Erro de Conexão

**Solução:**
- Verifique sua conexão com a internet
- Verifique se a API do Mercado Pago está acessível
- Em alguns casos, pode ser necessário configurar proxy

## Segurança

- **Nunca** commite o arquivo `.env` no repositório
- Use apenas tokens de **sandbox** para testes
- Não compartilhe suas credenciais
- Rotacione tokens periodicamente
- Use variáveis de ambiente do sistema em produção

## Diferenças entre Testes Locais e Testes Unitários

| Aspecto | Testes Locais | Testes Unitários |
|---------|---------------|------------------|
| **API Real** | Sim | Não (mocks) |
| **Credenciais** | Reais (via .env) | Mockadas |
| **Velocidade** | Mais lento | Mais rápido |
| **Finalidade** | Validação E2E | Validação de lógica |
| **Execução** | Manual | Automatizada (CI/CD) |

## Próximos Passos

Após validar os testes locais:

1. Execute os testes unitários: `npm test`
2. Verifique a cobertura: `npm run test:coverage`
3. Publique no npm se tudo estiver funcionando
4. Configure CI/CD para testes automatizados

## Suporte

Se encontrar problemas:

1. Verifique a documentação do Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs
2. Abra uma issue no GitHub: https://github.com/eliveutonsouza/n8n-nodes-mercadopago-pix-assinatura/issues
3. Consulte os logs de erro para mais detalhes

