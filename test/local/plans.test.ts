/**
 * Testes locais para Planos
 * Executa testes reais contra a API do Mercado Pago
 */

import { PixPayment } from '../../nodes/PixPayment/PixPayment.node';
import { LocalExecuteFunctions } from '../helpers/local-execute-functions';
import { loadCredentialsFromEnv, displayCredentialsInfo } from '../helpers/env-loader';

async function testCreatePlan() {
	console.log('🧪 Teste: Criar Plano\n');

	const credentials = loadCredentialsFromEnv();
	displayCredentialsInfo(credentials);

	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'plans',
		operation: 'create',
		reason: `Plano Teste Local ${Date.now()}`,
		amount: 10.00,
		frequency: 1,
		frequencyType: 'months',
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'plans',
				operation: 'create',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Plano criado com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
		return result[0][0].json.id;
	} catch (error: any) {
		console.error('❌ Erro ao criar plano:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testGetPlan(planId: string) {
	console.log('\n🧪 Teste: Consultar Plano\n');
	console.log(`📝 Plan ID: ${planId}\n`);

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'plans',
		operation: 'get',
		planId,
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'plans',
				operation: 'get',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Plano consultado com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao consultar plano:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testListPlans() {
	console.log('\n🧪 Teste: Listar Planos\n');

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'plans',
		operation: 'list',
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'plans',
				operation: 'list',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Planos listados com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao listar planos:');
		if (error.response?.data) {
			console.error(JSON.stringify(error.response.data, null, 2));
		} else {
			console.error(error.message);
		}
		throw error;
	}
}

async function testUpdatePlan(planId: string) {
	console.log('\n🧪 Teste: Atualizar Plano\n');
	console.log(`📝 Plan ID: ${planId}\n`);

	const credentials = loadCredentialsFromEnv();
	const node = new PixPayment();
	const executeFunctions = new LocalExecuteFunctions(credentials);

	executeFunctions.setParams({
		resource: 'plans',
		operation: 'update',
		planId,
		reason: `Plano Atualizado ${Date.now()}`,
		amount: 149.99,
	});

	executeFunctions.setInputData([
		{
			json: {
				resource: 'plans',
				operation: 'update',
			},
		},
	]);

	try {
		const result = await (node.execute as any).call(executeFunctions);
		console.log('✅ Plano atualizado com sucesso!');
		console.log('\n📋 Resultado:');
		console.log(JSON.stringify(result[0][0].json, null, 2));
	} catch (error: any) {
		console.error('❌ Erro ao atualizar plano:');
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
		console.log('🚀 Iniciando testes locais de Planos\n');
		console.log('='.repeat(50));
		
		// Teste 1: Criar plano
		const planId = await testCreatePlan();
		
		// Aguarda um pouco
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		// Teste 2: Consultar plano
		await testGetPlan(planId);
		
		// Teste 3: Listar planos
		await testListPlans();
		
		// Teste 4: Atualizar plano
		await testUpdatePlan(planId);
		
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

export { testCreatePlan, testGetPlan, testListPlans, testUpdatePlan };

