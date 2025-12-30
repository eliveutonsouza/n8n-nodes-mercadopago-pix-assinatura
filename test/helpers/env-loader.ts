/**
 * Helper para carregar e validar credenciais de ambiente
 */

import * as dotenv from 'dotenv';
import { MercadoPagoCredentials } from '../../nodes/PixPayment/types';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

/**
 * Valida e retorna as credenciais do Mercado Pago a partir das variáveis de ambiente
 * @throws Error se variáveis obrigatórias estiverem faltando
 */
export function loadCredentialsFromEnv(): MercadoPagoCredentials {
	const requiredVars = ['MP_ACCESS_TOKEN', 'MP_ENVIRONMENT'];
	const missingVars = requiredVars.filter(varName => !process.env[varName]);

	if (missingVars.length > 0) {
		console.error('❌ Variáveis de ambiente obrigatórias faltando:');
		missingVars.forEach(varName => console.error(`   - ${varName}`));
		console.error('\n💡 Crie um arquivo .env na raiz do projeto com as variáveis necessárias.');
		console.error('   Veja .env.example para um template.');
		throw new Error(`Variáveis de ambiente obrigatórias faltando: ${missingVars.join(', ')}`);
	}

	const environment = process.env.MP_ENVIRONMENT as 'sandbox' | 'production';
	if (environment !== 'sandbox' && environment !== 'production') {
		throw new Error(`MP_ENVIRONMENT deve ser 'sandbox' ou 'production', recebido: ${environment}`);
	}

	const credentials: MercadoPagoCredentials = {
		accessToken: process.env.MP_ACCESS_TOKEN!,
		clientId: process.env.MP_CLIENT_ID,
		clientSecret: process.env.MP_CLIENT_SECRET,
		environment,
	};

	return credentials;
}

/**
 * Exibe informações das credenciais carregadas (sem expor tokens completos)
 */
export function displayCredentialsInfo(credentials: MercadoPagoCredentials): void {
	console.log('📋 Credenciais carregadas:');
	console.log(`   Environment: ${credentials.environment}`);
	console.log(`   Access Token: ${credentials.accessToken.substring(0, 20)}...`);
	if (credentials.clientId) {
		console.log(`   Client ID: ${credentials.clientId.substring(0, 10)}...`);
	}
	console.log('');
}

