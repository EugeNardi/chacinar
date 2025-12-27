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
        grouped[monthKey].totalCharges += (transaction.amount || 0);
      } else {
        grouped[monthKey].payments.push(transaction);
        grouped[monthKey].totalPayments += (transaction.amount || 0);
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
    <div className="space-y-3">
      {monthlyData.map((month) => {
        const isExpanded = expandedMonths.has(month.key);
        const allTransactions = [...month.charges, ...month.payments].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return (
          <Card key={month.key} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Header del mes */}
            <button
              onClick={() => toggleMonth(month.key)}
              className="w-full text-left p-4 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Título del mes */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 capitalize">
                      {month.month}
                    </h3>
                  </div>

                  {/* Resumen compacto para móvil */}
                  <div className="space-y-2">
                    {/* Fila 1: Cargos y Pagos */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-red-50 rounded-lg p-2.5 border border-red-100">
                        <p className="text-[10px] text-red-600 font-semibold uppercase tracking-wide mb-0.5">Cargos</p>
                        <p className="text-lg font-bold text-red-900">
                          ${(month.totalCharges || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-red-600 mt-0.5">
                          {month.charges.length} {month.charges.length === 1 ? 'cargo' : 'cargos'}
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-2.5 border border-green-100">
                        <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide mb-0.5">Pagos</p>
                        <p className="text-lg font-bold text-green-900">
                          ${(month.totalPayments || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-green-600 mt-0.5">
                          {month.payments.length} {month.payments.length === 1 ? 'pago' : 'pagos'}
                        </p>
                      </div>
                    </div>

                    {/* Fila 2: Cambio y Saldo final */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`rounded-lg p-2.5 border ${
                        (month.netChange || 0) > 0 
                          ? 'bg-orange-50 border-orange-100' 
                          : 'bg-blue-50 border-blue-100'
                      }`}>
                        <p className={`text-[10px] font-semibold uppercase tracking-wide mb-0.5 ${
                          (month.netChange || 0) > 0 ? 'text-orange-600' : 'text-blue-600'
                        }`}>
                          Cambio
                        </p>
                        <p className={`text-lg font-bold ${
                          (month.netChange || 0) > 0 ? 'text-orange-900' : 'text-blue-900'
                        }`}>
                          {(month.netChange || 0) > 0 ? '+' : '-'}${Math.abs(month.netChange || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${
                          (month.netChange || 0) > 0 ? 'text-orange-600' : 'text-blue-600'
                        }`}>
                          {(month.netChange || 0) > 0 ? 'Incremento' : 'Reducción'}
                        </p>
                      </div>

                      <div className={`rounded-lg p-2.5 border ${
                        (month.endBalance || 0) > 0 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-green-50 border-green-200'
                      }`}>
                        <p className={`text-[10px] font-semibold uppercase tracking-wide mb-0.5 ${
                          (month.endBalance || 0) > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          Saldo final
                        </p>
                        <p className={`text-lg font-bold ${
                          (month.endBalance || 0) > 0 ? 'text-red-900' : 'text-green-900'
                        }`}>
                          ${(month.endBalance || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${
                          (month.endBalance || 0) > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {(month.endBalance || 0) > 0 ? 'Debe' : 'Al día'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón expandir */}
                <div className="flex-shrink-0 pt-1">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </div>
            </button>

            {/* Detalle de transacciones */}
            {isExpanded && (
              <div className="border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white">
                <div className="p-3 space-y-2">
                  <h4 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide px-1 mb-2">
                    Detalle ({allTransactions.length})
                  </h4>
                  {allTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`rounded-lg p-3 border-l-4 ${
                        transaction.type === 'cargo'
                          ? 'bg-red-50/50 border-red-400'
                          : 'bg-green-50/50 border-green-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              transaction.type === 'cargo'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {transaction.type === 'cargo' ? 'CARGO' : 'PAGO'}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              {formatDate(transaction.created_at)}
                            </span>
                          </div>
                          
                          {transaction.description && (
                            <p className="text-xs text-neutral-700 mb-2 line-clamp-2">{transaction.description}</p>
                          )}
                          
                          <div className="flex flex-col gap-0.5 text-[10px] text-neutral-600">
                            <div>
                              <span className="font-semibold">Antes:</span> {formatCurrency(transaction.balance_before || 0)}
                            </div>
                            <div>
                              <span className="font-semibold">Después:</span> {formatCurrency(transaction.balance_after || 0)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className={`text-xl font-bold ${
                            transaction.type === 'cargo' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.type === 'cargo' ? '+' : '-'}{formatCurrency(transaction.amount)}
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
