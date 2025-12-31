import { IExecuteFunctions } from "n8n-workflow";
import { MercadoPagoCredentials, Subscription } from "../types";
import { IResourceHandler } from "./ResourceHandler";
import {
  cleanDocument,
  getDocumentType,
  validateEmail,
  getNodeParameterSafe,
} from "../helpers";
import { makeAuthenticatedRequest } from "../utils/requestHelper";

export class SubscriptionsResource implements IResourceHandler {
  async handleOperation(
    executeFunctions: IExecuteFunctions,
    operation: string,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    switch (operation) {
      case "create":
        return await this.createSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "get":
        return await this.getSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "pause":
        return await this.pauseSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "resume":
        return await this.resumeSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "cancel":
        return await this.cancelSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "list":
        return await this.listSubscriptions(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      default:
        throw new Error(
          `Operação de assinatura "${operation}" não é suportada. ` +
          `Operações disponíveis: create, get, pause, resume, cancel, list. ` +
          `Consulte a documentação: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/`
        );
    }
  }

  private async createSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "SubscriptionsResource.ts:70",
        message: "createSubscription: entry",
        data: { baseUrl: baseUrl },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion
    const planId = executeFunctions.getNodeParameter(
      "planId",
      itemIndex
    ) as string;
    const payerEmail = executeFunctions.getNodeParameter(
      "payerEmail",
      itemIndex
    ) as string;

    // Usar getNodeParameterSafe para campos opcionais
    const payerDocument = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "payerDocument",
      itemIndex,
      ""
    ) as string;
    const startDate = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "startDate",
      itemIndex,
      ""
    ) as string;
    const trialPeriodDays = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "trialPeriodDays",
      itemIndex,
      0
    ) as number;
    const cardTokenId = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "cardTokenId",
      itemIndex,
      ""
    ) as string;
    const subscriptionStatus = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "subscriptionStatus",
      itemIndex,
      "pending"
    ) as string;

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "SubscriptionsResource.ts:120",
        message: "createSubscription: parameters retrieved",
        data: {
          planId: planId,
          payerEmail: payerEmail,
          payerDocument: payerDocument,
          startDate: startDate,
          trialPeriodDays: trialPeriodDays,
          cardTokenId: cardTokenId ? "provided" : "not provided",
          subscriptionStatus: subscriptionStatus,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion

    if (!validateEmail(payerEmail)) {
      throw new Error(
        "E-mail do pagador inválido. " +
        "O campo 'payer_email' é obrigatório conforme a documentação oficial do Mercado Pago. " +
        "Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post"
      );
    }

    const body: any = {
      preapproval_plan_id: planId,
      payer_email: payerEmail,
    };

    // Validação: Se status é "authorized", card_token_id é obrigatório
    if (subscriptionStatus === "authorized" && (!cardTokenId || cardTokenId.trim() === "")) {
      throw new Error(
        "Para criar uma assinatura com status 'authorized', é obrigatório fornecer um Token do Cartão (card_token_id). " +
        "O token deve ser obtido no front-end usando a PUBLIC_KEY do Mercado Pago através do CardForm do Checkout Transparente. " +
        "Veja a documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards " +
        "Alternativamente, crie a assinatura com status 'pending' (sem card_token_id) e receberá um init_point para checkout. " +
        "Referência oficial: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post"
      );
    }

    // Se card_token_id foi fornecido, usar status "authorized"
    // Se não foi fornecido, usar status "pending" para retornar init_point
    if (cardTokenId && cardTokenId.trim() !== "") {
      body.card_token_id = cardTokenId.trim();
      body.status = "authorized";
    } else {
      // Sem card_token_id, criar com status "pending" para obter init_point
      body.status = subscriptionStatus || "pending";
    }

    if (payerDocument && payerDocument.trim() !== "") {
      const docType = getDocumentType(payerDocument);
      if (!docType) {
        throw new Error(
          "CPF/CNPJ inválido. " +
          "Forneça um CPF (11 dígitos) ou CNPJ (14 dígitos) válido, apenas com números. " +
          "Exemplo: CPF '12345678909' ou CNPJ '12345678000190'"
        );
      }
      body.payer = {
        identification: {
          type: docType,
          number: cleanDocument(payerDocument),
        },
      };
    }

    if (startDate && startDate.trim() !== "") {
      body.start_date = new Date(startDate).toISOString();
    }

    if (trialPeriodDays && trialPeriodDays > 0) {
      body.trial_period_days = trialPeriodDays;
    }

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "SubscriptionsResource.ts:186",
        message: "createSubscription: body prepared",
        data: { body: JSON.stringify(body), hasCardToken: !!body.card_token_id },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion

    try {
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "POST",
          url: `${baseUrl}/preapproval`,
          body,
        }
      );
      // #region agent log
      fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "SubscriptionsResource.ts:202",
          message: "createSubscription: response received",
          data: {
            responseId: response?.id,
            hasInitPoint: !!(response?.init_point || response?.sandbox_init_point),
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "C",
        }),
      }).catch(() => {});
      // #endregion
      return response as Subscription;
    } catch (error: any) {
      // #region agent log
      fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "SubscriptionsResource.ts:216",
          message: "createSubscription: error caught",
          data: {
            error: error?.message,
            errorData: error?.response?.data,
            hasCardToken: !!body.card_token_id,
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "E",
        }),
      }).catch(() => {});
      // #endregion

      // Tratamento de erros específicos com mensagens melhoradas
      const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido";
      const errorStatus = error?.response?.status;

      // Erro sobre card_token_id
      if (errorMessage.includes("card_token_id") || errorMessage.includes("card token")) {
        throw new Error(
          `Erro ao criar assinatura: Token do Cartão (card_token_id) é obrigatório para status "authorized". ` +
          `O token deve ser obtido no front-end usando o CardForm do Mercado Pago (Checkout Transparente). ` +
          `Veja a documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards ` +
          `Alternativa: Crie a assinatura com status "pending" (sem card_token_id) para receber um init_point. ` +
          `Erro da API: ${errorMessage}`
        );
      }

      // Erro sobre campos obrigatórios
      if (errorMessage.includes("payer_email") || errorMessage.includes("email")) {
        throw new Error(
          `Erro ao criar assinatura: E-mail do pagador (payer_email) é obrigatório. ` +
          `Forneça um e-mail válido. ` +
          `Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post ` +
          `Erro da API: ${errorMessage}`
        );
      }

      // Erro sobre plano
      if (errorMessage.includes("plan") || errorMessage.includes("preapproval_plan_id")) {
        throw new Error(
          `Erro ao criar assinatura: ID do plano inválido ou não encontrado. ` +
          `Verifique se o planId está correto e se o plano existe. ` +
          `Erro da API: ${errorMessage}`
        );
      }

      // Erro de autenticação
      if (errorStatus === 401 || errorStatus === 403) {
        throw new Error(
          `Erro de autenticação: Verifique suas credenciais do Mercado Pago (Access Token). ` +
          `Certifique-se de estar usando o token correto para o ambiente (sandbox ou produção). ` +
          `Erro da API (${errorStatus}): ${errorMessage}`
        );
      }

      // Erro genérico com referência à documentação
      throw new Error(
        `Erro ao criar assinatura: ${errorMessage} ` +
        `(Status HTTP: ${errorStatus || 'N/A'}). ` +
        `Consulte a documentação oficial: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post`
      );
    }
  }

  private async getSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    const subscriptionId = executeFunctions.getNodeParameter(
      "subscriptionId",
      itemIndex
    ) as string;

    if (!subscriptionId || subscriptionId.trim() === "") {
      throw new Error(
        "ID da assinatura é obrigatório. " +
        "Forneça o ID da assinatura que deseja consultar. " +
        "Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/get"
      );
    }

    try {
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "GET",
          url: `${baseUrl}/preapproval/${subscriptionId}`,
        }
      );

      return response as Subscription;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido";
      const errorStatus = error?.response?.status;

      if (errorStatus === 404) {
        throw new Error(
          `Assinatura não encontrada. Verifique se o ID "${subscriptionId}" está correto. ` +
          `Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/get`
        );
      }

      throw new Error(
        `Erro ao consultar assinatura: ${errorMessage} ` +
        `(Status HTTP: ${errorStatus || 'N/A'}). ` +
        `Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/get`
      );
    }
  }

  private async pauseSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    const subscriptionId = executeFunctions.getNodeParameter(
      "subscriptionId",
      itemIndex
    ) as string;

    if (!subscriptionId || subscriptionId.trim() === "") {
      throw new Error(
        "ID da assinatura é obrigatório para pausar. " +
        "Forneça o ID da assinatura que deseja pausar."
      );
    }

    try {
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "PUT",
          url: `${baseUrl}/preapproval/${subscriptionId}`,
          body: {
            status: "paused",
          },
        }
      );

      return response as Subscription;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido";
      throw new Error(
        `Erro ao pausar assinatura: ${errorMessage}. ` +
        `Verifique se a assinatura existe e está em um status que permite pausa. ` +
        `Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/put`
      );
    }
  }

  private async resumeSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    const subscriptionId = executeFunctions.getNodeParameter(
      "subscriptionId",
      itemIndex
    ) as string;

    if (!subscriptionId || subscriptionId.trim() === "") {
      throw new Error(
        "ID da assinatura é obrigatório para retomar. " +
        "Forneça o ID da assinatura que deseja retomar."
      );
    }

    try {
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "PUT",
          url: `${baseUrl}/preapproval/${subscriptionId}`,
          body: {
            status: "authorized",
          },
        }
      );

      return response as Subscription;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido";
      throw new Error(
        `Erro ao retomar assinatura: ${errorMessage}. ` +
        `Verifique se a assinatura existe e está pausada. ` +
        `Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/put`
      );
    }
  }

  private async cancelSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    const subscriptionId = executeFunctions.getNodeParameter(
      "subscriptionId",
      itemIndex
    ) as string;

    if (!subscriptionId || subscriptionId.trim() === "") {
      throw new Error(
        "ID da assinatura é obrigatório para cancelar. " +
        "Forneça o ID da assinatura que deseja cancelar. " +
        "⚠️ Atenção: O cancelamento é irreversível."
      );
    }

    try {
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "PUT",
          url: `${baseUrl}/preapproval/${subscriptionId}`,
          body: {
            status: "cancelled",
          },
        }
      );

      return response as Subscription;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido";
      throw new Error(
        `Erro ao cancelar assinatura: ${errorMessage}. ` +
        `Verifique se a assinatura existe e pode ser cancelada. ` +
        `⚠️ Atenção: O cancelamento é irreversível. ` +
        `Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/put`
      );
    }
  }

  private async listSubscriptions(
    executeFunctions: IExecuteFunctions,
    _itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "GET",
        url: `${baseUrl}/preapproval/search`,
      }
    );

    return response;
  }
}

