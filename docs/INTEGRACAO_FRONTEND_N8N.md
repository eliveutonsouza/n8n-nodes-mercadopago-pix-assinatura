# Integração Front-end Personalizado + n8n

Este guia explica como integrar um checkout personalizado no seu front-end com o node n8n do Mercado Pago, permitindo que você tenha controle total sobre o design e a experiência do usuário, enquanto o n8n processa os pagamentos e assinaturas.

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Fluxo de Integração](#fluxo-de-integração)
3. [Dados a Coletar no Front-end](#dados-a-coletar-no-front-end)
4. [Como Enviar Dados para n8n](#como-enviar-dados-para-n8n)
5. [Tratamento de Respostas](#tratamento-de-respostas)
6. [Exemplos Práticos](#exemplos-práticos)

## 🏗️ Arquitetura

```
┌─────────────────┐         ┌──────────────┐         ┌──────────────────┐
│   Front-end     │────────▶│     n8n      │────────▶│  Mercado Pago    │
│  (Seu Site)     │  HTTP   │   (Node)     │  API    │     (API)        │
└─────────────────┘         └──────────────┘         └──────────────────┘
     │                            │                            │
     │                            │                            │
     │ Coleta dados               │ Processa                   │ Cria pagamento/
     │ - Cartão (CardForm)        │ - Valida                   │ assinatura
     │ - Pagador                  │ - Formata                  │
     │ - Plano                    │ - Envia                    │
     │                            │                            │
     │                            │                            │
     │◀───────────────────────────│                            │
     │ Recebe resposta            │                            │
     │ - QR Code (PIX)            │                            │
     │ - init_point (Assinatura)  │                            │
     │ - Status                   │                            │
```

### Componentes

- **Front-end**: Seu site/aplicação que coleta dados do usuário
- **n8n**: Processa os dados e faz chamadas à API do Mercado Pago
- **Mercado Pago API**: Cria pagamentos e assinaturas

## 🔄 Fluxo de Integração

### Para Pagamentos PIX

1. **Front-end coleta dados**:
   - Valor do pagamento
   - Descrição
   - E-mail do pagador
   - CPF/CNPJ (opcional)
   - Nome do pagador (opcional)

2. **Front-end envia para n8n**:
   - Via webhook do n8n
   - Via HTTP Request (API do n8n)
   - Via workflow do n8n

3. **n8n processa**:
   - Valida os dados
   - Cria pagamento PIX na API do Mercado Pago
   - Retorna código PIX

4. **Front-end recebe resposta**:
   - Código PIX
   - Gera QR Code
   - Exibe para o cliente

5. **Cliente paga via PIX**

### Para Assinaturas - Fluxo 1 (com card_token_id)

1. **Front-end exibe checkout personalizado**
2. **Front-end integra CardForm**:
   - Importa MercadoPago.js
   - Configura com PUBLIC_KEY
   - Inicializa CardForm
3. **Usuário preenche dados do cartão**
4. **Front-end obtém card_token_id**:
   - No callback `onSubmit` do CardForm
   - Via `cardForm.getCardFormData().token`
5. **Front-end coleta dados**:
   - `payer_email`
   - CPF/CNPJ
   - ID do plano
   - `card_token_id`
6. **Front-end envia para n8n**
7. **n8n cria assinatura** com `status: "authorized"`
8. **Front-end recebe confirmação**
9. **Webhook notifica mudanças de status**

### Para Assinaturas - Fluxo 2 (sem card_token_id)

1. **Front-end exibe checkout personalizado**
2. **Front-end coleta dados básicos**:
   - `payer_email`
   - CPF/CNPJ
   - ID do plano
3. **Front-end envia para n8n**
4. **n8n cria assinatura** com `status: "pending"`
5. **n8n retorna `init_point`** (URL de checkout)
6. **Front-end redireciona cliente** ou exibe link
7. **Cliente completa pagamento** no checkout do Mercado Pago
8. **Webhook notifica** quando assinatura muda para "authorized"

## 📝 Dados a Coletar no Front-end

### Para Pagamentos PIX

#### Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `amount` | number | Valor do pagamento em reais | `10.50` |
| `description` | string | Descrição do pagamento | `"Assinatura Premium"` |
| `payerEmail` | string | E-mail do pagador | `"cliente@exemplo.com"` |

#### Campos Opcionais

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `payerDocument` | string | CPF ou CNPJ (apenas números) | `"12345678909"` |
| `payerName` | string | Nome completo do pagador | `"João Silva"` |
| `expirationDate` | string | Data de expiração (ISO 8601) | `"2024-12-31T23:59:59.000Z"` |
| `externalReference` | string | Referência externa | `"PEDIDO_12345"` |
| `idempotencyKey` | string | Chave de idempotência | `"IDEMP_20241230_001"` |

### Para Assinaturas

#### Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `planId` | string | ID do plano de assinatura | `"2c938084726fca480172750000000000"` |
| `payerEmail` | string | E-mail do pagador | `"cliente@exemplo.com"` |

#### Campos Opcionais (mas recomendados)

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `cardTokenId` | string | Token do cartão (obtido via CardForm) | `"e3ed6f098462036dd2cbabe314b9de2a"` |
| `payerDocument` | string | CPF ou CNPJ (apenas números) | `"12345678909"` |
| `subscriptionStatus` | string | Status da assinatura: "pending" ou "authorized" | `"authorized"` |
| `startDate` | string | Data de início (ISO 8601) | `"2024-01-01T00:00:00.000Z"` |
| `trialPeriodDays` | number | Período de trial em dias | `7` |

**Importante sobre `cardTokenId`**:
- Se fornecido: assinatura é criada com `status: "authorized"` (ativada imediatamente)
- Se não fornecido: assinatura é criada com `status: "pending"` e retorna `init_point` para checkout

## 🚀 Como Enviar Dados para n8n

### Opção 1: Via Webhook do n8n

O n8n permite criar workflows que são acionados via webhook HTTP.

1. **Crie um workflow no n8n** com um nó "Webhook"
2. **Configure o webhook** para receber POST requests
3. **Adicione o node Mercado Pago** após o webhook
4. **Configure o node** para usar os dados recebidos do webhook
5. **Obtenha a URL do webhook** do n8n
6. **Envie dados do front-end** para essa URL

**Exemplo de código JavaScript no front-end**:

```javascript
async function enviarParaN8n(dados) {
  const webhookUrl = 'https://seu-n8n.com/webhook/assinatura';
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });
  
  const resultado = await response.json();
  return resultado;
}

// Exemplo de uso para PIX
const dadosPix = {
  resource: 'pix',
  operation: 'create',
  amount: 10.50,
  description: 'Pagamento de teste',
  payerEmail: 'cliente@exemplo.com',
  payerDocument: '12345678909',
  payerName: 'João Silva',
};

const resultado = await enviarParaN8n(dadosPix);
console.log('QR Code:', resultado.qrCode);
```

### Opção 2: Via HTTP Request (API do n8n)

Se você tiver acesso à API do n8n, pode executar workflows diretamente.

**Exemplo**:

```javascript
async function executarWorkflowN8n(dados) {
  const apiUrl = 'https://seu-n8n.com/api/v1/workflows/WORKFLOW_ID/execute';
  const apiKey = 'SUA_API_KEY';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': apiKey,
    },
    body: JSON.stringify({
      data: [dados],
    }),
  });
  
  return await response.json();
}
```

### Opção 3: Via Workflow Manual

Você pode criar workflows no n8n que são executados manualmente ou agendados, e passar os dados através de nós anteriores.

## 📨 Tratamento de Respostas

### Resposta de Pagamento PIX

```json
{
  "id": "123456789",
  "status": "pending",
  "amount": 10.50,
  "currency": "BRL",
  "qrCode": "00020126580014BR.GOV.BCB.PIX...",
  "qrCodeBase64": "data:image/png;base64,iVBORw0KG...",
  "description": "Pagamento de teste",
  "payerEmail": "cliente@exemplo.com",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**O que fazer**:
1. Use `qrCode` para gerar QR Code visual
2. Use `qrCodeBase64` se já vier como imagem
3. Exiba o QR Code para o cliente
4. Monitore o status via webhook ou polling

### Resposta de Assinatura (com card_token_id)

```json
{
  "id": "2c938084726fca480172750000000000",
  "status": "authorized",
  "payerEmail": "cliente@exemplo.com",
  "planId": "2c938084726fca480172750000000000",
  "nextPaymentDate": "2024-02-01T00:00:00.000Z",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**O que fazer**:
1. Confirme que `status` é "authorized"
2. Exiba mensagem de sucesso
3. Ative acesso do cliente ao serviço
4. Configure webhook para monitorar mudanças

### Resposta de Assinatura (sem card_token_id)

```json
{
  "id": "2c938084726fca480172750000000000",
  "status": "pending",
  "initPoint": "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=2c938084726fca480172750000000000",
  "payerEmail": "cliente@exemplo.com",
  "planId": "2c938084726fca480172750000000000",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**O que fazer**:
1. Use `initPoint` para redirecionar o cliente
2. Ou exiba um botão/link para o cliente acessar
3. Configure webhook para ser notificado quando status mudar para "authorized"

## 💡 Exemplos Práticos

### Exemplo 1: Enviar Pagamento PIX

```javascript
// Front-end
const dadosPix = {
  resource: 'pix',
  operation: 'create',
  amount: 29.90,
  description: 'Assinatura Mensal',
  payerEmail: 'cliente@exemplo.com',
  payerDocument: '12345678909',
  payerName: 'João Silva',
  externalReference: 'PEDIDO_12345',
};

const resposta = await enviarParaN8n(dadosPix);

if (resposta.qrCode) {
  // Gerar QR Code
  const qrCodeImage = gerarQRCode(resposta.qrCode);
  document.getElementById('qr-code').appendChild(qrCodeImage);
  
  // Exibir código PIX
  document.getElementById('pix-code').textContent = resposta.qrCode;
}
```

### Exemplo 2: Criar Assinatura com card_token_id

```javascript
// Front-end - Após obter card_token_id do CardForm
const dadosAssinatura = {
  resource: 'subscriptions',
  operation: 'create',
  planId: '2c938084726fca480172750000000000',
  payerEmail: 'cliente@exemplo.com',
  payerDocument: '12345678909',
  cardTokenId: card_token_id, // Obtido do CardForm
  subscriptionStatus: 'authorized',
};

const resposta = await enviarParaN8n(dadosAssinatura);

if (resposta.status === 'authorized') {
  alert('Assinatura criada com sucesso!');
  // Ativar acesso do cliente
} else {
  alert('Erro ao criar assinatura: ' + resposta.error);
}
```

### Exemplo 3: Criar Assinatura sem card_token_id

```javascript
// Front-end
const dadosAssinatura = {
  resource: 'subscriptions',
  operation: 'create',
  planId: '2c938084726fca480172750000000000',
  payerEmail: 'cliente@exemplo.com',
  payerDocument: '12345678909',
  // Não enviar cardTokenId
  subscriptionStatus: 'pending',
};

const resposta = await enviarParaN8n(dadosAssinatura);

if (resposta.initPoint) {
  // Opção 1: Redirecionar automaticamente
  window.location.href = resposta.initPoint;
  
  // Opção 2: Exibir botão
  const botao = document.createElement('button');
  botao.textContent = 'Completar Pagamento';
  botao.onclick = () => window.open(resposta.initPoint, '_blank');
  document.body.appendChild(botao);
}
```

## 🔗 Referências

- [Documentação Oficial - Assinaturas](https://www.mercadopago.com.br/developers/pt/reference/subscriptions/)
- [Documentação Oficial - Checkout Transparente](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards)
- [Como Obter card_token_id](./COMO_OBTER_CARD_TOKEN.md)
- [Guia de Campos](./GUIA_CAMPOS.md)
- [Webhooks para Assinaturas](./WEBHOOKS_ASSINATURAS.md)

## ❓ Dúvidas Frequentes

### Posso coletar dados do cartão diretamente no n8n?

**Não recomendado**. Por questões de segurança PCI, os dados do cartão devem ser coletados no front-end usando o CardForm do MercadoPago.js. O n8n recebe apenas o `card_token_id` já tokenizado.

### O que acontece se eu não enviar card_token_id?

A assinatura será criada com `status: "pending"` e você receberá um `init_point` (URL) para o cliente completar o pagamento no checkout do Mercado Pago.

### Como monitorar mudanças de status?

Configure webhooks no Mercado Pago para receber notificações quando o status da assinatura mudar. Veja [Webhooks para Assinaturas](./WEBHOOKS_ASSINATURAS.md).

### O card_token_id expira?

Sim, o token expira em 7 dias e pode ser usado apenas uma vez. Se precisar criar outra assinatura, gere um novo token.

