# 📦 Exemplos de Workflows n8n

Esta pasta contém exemplos de workflows prontos para importar no n8n, demonstrando o uso do node **Mercado Pago PIX e Assinaturas**.

## 📋 Workflows Disponíveis

### 1. Planos - Criar Plano
**Arquivo**: `05-planos-criar.json`

Workflow para criar um plano de assinatura no Mercado Pago.

**Funcionalidades:**
- Cria plano com nome, valor, frequência e tipo de frequência
- Formata resposta com ID do plano e informações
- O ID retornado pode ser usado para criar assinaturas

**Campos configurados:**
- Nome: "Plano Mensal Premium"
- Valor: R$ 99,99
- Frequência: 1 (mensal)
- Tipo: months

---

### 2. PIX - Criar Pagamento
**Arquivo**: `01-pix-criar-pagamento.json`

Workflow completo para criar um pagamento PIX com todos os campos preenchidos.

**Funcionalidades:**
- Cria pagamento PIX com valor, descrição e dados do pagador
- Inclui CPF/CNPJ, nome do pagador e referência externa
- Gera chave de idempotência automática
- Formata resposta com QR Code e informações do pagamento

**Campos configurados:**
- Valor: R$ 10,50
- Descrição: "Pagamento de teste - Pedido #12345"
- E-mail: cliente@exemplo.com
- CPF: 12345678909
- Nome: João Silva
- Referência Externa: PEDIDO_12345

---

### 3. Assinaturas - Criar Assinatura
**Arquivo**: `02-assinaturas-criar.json`

Workflow para criar uma nova assinatura baseada em um plano existente.

**Funcionalidades:**
- Cria assinatura com plano específico
- Configura período de trial (7 dias)
- Define data de início
- Formata resposta com ID da assinatura e link de pagamento

**Campos configurados:**
- ID do Plano: PLAN_123456
- E-mail: cliente@exemplo.com
- CPF: 12345678909
- Período de Trial: 7 dias
- Data de Início: Data atual

---

### 4. Pagamentos Recorrentes - Criar
**Arquivo**: `03-pagamentos-recorrentes-criar.json`

Workflow para criar um pagamento recorrente.

**Funcionalidades:**
- Cria pagamento recorrente baseado em plano
- Associa a um cliente específico
- Formata resposta com informações do pagamento recorrente

**Campos configurados:**
- ID do Plano: RECURRING_PLAN_123
- ID do Cliente: CUSTOMER_456

---

### 5. Webhooks - Registrar
**Arquivo**: `04-webhooks-registrar.json`

Workflow para registrar um novo webhook para receber notificações.

**Funcionalidades:**
- Registra webhook com URL específica
- Configura eventos para receber (pagamentos e assinaturas)
- Adiciona descrição do webhook
- Formata resposta com informações do webhook registrado

**Campos configurados:**
- URL: https://webhook.exemplo.com/notificacoes
- Eventos: payment, subscription
- Descrição: "Webhook para notificações de pagamentos e assinaturas"

---

## 🚀 Como Usar

### 1. Importar Workflow no n8n

1. Abra o n8n
2. Clique em **Workflows** → **Import from File**
3. Selecione o arquivo JSON desejado
4. O workflow será importado com todos os nodes configurados

### 2. Configurar Credenciais

⚠️ **Importante**: Após importar, você precisa configurar as credenciais da API do Mercado Pago:

1. Clique no node **Mercado Pago**
2. Em **Credential**, clique em **Create New Credential**
3. Selecione **Pix Payment API**
4. Preencha:
   - **Access Token**: Seu token de acesso do Mercado Pago
   - **Environment**: Sandbox ou Production
   - **Client ID**: (Opcional)
   - **Client Secret**: (Opcional)
5. Salve a credencial

### 3. Ajustar Valores (Opcional)

Você pode modificar os valores de exemplo nos nodes:
- Valores monetários
- E-mails e documentos
- IDs de planos e assinaturas
- URLs de webhooks

### 4. Executar Workflow

1. Clique no botão **Execute Workflow** ou use o trigger manual
2. Verifique os resultados em cada node
3. Os dados formatados estarão disponíveis no último node

---

## 📝 Notas Importantes

### Valores de Exemplo

Todos os workflows usam valores de exemplo genéricos:
- **E-mails**: `cliente@exemplo.com`
- **CPF**: `12345678909`
- **Valores**: R$ 10,50
- **IDs**: `PLAN_123`, `SUB_456`, etc.

⚠️ **Substitua esses valores pelos dados reais antes de usar em produção!**

### Credenciais

- As credenciais não são incluídas nos workflows por segurança
- Você precisa criar e configurar as credenciais após importar
- Use credenciais de **Sandbox** para testes
- Use credenciais de **Production** apenas em ambiente de produção

### Ambiente

- Para testes, use o ambiente **Sandbox** do Mercado Pago
- Obtenha credenciais de teste em: https://www.mercadopago.com.br/developers/panel/credentials
- Para produção, use credenciais reais do ambiente **Production**

---

## 🔗 Referências

- [Guia Completo de Campos](../docs/GUIA_CAMPOS.md)
- [README Principal](../README.md)
- [Documentação do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)

---

## 💡 Dicas

1. **Teste primeiro no Sandbox**: Sempre teste os workflows no ambiente sandbox antes de usar em produção
2. **Valide os dados**: Verifique se os valores estão corretos antes de executar
3. **Monitore as respostas**: Use o node "Formatar Resposta" para ver os dados retornados
4. **Personalize conforme necessário**: Adapte os workflows às suas necessidades específicas

---

## 🐛 Solução de Problemas

### Erro: "Credential not found"
- Certifique-se de criar e configurar a credencial **Pix Payment API** antes de executar

### Erro: "Invalid credentials"
- Verifique se o Access Token está correto
- Confirme se está usando o ambiente correto (Sandbox/Production)

### Erro: "Invalid parameter"
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme se os formatos estão corretos (CPF sem pontos, valores numéricos, etc.)

---

**Criado por**: Eliveuton Souza  
**Versão**: 1.0.1

