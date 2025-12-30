import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	MercadoPagoCredentials,
	Payment,
	Plan,
	Subscription,
	Webhook,
	NormalizedResponse,
} from './types';

import {
	getBaseUrl,
	normalizeAmount,
	cleanDocument,
	getDocumentType,
	validateEmail,
	handleMercadoPagoError,
} from './helpers';

export class PixPayment implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mercado Pago PIX e Assinaturas',
		name: 'pixPayment',
		icon: 'file:mercadopago.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Processamento de pagamentos PIX, assinaturas e webhooks via Mercado Pago',
		defaults: {
			name: 'Mercado Pago',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'pixPaymentApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'PIX',
						value: 'pix',
					},
					{
						name: 'Plano',
						value: 'plans',
					},
					{
						name: 'Assinatura',
						value: 'subscriptions',
					},
					{
						name: 'Pagamento Recorrente',
						value: 'recurringPayments',
					},
					{
						name: 'Webhook',
						value: 'webhooks',
					},
				],
				default: 'pix',
			},
			// PIX Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['pix'],
					},
				},
				options: [
					{
						name: 'Criar',
						value: 'create',
						description: 'Criar um pagamento PIX',
						action: 'Criar pagamento PIX',
					},
					{
						name: 'Consultar',
						value: 'get',
						description: 'Consultar um pagamento PIX',
						action: 'Consultar pagamento PIX',
					},
					{
						name: 'Reembolsar',
						value: 'refund',
						description: 'Reembolsar um pagamento PIX',
						action: 'Reembolsar pagamento PIX',
					},
				],
				default: 'create',
			},
			// PIX Create Fields
			{
				displayName: 'Valor',
				name: 'amount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['create'],
					},
				},
				default: 0,
				description: 'Valor do pagamento em reais (ex: 10.50)',
			},
			{
				displayName: 'Descrição',
				name: 'description',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Descrição do pagamento',
			},
			{
				displayName: 'E-mail do Pagador',
				name: 'payerEmail',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'E-mail do pagador',
			},
			{
				displayName: 'CPF/CNPJ do Pagador',
				name: 'payerDocument',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'CPF ou CNPJ do pagador (apenas números)',
			},
			{
				displayName: 'Nome do Pagador',
				name: 'payerName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Nome completo do pagador',
			},
			{
				displayName: 'Data de Expiração',
				name: 'expirationDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Data e hora de expiração do QR Code PIX',
			},
			{
				displayName: 'Referência Externa',
				name: 'externalReference',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Referência externa para identificar o pagamento',
			},
			{
				displayName: 'Chave de Idempotência',
				name: 'idempotencyKey',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Chave única para garantir idempotência da requisição',
			},
			// PIX Get Fields
			{
				displayName: 'ID do Pagamento',
				name: 'paymentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'ID do pagamento a ser consultado',
			},
			// PIX Refund Fields
			{
				displayName: 'ID do Pagamento',
				name: 'paymentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['refund'],
					},
				},
				default: '',
				description: 'ID do pagamento a ser reembolsado',
			},
			{
				displayName: 'Valor do Reembolso',
				name: 'refundAmount',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['pix'],
						operation: ['refund'],
					},
				},
				default: 0,
				description: 'Valor do reembolso em reais (deixe vazio para reembolso total)',
			},
			// Subscription Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
					},
				},
				options: [
					{
						name: 'Criar',
						value: 'create',
						description: 'Criar uma assinatura',
						action: 'Criar assinatura',
					},
					{
						name: 'Pausar',
						value: 'pause',
						description: 'Pausar uma assinatura',
						action: 'Pausar assinatura',
					},
					{
						name: 'Retomar',
						value: 'resume',
						description: 'Retomar uma assinatura pausada',
						action: 'Retomar assinatura',
					},
					{
						name: 'Cancelar',
						value: 'cancel',
						description: 'Cancelar uma assinatura',
						action: 'Cancelar assinatura',
					},
					{
						name: 'Consultar',
						value: 'get',
						description: 'Consultar uma assinatura',
						action: 'Consultar assinatura',
					},
					{
						name: 'Listar',
						value: 'list',
						description: 'Listar assinaturas',
						action: 'Listar assinaturas',
					},
				],
				default: 'create',
			},
			// Subscription Create Fields
			{
				displayName: 'ID do Plano',
				name: 'planId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'ID do plano de assinatura',
			},
			{
				displayName: 'E-mail do Pagador',
				name: 'payerEmail',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'E-mail do pagador',
			},
			{
				displayName: 'CPF/CNPJ do Pagador',
				name: 'payerDocument',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'CPF ou CNPJ do pagador',
			},
			{
				displayName: 'Data de Início',
				name: 'startDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Data de início da assinatura',
			},
			{
				displayName: 'Período de Trial (dias)',
				name: 'trialPeriodDays',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['create'],
					},
				},
				default: 0,
				description: 'Número de dias de período de trial',
			},
			// Subscription Get/Cancel/Pause/Resume Fields
			{
				displayName: 'ID da Assinatura',
				name: 'subscriptionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['get', 'cancel', 'pause', 'resume'],
					},
				},
				default: '',
				description: 'ID da assinatura',
			},
			// Recurring Payment Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['recurringPayments'],
					},
				},
				options: [
					{
						name: 'Criar',
						value: 'create',
						description: 'Criar um pagamento recorrente',
						action: 'Criar pagamento recorrente',
					},
					{
						name: 'Listar',
						value: 'list',
						description: 'Listar pagamentos recorrentes',
						action: 'Listar pagamentos recorrentes',
					},
					{
						name: 'Cancelar',
						value: 'cancel',
						description: 'Cancelar um pagamento recorrente',
						action: 'Cancelar pagamento recorrente',
					},
					{
						name: 'Consultar',
						value: 'get',
						description: 'Consultar um pagamento recorrente',
						action: 'Consultar pagamento recorrente',
					},
				],
				default: 'create',
			},
			// Recurring Payment Fields
			{
				displayName: 'ID do Plano',
				name: 'planId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['recurringPayments'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'ID do plano de pagamento recorrente',
			},
			{
				displayName: 'ID do Cliente',
				name: 'customerId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['recurringPayments'],
						operation: ['create', 'list', 'get'],
					},
				},
				default: '',
				description: 'ID do cliente (filtro opcional)',
			},
			{
				displayName: 'ID do Pagamento Recorrente',
				name: 'recurringPaymentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['recurringPayments'],
						operation: ['get', 'cancel'],
					},
				},
				default: '',
				description: 'ID do pagamento recorrente',
			},
			// Webhook Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['webhooks'],
					},
				},
				options: [
					{
						name: 'Registrar',
						value: 'register',
						description: 'Registrar um novo webhook',
						action: 'Registrar webhook',
					},
					{
						name: 'Listar',
						value: 'list',
						description: 'Listar webhooks',
						action: 'Listar webhooks',
					},
					{
						name: 'Excluir',
						value: 'delete',
						description: 'Excluir um webhook',
						action: 'Excluir webhook',
					},
					{
						name: 'Consultar',
						value: 'get',
						description: 'Consultar um webhook',
						action: 'Consultar webhook',
					},
				],
				default: 'register',
			},
			// Webhook Fields
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['webhooks'],
						operation: ['register'],
					},
				},
				default: '',
				description: 'URL que receberá as notificações do webhook',
			},
			{
				displayName: 'Eventos',
				name: 'events',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['webhooks'],
						operation: ['register'],
					},
				},
				options: [
					{
						name: 'payment.created',
						value: 'payment',
					},
					{
						name: 'payment.updated',
						value: 'payment',
					},
					{
						name: 'subscription.created',
						value: 'subscription',
					},
					{
						name: 'subscription.updated',
						value: 'subscription',
					},
				],
				default: ['payment'],
				description: 'Eventos para os quais o webhook será notificado',
			},
			{
				displayName: 'Descrição',
				name: 'description',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['webhooks'],
						operation: ['register'],
					},
				},
				default: '',
				description: 'Descrição do webhook',
			},
			{
				displayName: 'ID do Webhook',
				name: 'webhookId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['webhooks'],
						operation: ['get', 'delete'],
					},
				},
				default: '',
				description: 'ID do webhook',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = (await this.getCredentials('pixPaymentApi')) as MercadoPagoCredentials;
		const baseUrl = getBaseUrl(credentials.environment);

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: any;

				switch (resource) {
					case 'pix':
						responseData = await PixPayment.handlePixOperation(this, operation, i, baseUrl, credentials);
						break;
					case 'plans':
						responseData = await PixPayment.handlePlanOperation(this, operation, i, baseUrl, credentials);
						break;
					case 'subscriptions':
						responseData = await PixPayment.handleSubscriptionOperation(this, operation, i, baseUrl, credentials);
						break;
					case 'recurringPayments':
						responseData = await PixPayment.handleRecurringPaymentOperation(this, operation, i, baseUrl, credentials);
						break;
					case 'webhooks':
						responseData = await PixPayment.handleWebhookOperation(this, operation, i, baseUrl, credentials);
						break;
					default:
						throw new Error(`Resource "${resource}" não é suportado`);
				}

				returnData.push({
					json: PixPayment.normalizeResponse(responseData, resource),
				});
			} catch (error) {
				const errorData = handleMercadoPagoError(error);
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorData.message,
							status: errorData.status,
							details: errorData,
						},
					});
				} else {
					throw new Error(errorData.message);
				}
			}
		}

		return [returnData];
	}

	private static async handlePixOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		switch (operation) {
			case 'create':
				return await PixPayment.createPixPayment(executeFunctions, itemIndex, baseUrl, credentials);
			case 'get':
				return await PixPayment.getPixPayment(executeFunctions, itemIndex, baseUrl, credentials);
			case 'refund':
				return await PixPayment.refundPixPayment(executeFunctions, itemIndex, baseUrl, credentials);
			default:
				throw new Error(`Operação PIX "${operation}" não é suportada`);
		}
	}

	private static async createPixPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Payment> {
		const amount = executeFunctions.getNodeParameter('amount', itemIndex) as number;
		const description = executeFunctions.getNodeParameter('description', itemIndex) as string;
		const payerEmail = executeFunctions.getNodeParameter('payerEmail', itemIndex) as string;
		const payerDocument = executeFunctions.getNodeParameter('payerDocument', itemIndex) as string;
		const payerName = executeFunctions.getNodeParameter('payerName', itemIndex) as string;
		const expirationDate = executeFunctions.getNodeParameter('expirationDate', itemIndex) as string;
		const externalReference = executeFunctions.getNodeParameter('externalReference', itemIndex) as string;
		const idempotencyKey = executeFunctions.getNodeParameter('idempotencyKey', itemIndex) as string;

		// Validações
		if (!validateEmail(payerEmail)) {
			throw new Error('E-mail do pagador inválido');
		}

		if (amount <= 0) {
			throw new Error('Valor do pagamento deve ser maior que zero');
		}

		const body: any = {
			transaction_amount: normalizeAmount(amount),
			description,
			payment_method_id: 'pix',
			payer: {
				email: payerEmail,
			},
		};

		if (payerDocument) {
			const docType = getDocumentType(payerDocument);
			if (!docType) {
				throw new Error('CPF/CNPJ inválido. Deve conter 11 ou 14 dígitos numéricos');
			}
			body.payer.identification = {
				type: docType,
				number: cleanDocument(payerDocument),
			};
		}

		if (payerName) {
			const nameParts = payerName.trim().split(' ');
			body.payer.first_name = nameParts[0] || '';
			body.payer.last_name = nameParts.slice(1).join(' ') || '';
		}

		if (expirationDate) {
			body.date_of_expiration = new Date(expirationDate).toISOString();
		}

		if (externalReference) {
			body.external_reference = externalReference;
		}

		const headers: any = {
			Authorization: `Bearer ${credentials.accessToken}`,
			'Content-Type': 'application/json',
		};

		if (idempotencyKey) {
			headers['X-Idempotency-Key'] = idempotencyKey;
		}

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'POST',
				url: `${baseUrl}/v1/payments`,
				body,
				headers,
				json: true,
			},
		);

		return response as Payment;
	}

	private static async getPixPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Payment> {
		const paymentId = executeFunctions.getNodeParameter('paymentId', itemIndex) as string;

		if (!paymentId) {
			throw new Error('ID do pagamento é obrigatório');
		}

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'GET',
				url: `${baseUrl}/v1/payments/${paymentId}`,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response as Payment;
	}

	private static async refundPixPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		const paymentId = executeFunctions.getNodeParameter('paymentId', itemIndex) as string;
		const refundAmount = executeFunctions.getNodeParameter('refundAmount', itemIndex) as number;

		if (!paymentId) {
			throw new Error('ID do pagamento é obrigatório');
		}

		const body: any = {};

		if (refundAmount && refundAmount > 0) {
			body.amount = normalizeAmount(refundAmount);
		}

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'POST',
				url: `${baseUrl}/v1/payments/${paymentId}/refunds`,
				body: Object.keys(body).length > 0 ? body : undefined,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			},
		);

		return response;
	}

	private static async handlePlanOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		switch (operation) {
			case 'create':
				return await PixPayment.createPlan(executeFunctions, itemIndex, baseUrl, credentials);
			case 'get':
				return await PixPayment.getPlan(executeFunctions, itemIndex, baseUrl, credentials);
			case 'list':
				return await PixPayment.listPlans(executeFunctions, itemIndex, baseUrl, credentials);
			case 'update':
				return await PixPayment.updatePlan(executeFunctions, itemIndex, baseUrl, credentials);
			default:
				throw new Error(`Operação de plano "${operation}" não é suportada`);
		}
	}

	private static async createPlan(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Plan> {
		const reason = executeFunctions.getNodeParameter('reason', itemIndex) as string;
		const amount = executeFunctions.getNodeParameter('amount', itemIndex) as number;
		const frequency = executeFunctions.getNodeParameter('frequency', itemIndex) as number;
		const frequencyType = executeFunctions.getNodeParameter('frequencyType', itemIndex) as string;

		if (!reason || reason.trim() === '') {
			throw new Error('Nome do plano é obrigatório');
		}

		if (amount <= 0) {
			throw new Error('Valor do plano deve ser maior que zero');
		}

		if (frequency <= 0) {
			throw new Error('Frequência deve ser maior que zero');
		}

		if (frequencyType !== 'days' && frequencyType !== 'months') {
			throw new Error('Tipo de frequência deve ser "days" ou "months"');
		}

		const body: any = {
			reason,
			auto_recurring: {
				frequency,
				frequency_type: frequencyType,
				transaction_amount: normalizeAmount(amount),
				currency_id: 'BRL',
			},
			payment_methods_allowed: {
				payment_types: [
					{ id: 'credit_card' },
				],
			},
		};

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'POST',
				url: `${baseUrl}/preapproval_plan`,
				body,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			},
		);

		return response as Plan;
	}

	private static async getPlan(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Plan> {
		const planId = executeFunctions.getNodeParameter('planId', itemIndex) as string;

		if (!planId || planId.trim() === '') {
			throw new Error('ID do plano é obrigatório');
		}

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'GET',
				url: `${baseUrl}/preapproval_plan/${planId}`,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response as Plan;
	}

	private static async listPlans(
		executeFunctions: IExecuteFunctions,
		_itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'GET',
				url: `${baseUrl}/preapproval_plan/search`,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response;
	}

	private static async updatePlan(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Plan> {
		const planId = executeFunctions.getNodeParameter('planId', itemIndex) as string;
		const reason = executeFunctions.getNodeParameter('reason', itemIndex) as string;
		const amount = executeFunctions.getNodeParameter('amount', itemIndex) as number;

		if (!planId || planId.trim() === '') {
			throw new Error('ID do plano é obrigatório');
		}

		const body: any = {};
		
		if (reason && reason.trim() !== '') {
			body.reason = reason;
		}
		
		if (amount && amount > 0) {
			body.auto_recurring = {
				transaction_amount: normalizeAmount(amount),
			};
		}

		if (Object.keys(body).length === 0) {
			throw new Error('É necessário fornecer pelo menos um campo para atualizar (nome ou valor)');
		}

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'PUT',
				url: `${baseUrl}/preapproval_plan/${planId}`,
				body,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			},
		);

		return response as Plan;
	}

	private static async handleSubscriptionOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		switch (operation) {
			case 'create':
				return await PixPayment.createSubscription(executeFunctions, itemIndex, baseUrl, credentials);
			case 'get':
				return await PixPayment.getSubscription(executeFunctions, itemIndex, baseUrl, credentials);
			case 'pause':
				return await PixPayment.pauseSubscription(executeFunctions, itemIndex, baseUrl, credentials);
			case 'resume':
				return await PixPayment.resumeSubscription(executeFunctions, itemIndex, baseUrl, credentials);
			case 'cancel':
				return await PixPayment.cancelSubscription(executeFunctions, itemIndex, baseUrl, credentials);
			case 'list':
				return await PixPayment.listSubscriptions(executeFunctions, itemIndex, baseUrl, credentials);
			default:
				throw new Error(`Operação de assinatura "${operation}" não é suportada`);
		}
	}

	private static async createSubscription(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Subscription> {
		const planId = executeFunctions.getNodeParameter('planId', itemIndex) as string;
		const payerEmail = executeFunctions.getNodeParameter('payerEmail', itemIndex) as string;
		const payerDocument = executeFunctions.getNodeParameter('payerDocument', itemIndex) as string;
		const startDate = executeFunctions.getNodeParameter('startDate', itemIndex) as string;
		const trialPeriodDays = executeFunctions.getNodeParameter('trialPeriodDays', itemIndex) as number;

		if (!validateEmail(payerEmail)) {
			throw new Error('E-mail do pagador inválido');
		}

		const body: any = {
			preapproval_plan_id: planId,
			payer_email: payerEmail,
		};

		if (payerDocument) {
			const docType = getDocumentType(payerDocument);
			if (!docType) {
				throw new Error('CPF/CNPJ inválido');
			}
			body.payer = {
				identification: {
					type: docType,
					number: cleanDocument(payerDocument),
				},
			};
		}

		if (startDate) {
			body.start_date = new Date(startDate).toISOString();
		}

		if (trialPeriodDays && trialPeriodDays > 0) {
			body.trial_period_days = trialPeriodDays;
		}

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'POST',
				url: `${baseUrl}/preapproval`,
				body,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			},
		);

		return response as Subscription;
	}

	private static async getSubscription(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Subscription> {
		const subscriptionId = executeFunctions.getNodeParameter('subscriptionId', itemIndex) as string;

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'GET',
				url: `${baseUrl}/preapproval/${subscriptionId}`,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response as Subscription;
	}

	private static async pauseSubscription(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Subscription> {
		const subscriptionId = executeFunctions.getNodeParameter('subscriptionId', itemIndex) as string;

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'PUT',
				url: `${baseUrl}/preapproval/${subscriptionId}`,
				body: {
					status: 'paused',
				},
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			},
		);

		return response as Subscription;
	}

	private static async resumeSubscription(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Subscription> {
		const subscriptionId = executeFunctions.getNodeParameter('subscriptionId', itemIndex) as string;

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'PUT',
				url: `${baseUrl}/preapproval/${subscriptionId}`,
				body: {
					status: 'authorized',
				},
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			},
		);

		return response as Subscription;
	}

	private static async cancelSubscription(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Subscription> {
		const subscriptionId = executeFunctions.getNodeParameter('subscriptionId', itemIndex) as string;

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'PUT',
				url: `${baseUrl}/preapproval/${subscriptionId}`,
				body: {
					status: 'cancelled',
				},
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			},
		);

		return response as Subscription;
	}

	private static async listSubscriptions(
		executeFunctions: IExecuteFunctions,
		_itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'GET',
				url: `${baseUrl}/preapproval/search`,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response;
	}

	private static async handleRecurringPaymentOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		switch (operation) {
			case 'create':
				return await PixPayment.createRecurringPayment(executeFunctions, itemIndex, baseUrl, credentials);
			case 'get':
				return await PixPayment.getRecurringPayment(executeFunctions, itemIndex, baseUrl, credentials);
			case 'list':
				return await PixPayment.listRecurringPayments(executeFunctions, itemIndex, baseUrl, credentials);
			case 'cancel':
				return await PixPayment.cancelRecurringPayment(executeFunctions, itemIndex, baseUrl, credentials);
			default:
				throw new Error(`Operação de pagamento recorrente "${operation}" não é suportada`);
		}
	}

	private static async createRecurringPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		const planId = executeFunctions.getNodeParameter('planId', itemIndex) as string;

		// Para pagamentos recorrentes, geralmente criamos via assinatura
		// Esta é uma implementação simplificada
		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'GET',
				url: `${baseUrl}/preapproval/${planId}`,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response;
	}

	private static async getRecurringPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		const recurringPaymentId = executeFunctions.getNodeParameter('recurringPaymentId', itemIndex) as string;

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'GET',
				url: `${baseUrl}/preapproval/${recurringPaymentId}`,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response;
	}

	private static async listRecurringPayments(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		const customerId = executeFunctions.getNodeParameter('customerId', itemIndex) as string;

		let url = `${baseUrl}/preapproval/search`;
		if (customerId) {
			url += `?payer_id=${customerId}`;
		}

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'GET',
				url,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response;
	}

	private static async cancelRecurringPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		const recurringPaymentId = executeFunctions.getNodeParameter('recurringPaymentId', itemIndex) as string;

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'PUT',
				url: `${baseUrl}/preapproval/${recurringPaymentId}`,
				body: {
					status: 'cancelled',
				},
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			},
		);

		return response;
	}

	private static async handleWebhookOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		switch (operation) {
			case 'register':
				return await PixPayment.registerWebhook(executeFunctions, itemIndex, baseUrl, credentials);
			case 'get':
				return await PixPayment.getWebhook(executeFunctions, itemIndex, baseUrl, credentials);
			case 'list':
				return await PixPayment.listWebhooks(executeFunctions, itemIndex, baseUrl, credentials);
			case 'delete':
				return await PixPayment.deleteWebhook(executeFunctions, itemIndex, baseUrl, credentials);
			default:
				throw new Error(`Operação de webhook "${operation}" não é suportada`);
		}
	}

	private static async registerWebhook(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Webhook> {
		const url = executeFunctions.getNodeParameter('url', itemIndex) as string;
		const events = executeFunctions.getNodeParameter('events', itemIndex) as string[];
		const description = executeFunctions.getNodeParameter('description', itemIndex) as string;

		if (!url || !url.startsWith('http')) {
			throw new Error('URL do webhook deve ser uma URL válida (http:// ou https://)');
		}

		const body: any = {
			url,
			events: events.length > 0 ? events : ['payment'],
		};

		if (description) {
			body.description = description;
		}

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'POST',
				url: `${baseUrl}/v1/webhooks`,
				body,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			},
		);

		return response as Webhook;
	}

	private static async getWebhook(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<Webhook> {
		const webhookId = executeFunctions.getNodeParameter('webhookId', itemIndex) as string;

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'GET',
				url: `${baseUrl}/v1/webhooks/${webhookId}`,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response as Webhook;
	}

	private static async listWebhooks(
		executeFunctions: IExecuteFunctions,
		_itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'GET',
				url: `${baseUrl}/v1/webhooks`,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response;
	}

	private static async deleteWebhook(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		baseUrl: string,
		credentials: MercadoPagoCredentials,
	): Promise<any> {
		const webhookId = executeFunctions.getNodeParameter('webhookId', itemIndex) as string;

		const response = await executeFunctions.helpers.requestWithAuthentication.call(
			executeFunctions,
			'pixPaymentApi',
			{
				method: 'DELETE',
				url: `${baseUrl}/v1/webhooks/${webhookId}`,
				headers: {
					Authorization: `Bearer ${credentials.accessToken}`,
				},
				json: true,
			},
		);

		return response;
	}

	private static normalizeResponse(data: any, resource: string): NormalizedResponse {
		const normalized: NormalizedResponse = {
			id: data.id || '',
			status: data.status || '',
			createdAt: data.date_created || data.created_at || new Date().toISOString(),
			raw: data,
		};

		// Normalização específica por recurso
		switch (resource) {
			case 'pix':
				normalized.amount = data.transaction_amount ? data.transaction_amount / 100 : undefined;
				normalized.currency = data.currency_id || 'BRL';
				normalized.qrCode = data.point_of_interaction?.transaction_data?.qr_code;
				normalized.qrCodeBase64 = data.point_of_interaction?.transaction_data?.qr_code_base64;
				normalized.description = data.description;
				normalized.payerEmail = data.payer?.email;
				break;

			case 'plans':
				normalized.planId = data.id;
				normalized.amount = data.auto_recurring?.transaction_amount ? data.auto_recurring.transaction_amount / 100 : undefined;
				normalized.description = data.reason;
				break;

			case 'subscriptions':
				normalized.planId = data.preapproval_plan_id;
				normalized.payerEmail = data.payer_email;
				normalized.startDate = data.start_date;
				normalized.endDate = data.end_date;
				normalized.statusDetail = data.status_detail;
				break;

			case 'recurringPayments':
				normalized.planId = data.preapproval_plan_id;
				normalized.payerEmail = data.payer_email;
				normalized.nextBillingDate = data.next_billing_date;
				break;

			case 'webhooks':
				normalized.url = data.url;
				normalized.events = data.events || [];
				normalized.description = data.description;
				break;
		}

		return normalized;
	}
}

