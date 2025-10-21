Introdução
Comece aqui
Pegue seu café e aprenda sobre a AbacatePay!

Nesta documentação você encontrará tudo o que precisa para integrar com a API da AbacatePay. Desenvolvida por desenvolvedores para desenvolvedores, nossa plataforma foi projetada para ser intuitiva e fácil de usar.
​
  O que é a AbacatePay?
A AbacatePay é um gateway de pagamento que surgiu da nossa própria necessidade de simplificar cobranças em nossos produtos. Percebemos que os meios de pagamento existentes eram excessivamente complexos:
Documentações extensas e confusas
Processos de homologação longos e burocráticos
Múltiplas formas de realizar a mesma operação
Alguns gateways até exigem cursos para integração!
Nossa solução? Uma plataforma que transforma a complexidade das Fintechs em uma API simples e intuitiva. Veja como é fácil:

Copy
// Exemplo de criação de cobrança
const payment = await abacatePay.payments.create({
  amount: 1000,
  description: "Serviço prestado"
});
​
  API descomplicada
Nossa API foi construída com três princípios fundamentais:
Baseada em intenção: Cada endpoint representa exatamente o que você lê

Copy
POST /billing/create    // Cria um pagamento
GET /billing/get       // Busca um pagamento específico
Idempotente: Execute a mesma requisição quantas vezes precisar, sem efeitos colaterais

Copy
// Seguro para executar múltiplas vezes
await abacatePay.billing.create({...});
Consistente: Nossa API retorna sempre um option contendo o erro ou os dados de retorno, o que facilita a implementação em linguagens de tipagem forte e consistência em todas as operações.

Copy
{
  "data": {
      "id": "bill_12345667",
      "url": "https://abacatepay.com/pay/bill_12345667",
      "amount": 1000,
      "status": "PENDING",
      "devMode": true,
      "methods": ["PIX", "CARD"],
      "frequency": "ONE_TIME",
      "nextBilling": null,
      "customer": {
         "id": "cust_12345",
         "metadata": {
            "email": "customer@example.com"
         }
      },
      "createdAt": "2024-11-04T18:38:28.573",
      "updatedAt": "2024-11-04T18:38:28.573",
   },
   "error": null
}
Para facilitar ainda mais, oferecemos SDKs oficiais e suporte a modo de desenvolvimento com chaves de API dedicadas.
​
  Dúvidas?
Nossa equipe está sempre pronta para ajudar! Entre em contato pelo email  ajuda@abacatepay.com
Dev mode, o que é?
Ask a question...

x
github
linkedin



Introdução
Dev mode, o que é?
Aprenda o que é dev mode e como utilizar da melhor forma

O Dev mode é o ambiente de desenvolvimento da AbacatePay, projetado para permitir que você teste todas as funcionalidades da plataforma de forma segura e controlada.
​
  O que é o Dev mode?
Quando você cria sua conta na AbacatePay, ela é automaticamente configurada em Dev mode. Neste ambiente:
Todas as operações são simuladas
Nenhuma transação real é processada
Você pode testar todas as funcionalidades sem riscos
Os dados são isolados do ambiente de produção
Benefícios do Dev mode
Teste suas integrações com segurança
Experimente diferentes cenários de pagamento
Configure webhooks e receba notificações de teste
Valide o fluxo completo da sua aplicação
​
  Usando o Dev mode
Para começar a testar:
Crie uma chave de API no ambiente de desenvolvimento
Use esta chave em suas requisições de teste
Configure webhooks para receber notificações de teste
Valide todos os fluxos da sua aplicação
Dicas para Testes Efetivos
Teste todos os cenários possíveis
Valide o tratamento de erros
Verifique as notificações de webhook
Confirme a integração com seu sistema
​
  Próximos Passos
Quando estiver confiante com sua integração:
Desative o Dev mode
Complete o processo de verificação da conta
Aguarde a aprovação para produção
Comece a processar transações reais
Precisa de ajuda?
Nossa equipe está disponível para auxiliar no processo de desenvolvimento. Entre em contato pelo e-mail  ajuda@abacatepay.com


Introdução
Autenticação
Como enviar requisições para a nossa API

Chave de API: Sua credencial de acesso à API da AbacatePay. Esta chave identifica sua conta e autoriza suas requisições. IMPORTANTE: Sem a chave de API, as requisições serão recusadas.
​
  Gerenciando chaves de API
Gerencie suas chaves de API diretamente em nossa plataforma. Você pode:
Listar todas as chaves ativas
Criar novas chaves
Revogar chaves existentes
Ambientes e Chaves de API
Todas as requisições são enviadas para o mesmo endpoint (https://api.abacatepay.com), mas o ambiente é determinado pela chave de API utilizada:
Chaves criadas em dev mode processam transações no ambiente de testes
Chaves criadas em produção processam transações reais
Saiba mais sobre o ambiente de desenvolvimento aqui.
Erro de Autenticação
A API retornará o código HTTP 401 quando:
A chave de API não for fornecida no header
A chave for inválida
A chave tiver sido revogada
​
  Criando chaves de API
Boas Práticas de Segurança
Armazene suas chaves em variáveis de ambiente ou gerenciadores de segredos
Nunca compartilhe suas chaves de API
A AbacatePay nunca solicitará suas chaves
Revogue imediatamente qualquer chave comprometida
​
Como criar sua chave de API
Siga estes passos no dashboard da AbacatePay:
1
Acesse a Seção de Integração

Interface da plataforma AbacatePay mostrando o botão de criação de chave
Clique no botão 'Criar Chave'
Inicie o processo de criação de uma nova chave de API
2
Adicione uma Descrição

Formulário de criação de chave com campo de descrição
Identifique sua chave
Adicione uma descrição clara para identificar o propósito desta chave
3
Copie sua Chave

Lista de chaves com opção para copiar
Armazene sua chave com segurança
Copie a chave gerada e armazene-a em um local seguro
Após criar sua chave, você pode começar a integrar com nossa API. Lembre-se de incluir a chave em todas as requisições no header Authorization:

Copy
curl -X POST https://api.abacatepay.com/v1/payments \
  -H "Authorization: Bearer sua_chave_api" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000}'
Nota Importante
O mesmo endpoint (https://api.abacatepay.com) é usado tanto para o ambiente de desenvolvimento quanto para produção. O ambiente é determinado automaticamente pela chave de API utilizada na requisição.



Introdução
Webhooks
Configure e receba notificações sobre atualizações

Webhooks permitem que sua aplicação receba notificações em tempo real sobre eventos importantes da AbacatePay.
​
 Gerenciar webhooks
Gerencie seus webhooks diretamente em nossa plataforma. Você pode:
Listar todos os webhooks ativos
Criar novos webhooks
Remover webhooks existentes
Ambientes e Webhooks
Os webhooks são específicos para cada ambiente:
Webhooks criados em dev mode recebem notificações apenas do ambiente de testes
Webhooks criados em produção recebem notificações apenas de dados reais
Saiba mais sobre o ambiente de desenvolvimento aqui.
​
 Criar webhooks
Segurança dos Webhooks
Configure um secret único para cada webhook
Valide o secret em todas as requisições recebidas
Use HTTPS para todas as URLs de webhook
Implemente retry logic para lidar com falhas temporárias
​
Como criar seu webhook
Siga estes passos no dashboard da AbacatePay:
1
Acesse a Seção de Webhooks

Interface da plataforma AbacatePay mostrando a seção de webhooks
Navegue até a seção Webhooks
Inicie o processo de configuração de um novo webhook
2
Inicie a Criação

Formulário de criação de webhook
Clique em 'Criar' e prepare-se para configurar
Você será direcionado ao formulário de configuração
3
Configure seu Webhook

Preencha os campos necessários:
Nome: Identificador único para seu webhook (ex: “Notificações de Pagamento”)
URL: Endpoint HTTPS que receberá as notificações
Secret: Chave secreta para validar as requisições
​
 Segurança e verificação
As notificações podem (e devem) ser validadas em duas camadas complementares:
​
1) Secret na URL (autenticação simples)
Cada chamada de webhook inclui o secret configurado como parâmetro de query string.
URL base do seu webhook:

Copy
https://meusite.com/webhook/abacatepay
URL com secret (como será chamado):

Copy
https://meusite.com/webhook/abacatepay?webhookSecret=seu_secret_aqui
Exemplo de validação (Express):

Copy
app.post('/webhook/abacatepay', (req, res) => {
  const webhookSecret = req.query.webhookSecret;
  if (webhookSecret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }

  const event = req.body;
  console.log('Received webhook:', event);
  res.status(200).json({ received: true });
});
​
2) Assinatura HMAC no cabeçalho (integridade do corpo)
Além do webhookSecret, valide a integridade da mensagem conferindo a assinatura enviada em X-Webhook-Signature. O exemplo abaixo mostra como validar a assinatura HMAC-SHA256 de forma segura.

Copy
import crypto from "node:crypto";

// Public HMAC key
const ABACATEPAY_PUBLIC_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

/**
 * Verifies if the webhook signature matches the expected HMAC.
 * @param rawBody Raw request body string.
 * @param signatureFromHeader The signature received from `X-Webhook-Signature`.
 * @returns true if the signature is valid, false otherwise.
 */
export function verifyAbacateSignature(rawBody: string, signatureFromHeader: string) {
  const bodyBuffer = Buffer.from(rawBody, "utf8")

  const expectedSig = crypto
    .createHmac("sha256", ABACATEPAY_PUBLIC_KEY)
    .update(bodyBuffer)
    .digest("base64");

  const A = Buffer.from(expectedSig);
  const B = Buffer.from(signatureFromHeader);

  return A.length === B.length && crypto.timingSafeEqual(A, B);
}
Importante: para que a verificação funcione, leia o corpo bruto da requisição (sem transformações) antes de qualquer middleware que faça parsing. Use exatamente os mesmos bytes recebidos ao calcular o HMAC.
​
 Eventos Suportados
Atualmente, suportamos os seguintes eventos:
​
billing.paid
Este evento é disparado quando um pagamento é confirmado. O payload varia dependendo da origem do pagamento:
PIX QR Code
Cobrança

Copy
{
  "id": "log_12345abcdef",
  "data": {
    "payment": {
      "amount": 1000,
      "fee": 80,
      "method": "PIX"
    },
    "pixQrCode": {
      "amount": 1000,
      "id": "pix_char_mXTWdj6sABWnc4uL2Rh1r6tb",
      "kind": "PIX",
      "status": "PAID"
    }
  },
  "devMode": false,
  "event": "billing.paid"
}
​
withdraw.done
Este evento é disparado quando um saque é concluído com sucesso. O payload contém o objeto Transaction:

Copy
{
  "id": "log_12345abcdef",
  "data": {
    "transaction": {
      "id": "tran_123456",
      "status": "COMPLETE",
      "devMode": false,
      "receiptUrl": "https://abacatepay.com/receipt/tran_123456",
      "kind": "WITHDRAW",
      "amount": 5000,
      "platformFee": 80,
      "externalId": "withdraw-1234",
      "createdAt": "2025-03-24T21:50:20.772Z",
      "updatedAt": "2025-03-24T21:55:20.772Z"
    }
  },
  "devMode": false,
  "event": "withdraw.done"
}
​
withdraw.failed
Este evento é disparado quando um saque não é concluído. O payload contém o objeto Transaction:

Copy
{
  "id": "log_12345abcdef",
  "data": {
    "transaction": {
      "id": "tran_789012",
      "status": "CANCELLED",
      "devMode": false,
      "receiptUrl": "https://abacatepay.com/receipt/tran_789012",
      "kind": "WITHDRAW",
      "amount": 3000,
      "platformFee": 0,
      "externalId": "withdraw-5678",
      "createdAt": "2025-03-24T22:00:20.772Z",
      "updatedAt": "2025-03-24T22:05:20.772Z"
    }
  },
  "devMode": false,
  "event": "withdraw.failed"
}
Boas práticas e notas importantes
O campo devMode indica se o evento ocorreu no ambiente de desenvolvimento
Valores monetários são expressos em centavos
O campo fee representa a taxa cobrada pela AbacatePay
O campo event identifica o tipo de evento recebido
Implemente retries idempotentes e processe cada id de evento uma única vez
Registre falhas de verificação e responda com 4xx/5xx apropriadamente
Precisa de ajuda?
Nossa equipe está disponível para auxiliar na implementação de webhooks. Entre em contato pelo e-mail  ajuda@abacatepay.com


Introdução
Indo para produção
Como sair do dev mode e começar a faturar

Ao migrar do ambiente de desenvolvimento para produção, você precisará completar o processo de verificação da sua conta. Este processo é necessário para garantir a segurança e conformidade das operações.
​
  Processo de Verificação
Para ativar sua conta em produção, siga estes passos:
1
Acesse o Modo de Produção

Interface da plataforma AbacatePay mostrando o botão de Dev mode
Desative o Dev mode
Clique no botão “Dev mode” no canto superior direito da plataforma para iniciar o processo de migração
2
Complete o Cadastro

Formulário de documentação da AbacatePay
Forneça as Informações Necessárias
Preencha os dados da sua empresa, informações dos sócios e anexe os documentos solicitados:
Documentos da empresa
Documentos dos sócios
Comprovante de endereço
Outros documentos específicos do seu segmento
Processo de Aprovação
Após o envio dos documentos:
Nossa equipe analisará sua documentação
Você receberá uma resposta em até 24 horas
O e-mail de aprovação conterá instruções para os próximos passos
Dicas para Aprovação Rápida
Certifique-se de que todos os documentos estão legíveis
Verifique se as informações estão atualizadas
Mantenha os dados consistentes em todos os documentos
Responda prontamente a qualquer solicitação adicional
Precisa de ajuda?
Nossa equipe está disponível para auxiliar no processo de migração. Entre em contato pelo e-mail  ajuda@abacatepay.com



Introdução
SDKs
Bibliotecas oficiais para integração com a API da AbacatePay

Acelere sua integração com nossos SDKs: Nossas bibliotecas oficiais facilitam a integração com a API da AbacatePay em várias linguagens de programação.
​
  O que são os SDKs da AbacatePay?
Os SDKs (Software Development Kits) da AbacatePay são bibliotecas que simplificam a comunicação com nossa API. Eles oferecem uma interface amigável e específica para cada linguagem, permitindo que você integre rapidamente nossos serviços de pagamento ao seu aplicativo.
Benefícios de usar nossos SDKs
Integração simplificada: Funções prontas para todos os endpoints da API
Tipagem forte: Interfaces completas em linguagens com suporte a tipos
Tratamento de erros: Gerenciamento automático dos casos de erro mais comuns
Menor curva de aprendizado: Não é necessário conhecer todos os detalhes da API
Atualizações frequentes: Mantemos os SDKs atualizados com as mais recentes funcionalidades
​
  SDKs Disponíveis
Oferecemos SDKs oficiais para diversas linguagens de programação. Escolha o que melhor se adapta à sua stack tecnológica:
Backend
Mobile
Node.js
SDK oficial para Node.js, compatível com TypeScript e ES modules.
Python
SDK oficial para Python 3.10+, com suporte a async/await e type hints.
Java
SDK oficial para Java 8+, compatível com Spring Boot e Jakarta EE.
PHP
SDK oficial para PHP 7.4+, com suporte a Composer e PSR standards.
Ruby
SDK oficial para Ruby 2.6+, disponível como gem e com suporte a Rails.
Go
SDK oficial para Go 1.13+, com suporte a módulos e generics.
Rust
SDK oficial para Rust, com foco em segurança e performance.
Elixir
SDK oficial para Elixir, ideal para aplicações escaláveis e distribuídas.
​
  Exemplos de Uso
Veja como é simples usar nossos SDKs em algumas das linguagens mais populares:

Node.js

Python

PHP

Copy
// Instalação: npm install abacatepay-nodejs-sdk
import AbacatePay from 'abacatepay-nodejs-sdk';

// Inicialize o cliente com sua chave de API
const abacate = AbacatePay('your_api_key');

// Crie um pagamento PIX
async function createPixPayment() {
  const billing = await abacate.billing.create({
    frequency: "ONE_TIME",
    methods: ["PIX"],
    products: [
      {
        externalId: "PRO-PLAN",
        name: "Pro plan",
        quantity: 1,
        price: 1000 // Amount in cents
      }
    ],
    returnUrl: "https://yoursite.com/app",
    completionUrl: "https://yoursite.com/payment/success",
    customer: {
      email: 'customer@example.com'
    }
  });

  return billing
}

createPixPayment();
​
  Perguntas Frequentes
Como instalar o SDK da minha linguagem?

Os SDKs funcionam tanto em modo de desenvolvimento quanto em produção?

O que fazer se encontrar um bug em um SDK?

Falta um SDK para a linguagem que eu uso. O que fazer?

​
  Recursos Adicionais
Webhooks
Aprenda a configurar webhooks para receber notificações de eventos.
Ambiente de Desenvolvimento
Saiba como usar o ambiente de desenvolvimento para testar suas integrações.
Precisa de ajuda com integração?
Nossa equipe está disponível para ajudar com qualquer dúvida sobre nossos SDKs. Entre em contato pelo e-mail  ajuda@abacatepay.com


Cliente
Referência
Gerencie seus clientes, aqueles que pagam você.

Um cliente é seu usuário final, aquele que você vai cobrar e pagar o seu produto.
​
  Estrutura
Um cliente é representado em nossa API pela seguinte estrutura:

Copy
{
  "id": "cust_aebxkhDZNaMmJeKsy0AHS0FQ",
  "metadata": {
    "name": "Test Customer",
    "cellphone": "11999999999",
    "taxId": "12345678900",
    "email": "test@example.com"
  }
} 
​
Atributos
​
id:

Copy
{
  "id": "cust_aebxkhDZNaMmJeKsy0AHS0FQ",
} 
id : string.
Id único do cliente na AbacatePay
​
metadados:
Objeto com os dados do cliente
json

Copy
{
  "metadata": {
    "name": "Test Customer",
    "cellphone": "11999999999",
    "taxId": "12345678900",
    "email": "test@example.com"
  }
} 
name : string.
Nome do cliente (opcional)
cellphone : string.
Telefone do cliente (opcional)
taxId : string.
Documento válido do cliente, podendo ser CPF ou CNPJ (opcional)
email : string.
E-mail do cliente (obrigatório)
Não é possível criar um cliente com CPF/CNPJ inválido e caso já exista um cliente com esse CPF/CNPJ, a API não criará o cliente novo mas retornará o cliente já existente
SDKs
Criar um novo Cliente
Ask a question...

x
github
linkedin




Cliente
Criar um novo Cliente
Permite que você crie um novo cliente para a sua loja.

curl --request POST \
  --url https://api.abacatepay.com/v1/customer/create \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Daniel Lima",
  "cellphone": "(11) 4002-8922",
  "email": "daniel_lima@abacatepay.com",
  "taxId": "123.456.789-01"
}'

Authorizations
​
Authorization
stringheaderrequired
Cabeçalho de autenticação Bearer no formato Bearer <abacatepay-api-key> onde <abacatepay-api-key> é a sua chave de API.

{
  "data": {
    "id": "bill_123456",
    "metadata": {
      "name": "Daniel Lima",
      "cellphone": "(11) 4002-8922",
      "email": "daniel_lima@abacatepay.com",
      "taxId": "123.456.789-01"
    }
  },
  "error": null
}


Body
application/json
Os dados do seu cliente caso deseje criá-lo no momento da criação da sua cobrança.

​
name
stringrequired
Nome completo do seu cliente

Example:
"Daniel Lima"


curl --request POST \
  --url https://api.abacatepay.com/v1/customer/create \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Daniel Lima",
  "cellphone": "(11) 4002-8922",
  "email": "daniel_lima@abacatepay.com",
  "taxId": "123.456.789-01"
}'


Body
application/json
Os dados do seu cliente caso deseje criá-lo no momento da criação da sua cobrança.

​
name
stringrequired
Nome completo do seu cliente

Example:
"Daniel Lima"

​
cellphone
stringrequired
Celular do cliente

Example:
"(11) 4002-8922"

​
email
stringrequired
E-mail do cliente

Example:
"daniel_lima@abacatepay.com"

​
taxId
stringrequired
CPF ou CNPJ válido do cliente.

Example:
"123.456.789-01"

Response

200

application/json
Cliente criado com sucesso.

​
data
object
Os dados do seu cliente.

Show child attributes

​
error
null


Cliente
Listar Clientes
Permite que você recupere uma lista de todos os seus clientes.

GET
/
customer
/
list

Try it
Authorizations
​
Authorization
stringheaderrequired
Cabeçalho de autenticação Bearer no formato Bearer <abacatepay-api-key> onde <abacatepay-api-key> é a sua chave de API.

Response

200

application/json
Lista de clientes retornada com sucesso.

​
data
object[]
Lista de clientes.

Show child attributes

​
error
null


curl --request GET \
  --url https://api.abacatepay.com/v1/customer/list \
  --header 'Authorization: Bearer <token>'

  {
  "data": [
    {
      "id": "bill_123456",
      "metadata": {
        "name": "Daniel Lima",
        "cellphone": "(11) 4002-8922",
        "email": "daniel_lima@abacatepay.com",
        "taxId": "123.456.789-01"
      }
    }
  ],
  "error": null
}

Cobrança
Referência
Crie um link de cobrança e deixe seu cliente pagar

Uma cobrança é um portal onde seu cliente pode realizar um pagamento sem interrupções.
Tipos de cobrança:
ONE_TIME: Cobrança que aceita um único pagamento do mesmo cliente.
MULTIPLE_PAYMENTS: Cobrança em modo link de pagamento, aceita vários pagamentos de clientes diferentes.
​
 Estrutura
Uma cobrança é representada em nossa API pela seguinte estrutura:
json

Copy
{
  "id": "bill_uA0M0xwg5R4mSyr0n2PjHQXY",
  "frequency": "ONE_TIME",
  "url": "https://abacatepay.com/pay/bill_uA0M0xwg5R4mSyr0n2PjHQXY",
  
  "status": "PAID",
  "devMode": true,
  "methods": ["PIX"],
  "products": [
    {
      "id": "prod_dNFbdDjfpaegmzBWWdNM2Huw",
      "externalId": "prod-1234",
      "quantity": 1
    }
  ],
  "customer": {
    "id": "cust_aebxkhDZNaMmJeKsy0AHS0FQ",
    "metadata": {
      "name": "Test Customer",
      "cellphone": "11999999999",
      "taxId": "12345678900",
      "email": "test@example.com"
    }
  },
  "metadata": {
    "fee": 100,
    "returnUrl": "https://example.com/billing",
    "completionUrl": "https://example.com/completion"
  },
  "nextBilling": null,
  "allowCoupons": false,
  "coupons": [],
  "createdAt": "2024-12-06T18:56:15.538Z",
  "updatedAt": "2024-12-06T18:56:15.538Z"
}
​
Atributos:
id:

frequency:

url:

status:

methods:

products:

customer:

metadata:

nextBilling:

allowCoupons:

coupons:

Listar Clientes
Criar uma nova Cobrança


Cobrança
Referência
Crie um link de cobrança e deixe seu cliente pagar

Uma cobrança é um portal onde seu cliente pode realizar um pagamento sem interrupções.
Tipos de cobrança:
ONE_TIME: Cobrança que aceita um único pagamento do mesmo cliente.
MULTIPLE_PAYMENTS: Cobrança em modo link de pagamento, aceita vários pagamentos de clientes diferentes.
​
 Estrutura
Uma cobrança é representada em nossa API pela seguinte estrutura:
json

Copy
{
  "id": "bill_uA0M0xwg5R4mSyr0n2PjHQXY",
  "frequency": "ONE_TIME",
  "url": "https://abacatepay.com/pay/bill_uA0M0xwg5R4mSyr0n2PjHQXY",
  
  "status": "PAID",
  "devMode": true,
  "methods": ["PIX"],
  "products": [
    {
      "id": "prod_dNFbdDjfpaegmzBWWdNM2Huw",
      "externalId": "prod-1234",
      "quantity": 1
    }
  ],
  "customer": {
    "id": "cust_aebxkhDZNaMmJeKsy0AHS0FQ",
    "metadata": {
      "name": "Test Customer",
      "cellphone": "11999999999",
      "taxId": "12345678900",
      "email": "test@example.com"
    }
  },
  "metadata": {
    "fee": 100,
    "returnUrl": "https://example.com/billing",
    "completionUrl": "https://example.com/completion"
  },
  "nextBilling": null,
  "allowCoupons": false,
  "coupons": [],
  "createdAt": "2024-12-06T18:56:15.538Z",
  "updatedAt": "2024-12-06T18:56:15.538Z"
}
​
Atributos:
id:

json

Copy
{
"id": "bill_uA0M0xwg5R4mSyr0n2PjHQXY",
} 
id : string.
Id único da cobrança na AbacatePay
frequency:

json

Copy
{
"frequency": "ONE_TIME",
}
frequency : string.
Frequência da cobrança. Pode ser ONE_TIME ou MULTIPLE_PAYMENTS.
ONE_TIME	Cobrança que aceita um único pagamento do mesmo cliente.
MULTIPLE_PAYMENTS	Cobrança em modo link de pagamento, aceita vários pagamentos de clientes diferentes.
url:

json

Copy
 {
   "url": "https://abacatepay.com/pay/bill_uA0M0xwg5R4mSyr0n2PjHQXY",
 }
url : string.
URL para seu cliente executar o pagamento da cobrança
status:

json

Copy
{
  "status": "PAID",
}
status : string.
Status da cobrança. Pode ser PENDING, EXPIRED, CANCELLED, PAID, REFUNDED
PENDING	A cobrança está com o pagamento pendente
EXPIRED	O tempo limite de pagamento foi excedido
CANCELLED	A cobrança foi cancelada por você
PAID	A cobrança foi paga com sucesso pelo cliente
REFUNDED	O valor foi devolvido ao cliente
methods:

json

Copy
 {
   "methods": ["PIX", "CARD"],
 }
methods : array
Tipos de pagamento suportados: PIX e CARD (beta).
Cartão de crédito (beta)
Pagamentos por cartão estão em beta. Para habilitar, entre em contato com o suporte: ajuda@abacatepay.com
products:

json

Copy
 {
 "products":
 [
   {
     "id": "prod_dNFbdDjfpaegmzBWWdNM2Huw",
     "externalId": "prod-1234",
     "quantity": 1
   }
 ],
 }
products : array
Lista de produtos inclusos na cobrança
customer:

json

Copy
{
  "customer": {
    "id": "cust_aebxkhDZNaMmJeKsy0AHS0FQ",
    "metadata": {
      "name": "Test Customer",
      "cellphone": "11999999999",
      "taxId": "12345678900",
      "email": "test@example.com"
    }
  }
}
customer : object
Cliente que você está cobrando. Opcional. Veja referência da estrutura aqui
metadata:

json

Copy
{
  "metadata": {
    "fee": 100,
    "returnUrl": "https://example.com/billing",
    "completionUrl": "https://example.com/completion"
  }
}
metadata : object
Objeto com metadados sobre a cobrança
fee number Taxa aplicada pela AbacatePay
returnUrl string URL que o cliente será redirecionado ao clicar no botão “voltar”
completionUrl string URL que o cliente será redirecionado ao realizar o pagamento
nextBilling:

json

Copy
{
  "nextBilling": null,
}
nextBilling : date-time | null.
Data e hora da próxima cobrança, ou null para cobranças únicas
allowCoupons:

json

Copy
{
  "allowCoupons": false,
}
allowCoupons : bool | null.
Permite ou não cupons para a cobrança
coupons:

json

Copy
{
  "coupons": [],
}
coupons : array
Cupons permitidos na cobrança. Só são considerados os cupons se allowCoupons é verdadeiro.
Listar Clientes
Criar uma nova Cobrança
Ask a question...

x
github
linkedin


Cobrança
Criar uma nova Cobrança
Permite que você crie um link de cobrança pro seu cliente pagar você.

POST
/
billing
/
create

Try it
Authorizations
​
Authorization
stringheaderrequired
Cabeçalho de autenticação Bearer no formato Bearer <abacatepay-api-key> onde <abacatepay-api-key> é a sua chave de API.

Body
application/json
​
frequency
enum<string>default:ONE_TIMErequired
Define o tipo de frequência da cobrança. Para cobranças únicas, use ONE_TIME. Para cobranças que podem ser pagas mais de uma vez, use MULTIPLE_PAYMENTS.

Available options: ONE_TIME, MULTIPLE_PAYMENTS 
Example:
"ONE_TIME"

​
methods
enum<string>[]required
Métodos de pagamento que serão utilizados. Atualmente, apenas PIX é suportado, CARD encontra-se em beta.

Required array length: 1 - 2 elements
Show child attributes

Example:
["PIX"]
​
products
object[]required
Lista de produtos que seu cliente está pagando.

Minimum length: 1
Show child attributes

Example:
[
  {
    "externalId": "prod-1234",
    "name": "Assinatura de Programa Fitness",
    "description": "Acesso ao programa fitness premium por 1 mês.",
    "quantity": 2,
    "price": 2000
  }
]
​
returnUrl
string<uri>required
URL para redirecionar o cliente caso o mesmo clique na opção "Voltar".

Example:
"https://example.com/billing"

​
completionUrl
string<uri>required
URL para redirecionar o cliente quando o pagamento for concluído.

Example:
"https://example.com/completion"

​
customerId
string
O id de um cliente já cadastrado em sua loja.

Example:
"cust_abcdefghij"

​
customer
object
Dados do seu cliente. Caso o cliente não exista ele será criado.

Show child attributes

​
allowCoupons
booleandefault:false
Se verdadeiro cupons podem ser usados na billing

Example:
false

​
coupons
string[]
Lista de cupons disponíveis para resem usados com a billing

Maximum length: 50
Example:
["ABKT10", "ABKT5", "PROMO10"]
​
externalId
string
Caso você tenha um identificador único da sua aplicação para cobranças, completamente opcional.

Example:
"seu_id_123"

Response

200

application/json
Cobrança criada com sucesso.

​
data
object
Show child attributes

​
error
null

curl --request POST \
  --url https://api.abacatepay.com/v1/billing/create \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "frequency": "ONE_TIME",
  "methods": [
    "PIX"
  ],
  "products": [
    {
      "externalId": "prod-1234",
      "name": "Assinatura de Programa Fitness",
      "description": "Acesso ao programa fitness premium por 1 mês.",
      "quantity": 2,
      "price": 2000
    }
  ],
  "returnUrl": "https://example.com/billing",
  "completionUrl": "https://example.com/completion",
  "customerId": "cust_abcdefghij",
  "customer": {
    "name": "Daniel Lima",
    "cellphone": "(11) 4002-8922",
    "email": "daniel_lima@abacatepay.com",
    "taxId": "123.456.789-01"
  },
  "allowCoupons": false,
  "coupons": [
    "ABKT10",
    "ABKT5",
    "PROMO10"
  ],
  "externalId": "seu_id_123"
}'

{
  "data": {
    "id": "bill_123456",
    "url": "https://pay.abacatepay.com/bill-5678",
    "amount": 4000,
    "status": "PENDING",
    "devMode": true,
    "methods": [
      "PIX"
    ],
    "products": [
      {
        "id": "prod_123456",
        "externalId": "prod-1234",
        "quantity": 2
      }
    ],
    "frequency": "ONE_TIME",
    "nextBilling": "null",
    "customer": {
      "id": "bill_123456",
      "metadata": {
        "name": "Daniel Lima",
        "cellphone": "(11) 4002-8922",
        "email": "daniel_lima@abacatepay.com",
        "taxId": "123.456.789-01"
      }
    },
    "allowCoupons": false,
    "coupons": []
  },
  "error": null
}

Cobrança
Listar Cobranças
Permite que você recupere uma lista de todas as cobranças criadas.

GET
/
billing
/
list

Try it
Authorizations
​
Authorization
stringheaderrequired
Cabeçalho de autenticação Bearer no formato Bearer <abacatepay-api-key> onde <abacatepay-api-key> é a sua chave de API.

Response

200

application/json
Lista de cobranças retornada com sucesso.

​
data
object[]
Lista de cobranças criadas.

Show child attributes

​
error
null

curl --request GET \
  --url https://api.abacatepay.com/v1/billing/list \
  --header 'Authorization: Bearer <token>'


  {
  "data": [
    {
      "id": "bill_123456",
      "url": "https://pay.abacatepay.com/bill-5678",
      "amount": 4000,
      "status": "PENDING",
      "devMode": true,
      "methods": [
        "PIX"
      ],
      "products": [
        {
          "id": "prod_123456",
          "externalId": "prod-1234",
          "quantity": 2
        }
      ],
      "frequency": "ONE_TIME",
      "nextBilling": "null",
      "customer": {
        "id": "bill_123456",
        "metadata": {
          "name": "Daniel Lima",
          "cellphone": "(11) 4002-8922",
          "email": "daniel_lima@abacatepay.com",
          "taxId": "123.456.789-01"
        }
      },
      "allowCoupons": false,
      "coupons": []
    }
  ],
  "error": null
}


Pix QRCode
Referência
Gere um QRCode Pix e um código copia-e-cola para o seu cliente

​
 Estrutura
Uma cobrança via QRCode Pix é representada em nossa API pela seguinte estrutura:
json

Copy
{
  "id": "pix_charabc123456789",
  "amount": 4000,
  "status": "PAID",
  "devMode": true,
  "method": "PIX",
  "brCode": "...",
  "brCodeBase64": "...",
  "platformFee": 80,
  "description": "Pagamento PIX com AbacatePay",
  "metadata": {
    "pedidoId": "123"
  },
  "createdAt": "2024-12-06T18:56:15.538Z",
  "updatedAt": "2024-12-06T18:56:15.538Z",
  "expiresAt": "2024-12-06T18:56:15.538Z"
}
​
Atributos:
id:

json

Copy
{
"id": "abc123uA0M0xwg5R4mSyr0n2PjHQXY"
} 
id : string.
Identificador único da cobrança.
amount:

json

Copy
{
"amount": 4000
}
amount : number.
Valor da cobrança em centavos (ex: 4000 = R$ 40,00)
status:

json

Copy
{
"status": "PAID"
}
status : string.
Status da cobrança. Pode ser PENDING, EXPIRED, CANCELLED, PAID, REFUNDED.
Status	Descrição
PENDING	A cobrança está com o pagamento pendente
EXPIRED	O tempo limite de pagamento foi excedido
CANCELLED	A cobrança foi cancelada por você
PAID	A cobrança foi paga com sucesso pelo cliente
REFUNDED	O valor foi devolvido ao cliente
devMode:

json

Copy
{
"devMode": true
}
devMode : boolean.
Indica se a cobrança está em ambiente de testes (true) ou produção (false).
method:

json

Copy
{
"method": "PIX"
}
method : string.
Método de pagamento.
brCode:

json

Copy
{
"brCode": "..."
}
brCode : string.
Código PIX (copia-e-cola) para pagamento.
brCodeBase64:

json

Copy
{
"brCodeBase64": "..."
}
brCodeBase64 : string.
Código PIX no formato Base64 (útil para exibição em imagens).
platformFee:

json

Copy
{
"platformFee": 80
}
platformFee : number.
Taxa da plataforma em centavos. Exemplo: 80 significa R$ 0,80.
description:

json

Copy
{
"description": "Pagamento PIX com AbacatePay"
}
description : string.
Descrição da cobrança.
createdAt:

json

Copy
{
"createdAt": "2024-12-06T18:56:15.538Z"
}
createdAt : date-time.
Data e hora da criação da cobrança.
updatedAt:

json

Copy
{
"updatedAt": "2024-12-06T18:56:15.538Z"
}
updatedAt : date-time.
Última atualização da cobrança.
expiresAt:

json

Copy
{
"expiresAt": "2024-12-06T18:56:15.538Z"
}
expiresAt : date-time.
Data e hora de expiração do QRCode.


Pix QRCode
Criar QRCode PIX
Permite que você crie um código copia-e-cola e um QRCode Pix para seu cliente fazer o pagamento.

POST
/
pixQrCode
/
create

Try it
Authorizations
​
Authorization
stringheaderrequired
Cabeçalho de autenticação Bearer no formato Bearer <abacatepay-api-key> onde <abacatepay-api-key> é a sua chave de API.

Body
application/json
​
amount
numberrequired
Valor da cobrança em centavos.

​
expiresIn
number
Tempo de expiração da cobrança em segundos.

​
description
string
Mensagem que aparecerá na hora do pagamento do PIX.

Maximum length: 140
​
customer
object
Os dados do seu cliente para criá-lo.
O objeto de customer não é obrigatório, mas ao informar qualquer informação do customer todos os campos name, cellphone, email e taxId são obrigatórios.

Show child attributes

​
metadata
object
Metadados opcionais para a cobrança

Response

200

application/json
QRCode Pix criado com sucesso

​
data
object
Show child attributes

​
error
null


curl --request POST \
  --url https://api.abacatepay.com/v1/pixQrCode/create \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "amount": 123,
  "expiresIn": 123,
  "description": "<string>",
  "customer": {
    "name": "Daniel Lima",
    "cellphone": "(11) 4002-8922",
    "email": "daniel_lima@abacatepay.com",
    "taxId": "123.456.789-01"
  },
  "metadata": {
    "externalId": "123"
  }
}'


{
  "data": {
    "id": "pix_char_123456",
    "amount": 100,
    "status": "PENDING",
    "devMode": true,
    "brCode": "00020101021226950014br.gov.bcb.pix",
    "brCodeBase64": "data:image/png;base64,iVBORw0KGgoAAA",
    "platformFee": 80,
    "createdAt": "2025-03-24T21:50:20.772Z",
    "updatedAt": "2025-03-24T21:50:20.772Z",
    "expiresAt": "2025-03-25T21:50:20.772Z"
  },
  "error": null
}


Pix QRCode
Simular Pagamento
Simula o pagamento de um QRCode Pix criado no modo de desenvolvimento.

POST
/
pixQrCode
/
simulate-payment

Try it
Authorizations
​
Authorization
stringheaderrequired
Cabeçalho de autenticação Bearer no formato Bearer <abacatepay-api-key> onde <abacatepay-api-key> é a sua chave de API.

Query Parameters
​
id
stringrequired
ID do QRCode Pix

Body
application/json
​
metadata
object
Metadados opcionais para a requisição

Response

200

application/json
Pagamento ralizado com sucesso

​
data
object
Show child attributes

​
error
null

curl --request POST \
  --url https://api.abacatepay.com/v1/pixQrCode/simulate-payment \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "metadata": {}
}'
200
{
  "data": {
    "id": "pix_char_123456",
    "amount": 100,
    "status": "PENDING",
    "devMode": true,
    "brCode": "00020101021226950014br.gov.bcb.pix",
    "brCodeBase64": "data:image/png;base64,iVBORw0KGgoAAA",
    "platformFee": 80,
    "createdAt": "2025-03-24T21:50:20.772Z",
    "updatedAt": "2025-03-24T21:50:20.772Z",
    "expiresAt": "2025-03-25T21:50:20.772Z"
  },
  "error": null
}
401
{
  "error": "Token de autenticação inválido ou ausente."
}

Pix QRCode
Checar Status
Checar status do pagamento do QRCode Pix.

GET
/
pixQrCode
/
check

Try it
Authorizations
​
Authorization
stringheaderrequired
Cabeçalho de autenticação Bearer no formato Bearer <abacatepay-api-key> onde <abacatepay-api-key> é a sua chave de API.

Query Parameters
​
id
stringrequired
ID do QRCode Pix

Response

200

application/json
Status retornado

​
data
object
Show child attributes

​
error
null


curl --request GET \
  --url https://api.abacatepay.com/v1/pixQrCode/check \
  --header 'Authorization: Bearer <token>'

  200

  {
  "data": {
    "status": "PENDING",
    "expiresAt": "2025-03-25T21:50:20.772Z"
  },
  "error": null
}