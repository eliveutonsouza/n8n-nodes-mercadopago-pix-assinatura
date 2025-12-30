/**
 * Testes locais para PIX
 * Executa testes reais contra a API do Mercado Pago
 */

import { PixPayment } from '../../nodes/PixPayment/PixPayment.node';
import { LocalExecuteFunctions } from '../helpers/local-execute-functions';
import { loadCredentialsFromEnv, displayCredentialsInfo } from '../helpers/env-loader';

async function testCreatePixPayment() {
	console.log('🧪 Teste: Criar Pagamento PIX\n');

	const credentials = loadCredentialsFromEnv();
	displayCredentialsInfo(credentials);

	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	// Configura parâmetros
	executeFunctions.setParams({
		resource: 'pix',
		operation: 'create',
		amount: 10.50,
		description: 'Teste de pagamento PIX local',
		payerEmail: 'test@example.com',
		// payerDocument: '12345678901', // CPF opcional - comentado para evitar erro de validação
		payerName: 'João Silva',
		externalReference: `TEST-${Date.now()}`,
		idempotencyKey: `IDEMPOTENCY-${Date.now()}`,
	});

	// Configura dados de entrada
	executeFunctions.setInputData([
		{
			json: {
				resource: 'pix',
				operation: 'create',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Pagamento PIX criado com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
		return result[0][0].json.id;
	} catch (error: any) {
		console.error('❌ Erro ao criar pagamento PIX:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testGetPixPayment(paymentId: string) {
	console.log('\n🧪 Teste: Consultar Pagamento PIX\n');
	console.log(`📝 Payment ID: ${paymentId}\n`);

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'pix',
		operation: 'get',
		paymentId,
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'pix',
				operation: 'get',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Pagamento PIX consultado com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao consultar pagamento PIX:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testRefundPixPayment(paymentId: string) {
	console.log('\n🧪 Teste: Reembolsar Pagamento PIX\n');
	console.log(`📝 Payment ID: ${paymentId}\n`);

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'pix',
		operation: 'refund',
		paymentId,
		// refundAmount: 5.00, // Opcional: reembolso parcial
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'pix',
				operation: 'refund',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Pagamento PIX reembolsado com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao reembolsar pagamento PIX:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

// Executa os testes
async function runTests() {
	try {
		console.log('🚀 Iniciando testes locais de PIX\n');
		console.log('='.repeat(50));
		
		// Teste 1: Criar pagamento
		const paymentId = await testCreatePixPayment();
		
		// Aguarda um pouco antes de consultar
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		// Teste 2: Consultar pagamento
		await testGetPixPayment(paymentId);
		
		// Teste 3: Reembolsar pagamento (comentado por padrão para não reembolsar automaticamente)
		// await testRefundPixPayment(paymentId);
		
		console.log('\n' + '='.repeat(50));
		console.log('✨ Todos os testes concluídos!');
	} catch (error) {
		console.error('\n❌ Testes falharam:', error);
		process.exit(1);
	}
}

// Executa se chamado diretamente
if (require.main === module) {
	runTests();
}

export { testCreatePixPayment, testGetPixPayment, testRefundPixPayment };

