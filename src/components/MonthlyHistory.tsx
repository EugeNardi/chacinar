'use client';

import { useState, useMemo } from 'react';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

interface MonthlyHistoryProps {
  transactions: Transaction[];
  showClientName?: boolean;
}

interface MonthlyData {
  month: string;
  year: number;
  charges: Transaction[];
  payments: Transaction[];
  totalCharges: number;
  totalPayments: number;
  netChange: number;
  startBalance: number;
  endBalance: number;
}

export default function MonthlyHistory({ transactions, showClientName = false }: MonthlyHistoryProps) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  const monthlyData = useMemo(() => {
    const grouped: { [key: string]: MonthlyData } = {};

    // Ordenar transacciones por fecha (más recientes primero para procesamiento)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          month: monthName,
          year: date.getFullYear(),
          charges: [],
          payments: [],
          totalCharges: 0,
          totalPayments: 0,
          netChange: 0,
          startBalance: 0,
          endBalance: 0,
        };
      }

      if (transaction.type === 'cargo') {
        grouped[monthKey].charges.push(transaction);
        grouped[monthKey].totalCharges += transaction.amount;
      } else {
        grouped[monthKey].payments.push(transaction);
        grouped[monthKey].totalPayments += transaction.amount;
      }
    });

    // Calcular cambio neto y saldo final para cada mes
    Object.keys(grouped).forEach((key) => {
      const monthTransactions = [...grouped[key].charges, ...grouped[key].payments]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      grouped[key].netChange = grouped[key].totalCharges - grouped[key].totalPayments;
      
      // El saldo final es el balance_after de la transacción más reciente del mes
      if (monthTransactions.length > 0 && monthTransactions[0].balance_after !== null) {
        grouped[key].endBalance = monthTransactions[0].balance_after;
      }
      
      // El saldo inicial es el balance_before de la transacción más antigua del mes
      const oldestTransaction = monthTransactions[monthTransactions.length - 1];
      if (oldestTransaction && oldestTransaction.balance_before !== null) {
        grouped[key].startBalance = oldestTransaction.balance_before;
      }
    });

    // Convertir a array y ordenar por fecha (más recientes primero)
    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, data]) => ({ key, ...data }));
  }, [transactions]);

  const toggleMonth = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  if (transactions.length === 0) {
    return (
      <Card className="text-center py-12">
        <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <p className="text-neutral-600">No hay transacciones registradas</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {monthlyData.map((month) => {
        const isExpanded = expandedMonths.has(month.key);
        const allTransactions = [...month.charges, ...month.payments].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return (
          <Card key={month.key} className="overflow-hidden">
            {/* Header del mes */}
            <button
              onClick={() => toggleMonth(month.key)}
              className="w-full text-left p-4 sm:p-6 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 capitalize truncate">
                      {month.month}
                    </h3>
                  </div>

                  {/* Resumen del mes */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Cargos */}
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-red-700 font-medium mb-1">Cargos</p>
                      <p className="text-xl font-bold text-red-900">
                        $ {(month.totalCharges || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        {month.charges.length} {month.charges.length === 1 ? 'cargo' : 'cargos'}
                      </p>
                    </div>

                    {/* Pagos */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-700 font-medium mb-1">Pagos</p>
                      <p className="text-xl font-bold text-green-900">
                        $ {(month.totalPayments || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {month.payments.length} {month.payments.length === 1 ? 'pago' : 'pagos'}
                      </p>
                    </div>

                    {/* Cambio neto */}
                    <div className={`rounded-lg p-3 ${(month.netChange || 0) > 0 ? 'bg-orange-50' : 'bg-blue-50'}`}>
                      <p className={`text-xs font-medium mb-1 ${(month.netChange || 0) > 0 ? 'text-orange-700' : 'text-blue-700'}`}>
                        Cambio
                      </p>
                      <p className={`text-xl font-bold ${(month.netChange || 0) > 0 ? 'text-orange-900' : 'text-blue-900'}`}>
                        {(month.netChange || 0) > 0 ? '+ $' : '- $'} {Math.abs(month.netChange || 0).toFixed(2)}
                      </p>
                      <p className={`text-xs mt-1 ${(month.netChange || 0) > 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                        {(month.netChange || 0) > 0 ? 'Incremento' : 'Reducción'}
                      </p>
                    </div>

                    {/* Saldo final */}
                    <div className={`rounded-lg p-3 ${
                      (month.endBalance || 0) > 0 ? 'bg-red-50' : 'bg-green-50'
                    }`}>
                      <p className={`text-xs font-medium mb-1 ${(month.endBalance || 0) > 0 ? 'text-red-700' : 'text-green-700'}`}>
                        Saldo final del mes
                      </p>
                      <p className={`text-xl font-bold ${
                        (month.endBalance || 0) > 0 ? 'text-red-900' : 'text-green-900'
                      }`}>
                        $ {(month.endBalance || 0).toFixed(2)}
                      </p>
                      <p className={`text-xs mt-1 ${(month.endBalance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {(month.endBalance || 0) > 0 ? 'Debe' : 'Al día'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botón expandir */}
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-neutral-400" />
                  )}
                </div>
              </div>
            </button>

            {/* Detalle de transacciones */}
            {isExpanded && (
              <div className="border-t border-neutral-200 bg-neutral-50">
                <div className="p-4 sm:p-6 space-y-3">
                  <h4 className="font-semibold text-neutral-900 mb-4">
                    Detalle de transacciones ({allTransactions.length})
                  </h4>
                  {allTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-white rounded-lg p-4 border border-neutral-200 hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant={transaction.type === 'cargo' ? 'danger' : 'success'}>
                              {transaction.type === 'cargo' ? '📈 Cargo' : '💰 Pago'}
                            </Badge>
                            <span className="text-xs text-neutral-500">
                              {formatDate(transaction.created_at)}
                            </span>
                          </div>
                          
                          {transaction.description && (
                            <p className="text-sm text-neutral-700 mb-2">{transaction.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-xs text-neutral-600">
                            <div>
                              <span className="font-medium">Saldo anterior:</span>{' '}
                              {formatCurrency(transaction.balance_before || 0)}
                            </div>
                            <div>
                              <span className="font-medium">Saldo después:</span>{' '}
                              {formatCurrency(transaction.balance_after || 0)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className={`text-xl sm:text-2xl font-bold ${
                            transaction.type === 'cargo' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.type === 'cargo' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
