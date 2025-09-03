'use client'

import Sidebar from '../components/Sidebar'
import { useState } from 'react'
import { Search, Filter, Plus, Download, Eye, Edit, Trash2, Calendar, DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Banknote } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Transaction = {
  id: number
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  paymentMethod: string
  reference: string
}

export default function TransactionPage() {
  const router = useRouter();
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [dateRange, setDateRange] = useState('All Time')

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      description: 'Salary Deposit',
      amount: 2500.00,
      type: 'income',
      category: 'Salary',
      date: '2023-10-15',
      status: 'completed',
      paymentMethod: 'Direct Deposit',
      reference: 'REF-001'
    },
    {
      id: 2,
      description: 'Grocery Shopping',
      amount: 85.50,
      type: 'expense',
      category: 'Food',
      date: '2023-10-14',
      status: 'completed',
      paymentMethod: 'Credit Card',
      reference: 'REF-002'
    },
    {
      id: 3,
      description: 'Freelance Project',
      amount: 500.00,
      type: 'income',
      category: 'Freelance',
      date: '2023-10-13',
      status: 'completed',
      paymentMethod: 'PayPal',
      reference: 'REF-003'
    },
    {
      id: 4,
      description: 'Gas Station',
      amount: 45.00,
      type: 'expense',
      category: 'Transportation',
      date: '2023-10-12',
      status: 'completed',
      paymentMethod: 'Debit Card',
      reference: 'REF-004'
    },
    {
      id: 5,
      description: 'Online Course',
      amount: 120.00,
      type: 'expense',
      category: 'Education',
      date: '2023-10-11',
      status: 'pending',
      paymentMethod: 'Credit Card',
      reference: 'REF-005'
    },
    {
      id: 6,
      description: 'Book Purchase',
      amount: 25.99,
      type: 'expense',
      category: 'Shopping',
      date: '2023-10-10',
      status: 'completed',
      paymentMethod: 'Credit Card',
      reference: 'REF-006'
    }
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: 0, type: 'income' as 'income' | 'expense', category: '', date: '', status: 'completed' as 'completed' | 'pending' | 'failed', paymentMethod: '', reference: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTransaction(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }))
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = transactions.length ? Math.max(...transactions.map(t => t.id)) + 1 : 1
    const reference = `REF-${id.toString().padStart(3, '0')}`
    setTransactions([...transactions, { ...newTransaction, id, reference }])
    setNewTransaction({ description: '', amount: 0, type: 'income', category: '', date: '', status: 'completed', paymentMethod: '', reference: '' })
    setIsAddModalOpen(false)
  }

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setNewTransaction({ ...transaction })
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTransactions(transactions.map(t => t.id === selectedTransaction?.id ? { ...newTransaction, id: t.id, reference: t.reference } : t))
    setIsEditModalOpen(false)
    setSelectedTransaction(null)
  }

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsViewModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'failed': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income': return <TrendingUp className="w-5 h-5" />
      case 'expense': return <TrendingDown className="w-5 h-5" />
      default: return <DollarSign className="w-5 h-5" />
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card': return <CreditCard className="w-4 h-4" />
      case 'Debit Card': return <CreditCard className="w-4 h-4" />
      case 'PayPal': return <Wallet className="w-4 h-4" />
      case 'Direct Deposit': return <Banknote className="w-4 h-4" />
      default: return <Wallet className="w-4 h-4" />
    }
  }

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id))
  }

  const isDateInRange = (dateStr: string, range: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    if (range === 'All Time') return true
    
    if (range === 'Today') {
      return date >= startOfToday
    }
    
    if (range === 'This Week') {
      const startOfWeek = new Date(startOfToday)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      return date >= startOfWeek
    }
    
    if (range === 'This Month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return date >= startOfMonth
    }
    
    if (range === 'Last 3 Months') {
      const startOfPeriod = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      return date >= startOfPeriod
    }
    
    return true
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(search.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'All Types' || transaction.type === typeFilter
    const matchesCategory = categoryFilter === 'All Categories' || transaction.category === categoryFilter
    const matchesStatus = statusFilter === 'All Status' || transaction.status === statusFilter
    const matchesDate = isDateInRange(transaction.date, dateRange)
    return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesDate
  })

  const categories = ['All Categories', ...new Set(transactions.map(t => t.category))]

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const netAmount = totalIncome - totalExpenses
  const completedTransactions = transactions.filter(t => t.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="animate-fade-in-up">
                <h1 className="page-title">Transactions</h1>
                <p className="page-subtitle mt-1">View and manage your financial transactions.</p>
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
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Income</h3>
              <p className="text-3xl font-bold text-green-600">ETB {totalIncome.toFixed(2)}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600">ETB {totalExpenses.toFixed(2)}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Net Amount</h3>
              <p className={`text-3xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ETB {Math.abs(netAmount).toFixed(2)}
              </p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-purple-600">{completedTransactions}</p>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="card p-6 animate-slide-in-left">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  <option>All Types</option>
                  <option>income</option>
                  <option>expense</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  {categories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  <option>All Status</option>
                  <option>completed</option>
                  <option>pending</option>
                  <option>failed</option>
                </select>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  <option>All Time</option>
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4 animate-fade-in-up">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="card p-6 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{transaction.description}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {transaction.date}
                        </span>
                        <span className="flex items-center gap-1">
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                          {transaction.paymentMethod}
                        </span>
                        <span>Ref: {transaction.reference}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}ETB {transaction.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                          {transaction.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleView(transaction)} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(transaction)} className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200" title="Edit transaction">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setTypeFilter('All Types');
                  setCategoryFilter('All Categories');
                  setStatusFilter('All Status');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="card p-6 text-center hover-lift cursor-pointer" onClick={() => setIsAddModalOpen(true)}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Transaction</h3>
              <p className="text-gray-600">Record new transaction</p>
            </div>
          </div>
        </main>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Transaction</h2>
            <form onSubmit={handleAddSubmit}>
              <input
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="input-field mb-4 w-full"
                required
              />
              <input
                name="amount"
                type="number"
                value={newTransaction.amount}
                onChange={handleInputChange}
                placeholder="Amount"
                className="input-field mb-4 w-full"
                required
              />
              <select
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
                className="input-field mb-4 w-full"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                name="category"
                value={newTransaction.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="input-field mb-4 w-full"
                required
              />
              <input
                name="date"
                type="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                className="input-field mb-4 w-full"
                required
              />
              <select
                name="status"
                value={newTransaction.status}
                onChange={handleInputChange}
                className="input-field mb-4 w-full"
                required
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <input
                name="paymentMethod"
                value={newTransaction.paymentMethod}
                onChange={handleInputChange}
                placeholder="Payment Method"
                className="input-field mb-4 w-full"
                required
              />
              <button type="submit" className="btn-primary w-full mb-4">Submit</button>
            </form>
            <button 
              onClick={() => setIsAddModalOpen(false)} 
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
            <p><strong>Description:</strong> {selectedTransaction.description}</p>
            <p><strong>Amount:</strong> ETB {selectedTransaction.amount.toFixed(2)}</p>
            <p><strong>Type:</strong> {selectedTransaction.type}</p>
            <p><strong>Category:</strong> {selectedTransaction.category}</p>
            <p><strong>Date:</strong> {selectedTransaction.date}</p>
            <p><strong>Status:</strong> {selectedTransaction.status}</p>
            <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</p>
            <p><strong>Reference:</strong> {selectedTransaction.reference}</p>
            <button 
              onClick={() => setIsViewModalOpen(false)} 
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Transaction</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="input-field mb-4 w-full"
                required
              />
              <input
                name="amount"
                type="number"
                value={newTransaction.amount}
                onChange={handleInputChange}
                placeholder="Amount"
                className="input-field mb-4 w-full"
                required
              />
              <select
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
                className="input-field mb-4 w-full"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                name="category"
                value={newTransaction.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="input-field mb-4 w-full"
                required
              />
              <input
                name="date"
                type="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                className="input-field mb-4 w-full"
                required
              />
              <select
                name="status"
                value={newTransaction.status}
                onChange={handleInputChange}
                className="input-field mb-4 w-full"
                required
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <input
                name="paymentMethod"
                value={newTransaction.paymentMethod}
                onChange={handleInputChange}
                placeholder="Payment Method"
                className="input-field mb-4 w-full"
                required
              />
              <button type="submit" className="btn-primary w-full mb-4">Submit</button>
            </form>
            <button 
              onClick={() => setIsEditModalOpen(false)} 
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}