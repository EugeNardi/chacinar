import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

let client: twilio.Twilio | null = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

interface SendWhatsAppMessageParams {
  to: string;
  clientName: string;
  chargeAmount: number;
  totalBalance: number;
  description?: string;
}

export async function sendBalanceUpdateMessage({
  to,
  clientName,
  chargeAmount,
  totalBalance,
  description
}: SendWhatsAppMessageParams): Promise<boolean> {
  if (!client) {
    console.error('Twilio no está configurado. Verifica las variables de entorno.');
    return false;
  }

  try {
    const formattedPhone = formatPhoneNumber(to);
    
    const message = `Hola ${clientName}! 👋

Se ha registrado un nuevo cargo en tu cuenta corriente de Chacinar:

💰 *Cargo del día:* $${chargeAmount.toFixed(2)}
${description ? `📝 *Concepto:* ${description}\n` : ''}
📊 *Saldo total de tu cuenta:* $${totalBalance.toFixed(2)}

Para consultar tu cuenta o realizar un pago, ingresa a tu panel de cliente.

¿Consultas? Respondé este mensaje.

_Mensaje automático de Chacinar_`;

    const response = await client.messages.create({
      from: twilioWhatsAppNumber,
      to: formattedPhone,
      body: message
    });

    console.log('Mensaje de WhatsApp enviado:', response.sid);
    return true;
  } catch (error) {
    console.error('Error al enviar mensaje de WhatsApp:', error);
    return false;
  }
}

export async function sendPaymentApprovedMessage({
  to,
  clientName,
  paymentAmount,
  newBalance
}: {
  to: string;
  clientName: string;
  paymentAmount: number;
  newBalance: number;
}): Promise<boolean> {
  if (!client) {
    console.error('Twilio no está configurado. Verifica las variables de entorno.');
    return false;
  }

  try {
    const formattedPhone = formatPhoneNumber(to);
    
    const message = `Hola ${clientName}! ✅

Tu pago ha sido aprobado exitosamente:

💚 *Pago aprobado:* $${paymentAmount.toFixed(2)}
📊 *Nuevo saldo:* $${newBalance.toFixed(2)}

${newBalance === 0 ? '🎉 ¡Felicitaciones! Estás al día con tu cuenta.' : ''}

Gracias por tu pago.

_Mensaje automático de Chacinar_`;

    const response = await client.messages.create({
      from: twilioWhatsAppNumber,
      to: formattedPhone,
      body: message
    });

    console.log('Mensaje de pago aprobado enviado:', response.sid);
    return true;
  } catch (error) {
    console.error('Error al enviar mensaje de pago aprobado:', error);
    return false;
  }
}

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('54')) {
    cleaned = cleaned.substring(2);
  }
  
  if (cleaned.startsWith('9')) {
    cleaned = cleaned.substring(1);
  }
  
  if (cleaned.length === 10) {
    return `whatsapp:+549${cleaned}`;
  }
  
  return `whatsapp:+54${cleaned}`;
}

export function isWhatsAppConfigured(): boolean {
  return !!(accountSid && authToken);
}
