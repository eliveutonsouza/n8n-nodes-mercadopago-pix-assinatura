/**
 * Dados de teste (fixtures) para os testes
 */

export const mockCredentials = {
	accessToken: 'TEST_ACCESS_TOKEN_123456789',
	clientId: 'TEST_CLIENT_ID',
	clientSecret: 'TEST_CLIENT_SECRET',
	environment: 'sandbox' as const,
};

export const mockPixPaymentData = {
	amount: 10.50,
	description: 'Pagamento de teste',
	payerEmail: 'teste@example.com',
	payerDocument: '12345678901',
	payerName: 'João Silva',
	expirationDate: '2024-12-31T23:59:59.000Z',
	externalReference: 'REF-123',
	idempotencyKey: 'IDEMPOTENCY-KEY-123',
};

export const mockSubscriptionData = {
	planId: '2c9380848a5f8b1d018a5f8b2a3b0001',
	payerEmail: 'teste@example.com',
	payerDocument: '12345678901',
	startDate: '2024-01-01T00:00:00.000Z',
	trialPeriodDays: 7,
};

export const mockWebhookData = {
	url: 'https://example.com/webhook',
	events: ['payment', 'subscription'],
	description: 'Webhook de teste',
};

export const mockPlanData = {
	reason: 'Plano Mensal Premium',
	amount: 99.99,
	frequency: 1,
	frequencyType: 'months',
};

export const validCPF = '12345678901';
export const validCNPJ = '12345678000190';
export const invalidDocument = '123';
export const validEmail = 'teste@example.com';
export const invalidEmail = 'invalid-email';

