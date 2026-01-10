'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { User, Account, ModificationRequest } from '@/types';
import { Users, DollarSign, Clock, CheckCircle, Search, Plus, Wallet, Settings, FileText, History, UserPlus, Trash2, Shield, XCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { generateBillPDF } from '@/lib/pdfGenerator';
import { generateReceipt } from '@/lib/receiptGenerator';
import { useToast } from '@/hooks/useToast';
import MonthlyHistory from '@/components/MonthlyHistory';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminDashboard() {
  const [clients, setClients] = useState<(User & { account: Account })[]>([]);
  const [filteredClients, setFilteredClients] = useState<(User & { account: Account })[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ModificationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<(User & { account: Account }) | null>(null);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [showDeductBalanceModal, setShowDeductBalanceModal] = useState(false);
  const [showConfigMPModal, setShowConfigMPModal] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceDescription, setBalanceDescription] = useState('');
  const [mpWallet, setMpWallet] = useState('');
  const [showNewBillModal, setShowNewBillModal] = useState(false);
  const [billAmount, setBillAmount] = useState('');
  const [billDescription, setBillDescription] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [clientHistory, setClientHistory] = useState<any[]>([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [showPaymentConfigModal, setShowPaymentConfigModal] = useState(false);
  const [showDeleteClientConfirm, setShowDeleteClientConfirm] = useState(false);
  const [showDeleteHistoryConfirm, setShowDeleteHistoryConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<(User & { account: Account }) | null>(null);
  const [mpAlias, setMpAlias] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankCbu, setBankCbu] = useState('');
  const [showGlobalHistoryModal, setShowGlobalHistoryModal] = useState(false);
  const [globalHistory, setGlobalHistory] = useState<any[]>([]);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [clientPhone, setClientPhone] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'phone' | 'email' | 'in_person' | 'other'>('whatsapp');
  const [clientNotes, setClientNotes] = useState<any[]>([]);
  const [pendingAdminRequests, setPendingAdminRequests] = useState<any[]>([]);
  const [showAdminApprovalsModal, setShowAdminApprovalsModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  async function loadData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Admin cargando datos. Admin ID:', session?.user.id);
      
      // Cargar clientes con sus cuentas
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*, accounts(*)')
        .eq('role', 'cliente');

      if (usersError) {
        console.error('Error cargando clientes:', usersError);
      }

      if (usersData) {
        console.log('Total de clientes cargados:', usersData.length);
        console.log('Clientes:', usersData.map(u => ({ nombre: u.full_name, email: u.email })));
        
        const formattedClients = usersData.map((user: any) => ({
          ...user,
          account: user.accounts[0]
        }));
        setClients(formattedClients);
        setFilteredClients(formattedClients);
      }

      // Cargar solicitudes pendientes
      const { data: requestsData } = await supabase
        .from('modification_requests')
        .select('*, users!modification_requests_requested_by_fkey(full_name)')
        .eq('status', 'pendiente')
        .order('created_at', { ascending: false });

      if (requestsData) {
        setPendingRequests(requestsData);
      }

      // Cargar solicitudes de aprobación de administradores pendientes
      const { data: adminRequestsData } = await supabase
        .from('admin_approval_requests')
        .select('*')
        .eq('status', 'pendiente')
        .order('requested_at', { ascending: false });

      if (adminRequestsData) {
        setPendingAdminRequests(adminRequestsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApproveRequest(requestId: string, accountId: string, type: string, amount: number) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Obtener saldo actual antes de modificar y el user_id del cliente
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('balance, user_id')
        .eq('id', accountId)
        .single();

      if (accountError || !account) {
        throw new Error('No se pudo obtener la cuenta');
      }

      const balanceBefore = account.balance;
      const newBalance = type === 'cargo' 
        ? account.balance + amount 
        : account.balance - amount;

      // Actualizar solicitud
      await supabase
        .from('modification_requests')
        .update({
          status: 'aprobado',
          reviewed_by: session?.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      // Crear transacción con saldo antes y después
      await supabase
        .from('transactions')
        .insert({
          account_id: accountId,
          type: type,
          amount: amount,
          status: 'aprobado',
          created_by: session?.user.id,
          approved_by: session?.user.id,
          balance_before: balanceBefore,
          balance_after: newBalance,
        });

      // Actualizar balance
      await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', accountId);

      // Crear notificación para el cliente
      const notificationTitle = type === 'pago' 
        ? '✅ Pago Aprobado' 
        : '📋 Cargo Aprobado';
      
      const notificationMessage = type === 'pago'
        ? `Tu pago de ${formatCurrency(amount)} ha sido aprobado.\n\n💰 Saldo anterior: ${formatCurrency(balanceBefore)}\n💰 Saldo actual: ${formatCurrency(newBalance)}\n\n¡Gracias por tu pago!`
        : `Se ha agregado un cargo de ${formatCurrency(amount)} a tu cuenta.\n\n💰 Saldo anterior: ${formatCurrency(balanceBefore)}\n💰 Saldo actual: ${formatCurrency(newBalance)}`;

      await supabase
        .from('notifications')
        .insert({
          user_id: account.user_id,
          title: notificationTitle,
          message: notificationMessage,
          type: 'success',
          read: false,
        });


      showToast(
        type === 'pago' 
          ? `Pago aprobado exitosamente. Saldo descontado: ${formatCurrency(amount)}` 
          : `Cargo aprobado exitosamente. Saldo agregado: ${formatCurrency(amount)}`,
        'success'
      );
      
      loadData();
    } catch (error) {
      console.error('Error approving request:', error);
      showToast('Error al aprobar la solicitud', 'error');
    }
  }

  async function handleRejectRequest(requestId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      await supabase
        .from('modification_requests')
        .update({
          status: 'rechazado',
          reviewed_by: session?.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      showToast('Solicitud rechazada', 'success');
      loadData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      showToast('Error al rechazar la solicitud', 'error');
    }
  }

  async function handleApproveAdmin(userId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user.id) {
        throw new Error('No hay sesión activa');
      }

      console.log('Intentando aprobar admin:', { userId, approvedBy: session.user.id });

      // Llamar a la función de Supabase para aprobar admin
      const { data, error } = await supabase.rpc('approve_admin', {
        p_user_id: userId,
        p_approved_by: session.user.id
      });

      console.log('Respuesta de approve_admin:', { data, error });

      if (error) {
        console.error('Error detallado:', JSON.stringify(error, null, 2));
        throw error;
      }

      showToast('Administrador aprobado exitosamente', 'success');
      loadData();
    } catch (error: any) {
      console.error('Error aprobando administrador:', error);
      console.error('Error completo:', JSON.stringify(error, null, 2));
      showToast(error.message || error.hint || 'Error al aprobar administrador', 'error');
    }
  }

  async function handleRejectAdmin(userId: string, reason?: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user.id) {
        throw new Error('No hay sesión activa');
      }

      // Llamar a la función de Supabase para rechazar admin
      const { error } = await supabase.rpc('reject_admin', {
        p_user_id: userId,
        p_rejected_by: session.user.id,
        p_reason: reason || null
      });

      if (error) throw error;

      showToast('Solicitud de administrador rechazada', 'success');
      setRejectionReason('');
      loadData();
    } catch (error: any) {
      console.error('Error rechazando administrador:', error);
      showToast(error.message || 'Error al rechazar solicitud', 'error');
    }
  }

  async function handleGeneratePDF(client: User & { account: Account }) {
    try {
      if (!client.account) {
        showToast('Error: Cliente sin cuenta asociada', 'error');
        return;
      }

      // Cargar transacciones del cliente
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', client.account.id)
        .eq('type', 'cargo')
        .eq('status', 'aprobado')
        .order('created_at', { ascending: false });

      if (!transactionsData || transactionsData.length === 0) {
        showToast('Este cliente no tiene boletas para generar PDF', 'warning');
        return;
      }

      // Cargar configuración de métodos de pago
      const { data: { session } } = await supabase.auth.getSession();
      const { data: paymentMethods } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('admin_id', session?.user.id)
        .single();

      const bills = transactionsData.map((t: any) => ({
        date: t.created_at,
        amount: t.amount,
        description: t.description || 'Sin descripción'
      }));

      await generateBillPDF({
        clientName: client.full_name,
        clientEmail: client.email,
        bills: bills,
        totalAmount: client.account?.balance || 0,
        mercadoPagoWallet: paymentMethods?.mp_alias || '',
        bankName: paymentMethods?.bank_name || '',
        bankAccount: paymentMethods?.bank_account_number || '',
        bankCbu: paymentMethods?.bank_cbu || ''
      });

      showToast('PDF generado exitosamente', 'success');
    } catch (error) {
      console.error('Error generando PDF:', error);
      showToast('Error al generar el PDF', 'error');
    }
  }

  async function handleShowHistory(client: User & { account: Account }) {
    try {
      if (!client.account) {
        showToast('Error: Cliente sin cuenta asociada', 'error');
        return;
      }

      // Cargar todas las transacciones del cliente
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', client.account.id)
        .order('created_at', { ascending: false });

      // Cargar todas las notas del cliente
      const { data: notesData } = await supabase
        .from('client_notes')
        .select('*')
        .eq('user_id', client.id)
        .order('created_at', { ascending: false });

      setClientHistory(transactionsData || []);
      setClientNotes(notesData || []);
      setSelectedClient(client);
      setShowHistoryModal(true);
    } catch (error) {
      console.error('Error cargando historial:', error);
      showToast('Error al cargar el historial', 'error');
    }
  }

  async function handleContactClient(client: User & { account: Account }) {
    setSelectedClient(client);
    setContactSubject('');
    setContactMessage('');
    setContactMethod('whatsapp');
    setShowContactModal(true);
  }

  async function handleSaveContact() {
    if (!selectedClient || !contactSubject.trim() || !contactMessage.trim()) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Guardar la nota de contacto
      await supabase
        .from('client_notes')
        .insert({
          user_id: selectedClient.id,
          created_by: session?.user.id,
          note_type: 'contact',
          subject: contactSubject,
          message: contactMessage,
          contact_method: contactMethod
        });

      showToast('Contacto registrado exitosamente', 'success');
      setShowContactModal(false);
      
      // Recargar datos si el modal de historial está abierto
      if (showHistoryModal) {
        handleShowHistory(selectedClient);
      }
    } catch (error) {
      console.error('Error guardando contacto:', error);
      showToast('Error al guardar el contacto', 'error');
    }
  }

  async function handleShowGlobalHistory() {
    try {
      // Cargar todas las transacciones con información del cliente
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select(`
          *,
          accounts!inner(
            user_id,
            users!inner(
              full_name,
              email
            )
          )
        `)
        .eq('status', 'aprobado')
        .order('created_at', { ascending: false });

      setGlobalHistory(transactionsData || []);
      setShowGlobalHistoryModal(true);
    } catch (error) {
      console.error('Error cargando historial global:', error);
      showToast('Error al cargar el historial', 'error');
    }
  }

  async function handleAddClientWithoutAccount() {
    try {
      if (!newClientName.trim()) {
        showToast('El nombre es requerido', 'warning');
        return;
      }

      // Generar un UUID temporal único
      const tempId = crypto.randomUUID();

      // Primero crear el registro en users con ID temporal
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: tempId,
          email: newClientEmail || `temp-${Date.now()}@chacinar.local`,
          full_name: newClientName,
          role: 'cliente'
        });

      if (userError) {
        console.error('Error al crear usuario:', userError);
        throw new Error('Error al crear el cliente: ' + userError.message);
      }

      // Luego crear la cuenta vinculada a ese usuario temporal
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .insert({
          user_id: tempId,
          balance: 0,
        })
        .select()
        .single();

      if (accountError) {
        console.error('Error al crear cuenta:', accountError);
        // Si falla, eliminar el usuario temporal
        await supabase.from('users').delete().eq('id', tempId);
        throw new Error('Error al crear la cuenta: ' + accountError.message);
      }

      setShowAddClientModal(false);
      setNewClientName('');
      setNewClientEmail('');
      loadData();
      showToast(`Cliente "${newClientName}" agregado exitosamente. Código de vinculación: ${accountData.link_code}`, 'success');
    } catch (error: any) {
      console.error('Error completo:', error);
      showToast(error.message || 'Error al agregar cliente', 'error');
    }
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  const totalDebt = clients.reduce((sum, client) => sum + (client.account?.balance || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header con buscador */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Panel de Administrador</h1>
          <div className="flex gap-2">
            {pendingAdminRequests.length > 0 && (
              <Button
                variant="primary"
                onClick={() => setShowAdminApprovalsModal(true)}
                className="flex items-center justify-center gap-2 text-sm sm:text-base relative"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Aprobar Admins</span>
                <span className="sm:hidden">Admins</span>
                <Badge variant="danger" className="ml-1">{pendingAdminRequests.length}</Badge>
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={handleShowGlobalHistory}
              className="flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historial Global</span>
              <span className="sm:hidden">Historial</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowPaymentConfigModal(true)}
              className="flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Configurar Métodos de Pago</span>
              <span className="sm:hidden">Métodos de Pago</span>
            </Button>
          </div>
        </div>
        <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6">Gestiona clientes y solicitudes de Chacinar</p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Buscar cliente por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Alerta de Solicitudes de Administradores Pendientes */}
      {pendingAdminRequests.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">
                  {pendingAdminRequests.length} {pendingAdminRequests.length === 1 ? 'Solicitud' : 'Solicitudes'} de Administrador Pendiente{pendingAdminRequests.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-amber-700">
                  {pendingAdminRequests.length === 1 
                    ? 'Hay una nueva solicitud de administrador esperando tu aprobación' 
                    : `Hay ${pendingAdminRequests.length} nuevas solicitudes de administrador esperando tu aprobación`}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAdminApprovalsModal(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Revisar
            </Button>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-red-50 to-white border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-red-700 font-medium">Total Clientes</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-900 mt-1">{clients.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-apple flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-red-50 to-white border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-red-700 font-medium">Deuda Total</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-900 mt-1">{formatCurrency(totalDebt)}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-apple flex items-center justify-center shadow-lg">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-amber-700 font-medium">Solicitudes Pendientes</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-900 mt-1">{pendingRequests.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-apple flex items-center justify-center shadow-lg">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Solicitudes Pendientes</h2>
          <div className="space-y-4">
            {pendingRequests.map((request: any) => (
              <Card key={request.id}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-neutral-900">{request.users.full_name}</h3>
                      <Badge variant={request.type === 'cargo' ? 'danger' : 'success'}>
                        {request.type === 'cargo' ? 'Cargo' : 'Pago'}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 mb-1">
                      {formatCurrency(request.amount)}
                    </p>
                    {request.description && (
                      <p className="text-sm text-neutral-600">{request.description}</p>
                    )}
                    <p className="text-xs text-neutral-500 mt-2">
                      {formatDate(request.created_at)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveRequest(
                        request.id,
                        request.account_id,
                        request.type,
                        request.amount
                      )}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprobar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      Rechazar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Clients List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neutral-900">Clientes</h2>
          <div className="flex items-center gap-3">
            {searchTerm && (
              <p className="text-sm text-neutral-600">
                Mostrando {filteredClients.length} de {clients.length} clientes
              </p>
            )}
            <Button
              variant="secondary"
              onClick={() => setShowAddClientModal(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Agregar Cliente
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-600">No se encontraron clientes</p>
            </div>
          ) : (
            filteredClients.map((client) => (
            <Card 
              key={client.id} 
              hover
              onClick={() => handleShowHistory(client)}
              className="cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-900">{client.full_name}</h3>
                  <Badge variant={client.account?.balance > 0 ? 'danger' : 'success'} className="font-semibold">
                    {client.account?.balance > 0 ? '⚠️ Debe' : '✓ Al día'}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600">{client.email}</p>
                {client.phone && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    📱 {client.phone}
                  </p>
                )}
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Saldo</p>
                  <p className={`text-2xl font-bold mb-3 ${
                    (client.account?.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(client.account?.balance || 0)}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(client);
                        setBalanceAmount('');
                        setBalanceDescription('');
                        setShowAddBalanceModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                      title="Cargar saldo (sumar)"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Sumar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(client);
                        setBalanceAmount('');
                        setBalanceDescription('');
                        setShowDeductBalanceModal(true);
                      }}
                      className="bg-red-600 hover:bg-red-700"
                      title="Descontar saldo (restar)"
                    >
                      <span className="mr-1">−</span>
                      Restar
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(client);
                        setClientPhone(client.phone || '');
                        setShowPhoneModal(true);
                      }}
                      title="Configurar Teléfono"
                    >
                      📱
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(client);
                        setMpWallet(client.account?.mercadopago_wallet || '');
                        setShowConfigMPModal(true);
                      }}
                      title="Configurar Mercado Pago"
                    >
                      <Wallet className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGeneratePDF(client);
                      }}
                      title="Generar PDF"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setClientToDelete(client);
                        setShowDeleteClientConfirm(true);
                      }}
                      className="text-xs text-neutral-500 hover:text-red-600 transition-colors flex items-center gap-1"
                      title="Eliminar cliente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
          )}
        </div>
      </div>

      {/* Modal Cargar Saldo */}
      <Modal
        isOpen={showAddBalanceModal}
        onClose={() => setShowAddBalanceModal(false)}
        title={`Cargar saldo a ${selectedClient?.full_name}`}
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!selectedClient?.account) return;
          
          const amount = parseFloat(balanceAmount);
          if (isNaN(amount) || amount <= 0) {
            showToast('Ingresa un monto válido', 'warning');
            return;
          }

          try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!selectedClient.account) {
              showToast('Error: Cliente sin cuenta asociada', 'error');
              return;
            }
            
            // Obtener saldo actual antes de modificar
            const balanceBefore = selectedClient.account.balance || 0;
            const newBalance = balanceBefore + amount;
            
            // Actualizar saldo
            await supabase
              .from('accounts')
              .update({ balance: newBalance })
              .eq('id', selectedClient.account.id);

            // Crear transacción con saldo antes y después
            const { data: newTransaction, error: transactionError } = await supabase
              .from('transactions')
              .insert({
                account_id: selectedClient.account.id,
                type: 'cargo',
                amount,
                description: balanceDescription || `Carga de saldo por administrador`,
                status: 'aprobado',
                created_by: session?.user.id,
                approved_by: session?.user.id,
                approved_at: new Date().toISOString(),
                balance_before: balanceBefore,
                balance_after: newBalance,
              })
              .select();

            if (transactionError) {
              console.error('Error creando transacción:', transactionError);
              showToast('Error al crear la transacción: ' + transactionError.message, 'error');
              return;
            }
            
            console.log('Transacción creada exitosamente:', newTransaction);

            // Crear notificación para el cliente (solo si tiene user_id)
            if (selectedClient.id) {
              await supabase
                .from('notifications')
                .insert({
                  user_id: selectedClient.id,
                  title: 'Saldo actualizado',
                  message: `Se agregó ${formatCurrency(amount)} a tu cuenta. ${balanceDescription || ''}`,
                  type: 'success'
                });
            }

            // Generar comprobante PDF
            const receiptNumber = `CARGA-${Date.now().toString().slice(-8)}`;
            await generateReceipt({
              clientName: selectedClient.full_name,
              clientEmail: selectedClient.email || 'Sin email',
              amount: amount,
              description: balanceDescription || 'Carga de saldo por administrador',
              date: new Date().toISOString(),
              receiptNumber: receiptNumber
            });

            console.warn('No se pudo enviar el mensaje de WhatsApp');

            setShowAddBalanceModal(false);
            setBalanceAmount('');
            setBalanceDescription('');
            loadData();
            showToast('Saldo cargado exitosamente y comprobante generado', 'success');
          } catch (error) {
            console.error('Error:', error);
            showToast('Error al cargar saldo', 'error');
          }
        }} className="space-y-4">
          <Input
            type="number"
            label="Monto a cargar"
            placeholder="0.00"
            value={balanceAmount}
            onChange={(e) => setBalanceAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-apple border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400"
              placeholder="Motivo de la carga..."
              value={balanceDescription}
              onChange={(e) => setBalanceDescription(e.target.value)}
              rows={3}
            />
          </div>

          <p className="text-sm text-neutral-600">
            Saldo actual: {formatCurrency(selectedClient?.account?.balance || 0)}
          </p>
          <p className="text-sm font-medium text-neutral-900">
            Nuevo saldo: {formatCurrency((selectedClient?.account?.balance || 0) + (parseFloat(balanceAmount) || 0))}
          </p>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 bg-brand hover:bg-brand-dark">
              Cargar Saldo
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowAddBalanceModal(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Descontar Saldo */}
      <Modal
        isOpen={showDeductBalanceModal}
        onClose={() => setShowDeductBalanceModal(false)}
        title={`Descontar saldo a ${selectedClient?.full_name}`}
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!selectedClient?.account) return;
          
          const amount = parseFloat(balanceAmount);
          if (isNaN(amount) || amount <= 0) {
            showToast('Ingresa un monto válido', 'warning');
            return;
          }

          const currentBalance = selectedClient.account.balance || 0;
          if (amount > currentBalance) {
            showToast('El monto a descontar no puede ser mayor al saldo actual', 'error');
            return;
          }

          try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!selectedClient.account) {
              showToast('Error: Cliente sin cuenta asociada', 'error');
              return;
            }
            
            // Obtener saldo actual antes de modificar
            const balanceBefore = selectedClient.account.balance || 0;
            const newBalance = balanceBefore - amount;
            
            // Actualizar saldo
            await supabase
              .from('accounts')
              .update({ balance: newBalance })
              .eq('id', selectedClient.account.id);

            // Crear transacción con saldo antes y después (tipo pago porque reduce el saldo)
            const { data: newTransaction, error: transactionError } = await supabase
              .from('transactions')
              .insert({
                account_id: selectedClient.account.id,
                type: 'pago',
                amount,
                description: balanceDescription || `Descuento de saldo por administrador`,
                status: 'aprobado',
                created_by: session?.user.id,
                approved_by: session?.user.id,
                approved_at: new Date().toISOString(),
                balance_before: balanceBefore,
                balance_after: newBalance,
              })
              .select();

            if (transactionError) {
              console.error('Error creando transacción de pago:', transactionError);
              showToast('Error al crear la transacción: ' + transactionError.message, 'error');
              return;
            }
            
            console.log('Transacción de pago creada exitosamente:', newTransaction);

            // Crear notificación para el cliente
            if (selectedClient.id) {
              await supabase
                .from('notifications')
                .insert({
                  user_id: selectedClient.id,
                  title: 'Saldo descontado',
                  message: `Se descontó ${formatCurrency(amount)} de tu cuenta. ${balanceDescription || ''}\n\nSaldo anterior: ${formatCurrency(balanceBefore)}\nSaldo actual: ${formatCurrency(newBalance)}`,
                  type: 'info'
                });
            }


            setShowDeductBalanceModal(false);
            setBalanceAmount('');
            setBalanceDescription('');
            loadData();
            showToast(`Saldo descontado exitosamente. Nuevo saldo: ${formatCurrency(newBalance)}`, 'success');
          } catch (error) {
            console.error('Error:', error);
            showToast('Error al descontar saldo', 'error');
          }
        }} className="space-y-4">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-4">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Atención:</strong> Vas a <strong>restar/descontar</strong> saldo de la cuenta del cliente. Esta acción quedará registrada en el historial.
            </p>
          </div>

          <Input
            type="number"
            label="Monto a descontar"
            placeholder="0.00"
            value={balanceAmount}
            onChange={(e) => setBalanceAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            max={selectedClient?.account?.balance || 0}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Motivo del descuento (opcional)
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-apple border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400"
              placeholder="Ej: Corrección de saldo, ajuste, etc..."
              value={balanceDescription}
              onChange={(e) => setBalanceDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Saldo actual:</span>
              <span className="font-bold text-neutral-900">{formatCurrency(selectedClient?.account?.balance || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Monto a descontar:</span>
              <span className="font-bold text-red-600">- {formatCurrency(parseFloat(balanceAmount) || 0)}</span>
            </div>
            <div className="border-t border-neutral-300 pt-2 flex justify-between">
              <span className="font-medium text-neutral-900">Nuevo saldo:</span>
              <span className="font-bold text-lg text-neutral-900">
                {formatCurrency((selectedClient?.account?.balance || 0) - (parseFloat(balanceAmount) || 0))}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="danger" className="flex-1 bg-red-600 hover:bg-red-700">
              Descontar Saldo
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowDeductBalanceModal(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Configurar Mercado Pago */}
      <Modal
        isOpen={showConfigMPModal}
        onClose={() => setShowConfigMPModal(false)}
        title={`Configurar Mercado Pago - ${selectedClient?.full_name}`}
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!selectedClient?.account) return;

          try {
            await supabase
              .from('accounts')
              .update({ mercadopago_wallet: mpWallet })
              .eq('id', selectedClient.account.id);

            setShowConfigMPModal(false);
            loadData();
          } catch (error) {
            console.error('Error:', error);
            showToast('Error al configurar Mercado Pago', 'error');
          }
        }} className="space-y-4">
          <Input
            type="text"
            label="Billetera de Mercado Pago"
            placeholder="nombre.usuario o CVU"
            value={mpWallet}
            onChange={(e) => setMpWallet(e.target.value)}
            required
          />
          <p className="text-sm text-neutral-600">
            Ingresa el alias o CVU de Mercado Pago donde el cliente podrá pagar su saldo.
          </p>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 bg-brand hover:bg-brand-dark">
              Guardar
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowConfigMPModal(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Configurar Teléfono */}
      <Modal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        title={`Configurar Teléfono - ${selectedClient?.full_name}`}
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!selectedClient) return;

          try {
            await supabase
              .from('users')
              .update({ phone: clientPhone })
              .eq('id', selectedClient.id);

            setShowPhoneModal(false);
            loadData();
            showToast('Teléfono actualizado correctamente', 'success');
          } catch (error) {
            console.error('Error:', error);
            showToast('Error al actualizar teléfono', 'error');
          }
        }} className="space-y-4">
          <Input
            type="tel"
            label="Teléfono del Cliente"
            placeholder="3467494443"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900 mb-2">
              📱 <strong>Mensajes automáticos por WhatsApp</strong>
            </p>
            <p className="text-xs text-blue-800">
              Cuando agregues un teléfono, el cliente recibirá mensajes automáticos desde el número de Sebastián (+54 9 3467 49 4443) cada vez que:
            </p>
            <ul className="text-xs text-blue-800 mt-2 space-y-1 ml-4">
              <li>• Se le cargue un nuevo saldo</li>
              <li>• Se apruebe un pago realizado</li>
            </ul>
            <p className="text-xs text-blue-700 mt-2">
              Formato: Solo números, sin espacios ni guiones (ej: 3467494443)
            </p>
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 bg-brand hover:bg-brand-dark">
              Guardar
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowPhoneModal(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Nueva Boleta */}
      <Modal
        isOpen={showNewBillModal}
        onClose={() => setShowNewBillModal(false)}
        title="Nueva Boleta"
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          
          const amount = parseFloat(billAmount);
          if (isNaN(amount) || amount <= 0) {
            showToast('Ingresa un monto válido', 'warning');
            return;
          }

          if (!selectedClient) {
            showToast('Selecciona un cliente', 'warning');
            return;
          }

          if (!selectedClient.account) {
            showToast('Error: Cliente sin cuenta asociada', 'error');
            return;
          }

          try {
            const { data: { session } } = await supabase.auth.getSession();
            
            // Obtener saldo actual antes de modificar
            const balanceBefore = selectedClient.account.balance || 0;
            const newBalance = balanceBefore + amount;
            
            // Actualizar saldo
            await supabase
              .from('accounts')
              .update({ balance: newBalance })
              .eq('id', selectedClient.account.id);

            // Crear transacción con saldo antes y después
            await supabase
              .from('transactions')
              .insert({
                account_id: selectedClient.account.id,
                type: 'cargo',
                amount: amount,
                description: billDescription || `Boleta del ${billDate}`,
                status: 'aprobado',
                created_by: session?.user?.id,
                approved_by: session?.user?.id,
                approved_at: new Date().toISOString(),
                created_at: billDate + 'T00:00:00Z',
                balance_before: balanceBefore,
                balance_after: newBalance,
              });

            // Crear notificación para el cliente (solo si tiene user_id)
            if (selectedClient.id) {
              await supabase
                .from('notifications')
                .insert({
                  user_id: selectedClient.id,
                  title: 'Nueva boleta agregada',
                  message: `Se agregó una boleta de ${formatCurrency(amount)} a tu cuenta. ${billDescription || ''}`,
                  type: 'info'
                });
            }

            // Generar comprobante PDF
            const receiptNumber = `BOL-${Date.now().toString().slice(-8)}`;
            await generateReceipt({
              clientName: selectedClient.full_name,
              clientEmail: selectedClient.email || 'Sin email',
              amount: amount,
              description: billDescription || `Boleta del ${billDate}`,
              date: billDate,
              receiptNumber: receiptNumber
            });

            setShowNewBillModal(false);
            setBillAmount('');
            setBillDescription('');
            setBillDate(new Date().toISOString().split('T')[0]);
            loadData();
            showToast('Boleta creada exitosamente y comprobante generado', 'success');
          } catch (error) {
            console.error('Error:', error);
            showToast('Error al crear la boleta', 'error');
          }
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Cliente
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-apple border border-neutral-300 bg-white text-neutral-900"
              value={selectedClient?.id || ''}
              onChange={(e) => {
                const client = clients.find(c => c.id === e.target.value);
                setSelectedClient(client || null);
              }}
              required
            >
              <option value="">Selecciona un cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name} - {client.email}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="date"
            label="Fecha de la boleta"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            required
          />

          <Input
            type="number"
            label="Monto"
            placeholder="0.00"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Descripción
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-apple border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400"
              placeholder="Descripción de la compra..."
              value={billDescription}
              onChange={(e) => setBillDescription(e.target.value)}
              rows={3}
            />
          </div>

          {selectedClient && (
            <div className="bg-neutral-50 p-4 rounded-apple">
              <p className="text-sm text-neutral-600 mb-1">
                Saldo actual: {formatCurrency(selectedClient.account?.balance || 0)}
              </p>
              <p className="text-sm font-medium text-neutral-900">
                Nuevo saldo: {formatCurrency((selectedClient.account?.balance || 0) + (parseFloat(billAmount) || 0))}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 bg-brand hover:bg-brand-dark">
              Crear Boleta
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowNewBillModal(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Historial del Cliente */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title={`Historial de ${selectedClient?.full_name || 'Cliente'}`}
        size="xl"
      >
        <div className="space-y-4">
          {/* Resumen */}
          <div className="bg-neutral-50 p-4 rounded-apple">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Cliente</p>
                <p className="font-semibold text-neutral-900">{selectedClient?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Email</p>
                <p className="font-semibold text-neutral-900">{selectedClient?.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Saldo Actual</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatCurrency(selectedClient?.account?.balance || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Transacciones</p>
                <p className="text-2xl font-bold text-neutral-900">{clientHistory.length}</p>
              </div>
            </div>
          </div>

          {/* Historial Mensual de Transacciones */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-neutral-900 flex items-center">
                <History className="w-5 h-5 mr-2" />
                Historial Mensual
              </h3>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setShowDeleteHistoryConfirm(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar historial
              </Button>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Visualiza los cargos y pagos organizados por mes
            </p>
            <div className="max-h-[500px] overflow-y-auto">
              <MonthlyHistory transactions={clientHistory} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => handleGeneratePDF(selectedClient!)}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generar PDF
            </Button>
            <Button variant="ghost" onClick={() => setShowHistoryModal(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Agregar Cliente sin Cuenta */}
      <Modal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        title="Agregar Cliente sin Cuenta"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-apple p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Cliente sin acceso al sistema:</strong> Este cliente no tendrá cuenta de usuario para iniciar sesión. 
              Se le asignará un código de vinculación que podrá usar en el futuro si desea crear una cuenta.
            </p>
          </div>

          <Input
            type="text"
            label="Nombre completo *"
            placeholder="Juan Pérez"
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            required
          />

          <Input
            type="email"
            label="Email (opcional)"
            placeholder="cliente@email.com"
            value={newClientEmail}
            onChange={(e) => setNewClientEmail(e.target.value)}
          />

          <div className="bg-neutral-50 p-3 rounded-apple">
            <p className="text-xs text-neutral-600">
              💡 <strong>Código de vinculación:</strong> Se generará automáticamente un código de 4 dígitos 
              que el cliente podrá usar para vincular su cuenta en el futuro.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleAddClientWithoutAccount}
              className="flex-1 bg-brand hover:bg-brand-dark"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Cliente
            </Button>
            <Button variant="ghost" onClick={() => setShowAddClientModal(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Configuración de Métodos de Pago */}
      <Modal
        isOpen={showPaymentConfigModal}
        onClose={() => setShowPaymentConfigModal(false)}
        title="Configuración de Métodos de Pago"
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Verificar si ya existe configuración
            const { data: existing } = await supabase
              .from('payment_methods')
              .select('*')
              .eq('admin_id', session.user.id)
              .single();

            if (existing) {
              // Actualizar
              await supabase
                .from('payment_methods')
                .update({
                  mp_alias: mpAlias,
                  mp_enabled: !!mpAlias,
                  bank_name: bankName,
                  bank_account_number: bankAccount,
                  bank_cbu: bankCbu,
                  bank_enabled: !!(bankName && bankAccount)
                })
                .eq('admin_id', session.user.id);
            } else {
              // Crear
              await supabase
                .from('payment_methods')
                .insert({
                  admin_id: session.user.id,
                  mp_alias: mpAlias,
                  mp_enabled: !!mpAlias,
                  bank_name: bankName,
                  bank_account_number: bankAccount,
                  bank_cbu: bankCbu,
                  bank_enabled: !!(bankName && bankAccount)
                });
            }

            setShowPaymentConfigModal(false);
            showToast('Métodos de pago configurados exitosamente', 'success');
          } catch (error) {
            console.error('Error:', error);
            showToast('Error al configurar métodos de pago', 'error');
          }
        }} className="space-y-6">
          
          {/* Mercado Pago */}
          <div className="border-2 border-blue-200 rounded-apple p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-neutral-900">Mercado Pago</h3>
            </div>
            
            <Input
              type="text"
              label="Alias de Mercado Pago"
              placeholder="chacinar.mp"
              value={mpAlias}
              onChange={(e) => setMpAlias(e.target.value)}
            />
            
            <p className="text-xs text-neutral-600 mt-2">
              💡 Los clientes podrán pagar escaneando el QR con este alias
            </p>
          </div>

          {/* Banco */}
          <div className="border-2 border-green-200 rounded-apple p-4 bg-green-50">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-neutral-900">Transferencia Bancaria</h3>
            </div>
            
            <div className="space-y-3">
              <Input
                type="text"
                label="Nombre del Banco"
                placeholder="Banco Nación"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              
              <Input
                type="text"
                label="Número de Cuenta"
                placeholder="1234567890"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              />
              
              <Input
                type="text"
                label="CBU (opcional)"
                placeholder="0110123456789012345678"
                value={bankCbu}
                onChange={(e) => setBankCbu(e.target.value)}
                maxLength={22}
              />
            </div>
            
            <p className="text-xs text-neutral-600 mt-2">
              💡 Los clientes verán estos datos para realizar transferencias
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-brand hover:bg-brand-dark"
            >
              <Settings className="w-4 h-4 mr-2" />
              Guardar Configuración
            </Button>
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => setShowPaymentConfigModal(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Historial Global */}
      <Modal
        isOpen={showGlobalHistoryModal}
        onClose={() => setShowGlobalHistoryModal(false)}
        title="Historial Global de Transacciones"
      >
        <div className="space-y-4">
          {/* Resumen */}
          <div className="bg-neutral-50 p-4 rounded-apple">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Total Transacciones</p>
                <p className="text-2xl font-bold text-neutral-900">{globalHistory.length}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Cargos</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    globalHistory
                      .filter(t => t.type === 'cargo')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Pagos</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    globalHistory
                      .filter(t => t.type === 'pago')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Deuda Total Actual</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatCurrency(totalDebt)}
                </p>
              </div>
            </div>
          </div>

          {/* Historial de Transacciones */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3 flex items-center">
              <History className="w-5 h-5 mr-2" />
              Todas las Transacciones
            </h3>
            
            {globalHistory.length === 0 ? (
              <div className="text-center py-8 text-neutral-600">
                No hay transacciones registradas
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {globalHistory.map((transaction: any) => {
                  const clientName = transaction.accounts?.users?.full_name || 'Cliente desconocido';
                  const clientEmail = transaction.accounts?.users?.email || '';
                  
                  return (
                    <div 
                      key={transaction.id}
                      className="bg-white border border-neutral-200 rounded-apple p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={transaction.type === 'cargo' ? 'danger' : 'success'}>
                              {transaction.type === 'cargo' ? 'Cargo' : 'Pago'}
                            </Badge>
                            <span className="text-sm font-medium text-neutral-700">{clientName}</span>
                          </div>
                          {clientEmail && (
                            <p className="text-xs text-neutral-500 mb-1">{clientEmail}</p>
                          )}
                          <p className="text-2xl font-bold text-neutral-900">
                            {transaction.type === 'cargo' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-neutral-600">
                            {new Date(transaction.created_at).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-neutral-500">
                            {new Date(transaction.created_at).toLocaleTimeString('es-AR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-neutral-600 mt-2">
                          {transaction.description}
                        </p>
                      )}
                      {(transaction.balance_before !== null || transaction.balance_after !== null) && (
                        <div className="mt-3 pt-3 border-t border-neutral-200">
                          <div className="flex justify-between text-sm">
                            <div>
                              <p className="text-neutral-500">Saldo anterior:</p>
                              <p className="font-semibold text-neutral-700">
                                {formatCurrency(transaction.balance_before || 0)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-neutral-500">Saldo después:</p>
                              <p className="font-semibold text-neutral-700">
                                {formatCurrency(transaction.balance_after || 0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowGlobalHistoryModal(false)} className="flex-1">
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Aprobación de Administradores */}
      <Modal
        isOpen={showAdminApprovalsModal}
        onClose={() => setShowAdminApprovalsModal(false)}
        title="Solicitudes de Aprobación de Administradores"
      >
        <div className="space-y-4">
          {pendingAdminRequests.length === 0 ? (
            <div className="text-center py-8 text-neutral-600">
              No hay solicitudes pendientes
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAdminRequests.map((request: any) => (
                <Card key={request.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-amber-600" />
                          <h3 className="font-semibold text-neutral-900">{request.full_name}</h3>
                          <Badge variant="warning">Pendiente</Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-1">
                          <strong>Email:</strong> {request.email}
                        </p>
                        <p className="text-xs text-neutral-500">
                          <strong>Solicitado:</strong> {new Date(request.requested_at).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-neutral-200">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveAdmin(request.user_id)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprobar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const reason = prompt('Motivo del rechazo (opcional):');
                          handleRejectAdmin(request.user_id, reason || undefined);
                        }}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <Button 
              variant="ghost" 
              onClick={() => setShowAdminApprovalsModal(false)} 
              className="flex-1"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteClientConfirm}
        onClose={() => {
          setShowDeleteClientConfirm(false);
          setClientToDelete(null);
        }}
        onConfirm={async () => {
          if (clientToDelete) {
            try {
              // Eliminar cuenta asociada
              if (clientToDelete.account?.id) {
                await supabase.from('accounts').delete().eq('id', clientToDelete.account.id);
              }
              // Eliminar usuario
              await supabase.from('users').delete().eq('id', clientToDelete.id);
              showToast('Cliente eliminado exitosamente', 'success');
              loadData();
            } catch (error) {
              console.error('Error eliminando cliente:', error);
              showToast('Error al eliminar cliente', 'error');
            }
          }
        }}
        title="Eliminar cliente"
        message={
          <div>
            <p>¿Estás seguro de que quieres eliminar a <strong>{clientToDelete?.full_name}</strong>?</p>
            <p className="mt-2 text-sm">Esta acción no se puede deshacer y eliminará:</p>
            <ul className="list-disc list-inside text-sm mt-1 ml-2">
              <li>El usuario y su cuenta</li>
              <li>Todo su historial de transacciones</li>
              <li>Todas sus notas y configuraciones</li>
            </ul>
          </div>
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={showDeleteHistoryConfirm}
        onClose={() => setShowDeleteHistoryConfirm(false)}
        onConfirm={async () => {
          try {
            await supabase
              .from('transactions')
              .delete()
              .eq('account_id', selectedClient?.account.id);
            setClientHistory([]);
            showToast('Historial eliminado exitosamente', 'success');
          } catch (error) {
            console.error('Error eliminando historial:', error);
            showToast('Error al eliminar historial', 'error');
          }
        }}
        title="Eliminar historial"
        message={`¿Estás seguro de que quieres eliminar todo el historial de ${selectedClient?.full_name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
