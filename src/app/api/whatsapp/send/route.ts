import { NextRequest, NextResponse } from 'next/server';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

interface SendMessageBody {
  to: string;
  clientName: string;
  chargeAmount?: number;
  paymentAmount?: number;
  totalBalance: number;
  description?: string;
  type: 'charge' | 'payment';
}

function formatPhoneNumber(phone: string): string {
  // Eliminar todos los caracteres no numéricos (espacios, guiones, paréntesis, etc.)
  let cleaned = phone.replace(/\D/g, '');
  
  // Si empieza con 54 (código de Argentina), quitarlo
  if (cleaned.startsWith('54')) {
    cleaned = cleaned.substring(2);
  }
  
  // Si empieza con 9 (para celulares), quitarlo temporalmente
  if (cleaned.startsWith('9')) {
    cleaned = cleaned.substring(1);
  }
  
  // Agregar código de país y 9 para WhatsApp
  if (cleaned.length === 10) {
    return `whatsapp:+549${cleaned}`;
  }
  
  // Fallback: agregar directamente
  return `whatsapp:+549${cleaned}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      return NextResponse.json(
        { error: 'Twilio no está configurado' },
        { status: 500 }
      );
    }

    const body: SendMessageBody = await request.json();
    const { to, clientName, chargeAmount, paymentAmount, totalBalance, description, type } = body;

    if (!to || !clientName || totalBalance === undefined || !type) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(to);
    
    let message = '';
    
    if (type === 'charge' && chargeAmount !== undefined) {
      message = `Hola ${clientName}! 👋

Se ha registrado un nuevo cargo en tu cuenta corriente de Chacinar:

💰 *Cargo del día:* $${chargeAmount.toFixed(2)}
${description ? `📝 *Concepto:* ${description}\n` : ''}
📊 *Saldo total de tu cuenta:* $${totalBalance.toFixed(2)}

Para consultar tu cuenta o realizar un pago, ingresa a tu panel de cliente.

¿Consultas? Respondé este mensaje.

_Mensaje automático de Chacinar_`;
    } else if (type === 'payment' && paymentAmount !== undefined) {
      message = `Hola ${clientName}! ✅

Tu pago ha sido aprobado exitosamente:

💚 *Pago aprobado:* $${paymentAmount.toFixed(2)}
📊 *Nuevo saldo:* $${totalBalance.toFixed(2)}

${totalBalance === 0 ? '🎉 ¡Felicitaciones! Estás al día con tu cuenta.' : ''}

Gracias por tu pago.

_Mensaje automático de Chacinar_`;
    } else {
      return NextResponse.json(
        { error: 'Tipo de mensaje inválido o falta monto' },
        { status: 400 }
      );
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_WHATSAPP_NUMBER,
        To: formattedPhone,
        Body: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Twilio:', errorData);
      return NextResponse.json(
        { error: 'Error al enviar mensaje', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Mensaje de WhatsApp enviado:', data.sid);

    return NextResponse.json({ 
      success: true, 
      messageSid: data.sid,
      to: formattedPhone 
    });

  } catch (error) {
    console.error('Error en API de WhatsApp:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
