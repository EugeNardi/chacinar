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
    <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-200 shadow-lg">
      <div className="space-y-5">
        {/* Header profesional */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-neutral-900">Pagar con Mercado Pago</h3>
              <p className="text-sm text-blue-600 font-medium">✓ Transferencia instantánea y segura</p>
            </div>
          </div>
        </div>

        {/* Paso 1: Monto */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-center shadow-xl">
          <p className="text-sm text-blue-100 mb-2 font-medium">Paso 1: Monto a transferir</p>
          <p className="text-5xl font-bold text-white mb-1">
            {formatCurrency(amount)}
          </p>
          <button
            onClick={handleCopyAmount}
            className="mt-3 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all flex items-center gap-2 mx-auto font-semibold border border-white/30"
          >
            {copiedAmount ? (
              <>
                <Check className="w-5 h-5" />
                <span>¡Monto copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copiar monto</span>
              </>
            )}
          </button>
        </div>

        {/* Paso 2: Alias */}
        <div className="bg-white p-5 rounded-2xl border-2 border-blue-200 shadow-md">
          <p className="text-sm font-bold text-neutral-700 mb-3">Paso 2: Alias de destino</p>
          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex-1">
              <code className="text-2xl font-mono font-bold text-blue-700 block">{wallet}</code>
            </div>
            <button
              onClick={handleCopyAlias}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center gap-2 font-bold shadow-lg hover:shadow-xl active:scale-95"
              title="Copiar alias"
            >
              {copiedAlias ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copiar alias</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Paso 3: Instrucciones visuales */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <p className="font-bold text-lg text-neutral-900">Pasos en Mercado Pago</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-green-200">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-700 font-bold text-xs">1</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">Abre Mercado Pago</p>
                <p className="text-xs text-neutral-600">En tu celular</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-green-200">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-700 font-bold text-xs">2</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">Toca "Transferir"</p>
                <p className="text-xs text-neutral-600">O "Enviar dinero"</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-green-200">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-700 font-bold text-xs">3</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">Pega el alias</p>
                <code className="text-xs bg-blue-50 px-2 py-1 rounded font-mono text-blue-700">{wallet}</code>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-green-200">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-700 font-bold text-xs">4</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">Ingresa el monto</p>
                <span className="text-xs font-bold text-blue-600">{formatCurrency(amount)}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-green-200">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-700 font-bold text-xs">5</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">Confirma el pago</p>
                <p className="text-xs text-neutral-600">Verifica que todo esté correcto</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl border-2 border-amber-300">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white font-bold text-xs">6</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">¡Importante! Vuelve aquí</p>
                <p className="text-xs text-amber-800">Usa el botón "Notificar Pago" más abajo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nota de seguridad */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🔒</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-purple-900 mb-1">Pago 100% seguro</p>
              <p className="text-xs text-purple-800">
                Tu pago se procesa directamente en Mercado Pago. Una vez que el administrador confirme tu transferencia, tu saldo se actualizará automáticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
