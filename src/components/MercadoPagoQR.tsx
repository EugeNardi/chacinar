'use client';

import { formatCurrency } from '@/lib/utils';
import Card from './ui/Card';
import { Wallet, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MercadoPagoQRProps {
  wallet: string;
  amount: number;
  clientName: string;
}

export default function MercadoPagoQR({ wallet, amount, clientName }: MercadoPagoQRProps) {
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(wallet);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
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
          <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-neutral-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-neutral-900">Pagar con Mercado Pago</h3>
            <p className="text-sm text-neutral-600">✓ Transferencia instantánea y segura</p>
          </div>
        </div>

        {/* Paso 1: Monto */}
        <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200 text-center">
          <p className="text-sm text-neutral-600 mb-2 font-medium">Paso 1: Monto a transferir</p>
          <p className="text-4xl font-bold text-neutral-900 mb-3">
            {formatCurrency(amount)}
          </p>
          <button
            onClick={handleCopyAmount}
            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg transition-all flex items-center gap-2 mx-auto font-medium"
          >
            {copiedAmount ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar monto</span>
              </>
            )}
          </button>
        </div>

        {/* Paso 2: Alias */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-700 mb-3">Paso 2: Alias de destino</p>
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-neutral-300">
            <div className="flex-1">
              <code className="text-xl font-mono font-bold text-neutral-800 block">{wallet}</code>
            </div>
            <button
              onClick={handleCopyAlias}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg transition-all flex items-center gap-2 font-medium"
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

        {/* Paso 3: Instrucciones */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-neutral-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <p className="font-semibold text-base text-neutral-900">Pasos en Mercado Pago</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-neutral-200">
              <div className="w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-neutral-700 font-bold text-xs">1</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">Abre Mercado Pago</p>
                <p className="text-xs text-neutral-600">En tu celular</p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-neutral-200">
              <div className="w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-neutral-700 font-bold text-xs">2</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">Toca "Transferir"</p>
                <p className="text-xs text-neutral-600">O "Enviar dinero"</p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-neutral-200">
              <div className="w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-neutral-700 font-bold text-xs">3</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">Pega el alias</p>
                <code className="text-xs bg-neutral-100 px-2 py-1 rounded font-mono text-neutral-700">{wallet}</code>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-neutral-200">
              <div className="w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-neutral-700 font-bold text-xs">4</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">Ingresa el monto</p>
                <span className="text-xs font-bold text-neutral-700">{formatCurrency(amount)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-neutral-200">
              <div className="w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-neutral-700 font-bold text-xs">5</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">Confirma el pago</p>
                <p className="text-xs text-neutral-600">Verifica que todo esté correcto</p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-yellow-50 p-2.5 rounded-lg border border-yellow-300">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white font-bold text-xs">6</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-900">¡Importante! Vuelve aquí</p>
                <p className="text-xs text-yellow-800">Usa el botón "Notificar Pago" más abajo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nota de seguridad */}
        <div className="bg-neutral-100 border border-neutral-300 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🔒</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-neutral-900 mb-1">Pago 100% seguro</p>
              <p className="text-xs text-neutral-700">
                Tu pago se procesa directamente en Mercado Pago. Una vez que el administrador confirme tu transferencia, tu saldo se actualizará automáticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
