import React, { useEffect, useState } from 'react';
    import { BarChart, DollarSign, Users, Building2 } from 'lucide-react';
    import { supabase } from '../lib/supabase'; // Importar o cliente Supabase

    export function DashboardPage() {
      const [totalExpenses, setTotalExpenses] = useState<number>(0);
      const [activeEmployees, setActiveEmployees] = useState<number>(0);

      useEffect(() => {
        fetchTotalExpenses();
        fetchActiveEmployees();
      }, []);

      const fetchTotalExpenses = async () => {
        const { data, error } = await supabase.from('expenses').select('amount');
        if (error) {
          console.error('Error fetching expenses:', error);
        } else {
          const total = data.reduce((acc: number, expense: { amount: number }) => acc + expense.amount, 0);
          setTotalExpenses(total);
        }
      };

      const fetchActiveEmployees = async () => {
        const { data, error } = await supabase.from('employees').select('*');
        if (error) {
          console.error('Error fetching employees:', error);
        } else {
          setActiveEmployees(data.length); // Contar o número de empregados
        }
      };

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="flex gap-4">
              <select className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
              <select className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option>All Companies</option>
                <option>Company A</option>
                <option>Company B</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Expenses"
              value={`$${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} // Formatação com separador de milhar
              change="+12.5%"
              icon={DollarSign}
              trend="up"
            />
            <MetricCard
              title="Active Employees"
              value={activeEmployees.toString()} // Exibir o número de empregados
              change="+3.2%"
              icon={Users}
              trend="up"
            />
            <MetricCard
              title="Companies"
              value="12"
              change="0%"
              icon={Building2}
              trend="neutral"
            />
            <MetricCard
              title="Pending Approvals"
              value="23"
              change="-5.1%"
              icon={BarChart}
              trend="down"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Expense Trends
              </h2>
              <div className="h-80 flex items-center justify-center text-gray-500">
                Chart will be implemented here
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Spenders
              </h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Employee Name
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Department
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      $1,234
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    function MetricCard({
      title,
      value,
      change,
      icon: Icon,
      trend,
    }: {
      title: string;
      value: string;
      change: string;
      icon: React.ElementType;
      trend: 'up' | 'down' | 'neutral';
    }) {
      const trendColor = {
        up: 'text-green-600 dark:text-green-400',
        down: 'text-red-600 dark:text-red-400',
        neutral: 'text-gray-600 dark:text-gray-400',
      }[trend];

      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {value}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <p className={`mt-4 text-sm ${trendColor}`}>{change} from last period</p>
        </div>
      );
    }
