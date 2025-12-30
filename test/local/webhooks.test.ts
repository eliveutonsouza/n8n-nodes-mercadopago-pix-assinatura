/**
 * Testes locais para Webhooks
 * Executa testes reais contra a API do Mercado Pago
 */

import { PixPayment } from '../../nodes/PixPayment/PixPayment.node';
import { LocalExecuteFunctions } from '../helpers/local-execute-functions';
import { loadCredentialsFromEnv, displayCredentialsInfo } from '../helpers/env-loader';

async function testRegisterWebhook() {
	console.log('🧪 Teste: Registrar Webhook\n');

	const credentials = loadCredentialsFromEnv();
	displayCredentialsInfo(credentials);

	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'webhooks',
		operation: 'register',
		url: 'https://example.com/webhook',
		events: ['payment'],
		description: `Webhook Teste Local ${Date.now()}`,
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'webhooks',
				operation: 'register',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Webhook registrado com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
		return result[0][0].json.id;
	} catch (error: any) {
		console.error('❌ Erro ao registrar webhook:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testGetWebhook(webhookId: string) {
	console.log('\n🧪 Teste: Consultar Webhook\n');
	console.log(`📝 Webhook ID: ${webhookId}\n`);

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'webhooks',
		operation: 'get',
		webhookId,
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'webhooks',
				operation: 'get',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Webhook consultado com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao consultar webhook:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testListWebhooks() {
	console.log('\n🧪 Teste: Listar Webhooks\n');

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'webhooks',
		operation: 'list',
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'webhooks',
				operation: 'list',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Webhooks listados com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao listar webhooks:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testDeleteWebhook(webhookId: string) {
	console.log('\n🧪 Teste: Excluir Webhook\n');
	console.log(`📝 Webhook ID: ${webhookId}\n`);

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'webhooks',
		operation: 'delete',
		webhookId,
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'webhooks',
				operation: 'delete',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Webhook excluído com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao excluir webhook:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function runTests() {
	try {
		console.log('🚀 Iniciando testes locais de Webhooks\n');
		console.log('='.repeat(50));
		
		// Teste 1: Registrar webhook
		const webhookId = await testRegisterWebhook();
		
		// Aguarda um pouco
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		// Teste 2: Consultar webhook
		await testGetWebhook(webhookId);
		
		// Teste 3: Listar webhooks
		await testListWebhooks();
		
		// Teste 4: Excluir webhook (comentado por padrão)
		// await testDeleteWebhook(webhookId);
		
		console.log('\n' + '='.repeat(50));
		console.log('✨ Todos os testes concluídos!');
	} catch (error) {
		console.error('\n❌ Testes falharam:', error);
		process.exit(1);
	}
}

if (require.main === module) {
	runTests();
}

export { testRegisterWebhook, testGetWebhook, testListWebhooks, testDeleteWebhook };

