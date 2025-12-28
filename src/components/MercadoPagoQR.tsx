'use client';

import { formatCurrency } from '@/lib/utils';
import Card from './ui/Card';
import { Wallet, Copy, Check, Upload } from 'lucide-react';
import { useState } from 'react';

interface MercadoPagoQRProps {
  wallet: string;
  amount: number;
  clientName: string;
}

export default function MercadoPagoQR({ wallet, amount, clientName }: MercadoPagoQRProps) {
  const [copiedAlias, setCopiedAlias] = useState(false);

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(wallet);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
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
    <Card className="bg-white border border-neutral-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-neutral-900">Pagar con Mercado Pago</h3>
            <p className="text-sm text-neutral-600">Transferencia instantánea</p>
          </div>
        </div>

        {/* Monto a pagar */}
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 text-center">
          <p className="text-sm text-blue-700 mb-2 font-medium">Monto a pagar</p>
          <p className="text-4xl font-bold text-blue-900">
            {formatCurrency(amount)}
          </p>
        </div>

        {/* Alias de Mercado Pago */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-700 mb-3">Alias de Mercado Pago</p>
          <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
            <div className="text-center mb-3">
              <code className="text-xl sm:text-2xl font-mono font-bold text-blue-700 break-all">{wallet}</code>
            </div>
            <button
              onClick={handleCopyAlias}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-md"
              title="Copiar alias"
            >
              {copiedAlias ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instrucciones simples */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">📱</span>
            </div>
            <p className="font-semibold text-base text-green-900">Cómo pagar</p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-neutral-900 mb-1">1. Abre Mercado Pago</p>
              <p className="text-xs text-neutral-600">En tu celular</p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-neutral-900 mb-1">2. Toca "Transferir"</p>
              <p className="text-xs text-neutral-600">Busca la opción de transferir dinero</p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-neutral-900 mb-1">3. Ingresa el alias</p>
              <code className="text-sm bg-blue-50 px-2 py-1 rounded font-mono text-blue-700">{wallet}</code>
            </div>

            <div className="bg-white p-3 rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-neutral-900 mb-1">4. Ingresa el monto</p>
              <span className="text-sm font-bold text-blue-700">{formatCurrency(amount)}</span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-neutral-900 mb-1">5. Confirma el pago</p>
              <p className="text-xs text-neutral-600">Verifica que todo esté correcto antes de confirmar</p>
            </div>
          </div>
        </div>

        {/* Importante */}
        <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900 mb-1">⚠️ Después de pagar</p>
              <p className="text-xs text-amber-800">
                Usa el botón "Notificar Pago" más abajo para informar que realizaste la transferencia. El administrador verificará tu pago y actualizará tu saldo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
