/**
 * Script de teste para validar todas as rotas implementadas
 * Este script verifica a estrutura e validação das rotas sem fazer requisições reais
 */

import { PixPayment } from '../nodes/PixPayment/PixPayment.node';

describe('Validação de Rotas do Mercado Pago', () => {
	const node = new PixPayment();

	describe('Estrutura do Node', () => {
		it('deve ter a descrição correta', () => {
			expect(node.description).toBeDefined();
			expect(node.description.name).toBe('pixPayment');
			expect(node.description.displayName).toBe('Mercado Pago PIX e Assinaturas');
		});

		it('deve ter credenciais configuradas', () => {
			expect(node.description.credentials).toBeDefined();
			expect(node.description.credentials?.length).toBeGreaterThan(0);
			expect(node.description.credentials?.[0].name).toBe('pixPaymentApi');
		});

        it('deve ter recursos definidos', () => {
          const resourceProperty = node.description.properties?.find(
            (p) => p.name === 'resource',
          );
          expect(resourceProperty).toBeDefined();
          expect(resourceProperty?.options).toBeDefined();
          if (resourceProperty?.options) {
            expect((resourceProperty.options as any)?.length).toBe(5);
          }
        });
	});

	describe('Recurso PIX', () => {
		it('deve ter operações: create, get, refund', () => {
			const pixOperations = ['create', 'get', 'refund'];
			const operationProperty = node.description.properties?.find(
				(p) => p.name === 'operation',
			);

			expect(operationProperty).toBeDefined();
			expect(operationProperty?.displayOptions?.show?.resource).toContain('pix');

			if (operationProperty?.options) {
				const operations = operationProperty.options.map((opt: any) => opt.value);
				pixOperations.forEach((op) => {
					expect(operations).toContain(op);
				});
			}
		});

		it('deve ter campos obrigatórios para criar PIX', () => {
			const requiredFields = ['amount', 'description', 'payerEmail'];
			requiredFields.forEach((field) => {
				const fieldProperty = node.description.properties?.find(
					(p) => p.name === field && p.displayOptions?.show?.resource?.includes('pix'),
				);
				expect(fieldProperty).toBeDefined();
				if (fieldProperty) {
					expect(fieldProperty.required).toBe(true);
				}
			});
		});
	});

      describe('Recurso Planos', () => {
        it('deve ter operações: create, get, list, update', () => {
          const planOperations = ['create', 'get', 'list', 'update'];
          const operationProperty = node.description.properties?.find(
            (p) =>
              p.name === 'operation' &&
              p.displayOptions?.show?.resource?.includes('plans'),
          );

          expect(operationProperty).toBeDefined();

          if (operationProperty?.options) {
            const operations = operationProperty.options
              .filter((opt: any) => {
                const displayOptions = opt.displayOptions || operationProperty.displayOptions;
                return displayOptions?.show?.resource?.includes('plans');
              })
              .map((opt: any) => opt.value);
            
            planOperations.forEach((op) => {
              expect(operations).toContain(op);
            });
          }
        });
      });

	describe('Recurso Assinaturas', () => {
		it('deve ter operações: create, pause, resume, cancel, get, list', () => {
			const subscriptionOperations = ['create', 'pause', 'resume', 'cancel', 'get', 'list'];
			const operationProperty = node.description.properties?.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('subscriptions'),
			);

			if (operationProperty?.options) {
				const operations = operationProperty.options.map((opt: any) => opt.value);

				subscriptionOperations.forEach((op) => {
					expect(operations).toContain(op);
				});
			}
		});
	});

	describe('Recurso Pagamentos Recorrentes', () => {
		it('deve ter operações: create, list, cancel, get', () => {
			const recurringOperations = ['create', 'list', 'cancel', 'get'];
			const operationProperty = node.description.properties?.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('recurringPayments'),
			);

			if (operationProperty?.options) {
				const operations = operationProperty.options.map((opt: any) => opt.value);

				recurringOperations.forEach((op) => {
					expect(operations).toContain(op);
				});
			}
		});
	});

	describe('Recurso Webhooks', () => {
		it('deve ter operações: register, list, delete, get', () => {
			const webhookOperations = ['register', 'list', 'delete', 'get'];
			const operationProperty = node.description.properties?.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('webhooks'),
			);

			if (operationProperty?.options) {
				const operations = operationProperty.options.map((opt: any) => opt.value);

				webhookOperations.forEach((op) => {
					expect(operations).toContain(op);
				});
			}
		});
	});
});

// Validação manual das rotas
console.log('🔍 Validando estrutura das rotas...\n');

const node = new PixPayment();
const properties = node.description.properties || [];

// Listar todos os recursos
const resourceProperty = properties.find((p) => p.name === 'resource');
const resources = resourceProperty?.options?.map((opt: any) => opt.value) || [];

console.log('📦 Recursos encontrados:', resources.join(', '));

// Para cada recurso, listar operações
resources.forEach((resource: string) => {
	const operationProperty = properties.find(
		(p) =>
			p.name === 'operation' &&
			p.displayOptions?.show?.resource?.includes(resource),
	);
	const operations = operationProperty?.options
		?.filter((opt: any) => {
			const displayOptions = opt.displayOptions || operationProperty.displayOptions;
			return displayOptions?.show?.resource?.includes(resource);
		})
		.map((opt: any) => opt.value) || [];

	console.log(`\n✅ ${resource.toUpperCase()}:`);
	operations.forEach((op: string) => {
		console.log(`   - ${op}`);
	});
});

console.log('\n✨ Validação concluída!');

