# Webhooks para Assinaturas

Este guia explica como configurar e processar webhooks do Mercado Pago para monitorar mudanças nas assinaturas, baseado na documentação oficial.

## 📋 Índice

1. [O que são Webhooks](#o-que-são-webhooks)
2. [Eventos Disponíveis para Assinaturas](#eventos-disponíveis-para-assinaturas)
3. [Configuração](#configuração)
4. [Validação de Notificações](#validação-de-notificações)
5. [Processamento no n8n](#processamento-no-n8n)
6. [Exemplos Práticos](#exemplos-práticos)

## 🔔 O que são Webhooks

Webhooks são notificações em tempo real enviadas pelo Mercado Pago sempre que ocorre um evento relacionado às suas assinaturas. Ao invés de você ficar consultando a API constantemente, o Mercado Pago envia uma notificação para sua URL quando algo acontece.

### Vantagens

- ✅ **Tempo real**: Recebe notificações imediatamente
- ✅ **Eficiente**: Não precisa fazer polling constante
- ✅ **Confiável**: O Mercado Pago tenta reenviar se não receber confirmação
- ✅ **Seguro**: Validação via assinatura secreta

## 📨 Eventos Disponíveis para Assinaturas

### subscription_preapproval

Notifica quando uma assinatura é criada ou atualizada.

**Quando é disparado**:
- Assinatura criada
- Assinatura atualizada (status, dados do pagador, etc.)
- Assinatura pausada/retomada/cancelada

**Dados na notificação**:
```json
{
  "id": 12345,
  "live_mode": true,
  "type": "subscription_preapproval",
  "date_created": "2024-01-01T12:00:00.000-04:00",
  "user_id": 44444,
  "api_version": "v1",
  "action": "subscription.created",
  "data": {
    "id": "2c938084726fca480172750000000000"
  }
}
```

### subscription_authorized_payment

Notifica quando um pagamento recorrente de uma assinatura é criado ou atualizado.

**Quando é disparado**:
- Nova fatura gerada para a assinatura
- Fatura paga
- Fatura com problema de cobrança
- Tentativa de cobrança

**Dados na notificação**:
```json
{
  "id": 12346,
  "live_mode": true,
  "type": "subscription_authorized_payment",
  "date_created": "2024-01-01T12:00:00.000-04:00",
  "user_id": 44444,
  "api_version": "v1",
  "action": "authorized_payment.created",
  "data": {
    "id": "6114264375"
  }
}
```

### subscription_preapproval_plan

Notifica quando um plano de assinatura é criado ou atualizado.

**Quando é disparado**:
- Plano criado
- Plano atualizado
- Plano cancelado

**Dados na notificação**:
```json
{
  "id": 12347,
  "live_mode": true,
  "type": "subscription_preapproval_plan",
  "date_created": "2024-01-01T12:00:00.000-04:00",
  "user_id": 44444,
  "api_version": "v1",
  "action": "plan.created",
  "data": {
    "id": "2c938084726fca480172750000000000"
  }
}
```

## ⚙️ Configuração

### Opção 1: Configuração via "Suas Integrações" (Recomendado)

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação
3. Vá em **Webhooks > Configurar notificações**
4. Configure as URLs:
   - **URL modo teste**: Para testes com credenciais de teste
   - **URL modo produção**: Para produção com credenciais produtivas
5. Selecione os eventos:
   - ✅ Planos e assinaturas → `subscription_preapproval`
   - ✅ Planos e assinaturas → `subscription_authorized_payment`
   - ✅ Planos e assinaturas → `subscription_preapproval_plan`
6. Clique em **Salvar**
7. Copie a **assinatura secreta** gerada (você precisará dela para validar)

**⚠️ Importante**: Este método não está disponível para integrações com Assinaturas em alguns casos. Use a Opção 2 se necessário.

### Opção 2: Configuração durante a criação

Você pode configurar webhooks específicos durante a criação de assinaturas usando o campo `notification_url` no n8n (se implementado).

## 🔐 Validação de Notificações

O Mercado Pago envia uma assinatura secreta no header `x-signature` para validar que a notificação é autêntica.

### Estrutura do Header

```
x-signature: ts=1704908010,v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839
```

- `ts`: Timestamp da notificação
- `v1`: Assinatura HMAC SHA256

### Como Validar (JavaScript/Node.js)

```javascript
const crypto = require('crypto');

function validarWebhook(headers, body, secret) {
  // Extrair x-signature e x-request-id
  const xSignature = headers['x-signature'];
  const xRequestId = headers['x-request-id'];
  
  // Extrair ts e v1 do x-signature
  const parts = xSignature.split(',');
  let ts, hash;
  
  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key.trim() === 'ts') ts = value.trim();
    if (key.trim() === 'v1') hash = value.trim();
  });
  
  // Obter data.id da query string ou do body
  const dataId = body.data?.id || '';
  
  // Criar manifest string
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  
  // Calcular HMAC
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);
  const calculatedHash = hmac.digest('hex');
  
  // Comparar
  return calculatedHash === hash;
}

// Uso
const isValid = validarWebhook(req.headers, req.body, 'SUA_ASSINATURA_SECRETA');
if (!isValid) {
  return res.status(401).send('Assinatura inválida');
}
```

### Como Validar (Python)

```python
import hmac
import hashlib

def validar_webhook(headers, body, secret):
    x_signature = headers.get('x-signature')
    x_request_id = headers.get('x-request-id')
    
    # Extrair ts e v1
    parts = x_signature.split(',')
    ts = None
    hash_value = None
    
    for part in parts:
        key, value = part.split('=')
        if key.strip() == 'ts':
            ts = value.strip()
        elif key.strip() == 'v1':
            hash_value = value.strip()
    
    # Obter data.id
    data_id = body.get('data', {}).get('id', '')
    
    # Criar manifest
    manifest = f"id:{data_id};request-id:{x_request_id};ts:{ts};"
    
    # Calcular HMAC
    calculated_hash = hmac.new(
        secret.encode(),
        manifest.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return calculated_hash == hash_value
```

## 🔄 Processamento no n8n

### Criar Workflow de Webhook

1. **Criar nó Webhook**:
   - Método: POST
   - Path: `/webhook/mercadopago/assinaturas`
   - Response Mode: Respond When Last Node Finishes

2. **Adicionar nó IF** para validar assinatura:
   - Condição: Validar `x-signature`
   - Se inválido: Retornar 401

3. **Adicionar nó Switch** para processar por tipo:
   - `subscription_preapproval` → Processar assinatura
   - `subscription_authorized_payment` → Processar pagamento
   - `subscription_preapproval_plan` → Processar plano

4. **Adicionar nó Mercado Pago** para consultar detalhes:
   - Usar `data.id` da notificação
   - Consultar assinatura/pagamento/plano completo

5. **Processar conforme necessário**:
   - Atualizar banco de dados
   - Enviar email
   - Ativar/desativar acesso
   - etc.

6. **Retornar HTTP 200**:
   - O Mercado Pago espera resposta 200/201
   - Se não receber em 22 segundos, tentará reenviar

### Exemplo de Workflow no n8n

```json
{
  "nodes": [
    {
      "name": "Webhook Mercado Pago",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "mercadopago-assinaturas",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Validar Assinatura",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.headers['x-signature']}}",
              "operation": "isNotEmpty"
            }
          ]
        }
      }
    },
    {
      "name": "Processar por Tipo",
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "string": [
                  {
                    "value1": "={{$json.body.type}}",
                    "value2": "subscription_preapproval"
                  }
                ]
              },
              "renameOutput": true,
              "outputKey": "assinatura"
            },
            {
              "conditions": {
                "string": [
                  {
                    "value1": "={{$json.body.type}}",
                    "value2": "subscription_authorized_payment"
                  }
                ]
              },
              "renameOutput": true,
              "outputKey": "pagamento"
            }
          ]
        }
      }
    },
    {
      "name": "Consultar Assinatura",
      "type": "n8n-nodes-custom.mercadopago-pix-assinatura",
      "parameters": {
        "resource": "subscriptions",
        "operation": "get",
        "subscriptionId": "={{$json.body.data.id}}"
      }
    },
    {
      "name": "Responder Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "options": {
          "responseCode": 200
        }
      }
    }
  ]
}
```

## 💡 Exemplos Práticos

### Exemplo 1: Atualizar Status da Assinatura

```javascript
// No n8n, após receber webhook
const notificacao = $input.item.json.body;
const tipo = notificacao.type;
const id = notificacao.data.id;

if (tipo === 'subscription_preapproval') {
  // Consultar assinatura completa
  const assinatura = await consultarAssinatura(id);
  
  // Atualizar banco de dados
  await atualizarAssinaturaNoBanco({
    id: assinatura.id,
    status: assinatura.status,
    nextPaymentDate: assinatura.nextPaymentDate,
  });
  
  // Se status mudou para "authorized", ativar acesso
  if (assinatura.status === 'authorized') {
    await ativarAcessoUsuario(assinatura.payerEmail);
    await enviarEmailConfirmacao(assinatura.payerEmail);
  }
}
```

### Exemplo 2: Processar Pagamento Recorrente

```javascript
if (tipo === 'subscription_authorized_payment') {
  // Consultar fatura completa
  const fatura = await consultarFatura(id);
  
  // Atualizar registro de pagamento
  await registrarPagamento({
    subscriptionId: fatura.preapproval_id,
    paymentId: fatura.payment.id,
    status: fatura.payment.status,
    amount: fatura.transaction_amount,
    date: fatura.debit_date,
  });
  
  // Se pagamento aprovado
  if (fatura.payment.status === 'approved') {
    await renovarAcesso(fatura.preapproval_id);
    await enviarRecibo(fatura);
  }
  
  // Se pagamento rejeitado
  if (fatura.payment.status === 'rejected') {
    await notificarPagamentoRejeitado(fatura.preapproval_id);
  }
}
```

### Exemplo 3: Monitorar Mudanças de Status

```javascript
// Workflow no n8n que monitora todas as mudanças
const statusAnterior = await obterStatusAnterior(id);
const statusAtual = assinatura.status;

if (statusAnterior !== statusAtual) {
  // Log da mudança
  await logarMudancaStatus({
    id,
    statusAnterior,
    statusAtual,
    timestamp: new Date(),
  });
  
  // Ações específicas por status
  switch (statusAtual) {
    case 'authorized':
      await ativarAcesso(id);
      break;
    case 'paused':
      await pausarAcesso(id);
      break;
    case 'cancelled':
      await cancelarAcesso(id);
      break;
  }
}
```

## ⚠️ Importante

### Confirmação de Recebimento

- **Sempre retorne HTTP 200 ou 201** para confirmar recebimento
- O Mercado Pago aguarda até **22 segundos** pela resposta
- Se não receber confirmação, tentará reenviar a cada **15 minutos**
- Após 3 tentativas, o intervalo aumenta, mas continua tentando

### Idempotência

- Uma mesma notificação pode ser enviada múltiplas vezes
- Use o `id` da notificação para evitar processamento duplicado
- Armazene os IDs processados e verifique antes de processar

### Segurança

- **Sempre valide a assinatura** antes de processar
- **Nunca confie apenas no conteúdo** da notificação
- **Consulte a API** para obter dados completos após receber notificação
- **Use HTTPS** para suas URLs de webhook

## 🔗 Referências

- [Documentação Oficial - Webhooks](https://www.mercadopago.com.br/developers/pt/reference/webhooks/)
- [Integração Front-end + n8n](./INTEGRACAO_FRONTEND_N8N.md)
- [Guia de Campos](./GUIA_CAMPOS.md)

## 📞 Suporte

Se tiver dúvidas:
1. Consulte a documentação oficial do Mercado Pago
2. Verifique os logs do n8n
3. Use a ferramenta de simulação no painel do Mercado Pago

