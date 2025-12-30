/**
 * Implementação de IExecuteFunctions para testes locais com requisições reais
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { MercadoPagoCredentials } from '../../nodes/PixPayment/types';

interface RequestOptions extends AxiosRequestConfig {
	json?: boolean;
	body?: any;
}

export class LocalExecuteFunctions implements Partial<IExecuteFunctions> {
	private params: { [key: string]: any } = {};
	private credentials: MercadoPagoCredentials;
	private inputData: INodeExecutionData[] = [{ json: {} }];

	constructor(credentials: MercadoPagoCredentials) {
		this.credentials = credentials;
	}

	/**
	 * Define os parâmetros do node
	 */
	setParams(params: { [key: string]: any }): void {
		this.params = params;
	}

	/**
	 * Define os dados de entrada
	 */
	setInputData(data: INodeExecutionData[]): void {
		this.inputData = data;
	}

	/**
	 * Obtém credenciais do tipo especificado
	 */
	async getCredentials<T extends object = MercadoPagoCredentials>(
		type: string,
		_itemIndex?: number,
	): Promise<T> {
		if (type === 'pixPaymentApi') {
			return this.credentials as T;
		}
		throw new Error(`Credential type ${type} not found`);
	}

	/**
	 * Obtém parâmetro do node
	 */
	getNodeParameter(name: string, _itemIndex: number, fallback?: any): any {
		return this.params[name] ?? fallback;
	}

	/**
	 * Obtém dados de entrada
	 */
	getInputData(): INodeExecutionData[] {
		return this.inputData;
	}

	/**
	 * Verifica se deve continuar em caso de falha
	 */
	continueOnFail(): boolean {
		return false;
	}

	/**
	 * Helpers para requisições HTTP
	 */
	helpers = {
		requestWithAuthentication: {
			call: async (
				_context: IExecuteFunctions,
				_credentialType: string,
				options: RequestOptions,
			): Promise<any> => {
				// Prepara a configuração do axios
				const config: AxiosRequestConfig = {
					method: options.method || 'GET',
					url: options.url,
					headers: {
						...options.headers,
						Authorization: `Bearer ${this.credentials.accessToken}`,
					},
				};

				// Adiciona body se existir
				if (options.body) {
					config.data = options.body;
				}

				// Adiciona query params se existirem
				if (options.params) {
					config.params = options.params;
				}

				try {
					const response: AxiosResponse = await axios(config);
					
					// Se json: true, retorna apenas os dados
					if (options.json) {
						return response.data;
					}
					
					return response;
				} catch (error: any) {
					// Normaliza o erro para o formato esperado pelo node
					if (error.response) {
						const errorObj: any = {
							response: {
								status: error.response.status,
								statusText: error.response.statusText,
								data: error.response.data,
							},
							message: error.message,
						};
						throw errorObj;
					}
					
					// Erro de rede ou outro tipo
					throw {
						request: error.request,
						message: error.message,
					};
				}
			},
		},
	} as any;
}

