export interface MercadoPagoError {
	message: string;
	error?: string;
	status?: number;
	cause?: Array<{
		code: string;
		description: string;
		data?: string;
	}>;
}
