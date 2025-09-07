'use client'

import Sidebar from '../components/Sidebar'
import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, BarChart3, Target, AlertCircle, ShoppingCart, Coffee, Home, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'

type SpendingCategory = {
  name: string
  amount: number
  percentage: number
  color: string
  icon: React.ReactElement
}

type MonthlySpending = {
  month: string
  amount: number
  change: number
}

export default function SpendingAnalysisPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('3 Months')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const spendingCategories: SpendingCategory[] = [
    {
      name: 'Food & Dining',
      amount: 450.00,
      percentage: 35,
      color: 'bg-blue-500',
      icon: <Coffee className="w-5 h-5" />
    },
    {
      name: 'Transportation',
      amount: 320.00,
      percentage: 25,
      color: 'bg-green-500',
      icon: <Home className="w-5 h-5" />
    },
    {
      name: 'Shopping',
      amount: 280.00,
      percentage: 22,
      color: 'bg-purple-500',
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      name: 'Education',
      amount: 180.00,
      percentage: 14,
      color: 'bg-orange-500',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      name: 'Entertainment',
      amount: 80.00,
      percentage: 4,
      color: 'bg-red-500',
      icon: <TrendingUp className="w-5 h-5" />
    }
  ]

  const monthlySpending: MonthlySpending[] = [
    { month: 'Jan', amount: 1200, change: 5.2 },
    { month: 'Feb', amount: 1350, change: 12.5 },
    { month: 'Mar', amount: 1280, change: -5.2 },
    { month: 'Apr', amount: 1420, change: 10.9 },
    { month: 'May', amount: 1380, change: -2.8 },
    { month: 'Jun', amount: 1500, change: 8.7 }
  ]

  const numMonthsMap = {
    '1 Month': 1,
    '3 Months': 3,
    '6 Months': 6,
    '1 Year': 12
  } as const;

  const numMonths = numMonthsMap[timeRange as keyof typeof numMonthsMap];
  const filteredMonthly = monthlySpending.slice(-numMonths);
  const totalSpending = filteredMonthly.reduce((sum, m) => sum + m.amount, 0);
  const averageSpending = filteredMonthly.length > 0 ? totalSpending / filteredMonthly.length : 0;
  const monthlyBudget = 1500;
  const periodBudget = monthlyBudget * filteredMonthly.length;
  const budgetUsage = periodBudget > 0 ? (totalSpending / periodBudget) * 100 : 0;
  const isOverBudget = totalSpending > periodBudget;

  const maxAmount = Math.max(...filteredMonthly.map(m => m.amount), 1);

  const getCategoryColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-blue-500': 'bg-blue-100 text-blue-700 border-blue-200',
      'bg-green-500': 'bg-green-100 text-green-700 border-green-200',
      'bg-purple-500': 'bg-purple-100 text-purple-700 border-purple-200',
      'bg-orange-500': 'bg-orange-100 text-orange-700 border-orange-200',
      'bg-red-500': 'bg-red-100 text-red-700 border-red-200'
    }
    return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const colorHex: { [key: string]: string } = {
    'bg-blue-500': '#3B82F6',
    'bg-green-500': '#22C55E',
    'bg-purple-500': '#A855F7',
    'bg-orange-500': '#F97316',
    'bg-red-500': '#EF4444'
  };

  let deg = 0;
  const gradientParts = spendingCategories.map(cat => {
    const from = deg;
    deg += cat.percentage * 3.6;
    return `${colorHex[cat.color]} ${from}deg ${deg}deg`;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="animate-fade-in-up">
                <h1 className="page-title">Spending Analysis</h1>
                <p className="page-subtitle mt-1">Track your spending patterns and financial insights.</p>
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
          {/* Time Range Selector */}
          <div className="card p-6 animate-slide-in-left">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Analysis Period</h2>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input-field"
              >
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Spending</h3>
              <p className="text-3xl font-bold text-blue-600">ETB {totalSpending.toFixed(2)}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Monthly</h3>
              <p className="text-3xl font-bold text-green-600">ETB {averageSpending.toFixed(2)}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget Usage</h3>
              <p className="text-3xl font-bold text-purple-600">{budgetUsage.toFixed(1)}%</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
              <p className={`text-3xl font-bold ${isOverBudget ? 'text-red-600' : 'text-orange-600'}`}>
                {isOverBudget ? 'Over' : 'Under'}
              </p>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="card p-8 animate-slide-in-left">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Budget Progress
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Spending vs Budget</span>
                  <span className="text-sm font-medium text-gray-700">
                    ETB {totalSpending.toFixed(2)} / ETB {periodBudget.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      isOverBudget ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm font-medium ${
                    isOverBudget ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {budgetUsage.toFixed(1)}% used
                  </span>
                  {isOverBudget && (
                    <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Over budget by ETB {(totalSpending - periodBudget).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Spending by Category */}
          <div className="card p-8 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-blue-600" />
              Spending by Category
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart Placeholder */}
              <div className="flex items-center justify-center">
                <div 
                  className="w-64 h-64 rounded-full"
                  style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}
                ></div>
              </div>
              
              {/* Category Breakdown */}
              <div className="space-y-4">
                {spendingCategories.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover-lift"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(category.color)}`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">ETB {category.amount.toFixed(2)}</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${category.color}`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="card p-8 animate-slide-in-left">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              Monthly Spending Trend
            </h2>
            
            <div 
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${filteredMonthly.length}, minmax(0, 1fr))` }}
            >
              {filteredMonthly.map((month, index) => (
                <div
                  key={month.month}
                  className="text-center p-4 bg-gray-50 rounded-lg hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{month.month}</h3>
                  <div className="h-24 flex items-end justify-center mb-2">
                    <div 
                      className="w-8 bg-blue-500 rounded-t"
                      style={{ height: `${(month.amount / maxAmount) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">ETB {month.amount}</p>
                  <div className={`flex items-center justify-center gap-1 text-sm ${
                    month.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {month.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(month.change)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}