'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Account, Transaction, ModificationRequest } from '@/types';
import { DollarSign, Plus, History, Clock, User as UserIcon, Calendar, Wallet, MessageCircle, Send, RefreshCw } from 'lucide-react';
import MercadoPagoQR from '@/components/MercadoPagoQR';
import MonthlyHistory from '@/components/MonthlyHistory';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function ClienteDashboard() {
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [requests, setRequests] = useState<ModificationRequest[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showDeleteHistoryConfirm, setShowDeleteHistoryConfirm] = useState(false);
  
  // Form state
  const [requestType, setRequestType] = useState<'cargo' | 'pago'>('pago');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadData();

    // Recargar datos cuando el usuario vuelve a la pestaña
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Recargar datos cada 30 segundos
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  async function loadData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      // Cargar perfil de usuario
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userData) {
        setUserProfile(userData);
      }

      // Cargar cuenta
      const { data: accountData } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (accountData) {
        setAccount(accountData);

        // Cargar transacciones
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .eq('account_id', accountData.id)
          .eq('status', 'aprobado')
          .order('created_at', { ascending: false });

        if (transactionsData) {
          setTransactions(transactionsData);
        }

        // Cargar solicitudes
        const { data: requestsData } = await supabase
          .from('modification_requests')
          .select('*')
          .eq('account_id', accountData.id)
          .order('created_at', { ascending: false });

        if (requestsData) {
          setRequests(requestsData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !account) return;

      await supabase
        .from('modification_requests')
        .insert({
          account_id: account.id,
          type: requestType,
          amount: parseFloat(amount),
          description: description || null,
          requested_by: session.user.id,
        });

      // Reset form
      setAmount('');
      setDescription('');
      setShowRequestForm(false);
      
      // Reload data
      loadData();
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-8 px-4 sm:px-0">
      {/* Perfil de Usuario */}
      {userProfile && (
        <Card className="bg-gradient-to-r from-brand to-brand-light text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold truncate">{userProfile.full_name}</h2>
              <p className="text-sm sm:text-base text-white/80 truncate">{userProfile.email}</p>
              <div className="flex items-center mt-1 sm:mt-2 text-xs sm:text-sm text-white/70">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="truncate">Cliente desde {formatDate(userProfile.created_at)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Últimas Transacciones */}
      {transactions.length > 0 && (
        <Card className="bg-gradient-to-br from-brand to-brand-dark text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold">📋 Historial</h2>
            <div className="flex gap-2">
              <button
                onClick={() => loadData()}
                className="text-xs bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                title="Refrescar"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Refrescar</span>
              </button>
              <button
                onClick={() => setShowDeleteHistoryConfirm(true)}
                className="text-xs bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Eliminar
              </button>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {(showAllTransactions ? transactions : transactions.slice(0, 4)).map((transaction) => (
              <div key={transaction.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={transaction.type === 'cargo' ? 'danger' : 'success'} className="bg-white/20 text-white border-white/30 text-xs">
                      {transaction.type === 'cargo' ? 'Cargo' : 'Pago'}
                    </Badge>
                    <p className="text-[10px] sm:text-xs text-white/70">
                      {new Date(transaction.created_at).toLocaleDateString('es-AR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <p className="font-bold text-xl sm:text-2xl text-white">{formatCurrency(transaction.amount)}</p>
                  {transaction.description && (
                    <p className="text-xs sm:text-sm text-white/90">{transaction.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {transactions.length > 4 && (
            <button
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className="w-full mt-3 sm:mt-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
            >
              {showAllTransactions ? '▲ Mostrar menos' : `▼ Ver todas (${transactions.length})`}
            </button>
          )}
        </Card>
      )}

      {/* Balance y Pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Balance Card */}
        <Card>
          <div className="text-center py-6 sm:py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-lg mb-3 sm:mb-4">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            </div>
            <h2 className="text-base sm:text-lg text-neutral-600 mb-2">Tu saldo actual</h2>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4 sm:mb-6 break-words px-2">
              {formatCurrency(account?.balance || 0)}
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 mb-4 sm:mb-6">
              {(account?.balance || 0) > 0 ? 'Debes pagar este monto' : 'Estás al día'}
            </p>
            
            {/* Botón destacado para notificar pago */}
            {(account?.balance || 0) > 0 && (
              <div className="mb-4 px-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    setRequestType('pago');
                    setShowRequestForm(true);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-sm sm:text-base"
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  💰 Notificar Pago Realizado
                </Button>
                <p className="text-[10px] sm:text-xs text-neutral-500 mt-2">
                  Solicita el descuento de tu saldo después de realizar el pago
                </p>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="inline-flex items-center text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Otra solicitud
            </Button>
          </div>
        </Card>

        {/* Opciones de Pago */}
        {account && (account.balance || 0) > 0 && (
          <Card>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-4">💳 Opciones de Pago</h3>
            
            {/* QR de Mercado Pago */}
            {account.mercadopago_wallet && (
              <div className="mb-6">
                <MercadoPagoQR
                  wallet={account.mercadopago_wallet}
                  amount={account.balance || 0}
                  clientName={userProfile?.full_name || ''}
                />
              </div>
            )}

            {/* Botones de WhatsApp */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-medium text-neutral-700 mb-3">
                📱 Enviar comprobante por WhatsApp:
              </p>
              
              <a
                href={`https://wa.me/5493467494443?text=${encodeURIComponent(
                  `Hola Sebastián! Soy ${userProfile?.full_name || 'un cliente'}.\n\nTe envío el comprobante de pago de mi cuenta corriente.\nSaldo actual: ${formatCurrency(account.balance || 0)}\n\n¡Gracias!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-apple transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-neutral-900">Sebastián</p>
                    <p className="text-sm text-neutral-600">+54 9 3467 49 4443</p>
                  </div>
                </div>
                <Send className="w-5 h-5 text-green-600" />
              </a>

              <a
                href={`https://wa.me/5493467441282?text=${encodeURIComponent(
                  `Hola Claudia! Soy ${userProfile?.full_name || 'un cliente'}.\n\nTe envío el comprobante de pago de mi cuenta corriente.\nSaldo actual: ${formatCurrency(account.balance || 0)}\n\n¡Gracias!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-apple transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-neutral-900">Claudia</p>
                    <p className="text-sm text-neutral-600">+54 9 3467 44 1282</p>
                  </div>
                </div>
                <Send className="w-5 h-5 text-green-600" />
              </a>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-apple">
                <p className="text-xs text-blue-800 mb-3">
                  💡 <strong>Importante:</strong> Después de enviar el comprobante, notifica el pago para que el administrador lo apruebe.
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setRequestType('pago');
                    setShowRequestForm(true);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Notificar Pago Realizado
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <Card>
          <h3 className="text-xl font-bold text-neutral-900 mb-4">
            {requestType === 'pago' ? '💰 Notificar Pago Realizado' : '📋 Nueva Solicitud'}
          </h3>
          
          {requestType === 'pago' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-apple">
              <p className="text-sm text-green-800">
                ✅ <strong>Notificación de Pago:</strong> Completa el formulario para notificar al administrador que realizaste un pago. Una vez aprobado, recibirás una notificación con tu nuevo saldo.
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tipo de operación
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRequestType('pago')}
                  className={`p-4 rounded-apple border-2 transition-all ${
                    requestType === 'pago'
                      ? 'border-green-600 bg-green-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className="font-semibold text-neutral-900">💰 Pago</p>
                  <p className="text-sm text-neutral-600">Descontar saldo</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('cargo')}
                  className={`p-4 rounded-apple border-2 transition-all ${
                    requestType === 'cargo'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className="font-semibold text-neutral-900">📋 Cargo</p>
                  <p className="text-sm text-neutral-600">Consultar cargo</p>
                </button>
              </div>
            </div>

            <Input
              type="number"
              label="Monto"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="0.01"
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                className="w-full px-4 py-2.5 rounded-apple border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                rows={3}
                placeholder="Agrega una nota sobre esta operación..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex space-x-3">
              <Button type="submit" variant="primary" className="flex-1">
                Enviar solicitud
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowRequestForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Pending Requests */}
      {requests.filter(r => r.status === 'pendiente').length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Solicitudes Pendientes
          </h3>
          <div className="space-y-3">
            {requests
              .filter(r => r.status === 'pendiente')
              .map((request) => (
                <Card key={request.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <Badge variant={request.type === 'cargo' ? 'danger' : 'success'}>
                          {request.type === 'cargo' ? 'Cargo' : 'Pago'}
                        </Badge>
                        <Badge variant="warning">Pendiente</Badge>
                      </div>
                      <p className="text-xl font-bold text-neutral-900">
                        {formatCurrency(request.amount)}
                      </p>
                      {request.description && (
                        <p className="text-sm text-neutral-600 mt-1">{request.description}</p>
                      )}
                      <p className="text-xs text-neutral-500 mt-2">
                        {formatDate(request.created_at)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Monthly Transaction History */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <History className="w-6 h-6" />
          Historial Mensual
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          Visualiza tus cargos y pagos organizados por mes
        </p>
        <MonthlyHistory transactions={transactions} />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteHistoryConfirm}
        onClose={() => setShowDeleteHistoryConfirm(false)}
        onConfirm={async () => {
          try {
            await supabase
              .from('transactions')
              .delete()
              .eq('account_id', account?.id);
            setTransactions([]);
          } catch (error) {
            console.error('Error eliminando historial:', error);
          }
        }}
        title="Eliminar historial"
        message="¿Estás seguro de que quieres eliminar todo el historial? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
