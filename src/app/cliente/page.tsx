'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Account, Transaction, ModificationRequest } from '@/types';
import { DollarSign, Plus, History, Clock, User as UserIcon, Calendar, Wallet, MessageCircle, Send } from 'lucide-react';
import MercadoPagoQR from '@/components/MercadoPagoQR';

export default function ClienteDashboard() {
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [requests, setRequests] = useState<ModificationRequest[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  // Form state
  const [requestType, setRequestType] = useState<'cargo' | 'pago'>('pago');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadData();
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
          .order('created_at', { ascending: false })
          .limit(10);

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
    <div className="space-y-8">
      {/* Perfil de Usuario */}
      {userProfile && (
        <Card className="bg-gradient-to-r from-brand to-brand-light text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{userProfile.full_name}</h2>
              <p className="text-white/80">{userProfile.email}</p>
              <div className="flex items-center mt-2 text-sm text-white/70">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Cliente desde {formatDate(userProfile.created_at)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Últimas Boletas */}
      {transactions.filter(t => t.type === 'cargo').length > 0 && (
        <Card className="bg-gradient-to-br from-brand to-brand-dark text-white">
          <h2 className="text-xl font-bold mb-4">📋 Últimas Boletas</h2>
          <div className="space-y-3">
            {transactions
              .filter(t => t.type === 'cargo')
              .slice(0, 3)
              .map((transaction) => (
                <div key={transaction.id} className="bg-white/10 backdrop-blur-sm rounded-apple p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-lg">{formatCurrency(transaction.amount)}</p>
                      <p className="text-sm text-white/80">{formatDate(transaction.created_at)}</p>
                    </div>
                    <Badge variant="success" className="bg-white/20 text-white border-white/30">
                      {transaction.status === 'aprobado' ? 'Aprobado' : transaction.status}
                    </Badge>
                  </div>
                  {transaction.description && (
                    <p className="text-sm text-white/90">{transaction.description}</p>
                  )}
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Balance y Pago */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Balance Card */}
        <Card>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-apple mb-4">
              <DollarSign className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-lg text-neutral-600 mb-2">Tu saldo actual</h2>
            <p className="text-5xl font-bold text-neutral-900 mb-6">
              {formatCurrency(account?.balance || 0)}
            </p>
            <p className="text-sm text-neutral-600 mb-6">
              {(account?.balance || 0) > 0 ? 'Debes pagar este monto' : 'Estás al día'}
            </p>
            
            {/* Botón destacado para notificar pago */}
            {(account?.balance || 0) > 0 && (
              <div className="mb-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    setRequestType('pago');
                    setShowRequestForm(true);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  💰 Notificar Pago Realizado
                </Button>
                <p className="text-xs text-neutral-500 mt-2">
                  Solicita el descuento de tu saldo después de realizar el pago
                </p>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Otra solicitud
            </Button>
          </div>
        </Card>

        {/* Opciones de Pago */}
        {account && (account.balance || 0) > 0 && (
          <Card>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">💳 Opciones de Pago</h3>
            
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
              <p className="text-sm font-medium text-neutral-700 mb-3">
                📱 Enviar comprobante de pago por WhatsApp:
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

      {/* Transaction History */}
      <div>
        <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
          <History className="w-5 h-5 mr-2" />
          Historial de Movimientos
        </h3>
        <Card>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-center text-neutral-600 py-8">
                No hay movimientos registrados
              </p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="py-3 border-b border-neutral-100 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={transaction.type === 'cargo' ? 'danger' : 'success'}>
                          {transaction.type === 'cargo' ? 'Cargo' : 'Pago'}
                        </Badge>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-neutral-600 font-medium">{transaction.description}</p>
                      )}
                      <div className="flex items-center text-xs text-neutral-500 mt-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(transaction.created_at)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        transaction.type === 'cargo' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'cargo' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                  {(transaction.balance_before !== null || transaction.balance_after !== null) && (
                    <div className="mt-2 pt-2 border-t border-neutral-100 flex justify-between text-xs">
                      <div>
                        <span className="text-neutral-500">Saldo anterior: </span>
                        <span className="font-semibold text-neutral-700">
                          {formatCurrency(transaction.balance_before || 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Saldo después: </span>
                        <span className="font-semibold text-neutral-700">
                          {formatCurrency(transaction.balance_after || 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
