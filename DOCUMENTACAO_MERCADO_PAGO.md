# Documentação do Mercado Pago

referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/

## Assinaturas

### Criar uma assinatura:

Criar assinatura
Uma assinatura é a união entre um plano e um cliente. Sua característica principal é ter um meio de pagamento configurado que servirá como base para criar faturas. Também é possível criar assinaturas sem plano

POST

https://api.mercadopago.com/preapproval
Copiar
Request parameters
Body

Obrigatório

Opcional
preapproval_plan_id
string
Identificador único do plano de assinatura. Este é um campo opcional. Nosso modelo suporta a criação de assinaturas com ou sem plano associado. Se você criar uma assinatura com plano, usaremos as configurações recorrentes do plano para criar a assinatura. Quando você editar o plano, atualizaremos as assinaturas. Escolha o melhor modelo dependendo do seu negócio.
2c938084726fca480172750000000000
reason
string
É uma breve descrição que o assinante verá durante o processo de checkout e nas notificações. É obrigatório apenas para assinaturas sem plano associado.
Yoga classes
external_reference
string
Referência para sincronizar com seu sistema. Este é um campo de texto livre que ajudará na integração com as entidades. Este campo é obrigatório apenas para assinaturas sem plano associado.
YG-1234
payer_email
string
OBRIGATÓRIO

Para criar uma assinatura, é necessário vinculá-la a um e-mail. Isso permite obter um identificador único para identificar o assinante. No caso de assinaturas sem plano associado, durante o processo de pagamento, validamos se o e-mail fornecido corresponde ao utilizado pelo pagador. Se essa validação não for bem-sucedida, o pagamento será recusado.
test_user@testuser.com
card_token_id
string
OBRIGATÓRIO

O card_token_id é um token gerado a partir do envio do formulário com a captura dos dados para pagamento. Ao enviar o formulário, um token é gerado representando de forma segura os dados do cartão. Para obter o card_token_id, veja a seção "Cartão", da documentação Checkout Transparente e siga todas as etapas até a seção "Inicializar formulário de pagamento". É por meio deste formulário que será possível obter o card_token_id.
e3ed6f098462036dd2cbabe314b9de2a
auto_recurring
object
Configuração de recorrência.

Mostrar atributos
frequency
number
OBRIGATÓRIO

Indica o valor de frequência. Junto com o frequency_type, define o ciclo de faturamento que uma assinaturá terá.
frequency_type
string
OBRIGATÓRIO

Indica o valor de frequência. Junto com o frequency, define o ciclo de faturamento que uma assinaturá terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
start_date
string
Data que indica o momento em que a assinatura será ativada e começará a cobrança das faturas. É importante frisar que este campo somente funciona em conjunto com o parâmetro `end_date`, ou seja, se `end_date` não for preenchido, a `start_date` não será reconhecida.
end_date
string
Data que indica o fim da assinatura e o momento em que a cobrança não será mais realizada.
transaction_amount
number
Valor que será cobrado em cada fatura.
currency_id
string
OBRIGATÓRIO

Identificador da moeda utilizada no pagamento.
ARS: Peso argentino.
BRL: Real brasileiro.
CLP: Peso chileno.
MXN: Peso mexicano.
COP: Peso colombiano.
PEN: Sol peruano.
UYU: Peso uruguaio.
back_url
string
OBRIGATÓRIO

URL de retorno de sucesso. Use esta configuração para redirecionar o cliente para seu site após o checkout. É obrigatório apenas para assinaturas sem plano associado.
https://www.mercadopago.com.ar
status
string
Quando você cria uma assinatura, pode fazê-la com pagamento pending ou authorized. Status Authorized requer que você indique um meio de pagamento. Uma assinatura com pagamento pending fica aguardando por um meio de pagamento, até que o cliente acesse o checkout ou através da integtração tokenizando um cartão e adicionando-o à assinatura.
pending: Assinatura sem método de pagamento.
authorized: Assinatura com método de pagamento.

authorized

Ocultar parâmetros
Response parameters
Erros
400Erro

400

Bad-Request

401Erro

401

Unauthorized

403Erro

403

Forbidden

Request:

curl -X POST \
 'https://api.mercadopago.com/preapproval'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \
 -d '{
"preapproval_plan_id": "2c938084726fca480172750000000000",
"reason": "Yoga classes",
"external_reference": "YG-1234",
"payer_email": "test_user@testuser.com",
"card_token_id": "e3ed6f098462036dd2cbabe314b9de2a",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"start_date": "2020-06-02T13:07:14.260Z",
"end_date": "2022-07-20T15:59:52.581Z",
"transaction_amount": 10,
"currency_id": "ARS"
},
"back_url": "https://www.mercadopago.com.ar",
"status": "authorized"
}'

response:

{
"id": "2c938084726fca480172750000000000",
"version": 0,
"application_id": 1234567812345678,
"collector_id": 100200300,
"preapproval_plan_id": "2c938084726fca480172750000000000",
"reason": "Yoga classes.",
"external_reference": 23546246234,
"back_url": "https://www.mercadopago.com.ar",
"init_point": "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_id=2c938084726fca480172750000000000",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"start_date": "2020-06-02T13:07:14.260Z",
"end_date": "2022-07-20T15:59:52.581Z",
"currency_id": "ARS",
"transaction_amount": 10,
"free_trial": {
"frequency": 1,
"frequency_type": "months"
}
},
"payer_id": 123123123,
"card_id": 123123123,
"payment_method_id": 123123123,
"next_payment_date": "2022-01-01T11:12:25.892-04:00",
"date_created": "2022-01-01T11:12:25.892-04:00",
"last_modified": "2022-01-01T11:12:25.892-04:00",
"status": "pending"
}

---

### Buscar assinaturas

Buscar assinaturas utilizando diferentes parâmetros

GET

https://api.mercadopago.com/preapproval/search
Copiar
Request parameters
Path

Obrigatório

Opcional
q
string
Campo de busca livre.
Plan gold
payer_id
number
Customer ID único para encontrar assinaturas relacionadas.
123123123
payer_email
string
Permite encontrar assinaturas registradas com este e-mail.
test_1234@testuser.com
preapproval_plan_id
string
Especifica um plan ID para filtrar os resultados da pesquisa.
2c938084726fca480172750000000000
transaction_amount
number
Especifica um valor de assinatura para filtrar os resultados da pesquisa.
1000
semaphore
string
Especifica o status de controle da assinatura.
green
status
string
Especifica um status para filtrar os resultados da exportação. Pode ser null, um ou muitos.
authorized,cancelled,paused
sort
string
Especifica o tipo de classificação selecionado para recuperar as assinaturas. Você deve indicar um campo e um tipo de classificação com o seguinte formato field_name:sort_type.
payer_id:asc
offset
number
Especifica o offset do primeiro item da cobrança a ser retornado.
20
limit
number
Especifica o número máximo de itens a serem retornados.
20

Ocultar parâmetros
Response parameters
Erros
400Erro

400

Bad request

401Erro

401

Unauthorized

500Erro

500

Error

request:

curl -X GET \
 'https://api.mercadopago.com/preapproval/search'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \

response:
{
"paging": {
"offset": 0,
"limit": 20,
"total": 100
},
"results": [
{
"id": "2c938084726fca480172750000000000",
"version": 0,
"application_id": 1234567812345678,
"collector_id": 100200300,
"preapproval_plan_id": "2c938084726fca480172750000000000",
"reason": "Yoga classes.",
"external_reference": 23546246234,
"back_url": "https://www.mercadopago.com.ar",
"init_point": "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_id=2c938084726fca480172750000000000",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"start_date": "2020-06-02T13:07:14.260Z",
"end_date": "2022-07-20T15:59:52.581Z",
"currency_id": "ARS",
"transaction_amount": 10,
"free_trial": {
"frequency": 1,
"frequency_type": "months"
}
},
"first_invoice_offset": 7,
"payer_id": 123123123,
"payer_first_name": "Jorge",
"payer_last_name": "Smith",
"card_id": 123123123,
"payment_method_id": "account_money",
"next_payment_date": "2022-01-01T11:12:25.892-04:00",
"date_created": "2022-01-01T11:12:25.892-04:00",
"last_modified": "2022-01-01T11:12:25.892-04:00",
"summarized": {
"quotas": 6,
"charged_quantity": 3,
"charged_amount": 1000,
"pending_charge_quantity": 1,
"pending_charge_amount": 200,
"last_charged_date": "2022-01-01T11:12:25.892-04:00",
"last_charged_amount": 100,
"semaphore": "green"
},
"status": "pending"
}
]
}

---

### Obter assinatura

Obter todas as informações de uma assinatura a partir de seu ID

GET

https://api.mercadopago.com/preapproval/{id}
Copiar
Request parameters
Path

Obrigatório

Opcional
id
string
OBRIGATÓRIO

Identificador de assinatura.
2c938084726fca480172750000000000
Response parameters
id
string
Identificador único de assinatura.
version
number
Indica quantas vezes uma assinatura foi modificada.
application_id
number
ID único que identifica sua aplicação/integração. Uma das chaves do par que compõe as credenciais que identifica uma aplicação/integração na sua conta.
collector_id
number
ID único que identifica seu usuário como vendedor. Este ID corresponde ao seu User ID em nosso ecossistema.
preapproval_plan_id
string
Identificador único de plano de assinatura. Este parâmetro só está disponível quando se trata de uma assinatura com um plano associado e indica a partir de qual plano a assinatura foi criada.
reason
string
É uma breve descrição que o assinante verá durante o processo de checkout e nas notificações. É obrigatório apenas para assinaturas sem plano associado.
external_reference
string
Referência para sincronizar com seu sistema. Este é um campo de texto livre para ajudar com a integração para vincular as entidades.
back_url
string
URL de retorno de sucesso. Use esta configuração para redirecionar seus clientes para o seu site após o checkout.
init_point
string
URL para o checkout para adicionar ou modificar um meio de pagamento.
auto_recurring
object
Configuração da data para recorrência.

Mostrar atributos
frequency
number
Indica o valor de frequência. Junto com frequency_type define o ciclo de cobrança que a assinaturá terá.
frequency_type
string
Indica o tipo de frequência. Junto com frequency, definem o ciclo de cobrança que a assinatura terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
start_date
string
Data que indica o momento em que a assinatura será ativada e começará a cobrança das faturas.
end_date
string
Data que indica o fim da assinatura e o momento em que a cobrança não será mais realizada.
currency_id
string
Identificador da moeda utilizada no pagamento.
ARS: Peso argentino.
BRL: Real brasileiro.
CLP: Peso chileno.
MXN: Peso mexicano.
COP: Peso colombiano.
PEN: Sol peruano.
UYU: Peso uruguaio.
transaction_amount
number
Valor que será cobrado em cada fatura.
free_trial
object
Informação de teste grátis.

Mostrar atributos
frequency
number
Indica o valor de frequência. Junto com frequency_type define o ciclo de cobrança que a assinaturá terá.
frequency_type
string
Indica o tipo de frequência. Junto com frequency, definem o ciclo de cobrança que a assinatura terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
first_invoice_offset
number
Número de dias para cobrar a primeira fatura.
payer_id
number
Identificador único do cliente. É criado a partir do e-mail utilizado para criar a assinatura.
card_id
number
Identificador único para recuperar dados do cartão utilizado como meio de pagamento.
payment_method_id
string
Meio de pagamento configurado.
next_payment_date
string
Data do próximo débito.
date_created
string
Data de criação.
last_modified
string
Data da última modificação.
summarized
object
Informações resumidas sobre faturas e cobranças de assinatura.

Mostrar atributos
quotas
number
Quantos pagamentos serão feitos.
charged_quantity
number
Total cobrado de parcelas.
charged_amount
number
Valor total cobrado até o momento.
pending_charge_quantity
number
Parcelas pendentes a serem cobradas.
pending_charge_amount
number
Valor pendente de cobrança.
last_charged_date
number
Data da última cobrança.
last_charged_amount
number
Data do último valor cobrado.
semaphore
number
Resumo do status de cobrança de assinaturas.
green: Todas as cobranças feitas.
yellow: Com problemas de cobranças. Estamos tentando cobrar uma fatura.
red: Com cobranças pendentes. Uma fatura não foi cobrada.
blank: Cobrança com desconto.
status
string
Status
pending: Assinatura sem um meio de pagamento.
authorized: Assinatura com um meio de pagamento válido.
paused: Assinatura com cobrança de pagamentos temporariamente descontinuada.
cancelled: Assinatura finalizada. Este status é irreversível.

Ocultar parâmetros
Erros
400Erro

403Erro

404Erro

500Erro

request:
curl -X GET \
 'https://api.mercadopago.com/preapproval/2c938084726fca480172750000000000'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \

response:
{
"id": "2c938084726fca480172750000000000",
"version": 0,
"application_id": 1234567812345678,
"collector_id": 100200300,
"preapproval_plan_id": "2c938084726fca480172750000000000",
"reason": "Yoga classes.",
"external_reference": 23546246234,
"back_url": "https://www.mercadopago.com.ar",
"init_point": "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_id=2c938084726fca480172750000000000",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"start_date": "2020-06-02T13:07:14.260Z",
"end_date": "2022-07-20T15:59:52.581Z",
"currency_id": "ARS",
"transaction_amount": 10,
"free_trial": {
"frequency": 1,
"frequency_type": "months"
}
},
"first_invoice_offset": 7,
"payer_id": 123123123,
"card_id": 123123123,
"payment_method_id": "account_money",
"next_payment_date": "2022-01-01T11:12:25.892-04:00",
"date_created": "2022-01-01T11:12:25.892-04:00",
"last_modified": "2022-01-01T11:12:25.892-04:00",
"summarized": {
"quotas": 6,
"charged_quantity": 3,
"charged_amount": 1000,
"pending_charge_quantity": 1,
"pending_charge_amount": 200,
"last_charged_date": "2022-01-01T11:12:25.892-04:00",
"last_charged_amount": 100,
"semaphore": "green"
},
"status": "pending"
}

---

### Atualizar assinatura

Renove os dados de uma assinatura. Indique o ID da assinatura e envie o body com as informações que deseja atualizar. Você pode atualizar o motivo, valor, forma de pagamento, status e outras informações que compõem a assinatura

PUT

https://api.mercadopago.com/preapproval/{id}
Copiar
Request parameters
Path

Obrigatório

Opcional
id
string
OBRIGATÓRIO

Identificador de assinatura exclusivo que deseja modificar.
2c938084726fca480172750000000000
Body

Obrigatório

Opcional
reason
string
É uma breve descrição que o assinante verá durante o processo de checkout e nas notificações. É obrigatório apenas para assinaturas sem plano associado.
Yoga classes.
external_reference
string
Referência para sincronizar com seu sistema. Este é um campo de texto livre para ajudar com a integração para vincular as entidades.
23546246234
back_url
string
URL de retorno de sucesso. Use esta configuração para redirecionar seus clientes ao seu site após o checkout.
https://www.mercadopago.com.ar
auto_recurring
object
Configuração da data para recorrência.

Mostrar atributos
transaction_amount
number
Valor que será cobrado em cada fatura.
currency_id
string
Identificador da moeda utilizada no pagamento.
ARS: Peso argentino.
BRL: Real brasileiro.
CLP: Peso chileno.
MXN: Peso mexicano.
COP: Peso colombiano.
PEN: Sol peruano.
UYU: Peso uruguaio.
card_token_id
number
Identificador único para recuperar dados do cartão utilizado como meio de pagamento.
123123123
card_token_id_secondary
number
Identificador único para recuperar dados do cartão utilizado como meio de pagamento secundário. Este parâmetro deve ser utilizado em conjunto com payment_method_id_secondary e é obrigatório para meios de pagamento com cartão.
123123123
payment_method_id_secondary
string
Identificador do meio de pagamento secundário.
visa
status
string
Status
pending: Assinatura sem um meio de pagamento.
authorized: Assinatura com um meio de pagamento válido.
paused: Assinatura com cobrança de pagamentos temporariamente descontinuada.
cancelled: Assinatura finalizada. Este status é irreversível.

pending

Ocultar parâmetros
Response parameters
Erros
400Erro

400

Bad-request

401Erro

401

Unauthorized

500Erro

500

request:

curl -X PUT \
 'https://api.mercadopago.com/preapproval/2c938084726fca480172750000000000'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \
 -d '{
"reason": "Yoga classes.",
"external_reference": 23546246234,
"back_url": "https://www.mercadopago.com.ar",
"auto_recurring": {
"transaction_amount": 10,
"currency_id": "ARS"
},
"card_token_id": 123123123,
"card_token_id_secondary": 123123123,
"payment_method_id_secondary": "visa",
"status": "pending"
}'

response:

{
"id": "2c938084726fca480172750000000000",
"version": 0,
"application_id": 1234567812345678,
"collector_id": 100200300,
"preapproval_plan_id": "2c938084726fca480172750000000000",
"reason": "Yoga classes.",
"external_reference": 23546246234,
"back_url": "https://www.mercadopago.com.ar",
"init_point": "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_id=2c938084726fca480172750000000000",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"start_date": "2020-06-02T13:07:14.260Z",
"end_date": "2022-07-20T15:59:52.581Z",
"currency_id": "ARS",
"transaction_amount": 10,
"free_trial": {
"frequency": 1,
"frequency_type": "months"
}
},
"first_invoice_offset": 7,
"payer_id": 123123123,
"card_id": 123123123,
"payment_method_id": "account_money",
"card_id_secondary": 123123123,
"payment_method_id_secondary": "visa",
"next_payment_date": "2022-01-01T11:12:25.892-04:00",
"date_created": "2022-01-01T11:12:25.892-04:00",
"last_modified": "2022-01-01T11:12:25.892-04:00",
"summarized": {
"quotas": 6,
"charged_quantity": 3,
"charged_amount": 1000,
"pending_charge_quantity": 1,
"pending_charge_amount": 200,
"last_charged_date": "2022-01-01T11:12:25.892-04:00",
"last_charged_amount": 100,
"semaphore": "green"
},
"status": "pending"
}

---

### Exportar assinaturas

Baixar um arquivo CSV com todas as assinaturas que correspondem a solicitação de busca

GET

https://api.mercadopago.com/preapproval/export
Copiar
Request parameters
Path

Obrigatório

Opcional
collector_id
number
OBRIGATÓRIO

ID do collector solicitando a assinatura.
38524206
preapproval_plan_id
string
Especifica um Plan ID para filtrar os resultados da exportação.
2c938084726fca480172750000000000
status
string
Especifica um Plan ID para filtrar os resultados da exportação. Pode ser null, um ou mais do que um.
authorized,cancelled,paused
sort
string
Especifica o tipo de classificação selecionado para recuperar as assinaturas. Você deve indicar um campo e um tipo de classificação com o seguinte formato field_name:sort_type.
payer_id:asc
Response parameters
This request has no response
Erros
401Erro

401

Unauthorized

500Erro

500

Error

request:

curl -X GET \
 'https://api.mercadopago.com/preapproval/export'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \

response:

{}

---

## Planos

### Criar um plano de assinatura

Um plano é um template para criar assinaturas que informa a frequência e valor que deverão ser cobrados dos seus clientes. Planos podem ser criados com testes grátis, ciclos de cobrança, entre outros. As assinaturas criadas a partir de um plano são relacioadas a ele e permitem sincronizar informações como reason e amount

POST

https://api.mercadopago.com/preapproval_plan
Copiar
Request parameters
Body

Obrigatório

Opcional
reason
string
OBRIGATÓRIO

É uma breve descrição que o assinante verá durante o processo de checkout e nas notificações.
Yoga classes
auto_recurring
object
Configuração da data para recorrência.

Mostrar atributos
frequency
number
OBRIGATÓRIO

Indica o valor de frequência. Junto com frequency_type define o ciclo de cobrança que a assinaturá terá.
frequency_type
string
OBRIGATÓRIO

Indica o tipo de frequência. Junto com frequency, definem o ciclo de cobrança que a assinatura terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
repetitions
number
É opcional e utilizado para criar uma assinatura limitada. Indica o número de itens que serão repetidos no ciclo de recorrência. Se este parâmetro não for definido, a assinatura não será finaliza até que uma das partes cancele.
billing_day
number
Dia do mês que a assinatura será comprada. Apenas aceita valores entre 1 e 28. Esta configuração está disponível somente para assinaturas com plano associado.
billing_day_proportional
boolean
Cobra um valor proporcional ao dia do faturamento no momento do cadastro.
true: Cobrar um valor proporcional com base nos dias restantes no próximo ciclo de faturamento. Os ciclos de faturamento são sempre calculados com base em 30 dias.
false: Cobrar o valor da assinatura independentemente de quando o cliente se inscreve no ciclo de faturamento.
free_trial
object
Informação de teste grátis.

Mostrar atributos
frequency
number
Indica o valor de frequência. Junto com frequency_type define o ciclo de cobrança que a assinaturá terá.
frequency_type
string
Indica o tipo de frequência. Junto com frequency, definem o ciclo de cobrança que a assinatura terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
transaction_amount
number
Valor que será cobrado em cada fatura.
currency_id
string
OBRIGATÓRIO

Identificador da moeda utilizada no pagamento
ARS: Peso argentino.
BRL: Real brasileiro.
CLP: Peso chileno.
MXN: Peso mexicano.
COP: Peso colombiano.
PEN: Sol peruano.
UYU: Peso uruguaio.
payment_methods_allowed
object
Meios de pagamento habilitados no checkout.

Mostrar atributos
payment_types
array
Tipos de pagamento permitidos no fluxo de pagamento.

Mostrar atributos
id
string
Identificador do tipo de pagamento.
payment_methods
array
Meios de pagamento permitidos no fluxo de pagamento.

Mostrar atributos
id
string
ID do meio de pagamento.
back_url
string
OBRIGATÓRIO

URL de retorno de sucesso. Use esta configuração para redirecionar seus clientes para o seu site após o checkout.
https://www.yoursite.com
Response parameters
id
string
Identificador único do plano de assinatura.
application_id
number
ID único que identifica sua aplicação/integração. Uma das chaves do par que compõe as credenciais que identifica uma aplicação/integração na sua conta.
collector_id
number
ID único que identifica seu usuário como vendedor. Este ID corresponde ao seu User ID em nosso ecossistema.
reason
string
É uma breve descrição que o assinante verá durante o processo de checkout e nas notificações.
auto_recurring
object
Configuração da data para recorrência.

Mostrar atributos
frequency
number
Indica o valor de frequência. Junto com o frequency_type, define o ciclo de faturamento que uma assinaturá terá.
frequency_type
string
Indica o tipo de frequência. Junto com frequency, definem o ciclo de cobrança que a assinatura terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
repetitions
number
É opcional e utilizado para criar uma assinatura limitada. Indica o número de itens que serão repetidos no ciclo de recorrência. Se este parâmetro não for definido, a assinatura não será finaliza até que uma das partes c...Ver mais
billing_day
number
Dia do mês no qual a assinatura será cobrada. Aceita apenas valores entre 1 e 28.
billing_day_proportional
boolean
Cobra um valor proporcional ao dia do faturamento no momento do cadastro.
true: Cobrar um valor proporcional com base nos dias restantes no próximo ciclo de faturamento. Os ciclos de faturamento são sempre calculados com base em 30 dias.
false: Cobrar o valor da assinatura independentemente de quando o cliente se inscreve no ciclo de faturamento.
free_trial
object
Informação de teste grátis.

Mostrar atributos
frequency
number
Indica o valor de frequência. Junto com o frequency_type, define o ciclo de faturamento que uma assinaturá terá.
frequency_type
string
Indica o valor de frequência. Junto com o frequency, define o ciclo de faturamento que uma assinaturá terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
transaction_amount
number
Valor que será cobrado em cada fatura.
currency_id
string
Identificador da moeda utilizada no pagamento.
ARS: Peso argentino.
BRL: Real brasileiro.
CLP: Peso chileno.
MXN: Peso mexicano.
COP: Peso colombiano.
PEN: Sol peruano.
UYU: Peso uruguaio.
payment_methods_allowed
object
Meios de pagamento habilitados no checkout.

Mostrar atributos
payment_types
array
Tipos de pagamento permitidos no fluxo de pagamento.

Mostrar atributos
id
string
Identificador do tipo de pagamento.
payment_methods
array
Meios de pagamento permitidos no fluxo de pagamento.

Mostrar atributos
id
string
Id do meio de pagamento.
back_url
string
URL de retorno de sucesso. Use esta configuração para redirecionar seus clientes para o seu site após o checkout.
external_reference
string
Referência para sincronizar com seu sistema. Este é um campo de texto livre para ajudar com a integração para vincular as entidades.
init_point
string
URL de checkout para adicionar um meio de pagamento.
date_created
string
Data de criação.
last_modified
string
Data da última modificação.
status
string
Status do plano.
active: Plano disponível para criar assinaturas.
cancelled: Plano indisponível para criar assinaturas.

Ocultar parâmetros
Erros
400Erro

401Erro

404Erro

500Erro

request:

curl -X POST \
 'https://api.mercadopago.com/preapproval_plan'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \
 -d '{
"reason": "Yoga classes",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"repetitions": 12,
"billing_day": 10,
"billing_day_proportional": false,
"free_trial": {
"frequency": 1,
"frequency_type": "months"
},
"transaction_amount": 10,
"currency_id": "ARS"
},
"payment_methods_allowed": {
"payment_types": [
{
"id": "credit_card"
}
],
"payment_methods": [
{
"id": "bolbradesco"
}
]
},
"back_url": "https://www.yoursite.com"
}'

response:

{
"id": "2c938084726fca480172750000000000",
"application_id": 1234567812345678,
"collector_id": 100200300,
"reason": "Yoga classes",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"repetitions": 12,
"billing_day": 10,
"billing_day_proportional": true,
"free_trial": {
"frequency": 1,
"frequency_type": "months"
},
"transaction_amount": 10,
"currency_id": "ARS"
},
"payment_methods_allowed": {
"payment_types": [
{}
],
"payment_methods": [
{}
]
},
"back_url": "https://www.mercadopago.com.ar",
"external_reference": 23546246234,
"init_point": "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084726fca480172750000000000",
"date_created": "2022-01-01T15:12:25.892Z",
"last_modified": "2022-01-01T15:12:25.892Z",
"status": "active"
}

---

### Buscar planos de assinatura

Buscar planos de assinatura a partir de diferentes parâmetros

GET

https://api.mercadopago.com/preapproval_plan/search
Copiar
Request parameters
Path

Obrigatório

Opcional
status
string
Especifica o status do plano que você deseja obter.
active
q
string
Campo de busca livre.
Plan gold
sort
string
Especifica o nome do campo pelo qual os resultados devem ser classificados de acordo com um critério.
date_created
criteria
string
Especifica o critério de ordem dos resultados.
asc
offset
number
Especifica o offset do primeiro item da cobrança a ser retornado.
20
limit
number
Especifica o número máximo de itens a serem retornados.
20

Ocultar parâmetros
Response parameters
Erros
400Erro

401Erro

500Erro

request:

curl -X GET \
 'https://api.mercadopago.com/preapproval_plan/search'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \

response:

{
"paging": {
"offset": 0,
"limit": 20,
"total": 100
},
"results": [
{
"id": "2c938084726fca480172750000000000",
"application_id": 1234567812345678,
"collector_id": 100200300,
"reason": "Yoga classes",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"repetitions": 12,
"billing_day": 10,
"billing_day_proportional": true,
"free_trial": {
"frequency": 7,
"frequency_type": "months",
"first_invoice_offset": 7
},
"transaction_amount": 10,
"currency_id": "ARS"
},
"payment_methods_allowed": {
"payment_types": [
{}
],
"payment_methods": [
{}
]
},
"back_url": "https://www.mercadopago.com.ar",
"external_reference": "23546246234",
"init_point": "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084726fca480172750000000000",
"date_created": "2022-01-01T11:12:25.892-04:00",
"last_modified": "2022-01-01T11:12:25.892-04:00",
"subscribed": 50,
"status": "active"
}
]
}

---

### Obter plano de assinatura

Obtenha todas as informações de um plano a partir de seu ID

GET

https://api.mercadopago.com/preapproval_plan/{id}
Copiar
Request parameters
Path

Obrigatório

Opcional
id
string
OBRIGATÓRIO

Identificador do plano de assinatura.
2c938084726fca480172750000000000
Response parameters
id
string
Identificador único do plano de assinatura.
application_id
number
ID único que identifica sua aplicação/integração. Uma das chaves do par que compõe as credenciais que identifica uma aplicação/integração na sua conta.
collector_id
number
ID único que identifica seu usuário como vendedor. Este ID corresponde ao seu User ID em nosso ecossistema.
reason
string
É uma breve descrição que o assinante verá durante o processo de checkout e nas notificações.
auto_recurring
object
Configuração da data para recorrência.

Mostrar atributos
frequency
number
Indica o valor de frequência. Junto com frequency_type define o ciclo de cobrança que a assinaturá terá.
frequency_type
string
Indica o tipo de frequência. Junto com frequency, definem o ciclo de cobrança que a assinatura terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
repetitions
number
É opcional e utilizado para criar uma assinatura limitada. Indica o número de itens que serão repetidos no ciclo de recorrência. Se este parâmetro não for definido, a assinatura não será finaliza até que uma das partes cancele.
billing_day
number
Dia do mês no qual a assinatura será cobrada. Aceita apenas valores entre 1 e 28.
billing_day_proportional
boolean
Cobra um valor proporcional ao dia do faturamento no momento do cadastro.
true: Cobrar um valor proporcional com base nos dias restantes no próximo ciclo de cobrança. Os ciclos de cobrança são sempre calculados com base em 30 dias.
false: Cobrar o valor da assinatura independentemente de quando o cliente se inscreve no ciclo de cobrança.
free_trial
object
Informação de teste grátis

Mostrar atributos
frequency
number
Indica o valor de frequência. Junto com frequency_type define o ciclo de cobrança que a assinaturá terá.
frequency_type
string
Indica o tipo de frequência. Junto com frequency, definem o ciclo de cobrança que a assinatura terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
first_invoice_offset
number
Número de dias para cobrar a primeira fatura.
transaction_amount
number
Valor que será cobrado em cada fatura.
currency_id
string
Identificador da moeda utilizada no pagamento.
ARS: Peso argentino.
BRL: Real brasileiro.
CLP: Peso chileno.
MXN: Peso mexicano.
COP: Peso colombiano.
PEN: Sol peruano.
UYU: Peso uruguaio.
payment_methods_allowed
object
Meios de pagamento habilitados no checkout.

Mostrar atributos
payment_types
array
Tipos de pagamento permitidos no fluxo de pagamento.

Mostrar atributos
id
string
Identificador do tipo de pagamento.
payment_methods
array
Meios de pagamento permitidos no fluxo de pagamento.

Mostrar atributos
id
string
ID do meio de pagamento.
back_url
string
URL de retorno de sucesso. Use esta configuração para redirecionar seus clientes para o seu site após o checkout.
external_reference
string
Referência para sincronizar com seu sistema. Este é um campo de texto livre para ajudar com a integração para vincular as entidades.
init_point
string
URL para iniciar o fluxo de assinatura.
date_created
string
Data de criação.
last_modified
string
Data da última modificação.
status
string
Status do plano.
active: Plano disponível para criar assinaturas.
cancelled: Plano indisponível para criar assinaturas.

Ocultar parâmetros
Erros
401Erro

404Erro

500Erro

Request

cURL
Copiar
curl -X GET \
 'https://api.mercadopago.com/preapproval_plan/2c938084726fca480172750000000000'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \

Response
Copiar
{
"id": "2c938084726fca480172750000000000",
"application_id": 1234567812345678,
"collector_id": 100200300,
"reason": "Yoga classes",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"repetitions": 12,
"billing_day": 10,
"billing_day_proportional": true,
"free_trial": {
"frequency": 7,
"frequency_type": "months",
"first_invoice_offset": 7
},
"transaction_amount": 10,
"currency_id": "ARS"
},
"payment_methods_allowed": {
"payment_types": [
{}
],
"payment_methods": [
{}
]
},
"back_url": "https://www.mercadopago.com.ar",
"external_reference": "23546246234",
"init_point": "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084726fca480172750000000000",
"date_created": "2022-01-01T11:12:25.892-04:00",
"last_modified": "2022-01-01T11:12:25.892-04:00",
"status": "active"

---

### Atualizar um plano de assinatura

Atualizar os dados de um plano. Indique o Plan ID e envie o body com as informações que deseja atualizar

PUT

https://api.mercadopago.com/preapproval_plan/{id}
Copiar
Request parameters
Path

Obrigatório

Opcional
id
string
OBRIGATÓRIO

Identificador do plano de assinatura.
2c938084726fca480172750000000000
Body

Obrigatório

Opcional
reason
string
É uma breve descrição que o assinante verá durante o processo de checkout e nas notificações.
Yoga classes
auto_recurring
object
Configuração da data para recorrência.

Mostrar atributos
frequency
number
Indica o valor de frequência. Junto com frequency_type define o ciclo de cobrança que a assinaturá terá.
frequency_type
string
OBRIGATÓRIO

Indica o tipo de frequência. Junto com frequency, definem o ciclo de cobrança que a assinatura terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
repetitions
number
É opcional e utilizado para criar uma assinatura limitada. Indica o número de itens que serão repetidos no ciclo de recorrência. Se este parâmetro não for definido, a assinatura não será finaliza até que uma das partes cancele.
billing_day
number
Dia do mês no qual a assinatura será cobrada. Aceita apenas valores entre 1 e 28.
billing_day_proportional
boolean
Cobra um valor proporcional ao dia do faturamento no momento do cadastro.
true: Cobrar um valor proporcional com base nos dias restantes no próximo ciclo de cobrança. Os ciclos de cobrança são sempre calculados com base em 30 dias.
false: Cobrar o valor da assinatura independentemente de quando o cliente se inscreve no ciclo de cobrança.
free_trial
object
Informação de teste grátis.

Mostrar atributos
frequency
number
Indica o valor de frequência. Junto com frequency_type define o ciclo de cobrança que a assinaturá terá.
frequency_type
string
OBRIGATÓRIO

Indica o tipo de frequência. Junto com frequency, definem o ciclo de cobrança que a assinatura terá.
days: Indica uma frequência em unidades de dias.
months: Indica uma frequência em unidades de meses.
transaction_amount
number
Valor que será cobrado em cada fatura.
currency_id
string
Identificador da moeda utilizada no pagamento.
ARS: Peso argentino.
BRL: Real brasileiro.
CLP: Peso chileno.
MXN: Peso mexicano.
COP: Peso colombiano.
PEN: Sol peruano.
UYU: Peso uruguaio.
payment_methods_allowed
object
Meios de pagamento habilitados no checkout.

Mostrar atributos
payment_types
array
Tipos de pagamento permitidos no fluxo de pagamento.

Mostrar atributos
id
string
Identificador do tipo de pagamento.
payment_methods
array
Meios de pagamento permitidos no fluxo de pagamento.

Mostrar atributos
id
string
ID do meio de pagamento.
back_url
string
URL de retorno de sucesso. Use esta configuração para redirecionar seus clientes para o seu site após o checkout.
https://www.yoursite.com
Response parameters
Erros
400Bad request

401Erro

404Erro

500Erro

Request

cURL
Copiar
curl -X PUT \
 'https://api.mercadopago.com/preapproval_plan/2c938084726fca480172750000000000'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \
 -d '{
"reason": "Yoga classes",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"repetitions": 12,
"billing_day": 10,
"billing_day_proportional": false,
"free_trial": {
"frequency": 1,
"frequency_type": "months"
},
"transaction_amount": 10,
"currency_id": "ARS"
},
"payment_methods_allowed": {
"payment_types": [
{
"id": "credit_card"
}
],
"payment_methods": [
{
"id": "bolbradesco"
}
]
},
"back_url": "https://www.yoursite.com"
}'
Response
Copiar
{
"id": "2c938084726fca480172750000000000",
"application_id": 1234567812345678,
"collector_id": 100200300,
"reason": "Yoga classes",
"auto_recurring": {
"frequency": 1,
"frequency_type": "months",
"repetitions": 12,
"billing_day": 10,
"billing_day_proportional": true,
"free_trial": {
"frequency": 7,
"frequency_type": "months",
"first_invoice_offset": 7
},
"transaction_amount": 10,
"currency_id": "ARS"
},
"payment_methods_allowed": {
"payment_types": [
{}
],
"payment_methods": [
{}
]
},
"back_url": "https://www.mercadopago.com.ar",
"external_reference": "23546246234",
"init_point": "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084726fca480172750000000000",
"date_created": "2022-01-01T11:12:25.892-04:00",
"last_modified": "2022-01-01T11:12:25.892-04:00",
"status": "active"
}

---

## Faturas

### Obter dados de fatura

Obtenha todas as informações de uma fatura a partir de seu ID. As faturas são agendadas e cobradas automaticamente com base na recorrência definida na assinatura

GET

https://api.mercadopago.com/authorized_payments/{id}
Copiar
Request parameters
Path

Obrigatório

Opcional
id
number
OBRIGATÓRIO

Identificador de pagamento autorizado.
3950169598
Response parameters
id
number
Identificador único de fatura
type
string
Tipo de fatura gerada com base na recorrência.
scheduled: Pagamento gerado e agendado automaticamente pelo mecanismo de recorrência.
date_created
string
Data de criação da fatura.
last_modified
string
Data da última modificação da fatura. Uma fatura é modificada quando ocorre uma atualização nas tentativas de cobrança ou pagamento.
preapproval_id
string
ID de assinatura para qual a fatura foi criada.
reason
string
É uma breve descrição que o assinante verá durante o processo de checkout e nas notificações.
external_reference
string
Referência para sincronizar com seu sistema. Este é um campo de texto livre para ajudar com a integração para vincular as entidades.
currency_id
string
Identificador da moeda utilizada no pagamento.
ARS: Peso argentino.
BRL: Real brasileiro.
CLP: Peso chileno.
MXN: Peso mexicano.
COP: Peso colombiano.
PEN: Sol peruano.
UYU: Peso uruguaio.
transaction_amount
number
Valor que será cobrado em cada fatura.
debit_date
date
Data na qual tentaremos realizar o pagamento.
retry_attempt
number
Quantidade de que vezes tentamos cobrar a fatura.
status
string
Status da fatura.
scheduled: Cobrança agendada para um pagamento autorizado.
processed: Pagamento autorizado, cobrado ou que excedeu o número de tentativas.
recycling: Pagamento autorizado em tentativa de cobrança.
cancelled: Pagamento autorizado foi cancelado.
summarized
string
Resumo do status da fatura na assinatura.
pending: Pending summary in the subscription.
done: Summarized result in the subscription.
payment
object
Status do pagamento relacionado à fatura.

Mostrar atributos
id
number
Identificador único de pagamento.
status
string
Estado do pagamento.
pending: O usuário ainda não completou o processo de pagamento.
approved: O pagamento foi aprovado e creditado.
authorized: O pagamento foi autorizado, mas ainda não foi capturado.
in_process: O pagamento está sendo revisado.
in_mediation: Os usuários iniciaram uma disputa.
rejected: O pagamento foi rejeitado. O usuário pode tentar novamente.
cancelled: O pagamento foi cancelado por uma das partes ou porque o tempo para pagamento expirou.
refunded: O pagamento foi reembolsado ao usuário.
charged_back: Foi feito um estorno no cartão de crédito do comprador.
status_detail
string
Detalhe do status de pagamento.

Ocultar parâmetros
Erros
400Erro

401Erro

500Erro

Request

cURL
Copiar
curl -X GET \
 'https://api.mercadopago.com/authorized_payments/3950169598'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \

Response
Copiar
{
"id": 6114264375,
"type": "scheduled",
"date_created": "2022-01-01T11:12:25.892-04:00",
"last_modified": "2022-01-01T11:12:25.892-04:00",
"preapproval_id": "2c938084726fca480172750000000000",
"reason": "Yoga classes",
"external_reference": 23546246234,
"currency_id": "ARS",
"transaction_amount": 10,
"debit_date": "2022-01-01T11:12:25.892-04:00",
"retry_attempt": 4,
"status": "scheduled",
"summarized": "pending",
"payment": {
"id": 19951521071,
"status": "approved",
"status_detail": "accredited"
}
}

---

### Buscar em faturas

Pesquise as faturas de uma assinatura por diferentes parâmetros. Você pode pesquisar por assinatura, pagamento ou Customer ID.

GET

https://api.mercadopago.com/authorized_payments/search
Copiar
Request parameters
Path

Obrigatório

Opcional
id
number
OBRIGATÓRIO

ID único que identifica uma fatura.
3950169598
preapproval_id
string
OBRIGATÓRIO

ID único de assinatura para encontrar faturas relacionadas.
2c938084726fca480172750000000000
payment_id
number
OBRIGATÓRIO

ID único do pagamento para encontrar faturas relacionadas.
12476802073
payer_id
number
OBRIGATÓRIO

ID único do pagamento para encontrar suas notas relacionadas.
1054464758
offset
number
Especifica o offset do primeiro item da cobrança a ser retornado.
20
limit
number
Especifica o número máximo de itens a serem retornados.
20

Ocultar parâmetros
Response parameters
Erros
400Erro

401Erro

500Erro

Request

cURL
Copiar
curl -X GET \
 'https://api.mercadopago.com/authorized_payments/search'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \

Response
Copiar
{
"paging": {
"offset": 0,
"limit": 20,
"total": 100
},
"results": [
{
"id": 6114264375,
"type": "scheduled",
"date_created": "2022-01-01T11:12:25.892-04:00",
"last_modified": "2022-01-01T11:12:25.892-04:00",
"preapproval_id": "2c938084726fca480172750000000000",
"reason": "Yoga classes",
"external_reference": 23546246234,
"currency_id": "ARS",
"transaction_amount": 10,
"debit_date": "2022-01-01T11:12:25.892-04:00",
"retry_attempt": 4,
"status": "scheduled",
"summarized": "pending",
"payment": {
"id": 19951521071,
"status": "approved",
"status_detail": "accredited"
}
}
]
}

## PÓS-VENDA

### Cancelamentos

Criar cancelamento
Este endpoint permite cancelar uma compra para um pagamento específico, desde que o status do pagamento seja in_process, pending ou authorized. Em caso de sucesso, a requisição retornará um código de status 200

PUT

https://api.mercadopago.com/v1/payments/{payment_id}
Copiar
Request parameters
Path

Obrigatório

Opcional
payment_id
string
OBRIGATÓRIO

Número de identificação (ID) de pagamento.
18746874919
Body

Obrigatório

Opcional
status
String
OBRIGATÓRIO

Status do Pagamento - Este campo aceita exclusivamente o status `cancelled`.
Response parameters
id
number
Identificador de pagamento.
date_created
string
Data de criação do cancelamento.
date_approved
string
Data de aprovação do cancelamento.
date_last_updated
string
Data da última atualização.
date_of_expiration
string
Data de validade.
money_release_date
string
Data de liberação do dinheiro.
operation_type
string
Tipo de operação.
issuer_id
number
Identificador do emissor.
payment_method_id
string
Identificador do meio de pagamento.
payment_type_id
string
Identificador do tipo de pagamento.
status
string
Status do cancelamento.
status_detail
string
Detalhe do status. Este campo trará o detalhe do motivo do cancelamento do pagamento e está diretamente ligado ao parâmetro `status`.
currency_id
string
Identificador de moeda.
description
string
Descrição do produto/serviço cancelado.
live_mode
string
Este parâmetro indica se a contestação será processada em modo sandbox ou em produção. Se TRUE, a contestação será processada em modo de produção. Se FALSE, a contestação será processada no modo sandbox.
sponsor_id
string
Identificador do patrocinador.
authorization_code
string
Código de autorização.
money_release_schema
string
Esquema de liberação de dinheiro.
taxes_amount
number
Valor de imposto.
counter_currency
string
Contador de moeda.
brand_id
string
Identificador de marca.
shipping_amount
number
Valor de envio.
pos_id
string
Identificador de POS.
store_id
string
Identificador da loja.
integrator_id
string
Identificador do integrador.
platform_id
string
Identificador da plataforma.
corporation_id
string
Identificador da corporação.
collector_id
number
Número identificador del collector.
payers
array
Lista de pagadores.

Mostrar atributos
first_name
string
Primeiro nome.
last_name
string
Sobrenome.
email
string
E-mail do pagador.
type
string
Tipo de pagador.
identification
array
Lista de identificação.

Mostrar atributos
number
string
Número de identificação.
type
string
Tipo de identificação.
phone
array
Lista de telefones.

Mostrar atributos
area_code
string
Código de área.
number
string
Número de telefone.
extension
string
Ramal
entity_type
string
Tipo de entidade.
id
string
Identificador
operator_id
string
Identificador do operador.
marketplace_owner
string
Proprietário do marketplace.
metadata
array
Contém metadados de pagamento que nos são enviados no post de payment
additional_info
array
Lista de informação adicional.

Mostrar atributos
items
array
Lista de ítens.

Mostrar atributos
id
string
Identificador
title
string
Título do item.
description
string
Descrição
picture_url
string
URL da imagem.
category_id
string
Identificador da categoria.
quantity
string
Quantidade
unit_price
string
Preço unitário.
order
array
Lista de pedidos.

Mostrar atributos
type
string
Tipo de order.
id
string
Identificador do pedido.
external_reference
string
Referência externa.
transaction_amount
number
Valor da transação.
transaction_amount_refunded
number
Valor reembolsado da transação.
coupon_amount
number
Valor do cupom.
differential_pricing_id
string
Identificador do diferencial de preço.
deduction_schema
string
Esquema de dedução.
barcode
array
Lista de códigos de barra.

Mostrar atributos
content
string
Numeração do ódigo de barras.
installments
number
Número de parcelas.
transaction_details
array
Lista de detalhes da transação.

Mostrar atributos
payment_method_reference_id
string
Identificador de referência do meio de pagamento.
verification_code
string
Código de verificação.
net_received_amount
number
Valor líquido recebido.
total_paid_amount
number
Valor total pago.
overpaid_amount
number
Valor pago a mais.
external_resource_url
string
URL de recurso externo.
installment_amount
number
Valor da parcela.
financial_institution
string
Instituição financeira.
payable_deferral_period
string
Período de diferimento a pagar.
acquirer_reference
string
Referência do adquirente.
fee_details
array
Lista de detalhes das taxas.
charges_details
array
Lista de detalhes da cobrança.
captured
boolean
Captura habilitada.
binary_mode
boolean
Modo binário habilitado.
call_for_authorize_id
string
Chamada para autorizar identificador.
statement_descriptor
string
Descritor de extrato bancário.
card
array
Lista de cartões.
notification_url
string
URL de notificação.
refunds
array
Lista de reembolsos.
processing_mode
string
Modo de processamento.
merchant_account_id
string
Identificador da conta do merchant.
merchant_number
string
Número do merchant.
acquirer_reconciliation
array
Lista de reconciliação do adquirente.
point_of_interaction
array
Lista de ponto de interação.

Mostrar atributos
type
string
Tipo.
business_info
array
Lista de informação de negócio.

Mostrar atributos
unit
string
Unidade.
sub_unit
string
Subunidade

Ocultar parâmetros
Erros
400Erro

401Erro

403Erro

404Erro

Consultar Erros
Request

cURL
Copiar
curl -X PUT \
 'https://api.mercadopago.com/v1/payments/18746874919'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \
 -d '{
"status": "cancelled"
}'
Response
Copiar
{
"id": 18746874919,
"date_created": "2021-12-10T17:13:23.000-04:00",
"date_approved": null,
"date_last_updated": "2021-12-10T17:31:34.000-04:00",
"date_of_expiration": "2021-12-13T22:59:59.000-04:00",
"money_release_date": null,
"operation_type": "regular_payment",
"issuer_id": null,
"payment_method_id": "bolbradesco",
"payment_type_id": "ticket",
"status": "cancelled",
"status_detail": "by_collector",
"currency_id": "BRL",
"description": "Meu produto",
"live_mode": null,
"sponsor_id": null,
"authorization_code": null,
"money_release_schema": null,
"taxes_amount": 0,
"counter_currency": null,
"brand_id": null,
"shipping_amount": 0,
"pos_id": null,
"store_id": null,
"integrator_id": null,
"platform_id": null,
"corporation_id": null,
"collector_id": null,
"payers": [
{
"first_name": null,
"last_name": null,
"email": "test_user_80507629@testuser.com",
"type": "collector",
"identification": [
{
"number": "32659430",
"type": "DNI"
}
],
"phone": [
{
"area_code": null,
"number": null,
"extension": null
}
],
"entity_type": null,
"id": "1003743392",
"operator_id": null
}
],
"marketplace_owner": null,
"metadata": [
{}
],
"additional_info": [
{
"items": [
{
"id": "234",
"title": {
"en": "My product.",
"pt": "Meu produto.",
"es": "Mi producto."
},
"description": {
"en": "E-commerce store cellphone.",
"pt": "Celular da loja online.",
"es": "Celular de la tienda online."
},
"picture_url": "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
"category_id": "art",
"quantity": "1",
"unit_price": "75.76"
}
]
}
],
"order": [
{
"type": "mercadopago",
"id": "3754501423"
}
],
"external_reference": "firstname@gmail.com",
"transaction_amount": 75.76,
"transaction_amount_refunded": 0,
"coupon_amount": 0,
"differential_pricing_id": null,
"deduction_schema": null,
"barcode": [
{
"content": "23791883300000075763380250600221946300633330"
}
],
"installments": 1,
"transaction_details": [
{
"payment_method_reference_id": "6002219463",
"verification_code": "6002219463",
"net_received_amount": 0,
"total_paid_amount": 75.76,
"overpaid_amount": 0,
"external_resource_url": "https://www.mercadopago.com/mlb/payments/beta/ticket/helper?payment_id=18746874919&payment_method_reference_id=6002219463&caller_id=1003743392&hash=6a8c570f-9c39-4a5c-9b55-85ae1b724bf",
"installment_amount": 0,
"financial_institution": null,
"payable_deferral_period": null,
"acquirer_reference": null
}
],
"fee_details": [
{}
],
"charges_details": [
{}
],
"captured": true,
"binary_mode": true,
"call_for_authorize_id": null,
"statement_descriptor": null,
"card": [
{}
],
"notification_url": "https://webhook.site/17a3a5ce-28d4-4b4f-ba3f-a7595c17c6d8",
"refunds": [
{}
],
"processing_mode": "aggregator",
"merchant_account_id": null,
"merchant_number": null,
"acquirer_reconciliation": [
{}
],
"point_of_interaction": [
{
"type": "Unspecified",
"business_info": [
{
"unit": "online_payments",
"sub_unit": "checkout_pro"
}
]
}
]
}

---

## Reembolsos

### Criar reembolso

Criar reembolso
Criar um reembolso parcial/total para um pagamento específico. Se o campo amount estiver preechido, será criado um reembolso parcial, caso contrário, se criará um reembolso total

POST

https://api.mercadopago.com/v1/payments/{id}/refunds
Copiar
Request parameters
Path

Obrigatório

Opcional
id
string
OBRIGATÓRIO

Identificador de pagamento.
12345678901
Header

Obrigatório

Opcional
X-Idempotency-Key
string
OBRIGATÓRIO

Esta função permite repetir solicitações de forma segura, sem o risco de realizar a mesma ação mais de uma vez por engano. Isso é útil para evitar erros, como a criação de dois reembolsos idênticos, por exemplo. Para gar...Ver mais
77e1c83b-7bb0-437b-bc50-a7a58e5660ac
Body

Obrigatório

Opcional
amount
number
Valor do reembolso. Se a propriedade (amount) for removida do body, criará um reembolso integral.
5
Response parameters
id
number
Identificador do reembolso.
payment_id
number
Identificador de pagamento.
amount
number
Valor do reembolso.
metadata
array
Contém metadados de pagamento que nos são enviados no post de payment.
source
array
Contém os dados para identificar quem originou o reembolso (contém ID, nome e tipo)

Mostrar atributos
name
string
O nome do usuário que apresentou a solicitação de reembolso.
id
string
O ID do usuário que enviou a solicitação de reembolso (coletor, operador e proprietário do marketplace)
type
string
Tipo de fonte. Os valores possíveis são Admin, Collector, BPP e Marketplace.
date_created
string
Data de criação do reembolso.
unique_sequence_number
string
É um identificador do reembolso que foi gerado pelo processador do cartão.
refund_mode
string
Tipo de reembolso.
adjustment_amount
number
Ajuste de reembolso.
status
string
Status de reembolso.
approved: O pagamento foi aprovado e creditado.
in_process: O pagamento está sendo revisado.
rejected: O pagamento foi recusado. O usuário pode tentar o pagamento novamente.
cancelled: O pagamento foi cancelado por uma das partes ou porque o tempo para pagamento expirou.
authorized: O pagamento foi autorizado, mas ainda não foi capturado.
reason
string
Motivo do reembolso.
label
array
Informações relevantes para o reembolso. Atualmente, apenas uma label chamada hidden é usada. Quando a pesquisa de pagamento é feita, os reembolsos com o label hiddden não são retornados no JSON de resposta.
partition_details
array
Indica o valor devolvido para cada uma das partições com as quais o pagamento foi gerado. Atualmente apenas para um produto do Brasil (Valeras) são criados pagamentos com várias partições de dinheiro, portanto não se aplica a todos. O Valeras permite oferecer benefícios aos empregados e atualmente está ativo no Brasil apenas para alguns empregadores.

Ocultar parâmetros
Erros
400Erro

401Erro

404Erro

Consultar Erros
Request

cURL
Copiar
curl -X POST \
 'https://api.mercadopago.com/v1/payments/12345678901/refunds'\
-H 'Content-Type: application/json' \
 -H 'X-Idempotency-Key: 77e1c83b-7bb0-437b-bc50-a7a58e5660ac' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \
 -d '{
"amount": 5
}'
Response
Copiar
{
"id": 1009042015,
"payment_id": 18552260055,
"amount": 10,
"metadata": [
{}
],
"source": [
{
"name": {
"en": "Firstname Lastname.",
"pt": "Nome e sobrenome.",
"es": "Nombre y apellido."
},
"id": "1003743392",
"type": "collector"
}
],
"date_created": "2021-11-24T13:58:49.312-04:00",
"unique_sequence_number": null,
"refund_mode": "standard",
"adjustment_amount": 0,
"status": "approved",
"reason": null,
"label": [
{}
],
"partition_details": [
{}
]
}

### Obter lista de reembolsos

Obter lista de reembolsos
Consultar todos os reembolsos para um pagamento específico

GET

https://api.mercadopago.com/v1/payments/{id}/refunds
Copiar
Request parameters
Path

Obrigatório

Opcional
id
string
OBRIGATÓRIO

Identificador de pagamento
18552260055
Response parameters
id
number
Identificador do reembolso
payment_id
number
Identificador de pagamento
amount
number
Identificador de pagamento
metadata
array
Contém metadados de pagamento que nos são enviados no post de payment
source
array
Contém os dados para identificar quem originou o reembolso (contém ID, nome e tipo)

Mostrar atributos
name
string
The name of the user who submitted the refund request
id
string
O ID do usuário que enviou a solicitação de reembolso (coletor, operador e proprietário do marketplace)
type
string
Tipo de fonte. Os valores possíveis são Admin, Collector, BPP e Marketplace.
date_created
string
Data de criação do reembolso
unique_sequence_number
string
É um identificador do reembolso que foi gerado pelo processador do cartão.
refund_mode
string
Tipo de reembolso.
adjustment_amount
number
Ajuste de reembolso.
status
string
Status de reembolso.
approved: O pagamento foi aprovado e creditado.
in_process: O pagamento está sendo revisado.
rejected: O pagamento foi recusado. O usuário pode tentar o pagamento novamente.
cancelled: O pagamento foi cancelado por uma das partes ou porque o tempo para pagamento expirou.
authorized: O pagamento foi autorizado, mas ainda não foi capturado.
reason
string
Motivo do reembolso.
label
array
Informações relevantes para o reembolso. Atualmente, apenas uma label chamada hidden é usada. Quando a pesquisa de pagamento é feita, os reembolsos com o label hiddden não são retornados no JSON de resposta.
partition_details
array
Indica o valor devolvido para cada uma das partições com as quais o pagamento foi gerado. Atualmente apenas para um produto do Brasil (Valeras) são criados pagamentos com várias partições de dinheiro, portanto não se aplica a todos. O Valeras permite oferecer benefícios aos empregados e atualmente está ativo no Brasil apenas para alguns empregadores.

Ocultar parâmetros
Erros
400Erro

401Erro

404Erro

Consultar Erros
Request

cURL
Copiar
curl -X GET \
 'https://api.mercadopago.com/v1/payments/18552260055/refunds'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \

Response
Copiar
{
"id": 1032332129,
"payment_id": 18552260055,
"amount": 4,
"metadata": [
{}
],
"source": [
{
"name": {
"en": "Firstname Lastname",
"pt": "Nome e sobrenome",
"es": "Nombre y apellido"
},
"id": "1003743392",
"type": "collector"
}
],
"date_created": "2021-11-24T13:58:49.312-04:00",
"unique_sequence_number": null,
"refund_mode": "standard",
"adjustment_amount": 0,
"status": "approved",
"reason": null,
"label": [
{}
],
"partition_details": [
{}
]
}

### Obter reembolso específico

Obter reembolso específico
Consultar reembolso específico de determinado pagamento.

GET

https://api.mercadopago.com/v1/payments/{id}/refunds/{refund_id}
Copiar
Request parameters
Path

Obrigatório

Opcional
id
string
OBRIGATÓRIO

Identificador de pagamento.
18552260055
refund_id
string
OBRIGATÓRIO

Identificador do reembolso.
1032332129
Response parameters
id
number
Identificador do reembolso.
payment_id
number
Identificador do pagamento.
amount
number
Valor do reembolso.
metadata
array
Contém metadados de pagamento que nos são enviados no post de payment
source
array
Contém os dados para identificar quem originou o reembolso (contém ID, nome e tipo)

Mostrar atributos
name
string
The name of the user who submitted the refund request
id
string
O ID do usuário que enviou a solicitação de reembolso (coletor, operador e proprietário do marketplace)
type
string
Tipo de fonte. Os valores possíveis são Admin, Collector, BPP e Marketplace.
date_created
string
Data de criação do reembolso.
unique_sequence_number
string
É um identificador do reembolso que foi gerado pelo processador do cartão.
refund_mode
string
Tipo de reembolso.
adjustment_amount
number
Ajuste de reembolso.
status
string
Status de reembolso.
approved: O pagamento foi aprovado e creditado.
in_process: O pagamento está sendo revisado.
rejected: O pagamento foi recusado. O usuário pode tentar o pagamento novamente.
cancelled: O pagamento foi cancelado por uma das partes ou porque o tempo para pagamento expirou.
authorized: O pagamento foi autorizado, mas ainda não foi capturado.
reason
string
Motivo do reembolso.
label
array
Informações relevantes para o reembolso. Atualmente, apenas uma label chamada hidden é usada. Quando a pesquisa de pagamento é feita, os reembolsos com o label hiddden não são retornados no JSON de resposta.
partition_details
array
Indica o valor devolvido para cada uma das partições com as quais o pagamento foi gerado. Atualmente apenas para um produto do Brasil (Valeras) são criados pagamentos com várias partições de dinheiro, portanto não se aplica a todos. O Valeras permite oferecer benefícios aos empregados e atualmente está ativo no Brasil apenas para alguns empregadores.

Ocultar parâmetros
Erros
400Erro

401Erro

404Erro

Consultar Erros
Request

cURL
Copiar
curl -X GET \
 'https://api.mercadopago.com/v1/payments/18552260055/refunds/1032332129'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \

Response
Copiar
{
"id": 1032332129,
"payment_id": 18552260055,
"amount": 10,
"metadata": [
{}
],
"source": [
{
"name": {
"en": "Firstname Lastname",
"pt": "Nome e sobrenome",
"es": "Nombre y apellido"
},
"id": "1003743392",
"type": "collector"
}
],
"date_created": "2021-11-24T13:58:49.312-04:00",
"unique_sequence_number": null,
"refund_mode": "standard",
"adjustment_amount": 0,
"status": "approved",
"reason": null,
"label": [
{}
],
"partition_details": [
{}
]
}

## Contestações

### Obter estorno

Obter contestação
Este endpoint permite consultar o estado do processo de desconhecimento de um pagamento por parte de um pagador. Você deverá informar o ID da contestação que lhe foi notificado e, caso a solicitação esteja correta, será devolvida uma resposta com status code 200 e todas as informações relacionadas a ele

GET

https://api.mercadopago.com/v1/chargebacks/{id}
Copiar
Request parameters
Path

Obrigatório

Opcional
id
string
OBRIGATÓRIO

O parâmetro "id" refere-se a um identificador exclusivo para a transação da contestação. Caso não possua essa informação, basta inserir o ID do pagamento para o qual deseja obter os detalhes da contestação. É fundamental destacar que, ao utilizar o ID de pagamento, é necessário efetuar uma pequena alteração no endpoint a fim de realizar a chamada corretamente. A URL modificada deve seguir o seguinte formato - https://api.mercadopago.com/v1/chargebacks/search?payment_id=PAYMENT_ID.
217000087654321000
Response parameters
id
string
Identificador único da contestação
payments
array
Lista de IDs de pagamentos associados ao caso.
currency
string
Moeda do valor da contestação.
amount
number
Valor da contestação.
coverage_applied
boolean
Se o vendedor está coberto ou não.
coverage_elegible
boolean
Define se o dinheiro devolvido ao comprador pode ser coberto pelo Mercado Pago. Só é possível continuar com o restante das etapas se a contestação puder ser coberta.
documentation_required
boolean
Se o vendedor precisa enviar a documentação para esta contestação.
documentation_status
string
Detalhe da decisão tomada para a documentação.
pending: Nenhuma documentação foi recebida.
review_pending: Documentação recebida, aguardando a decisão a ser tomada.
valid: A documentação recebida é válida.
invalid: A documentação recebida é invalida.
not_supplied: A documentação não foi fornecida a tempo.
not_applicable: A documentação não foi necessária para esta contestação.
documentation
array
Lista de documentação recebida do vendedor.

Mostrar atributos
type
string
Tipo de arquivo da documentação.
url
string
URL para ver o arquivo da documentação.
description
string
Descrição da documentação.
date_documentation_deadline
string
Último dia para o envio da documentação da contestação.
date_created
string
Data de criação da contestação.
date_last_updated
string
Data da última modificação da contestação.
live_mode
boolean
Se a contestação será processada em modo sandbox ou em produção. Se TRUE, a contestação será processado em modo de produção. Se FALSE, a contestação será processada no modo sandbox.

Ocultar parâmetros

Consultar Erros
Request

cURL
Copiar
curl -X GET \
 'https://api.mercadopago.com/v1/chargebacks/217000087654321000'\
-H 'Content-Type: application/json' \
 -H 'Authorization: Bearer APP_USR-7\***\*\*\*\***288159-03\***\*\*\*\***c8c9b4b93\***\*\*\*\***2d0fd9b22\***\*\*\*\***691' \

Response
Copiar
{
"id": "217000087654321000",
"payments": [
{}
],
"currency": "BRL",
"amount": "108.43",
"coverage_applied": "true",
"coverage_elegible": "true",
"documentation_required": "true",
"documentation_status": "valid",
"documentation": [
{
"type": "application/pdf",
"url": "http://api.mercadopago.com/v1/chargebacks/documentation/other/2ec3bb6c-9b8b-47a0-8bc4-6f9b2ac60061",
"description": "File: FILE_123.pdf"
}
],
"date_documentation_deadline": "2024-05-26T23:59:59.000-04:00",
"date_created": "2024-05-16T17:19:13.000-04:00",
"date_last_updated": "2024-05-27T08:17:19.866-04:00",
"live_mode": "true"
}

## Webhooks

referência: https://www.mercadopago.com.br/developers/pt/reference/webhooks/

# Webhooks

Webhooks (também conhecido como retorno de chamada web) são um método simples que permite a uma aplicação ou sistema fornecer informações em tempo real sempre que um evento ocorre. É uma forma passiva de receber dados entre dois sistemas por meio de uma solicitação `HTTP POST`.

As notificações Webhooks podem ser configuradas para cada uma das aplicações criadas em [Suas integrações](/developers/panel/app). Você também poderá configurar uma URL de teste que, junto com suas credenciais de teste, permitirá testar o funcionamento correto das suas notificações antes de sair à produção.

Uma vez configuradas, as notificações Webhooks serão enviadas sempre que ocorrer um ou mais eventos cadastrados. Isso evita a necessidade de verificações constantes, prevenindo a sobrecarga do sistema e a perda de dados em situações críticas.

Para configurar as notificações Webhooks, escolha entre uma das opções abaixo:

| Tipo de configuração                                                                                                                             | Descrição                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Configuração via Suas integrações](/developers/pt/docs/your-integrations/notifications/webhooks#configuraoviasuasintegraes)                     | Permite configurar notificações para cada aplicação, identificar contas diferentes se necessário, e validar a origem da notificação utilizando uma assinatura secreta. |
| [Configuração durante a criação de pagamentos](/developers/pt/docs/your-integrations/notifications/webhooks#configuraoduranteacriaodepagamentos) | Permite a configuração específica das notificações para cada pagamento, preferência ou pedidos comerciais. .                                                           |

> WARNING
>
> Importante
>
> As URLs configuradas durante a criação do pagamento terão prioridade sobre aquelas configuradas através de Suas integrações.

Uma vez que as notificações estiverem configuradas, consulte as [ações necessárias após receber uma notificação](/developers/pt/docs/your-integrations/notifications/webhooks#aesnecessriasapsreceberumanotificao) para validar se foram devidamente recebidas.

## Configuração via Suas integrações

Configure notificações para cada aplicação diretamente em [Suas integrações](/developers/panel/app) de forma eficiente e segura. Nesta documentação, explicaremos como:

1.  Indicar URLs e configurar eventos
2.  Validar origem da notificação
3.  Simular o recebimento da notificação

> WARNING
>
> Importante
>
> Este método de configuração não está disponível para integrações com Assinaturas. Para configurar notificações com alguma dessas duas integrações, utilize o método [Configuração durante a criação de pagamentos](/developers/pt/docs/your-integrations/notifications/webhooks#configuraoduranteacriaodepagamentos).

### 1. Indicar URLs e configurar eventos

Para configurar as notificações Webhooks via Suas integrações, é necessário indicar as URLs onde elas serão recebidas e especificar os eventos para os quais deseja receber notificações.

Para isso, siga as etapas descritas abaixo.

1. Acesse [Suas integrações](/developers/panel/app) e selecione a aplicação para a qual deseja ativar as notificações. Caso ainda não tenha criado uma aplicação, acesse a [documentação Painel do Desenvolvedor](/developers/pt/docs/your-integrations/dashboard) e siga as instruções.
2. No menu à esquerda, vá até **Webhooks > Configurar notificações** e configure as URLs que serão usadas para receber as notificações. Recomendamos utilizar uma URL diferente para o modo de teste e o modo produção:
   - **URL modo teste:** fornece uma URL que permite testar o correto funcionamento das notificações dessa aplicação durante a fase de teste ou desenvolvimento. O teste dessas notificações deverá ser realizado exclusivamente com as **credenciais de teste de usuários produtivos**.
   - **URL modo produção:** fornece uma URL para receber notificações com sua integração produtiva. Essas notificações deverão ser configuradas com **credenciais produtivas**.

![webhooks](/images/dashboard/webhooks-pt.png)

> NOTE
>
> Nota
>
> Caso seja necessário identificar múltiplas contas, adicione o parâmetro `?cliente=(nomedovendedor)` ao final da URL indicada para identificar os vendedores.

3. Selecione os **eventos** para os quais deseja receber notificações em formato `json` através de um `HTTP POST` para a URL especificada anteriormente. Um evento pode ser qualquer atualização no objeto relatado, incluindo alterações de status ou atributos. Consulte a tabela abaixo para ver os eventos configuráveis, considerando a solução do Mercado Pago integrada e suas necessidades de negócio.

| Eventos                                                                                                    | Nome em Suas integrações | Tópico                            | Produtos associados                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------- | ------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Criação e atualização de pagamentos                                                                        | Order (Mercado Pago)     | `orders`                          | [Checkout Transparente](/developers/pt/docs/checkout-api-orders/overview)<br>[Mercado Pago Point](/developers/pt/docs/mp-point/landing)<br>[Código QR](/developers/pt/docs/qr-code/overview)                                                                                                                                                                                                                                                              |
| Criação e atualização de pagamentos                                                                        | Pagamentos               | `payment`                         | [Checkout Transparente](/developers/pt/docs/checkout-api-payments/overview) (**legacy**)<br>[Checkout Pro](/developers/pt/docs/checkout-pro/overview)<br>[Checkout Bricks](/developers/pt/docs/checkout-bricks/overview)<br>[Assinaturas](/developers/pt/docs/subscriptions/overview)<br>[Wallet Connect](/developers/pt/docs/wallet-connect/landing)                                                                                                     |
| Pagamento recorrente de uma assinatura (criação - atualização)                                             | Planos e assinaturas     | `subscription_authorized_payment` | [Assinaturas](/developers/pt/docs/subscriptions/overview)                                                                                                                                                                                                                                                                                                                                                                                                 |
| Vinculação de uma assinatura (criação - atualização)                                                       | Planos e assinaturas     | `subscription_preapproval`        | [Assinaturas](/developers/pt/docs/subscriptions/overview)                                                                                                                                                                                                                                                                                                                                                                                                 |
| Vinculação de um plano de assinatura (criação - atualização)                                               | Planos e assinaturas     | `subscription_preapproval_plan`   | [Assinaturas](/developers/pt/docs/subscriptions/overview)                                                                                                                                                                                                                                                                                                                                                                                                 |
| Vinculação e desvinculação de contas que se conectaram através de OAuth                                    | Vinculação de aplicações | `mp-connect`                      | Todos os produtos que tenham OAuth implementado                                                                                                                                                                                                                                                                                                                                                                                                           |
| Transações com Wallet Connect                                                                              | Wallet Connect           | `wallet_connect`                  | [Wallet Connect](/developers/pt/docs/wallet-connect/landing)                                                                                                                                                                                                                                                                                                                                                                                              |
| Alertas de fraude após o processamento de um pedido                                                        | Alertas de fraude        | `stop_delivery_op_wh`             | [Checkout Transparente](/developers/pt/docs/checkout-api-orders/overview)<br>[Checkout Pro](/developers/pt/docs/checkout-pro/overview)                                                                                                                                                                                                                                                                                                                    |
| Criação de estornos e reclamações                                                                          | Reclamações              | `topic_claims_integration_wh`     | [Checkout Transparente](/developers/pt/docs/checkout-api-orders/overview)<br>[Checkout Pro](/developers/pt/docs/checkout-pro/overview)<br>[Checkout Bricks](/developers/pt/docs/checkout-bricks/overview)<br>[Assinaturas](/developers/pt/docs/subscriptions/overview)<br>[Mercado Pago Point](/developers/pt/docs/mp-point/landing)<br>[Código QR](/developers/pt/docs/qr-code/overview)<br>[Wallet Connect](/developers/pt/docs/wallet-connect/landing) |
| Recuperação e atualização de informações de cartões no Mercado Pago                                        | Card Updater             | `topic_card_id_wh`                | [Checkout Pro](/developers/pt/docs/checkout-pro/overview)<br>[Checkout Transparente](/developers/pt/docs/checkout-api-orders/overview)<br>[Checkout Bricks](/developers/pt/docs/checkout-bricks/overview)                                                                                                                                                                                                                                                 |
| Criação, fechamento ou expiração de ordens comerciais                                                      | Ordens comerciais        | `topic_merchant_order_wh`         | [Checkout Pro](/developers/pt/docs/checkout-pro/overview)<br>[Código QR](/developers/pt/docs/qr-code/overview) (**legacy**)                                                                                                                                                                                                                                                                                                                               |
| Abertura de _chargebacks_, mudanças de status e modificações referentes às liberações de dinheiro          | Chargebacks              | `topic_chargebacks_wh`            | [Checkout Pro](/developers/pt/docs/checkout-pro/overview)<br>[Checkout Transparente](/developers/pt/docs/checkout-api-orders/overview)<br>[Checkout Bricks](/developers/pt/docs/checkout-bricks/overview)                                                                                                                                                                                                                                                 |
| Finalização, cancelamento ou erros ao processar intenções de pagamento de dispositivos Mercado Pago Point. | Integrações Point        | `point_integration_wh`            | [Mercado Pago Point](/developers/pt/docs/mp-point-legacy/overview) (**legacy**)                                                                                                                                                                                                                                                                                                                                                                           |

> WARNING
>
> Importante
>
> Em caso de dúvidas sobre quais tópicos ativar ou quais eventos serão notificados, consulte a documentação [Informações adicionais sobre notificações](/developers/pt/docs/your-integrations/notifications/additional-info).

5. Por fim, clique e **Salvar** para gerar uma **assinatura secreta** exclusiva para a sua aplicação, permitindo validar a autenticidade das notificações recebidas e garantir que tenham sido enviadas pelo Mercado Pago. A assinatura gerada não tem prazo de validade e sua renovação periódica não é obrigatória, embora seja altamente recomendável. Para renová-la, clique no botão de **redefinição** ao lado da assinatura.

### 2. Validar origem da notificação

As notificações enviadas pelo Mercado Pago serão semelhantes ao exemplo abaixo para um alerta do tópico `payment`:

```json
{
  "id": 12345,
  "live_mode": true,
  "type": "payment",
  "date_created": "2015-03-25T10:04:58.396-04:00",
  "user_id": 44444,
  "api_version": "v1",
  "action": "payment.created",
  "data": {
    "id": "999999999"
  }
}
```

O Mercado Pago sempre incluirá a assinatura secreta nas notificações Webhooks recebidas na URL cadastrada. Isso permitirá validar a sua autenticidade, proporcionando maior segurança e prevenindo possíveis fraudes.

Esta assinatura será enviada no _header_ `x-signature`, conforme o exemplo abaixo.

```x-signature
`ts=1704908010,v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839`

```

Para configurar essa validação, é necessário extrair a chave contida no _header_ e compará-la com a chave fornecida para sua aplicação em Suas integrações. Para isso, siga as etapas abaixo. No final, disponibilizamos alguns SDKs com um exemplo de código completo para facilitar o processo:

1. Para extrair o _timestamp_ (`ts`) e a assinatura do _header_ `x-signature`, divida o conteúdo do _header_ pelo caractere `,`, o que resultará em uma lista de 2 elementos. O valor para o prefixo `ts` é o _timestamp_ (em milissegundos) da notificação, e `v1` é a assinatura encriptada. Seguindo o exemplo apresentado acima, `ts=1704908010` e `v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839`.
2. Utilizando o _template_ e as descrições abaixo, substitua os parâmetros pelos dados recebidos na sua notificação.

```template
id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];
```

- Parâmetros com sufixo `_url` são provenientes de _query params_. Exemplo: `[data.id_url]`. Deve ser substituído pelo valor correspondente ao ID do evento (`data.id`) e, neste caso, se o ``data.id_url` for alfanumérico, obritatoriamente deverá ser enviado em minúsculas. Esse _query param_ poderá ser encontrado na notificação recebida.
- `[ts_header]` representa o valor `ts` extraído do _header_ `x-signature`.
- `[x-request-id_header]` deve ser substituído pelo valor recebido no _header_ `x-request-id`.

> WARNING
>
> Importante
>
> Se algum dos valores mostrados no modelo acima não estiver presente na sua notificação, você deve removê-lo.

3. Em [Suas integrações](/developers/panel/app), selecione a aplicação integrada e navegue até a seção de Webhooks para visualizar a assinatura secreta gerada.
4. Crie a contra chave para validação. Para isso, calcule um HMAC (Código de Autenticação de Mensagem Baseado em Hash) utilizando a função de `hash SHA256` em base hexadecimal. Utilize a **assinatura secreta** como chave e o template preenchido com os respectivos valores como mensagem.

[[[

```php
$cyphedSignature = hash_hmac('sha256', $data, $key);
```

```node
const crypto = require("crypto");
const cyphedSignature = crypto
  .createHmac("sha256", secret)
  .update(signatureTemplateParsed)
  .digest("hex");
```

```java
String cyphedSignature = new HmacUtils("HmacSHA256", secret).hmacHex(signedTemplate);
```

```python
import hashlib, hmac, binascii

cyphedSignature = binascii.hexlify(hmac_sha256(secret.encode(), signedTemplate.encode()))
```

]]]

5. Por fim, compare a chave gerada com a chave extraída do _header_, assegurando que correspondam exatamente. Além disso, é possível usar o _timestamp_ extraído do _header_ para compará-lo com um _timestamp_ gerado no momento do recebimento da notificação. Isso permite estabelecer uma margem de tolerância para atrasos no recebimento da mensagem.

Veja exemplos de códigos completos abaixo:

[[[

```php
<?php
// Obtain the x-signature value from the header
$xSignature = $_SERVER['HTTP_X_SIGNATURE'];
$xRequestId = $_SERVER['HTTP_X_REQUEST_ID'];

// Obtain Query params related to the request URL
$queryParams = $_GET;

// Extract the "data.id" from the query params
$dataID = isset($queryParams['data.id']) ? $queryParams['data.id'] : '';

// Separating the x-signature into parts
$parts = explode(',', $xSignature);

// Initializing variables to store ts and hash
$ts = null;
$hash = null;

// Iterate over the values to obtain ts and v1
foreach ($parts as $part) {
    // Split each part into key and value
    $keyValue = explode('=', $part, 2);
    if (count($keyValue) == 2) {
        $key = trim($keyValue[0]);
        $value = trim($keyValue[1]);
        if ($key === "ts") {
            $ts = $value;
        } elseif ($key === "v1") {
            $hash = $value;
        }
    }
}

// Obtain the secret key for the user/application from Mercadopago developers site
$secret = "your_secret_key_here";

// Generate the manifest string
$manifest = "id:$dataID;request-id:$xRequestId;ts:$ts;";

// Create an HMAC signature defining the hash type and the key as a byte array
$sha = hash_hmac('sha256', $manifest, $secret);
if ($sha === $hash) {
    // HMAC verification passed
    echo "HMAC verification passed";
} else {
    // HMAC verification failed
    echo "HMAC verification failed";
}
?>
```

```javascript
// Obtain the x-signature value from the header
const xSignature = headers["x-signature"]; // Assuming headers is an object containing request headers
const xRequestId = headers["x-request-id"]; // Assuming headers is an object containing request headers

// Obtain Query params related to the request URL
const urlParams = new URLSearchParams(window.location.search);
const dataID = urlParams.get("data.id");

// Separating the x-signature into parts
const parts = xSignature.split(",");

// Initializing variables to store ts and hash
let ts;
let hash;

// Iterate over the values to obtain ts and v1
parts.forEach((part) => {
  // Split each part into key and value
  const [key, value] = part.split("=");
  if (key && value) {
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();
    if (trimmedKey === "ts") {
      ts = trimmedValue;
    } else if (trimmedKey === "v1") {
      hash = trimmedValue;
    }
  }
});

// Obtain the secret key for the user/application from Mercadopago developers site
const secret = "your_secret_key_here";

// Generate the manifest string
const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

// Create an HMAC signature
const hmac = crypto.createHmac("sha256", secret);
hmac.update(manifest);

// Obtain the hash result as a hexadecimal string
const sha = hmac.digest("hex");

if (sha === hash) {
  // HMAC verification passed
  console.log("HMAC verification passed");
} else {
  // HMAC verification failed
  console.log("HMAC verification failed");
}
```

```python
import hashlib
import hmac
import urllib.parse

# Obtain the x-signature value from the header
xSignature = request.headers.get("x-signature")
xRequestId = request.headers.get("x-request-id")

# Obtain Query params related to the request URL
queryParams = urllib.parse.parse_qs(request.url.query)

# Extract the "data.id" from the query params
dataID = queryParams.get("data.id", [""])[0]

# Separating the x-signature into parts
parts = xSignature.split(",")

# Initializing variables to store ts and hash
ts = None
hash = None

# Iterate over the values to obtain ts and v1
for part in parts:
    # Split each part into key and value
    keyValue = part.split("=", 1)
    if len(keyValue) == 2:
        key = keyValue[0].strip()
        value = keyValue[1].strip()
        if key == "ts":
            ts = value
        elif key == "v1":
            hash = value

# Obtain the secret key for the user/application from Mercadopago developers site
secret = "your_secret_key_here"

# Generate the manifest string
manifest = f"id:{dataID};request-id:{xRequestId};ts:{ts};"

# Create an HMAC signature defining the hash type and the key as a byte array
hmac_obj = hmac.new(secret.encode(), msg=manifest.encode(), digestmod=hashlib.sha256)

# Obtain the hash result as a hexadecimal string
sha = hmac_obj.hexdigest()
if sha == hash:
    # HMAC verification passed
    print("HMAC verification passed")
else:
    # HMAC verification failed
    print("HMAC verification failed")
```

```go
import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"strings"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Obtain the x-signature value from the header
		xSignature := r.Header.Get("x-signature")
		xRequestId := r.Header.Get("x-request-id")

		// Obtain Query params related to the request URL
		queryParams := r.URL.Query()

		// Extract the "data.id" from the query params
		dataID := queryParams.Get("data.id")

		// Separating the x-signature into parts
		parts := strings.Split(xSignature, ",")

		// Initializing variables to store ts and hash
		var ts, hash string

		// Iterate over the values to obtain ts and v1
		for _, part := range parts {
			// Split each part into key and value
			keyValue := strings.SplitN(part, "=", 2)
			if len(keyValue) == 2 {
				key := strings.TrimSpace(keyValue[0])
				value := strings.TrimSpace(keyValue[1])
				if key == "ts" {
					ts = value
				} else if key == "v1" {
					hash = value
				}
			}
		}

		// Get secret key/token for specific user/application from Mercadopago developers site
		secret := "your_secret_key_here"

		// Generate the manifest string
		manifest := fmt.Sprintf("id:%v;request-id:%v;ts:%v;", dataID, xRequestId, ts)

		// Create an HMAC signature defining the hash type and the key as a byte array
		hmac := hmac.New(sha256.New, []byte(secret))
		hmac.Write([]byte(manifest))

		// Obtain the hash result as a hexadecimal string
		sha := hex.EncodeToString(hmac.Sum(nil))

if sha == hash {
    // HMAC verification passed
    fmt.Println("HMAC verification passed")
} else {
    // HMAC verification failed
    fmt.Println("HMAC verification failed")
}

	})
}
```

]]]

### 3. Simular o recebimento da notificação

Para garantir que as notificações estejam configuradas corretamente, é necessário simular o recebimento delas. Para isso, siga os seguintes passos:

1. Após configurar as URLs e os eventos desejados, clique em **Salvar** para salvar a configuração.
2. Após isso, clique em **Simular** para testar se a URL indicada está recebendo as notificações corretamente.
3. Na tela de simulação, selecione a URL a ser testada, podendo ser uma URL de **teste** ou de **produção**.
4. Em seguida, selecione o **tipo de evento** desejado e insira a **identificação** que será enviada no corpo da notificação.
5. Por fim, clique em **Enviar teste** para verificar a solicitação, a resposta dada pelo servidor e a descrição do evento.

## Configuração durante a criação de pagamentos

Durante o processo de criação de pagamentos, preferências ou ordens comerciais, é possível configurar a URL de notificação de maneira específica para cada pagamento, utilizando o campo `notification_url` e implementando o receptor de notificações necessário.

A seguir, explicamos como realizar esta configuração utilizando nossos SDKs.

1. No campo `notification_url`, informe a URL que receberá as notificações, conforme o exemplo abaixo. Para receber notificações exclusivamente via Webhooks e não via IPN, adicione o parâmetro `source_news=webhooks` à `notification_url`. Por exemplo: `https://www.yourserver.com/notifications?source_news=webhooks`.

[[[

```php
<?php
$client = new PaymentClient();

        $body = [
            'transaction_amount' => 100,
            'token' => 'token',
            'description' => 'description',
            'installments' => 1,
            'payment_method_id' => 'visa',
            'notification_url' => 'http://test.com',
            'payer' => array(
                'email' => 'test@test.com',
                'identification' => array(
                    'type' => 'CPF',
                    'number' => '19119119100'
                )
            )
        ];

$client->create(body);
?>
```

```node
const client = new MercadoPagoConfig({ accessToken: "ACCESS_TOKEN" });
const payment = new Payment(client);

const body = {
  transaction_amount: "100",
  token: "token",
  description: "description",
  installments: 1,
  payment_method_id: "visa",
  notification_url: "http://test.com",
  payer: {
    email: "test@test.com",
    identification: {
      type: "CPF",
      number: "19119119100",
    },
  },
};

payment
  .create({
    body: body,
    requestOptions: { idempotencyKey: "<SOME_UNIQUE_VALUE>" },
  })
  .then(console.log)
  .catch(console.log);
```

```java
MercadoPago.SDK.setAccessToken("YOUR_ACCESS_TOKEN");

Payment payment = new Payment();
payment.setTransactionAmount(Float.valueOf(request.getParameter("transactionAmount")))
      .setToken(request.getParameter("token"))
      .setDescription(request.getParameter("description"))
      .setInstallments(Integer.valueOf(request.getParameter("installments")))
      .setPaymentMethodId(request.getParameter("paymentMethodId"))
      .setNotificationUrl("http://requestbin.fullcontact.com/1ogudgk1");

Identification identification = new Identification();

Payer payer = new Payer();
payer.setEmail(request.getParameter("email"))
    .setIdentification(identification);

payment.setPayer(payer);

payment.save();

System.out.println(payment.getStatus());

```

```ruby
require 'mercadopago'
sdk = Mercadopago::SDK.new('YOUR_ACCESS_TOKEN')

payment_data = {
 transaction_amount: params[:transactionAmount].to_f,
 token: params[:token],
 description: params[:description],
 installments: params[:installments].to_i,
 payment_method_id: params[:paymentMethodId],
 notification_url: "http://requestbin.fullcontact.com/1ogudgk1",
 payer: {
   email: params[:email],
   identification: {
     number: params[:docNumber]
   }
 }
}

payment_response = sdk.payment.create(payment_data)
payment = payment_response[:response]

puts payment

```

```csharp
using System;
using MercadoPago.Client.Common;
using MercadoPago.Client.Payment;
using MercadoPago.Config;
using MercadoPago.Resource.Payment;

MercadoPagoConfig.AccessToken = "YOUR_ACCESS_TOKEN";

var paymentRequest = new PaymentCreateRequest
{
   TransactionAmount = decimal.Parse(Request["transactionAmount"]),
   Token = Request["token"],
   Description = Request["description"],
   Installments = int.Parse(Request["installments"]),
   PaymentMethodId = Request["paymentMethodId"],
   NotificationUrl = "http://requestbin.fullcontact.com/1ogudgk1",

   Payer = new PaymentPayerRequest
   {
       Email = Request["email"],
       Identification = new IdentificationRequest
       {
           Number = Request["docNumber"],
       },
   },
};

var client = new PaymentClient();
Payment payment = await client.CreateAsync(paymentRequest);

Console.WriteLine(payment.Status);

```

```python
import mercadopago
sdk = mercadopago.SDK("ACCESS_TOKEN")

payment_data = {
   "transaction_amount": float(request.POST.get("transaction_amount")),
   "token": request.POST.get("token"),
   "description": request.POST.get("description"),
   "installments": int(request.POST.get("installments")),
   "payment_method_id": request.POST.get("payment_method_id"),
   "notification_url" =  "http://requestbin.fullcontact.com/1ogudgk1",
   "payer": {
       "email": request.POST.get("email"),
       "identification": {
           "number": request.POST.get("number")
       }
   }
}

payment_response = sdk.payment().create(payment_data)
payment = payment_response["response"]

print(payment)
```

```go
accessToken := "{{ACCESS_TOKEN}}"

cfg, err := config.New(accessToken)
if err != nil {
   fmt.Println(err)
   return
}

client := payment.NewClient(cfg)

request := payment.Request{
   TransactionAmount: <transactionAmount>,
   Token: <token>,
   Description: <description>,
   Installments: <installments>,
   PaymentMethodID:   <paymentMethodId>,
   NotificationURL: "https:/mysite.com/notifications/new",
   Payer: &payment.PayerRequest{
      Email: <email>,
      Identification: &payment.IdentificationRequest{
         Type: <type>,
         Number: <number>,
      },
   },
}

resource, err := client.Create(context.Background(), request)
if err != nil {
fmt.Println(err)
}

fmt.Println(resource)
```

```curl
curl -X POST \
   -H 'accept: application/json' \
   -H 'content-type: application/json' \
   -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
   'https://api.mercadopago.com/v1/payments' \
   -d '{
         "transaction_amount": 100,
         "token": "ff8080814c11e237014c1ff593b57b4d",
         "description": "Blue shirt",
         "installments": 1,
         "payment_method_id": "visa",
         "issuer_id": 310,
         "notification_url": "http://requestbin.fullcontact.com/1ogudgk1",
         "payer": {
           "email": "test@test.com"

         }
   }'

```

]]]

2. Implemente o receptor de notificações utilizando o seguinte código como exemplo:

```php
<?php
 MercadoPago\SDK::setAccessToken("ENV_ACCESS_TOKEN");
 switch($_POST["type"]) {
     case "payment":
         $payment = MercadoPago\Payment::find_by_id($_POST["data"]["id"]);
         break;
     case "plan":
         $plan = MercadoPago\Plan::find_by_id($_POST["data"]["id"]);
         break;
     case "subscription":
         $plan = MercadoPago\Subscription::find_by_id($_POST["data"]["id"]);
         break;
     case "invoice":
         $plan = MercadoPago\Invoice::find_by_id($_POST["data"]["id"]);
         break;
     case "point_integration_wh":
         // $_POST contém as informações relacionadas à notificação.
         break;
 }
?>
```

Após realizar as configurações necessárias, a notificação Webhooks será entregue com formato `JSON`. Veja o exemplo de notificação do tópico de `payments` e as descrições das informações enviadas na tabela abaixo.

> WARNING
>
> Importante
>
> Os pagamentos de teste, criados com credenciais de teste, não enviarão notificações. A única maneira de testar o recebimento de notificações é por meio da [Configuração via Suas integrações](/developers/pt/docs/your-integrations/notifications/webhooks#configuraoviasuasintegraes).

```json
{
  "id": 12345,
  "live_mode": true,
  "type": "payment",
  "date_created": "2015-03-25T10:04:58.396-04:00",
  "user_id": 44444,
  "api_version": "v1",
  "action": "payment.created",
  "data": {
    "id": "999999999"
  }
}
```

| Atributo         | Descrição                                                                                                                                         | Exemplo no JSON                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| **id**           | ID de notificação                                                                                                                                 | `12345`                         |
| **live_mode**    | Indica se a URL informada é válida                                                                                                                | `true`                          |
| **type**         | Tipo de notificação recebida de acordo com o tópico previamente selecionado (payments, mp-connect, subscription, claim, automatic-payments, etc.) | `payment`                       |
| **date_created** | Data de criação do recurso notificado                                                                                                             | `2015-03-25T10:04:58.396-04:00` |
| **user_id**      | Identificador do vendedor                                                                                                                         | `44444`                         |
| **api_version**  | Valor que indica a versão da API que envia a notificação.                                                                                         | `v1`                            |
| **action**       | Evento notificado, indicando se é uma atualização de recurso ou a criação de um novo                                                              | `payment.created`               |
| **data.id**      | ID do pagamento, do `merchant_order` ou da reclamação                                                                                             | `999999999`                     |

## Ações necessárias após receber uma notificação

Ao receber uma notificação em sua plataforma, o Mercado Pago aguarda uma resposta para validar se você a recebeu corretamente. Para isso, é necessário retornar um status `HTTP STATUS 200 (OK)` ou `201 (CREATED)`.

O **tempo de espera** para a confirmação da recepção das notificações será de **22 segundos**. Se essa confirmação não for enviada, o sistema entenderá que a notificação não foi recebida e realizará **novas tentativas de envio a cada 15 minutos**, até receber uma resposta. Após a terceira tentativa, o prazo será prorrogado, mas os envios continuarão acontecendo.

Após responder à notificação e confirmar seu recebimento, é possível obter as informações completas do recurso notificado fazendo uma requisição ao endpoint correspondente da API. Para identificar qual endpoint utilizar, confira a tabela abaixo:

| Tipo                            | URL                                                              | Documentação                                                                                                                                                         |
| ------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| order                           | `https://api.mercadopago.com/v1/orders/{id}`                     | [Obter order por ID](/developers/pt/reference/orders/online-payments/get-order/get) (para [Checkout Transparente](/developers/pt/docs/checkout-api-orders/overview)) |
| order                           | `https://api.mercadopago.com/v1/orders/{order_id}`               | [Obter order por ID](/developers/pt/reference/in-person-payments/point/orders/get-order/get) (para [Mercado Pago Point](/developers/pt/docs/mp-point/overview))      |
| order                           | `https://api.mercadopago.com/v1/orders/{order_id}`               | [Obter order por ID](/developers/pt/reference/in-person-payments/qr-code/orders/get-order/get) (para [Código QR](/developers/pt/docs/qr-code/overview))              |
| payment                         | `https://api.mercadopago.com/v1/payments/[ID]`                   | [Obter pagamento](/developers/pt/reference/payments/_payments_id/get)                                                                                                |
| subscription_preapproval        | `https://api.mercadopago.com/preapproval/search`                 | [Obter assinatura](/developers/pt/reference/subscriptions/_preapproval_search/get)                                                                                   |
| subscription_preapproval_plan   | `https://api.mercadopago.com/preapproval_plan/search`            | [Obter plano de assinatura](/developers/pt/reference/subscriptions/_preapproval_plan_search/get)                                                                     |
| subscription_authorized_payment | `https://api.mercadopago.com/authorized_payments/[ID]`           | [Obter dados de fatura](/developers/pt/reference/subscriptions/_authorized_payments_id/get)                                                                          |
| topic_claims_integration_wh     | `https://api.mercadopago.com/post-purchase/v1/claims/[claim_id]` | [Obter detalhes da reclamação](/developers/pt/reference/claims/get-claim-details/get)                                                                                |
| topic_merchant_order_wh         | `https://api.mercadopago.com/merchant_orders/[ID]`               | [Obter pedido](/developers/pt/reference/merchant_orders/_merchant_orders_id/get)                                                                                     |
| topic_chargebacks_wh            | `https://api.mercadopago.com/v1/chargebacks/[ID]`                | [Obter estorno](/developers/pt/reference/chargebacks/_chargebacks_id/get)                                                                                            |

Com essas informações, você poderá realizar as atualizações necessárias na sua plataforma como, por exemplo, atualizar um pagamento aprovado.

## Painel de notificações

O painel de notificações permite ao usuário visualizar os eventos disparados sobre uma determinada integração, verificar o status e obter informações detalhadas desses eventos.

Este painel será exibido assim que você configurar suas notificações **Webhooks**, e você pode acessá-lo a qualquer momento clicando em Webhooks dentro de Suas integrações.

Entre as informações disponíveis estão a porcentagem de notificações entregues, bem como uma visão rápida das URLs e dos eventos configurados.

Além disso, você encontrará uma lista completa das últimas notificações enviadas e seus detalhes, como **status da entrega** (sucesso ou falha), **ação** (ação associada ao evento disparado), **evento** (tipo de evento disparado) e **data e hora**. Se desejar, é possível filtrar esses resultados exibidos por **status da entrega** e por período (**data e hora**).

![paiel de notificações webhooks](/images/dashboard/notification-dashboard-pt.png)

### Detalhes do evento

Ao clicar em uma das notificações listadas, é possível acessar os detalhes do evento. Esta seção fornece mais informações e permite a recuperação de dados perdidos em caso de falha na entrega da notificação para manter o sistema sempre atualizado.

- **Status:** Status do evento junto com o código de sucesso ou erro correspondente.
- **Evento:** Tipo de evento disparado, conforme selecionado na configuração das notificações.
- **Tipo:** Tópico ao qual o evento disparado pertence, conforme a seleção feita durante a configuração.
- **Data e hora do disparo:** Data e hora em que o evento foi disparado.
- **Descrição:** Descrição detalhada do evento conforme documentada.
- **ID do disparo:** Identificador único da notificação enviada.
- **Requisição:** JSON da requisição correspondente à notificação disparada.

![detalhes de notificações enviadas](/images/dashboard/notification-details-dashboard-pt.png)

Em caso de falha na entrega da notificação, é possível visualizar os motivos e corrigir as informações necessárias para evitar problemas futuros.

Integração para websites
A integração de pagamentos via cartão para websites é realizada via CardForm. Neste modo de integração, o MercadoPago.js é responsável pelos fluxos necessários para obtenção das informações obrigatórias para a criação de um pagamento. Quando inicializado, uma busca é realizada para recolher os tipos de documentos disponíveis para o país em questão.

À medida que os dados do cartão são inseridos, ocorre uma busca automática das informações de emissor e parcelas disponíveis para aquele meio de pagamento. Com isso, a implementação do fluxo é transparente para quem realiza a integração.

Importante
Além das opções disponíveis nesta documentação, também é possível integrar pagamentos com cartão utilizando o Brick de Card Payment. Veja a documentação Renderização padrão do Card Payment para mais detalhes. Também recomendamos a adoção do protocolo 3DS 2.0 para aumentar a probabilidade de aprovação dos seus pagamentos. Para obter mais informações, consulte a documentação sobre Como integrar 3DS com Checkout Transparente.
Confira abaixo o diagrama que ilustra o processo de pagamento via cartão utilizando o CardForm.

API-integration-flowchart

Para integrar pagamentos com cartão no Checkout Transparente siga as etapas abaixo.

Importar MercadoPago.js
A primeira etapa do processo de integração de pagamentos com cartões é a captura de dados do cartão. Esta captura é feita a partir da inclusão da biblioteca MercadoPago.js em seu projeto, seguida do formulário de pagamento. Utilize o código abaixo para importar a biblioteca MercadoPago.js antes de adicionar o formulário de pagamento.

<body>
  <script src="https://sdk.mercadopago.com/js/v2"></script>
</body>
Configurar credenciais
As credenciais são chaves únicas com as quais identificamos uma integração na sua conta. Servem para capturar pagamentos em lojas virtuais e outras aplicações de forma segura.

Esta é a primeira etapa de uma estrutura completa de código que deverá ser seguida para a correta integração do pagamento via cartão.

<script>
  const mp = new MercadoPago("YOUR_PUBLIC_KEY");
</script>

Adicionar formulário de pagamento
A captura dos dados do cartão é feita através do CardForm da biblioteca MercadoPago.js. Nosso CardForm se conectará ao seu formulário de pagamento HTML, facilitando a obtenção e validação de todos os dados necessários para processar o pagamento.

Para adicionar o formulário de pagamento, insira o HTML abaixo diretamente no projeto.

<style>
    #form-checkout {
      display: flex;
      flex-direction: column;
      max-width: 600px;
    }

    .container {
      height: 18px;
      display: inline-block;
      border: 1px solid rgb(118, 118, 118);
      border-radius: 2px;
      padding: 1px 2px;
    }
  </style>
  <form id="form-checkout">
    <div id="form-checkout__cardNumber" class="container"></div>
    <div id="form-checkout__expirationDate" class="container"></div>
    <div id="form-checkout__securityCode" class="container"></div>
    <input type="text" id="form-checkout__cardholderName" />
    <select id="form-checkout__issuer"></select>
    <select id="form-checkout__installments"></select>
    <select id="form-checkout__identificationType"></select>
    <input type="text" id="form-checkout__identificationNumber" />
    <input type="email" id="form-checkout__cardholderEmail" />

    <button type="submit" id="form-checkout__submit">Pagar</button>
    <progress value="0" class="progress-bar">Carregando...</progress>

  </form>
Inicializar formulário de pagamento
Após adicionar o formulário de pagamento, é preciso inicializá-lo. Esta etapa consiste em relacionar o ID de cada campo do formulário com os atributos correspondentes. A biblioteca será responsável pelo preenchimento, obtenção e validação de todos os dados necessários no momento de confirmação do pagamento.

Importante
Ao enviar o formulário, um token, chamado de CardToken, é gerado, representando de forma segura os dados do cartão. É possível acessá-lo através da função cardForm.getCardFormData(), como mostrado abaixo no callback onSubmit. Além disso, este token também é armazenado em um input oculto dentro do formulário no qual poderá ser encontrado com a nomenclatura MPHiddenInputToken. Leve em consideração que o CardToken pode ser usado somente uma vez e expira dentro de 7 dias.
const cardForm = mp.cardForm({
amount: "100.5",
iframe: true,
form: {
id: "form-checkout",
cardNumber: {
id: "form-checkout**cardNumber",
placeholder: "Número do cartão",
},
expirationDate: {
id: "form-checkout**expirationDate",
placeholder: "MM/YY",
},
securityCode: {
id: "form-checkout**securityCode",
placeholder: "Código de segurança",
},
cardholderName: {
id: "form-checkout**cardholderName",
placeholder: "Titular do cartão",
},
issuer: {
id: "form-checkout**issuer",
placeholder: "Banco emissor",
},
installments: {
id: "form-checkout**installments",
placeholder: "Parcelas",
},  
 identificationType: {
id: "form-checkout**identificationType",
placeholder: "Tipo de documento",
},
identificationNumber: {
id: "form-checkout**identificationNumber",
placeholder: "Número do documento",
},
cardholderEmail: {
id: "form-checkout\_\_cardholderEmail",
placeholder: "E-mail",
},
},
callbacks: {
onFormMounted: error => {
if (error) return console.warn("Form Mounted handling error: ", error);
console.log("Form mounted");
},
onSubmit: event => {
event.preventDefault();

          const {
            paymentMethodId: payment_method_id,
            issuerId: issuer_id,
            cardholderEmail: email,
            amount,
            token,
            installments,
            identificationNumber,
            identificationType,
          } = cardForm.getCardFormData();

          fetch("/process_payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              issuer_id,
              payment_method_id,
              transaction_amount: Number(amount),
              installments: Number(installments),
              description: "Descrição do produto",
              payer: {
                email,
                identification: {
                  type: identificationType,
                  number: identificationNumber,
                },
              },
            }),
          });
        },
        onFetching: (resource) => {
          console.log("Fetching resource: ", resource);

          // Animate progress bar
          const progressBar = document.querySelector(".progress-bar");
          progressBar.removeAttribute("value");

          return () => {
            progressBar.setAttribute("value", "0");
          };
        }
      },
    });

Importante
Caso necessite adicionar ou modificar alguma lógica no fluxo dos métodos do Javascript consulte a documentação Integração via Métodos Core
Enviar pagamento
Para continuar o processo de integração de pagamento via cartão, é necessário que o backend receba a informação do formulário com o token gerado e os dados completos conforme indicado nas etapas anteriores.

No exemplo da seção anterior, enviamos todos os dados necessários para criar o pagamento para o endpoint process_payment do backend .

Com todas as informações coletadas no backend , envie um POST com os atributos necessários, atentando-se aos parâmetros token, transaction_amount, installments, payment_method_id e o payer.email ao endpoint /v1/payments e execute a requisição ou, se preferir, faça o envio das informações utilizando nossos SDKs.

Importante
Para aumentar as chances de aprovação do pagamento e evitar que a análise antifraude não autorize a transação, recomendamos inserir o máximo de informação sobre o comprador ao realizar a requisição. Para mais detalhes sobre como aumentar as chances de aprovação, veja Como melhorar a aprovação dos pagamentos.

Além disso, você deverá enviar obrigatoriamente o atributo X-Idempotency-Key. Seu preenchimento é importante para garantir a execução e reexecução de requisições de forma segura, sem o risco de realizar a mesma ação mais de uma vez por engano. Para isso, atualize nossa biblioteca de SDK ou gere um UUID V4 e envie-o no header de suas chamadas. Importante: Os valores admitidos no cabeçalho têm limitações e não é permitido o formato "prefixo" + "\_". Exemplo inválido: payment_1298ey98sdsdh12hsd-12esvv. Exemplo válido: payment192839qw8sd7db-2xx2s-23wds.
import { Payment, MercadoPagoConfig } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: '<ACCESS_TOKEN>' });

payment.create({
body: {
transaction_amount: req.transaction_amount,
token: req.token,
description: req.description,
installments: req.installments,
payment_method_id: req.paymentMethodId,
issuer_id: req.issuer,
payer: {
email: req.email,
identification: {
type: req.identificationType,
number: req.number
}}},
requestOptions: { idempotencyKey: '<SOME_UNIQUE_VALUE>' }
})
.then((result) => console.log(result))
.catch((error) => console.log(error));
A resposta trará o seguinte resultado

{
"status": "approved",
"status_detail": "accredited",
"id": 3055677,
"date_approved": "2019-02-23T00:01:10.000-04:00",
"payer": {
...
},
"payment_method_id": "visa",
"payment_type_id": "credit_card",
"refunds": [],
...
}
Atenção
Os pagamentos criados possuem os seguintes status: "Pendente", "Rejeitado" e "Aprovado". Para acompanhar as atualizações é necessário configurar seu sistema para receber as notificações de pagamentos e outras atualizações de status. Veja Notificações para mais detalhes.
Exemplo de código

link do exemplo no github: https://github.com/mercadopago/card-payment-sample-node
