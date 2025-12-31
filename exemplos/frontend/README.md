# Exemplos de Checkout Personalizado

Este diretório contém exemplos completos de checkout personalizado que integram com o n8n para processar pagamentos PIX e assinaturas via Mercado Pago.

## 📁 Arquivos

- **checkout-assinatura.html**: Checkout completo para criar assinaturas com coleta de dados do cartão via CardForm
- **checkout-pix.html**: Checkout para gerar pagamentos PIX com geração automática de QR Code

## 🚀 Como Usar

### 1. Configuração Inicial

Antes de usar os exemplos, você precisa:

1. **Obter PUBLIC_KEY do Mercado Pago**:
   - Acesse: https://www.mercadopago.com.br/developers/panel/credentials
   - Copie sua **Public Key** (chave pública)
   - ⚠️ **Nunca use a Access Token no front-end** (apenas no backend/n8n)

2. **Configurar Webhook no n8n**:
   - Crie um workflow no n8n com nó "Webhook"
   - Configure para receber POST requests
   - Copie a URL do webhook

3. **Criar Plano (para assinaturas)**:
   - Use o node n8n para criar um plano
   - Copie o ID do plano criado

### 2. Configurar checkout-assinatura.html

1. Abra `checkout-assinatura.html` em um editor
2. Localize e substitua:
   ```javascript
   const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // ← Substitua pela sua PUBLIC_KEY
   const N8N_WEBHOOK_URL = 'https://seu-n8n.com/webhook/assinatura'; // ← URL do webhook
   const PLAN_ID = 'SEU_PLANO_ID'; // ← ID do plano criado
   ```
3. Salve o arquivo
4. Abra em um navegador ou servidor web

### 3. Configurar checkout-pix.html

1. Abra `checkout-pix.html` em um editor
2. Localize e substitua:
   ```javascript
   const N8N_WEBHOOK_URL = 'https://seu-n8n.com/webhook/pix'; // ← URL do webhook
   ```
3. Salve o arquivo
4. Abra em um navegador ou servidor web

## 📋 Requisitos

### Para checkout-assinatura.html

- **MercadoPago.js**: Carregado via CDN (já incluído)
- **PUBLIC_KEY**: Chave pública do Mercado Pago
- **Webhook n8n**: Configurado para receber dados de assinatura
- **Plano**: Plano de assinatura criado no Mercado Pago

### Para checkout-pix.html

- **QRCode.js**: Biblioteca para gerar QR Code (já incluída via CDN)
- **Webhook n8n**: Configurado para receber dados de PIX

## 🔧 Configuração do n8n

### Workflow para Assinaturas

1. **Criar nó Webhook**:
   - Método: POST
   - Path: `/webhook/assinatura` (ou o que você preferir)
   - Response Mode: Respond When Last Node Finishes

2. **Adicionar nó Mercado Pago**:
   - Resource: Assinatura
   - Operation: Criar
   - Mapear campos do webhook:
     - `planId` ← `{{ $json.planId }}`
     - `payerEmail` ← `{{ $json.payerEmail }}`
     - `payerDocument` ← `{{ $json.payerDocument }}`
     - `cardTokenId` ← `{{ $json.cardTokenId }}`
     - `subscriptionStatus` ← `{{ $json.subscriptionStatus }}`

3. **Adicionar nó Respond to Webhook**:
   - Response Code: 200
   - Response Body: `{{ $json }}` (dados da assinatura criada)

### Workflow para PIX

1. **Criar nó Webhook**:
   - Método: POST
   - Path: `/webhook/pix` (ou o que você preferir)
   - Response Mode: Respond When Last Node Finishes

2. **Adicionar nó Mercado Pago**:
   - Resource: PIX
   - Operation: Criar
   - Mapear campos do webhook:
     - `amount` ← `{{ $json.amount }}`
     - `description` ← `{{ $json.description }}`
     - `payerEmail` ← `{{ $json.payerEmail }}`
     - `payerDocument` ← `{{ $json.payerDocument }}`
     - `payerName` ← `{{ $json.payerName }}`

3. **Adicionar nó Respond to Webhook**:
   - Response Code: 200
   - Response Body: `{{ $json }}` (dados do PIX criado)

## 🎨 Personalização

Os exemplos incluem estilos CSS que você pode personalizar:

- **Cores**: Altere os gradientes e cores nos estilos
- **Layout**: Modifique o layout conforme seu design
- **Campos**: Adicione ou remova campos conforme necessário
- **Validações**: Adicione validações customizadas

## 🔒 Segurança

### ⚠️ Importante

- **Nunca exponha sua Access Token** no front-end
- Use apenas a **PUBLIC_KEY** no front-end
- Sempre valide dados no backend/n8n
- Use HTTPS em produção
- Valide webhooks do Mercado Pago (veja [WEBHOOKS_ASSINATURAS.md](../../docs/WEBHOOKS_ASSINATURAS.md))

## 📚 Documentação Relacionada

- [Integração Front-end + n8n](../../docs/INTEGRACAO_FRONTEND_N8N.md)
- [Como Obter card_token_id](../../docs/COMO_OBTER_CARD_TOKEN.md)
- [Webhooks para Assinaturas](../../docs/WEBHOOKS_ASSINATURAS.md)
- [Guia de Campos](../../docs/GUIA_CAMPOS.md)

## 🐛 Troubleshooting

### Erro: "Token não foi gerado"

**Causa**: Dados do cartão inválidos ou PUBLIC_KEY incorreta

**Solução**:
- Verifique se a PUBLIC_KEY está correta
- Confirme que todos os campos do cartão estão preenchidos
- Verifique o console do navegador para erros

### Erro: "Erro ao enviar para n8n"

**Causa**: URL do webhook incorreta ou n8n não está acessível

**Solução**:
- Verifique a URL do webhook
- Confirme que o workflow do n8n está ativo
- Verifique se o n8n está acessível publicamente (ou use ngrok para desenvolvimento)

### QR Code não aparece

**Causa**: Biblioteca QRCode.js não carregou ou erro na geração

**Solução**:
- Verifique conexão com internet (biblioteca é carregada via CDN)
- Verifique console do navegador para erros
- O código PIX ainda estará disponível para copiar mesmo se o QR Code não gerar

## 📞 Suporte

Se tiver dúvidas:
1. Consulte a documentação relacionada
2. Verifique os logs do n8n
3. Verifique o console do navegador
4. Abra uma issue no GitHub do projeto

