interface SendWhatsAppParams {
  to: string;
  clientName: string;
  chargeAmount?: number;
  paymentAmount?: number;
  totalBalance: number;
  description?: string;
  type: 'charge' | 'payment';
}

export async function sendWhatsAppMessage(params: SendWhatsAppParams): Promise<boolean> {
  try {
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al enviar WhatsApp:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('WhatsApp enviado exitosamente:', data);
    return true;
  } catch (error) {
    console.error('Error en sendWhatsAppMessage:', error);
    return false;
  }
}
