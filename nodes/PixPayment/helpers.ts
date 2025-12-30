import { MercadoPagoError } from './types';

/**
 * Retorna a URL base da API do Mercado Pago conforme o ambiente
 */
export function getBaseUrl(environment: 'sandbox' | 'production'): string {
	return environment === 'sandbox'
		? 'https://api.mercadopago.com'
		: 'https://api.mercadopago.com';
}

/**
 * Normaliza valor monetário para centavos (inteiro)
 * Exemplo: 10.50 -> 1050
 */
export function normalizeAmount(amount: number): number {
	return Math.round(amount * 100);
}

/**
 * Validação básica de CPF (11 dígitos numéricos)
 */
export function validateCPF(cpf: string): boolean {
	const cleanCPF = cpf.replace(/\D/g, '');
	return cleanCPF.length === 11 && /^\d{11}$/.test(cleanCPF);
}

/**
 * Validação básica de CNPJ (14 dígitos numéricos)
 */
export function validateCNPJ(cnpj: string): boolean {
	const cleanCNPJ = cnpj.replace(/\D/g, '');
	return cleanCNPJ.length === 14 && /^\d{14}$/.test(cleanCNPJ);
}

/**
 * Formata data para ISO8601
 */
export function formatDate(date: Date | string): string {
	if (typeof date === 'string') {
		return new Date(date).toISOString();
	}
	return date.toISOString();
}

/**
 * Normaliza erros da API do Mercado Pago para formato legível
 */
export function handleMercadoPagoError(error: any): MercadoPagoError {
	if (error.response) {
		// Erro HTTP com resposta
		const status = error.response.status || error.statusCode || 500;
		const data = error.response.data || error.body || {};

		let message = data.message || error.message || 'Erro desconhecido na API do Mercado Pago';
		
		if (data.cause && Array.isArray(data.cause) && data.cause.length > 0) {
			const causes = data.cause.map((c: any) => c.description || c.message || c.code).join('; ');
			message = `${message}. Detalhes: ${causes}`;
		}

		return {
			message,
			error: data.error || error.error,
			status,
			cause: data.cause,
		};
	}

	if (error.request) {
		// Erro de rede (sem resposta)
		return {
			message: 'Erro de conexão com a API do Mercado Pago. Verifique sua conexão com a internet.',
			status: 0,
		};
	}

	// Erro genérico
	return {
		message: error.message || 'Erro desconhecido',
		status: error.statusCode || 500,
	};
}

/**
 * Remove caracteres não numéricos de CPF/CNPJ
 */
export function cleanDocument(document: string): string {
	return document.replace(/\D/g, '');
}

/**
 * Valida e retorna o tipo de documento (CPF ou CNPJ)
 */
export function getDocumentType(document: string): 'CPF' | 'CNPJ' | null {
	const clean = cleanDocument(document);
	if (clean.length === 11) return 'CPF';
	if (clean.length === 14) return 'CNPJ';
	return null;
}

/**
 * Valida se o email tem formato válido
 */
export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Normaliza valores numéricos convertendo vírgula para ponto decimal
 * Aceita string ou number e retorna number
 * Exemplo: "14,9" -> 14.9, "14.9" -> 14.9
 */
export function normalizeNumericValue(value: string | number | undefined | null): number {
	if (value === undefined || value === null) {
		return 0;
	}
	
	if (typeof value === 'number') {
		return value;
	}
	
	// Converte string: substitui vírgula por ponto e remove espaços
	const normalized = String(value).trim().replace(',', '.');
	const parsed = parseFloat(normalized);
	
	return isNaN(parsed) ? 0 : parsed;
}

/**
 * Obtém parâmetro do node de forma segura, retornando valor padrão em caso de erro
 * Útil para parâmetros que podem não estar visíveis devido a displayOptions
 */
export function getNodeParameterSafe<T>(
	getNodeParameter: (name: string, itemIndex: number, fallback?: T) => T,
	name: string,
	itemIndex: number,
	fallback: T,
): T {
	try {
		return getNodeParameter(name, itemIndex, fallback);
	} catch (error: any) {
		// Se o erro for "Could not get parameter", retorna o valor padrão
		if (error?.message?.includes('Could not get parameter') || error?.message?.includes('parameter')) {
			return fallback;
		}
		// Para outros erros, relança
		throw error;
	}
}

