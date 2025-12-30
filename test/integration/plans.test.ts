import { PixPayment } from '../../nodes/PixPayment/PixPayment.node';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';
import {
	mockPlanResponse,
	mockPlanListResponse,
} from '../mocks/mercado-pago-mocks';
import { mockPlanData } from '../mocks/fixtures';
import type { MockExecuteFunctions } from '../mocks/n8n-mocks';

describe('Plans Integration Tests', () => {
	let node: PixPayment;
	let mockExecuteFunctions: MockExecuteFunctions;
	const baseUrl = 'https://api.mercadopago.com';

	beforeEach(() => {
		node = new PixPayment();
		mockExecuteFunctions = createMockExecuteFunctions();
	});

	describe('createPlan', () => {
		it('deve criar plano com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: mockPlanData.amount,
					frequency: mockPlanData.frequency,
					frequencyType: mockPlanData.frequencyType,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPlanResponse,
			);

			// Act
			const result = await (node.execute as any).call(
				mockExecuteFunctions,
				[
					{
						json: {
							resource: 'plans',
							operation: 'create',
						},
					},
				],
				0,
			);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'pixPaymentApi',
				expect.objectContaining({
					method: 'POST',
					url: `${baseUrl}/preapproval_plan`,
					body: expect.objectContaining({
						reason: mockPlanData.reason,
						auto_recurring: expect.objectContaining({
							frequency: mockPlanData.frequency,
							frequency_type: mockPlanData.frequencyType,
							transaction_amount: mockPlanData.amount * 100,
							currency_id: 'BRL',
						}),
					}),
				}),
			);
			expect(result[0][0].json.id).toBe(mockPlanResponse.id);
			expect(result[0][0].json.status).toBe(mockPlanResponse.status);
			expect(result[0][0].json.amount).toBe(mockPlanData.amount);
		});

		it('deve validar valor menor ou igual a zero', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: 0, // Invalid amount
					frequency: mockPlanData.frequency,
					frequencyType: mockPlanData.frequencyType,
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(
					mockExecuteFunctions,
					[
						{
							json: {
								resource: 'plans',
								operation: 'create',
							},
						},
					],
					0,
				),
			).rejects.toThrow('Valor do plano deve ser maior que zero');
		});

		it('deve validar frequência menor ou igual a zero', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: mockPlanData.amount,
					frequency: 0, // Invalid frequency
					frequencyType: mockPlanData.frequencyType,
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(
					mockExecuteFunctions,
					[
						{
							json: {
								resource: 'plans',
								operation: 'create',
							},
						},
					],
					0,
				),
			).rejects.toThrow('Frequência deve ser maior que zero');
		});

		it('deve validar tipo de frequência inválido', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: mockPlanData.amount,
					frequency: mockPlanData.frequency,
					frequencyType: 'invalid', // Invalid frequency type
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(
					mockExecuteFunctions,
					[
						{
							json: {
								resource: 'plans',
								operation: 'create',
							},
						},
					],
					0,
				),
			).rejects.toThrow('Tipo de frequência deve ser "days" ou "months"');
		});

		it('deve validar nome do plano obrigatório', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: '', // Empty reason
					amount: mockPlanData.amount,
					frequency: mockPlanData.frequency,
					frequencyType: mockPlanData.frequencyType,
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(
					mockExecuteFunctions,
					[
						{
							json: {
								resource: 'plans',
								operation: 'create',
							},
						},
					],
					0,
				),
			).rejects.toThrow('Nome do plano é obrigatório');
		});

		it('deve normalizar valor para centavos', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: 12.34,
					frequency: mockPlanData.frequency,
					frequencyType: mockPlanData.frequencyType,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPlanResponse,
			);

			// Act
			await (node.execute as any).call(
				mockExecuteFunctions,
				[
					{
						json: {
							resource: 'plans',
							operation: 'create',
						},
					},
				],
				0,
			);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'pixPaymentApi',
				expect.objectContaining({
					body: expect.objectContaining({
						auto_recurring: expect.objectContaining({
							transaction_amount: 1234, // 12.34 * 100
						}),
					}),
				}),
			);
		});
	});

	describe('getPlan', () => {
		it('deve consultar plano existente', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'get',
					planId: mockPlanResponse.id,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPlanResponse,
			);

			// Act
			const result = await (node.execute as any).call(
				mockExecuteFunctions,
				[
					{
						json: {
							resource: 'plans',
							operation: 'get',
						},
					},
				],
				0,
			);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'pixPaymentApi',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/preapproval_plan/${mockPlanResponse.id}`,
				}),
			);
			expect(result[0][0].json.id).toBe(mockPlanResponse.id);
			expect(result[0][0].json.status).toBe(mockPlanResponse.status);
		});

		it('deve validar planId obrigatório', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'get',
					planId: '', // Missing planId
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(
					mockExecuteFunctions,
					[
						{
							json: {
								resource: 'plans',
								operation: 'get',
							},
						},
					],
					0,
				),
			).rejects.toThrow('ID do plano é obrigatório');
		});
	});

	describe('listPlans', () => {
		it('deve listar planos com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'list',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPlanListResponse,
			);

			// Act
			const result = await (node.execute as any).call(
				mockExecuteFunctions,
				[
					{
						json: {
							resource: 'plans',
							operation: 'list',
						},
					},
				],
				0,
			);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'pixPaymentApi',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/preapproval_plan/search`,
				}),
			);
			expect(result[0][0].json.raw.results.length).toBe(1);
			expect(result[0][0].json.raw.results[0].id).toBe(mockPlanResponse.id);
		});
	});

	describe('updatePlan', () => {
		it('deve atualizar plano com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'update',
					planId: mockPlanResponse.id,
					reason: 'Plano Atualizado',
					amount: 149.99,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue({
				...mockPlanResponse,
				reason: 'Plano Atualizado',
				auto_recurring: {
					...mockPlanResponse.auto_recurring,
					transaction_amount: 14999,
				},
			});

			// Act
			const result = await (node.execute as any).call(
				mockExecuteFunctions,
				[
					{
						json: {
							resource: 'plans',
							operation: 'update',
						},
					},
				],
				0,
			);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'pixPaymentApi',
				expect.objectContaining({
					method: 'PUT',
					url: `${baseUrl}/preapproval_plan/${mockPlanResponse.id}`,
					body: expect.objectContaining({
						reason: 'Plano Atualizado',
						auto_recurring: expect.objectContaining({
							transaction_amount: 14999,
						}),
					}),
				}),
			);
			expect(result[0][0].json.id).toBe(mockPlanResponse.id);
		});

		it('deve validar planId obrigatório', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'update',
					planId: '', // Missing planId
					reason: 'Plano Atualizado',
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(
					mockExecuteFunctions,
					[
						{
							json: {
								resource: 'plans',
								operation: 'update',
							},
						},
					],
					0,
				),
			).rejects.toThrow('ID do plano é obrigatório');
		});

		it('deve validar que pelo menos um campo deve ser fornecido para atualizar', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'update',
					planId: mockPlanResponse.id,
					reason: '', // Empty reason
					amount: 0, // Invalid amount
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(
					mockExecuteFunctions,
					[
						{
							json: {
								resource: 'plans',
								operation: 'update',
							},
						},
					],
					0,
				),
			).rejects.toThrow('É necessário fornecer pelo menos um campo para atualizar');
		});
	});
});

