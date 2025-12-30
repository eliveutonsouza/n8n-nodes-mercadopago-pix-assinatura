/**
 * Script principal para executar testes locais
 * Permite escolher qual recurso testar via menu interativo
 */

import * as readline from 'readline';
import { loadCredentialsFromEnv, displayCredentialsInfo } from '../helpers/env-loader';
import * as pixTests from './pix.test';
import * as plansTests from './plans.test';
import * as subscriptionsTests from './subscriptions.test';
import * as webhooksTests from './webhooks.test';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(query: string): Promise<string> {
	return new Promise(resolve => rl.question(query, resolve));
}

function displayMenu() {
	console.log('\n' + '='.repeat(50));
	console.log('🧪 Testes Locais - Mercado Pago Node');
	console.log('='.repeat(50));
	console.log('\nEscolha o recurso para testar:');
	console.log('1. PIX (Criar, Consultar, Reembolsar)');
	console.log('2. Planos (Criar, Consultar, Listar, Atualizar)');
	console.log('3. Assinaturas (Criar, Pausar, Retomar, Cancelar)');
	console.log('4. Webhooks (Registrar, Consultar, Listar, Excluir)');
	console.log('5. Executar todos os testes');
	console.log('0. Sair');
	console.log('');
}

async function runPixTests() {
	try {
		console.log('\n🚀 Executando testes de PIX...\n');
		const paymentId = await pixTests.testCreatePixPayment();
		await new Promise(resolve => setTimeout(resolve, 2000));
		await pixTests.testGetPixPayment(paymentId);
		console.log('\n✅ Testes de PIX concluídos!');
	} catch (error) {
		console.error('\n❌ Erro nos testes de PIX:', error);
	}
}

async function runPlansTests() {
	try {
		console.log('\n🚀 Executando testes de Planos...\n');
		const planId = await plansTests.testCreatePlan();
		await new Promise(resolve => setTimeout(resolve, 2000));
		await plansTests.testGetPlan(planId);
		await plansTests.testListPlans();
		await plansTests.testUpdatePlan(planId);
		console.log('\n✅ Testes de Planos concluídos!');
	} catch (error) {
		console.error('\n❌ Erro nos testes de Planos:', error);
	}
}

async function runSubscriptionsTests() {
	try {
		console.log('\n🚀 Executando testes de Assinaturas...\n');
		console.log('⚠️  Para criar assinaturas, é necessário um Plan ID.');
		const planId = await question('Digite o Plan ID (ou pressione Enter para pular): ');
		
		if (!planId || planId.trim() === '') {
			console.log('⚠️  Pulando testes de Assinaturas (Plan ID não fornecido)');
			return;
		}
		
		const subscriptionId = await subscriptionsTests.testCreateSubscription(planId.trim());
		await new Promise(resolve => setTimeout(resolve, 2000));
		await subscriptionsTests.testGetSubscription(subscriptionId);
		await subscriptionsTests.testPauseSubscription(subscriptionId);
		await new Promise(resolve => setTimeout(resolve, 1000));
		await subscriptionsTests.testResumeSubscription(subscriptionId);
		await subscriptionsTests.testListSubscriptions();
		console.log('\n✅ Testes de Assinaturas concluídos!');
	} catch (error) {
		console.error('\n❌ Erro nos testes de Assinaturas:', error);
	}
}

async function runWebhooksTests() {
	try {
		console.log('\n🚀 Executando testes de Webhooks...\n');
		const webhookId = await webhooksTests.testRegisterWebhook();
		await new Promise(resolve => setTimeout(resolve, 2000));
		await webhooksTests.testGetWebhook(webhookId);
		await webhooksTests.testListWebhooks();
		console.log('\n✅ Testes de Webhooks concluídos!');
	} catch (error) {
		console.error('\n❌ Erro nos testes de Webhooks:', error);
	}
}

async function runAllTests() {
	console.log('\n🚀 Executando TODOS os testes...\n');
	
	await runPixTests();
	await new Promise(resolve => setTimeout(resolve, 2000));
	
	await runPlansTests();
	await new Promise(resolve => setTimeout(resolve, 2000));
	
	await runSubscriptionsTests();
	await new Promise(resolve => setTimeout(resolve, 2000));
	
	await runWebhooksTests();
	
	console.log('\n' + '='.repeat(50));
	console.log('✨ Todos os testes foram executados!');
	console.log('='.repeat(50));
}

async function main() {
	try {
		// Valida credenciais antes de mostrar o menu
		const credentials = loadCredentialsFromEnv();
		displayCredentialsInfo(credentials);

		while (true) {
			displayMenu();
			const choice = await question('Escolha uma opção: ');

			switch (choice.trim()) {
				case '1':
					await runPixTests();
					break;
				case '2':
					await runPlansTests();
					break;
				case '3':
					await runSubscriptionsTests();
					break;
				case '4':
					await runWebhooksTests();
					break;
				case '5':
					await runAllTests();
					break;
				case '0':
					console.log('\n👋 Até logo!');
					rl.close();
					process.exit(0);
				default:
					console.log('\n❌ Opção inválida. Tente novamente.');
			}

			// Pergunta se deseja continuar
			const continueChoice = await question('\nDeseja executar outro teste? (s/n): ');
			if (continueChoice.trim().toLowerCase() !== 's') {
				console.log('\n👋 Até logo!');
				rl.close();
				process.exit(0);
			}
		}
	} catch (error: any) {
		console.error('\n❌ Erro:', error.message);
		rl.close();
		process.exit(1);
	}
}

// Executa o script principal
if (require.main === module) {
	main();
}

