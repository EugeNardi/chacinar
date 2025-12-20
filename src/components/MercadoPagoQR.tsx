'use client';

import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency } from '@/lib/utils';
import { generateMercadoPagoQR } from '@/lib/mercadoPagoQR';
import Card from './ui/Card';
import { Wallet, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface MercadoPagoQRProps {
  wallet: string;
  amount: number;
  clientName: string;
}

export default function MercadoPagoQR({ wallet, amount, clientName }: MercadoPagoQRProps) {
  const [copied, setCopied] = useState(false);

  // Generar link de Mercado Pago REAL con alias
  const description = `Pago Chacinar - ${clientName}`;
  const mercadoPagoLink = generateMercadoPagoQR(wallet, amount, description);

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLink = () => {
    window.open(mercadoPagoLink, '_blank');
  };

  if (!wallet) {
    return (
      <Card className="bg-neutral-100">
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-600">
            El administrador aún no ha configurado la billetera de Mercado Pago
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Pagar con Mercado Pago</h3>
              <p className="text-sm text-neutral-600">Escanea el código QR</p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-lg border-2 border-neutral-200 flex justify-center">
          <QRCodeSVG
            value={mercadoPagoLink}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Monto */}
        <div className="bg-brand/5 p-4 rounded-lg text-center">
          <p className="text-sm text-neutral-600 mb-1">Monto a pagar</p>
          <p className="text-3xl font-bold text-brand">
            {formatCurrency(amount)}
          </p>
        </div>

        {/* Billetera */}
        <div className="bg-neutral-50 p-3 rounded-lg">
          <p className="text-xs text-neutral-600 mb-2">Billetera de Mercado Pago:</p>
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono text-neutral-900">{wallet}</code>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
              title="Copiar billetera"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-neutral-600" />
              )}
            </button>
          </div>
        </div>

        {/* Botón para abrir en Mercado Pago */}
        <button
          onClick={handleOpenLink}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-apple flex items-center justify-center gap-2 transition-colors"
        >
          <Wallet className="w-5 h-5" />
          Abrir en Mercado Pago
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Instrucciones */}
        <div className="text-sm text-neutral-600 space-y-2">
          <p className="font-medium text-neutral-900">Instrucciones:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Escanea el código QR o haz clic en el botón azul</li>
            <li>Se abrirá Mercado Pago con el monto exacto</li>
            <li>Verifica el monto: {formatCurrency(amount)}</li>
            <li>Confirma el pago</li>
          </ol>
          <p className="text-xs text-neutral-500 mt-3">
            💡 El saldo se actualizará después de que el administrador confirme tu pago
          </p>
        </div>
      </div>
    </Card>
  );
}
