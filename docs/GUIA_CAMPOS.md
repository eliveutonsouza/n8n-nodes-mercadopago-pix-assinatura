# 📋 Guia de Referência de Campos

Este documento contém exemplos completos de preenchimento de todos os campos disponíveis em cada operação do node Mercado Pago PIX e Assinaturas.

## 📦 PIX

### Criar Pagamento

Cria um novo pagamento PIX e retorna o QR Code para pagamento.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| Valor | number | ✅ Sim | Valor do pagamento em reais | `10.50` |
| Descrição | string | ✅ Sim | Descrição do pagamento | `"Pagamento de teste"` |
| E-mail do Pagador | string | ✅ Sim | E-mail do pagador | `"cliente@exemplo.com"` |
| CPF/CNPJ do Pagador | string | ❌ Não | CPF ou CNPJ do pagador (apenas números) | `"12345678909"` ou `"12345678000190"` |
| Nome do Pagador | string | ❌ Não | Nome completo do pagador | `"João Silva"` |
| Data de Expiração | dateTime | ❌ Não | Data e hora de expiração do QR Code PIX | `"2024-12-31T23:59:59.000Z"` |
| Referência Externa | string | ❌ Não | Referência externa para identificar o pagamento | `"PEDIDO_12345"` |
| Chave de Idempotência | string | ❌ Não | Chave única para garantir idempotência da requisição | `"IDEMP_20241230_001"` |

#### Exemplo JSON Completo

```json
{
  "resource": "pix",
  "operation": "create",
  "amount": 10.50,
  "description": "Pagamento de teste - Pedido #12345",
  "payerEmail": "cliente@exemplo.com",
  "payerDocument": "12345678909",
  "payerName": "João Silva",
  "expirationDate": "2024-12-31T23:59:59.000Z",
  "externalReference": "PEDIDO_12345",
  "idempotencyKey": "IDEMP_20241230_001"
}
```

#### Exemplo JSON Mínimo (Apenas Campos Obrigatórios)

```json
{
  "resource": "pix",
  "operation": "create",
  "amount": 10.50,
  "description": "Pagamento de teste",
  "payerEmail": "cliente@exemplo.com"
}
```

---

### Consultar Pagamento

Consulta o status de um pagamento PIX existente.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Pagamento | string | ✅ Sim | ID do pagamento a ser consultado | `"123456789"` |

#### Exemplo JSON

```json
{
  "resource": "pix",
  "operation": "get",
  "paymentId": "123456789"
}
```

---

### Reembolsar Pagamento

Reembolsa total ou parcialmente um pagamento PIX.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Pagamento | string | ✅ Sim | ID do pagamento a ser reembolsado | `"123456789"` |
| Valor do Reembolso | number | ❌ Não | Valor do reembolso em reais (deixe vazio para reembolso total) | `5.00` |

#### Exemplo JSON - Reembolso Total

```json
{
  "resource": "pix",
  "operation": "refund",
  "paymentId": "123456789"
}
```

#### Exemplo JSON - Reembolso Parcial

```json
{
  "resource": "pix",
  "operation": "refund",
  "paymentId": "123456789",
  "refundAmount": 5.00
}
```

---

## 🔄 Assinaturas

### Criar Assinatura

Cria uma nova assinatura baseada em um plano existente. Segundo a documentação oficial do Mercado Pago, é possível criar assinaturas com ou sem plano associado.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Plano | string | ✅ Sim* | ID do plano de assinatura. *Obrigatório apenas se criar assinatura com plano. É possível criar assinatura sem plano. | `"2c938084726fca480172750000000000"` |
| E-mail do Pagador | string | ✅ Sim | E-mail do pagador. Obrigatório para criar assinatura. Permite obter identificador único do assinante. | `"cliente@exemplo.com"` |
| CPF/CNPJ do Pagador | string | ❌ Não | CPF ou CNPJ do pagador (apenas números). Recomendado para validação. | `"12345678909"` |
| Token do Cartão | string | ⚠️ Condicional | Token do cartão (card_token_id) obtido via Checkout Transparente no front-end. **Obrigatório se subscriptionStatus for "authorized"**. Se não fornecido, assinatura será criada com status "pending" e retornará init_point. | `"e3ed6f098462036dd2cbabe314b9de2a"` |
| Status da Assinatura | options | ❌ Não | Status inicial: "pending" (sem cartão, retorna init_point) ou "authorized" (com cartão, requer card_token_id obrigatório). Padrão: "pending" | `"pending"` ou `"authorized"` |
| Data de Início | dateTime | ❌ Não | Data de início da assinatura (ISO 8601). Funciona apenas em conjunto com end_date. | `"2024-01-01T00:00:00.000Z"` |
| Período de Trial (dias) | number | ❌ Não | Número de dias de período de trial grátis | `7` |

#### Exemplo JSON Completo (Com Cartão - Status Authorized)

```json
{
  "resource": "subscriptions",
  "operation": "create",
  "planId": "PLAN_123456",
  "payerEmail": "cliente@exemplo.com",
  "payerDocument": "12345678909",
  "cardTokenId": "abc123def456",
  "subscriptionStatus": "authorized",
  "startDate": "2024-01-01T00:00:00.000Z",
  "trialPeriodDays": 7
}
```

#### Exemplo JSON (Sem Cartão - Status Pending)

```json
{
  "resource": "subscriptions",
  "operation": "create",
  "planId": "PLAN_123456",
  "payerEmail": "cliente@exemplo.com",
  "payerDocument": "12345678909",
  "subscriptionStatus": "pending",
  "startDate": "2024-01-01T00:00:00.000Z",
  "trialPeriodDays": 7
}
```

#### Exemplo JSON Mínimo (Apenas Campos Obrigatórios)

```json
{
  "resource": "subscriptions",
  "operation": "create",
  "planId": "PLAN_123456",
  "payerEmail": "cliente@exemplo.com"
}
```

**📝 Notas Importantes (baseadas na documentação oficial):**

1. **Fluxo com Cartão (Status: "authorized"):**
   - **Requer `cardTokenId` obrigatório**
   - Forneça `cardTokenId` e `subscriptionStatus: "authorized"`
   - A assinatura será ativada imediatamente
   - O `cardTokenId` **deve ser obtido no front-end** usando a PUBLIC_KEY do Mercado Pago através do **CardForm** do Checkout Transparente
   - Veja [Como Obter card_token_id](./COMO_OBTER_CARD_TOKEN.md) para instruções detalhadas
   - **Importante**: O token expira em 7 dias e pode ser usado apenas uma vez

2. **Fluxo sem Cartão (Status: "pending"):**
   - **Não requer `cardTokenId`**
   - Não forneça `cardTokenId` e use `subscriptionStatus: "pending"` (ou deixe vazio)
   - A API retornará um `init_point` (URL de checkout do Mercado Pago)
   - Envie o `init_point` ao cliente para que ele complete o pagamento
   - Após o pagamento, a assinatura será ativada automaticamente (status muda para "authorized")
   - Configure webhooks para ser notificado quando o status mudar

3. **Campos Obrigatórios da API (conforme documentação oficial):**
   - `payer_email`: Obrigatório - Email do pagador
   - `card_token_id`: Obrigatório apenas se status for "authorized"
   - `auto_recurring.frequency`: Obrigatório apenas para assinaturas sem plano
   - `auto_recurring.frequency_type`: Obrigatório apenas para assinaturas sem plano
   - `auto_recurring.currency_id`: Obrigatório apenas para assinaturas sem plano
   - `back_url`: Obrigatório apenas para assinaturas sem plano

4. **Como obter o card_token_id:**
   - O token **deve ser gerado no front-end** usando MercadoPago.js (CardForm)
   - **Não pode** ser gerado no backend por questões de segurança PCI
   - Passo a passo completo: [COMO_OBTER_CARD_TOKEN.md](./COMO_OBTER_CARD_TOKEN.md)
   - Documentação oficial: [Checkout Transparente - CardForm](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards)

5. **Integração Front-end + n8n:**
   - Veja [INTEGRACAO_FRONTEND_N8N.md](./INTEGRACAO_FRONTEND_N8N.md) para guia completo
   - O front-end coleta dados do cartão → gera token → envia para n8n
   - O n8n recebe o token e cria a assinatura na API do Mercado Pago

---

### Pausar Assinatura

Pausa uma assinatura ativa.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID da Assinatura | string | ✅ Sim | ID da assinatura a ser pausada | `"SUB_789012"` |

#### Exemplo JSON

```json
{
  "resource": "subscriptions",
  "operation": "pause",
  "subscriptionId": "SUB_789012"
}
```

---

### Retomar Assinatura

Retoma uma assinatura pausada.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID da Assinatura | string | ✅ Sim | ID da assinatura a ser retomada | `"SUB_789012"` |

#### Exemplo JSON

```json
{
  "resource": "subscriptions",
  "operation": "resume",
  "subscriptionId": "SUB_789012"
}
```

---

### Cancelar Assinatura

Cancela uma assinatura.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID da Assinatura | string | ✅ Sim | ID da assinatura a ser cancelada | `"SUB_789012"` |

#### Exemplo JSON

```json
{
  "resource": "subscriptions",
  "operation": "cancel",
  "subscriptionId": "SUB_789012"
}
```

---

### Consultar Assinatura

Consulta uma assinatura específica.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID da Assinatura | string | ✅ Sim | ID da assinatura a ser consultada | `"SUB_789012"` |

#### Exemplo JSON

```json
{
  "resource": "subscriptions",
  "operation": "get",
  "subscriptionId": "SUB_789012"
}
```

---

### Listar Assinaturas

Lista todas as assinaturas.

#### Campos Disponíveis

Esta operação não requer campos adicionais.

#### Exemplo JSON

```json
{
  "resource": "subscriptions",
  "operation": "list"
}
```

---

## 📅 Pagamentos Recorrentes

### Criar Pagamento Recorrente

Cria um novo pagamento recorrente baseado em um plano.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Plano | string | ✅ Sim | ID do plano de pagamento recorrente | `"RECURRING_PLAN_123"` |
| ID do Cliente | string | ❌ Não | ID do cliente (filtro opcional) | `"CUSTOMER_456"` |

#### Exemplo JSON Completo

```json
{
  "resource": "recurringPayments",
  "operation": "create",
  "planId": "RECURRING_PLAN_123",
  "customerId": "CUSTOMER_456"
}
```

#### Exemplo JSON Mínimo (Apenas Campos Obrigatórios)

```json
{
  "resource": "recurringPayments",
  "operation": "create",
  "planId": "RECURRING_PLAN_123"
}
```

---

### Listar Pagamentos Recorrentes

Lista todos os pagamentos recorrentes, opcionalmente filtrados por cliente.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Cliente | string | ❌ Não | ID do cliente (filtro opcional) | `"CUSTOMER_456"` |

#### Exemplo JSON - Listar Todos

```json
{
  "resource": "recurringPayments",
  "operation": "list"
}
```

#### Exemplo JSON - Filtrar por Cliente

```json
{
  "resource": "recurringPayments",
  "operation": "list",
  "customerId": "CUSTOMER_456"
}
```

---

### Consultar Pagamento Recorrente

Consulta um pagamento recorrente específico.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Pagamento Recorrente | string | ✅ Sim | ID do pagamento recorrente | `"REC_PAY_789"` |
| ID do Cliente | string | ❌ Não | ID do cliente (filtro opcional) | `"CUSTOMER_456"` |

#### Exemplo JSON

```json
{
  "resource": "recurringPayments",
  "operation": "get",
  "recurringPaymentId": "REC_PAY_789",
  "customerId": "CUSTOMER_456"
}
```

---

### Cancelar Pagamento Recorrente

Cancela um pagamento recorrente.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Pagamento Recorrente | string | ✅ Sim | ID do pagamento recorrente a ser cancelado | `"REC_PAY_789"` |

#### Exemplo JSON

```json
{
  "resource": "recurringPayments",
  "operation": "cancel",
  "recurringPaymentId": "REC_PAY_789"
}
```

---

## 📋 Planos

### Criar Plano

Cria um novo plano de assinatura no Mercado Pago.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| Nome do Plano | string | ✅ Sim | Nome/descrição do plano | `"Plano Mensal Premium"` |
| Valor | number | ✅ Sim | Valor do plano em reais | `99.99` |
| Frequência | number | ✅ Sim | Frequência de cobrança (ex: 1 para mensal) | `1` |
| Tipo de Frequência | options | ✅ Sim | Tipo de frequência (dias ou meses) | `"months"` |

**Opções de Tipo de Frequência:**
- `days` - Dias
- `months` - Meses

#### Exemplo JSON Completo

```json
{
  "resource": "plans",
  "operation": "create",
  "reason": "Plano Mensal Premium",
  "amount": 99.99,
  "frequency": 1,
  "frequencyType": "months"
}
```

#### Exemplo JSON - Plano Semanal

```json
{
  "resource": "plans",
  "operation": "create",
  "reason": "Plano Semanal",
  "amount": 29.99,
  "frequency": 7,
  "frequencyType": "days"
}
```

---

### Consultar Plano

Consulta um plano específico.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Plano | string | ✅ Sim | ID do plano a ser consultado | `"PLAN_123456"` |

#### Exemplo JSON

```json
{
  "resource": "plans",
  "operation": "get",
  "planId": "PLAN_123456"
}
```

---

### Listar Planos

Lista todos os planos criados.

#### Campos Disponíveis

Esta operação não requer campos adicionais.

#### Exemplo JSON

```json
{
  "resource": "plans",
  "operation": "list"
}
```

---

### Atualizar Plano

Atualiza um plano existente.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Plano | string | ✅ Sim | ID do plano a ser atualizado | `"PLAN_123456"` |
| Nome do Plano | string | ❌ Não | Novo nome/descrição do plano | `"Plano Atualizado"` |
| Valor | number | ❌ Não | Novo valor do plano em reais | `149.99` |

**Nota**: É necessário fornecer pelo menos um campo (nome ou valor) para atualizar.

#### Exemplo JSON - Atualizar Nome e Valor

```json
{
  "resource": "plans",
  "operation": "update",
  "planId": "PLAN_123456",
  "reason": "Plano Atualizado",
  "amount": 149.99
}
```

#### Exemplo JSON - Atualizar Apenas Valor

```json
{
  "resource": "plans",
  "operation": "update",
  "planId": "PLAN_123456",
  "amount": 149.99
}
```

---

## 🔔 Webhooks

### Registrar Webhook

Registra um novo webhook para receber notificações de eventos.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| URL | string | ✅ Sim | URL que receberá as notificações do webhook | `"https://webhook.exemplo.com/notificacoes"` |
| Eventos | multiOptions | ❌ Não | Eventos para os quais o webhook será notificado | `["payment", "subscription"]` |
| Descrição | string | ❌ Não | Descrição do webhook | `"Webhook para notificações de pagamentos"` |

**Eventos Disponíveis:**
- `payment` - Notificações de pagamentos (payment.created, payment.updated)
- `subscription` - Notificações de assinaturas (subscription.created, subscription.updated)

#### Exemplo JSON Completo

```json
{
  "resource": "webhooks",
  "operation": "register",
  "url": "https://webhook.exemplo.com/notificacoes",
  "events": ["payment", "subscription"],
  "description": "Webhook para notificações de pagamentos e assinaturas"
}
```

#### Exemplo JSON Mínimo (Apenas Campos Obrigatórios)

```json
{
  "resource": "webhooks",
  "operation": "register",
  "url": "https://webhook.exemplo.com/notificacoes"
}
```

#### Exemplo JSON - Apenas Pagamentos

```json
{
  "resource": "webhooks",
  "operation": "register",
  "url": "https://webhook.exemplo.com/pagamentos",
  "events": ["payment"],
  "description": "Webhook exclusivo para pagamentos"
}
```

---

### Consultar Webhook

Consulta um webhook específico.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Webhook | string | ✅ Sim | ID do webhook a ser consultado | `"WEBHOOK_123"` |

#### Exemplo JSON

```json
{
  "resource": "webhooks",
  "operation": "get",
  "webhookId": "WEBHOOK_123"
}
```

---

### Listar Webhooks

Lista todos os webhooks registrados.

#### Campos Disponíveis

Esta operação não requer campos adicionais.

#### Exemplo JSON

```json
{
  "resource": "webhooks",
  "operation": "list"
}
```

---

### Excluir Webhook

Exclui um webhook registrado.

#### Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| ID do Webhook | string | ✅ Sim | ID do webhook a ser excluído | `"WEBHOOK_123"` |

#### Exemplo JSON

```json
{
  "resource": "webhooks",
  "operation": "delete",
  "webhookId": "WEBHOOK_123"
}
```

---

## 📝 Notas Importantes

### Formato de CPF/CNPJ

- **CPF**: Deve conter exatamente 11 dígitos numéricos (sem pontos, traços ou espaços)
  - ✅ Correto: `12345678909`
  - ❌ Incorreto: `123.456.789-09`

- **CNPJ**: Deve conter exatamente 14 dígitos numéricos (sem pontos, traços, barras ou espaços)
  - ✅ Correto: `12345678000190`
  - ❌ Incorreto: `12.345.678/0001-90`

### Formato de Datas

Todas as datas devem estar no formato ISO 8601:
- ✅ Correto: `"2024-12-31T23:59:59.000Z"`
- ✅ Correto: `"2024-01-01T00:00:00.000Z"`
- ❌ Incorreto: `"31/12/2024"`

### Valores Monetários

- Valores devem ser números decimais em reais (R$)
- Use ponto (.) como separador decimal
- ✅ Correto: `10.50`, `99.99`, `1500.00`
- ❌ Incorreto: `10,50`, `"10.50"` (string)

### URLs de Webhook

- URLs devem ser acessíveis publicamente (não localhost)
- Devem usar protocolo HTTPS (recomendado) ou HTTP
- ✅ Correto: `"https://webhook.exemplo.com/notificacoes"`
- ❌ Incorreto: `"http://localhost:3000/webhook"`

### Chave de Idempotência

- Use chaves únicas para garantir que requisições duplicadas não sejam processadas
- Recomendado: incluir timestamp ou identificador único
- Exemplo: `"IDEMP_20241230_001"` ou `"PEDIDO_12345_${timestamp}"`

---

## 🔗 Referências

- [README Principal](../README.md)
- [Documentação do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [API de Pagamentos](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post)
- [API de Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/subscriptions)
- [API de Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)

