"use client";
import { useState } from "react";
import { Home, Plus, BarChart2, ShoppingCart, Coffee, Wallet, TrendingUp, Target, AlertCircle } from "lucide-react";
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/navigation';

import type { ReactElement } from "react";

interface Transaction {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  icon: ReactElement;
}

export default function BudgetTracker() {
  const router = useRouter();
  const [balance, setBalance] = useState(258.9);
  const [budget, setBudget] = useState({ used: 1400, limit: 2000 });
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      title: "Income from fam",
      date: "Mar 12",
      amount: 1500,
      type: "income",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Shopping",
      date: "Mar 12",
      amount: 45.50,
      type: "expense",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Coffee",
      date: "Mar 12",
      amount: 3.50,
      type: "expense",
      icon: <Coffee className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Transportation",
      date: "Mar 11",
      amount: 25.00,
      type: "expense",
      icon: <Home className="w-5 h-5" />,
    },
  ]);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const addTransaction = () => {
    // Mock function - in real app, this would open a form
    alert("Add transaction functionality coming soon!");
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetUsage = (budget.used / budget.limit) * 100;
  const isOverBudget = budgetUsage > 100;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="animate-fade-in-up">
                <h1 className="page-title">Budget Tracker</h1>
                <p className="page-subtitle mt-1">Monitor your spending and stay within budget.</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleProfileClick}
                  className="w-12 h-12 rounded-full overflow-hidden shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                >
                  <img
                    src="/profile.jfif"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Balance</h3>
              <p className="text-3xl font-bold text-blue-600">ETB {balance.toFixed(2)}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Income</h3>
              <p className="text-3xl font-bold text-green-600">ETB {totalIncome.toFixed(2)}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600">ETB {totalExpenses.toFixed(2)}</p>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="card p-8 animate-slide-in-left">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Monthly Budget Progress
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Budget Used</span>
                  <span className="text-sm font-medium text-gray-700">
                    ETB {budget.used} / ETB {budget.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm font-medium ${
                    isOverBudget ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {budgetUsage.toFixed(1)}% used
                  </span>
                  {isOverBudget && (
                    <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Over budget!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card p-8 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-green-600" />
              Recent Transactions
            </h2>
            
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{transaction.title}</h3>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}ETB {transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{transaction.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div
              className="card p-6 text-center hover-lift cursor-pointer"
              onClick={() => router.push('/Transaction')}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transactions</h3>
              <p className="text-gray-600">Record new income or expense</p>
            </div>
            
            <div
              className="card p-6 text-center hover-lift cursor-pointer"
              onClick={() => router.push('/SpendingAnalysis')}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Reports</h3>
              <p className="text-gray-600">Analyze spending patterns</p>
            </div>
            
            {/* <div className="card p-6 text-center hover-lift cursor-pointer">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Budget</h3>
              <p className="text-gray-600">Create spending limits</p>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}