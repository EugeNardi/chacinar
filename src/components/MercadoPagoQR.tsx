'use client';

import { formatCurrency } from '@/lib/utils';
import Card from './ui/Card';
import { Wallet, Copy, Check, Upload, ExternalLink } from 'lucide-react';
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

  const handleOpenMercadoPago = () => {
    // Intentar abrir la app de Mercado Pago
    // Si no funciona, abre el sitio web
    const mpAppUrl = `mercadopago://`;
    const mpWebUrl = `https://www.mercadopago.com.ar/`;
    
    // Copiar el alias al portapapeles para facilitar el pago
    navigator.clipboard.writeText(wallet);
    
    // Intentar abrir la app
    window.location.href = mpAppUrl;
    
    // Fallback al sitio web después de 1 segundo si la app no se abre
    setTimeout(() => {
      window.open(mpWebUrl, '_blank');
    }, 1000);
  };

  if (!wallet) {
    return (
      <div className="bg-neutral-100 p-6 rounded-xl text-center">
        <Wallet className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <p className="text-neutral-600">
          El administrador aún no ha configurado la billetera de Mercado Pago
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header destacado */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Pagar con Mercado Pago</h3>
            <p className="text-sm text-blue-100">Transferencia instantánea y segura</p>
          </div>
        </div>
      </div>

      <Card className="bg-white border-2 border-blue-200">
        <div className="space-y-4">

        {/* Monto a pagar */}
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 mb-2 font-medium text-center">Monto a pagar</p>
          <p className="text-4xl font-bold text-blue-900 text-center mb-3">
            {formatCurrency(amount)}
          </p>
          <button
            onClick={handleCopyAmount}
            className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-medium"
            title="Copiar monto"
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

        {/* Botón principal para abrir Mercado Pago */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-300">
          <p className="text-sm font-semibold text-blue-900 mb-3 text-center">
            🚀 Paga en 1 clic
          </p>
          <button
            onClick={handleOpenMercadoPago}
            className="w-full px-6 py-5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all flex items-center justify-center gap-3 font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Wallet className="w-7 h-7" />
            <span>Abrir Mercado Pago</span>
            <ExternalLink className="w-6 h-6" />
          </button>
          <p className="text-xs text-blue-700 mt-3 text-center font-medium">
            ✅ El alias se copiará automáticamente al portapapeles
          </p>
        </div>

        {/* Alias de Mercado Pago */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-700 mb-3">O copia el alias manualmente</p>
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
                  <span>Copiar alias</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instrucciones paso a paso */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-xl">📱</span>
            </div>
            <p className="font-bold text-lg text-green-900">Pasos para pagar</p>
          </div>
          
          <div className="space-y-2.5">
            <div className="bg-white p-4 rounded-lg border-2 border-green-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">1</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900 mb-1">Haz clic en "Abrir Mercado Pago"</p>
                  <p className="text-xs text-neutral-600">El botón azul de arriba abrirá la app automáticamente</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-green-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">2</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900 mb-1">Toca "Transferir" en Mercado Pago</p>
                  <p className="text-xs text-neutral-600">Busca la opción de transferir dinero</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-blue-300 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">3</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900 mb-2">Pega el alias (ya está copiado)</p>
                  <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <code className="text-base font-mono font-bold text-blue-700">{wallet}</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-blue-300 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">4</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900 mb-2">Ingresa el monto exacto</p>
                  <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <span className="text-lg font-bold text-blue-700">{formatCurrency(amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-green-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">5</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900 mb-1">Confirma el pago</p>
                  <p className="text-xs text-neutral-600">Verifica que todo esté correcto antes de confirmar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Importante */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 p-5 rounded-xl shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-amber-900 mb-2 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                ¡MUY IMPORTANTE!
              </p>
              <p className="text-sm text-amber-900 font-medium leading-relaxed">
                Después de realizar el pago en Mercado Pago, <span className="font-bold">debes hacer clic en el botón rojo "Notificar Pago Realizado"</span> que está más abajo para informar al administrador. Así verificará tu pago y actualizará tu saldo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </div>
  );
}
