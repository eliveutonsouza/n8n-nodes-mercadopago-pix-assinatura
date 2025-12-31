# Como Obter card_token_id

Este guia explica passo a passo como obter o `card_token_id` no front-end usando o **CardForm** do MercadoPago.js, conforme a documentação oficial do Mercado Pago.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Passo a Passo](#passo-a-passo)
4. [Exemplo Completo](#exemplo-completo)
5. [Importante sobre o Token](#importante-sobre-o-token)
6. [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O `card_token_id` é um token gerado pelo Mercado Pago que representa de forma segura os dados do cartão de crédito. Este token:

- ✅ **É gerado no front-end** usando MercadoPago.js
- ✅ **Não expõe dados sensíveis** do cartão
- ✅ **Pode ser usado apenas uma vez**
- ✅ **Expira em 7 dias**
- ✅ **É necessário para criar assinaturas com status "authorized"**

## 📦 Pré-requisitos

1. **PUBLIC_KEY do Mercado Pago**
   - Acesse: https://www.mercadopago.com.br/developers/panel/credentials
   - Copie sua **Public Key** (chave pública)
   - ⚠️ **Nunca use a Access Token no front-end** (apenas no backend/n8n)

2. **Biblioteca MercadoPago.js**
   - Será carregada via CDN: `https://sdk.mercadopago.com/js/v2`

## 🚀 Passo a Passo

### Passo 1: Importar MercadoPago.js

Adicione o script do MercadoPago.js no `<head>` ou antes do fechamento do `</body>`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Checkout Personalizado</title>
</head>
<body>
  <!-- Seu conteúdo aqui -->
  
  <!-- Importar MercadoPago.js -->
  <script src="https://sdk.mercadopago.com/js/v2"></script>
</body>
</html>
```

### Passo 2: Configurar Credenciais

Configure o MercadoPago com sua PUBLIC_KEY:

```javascript
// Substitua YOUR_PUBLIC_KEY pela sua chave pública
const mp = new MercadoPago("YOUR_PUBLIC_KEY", {
  locale: 'pt-BR' // Opcional: define o idioma
});
```

**⚠️ Importante**: Use a **PUBLIC_KEY**, não a Access Token. A Access Token deve ser usada apenas no backend/n8n.

### Passo 3: Adicionar Formulário HTML

Crie um formulário HTML com os campos necessários. O CardForm irá se conectar a esses campos:

```html
<style>
  #form-checkout {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  .container {
    height: 40px;
    display: inline-block;
    border: 1px solid rgb(118, 118, 118);
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
    width: 100%;
  }

  input, select {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  button {
    background-color: #009ee3;
    color: white;
    padding: 15px;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    cursor: pointer;
    margin-top: 20px;
  }

  button:hover {
    background-color: #0078a8;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .progress-bar {
    width: 100%;
    height: 20px;
    margin-top: 10px;
  }
</style>

<form id="form-checkout">
  <!-- Campos do cartão (serão preenchidos pelo CardForm) -->
  <div id="form-checkout__cardNumber" class="container"></div>
  <div id="form-checkout__expirationDate" class="container"></div>
  <div id="form-checkout__securityCode" class="container"></div>
  
  <!-- Campos adicionais -->
  <input 
    type="text" 
    id="form-checkout__cardholderName" 
    placeholder="Nome no cartão"
    required
  />
  
  <select id="form-checkout__issuer">
    <option value="">Selecione o banco emissor</option>
  </select>
  
  <select id="form-checkout__installments">
    <option value="">Selecione as parcelas</option>
  </select>
  
  <select id="form-checkout__identificationType">
    <option value="">Tipo de documento</option>
  </select>
  
  <input 
    type="text" 
    id="form-checkout__identificationNumber" 
    placeholder="Número do documento"
    required
  />
  
  <input 
    type="email" 
    id="form-checkout__cardholderEmail" 
    placeholder="E-mail"
    required
  />

  <button type="submit" id="form-checkout__submit">Pagar</button>
  <progress value="0" class="progress-bar" id="progress-bar">Carregando...</progress>
</form>
```

### Passo 4: Inicializar CardForm

Inicialize o CardForm relacionando os IDs dos campos do formulário:

```javascript
const cardForm = mp.cardForm({
  amount: "100.5", // Valor da transação (opcional para assinaturas)
  iframe: true, // Usa iframe para maior segurança
  form: {
    id: "form-checkout",
    cardNumber: {
      id: "form-checkout__cardNumber",
      placeholder: "Número do cartão",
    },
    expirationDate: {
      id: "form-checkout__expirationDate",
      placeholder: "MM/YY",
    },
    securityCode: {
      id: "form-checkout__securityCode",
      placeholder: "Código de segurança",
    },
    cardholderName: {
      id: "form-checkout__cardholderName",
      placeholder: "Titular do cartão",
    },
    issuer: {
      id: "form-checkout__issuer",
      placeholder: "Banco emissor",
    },
    installments: {
      id: "form-checkout__installments",
      placeholder: "Parcelas",
    },
    identificationType: {
      id: "form-checkout__identificationType",
      placeholder: "Tipo de documento",
    },
    identificationNumber: {
      id: "form-checkout__identificationNumber",
      placeholder: "Número do documento",
    },
    cardholderEmail: {
      id: "form-checkout__cardholderEmail",
      placeholder: "E-mail",
    },
  },
  callbacks: {
    onFormMounted: error => {
      if (error) {
        console.error("Erro ao montar formulário:", error);
        return;
      }
      console.log("Formulário montado com sucesso");
    },
    onSubmit: event => {
      event.preventDefault();

      // Obter dados do formulário, incluindo o token
      const {
        paymentMethodId: payment_method_id,
        issuerId: issuer_id,
        cardholderEmail: email,
        amount,
        token, // ← Este é o card_token_id!
        installments,
        identificationNumber,
        identificationType,
      } = cardForm.getCardFormData();

      console.log("Token obtido:", token);

      // Agora você pode enviar o token para o n8n
      enviarTokenParaN8n({
        cardTokenId: token,
        payerEmail: email,
        payerDocument: identificationNumber,
        // ... outros dados
      });
    },
    onFetching: (resource) => {
      console.log("Buscando recurso:", resource);

      // Animar barra de progresso
      const progressBar = document.getElementById("progress-bar");
      progressBar.removeAttribute("value");

      return () => {
        progressBar.setAttribute("value", "0");
      };
    }
  },
});
```

### Passo 5: Enviar Token para n8n

Após obter o token, envie-o para o n8n junto com os outros dados:

```javascript
async function enviarTokenParaN8n(dados) {
  const webhookUrl = 'https://seu-n8n.com/webhook/assinatura';
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resource: 'subscriptions',
        operation: 'create',
        planId: 'SEU_PLANO_ID',
        payerEmail: dados.payerEmail,
        payerDocument: dados.payerDocument,
        cardTokenId: dados.cardTokenId, // Token obtido do CardForm
        subscriptionStatus: 'authorized',
      }),
    });

    const resultado = await response.json();
    
    if (resultado.status === 'authorized') {
      alert('Assinatura criada com sucesso!');
      // Redirecionar ou atualizar UI
    } else {
      alert('Erro: ' + (resultado.error || 'Erro desconhecido'));
    }
  } catch (error) {
    console.error('Erro ao enviar para n8n:', error);
    alert('Erro ao processar pagamento. Tente novamente.');
  }
}
```

## 📝 Exemplo Completo

Aqui está um exemplo completo e funcional:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checkout - Assinatura</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    #form-checkout {
      display: flex;
      flex-direction: column;
    }
    .container {
      height: 40px;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      margin: 10px 0;
    }
    input, select {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    button {
      background-color: #009ee3;
      color: white;
      padding: 15px;
      border: none;
      border-radius: 4px;
      font-size: 18px;
      cursor: pointer;
      margin-top: 20px;
    }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <h1>Assinatura Premium</h1>
  
  <form id="form-checkout">
    <div id="form-checkout__cardNumber" class="container"></div>
    <div id="form-checkout__expirationDate" class="container"></div>
    <div id="form-checkout__securityCode" class="container"></div>
    
    <input type="text" id="form-checkout__cardholderName" placeholder="Nome no cartão" required />
    <select id="form-checkout__issuer"></select>
    <select id="form-checkout__installments"></select>
    <select id="form-checkout__identificationType"></select>
    <input type="text" id="form-checkout__identificationNumber" placeholder="CPF/CNPJ" required />
    <input type="email" id="form-checkout__cardholderEmail" placeholder="E-mail" required />

    <button type="submit" id="form-checkout__submit">Assinar</button>
  </form>

  <script src="https://sdk.mercadopago.com/js/v2"></script>
  <script>
    // Configurar MercadoPago
    const mp = new MercadoPago("YOUR_PUBLIC_KEY", {
      locale: 'pt-BR'
    });

    // Inicializar CardForm
    const cardForm = mp.cardForm({
      amount: "29.90",
      iframe: true,
      form: {
        id: "form-checkout",
        cardNumber: {
          id: "form-checkout__cardNumber",
          placeholder: "Número do cartão",
        },
        expirationDate: {
          id: "form-checkout__expirationDate",
          placeholder: "MM/YY",
        },
        securityCode: {
          id: "form-checkout__securityCode",
          placeholder: "CVV",
        },
        cardholderName: {
          id: "form-checkout__cardholderName",
          placeholder: "Nome no cartão",
        },
        issuer: {
          id: "form-checkout__issuer",
          placeholder: "Banco emissor",
        },
        installments: {
          id: "form-checkout__installments",
          placeholder: "Parcelas",
        },
        identificationType: {
          id: "form-checkout__identificationType",
          placeholder: "Tipo de documento",
        },
        identificationNumber: {
          id: "form-checkout__identificationNumber",
          placeholder: "Número do documento",
        },
        cardholderEmail: {
          id: "form-checkout__cardholderEmail",
          placeholder: "E-mail",
        },
      },
      callbacks: {
        onFormMounted: error => {
          if (error) {
            console.error("Erro:", error);
            return;
          }
          console.log("Formulário pronto");
        },
        onSubmit: event => {
          event.preventDefault();

          const {
            token,
            cardholderEmail: email,
            identificationNumber,
          } = cardForm.getCardFormData();

          console.log("Token:", token);

          // Enviar para n8n
          fetch('https://seu-n8n.com/webhook/assinatura', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              resource: 'subscriptions',
              operation: 'create',
              planId: 'SEU_PLANO_ID',
              payerEmail: email,
              payerDocument: identificationNumber,
              cardTokenId: token,
              subscriptionStatus: 'authorized',
            }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'authorized') {
              alert('Assinatura criada com sucesso!');
            } else {
              alert('Erro: ' + (data.error || 'Erro desconhecido'));
            }
          })
          .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao processar. Tente novamente.');
          });
        },
      },
    });
  </script>
</body>
</html>
```

## ⚠️ Importante sobre o Token

### Validade e Uso

- ✅ **Pode ser usado apenas uma vez**: Após usar o token para criar uma assinatura, ele não pode ser reutilizado
- ✅ **Expira em 7 dias**: Se não usar dentro de 7 dias, o token expira
- ✅ **É seguro**: O token não contém dados sensíveis do cartão
- ✅ **É único**: Cada token é único e não pode ser adivinhado

### Armazenamento

O token também é armazenado automaticamente em um input oculto dentro do formulário com a nomenclatura `MPHiddenInputToken`. Você pode acessá-lo assim:

```javascript
const hiddenToken = document.querySelector('input[name="MPHiddenInputToken"]');
if (hiddenToken) {
  console.log('Token no input oculto:', hiddenToken.value);
}
```

Mas é recomendado usar `cardForm.getCardFormData().token` no callback `onSubmit`.

## 🔧 Troubleshooting

### O token não está sendo gerado

**Possíveis causas**:
1. PUBLIC_KEY inválida ou não configurada
2. Formulário não inicializado corretamente
3. Campos do formulário com IDs incorretos

**Solução**:
- Verifique se a PUBLIC_KEY está correta
- Confirme que todos os IDs dos campos correspondem
- Verifique o console do navegador para erros

### Erro ao enviar para n8n

**Possíveis causas**:
1. Token expirado ou já usado
2. Dados faltando no payload
3. URL do webhook incorreta

**Solução**:
- Gere um novo token
- Verifique se todos os campos obrigatórios estão sendo enviados
- Confirme a URL do webhook do n8n

### Formulário não aparece

**Possíveis causas**:
1. MercadoPago.js não carregou
2. Erro na inicialização do CardForm

**Solução**:
- Verifique se o script do MercadoPago.js está carregando
- Verifique o console do navegador
- Confirme que a PUBLIC_KEY está correta

## 🔗 Referências

- [Documentação Oficial - Checkout Transparente](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards)
- [Documentação Oficial - CardForm](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-features/card-form)
- [Integração Front-end + n8n](./INTEGRACAO_FRONTEND_N8N.md)
- [Guia de Campos](./GUIA_CAMPOS.md)

## 📞 Suporte

Se tiver dúvidas ou problemas:
1. Consulte a documentação oficial do Mercado Pago
2. Verifique os exemplos neste repositório
3. Abra uma issue no GitHub do projeto

