/**
 * Mocks das respostas da API do Mercado Pago
 */

import { Payment, Plan, Subscription, Webhook } from '../../nodes/PixPayment/types';

export const mockPixPaymentResponse: Payment = {
	id: '123456789',
	status: 'pending',
	status_detail: 'pending_waiting_payment',
	transaction_amount: 1050,
	currency_id: 'BRL',
	description: 'Pagamento de teste',
	payment_method_id: 'pix',
	payer: {
		email: 'teste@example.com',
		identification: {
			type: 'CPF',
			number: '12345678901',
		},
		first_name: 'João',
		last_name: 'Silva',
	},
	point_of_interaction: {
		transaction_data: {
			qr_code: '00020126360014BR.GOV.BCB.PIX0114+5511999999999020400005303986540410.505802BR5913TESTE MERCADO6009SAO PAULO62070503***6304ABCD',
			qr_code_base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
		},
	},
	date_created: '2024-01-01T12:00:00.000Z',
	date_last_updated: '2024-01-01T12:00:00.000Z',
	external_reference: 'REF-123',
};

export const mockPixPaymentApproved: Payment = {
	...mockPixPaymentResponse,
	id: '123456790',
	status: 'approved',
	status_detail: 'accredited',
	date_approved: '2024-01-01T12:05:00.000Z',
};

export const mockSubscriptionResponse: Subscription = {
	id: '2c9380848a5f8b1d018a5f8b2a3b0001',
	status: 'authorized',
	external_reference: 'SUB-123',
	preapproval_plan_id: '2c9380848a5f8b1d018a5f8b2a3b0001',
	payer_email: 'teste@example.com',
	payer_id: '123456789',
	date_created: '2024-01-01T12:00:00.000Z',
	last_modified: '2024-01-01T12:00:00.000Z',
	start_date: '2024-01-01T00:00:00.000Z',
	currency_id: 'BRL',
};

export const mockWebhookResponse: Webhook = {
	id: '123456',
	url: 'https://example.com/webhook',
	events: ['payment', 'subscription'],
	status: 'active',
	description: 'Webhook de teste',
	created_at: '2024-01-01T12:00:00.000Z',
	updated_at: '2024-01-01T12:00:00.000Z',
};

export const mockErrorResponse = {
	message: 'Invalid request',
	error: 'bad_request',
	status: 400,
	cause: [
		{
			code: 'invalid_parameter',
			description: 'The parameter amount is required',
		},
	],
};

export const mockNetworkError = {
	request: {},
	message: 'Network Error',
};

export const mockUnauthorizedError = {
	response: {
		status: 401,
		data: {
			message: 'Unauthorized',
			error: 'unauthorized',
		},
	},
};

export const mockNotFoundError = {
	response: {
		status: 404,
		data: {
			message: 'Payment not found',
			error: 'not_found',
		},
	},
};

export const mockRefundResponse = {
	id: 'REFUND-123',
	payment_id: '123456789',
	amount: 1050,
	status: 'approved',
	date_created: '2024-01-01T12:10:00.000Z',
};

export const mockPlanResponse: Plan = {
	id: 'PLAN_123456',
	status: 'active',
	reason: 'Plano Mensal Premium',
	auto_recurring: {
		frequency: 1,
		frequency_type: 'months',
		transaction_amount: 9999,
		currency_id: 'BRL',
	},
	payment_methods_allowed: {
		payment_types: [{ id: 'credit_card' }],
	},
	date_created: new Date().toISOString(),
	last_modified: new Date().toISOString(),
};

export const mockPlanListResponse = {
	results: [mockPlanResponse],
	paging: {
		total: 1,
		offset: 0,
		limit: 10,
	},
};

