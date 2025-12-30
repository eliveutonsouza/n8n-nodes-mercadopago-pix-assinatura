/**
 * Testes locais para Assinaturas
 * Executa testes reais contra a API do Mercado Pago
 */

import { PixPayment } from '../../nodes/PixPayment/PixPayment.node';
import { LocalExecuteFunctions } from '../helpers/local-execute-functions';
import { loadCredentialsFromEnv, displayCredentialsInfo } from '../helpers/env-loader';

async function testCreateSubscription(planId: string) {
	console.log('🧪 Teste: Criar Assinatura\n');
	console.log(`📝 Plan ID: ${planId}\n`);

	const credentials = loadCredentialsFromEnv();
	displayCredentialsInfo(credentials);

	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'subscriptions',
		operation: 'create',
		planId,
		payerEmail: 'test@example.com',
		payerDocument: '12345678901',
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'subscriptions',
				operation: 'create',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Assinatura criada com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
		return result[0][0].json.id;
	} catch (error: any) {
		console.error('❌ Erro ao criar assinatura:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testGetSubscription(subscriptionId: string) {
	console.log('\n🧪 Teste: Consultar Assinatura\n');
	console.log(`📝 Subscription ID: ${subscriptionId}\n`);

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'subscriptions',
		operation: 'get',
		subscriptionId,
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'subscriptions',
				operation: 'get',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Assinatura consultada com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao consultar assinatura:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testPauseSubscription(subscriptionId: string) {
	console.log('\n🧪 Teste: Pausar Assinatura\n');
	console.log(`📝 Subscription ID: ${subscriptionId}\n`);

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'subscriptions',
		operation: 'pause',
		subscriptionId,
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'subscriptions',
				operation: 'pause',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Assinatura pausada com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao pausar assinatura:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testResumeSubscription(subscriptionId: string) {
	console.log('\n🧪 Teste: Retomar Assinatura\n');
	console.log(`📝 Subscription ID: ${subscriptionId}\n`);

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'subscriptions',
		operation: 'resume',
		subscriptionId,
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'subscriptions',
				operation: 'resume',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Assinatura retomada com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao retomar assinatura:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testCancelSubscription(subscriptionId: string) {
	console.log('\n🧪 Teste: Cancelar Assinatura\n');
	console.log(`📝 Subscription ID: ${subscriptionId}\n`);

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'subscriptions',
		operation: 'cancel',
		subscriptionId,
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'subscriptions',
				operation: 'cancel',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Assinatura cancelada com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao cancelar assinatura:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testListSubscriptions() {
	console.log('\n🧪 Teste: Listar Assinaturas\n');

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'subscriptions',
		operation: 'list',
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'subscriptions',
				operation: 'list',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Assinaturas listadas com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao listar assinaturas:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function runTests(planId?: string) {
	try {
		console.log('🚀 Iniciando testes locais de Assinaturas\n');
		console.log('='.repeat(50));
		
		// Se não forneceu planId, cria um plano primeiro
		if (!planId) {
			console.log('📝 Criando um plano para o teste de assinatura...\n');
			const { testCreatePlan } = await import('./plans.test');
			planId = await testCreatePlan();
			if (!planId) {
				console.log('❌ Não foi possível criar um plano para o teste.');
				return;
			}
			console.log(`✅ Plano criado: ${planId}\n`);
			await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda um pouco
		}
		
		// Teste 1: Criar assinatura
		const subscriptionId = await testCreateSubscription(planId);
		
		// Aguarda um pouco
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		// Teste 2: Consultar assinatura
		await testGetSubscription(subscriptionId);
		
		// Teste 3: Pausar assinatura
		await testPauseSubscription(subscriptionId);
		
		// Aguarda um pouco
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// Teste 4: Retomar assinatura
		await testResumeSubscription(subscriptionId);
		
		// Teste 5: Listar assinaturas
		await testListSubscriptions();
		
		// Teste 6: Cancelar assinatura (comentado por padrão)
		// await testCancelSubscription(subscriptionId);
		
		console.log('\n' + '='.repeat(50));
		console.log('✨ Todos os testes concluídos!');
	} catch (error) {
		console.error('\n❌ Testes falharam:', error);
		process.exit(1);
	}
}

if (require.main === module) {
	const planId = process.argv[2];
	runTests(planId);
}

export { testCreateSubscription, testGetSubscription, testPauseSubscription, testResumeSubscription, testCancelSubscription, testListSubscriptions };

