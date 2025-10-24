import axios from 'axios'
import { QrCode } from 'lucide-react';

const ABACATEPAY_API_URL = process.env.ABACATEPAY_API_URL || 'https://api.abacatepay.com/v1'
const ABACATEPAY_API_KEY = process.env.ABACATEPAY_API_KEY

// ========== INTERFACES ==========

interface CustomerData {
  name: string
  cellphone: string
  email: string
  taxId: string // CPF
}

interface CustomerResponse {
  id: string
  metadata: CustomerData
}

interface Product {
  externalId: string
  name: string
  description: string
  quantity: number
  price: number // em centavos
}

interface PixQrCodeData {
  qrCode: string
  payload: string
}

interface BillingResponse {
  id: string
  url: string
  amount: number
  status: 'PENDING' | 'PAID' | 'REFUNDED' | 'EXPIRED'
  devMode: boolean
  methods: string[]
  products: Array<{
    id: string
    externalId: string
    quantity: number
  }>
  frequency: string
  nextBilling: string | null
  customer: {
    id: string
    metadata: CustomerData
  }
  pixQrCode?: PixQrCodeData
  createdAt: string
  updatedAt: string
}

/*
  {
		"amount": 123,
		"status": "PENDING",
		"devMode": true,
		"method": "PIX",
		"brCode": "00020101021126580014BR.GOV.BCB.PIX0136devmode-pix-pix_char_dxkA0UasC2g4PNLEuUTpZJ2L52040000530398654061.235802BR5920AbacatePay DevMode6009Sao Paulo62070503***6304B14F",
		"brCodeBase64": "data:image/png;base64,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",
		"platformFee": 80,
		"customerId": "683cc619dcf2c62b8b95d535",
		"description": "<string>",
		"metadata": {
			"externalId": "123"
		},
		"createdAt": "2025-10-21T01:15:47.026Z",
		"updatedAt": "2025-10-21T01:15:47.026Z",
		"expiresAt": "2025-10-21T01:17:50.026Z",
		"id": "pix_char_dxkA0UasC2g4PNLEuUTpZJ2L"
	}
*/

export interface QrCodeResponse {
  amount: number
  status: string
  devMode: boolean
  method: string
  brCode: string
  brCodeBase64: string
  platformFee: number
  customerId: string
  description: string
  metadata: {
    externalId: string
  }
  createdAt: string
  updatedAt: string
  expiresAt: string
  id: string
}

// ========== SERVICE ==========

export class AbacatePayService {
  private static apiKey = ABACATEPAY_API_KEY

  /**
   * ETAPA 1: Criar Cliente
   */
  static async createCustomer(customer: CustomerData) {
    try {
      if (!this.apiKey) {
        throw new Error('ABACATEPAY_API_KEY não configurada')
      }

      const response = await axios.post<{ error: any; data: CustomerResponse }>(
        `${ABACATEPAY_API_URL}/customer/create`,
        customer,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        data: response.data.data,
      }
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao criar cliente',
      }
    }
  }

  /**
   * ETAPA 2: Criar Cobrança (já retorna PIX QR Code)
   */
  static async createBilling(input: {
    frequency: 'ONE_TIME' | 'MULTIPLE_PAYMENTS'
    methods: string[] // ['PIX']
    products: Product[]
    customerId?: string
    customer?: CustomerData
    returnUrl?: string
    completionUrl?: string
    externalId?: string
  }) {
    try {
      if (!this.apiKey) {
        throw new Error('ABACATEPAY_API_KEY não configurada')
      }

      const response = await axios.post<{ error: any; data: BillingResponse }>(
        `${ABACATEPAY_API_URL}/billing/create`,
        input,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        data: response.data.data,
      }
    } catch (error: any) {
      console.error('Erro ao criar cobrança:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao criar cobrança',
      }
    }
  }

  static async createQrCodePix(input: {
    amount: number
    expiresIn: number
    description: string
    customer: {
      name: string
      cellphone: string
      email: string
      taxId: string
    }
    metadata: {
      externalId: string
    }
  }) {
    try {
      if (!this.apiKey) {
        throw new Error('ABACATEPAY_API_KEY não configurada')
      }
      const response = await axios.post<{ error: any; data: QrCodeResponse }>(
        `${ABACATEPAY_API_URL}/pixQrCode/create`,
        input,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return {
        success: true,
        data: response.data.data,
      }
    } catch (error: any) {
      console.error('Erro ao criar QR Code PIX:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao criar QR Code PIX',
      }
    }
  }

  /**
   * Verificar status de um QR Code PIX
   */
  static async checkPixStatus(pixId: string) {
    try {
      if (!this.apiKey) {
        throw new Error('ABACATEPAY_API_KEY não configurada')
      }

      const response = await axios.get<{ error: any; data: QrCodeResponse }>(
        `${ABACATEPAY_API_URL}/pixQrCode/check?id=${pixId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      )

      return {
        success: true,
        data: response.data.data,
      }
    } catch (error: any) {
      console.error('Erro ao verificar PIX:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao verificar PIX',
      }
    }
  }

  /**
   * Buscar informações de uma cobrança
   */
  static async getBilling(billingId: string) {
    try {
      if (!this.apiKey) {
        throw new Error('ABACATEPAY_API_KEY não configurada')
      }

      const response = await axios.get<{ error: any; data: BillingResponse }>(
        `${ABACATEPAY_API_URL}/billing/${billingId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      )

      return {
        success: true,
        data: response.data.data,
      }
    } catch (error: any) {
      console.error('Erro ao buscar cobrança:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar cobrança',
      }
    }
  }

  /**
   * Cancelar uma cobrança
   */
  static async cancelBilling(billingId: string) {
    try {
      if (!this.apiKey) {
        throw new Error('ABACATEPAY_API_KEY não configurada')
      }

      const response = await axios.post(
        `${ABACATEPAY_API_URL}/billing/${billingId}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      )

      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      console.error('Erro ao cancelar cobrança:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao cancelar cobrança',
      }
    }
  }

  /**
   * MÉTODO HELPER: Criar cobrança completa para subscription do TheLeadsFy
   * (Cria cliente E cobrança em uma chamada)
   */
  static async createSubscriptionBilling(customer: CustomerData, metadata?: any) {
    // Criar cobrança com dados do cliente inline
    // A AbacatePay cria o cliente automaticamente
    return this.createBilling({
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      products: [
        {
          externalId: 'professional-plan',
          name: 'Plano Professional',
          description: 'Geração ilimitada de leads por 30 dias',
          quantity: 1,
          price: 1990, // R$ 19,90 em centavos
        },
      ],
      customer: customer, // Passa dados do cliente inline
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      completionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/generate`,
      externalId: `lead-gen-${Date.now()}`,
    })
  }
}
