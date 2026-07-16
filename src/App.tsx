import { 
  Users, 
  Calculator, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  LogOut,
  Plus,
  Search,
  Download,
  FileUp,
  Trash2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Building2,
  Clock,
  DollarSign,
  MapPin,
  Briefcase,
  BrainCircuit,
  ShieldAlert,
  Camera,
  XCircle,
  Calendar,
  Bell,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  QrCode,
  ShieldCheck,
  X,
  Award,
  Star,
  Crown,
  Banknote,
  Landmark,
  History,
  FileSearch,
  Receipt,
  HardHat,
  Truck,
  Hammer,
  HandCoins,
  GanttChartSquare,
  Scale,
  Play,
  Printer,
  RefreshCw,
  Eye,
  Save,
  Mail,
  MessageSquare,
  Upload,
  FileCheck,
  Database,
  ArrowDownLeft,
  UserPlus,
  RotateCw,
  Share2,
  Edit2,
  Key,
  Shield,
  AlertTriangle
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Employee, PayrollRecord, PayrollSummary, ContractMilestone } from './types';
import { detectAnomalies, forecastLaborCosts, predictOverrunRisks, analyzeBehavioralPatterns, analyzeContractPayment, analyzeExecutiveDashboard, calculateAttendanceRisk, generateAttendanceInsights } from './services/aiService';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, subItems }: { icon: any, label: string, active: boolean, onClick: () => void, subItems?: { label: string, active: boolean, onClick: () => void }[] }) => {
  const [isOpen, setIsOpen] = useState(active);
  
  return (
    <div className="space-y-0.5">
      <button 
        onClick={() => {
          if (subItems) setIsOpen(!isOpen);
          onClick();
        }}
        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all duration-200 group ${
          active 
            ? 'bg-brand-accent text-brand-primary font-semibold' 
            : 'text-text-muted hover:text-brand-primary hover:bg-brand-accent'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Icon size={16} className={active ? 'text-brand-primary' : 'text-text-light group-hover:text-brand-primary'} />
          <span className="text-xs">{label}</span>
        </div>
        {subItems && (
          <ChevronRight size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        )}
      </button>
      {subItems && isOpen && (
        <div className="ml-6 space-y-0.5 border-l border-slate-100 pl-2">
          {subItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className={`w-full text-left px-2 py-1 rounded-md text-[10px] transition-all ${
                item.active 
                  ? 'text-brand-primary font-medium bg-brand-accent/50' 
                  : 'text-text-light hover:text-brand-primary hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = ({ user, activeTab, searchQuery, setSearchQuery, onToggleNotifications, unreadCount }: any) => (
  <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
    <div className="flex items-center space-x-4 flex-1">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-brand-primary rounded-md flex items-center justify-center shadow-sm">
          <Calculator className="text-white" size={14} />
        </div>
        <span className="text-base font-bold tracking-tight text-brand-dark">Rockwell 365</span>
      </div>
      
      <div className="max-w-xs w-full relative group">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-brand-primary transition-colors" size={14} />
        <input 
          type="text" 
          placeholder={`Search in ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
        />
      </div>
    </div>

    <div className="flex items-center space-x-3">
      <button 
        onClick={onToggleNotifications}
        className="p-1.5 text-text-muted hover:text-brand-primary hover:bg-brand-accent rounded-lg transition-all relative"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <div className="h-6 w-px bg-slate-200 mx-1" />

      <div className="flex items-center space-x-2">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-brand-dark">{user.username}</p>
          <p className="text-[9px] text-text-light font-bold uppercase tracking-wider">{user.role}</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
          <img src={`https://picsum.photos/seed/${user.id}/100/100`} referrerPolicy="no-referrer" alt="Profile" />
        </div>
      </div>
    </div>
  </header>
);

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${
      active 
        ? 'bg-brand-emerald text-brand-dark font-bold shadow-lg shadow-brand-emerald/20' 
        : 'text-white/60 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={18} />
    <span className="text-xs uppercase tracking-wider">{label}</span>
  </button>
);

const SubNavItem = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void, key?: string }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
      active 
        ? 'border-brand-emerald text-brand-emerald' 
        : 'border-transparent text-slate-400 hover:text-slate-600'
    }`}
  >
    {label}
  </button>
);

const SubNav = ({ tabs, activeTab, onTabChange }: { tabs: string[], activeTab: string, onTabChange: (tab: string) => void }) => (
  <div className="flex space-x-2 border-b border-slate-100 mb-6 overflow-x-auto scrollbar-hide">
    {tabs.map(tab => (
      <SubNavItem 
        key={tab} 
        label={tab} 
        active={activeTab === tab} 
        onClick={() => onTabChange(tab)} 
      />
    ))}
  </div>
);

const ExpensesView = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, date: '04/05/2024', type: 'Travel', details: 'Site visit to Colombo Port', attachment: 'receipt_01.pdf', reason: 'Official visit', amount: 12500, status: 'Approved' },
    { id: 2, date: '05/05/2024', type: 'Materials', details: 'Emergency cement purchase', attachment: 'invoice_44.jpg', reason: 'Shortage on site', amount: 45000, status: 'Pending' },
    { id: 3, date: '06/05/2024', type: 'Food', details: 'Overtime dinner for team', attachment: 'bill_99.png', reason: 'Night shift', amount: 8500, status: 'Approved' },
    { id: 4, date: '07/05/2024', type: 'Fuel', details: 'Generator refueling', attachment: 'fuel_rec.pdf', reason: 'Power backup', amount: 22000, status: 'Pending' },
  ]);

  return (
    <div className="space-y-2">
      <div className="glass-card overflow-hidden">
        <div className="p-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-brand-dark">Expense Claims</h3>
            <div className="flex space-x-1">
              <button className="px-1.5 py-0.5 text-[9px] font-medium bg-brand-primary text-white rounded-full">My expenses</button>
              <button className="px-1.5 py-0.5 text-[9px] font-medium text-text-muted hover:bg-slate-100 rounded-full transition-all">Group expenses</button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-light" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-7 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] outline-none focus:ring-1 focus:ring-brand-primary/10 w-32"
              />
            </div>
            <button className="btn-primary text-[9px] py-1 px-2 flex items-center space-x-1">
              <Plus size={10} />
              <span>Add expense</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest">Date</th>
                <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest">Type</th>
                <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest">Details</th>
                <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest">Attachment</th>
                <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest">Reason</th>
                <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest text-right">Amount</th>
                <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest text-center">Status</th>
                <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-2 py-1.5 text-[10px] text-text-main font-medium">{expense.date}</td>
                  <td className="px-2 py-1.5">
                    <span className="px-1 py-0.5 bg-slate-100 text-slate-600 rounded text-[8px] font-bold uppercase">
                      {expense.type}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-[10px] text-text-muted max-w-xs truncate">{expense.details}</td>
                  <td className="px-2 py-1.5">
                    <button className="flex items-center space-x-1 text-brand-primary hover:underline text-[9px] font-medium">
                      <FileText size={10} />
                      <span>{expense.attachment}</span>
                    </button>
                  </td>
                  <td className="px-2 py-1.5 text-[10px] text-text-muted">{expense.reason}</td>
                  <td className="px-2 py-1.5 text-[10px] font-bold text-brand-dark text-right">
                    LKR {expense.amount.toLocaleString()}
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                      expense.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button className="p-1 text-text-light hover:text-brand-primary hover:bg-brand-accent rounded-md transition-all">
                      <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-1.5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[9px] text-text-light font-medium">Showing 4 of 24 expenses</p>
          <div className="flex space-x-1">
            <button className="p-1 border border-slate-200 rounded-md text-text-light hover:bg-white transition-all disabled:opacity-50" disabled>
              <ChevronRight size={12} className="rotate-180" />
            </button>
            <button className="p-1 border border-slate-200 rounded-md text-text-light hover:bg-white transition-all">
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    fetch(`/api/reports/summary/${currentMonth}`)
      .then(res => res.json())
      .then(setSummary);
    fetch('/api/projects').then(res => res.json()).then(setProjects);
  }, []);

  const stats = [
    { label: 'Total Projects', value: projects.length || 12, change: '+2.5%', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Payroll Cost', value: `LKR ${(summary?.total_gross || 4500000).toLocaleString()}`, change: '+12.4%', icon: Calculator, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Employees', value: summary?.total_employees || 142, change: '+4', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'New Hires', value: '8', change: '+2', icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const tasks = [
    { id: 1, title: 'Approve May Payroll', priority: 'High', due: 'Today', status: 'Pending' },
    { id: 2, title: 'Review Site Attendance', priority: 'Medium', due: 'Tomorrow', status: 'In Progress' },
    { id: 3, title: 'Update Contract Terms', priority: 'Low', due: '15 May', status: 'Pending' },
    { id: 4, title: 'Generate Tax Reports', priority: 'High', due: '20 May', status: 'Completed' },
  ];

  return (
    <div className="space-y-1.5">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1.5">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <div className={`p-1 rounded-lg ${stat.bg}`}>
                <stat.icon size={12} className={stat.color} />
              </div>
              <span className="text-[6px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-full">{stat.change}</span>
            </div>
            <p className="text-[9px] text-text-muted font-medium">{stat.label}</p>
            <h3 className="text-xs font-bold text-brand-dark mt-0.5">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Active Projects */}
        <div className="lg:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-brand-dark">Active Projects</h3>
            <button onClick={() => setActiveTab('projects')} className="text-[9px] font-medium text-brand-primary hover:underline">View all</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {projects.slice(0, 4).map((project, idx) => (
              <div key={idx} className="glass-card p-1.5 flex items-center space-x-1.5">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-slate-100" />
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" fill="transparent" strokeDasharray={88} strokeDashoffset={88 * (1 - (project.progress || 0.65))} className="text-brand-primary" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-brand-dark">
                    {Math.round((project.progress || 0.65) * 100)}%
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold text-brand-dark truncate">{project.name}</h4>
                  <p className="text-[8px] text-text-muted mt-0.5">{project.code}</p>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <div className="flex -space-x-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-3.5 h-3.5 rounded-full border border-white bg-slate-200 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${project.id + i}/40/40`} referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[7px] text-text-light font-medium">+12 more</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Tasks */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-brand-dark">My Tasks</h3>
            <button className="p-0.5 text-text-light hover:text-brand-primary hover:bg-brand-accent rounded-md transition-all">
              <Plus size={10} />
            </button>
          </div>

          <div className="glass-card divide-y divide-slate-50">
            {tasks.map(task => (
              <div key={task.id} className="p-1.5 hover:bg-slate-50 transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-1">
                    <div className={`mt-1 w-1 h-1 rounded-full ${
                      task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-[10px] font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{task.title}</p>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <span className="text-[7px] text-text-light flex items-center">
                          <Clock size={7} className="mr-1" /> {task.due}
                        </span>
                        <span className={`text-[7px] font-bold uppercase ${
                          task.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'
                        }`}>{task.status}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-text-light opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={8} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoicingView = () => {
  const [invoiceItems, setInvoiceItems] = useState([
    { id: 1, description: 'Project Management - Colombo Port', quantity: 1, rate: 150000, amount: 150000 },
    { id: 2, description: 'Site Supervision (May)', quantity: 22, rate: 5000, amount: 110000 },
  ]);

  const total = invoiceItems.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-brand-dark">Create New Invoice</h2>
          <p className="text-[10px] text-text-muted">Generate a professional invoice for your clients</p>
        </div>
        <div className="flex space-x-1.5">
          <button className="px-2 py-1 text-[10px] font-medium text-text-muted hover:bg-slate-100 rounded-lg transition-all">Save Draft</button>
          <button className="btn-primary text-[10px] py-1 px-3">Send Invoice</button>
        </div>
      </div>

      <div className="glass-card p-2 space-y-2">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[8px] font-bold text-text-light uppercase tracking-widest">Client Details</label>
            <select className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:ring-1 focus:ring-brand-primary/10">
              <option>Select Client...</option>
              <option>Port Authority Sri Lanka</option>
              <option>Access Engineering PLC</option>
            </select>
            <textarea 
              placeholder="Billing Address" 
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:ring-1 focus:ring-brand-primary/10 h-12 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[8px] font-bold text-text-light uppercase tracking-widest">Invoice Info</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <span className="text-[8px] text-text-light font-medium">Invoice Number</span>
                <input type="text" value="INV-2024-001" readOnly className="w-full p-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[10px] text-text-muted" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] text-text-light font-medium">Invoice Date</span>
                <input type="date" className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:ring-1 focus:ring-brand-primary/10" />
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[8px] text-text-light font-medium">Due Date</span>
              <select className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:ring-1 focus:ring-brand-primary/10">
                <option>Due on Receipt</option>
                <option>Net 15 Days</option>
                <option>Net 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-1.5">
          <label className="block text-[8px] font-bold text-text-light uppercase tracking-widest">Invoice Items</label>
          <div className="overflow-hidden border border-slate-100 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest">Description</th>
                  <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest w-12 text-center">Qty</th>
                  <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest w-20 text-right">Rate</th>
                  <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest w-20 text-right">Amount</th>
                  <th className="px-2 py-1.5 text-[8px] font-bold text-text-light uppercase tracking-widest w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoiceItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-2 py-1.5">
                      <input type="text" value={item.description} className="w-full bg-transparent text-[10px] font-medium text-brand-dark outline-none" />
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <input type="number" value={item.quantity} className="w-full bg-transparent text-[10px] text-center outline-none" />
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <input type="number" value={item.rate} className="w-full bg-transparent text-[10px] text-right outline-none" />
                    </td>
                    <td className="px-2 py-1.5 text-[10px] font-bold text-brand-dark text-right">
                      LKR {item.amount.toLocaleString()}
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <button className="text-text-light hover:text-red-500 transition-colors">
                        <X size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="flex items-center space-x-1.5 text-brand-primary hover:text-brand-primary/80 text-[10px] font-bold transition-colors">
            <Plus size={12} />
            <span>Add Item</span>
          </button>
        </div>

        {/* Summary */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <div className="w-48 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Subtotal</span>
              <span className="font-medium text-brand-dark">LKR {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Tax (0%)</span>
              <span className="font-medium text-brand-dark">LKR 0</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="text-sm font-bold text-brand-dark">Total</span>
              <span className="text-sm font-bold text-brand-primary">LKR {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PayrollInputs = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [inputs, setInputs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadInputs = async () => {
    setLoading(true);
    const res = await fetch(`/api/payroll-inputs/${month}`);
    const data = await res.json();
    setInputs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadInputs();
  }, [month]);

  const handleSave = async () => {
    await fetch('/api/payroll-inputs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, inputs })
    });
    alert('Payroll inputs saved successfully');
  };

  const handleBulkUpload = () => {
    const confirmed = confirm("Simulate bulk upload from CSV? This will populate random data for testing.");
    if (!confirmed) return;
    
    const newInputs = inputs.map(input => ({
      ...input,
      ot_hours: Math.floor(Math.random() * 20),
      bonus: Math.floor(Math.random() * 5000),
      worked_hours: input.calculation_method === 'Hourly' ? 160 : input.worked_hours,
      worked_days: input.calculation_method === 'Daily' ? 22 : input.worked_days,
    }));
    setInputs(newInputs);
    alert("Bulk data simulated. Click 'Save All Inputs' to persist.");
  };

  const updateInput = (index: number, field: string, value: number) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Payroll Inputs</h1>
          <p className="text-xs text-slate-500">Enter monthly variables like OT, bonuses, and deductions</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleBulkUpload}
            className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 hover:bg-slate-50 transition-colors text-xs"
          >
            <FileUp size={16} />
            <span>Bulk Upload</span>
          </button>
          <input 
            type="month" 
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-dark text-xs"
          />
          <button 
            onClick={handleSave}
            className="bg-brand-dark text-white px-4 py-1.5 rounded-lg flex items-center space-x-1.5 hover:bg-brand-dark/90 transition-colors text-xs"
          >
            <CheckCircle2 size={16} />
            <span>Save All</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-100">
              <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Method</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Worked Units</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">OT Hours</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Late/Leave/Milestone</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Bonus (LKR)</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Other Allow.</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Deductions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inputs.map((input, index) => (
              <tr key={input.employee_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{input.first_name} {input.last_name}</p>
                  <p className="text-[10px] text-slate-500">{input.employee_no}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                    input.calculation_method === 'Hourly' ? 'bg-blue-100 text-blue-700' :
                    input.calculation_method === 'Daily' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {input.calculation_method}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {input.calculation_method === 'Hourly' && (
                    <div className="flex items-center space-x-1.5">
                      <input 
                        type="number"
                        value={input.worked_hours}
                        onChange={e => updateInput(index, 'worked_hours', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                      <span className="text-[10px] text-slate-400">Hrs</span>
                    </div>
                  )}
                  {input.calculation_method === 'Daily' && (
                    <div className="flex items-center space-x-1.5">
                      <input 
                        type="number"
                        value={input.worked_days}
                        onChange={e => updateInput(index, 'worked_days', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                      <span className="text-[10px] text-slate-400">Days</span>
                    </div>
                  )}
                  {input.calculation_method === 'Monthly' && (
                    <span className="text-[10px] text-slate-400 italic">Fixed</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number"
                    value={input.ot_hours}
                    onChange={e => updateInput(index, 'ot_hours', Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-brand-dark text-xs"
                  />
                </td>
                <td className="px-4 py-3">
                  {input.calculation_method === 'Monthly' && (
                    <div className="flex items-center space-x-1.5">
                      <input 
                        type="number"
                        value={input.unpaid_leave_days}
                        onChange={e => updateInput(index, 'unpaid_leave_days', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                      <span className="text-[9px] text-slate-400">Unpaid</span>
                    </div>
                  )}
                  {(input.calculation_method === 'Hourly' || input.calculation_method === 'Daily') && (
                    <div className="flex items-center space-x-1.5">
                      <input 
                        type="number"
                        value={input.late_minutes}
                        onChange={e => updateInput(index, 'late_minutes', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                      <span className="text-[9px] text-slate-400">Late</span>
                    </div>
                  )}
                  {input.calculation_method === 'Contract' && (
                    <div className="flex items-center space-x-1.5">
                      <input 
                        type="number"
                        value={input.milestone_percentage}
                        onChange={e => updateInput(index, 'milestone_percentage', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                      <span className="text-[9px] text-slate-400">Milestone %</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number"
                    value={input.bonus}
                    onChange={e => updateInput(index, 'bonus', Number(e.target.value))}
                    className="w-24 px-2 py-1 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number"
                    value={input.other_allowances}
                    onChange={e => updateInput(index, 'other_allowances', Number(e.target.value))}
                    className="w-24 px-2 py-1 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number"
                    value={input.deductions}
                    onChange={e => updateInput(index, 'deductions', Number(e.target.value))}
                    className="w-24 px-2 py-1 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmployeeList = ({ searchQuery }: { searchQuery: string }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [skillTypes, setSkillTypes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedEmpDetails, setSelectedEmpDetails] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setNewEmp(prev => ({ ...prev, profile_image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetch('/api/employees').then(res => res.json()).then(setEmployees);
    fetch('/api/departments').then(res => res.json()).then(setDepartments);
  }, []);

  const filteredEmployees = employees.filter(emp => 
    emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [newEmp, setNewEmp] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department_id: 1,
    skill_type_id: 1,
    designation: '',
    basic_salary: 0,
    ot_rate: 0,
    ot_multiplier: 1.5,
    hourly_rate: 0,
    daily_rate: 0,
    late_penalty_rate: 0,
    contract_amount: 0,
    retention_percentage: 5.0,
    calculation_method: 'Monthly',
    epf_no: '',
    tin_no: '',
    bank_name: '',
    account_no: '',
    site_allowance: 0,
    risk_allowance: 0,
    travel_allowance: 0,
    food_allowance: 0,
    accommodation_allowance: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetch('/api/employees').then(res => res.json()).then(setEmployees);
    fetch('/api/departments').then(res => res.json()).then(setDepartments);
    fetch('/api/skill-types').then(res => res.json()).then(setSkillTypes);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmp)
    });
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to deactivate this employee?")) return;
    await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Employee Master</h1>
          <p className="text-[10px] text-slate-500">Manage enterprise-wide workforce details</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-dark text-white px-2 py-1 rounded-lg flex items-center space-x-1.5 hover:bg-brand-dark/90 transition-colors shadow-md shadow-brand-dark/20 text-[10px]"
        >
          <Plus size={14} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-100">
              <th className="px-3 py-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
              <th className="px-3 py-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Skill / Dept</th>
              <th className="px-3 py-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Method</th>
              <th className="px-3 py-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Basic Salary</th>
              <th className="px-3 py-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-3 py-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 text-[10px]">
                      {emp.first_name[0]}{emp.last_name[0]}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">{emp.first_name} {emp.last_name}</p>
                      <p className="text-[8px] text-slate-400 font-mono">{emp.employee_no}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <p className="text-[10px] font-medium text-slate-700">{emp.designation}</p>
                  <p className="text-[8px] text-slate-400 uppercase font-bold">{emp.department_name}</p>
                </td>
                <td className="px-3 py-2">
                  <span className={`px-1 py-0.5 text-[8px] font-bold rounded uppercase ${
                    emp.calculation_method === 'Hourly' ? 'bg-blue-100 text-blue-700' :
                    emp.calculation_method === 'Daily' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {emp.calculation_method}
                  </span>
                </td>
                <td className="px-3 py-2 text-[10px] font-bold text-slate-900">LKR {emp.basic_salary.toLocaleString()}</td>
                <td className="px-3 py-2">
                  <span className="px-1 py-0.5 text-[8px] font-bold rounded-full bg-emerald-100 text-emerald-700 uppercase">
                    {emp.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end space-x-1">
                    <button 
                      onClick={() => setSelectedEmpDetails(emp)}
                      className="text-slate-400 hover:text-brand-dark transition-colors p-1 hover:bg-slate-100 rounded-md"
                    >
                      <Eye size={12} />
                    </button>
                    <button 
                      onClick={() => handleDelete(emp.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-slate-100 rounded-md"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Details Modal */}
      <AnimatePresence>
        {selectedEmpDetails && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl p-5 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-brand-dark text-white flex items-center justify-center text-xl font-bold shadow-lg overflow-hidden">
                    {selectedEmpDetails.profile_image ? (
                      <img src={selectedEmpDetails.profile_image} className="w-full h-full object-cover" />
                    ) : (
                      <span>{selectedEmpDetails.first_name[0]}{selectedEmpDetails.last_name[0]}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedEmpDetails.first_name} {selectedEmpDetails.last_name}</h2>
                    <p className="text-[11px] text-slate-500 font-medium">{selectedEmpDetails.designation} • {selectedEmpDetails.employee_no}</p>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-bold rounded uppercase">Active</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-bold rounded uppercase">{selectedEmpDetails.department_name}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedEmpDetails(null)} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Financial Profile</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Basic Salary</span>
                      <span className="text-[10px] font-bold text-slate-900">LKR {selectedEmpDetails.basic_salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">EPF Number</span>
                      <span className="text-[10px] font-bold text-slate-900">{selectedEmpDetails.epf_no || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Bank</span>
                      <span className="text-[10px] font-bold text-slate-900">{selectedEmpDetails.bank_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Account No</span>
                      <span className="text-[10px] font-bold text-slate-900 font-mono">{selectedEmpDetails.account_no || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Skill & Development</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Skill Level</span>
                      <span className="text-[10px] font-bold text-brand-dark">Senior Grade</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Certifications</span>
                      <span className="text-[10px] font-bold text-slate-900">3 Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Last Review</span>
                      <span className="text-[10px] font-bold text-slate-900">12 May 2024</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200">
                      <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Next Milestone</p>
                      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div className="bg-brand-emerald h-full w-[75%]"></div>
                      </div>
                      <p className="text-[8px] text-slate-500 mt-0.5">75% to Lead Grade</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Payroll Improvement</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 size={10} className="text-emerald-500" />
                      <span className="text-[10px] text-slate-600">Attendance &gt; 98%</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 size={10} className="text-emerald-500" />
                      <span className="text-[10px] text-slate-600">Zero Safety Violations</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock size={10} className="text-amber-500" />
                      <span className="text-[10px] text-slate-600">Skill Cert Level 4</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <TrendingUp size={10} className="text-slate-300" />
                      <span className="text-[10px] text-slate-600">ROI &gt; 15%</span>
                    </div>
                    <p className="text-[8px] text-brand-dark font-bold mt-1 italic">* 10% increment eligibility.</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all shadow-md text-[11px]">Generate Payslip History</button>
                <button className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-all text-[11px]">Edit Profile</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">Employee Master Setup</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                {/* Section: Profile Image */}
                <div>
                  <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Profile Image</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden relative group">
                      {profileImage ? (
                        <img src={profileImage} className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={18} />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Upload Photo</p>
                      <p className="text-xs text-slate-400">JPG, PNG or GIF. Max size 2MB.</p>
                      {profileImage && (
                        <button 
                          type="button" 
                          onClick={() => { setProfileImage(null); setNewEmp({...newEmp, profile_image: ''}); }}
                          className="text-[10px] font-bold text-red-500 uppercase mt-1 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Personal Info */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Personal & Employment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">First Name</label>
                      <input 
                        required
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, first_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Last Name</label>
                      <input 
                        required
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, last_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Email Address</label>
                      <input 
                        type="email"
                        required
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Department</label>
                      <select 
                        required
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, department_id: Number(e.target.value)})}
                      >
                        <option value="">Select Dept</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Skill Category</label>
                      <select 
                        required
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, skill_type_id: Number(e.target.value)})}
                      >
                        <option value="">Select Skill</option>
                        {skillTypes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Designation</label>
                      <input 
                        required
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, designation: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Statutory & Bank */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Statutory & Banking</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">EPF Number</label>
                      <input 
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, epf_no: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">TIN Number</label>
                      <input 
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, tin_no: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Bank Name</label>
                      <input 
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, bank_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Account No</label>
                      <input 
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, account_no: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Salary Structure */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Salary Structure</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Calculation Method</label>
                      <select 
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, calculation_method: e.target.value})}
                      >
                        <option value="Monthly">Monthly (Fixed)</option>
                        <option value="Hourly">Hourly</option>
                        <option value="Daily">Daily</option>
                        <option value="Contract">Contract-based</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Base Rate (LKR)</label>
                      <input 
                        type="number"
                        required
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => {
                          const val = Number(e.target.value);
                          if (newEmp.calculation_method === 'Monthly') setNewEmp({...newEmp, basic_salary: val});
                          if (newEmp.calculation_method === 'Hourly') setNewEmp({...newEmp, hourly_rate: val});
                          if (newEmp.calculation_method === 'Daily') setNewEmp({...newEmp, daily_rate: val});
                          if (newEmp.calculation_method === 'Contract') setNewEmp({...newEmp, contract_amount: val});
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">OT Rate (per hr)</label>
                      <input 
                        type="number"
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                        onChange={e => setNewEmp({...newEmp, ot_rate: Number(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Site Allow.</label>
                      <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" onChange={e => setNewEmp({...newEmp, site_allowance: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Risk Allow.</label>
                      <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" onChange={e => setNewEmp({...newEmp, risk_allowance: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Travel Allow.</label>
                      <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" onChange={e => setNewEmp({...newEmp, travel_allowance: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Food Allow.</label>
                      <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" onChange={e => setNewEmp({...newEmp, food_allowance: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Accom. Allow.</label>
                      <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" onChange={e => setNewEmp({...newEmp, accommodation_allowance: Number(e.target.value)})} />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-8">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-brand-dark text-white font-bold rounded-2xl hover:bg-brand-dark/90 transition-all shadow-xl shadow-brand-dark/20"
                  >
                    Save Employee Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectManagement = ({ searchQuery }: { searchQuery: string }) => {
  const [activeSubTab, setActiveSubTab] = useState('Project Master');
  const [projects, setProjects] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddSite, setShowAddSite] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState<any>(null);
  const [showAssignLabor, setShowAssignLabor] = useState<any>(null);
  const [assignedLabor, setAssignedLabor] = useState<any[]>([]);
  const [newSite, setNewSite] = useState({ project_id: 1, name: '', latitude: 0, longitude: 0, radius_meters: 500 });
  const [selectedLabor, setSelectedLabor] = useState<number[]>([]);
  const [newProject, setNewProject] = useState({
    name: '',
    code: '',
    client_name: '',
    start_date: '',
    end_date: '',
    total_budget: 0,
    labor_budget: 0,
    material_budget: 0,
    overhead_budget: 0,
    status: 'Planned'
  });

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    loadData();
    fetch('/api/employees').then(res => res.json()).then(setEmployees);
  }, []);

  const loadData = () => {
    fetch('/api/projects').then(res => res.json()).then(setProjects);
    fetch('/api/sites').then(res => res.json()).then(setSites);
  };

  const fetchAssignedLabor = async (projectId: number) => {
    const res = await fetch(`/api/projects/${projectId}/labor`);
    const data = await res.json();
    setAssignedLabor(data);
  };

  const handleAssignLabor = async () => {
    if (!showAssignLabor || selectedLabor.length === 0) return;
    await fetch(`/api/projects/${showAssignLabor.id}/assign-labor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_ids: selectedLabor })
    });
    setShowAssignLabor(null);
    setSelectedLabor([]);
    alert('Labor assigned successfully');
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject)
    });
    setShowAddProject(false);
    loadData();
  };

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSite)
    });
    setShowAddSite(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Operations</h1>
          <p className="text-[11px] text-slate-500">Project-based payroll control and site allocation</p>
        </div>
        <button 
          onClick={() => setShowAddProject(true)}
          className="bg-brand-dark text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 hover:bg-brand-dark/90 transition-colors shadow-md text-[11px]"
        >
          <Plus size={14} />
          <span>Setup New Project</span>
        </button>
      </div>

      <SubNav 
        tabs={['Project Master', 'Payroll Setup', 'Site Allocation', 'Labor Budget', 'Tools & Equipment', 'Reports', 'OT Summary']} 
        activeTab={activeSubTab} 
        onTabChange={setActiveSubTab} 
      />

      {activeSubTab === 'Project Master' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-2">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-brand-emerald group-hover:text-brand-dark transition-colors">
                  <Briefcase size={16} />
                </div>
                <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase ${
                  project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {project.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-0.5 text-[11px]">{project.name}</h3>
              <p className="text-[9px] text-slate-400 font-mono mb-3">{project.code}</p>
              
              <div className="space-y-2 border-t border-slate-50 pt-3">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Labor Budget</span>
                  <span className="font-bold text-slate-900">LKR {project.labor_budget?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Timeline</span>
                  <span className="text-slate-600">{project.start_date} - {project.end_date}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-1.5">
                <button 
                  onClick={() => setShowProjectDetails(project)}
                  className="flex-1 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-100 transition-colors"
                >
                  View Details
                </button>
                <button 
                  onClick={() => {
                    setShowAssignLabor(project);
                    fetchAssignedLabor(project.id);
                  }}
                  className="flex-1 py-1.5 bg-brand-dark text-white text-[10px] font-bold rounded-lg hover:bg-brand-dark/90 transition-colors"
                >
                  Assign Labor
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'Payroll Setup' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 max-w-3xl mx-auto">
          <h2 className="text-base font-bold text-slate-900 mb-4">Project Payroll Configuration</h2>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Project Name</label>
                <input 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-emerald outline-none text-[11px]"
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Project Code</label>
                <input 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-emerald outline-none text-[11px]"
                  onChange={e => setNewProject({...newProject, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Client Name</label>
                <input 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-emerald outline-none text-[11px]"
                  onChange={e => setNewProject({...newProject, client_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Site Location</label>
                <input 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-emerald outline-none text-[11px]"
                  onChange={e => setNewProject({...newProject, site_location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Start Date</label>
                <input 
                  type="date"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-emerald outline-none text-[11px]"
                  onChange={e => setNewProject({...newProject, start_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">End Date</label>
                <input 
                  type="date"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-emerald outline-none text-[11px]"
                  onChange={e => setNewProject({...newProject, end_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Labor Budget (LKR)</label>
                <input 
                  type="number"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-emerald outline-none text-[11px]"
                  onChange={e => setNewProject({...newProject, labor_budget: Number(e.target.value)})}
                />
              </div>
              <div className="flex items-center space-x-3 h-full pt-4">
                <div className="flex items-center space-x-1.5">
                  <input 
                    type="checkbox" 
                    id="ot_allowed" 
                    className="w-3.5 h-3.5 rounded border-slate-300 text-brand-emerald focus:ring-brand-emerald"
                    onChange={e => setNewProject({...newProject, ot_allowed: e.target.checked ? 1 : 0})}
                  />
                  <label htmlFor="ot_allowed" className="text-[10px] font-bold text-slate-600 uppercase">OT Allowed</label>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">OT Cap %</label>
                  <input 
                    type="number"
                    className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none text-[11px]"
                    onChange={e => setNewProject({...newProject, ot_budget_limit: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <button type="submit" className="flex-1 py-2.5 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-dark/90 transition-all shadow-lg shadow-brand-dark/20 text-[11px]">Save Project Configuration</button>
              <button type="button" className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-[11px]">Deactivate</button>
            </div>
          </form>
        </div>
      )}

      {activeSubTab === 'Site Allocation' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Geofenced Site Allocation</h2>
            <button 
              onClick={() => setShowAddSite(true)}
              className="bg-brand-dark text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 hover:bg-brand-dark/90 transition-colors text-[11px]"
            >
              <Plus size={14} />
              <span>Register New Site</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Active Sites</h3>
              <div className="space-y-2">
                {sites.map(site => (
                  <div key={site.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 text-[11px]">{site.name}</p>
                      <p className="text-[9px] text-slate-400 font-mono uppercase">{site.project_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-600">{site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}</p>
                      <p className="text-[9px] text-slate-400 uppercase font-bold">{site.radius_meters}m Radius</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center text-center text-white min-h-[300px]">
              <MapPin size={32} className="text-brand-emerald mb-3 opacity-20" />
              <h3 className="text-base font-bold mb-1">Live Site Monitoring</h3>
              <p className="text-white/40 text-[11px] max-w-xs">Interactive map view showing real-time employee locations and site boundaries</p>
              <button className="mt-6 px-4 py-2 bg-brand-emerald text-brand-dark font-bold rounded-lg hover:scale-105 transition-transform text-[11px]">Initialize Map Engine</button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'Labor Budget' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-slate-900">Labor Budgeting & Forecasting</h2>
            <div className="flex space-x-1.5">
              <button className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-slate-600"><Download size={14} /></button>
              <button className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-slate-600"><Printer size={14} /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <p className="text-[9px] font-bold text-indigo-400 uppercase mb-0.5">Total Allocated</p>
              <p className="text-lg font-bold text-indigo-900">LKR 45.2M</p>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <p className="text-[9px] font-bold text-emerald-400 uppercase mb-0.5">Spent to Date</p>
              <p className="text-lg font-bold text-emerald-900">LKR 12.8M</p>
            </div>
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
              <p className="text-[9px] font-bold text-amber-400 uppercase mb-0.5">Projected Variance</p>
              <p className="text-lg font-bold text-amber-900">LKR -1.2M</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-48">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Budget vs Actual Trend</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Jan', budget: 4000, actual: 2400 },
                  { name: 'Feb', budget: 3000, actual: 1398 },
                  { name: 'Mar', budget: 2000, actual: 9800 },
                  { name: 'Apr', budget: 2780, actual: 3908 },
                  { name: 'May', budget: 1890, actual: 4800 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="budget" stroke="#4F46E5" fill="#EEF2FF" />
                  <Area type="monotone" dataKey="actual" stroke="#10B981" fill="#ECFDF5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Category Breakdown</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Skilled Labor', budget: 15000000, actual: 4500000 },
                  { label: 'Unskilled Labor', budget: 10000000, actual: 3200000 },
                  { label: 'Site Supervision', budget: 8000000, actual: 2100000 },
                  { label: 'Overtime Reserve', budget: 5000000, actual: 1800000 },
                ].map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-slate-700">{cat.label}</span>
                      <span className="text-slate-500">LKR {cat.actual.toLocaleString()} / {cat.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-dark h-full" 
                        style={{ width: `${(cat.actual / cat.budget) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'Tools & Equipment' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-slate-900">Site Tools & Equipment Inventory</h2>
            <button className="bg-brand-dark text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-[11px]">
              <Plus size={14} />
              <span>Add Equipment</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Total Assets</p>
              <p className="text-lg font-bold text-slate-900">124 Items</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[9px] font-bold text-emerald-600 uppercase">In Use</p>
              <p className="text-lg font-bold text-emerald-900">86 Items</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[9px] font-bold text-amber-600 uppercase">Maintenance</p>
              <p className="text-lg font-bold text-amber-900">12 Items</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Inventory Value</p>
              <p className="text-lg font-bold text-slate-900">LKR 4.2M</p>
            </div>
          </div>
          <div className="overflow-hidden border border-slate-100 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Asset Name</th>
                  <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Project/Site</th>
                  <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Last Service</th>
                  <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-2">
                    <p className="font-bold text-slate-900 text-[11px]">Concrete Mixer - Heavy Duty</p>
                    <p className="text-[9px] text-slate-400 font-mono">EQ-8821</p>
                  </td>
                  <td className="px-4 py-2 text-[11px] text-slate-600">Main Tower Site</td>
                  <td className="px-4 py-2">
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded uppercase">In Use</span>
                  </td>
                  <td className="px-4 py-2 text-[11px] text-slate-600">2023-11-15</td>
                  <td className="px-4 py-2 text-right">
                    <button className="text-brand-dark hover:underline text-[10px] font-bold uppercase">Track</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'Reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-900">Project Performance Reports</h2>
              <div className="flex space-x-1.5">
                <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold hover:bg-slate-200 transition-all">Export PDF</button>
                <button className="px-3 py-1.5 bg-brand-dark text-white rounded-lg text-[11px] font-bold hover:bg-brand-dark/90 transition-all shadow-lg shadow-brand-dark/20">Generate All</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Labor Cost Analysis', icon: <FileText />, desc: 'Detailed breakdown of labor expenses vs budget allocation per project.' },
                { title: 'OT Utilization Report', icon: <Clock />, desc: 'Analysis of overtime hours and costs across all active project sites.' },
                { title: 'Site Attendance Summary', icon: <Users />, desc: 'Monthly attendance trends and geofence compliance reports.' },
                { title: 'Project ROI Forecast', icon: <TrendingUp />, desc: 'AI-driven financial projections for project completion and profitability.' }
              ].map((report, i) => (
                <div 
                  key={i} 
                  onClick={() => alert(`Generating ${report.title}...`)}
                  className="p-4 border border-slate-100 rounded-xl hover:border-brand-emerald transition-all cursor-pointer group bg-slate-50/30"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-white rounded-lg group-hover:bg-brand-emerald/10 transition-colors shadow-sm">
                      {React.cloneElement(report.icon as React.ReactElement, { className: "text-slate-400 group-hover:text-brand-emerald", size: 18 })}
                    </div>
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-brand-emerald transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-0.5 text-[11px]">{report.title}</h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{report.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-brand-dark rounded-xl p-6 text-white flex justify-between items-center overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-base font-bold mb-1">Automated Monthly Audit</h3>
              <p className="text-white/60 text-[11px] max-w-md">Schedule automated labor cost audits and compliance checks for all active projects.</p>
              <button className="mt-4 px-4 py-2 bg-brand-emerald text-brand-dark font-bold rounded-lg hover:scale-105 transition-transform text-[11px]">Configure Audit Schedule</button>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
              <ShieldCheck size={120} />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'OT Summary' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900">Overtime Utilization Summary</h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Project-wide labor cost control</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Analysis Period:</span>
                <select className="bg-transparent text-[10px] font-bold outline-none text-slate-700">
                  <option>Current Week</option>
                  <option>Last 30 Days</option>
                  <option>Project Wise</option>
                </select>
              </div>
              <button className="bg-brand-dark text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-brand-dark/90 transition-all shadow-lg shadow-brand-dark/20 flex items-center space-x-1.5">
                <Download size={12} />
                <span>Export OT Report</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Details</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total OT Hours</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">OT Cost (LKR)</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Budget Usage</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Risk Level</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map(p => {
                  const usage = Math.floor(Math.random() * 100);
                  const hours = (Math.random() * 2000).toFixed(0);
                  const cost = (Number(hours) * 850).toLocaleString(); // Mock rate
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-emerald/10 group-hover:text-brand-emerald transition-colors">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">{p.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="font-bold text-slate-700 text-sm">{hours}</span>
                        <span className="text-[10px] text-slate-400 ml-1 font-bold uppercase">hrs</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-[10px] text-slate-400 mr-1 font-bold uppercase">LKR</span>
                        <span className="font-bold text-slate-900 text-sm">{cost}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="max-w-[140px] mx-auto">
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={`h-full transition-all duration-1000 ${usage > 80 ? 'bg-red-500' : usage > 50 ? 'bg-amber-500' : 'bg-brand-emerald'}`} 
                              style={{ width: `${usage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{usage}% of Cap</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">LKR {p.labor_budget ? (p.labor_budget * 0.1).toLocaleString() : '0'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          usage > 80 ? 'bg-red-100 text-red-700' : usage > 50 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {usage > 80 ? 'Critical' : usage > 50 ? 'Warning' : 'Healthy'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-slate-400 hover:text-brand-dark hover:bg-slate-100 rounded-lg transition-all">
                          <ArrowUpRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      <AnimatePresence>
        {showProjectDetails && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-10 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-brand-emerald/10 rounded-2xl flex items-center justify-center text-brand-emerald">
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{showProjectDetails.name}</h2>
                    <p className="text-slate-500 font-mono">{showProjectDetails.code}</p>
                  </div>
                </div>
                <button onClick={() => setShowProjectDetails(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Client</p>
                  <p className="text-lg font-bold text-slate-900">{showProjectDetails.client_name}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Labor Budget</p>
                  <p className="text-lg font-bold text-slate-900">LKR {showProjectDetails.labor_budget?.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase">{showProjectDetails.status}</span>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Project Timeline & Configuration</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex justify-between p-4 border-b border-slate-100">
                    <span className="text-slate-500">Start Date</span>
                    <span className="font-bold">{showProjectDetails.start_date}</span>
                  </div>
                  <div className="flex justify-between p-4 border-b border-slate-100">
                    <span className="text-slate-500">End Date</span>
                    <span className="font-bold">{showProjectDetails.end_date}</span>
                  </div>
                  <div className="flex justify-between p-4 border-b border-slate-100">
                    <span className="text-slate-500">OT Allowed</span>
                    <span className="font-bold">{showProjectDetails.ot_allowed ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between p-4 border-b border-slate-100">
                    <span className="text-slate-500">OT Cap</span>
                    <span className="font-bold">{showProjectDetails.ot_budget_limit}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex space-x-4">
                <button className="flex-1 py-4 bg-brand-dark text-white font-bold rounded-2xl hover:bg-brand-dark/90 transition-all shadow-xl">Edit Project</button>
                <button onClick={() => setShowProjectDetails(null)} className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Labor Modal */}
      <AnimatePresence>
        {showAssignLabor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-10 max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Assign Labor to Project</h2>
                  <p className="text-slate-500">{showAssignLabor.name} ({showAssignLabor.code})</p>
                </div>
                <button onClick={() => setShowAssignLabor(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 overflow-hidden">
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Available Workforce</h3>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {employees.filter(e => !assignedLabor.some(al => al.id === e.id)).map(emp => (
                      <div 
                        key={emp.id} 
                        onClick={() => {
                          if (selectedLabor.includes(emp.id)) {
                            setSelectedLabor(selectedLabor.filter(id => id !== emp.id));
                          } else {
                            setSelectedLabor([...selectedLabor, emp.id]);
                          }
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedLabor.includes(emp.id) ? 'bg-brand-emerald/10 border-brand-emerald' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-900">{emp.first_name} {emp.last_name}</p>
                            <p className="text-[10px] text-slate-500 uppercase">{emp.designation} • {emp.employee_no}</p>
                          </div>
                          {selectedLabor.includes(emp.id) && <CheckCircle2 size={18} className="text-brand-emerald" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Currently Assigned</h3>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {assignedLabor.map(emp => (
                      <div key={emp.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">{emp.first_name} {emp.last_name}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{emp.designation}</p>
                        </div>
                        <button className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    {assignedLabor.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Users size={32} className="mb-2 opacity-20" />
                        <p className="text-xs">No labor assigned yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button 
                  onClick={handleAssignLabor}
                  disabled={selectedLabor.length === 0}
                  className="flex-1 py-4 bg-brand-dark text-white font-bold rounded-2xl hover:bg-brand-dark/90 transition-all shadow-xl disabled:opacity-50"
                >
                  Confirm Assignment ({selectedLabor.length} Selected)
                </button>
                <button onClick={() => setShowAssignLabor(null)} className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-10 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900">New Project Registration</h2>
                <button onClick={() => setShowAddProject(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddProject} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Project Name</label>
                    <input 
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                      onChange={e => setNewProject({...newProject, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Project Code</label>
                    <input 
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                      onChange={e => setNewProject({...newProject, code: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Client Name</label>
                    <input 
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                      onChange={e => setNewProject({...newProject, client_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Labor Budget (LKR)</label>
                    <input 
                      type="number"
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                      onChange={e => setNewProject({...newProject, labor_budget: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Start Date</label>
                    <input 
                      type="date"
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                      onChange={e => setNewProject({...newProject, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">End Date</label>
                    <input 
                      type="date"
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                      onChange={e => setNewProject({...newProject, end_date: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="modal_ot_allowed" 
                        className="w-5 h-5 rounded border-slate-300 text-brand-dark focus:ring-brand-dark"
                        onChange={e => setNewProject({...newProject, ot_allowed: e.target.checked ? 1 : 0})}
                      />
                      <label htmlFor="modal_ot_allowed" className="text-xs font-bold text-slate-600 uppercase">Allow OT</label>
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">OT Budget Cap %</label>
                      <input 
                        type="number"
                        placeholder="e.g. 15"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none"
                        onChange={e => setNewProject({...newProject, ot_budget_limit: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="flex-1 py-4 bg-brand-dark text-white font-bold rounded-2xl hover:bg-brand-dark/90 transition-all shadow-xl">Initialize Project</button>
                  <button type="button" onClick={() => setShowAddProject(false)} className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Site Modal */}
      <AnimatePresence>
        {showAddSite && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Register Site</h2>
                <button onClick={() => setShowAddSite(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddSite} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Project</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    onChange={e => setNewSite({...newSite, project_id: Number(e.target.value)})}
                  >
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Site Name</label>
                  <input 
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-dark outline-none"
                    onChange={e => setNewSite({...newSite, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Lat</label>
                    <input type="number" step="any" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" onChange={e => setNewSite({...newSite, latitude: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Long</label>
                    <input type="number" step="any" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" onChange={e => setNewSite({...newSite, longitude: Number(e.target.value)})} />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-brand-dark text-white font-bold rounded-2xl hover:bg-brand-dark/90 transition-all shadow-xl">Register Site</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WorkforceManagement = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [analysisModal, setAnalysisModal] = useState<{ open: boolean, data: any | null, loading: boolean, aiResult: any | null }>({
    open: false,
    data: null,
    loading: false,
    aiResult: null
  });
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [workCategory, setWorkCategory] = useState('General');
  const [laborType, setLaborType] = useState('Unskilled');
  const [selfie, setSelfie] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showPortalQR, setShowPortalQR] = useState(false);
  const [selectedSiteForQR, setSelectedSiteForQR] = useState<any>(null);
  const [showCompletedForms, setShowCompletedForms] = useState(false);
  const [formSearch, setFormSearch] = useState('');
  const [formFilter, setFormFilter] = useState('All');
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [completedForms, setCompletedForms] = useState<any[]>([
    { id: 1, title: 'Daily Site Report', date: '2024-03-24', status: 'Approved', user: 'Supervisor A', site: 'Site Alpha', details: 'All tasks completed on schedule. No safety incidents reported.' },
    { id: 2, title: 'Safety Inspection', date: '2024-03-23', status: 'Pending', user: 'Safety Officer', site: 'Site Beta', details: 'Minor safety violation observed at the excavation area. Corrective action initiated.' },
    { id: 3, title: 'Material Requisition', date: '2024-03-22', status: 'Approved', user: 'Site Engineer', site: 'Site Alpha', details: 'Requested 50 bags of cement and 200kg of rebar for the foundation work.' },
    { id: 4, title: 'Toolbox Talk', date: '2024-03-22', status: 'Approved', user: 'Supervisor B', site: 'Site Gamma', details: 'Conducted safety briefing for the new roofing crew. 12 attendees.' }
  ]);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [manualData, setManualData] = useState({
    employee_id: '',
    site_id: '',
    check_in: new Date().toISOString().slice(0, 16),
    check_out: '',
    work_category: 'General',
    labor_type: 'Unskilled'
  });

  useEffect(() => {
    loadData();
    let interval: any;
    if (realTimeEnabled) {
      interval = setInterval(loadData, 30000); // Refresh every 30s if real-time enabled
    }
    return () => clearInterval(interval);
  }, [realTimeEnabled]);

  const loadData = () => {
    fetch('/api/attendance/history').then(res => res.json()).then(data => {
      setHistory(data);
      setLoading(false);
    });
    fetch('/api/sites').then(res => res.json()).then(setSites);
    fetch('/api/employees').then(res => res.json()).then(setEmployees);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/attendance/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(manualData)
    });
    setShowManualEntry(false);
    loadData();
  };

  const handleCheckIn = async () => {
    if (!selectedSite || !selectedEmployee) return;

    setStatus(null);
    
    // 1. Get Location
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      
      // 2. Device ID (Simple simulation)
      const deviceId = localStorage.getItem('device_id') || `DEV-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);

      try {
        const res = await fetch('/api/attendance/check-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employee_id: selectedEmployee,
            site_id: selectedSite,
            latitude,
            longitude,
            device_id: deviceId,
            selfie_data: selfie,
            work_category: workCategory,
            labor_type: laborType,
            is_mock: false 
          })
        });

        const result = await res.json();
        if (result.anomaly_detected) {
          setStatus({ type: 'error', message: `Anomaly Detected: ${result.anomaly_details}` });
        } else if (!result.is_verified) {
          setStatus({ type: 'error', message: 'Geo-Validation Failed: You are outside the site radius.' });
        } else {
          setStatus({ type: 'success', message: 'Check-in Successful and Verified!' });
          // Refresh history
          fetch('/api/attendance/history').then(res => res.json()).then(setHistory);
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to connect to server.' });
      }
    }, (err) => {
      setStatus({ type: 'error', message: 'Location access denied.' });
    });
  };

  const handleAnalyze = async (record: any) => {
    setAnalysisModal({ open: true, data: record, loading: true, aiResult: null });
    const res = await fetch(`/api/attendance/behavioral-analysis/${record.employee_id}`);
    const employeeHistory = await res.json();
    const aiResult = await analyzeBehavioralPatterns(employeeHistory);
    setAnalysisModal(prev => ({ ...prev, loading: false, aiResult }));
  };

  const handleOverride = async (status: 'Approved' | 'Rejected') => {
    if (!analysisModal.data) return;
    await fetch('/api/attendance/override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendance_id: analysisModal.data.id, status })
    });
    setAnalysisModal({ open: false, data: null, loading: false, aiResult: null });
    fetch('/api/attendance/history').then(res => res.json()).then(setHistory);
  };

  const takeSelfie = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, 320, 240);
      
      setSelfie(canvas.toDataURL('image/jpeg'));
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      alert('Could not access camera');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Workforce Attendance</h1>
          <p className="text-[11px] text-slate-500">Real-time multi-site tracking with geo-validation</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-white px-2 py-1 rounded-full border border-slate-200">
            <div className={`w-1.5 h-1.5 rounded-full ${realTimeEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-[9px] font-bold text-slate-500 uppercase">Real-time Sync</span>
            <button 
              onClick={() => setRealTimeEnabled(!realTimeEnabled)}
              className="text-[9px] font-bold text-brand-dark hover:underline"
            >
              {realTimeEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
          <div className="flex space-x-1.5">
            <button 
              className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 hover:bg-slate-50 transition-colors text-[11px]"
              onClick={() => setShowCompletedForms(true)}
            >
              <FileCheck size={14} className="text-brand-dark" />
              <span>Forms</span>
            </button>
            <button 
              onClick={() => setShowManualEntry(true)}
              className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 hover:bg-slate-50 transition-colors text-[11px]"
            >
              <Database size={14} className="text-brand-dark" />
              <span>Entry</span>
            </button>
            <button 
              onClick={() => setShowPortalQR(true)}
              className="bg-brand-emerald text-brand-dark px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-md text-[11px]"
            >
              <QrCode size={14} />
              <span>QR</span>
            </button>
            <button 
              onClick={() => setShowCheckIn(true)}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-md text-[11px]"
            >
              <CheckCircle2 size={14} />
              <span>Check-In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Portal QR Modal */}
      <AnimatePresence>
        {showPortalQR && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl text-center"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Attendance Portal QR</h3>
                <button onClick={() => setShowPortalQR(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6 text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Select Site for QR</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  onChange={(e) => {
                    const site = sites.find(s => s.id === Number(e.target.value));
                    setSelectedSiteForQR(site);
                  }}
                >
                  <option value="">Select a site...</option>
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                  <QRCodeCanvas 
                    value={selectedSiteForQR ? JSON.stringify({
                      type: 'PORTAL_ACCESS',
                      site_id: selectedSiteForQR.id,
                      site_name: selectedSiteForQR.name,
                      project_id: selectedSiteForQR.project_id,
                      timestamp: new Date().toISOString()
                    }) : "https://workforce-ai.paypro.ai/portal"} 
                    size={180} 
                  />
                </div>
                {selectedSiteForQR && (
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">{selectedSiteForQR.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Site Token Active</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-8">
                {selectedSiteForQR 
                  ? "This QR is specifically linked to the selected site. Scanning it will automatically select the site in the portal."
                  : "Scan this QR code to access the general mobile attendance portal for site workers."}
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowPortalQR(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
                {selectedSiteForQR && (
                  <button 
                    className="flex-1 py-4 bg-brand-dark text-white font-bold rounded-2xl hover:bg-brand-dark/90 transition-all flex items-center justify-center space-x-2"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Completed Forms Modal */}
      <AnimatePresence>
        {showCompletedForms && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Completed Site Forms</h3>
                  <p className="text-sm text-slate-500">Review and manage all submitted site documentation</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search forms..."
                      value={formSearch}
                      onChange={e => setFormSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm w-64 focus:border-brand-dark transition-colors"
                    />
                  </div>
                  <button onClick={() => setShowCompletedForms(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex">
                {/* Sidebar Filters */}
                <div className="w-64 border-r border-slate-100 p-8 space-y-8 overflow-y-auto bg-slate-50/30 shrink-0">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Status Filter</h4>
                    <div className="space-y-2">
                      {['All', 'Approved', 'Pending', 'Rejected'].map(status => (
                        <button 
                          key={status}
                          onClick={() => setFormFilter(status)}
                          className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            formFilter === status ? 'bg-brand-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Stats</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Submissions</p>
                        <p className="text-xl font-bold text-slate-900">{completedForms.length}</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pending Review</p>
                        <p className="text-xl font-bold text-amber-600">{completedForms.filter(f => f.status === 'Pending').length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 overflow-y-auto bg-white">
                  <div className="grid grid-cols-1 gap-4">
                    {completedForms
                      .filter(f => (formFilter === 'All' || f.status === formFilter) && (f.title.toLowerCase().includes(formSearch.toLowerCase()) || f.user.toLowerCase().includes(formSearch.toLowerCase())))
                      .map((form) => (
                        <motion.div 
                          layout
                          key={form.id} 
                          onClick={() => setSelectedForm(form)}
                          className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
                            selectedForm?.id === form.id ? 'bg-brand-dark/5 border-brand-dark shadow-md' : 'bg-white border-slate-100 hover:border-brand-dark/30 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className={`p-3 rounded-2xl ${
                                form.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                              }`}>
                                <FileText size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-brand-dark transition-colors">{form.title}</h4>
                                <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
                                  {form.site} • {form.date}
                                </p>
                                <div className="flex items-center space-x-2 mt-3">
                                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">
                                    {form.user[0]}
                                  </div>
                                  <span className="text-[10px] text-slate-600 font-medium">Submitted by {form.user}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-3">
                              <span className={`px-2 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest ${
                                form.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {form.status}
                              </span>
                              <button className="text-[10px] font-bold text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity">
                                View Details →
                              </button>
                            </div>
                          </div>
                          
                          {selectedForm?.id === form.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-6 pt-6 border-t border-slate-100"
                            >
                              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Submission Details</h5>
                              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">
                                {form.details}
                              </p>
                              <div className="flex space-x-3 mt-6">
                                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2">
                                  <Download size={12} />
                                  <span>Download PDF</span>
                                </button>
                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                                  Print Copy
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Data Entry Modal */}
      <AnimatePresence>
        {showManualEntry && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-10 max-w-2xl w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-dark" />
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Manual Attendance Entry</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Administrative Override</p>
                </div>
                <button onClick={() => setShowManualEntry(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee</label>
                    <select 
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-dark transition-all"
                      value={manualData.employee_id}
                      onChange={e => setManualData({...manualData, employee_id: e.target.value})}
                    >
                      <option value="">Choose Employee...</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_id})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Site Location</label>
                    <select 
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-dark transition-all"
                      value={manualData.site_id}
                      onChange={e => setManualData({...manualData, site_id: e.target.value})}
                    >
                      <option value="">Choose Site...</option>
                      {sites.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Check-In Time</label>
                    <input 
                      type="datetime-local"
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-dark transition-all"
                      value={manualData.check_in}
                      onChange={e => setManualData({...manualData, check_in: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Check-Out Time (Optional)</label>
                    <input 
                      type="datetime-local"
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-dark transition-all"
                      value={manualData.check_out}
                      onChange={e => setManualData({...manualData, check_out: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Work Category</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-dark transition-all"
                      value={manualData.work_category}
                      onChange={e => setManualData({...manualData, work_category: e.target.value})}
                    >
                      <option value="General">General Labor</option>
                      <option value="Masonry">Masonry & Brickwork</option>
                      <option value="Electrical">Electrical Systems</option>
                      <option value="Plumbing">Plumbing & Piping</option>
                      <option value="Carpentry">Carpentry & Woodwork</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Labor Classification</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-dark transition-all"
                      value={manualData.labor_type}
                      onChange={e => setManualData({...manualData, labor_type: e.target.value})}
                    >
                      <option value="Unskilled">Unskilled (Helper)</option>
                      <option value="Skilled">Skilled (Technician)</option>
                      <option value="Supervisor">Site Supervisor</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="flex-1 py-5 bg-brand-dark text-white font-bold rounded-2xl hover:bg-brand-dark/90 transition-all shadow-xl shadow-brand-dark/20 flex items-center justify-center space-x-2">
                    <Save size={20} />
                    <span>Save Manual Entry</span>
                  </button>
                  <button type="button" onClick={() => setShowManualEntry(false)} className="px-10 py-5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCheckIn && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full p-10 space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Smart Check-In</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Biometric & Geo-Verification</p>
                </div>
                <button onClick={() => { setShowCheckIn(false); setStatus(null); setSelfie(null); }} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={selectedEmployee}
                      onChange={e => setSelectedEmployee(e.target.value)}
                    >
                      <option value="">Choose Employee...</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Site Location</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={selectedSite}
                      onChange={e => setSelectedSite(e.target.value)}
                    >
                      <option value="">Choose Site...</option>
                      {sites.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Work Category</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={workCategory}
                      onChange={e => setWorkCategory(e.target.value)}
                    >
                      <option value="General">General Labor</option>
                      <option value="Masonry">Masonry & Brickwork</option>
                      <option value="Electrical">Electrical Systems</option>
                      <option value="Plumbing">Plumbing & Piping</option>
                      <option value="Carpentry">Carpentry & Woodwork</option>
                      <option value="Steel">Steel Reinforcement</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Labor Classification</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={laborType}
                      onChange={e => setLaborType(e.target.value)}
                    >
                      <option value="Unskilled">Unskilled (Helper)</option>
                      <option value="Skilled">Skilled (Technician)</option>
                      <option value="Supervisor">Site Supervisor</option>
                      <option value="Contractor">Sub-Contractor</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-4 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                  <div className="relative">
                    <div className="w-40 h-40 bg-white rounded-3xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                      {selfie ? (
                        <img src={selfie} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-slate-300">
                          <Camera size={48} className="mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">No Capture</span>
                        </div>
                      )}
                    </div>
                    {selfie && (
                      <button 
                        onClick={() => setSelfie(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={takeSelfie}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center space-x-2 shadow-sm"
                  >
                    <Camera size={16} className="text-indigo-600" />
                    <span>{selfie ? 'Retake Identity Photo' : 'Capture Identity Photo'}</span>
                  </button>
                  <p className="text-[9px] text-slate-400 font-bold uppercase text-center max-w-[200px]">
                    Identity verification is required for high-risk site access
                  </p>
                </div>

                {status && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl text-sm font-bold flex items-start space-x-3 ${
                      status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}
                  >
                    {status.type === 'success' ? <CheckCircle2 size={20} className="shrink-0" /> : <ShieldAlert size={20} className="shrink-0" />}
                    <span>{status.message}</span>
                  </motion.div>
                )}

                <button 
                  onClick={handleCheckIn}
                  className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <ShieldCheck size={20} />
                  <span>Verify & Check-In</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search employee or site..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-dark transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none shadow-sm">
            <option value="All">All Sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none shadow-sm">
            <option value="All">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Geo-Violation">Geo-Violation</option>
            <option value="Anomalies">Anomalies</option>
          </select>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Site Location</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check In/Out</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Analysis</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm uppercase border border-slate-200">
                        {h.first_name[0]}{h.last_name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{h.first_name} {h.last_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: {h.employee_id || 'EMP-001'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">{h.site_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                        <ArrowUpRight size={14} className="text-emerald-500" />
                        <span>{new Date(h.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <ArrowDownLeft size={14} className="text-slate-300" />
                        <span>{h.check_out ? new Date(h.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Still Active'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 max-w-[80px] bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${h.fraud_score}%` }}
                          className={`h-full ${h.fraud_score > 70 ? 'bg-red-500' : h.fraud_score > 30 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${h.fraud_score > 70 ? 'text-red-600' : h.fraud_score > 30 ? 'text-orange-600' : 'text-emerald-600'}`}>
                        {h.fraud_score}%
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest border ${
                        h.override_status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        h.override_status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                        h.is_verified ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {h.override_status !== 'Pending' ? h.override_status : (h.is_verified ? 'Verified' : 'Geo-Violation')}
                      </span>
                      {h.anomaly_detected === 1 && (
                        <div className="group/anomaly relative">
                          <ShieldAlert size={16} className="text-orange-500 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover/anomaly:opacity-100 transition-opacity pointer-events-none z-10">
                            {h.anomaly_details || 'Potential behavioral anomaly detected by AI'}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleAnalyze(h)}
                      className="px-4 py-2 bg-white border border-slate-200 text-brand-dark hover:bg-brand-dark hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-sm"
                    >
                      AI Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {analysisModal.open && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">AI Behavioral Fraud Analysis</h2>
                <button onClick={() => setAnalysisModal({ open: false, data: null, loading: false, aiResult: null })} className="text-slate-400 hover:text-slate-600">
                  <XCircle size={24} />
                </button>
              </div>

              {analysisModal.loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                  <BrainCircuit className="text-indigo-600 animate-pulse" size={48} />
                  <p className="text-slate-500 animate-pulse">Gemini is learning behavioral patterns...</p>
                </div>
              ) : analysisModal.aiResult && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Fraud Probability</p>
                      <div className="flex items-end space-x-2">
                        <span className={`text-4xl font-bold ${
                          analysisModal.aiResult.fraud_probability > 70 ? 'text-red-600' : 
                          analysisModal.aiResult.fraud_probability > 30 ? 'text-orange-600' : 'text-emerald-600'
                        }`}>
                          {analysisModal.aiResult.fraud_probability}%
                        </span>
                        <span className="text-sm text-slate-500 mb-1">Risk Score</span>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">AI Recommendation</p>
                      <p className="text-sm font-medium text-slate-700">{analysisModal.aiResult.recommendation}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                      <AlertCircle size={18} className="text-indigo-600" />
                      <span>Pattern Analysis</span>
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                      {analysisModal.aiResult.pattern_description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">Detected Risk Factors</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisModal.aiResult.risk_factors.map((factor: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-full border border-red-100">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button 
                      onClick={() => handleOverride('Rejected')}
                      className="flex-1 py-3 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Reject Attendance
                    </button>
                    <button 
                      onClick={() => handleOverride('Approved')}
                      className="flex-1 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-dark/90 transition-colors shadow-lg shadow-brand-dark/20"
                    >
                      Approve (Override)
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AIInsights = () => {
  const [laborSummary, setLaborSummary] = useState<any[]>([]);
  const [overrunRisks, setOverrunRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/projects/labor-summary');
      const summary = await res.json();
      setLaborSummary(summary);
      
      // Predict risks for projects with actual costs
      const activeProjects = summary.filter((s: any) => s.actual_labor_cost > 0);
      const risks = await Promise.all(activeProjects.map(async (p: any) => {
        const risk = await predictOverrunRisks({
          ...p,
          completion_percentage: 45 // Simulated for demo
        });
        return { ...risk, project_id: p.id, project_name: p.name };
      }));
      setOverrunRisks(risks);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Construction Insights</h1>
        <p className="text-slate-500">Predictive forecasting and anomaly detection powered by Gemini</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <BrainCircuit className="text-indigo-600" size={32} />
              <h3 className="text-xl font-bold">Labor Cost Forecasting</h3>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-slate-400">Analyzing trends...</div>
            ) : (
              <div className="space-y-6">
                <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
                  <p className="text-slate-400 font-mono text-xs">
                    {JSON.stringify(overrunRisks[0]?.mitigation_steps || ["No data for forecasting"])}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Risk Score</p>
                    <p className="text-lg font-bold text-indigo-900">{overrunRisks[0]?.risk_score || 0}%</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-emerald-400 mb-1">Est. Final Cost</p>
                    <p className="text-lg font-bold text-emerald-900">LKR {(overrunRisks[0]?.predicted_final_cost || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-orange-400 mb-1">Overrun Risk</p>
                    <p className="text-lg font-bold text-orange-900">
                      {overrunRisks[0]?.risk_score > 70 ? 'High' : overrunRisks[0]?.risk_score > 30 ? 'Medium' : 'Low'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center space-x-2">
              <ShieldAlert size={18} className="text-orange-500" />
              <span>Project Overrun Warnings</span>
            </h3>
            <div className="space-y-3">
              {overrunRisks.map((risk, idx) => (
                <div key={idx} className={`p-3 border rounded-lg ${risk.risk_score > 50 ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                  <p className="text-xs font-bold text-slate-900">{risk.project_name}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{risk.warning_message}</p>
                </div>
              ))}
              {overrunRisks.length === 0 && <p className="text-xs text-slate-400">No risks detected.</p>}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="font-bold mb-2">AI Mitigation Steps</h3>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
              {(overrunRisks[0]?.mitigation_steps || ["Monitor daily labor reports", "Optimize site allocation"]).map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const PayrollProcessing = () => {
  const [activeSubTab, setActiveSubTab] = useState('Payroll Run');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('Draft');
  const [selectedProject, setSelectedProject] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);

  const loadRecords = () => {
    const projectIdParam = selectedProject === 'All' ? '' : `?project_id=${selectedProject}`;
    fetch(`/api/payroll/records/${month}${projectIdParam}`).then(res => res.json()).then(setRecords);
    fetch(`/api/payroll/status/${month}`).then(res => res.json()).then(data => setStatus(data.status));
    fetch(`/api/projects`).then(res => res.json()).then(setProjects);
    
    fetch(`/api/payroll/records/${month}`).then(res => res.json()).then(data => {
      if (data.length > 0) {
        const periodId = data[0].period_id;
        fetch(`/api/payroll/audit/${periodId}`).then(res => res.json()).then(setAlerts);
      } else {
        setAlerts([]);
      }
    });
  };

  useEffect(() => {
    loadRecords();
  }, [month, selectedProject]);

  const handleProcess = async () => {
    setProcessing(true);
    await fetch('/api/payroll/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, project_id: selectedProject === 'All' ? null : selectedProject })
    });
    setProcessing(false);
    loadRecords();
    setActiveSubTab('Preview');
  };

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this payroll? This will lock the period and generate accounting entries.")) return;
    await fetch('/api/payroll/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month })
    });
    loadRecords();
    setActiveSubTab('Finalized Payroll');
  };

  const handleReprocess = async () => {
    if (!confirm("Reprocessing will overwrite current calculations for this period. Continue?")) return;
    setProcessing(true);
    await fetch('/api/payroll/reprocess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month })
    });
    setProcessing(false);
    loadRecords();
    setActiveSubTab('Preview');
  };

  const handleSendPayslips = async (method: 'email' | 'whatsapp') => {
    if (!confirm(`Are you sure you want to send all payslips via ${method}?`)) return;
    alert(`Sending payslips to ${records.length} employees via ${method}...`);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('All payslips sent successfully.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Processing ${file.name} for real-time adjustments...`);
      // Mock processing
      setTimeout(() => alert('Adjustments uploaded and applied.'), 1000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Payroll Engine</h1>
          <p className="text-[10px] text-slate-500">Enterprise-grade payroll processing and statutory compliance</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-white border border-slate-200 rounded-lg px-2 py-1 flex items-center space-x-1.5">
            <Calendar size={14} className="text-slate-400" />
            <input 
              type="month" 
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="text-[11px] font-bold text-slate-700 outline-none"
            />
          </div>
          <select 
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 outline-none"
          >
            <option value="All">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <SubNav 
        tabs={['Payroll Run', 'Preview', 'Adjustment', 'Finalized Payroll', 'Payslip Generator', 'Reprocess Payroll']} 
        activeTab={activeSubTab} 
        onTabChange={setActiveSubTab} 
      />

      {activeSubTab === 'Payroll Run' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-dark/5 rounded-xl flex items-center justify-center mb-4">
              <Calculator size={32} className="text-brand-dark" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Initialize Payroll Run</h2>
            <p className="text-[11px] text-slate-500 mb-5 leading-relaxed">
              Execute the automated payroll engine to calculate salaries, overtime, site allowances, and statutory deductions for <b>{month}</b>.
            </p>
            
            <div className="w-full grid grid-cols-2 gap-3 mb-5 text-left">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Target Period</p>
                <p className="text-sm font-bold text-slate-900">{month}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current Status</p>
                <div className="flex items-center space-x-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                  <p className="text-sm font-bold text-slate-900">{status}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleProcess}
              disabled={processing || status === 'Approved'}
              className="w-full py-3 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-dark/90 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group text-[11px]"
            >
              {processing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Play size={14} className="group-hover:translate-x-1 transition-transform" />
                  <span>Execute Payroll Engine</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 rounded-xl p-4 text-white shadow-md">
              <h3 className="text-base font-bold mb-3 flex items-center space-x-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span>Compliance Checklist</span>
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Attendance Data Synchronized', status: true },
                  { label: 'OT Hours Verified by AI', status: true },
                  { label: 'Site Allowances Calculated', status: true },
                  { label: 'Tax Slabs Updated (2024)', status: true },
                  { label: 'EPF/ETF Contributions Ready', status: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-[10px] font-medium text-slate-300">{item.label}</span>
                    {item.status ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-white/20" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-2">Processing History</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <div>
                    <p className="text-[11px] font-bold text-slate-800">Last Run: Feb 2024</p>
                    <p className="text-[8px] text-slate-400">Completed by Admin • 28 Feb</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-bold rounded-full">SUCCESS</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-[11px] font-bold text-slate-800">Last Run: Jan 2024</p>
                    <p className="text-[8px] text-slate-400">Completed by Admin • 30 Jan</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-bold rounded-full">SUCCESS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(activeSubTab === 'Preview' || activeSubTab === 'Finalized Payroll') && (
        <div className="space-y-4">
          {alerts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-start space-x-3 shadow-sm"
            >
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <ShieldAlert size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-bold text-orange-900">Payroll Audit Findings ({alerts.length})</p>
                  <button className="text-[8px] font-bold text-orange-700 uppercase tracking-widest hover:underline">View All Alerts</button>
                </div>
                <p className="text-[10px] text-orange-700 leading-relaxed">
                  The AI Audit engine has detected <b>{alerts.length} potential discrepancies</b> in overtime calculations and site-specific allowances. We recommend reviewing these before final approval.
                </p>
              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/30">
              <div>
                <h3 className="text-base font-bold text-slate-900">Payroll Register</h3>
                <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">Period: {month} • Status: {status}</p>
              </div>
              <div className="flex items-center space-x-2">
                {activeSubTab === 'Preview' && status !== 'Approved' && (
                  <button 
                    onClick={handleApprove}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition-all shadow-md flex items-center space-x-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve & Finalize</span>
                  </button>
                )}
                <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                  <button className="p-1.5 text-slate-400 hover:text-brand-dark hover:bg-slate-50 rounded-md transition-all"><Download size={16} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-brand-dark hover:bg-slate-50 rounded-md transition-all"><Printer size={16} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-brand-dark hover:bg-slate-50 rounded-md transition-all"><Share2 size={16} /></button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Employee Details</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Basic (LKR)</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">OT Pay</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Allowances</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Gross Pay</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-red-400 uppercase tracking-widest text-right">Deductions</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-brand-dark uppercase tracking-widest text-right">Net Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {records.map((rec: any) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px] uppercase border border-slate-200 group-hover:bg-brand-dark group-hover:text-white transition-all">
                            {rec.employee_name?.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-[11px] group-hover:text-brand-dark transition-colors">{rec.employee_name}</p>
                            <p className="text-[8px] text-slate-400 font-mono uppercase tracking-tighter">{rec.employee_code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right text-[11px] font-medium text-slate-600">{rec.basic_salary?.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-[11px] font-medium text-slate-600">{rec.ot_pay?.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-[11px] font-medium text-slate-600">{rec.allowances?.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-[11px] font-bold text-slate-900">{rec.gross_salary?.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-[11px] font-bold text-red-500">
                        -{(rec.epf_employee + rec.tax_amount + rec.deductions)?.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-[11px] font-bold text-brand-dark bg-brand-emerald/20 px-2 py-1 rounded-lg border border-brand-emerald/30">
                          {rec.net_salary?.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {status !== 'Approved' && activeSubTab === 'Preview' && (
            <div className="flex justify-end pt-2">
              <button 
                onClick={handleApprove}
                className="bg-brand-dark text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-brand-dark/90 transition-all font-bold shadow-lg transform hover:scale-[1.01] active:scale-[0.99] text-[11px]"
              >
                <ShieldCheck size={18} />
                <span>Finalize & Approve Payroll</span>
              </button>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'Payslip Generator' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">Bulk Distribution</h3>
              <p className="text-[10px] text-slate-500">Send encrypted payslips to all employees in one click</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleSendPayslips('email')}
                className="bg-brand-dark text-white px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center space-x-1.5 hover:bg-brand-dark/90 transition-all"
              >
                <Mail size={14} />
                <span>Send via Email</span>
              </button>
              <button 
                onClick={() => handleSendPayslips('whatsapp')}
                className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center space-x-1.5 hover:bg-emerald-700 transition-all"
              >
                <MessageSquare size={14} />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {records.map((r: any, i: number) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-dark group-hover:text-white transition-colors">
                    <FileText size={16} />
                  </div>
                  <div className="flex space-x-1.5">
                    <button className="text-slate-400 hover:text-brand-dark transition-colors"><Mail size={12} /></button>
                    <button className="text-slate-400 hover:text-emerald-600 transition-colors"><MessageSquare size={12} /></button>
                    <button className="text-brand-dark hover:underline text-[10px] font-bold">PDF</button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 text-[11px]">{r.employee_name}</h4>
                <p className="text-[10px] text-slate-500 mb-2">{r.employee_code} • {month}</p>
                <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Net Payable</span>
                  <span className="text-[11px] font-bold text-slate-900">LKR {r.net_salary?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'Adjustment' && (
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Manual Payroll Adjustment</h3>
              <div className="relative">
                <input 
                  type="file" 
                  id="adj-upload" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".csv,.xlsx"
                />
                <label 
                  htmlFor="adj-upload"
                  className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center space-x-1.5 cursor-pointer hover:bg-slate-200 transition-all"
                >
                  <Upload size={14} />
                  <span>Bulk Upload</span>
                </label>
              </div>
            </div>
            <form className="space-y-3">
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Select Employee</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-[11px]">
                <option>Choose Employee...</option>
                {records.map((r: any) => <option key={r.id}>{r.employee_name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Adjustment Type</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-[11px]">
                  <option>Addition</option>
                  <option>Deduction</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Amount (LKR)</label>
                <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-[11px]" />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Reason / Description</label>
              <textarea className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none h-16 text-[11px]"></textarea>
            </div>
            <button className="w-full py-2 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-dark/90 transition-all shadow-md text-[11px]">Apply Adjustment</button>
          </form>
        </div>
      </div>
      )}

      {activeSubTab === 'Reprocess Payroll' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={24} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Reprocess Period</h2>
          <p className="text-[11px] text-slate-500 mb-5">Use this to recalculate payroll if there were changes to attendance, site allowances, or employee basic data after the initial run.</p>
          
          <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-left mb-5">
            <div className="flex items-center space-x-1.5 text-red-700 font-bold mb-1 text-[11px]">
              <ShieldAlert size={14} />
              <span>Warning</span>
            </div>
            <p className="text-[10px] text-red-600">This action will reset all manual adjustments and overrides for the month of {month}. This cannot be undone.</p>
          </div>

          <button 
            onClick={handleReprocess}
            disabled={processing || status === 'Approved'}
            className="w-full py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 text-[11px]"
          >
            {processing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <RefreshCw size={14} />
                <span>Recalculate All Records</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

const SettingsPage = () => {
  const [slabs, setSlabs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [newDept, setNewDept] = useState({ name: '', code: '' });
  const [newRole, setNewRole] = useState({ name: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('General');
  const [users, setUsers] = useState<any[]>([
    { id: 1, name: 'Admin User', email: 'admin@paypro.ai', role: 'Super Admin', status: 'Active', permissions: ['all'] },
    { id: 2, name: 'Payroll Manager', email: 'payroll@paypro.ai', role: 'Payroll Admin', status: 'Active', permissions: ['payroll.read', 'payroll.write', 'reports.view'] },
    { id: 3, name: 'Site Supervisor', email: 'site1@paypro.ai', role: 'Supervisor', status: 'Active', permissions: ['attendance.mark', 'site.view'] }
  ]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    fullName: 'Admin User',
    email: 'admin@paypro.ai',
    phone: '+94 77 123 4567',
    designation: 'System Administrator',
    twoFactor: true,
    loginNotifications: true,
    bio: 'Experienced payroll administrator with 10+ years in construction sector financial management.',
    timezone: 'Asia/Colombo (GMT+5:30)',
    language: 'English (US)'
  });

  const rolesMatrix = [
    { id: 1, role: 'Super Admin', desc: 'Full system access including financial settings and user management.', count: 1, permissions: ['all'] },
    { id: 2, role: 'Payroll Admin', desc: 'Access to payroll processing, tax slabs, and financial reporting.', count: 2, permissions: ['payroll.read', 'payroll.write', 'tax.manage', 'reports.view'] },
    { id: 3, role: 'Supervisor', desc: 'Manage site attendance and view project-specific reports.', count: 8, permissions: ['attendance.mark', 'attendance.view', 'site.view'] }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([
      fetch('/api/tax-slabs').then(res => res.json()),
      fetch('/api/settings').then(res => res.json()),
      fetch('/api/departments').then(res => res.json()),
      fetch('/api/roles').then(res => res.json())
    ]).then(([slabsData, settingsData, deptsData, rolesData]) => {
      setSlabs(slabsData);
      setSettings(settingsData);
      setDepartments(deptsData);
      setRoles(rolesData);
      setLoading(false);
    });
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDept)
    });
    setNewDept({ name: '', code: '' });
    loadData();
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRole)
    });
    setNewRole({ name: '' });
    loadData();
  };

  const handleSaveSettings = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    alert('Settings saved');
  };

  const handleSaveSlabs = async () => {
    await fetch('/api/tax-slabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slabs)
    });
    alert('Tax slabs saved');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call
    alert('Profile updated successfully');
  };

  const handleUserAction = (userId: number, action: 'activate' | 'deactivate' | 'delete') => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        if (action === 'activate') return { ...u, status: 'Active' };
        if (action === 'deactivate') return { ...u, status: 'Inactive' };
      }
      return u;
    }).filter(u => action !== 'delete' || u.id !== userId));
  };

  const removeSlab = (index: number) => {
    const newSlabs = slabs.filter((_, i) => i !== index);
    setSlabs(newSlabs);
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading settings...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-500">Configure global payroll parameters and enterprise structure</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center space-x-2"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex space-x-4 border-b border-slate-100 pb-px">
        {['General', 'Taxation', 'Departments', 'Sub-Contracting', 'Account Admin', 'Profile'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-brand-dark' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
            {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-dark rounded-full" />}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'General' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-slate-900">General Parameters</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Currency Symbol</label>
                  <input 
                    type="text" 
                    value="LKR" 
                    disabled
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Personal Relief (Monthly)</label>
                  <input 
                    type="number" 
                    value={settings.personal_relief || 100000}
                    onChange={e => setSettings({...settings, personal_relief: Number(e.target.value)})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Employee EPF Rate</label>
                  <input 
                    type="number" 
                    step="0.001"
                    value={settings.epf_ee_rate || 0.08}
                    onChange={e => setSettings({...settings, epf_ee_rate: Number(e.target.value)})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Employer EPF Rate</label>
                  <input 
                    type="number" 
                    step="0.001"
                    value={settings.epf_er_rate || 0.12}
                    onChange={e => setSettings({...settings, epf_er_rate: Number(e.target.value)})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Taxation' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">APIT Progressive Tax Slabs</h3>
                <button 
                  onClick={() => setSlabs([...slabs, { min_income: 0, max_income: null, rate: 0 }])}
                  className="text-brand-dark hover:underline text-xs font-bold"
                >
                  + Add New Slab
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-4 px-2 text-[10px] uppercase font-bold text-slate-400">
                  <div className="col-span-4">Min Income (LKR)</div>
                  <div className="col-span-4">Max Income (LKR)</div>
                  <div className="col-span-3">Tax Rate (0-1)</div>
                  <div className="col-span-1"></div>
                </div>
                
                {slabs.map((slab, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="col-span-4">
                      <input 
                        type="number"
                        value={slab.min_income}
                        onChange={e => {
                          const newSlabs = [...slabs];
                          newSlabs[index].min_income = Number(e.target.value);
                          setSlabs(newSlabs);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-4">
                      <input 
                        type="number"
                        placeholder="Infinity"
                        value={slab.max_income || ''}
                        onChange={e => {
                          const newSlabs = [...slabs];
                          newSlabs[index].max_income = e.target.value ? Number(e.target.value) : null;
                          setSlabs(newSlabs);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input 
                        type="number"
                        step="0.01"
                        value={slab.rate}
                        onChange={e => {
                          const newSlabs = [...slabs];
                          newSlabs[index].rate = Number(e.target.value);
                          setSlabs(newSlabs);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button onClick={() => removeSlab(index)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleSaveSlabs}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm"
              >
                Update Tax Slabs
              </button>
            </div>
          )}

          {activeTab === 'Departments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Departments</h3>
                <form onSubmit={handleAddDept} className="space-y-4">
                  <input 
                    placeholder="Department Name"
                    value={newDept.name}
                    onChange={e => setNewDept({...newDept, name: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                  <input 
                    placeholder="Code (e.g. FIN-01)"
                    value={newDept.code}
                    onChange={e => setNewDept({...newDept, code: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                  <button type="submit" className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold text-sm">Add Department</button>
                </form>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {departments.map(d => (
                    <div key={d.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{d.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{d.code}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Job Roles</h3>
                <form onSubmit={handleAddRole} className="space-y-4">
                  <input 
                    placeholder="Role Name"
                    value={newRole.name}
                    onChange={e => setNewRole({...newRole, name: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                  <button type="submit" className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold text-sm">Add Role</button>
                </form>
                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                  {roles.map(r => (
                    <span key={r.id} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full border border-slate-200 uppercase">
                      {r.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Sub-Contracting' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Sub-Contractor Portal & Control</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-widest">Active</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <Users size={24} className="text-brand-dark mb-4" />
                    <h4 className="font-bold text-slate-900 mb-1">Vendor Management</h4>
                    <p className="text-xs text-slate-500 mb-4">Onboard and manage external labor providers.</p>
                    <button className="text-xs font-bold text-brand-dark hover:underline">Manage Vendors →</button>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <FileText size={24} className="text-brand-dark mb-4" />
                    <h4 className="font-bold text-slate-900 mb-1">Invoice Verification</h4>
                    <p className="text-xs text-slate-500 mb-4">Auto-verify vendor invoices against site attendance.</p>
                    <button className="text-xs font-bold text-brand-dark hover:underline">Configure Rules →</button>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <CreditCard size={24} className="text-brand-dark mb-4" />
                    <h4 className="font-bold text-slate-900 mb-1">Payment Tracking</h4>
                    <p className="text-xs text-slate-500 mb-4">Track payments and retention for sub-contractors.</p>
                    <button className="text-xs font-bold text-brand-dark hover:underline">View Ledger →</button>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Auto-Invoice Generation</p>
                    <p className="text-xs text-slate-500">Automatically generate invoices based on verified site attendance.</p>
                  </div>
                  <div className="w-12 h-6 bg-brand-dark rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Account Admin' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">User Administration</h3>
                    <p className="text-xs text-slate-500">Manage system access and granular permissions</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingUser(null);
                      setShowUserModal(true);
                    }}
                    className="bg-brand-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2"
                  >
                    <UserPlus size={14} />
                    <span>Invite User</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Permissions</th>
                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((user) => (
                        <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-brand-dark/10 flex items-center justify-center text-brand-dark text-xs font-bold">
                                {user.name[0]}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                <p className="text-[10px] text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="text-xs font-medium text-slate-600">{user.role}</span>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-1">
                              {user.permissions.slice(0, 2).map((p: string) => (
                                <span key={p} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase">
                                  {p}
                                </span>
                              ))}
                              {user.permissions.length > 2 && (
                                <span className="text-[9px] font-bold text-slate-400">+{user.permissions.length - 2} more</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowUserModal(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-brand-dark hover:bg-white rounded-lg border border-transparent hover:border-slate-100"
                              >
                                <Edit2 size={14} />
                              </button>
                              {user.status === 'Active' ? (
                                <button 
                                  onClick={() => handleUserAction(user.id, 'deactivate')}
                                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100"
                                >
                                  <ShieldAlert size={14} />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100"
                                >
                                  <ShieldCheck size={14} />
                                </button>
                              )}
                              <button 
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                <h3 className="text-xl font-bold text-slate-900">Permission Roles Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {rolesMatrix.map((role, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Lock size={48} className="text-brand-dark" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">{role.role}</h4>
                      <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">{role.desc}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-brand-dark bg-brand-dark/10 px-2 py-0.5 rounded-full">
                          {role.count} Users
                        </span>
                        <button 
                          onClick={() => {
                            setSelectedRole(role);
                            setShowRoleModal(true);
                          }}
                          className="text-[10px] font-bold text-slate-400 hover:text-brand-dark uppercase tracking-wider"
                        >
                          Configure Permissions
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="space-y-8">
              <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">My Profile Settings</h3>
                  <button type="submit" className="bg-brand-dark text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg">
                    Update Profile
                  </button>
                </div>
                
                <div className="flex items-center space-x-6 pb-8 border-b border-slate-100">
                  <div className="w-24 h-24 rounded-full bg-brand-dark/10 flex items-center justify-center text-3xl text-brand-dark font-bold border-4 border-white shadow-lg relative group">
                    {profileData.fullName[0]}
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{profileData.fullName}</p>
                    <p className="text-xs text-slate-500 mb-2">{profileData.designation}</p>
                    <div className="flex space-x-2">
                      <button type="button" className="text-[10px] font-bold text-brand-dark hover:underline">Change Photo</button>
                      <span className="text-slate-300">•</span>
                      <button type="button" className="text-[10px] font-bold text-red-400 hover:underline">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.fullName}
                      onChange={e => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-dark transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={e => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-dark transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      value={profileData.phone}
                      onChange={e => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-dark transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Designation</label>
                    <input 
                      type="text" 
                      value={profileData.designation}
                      onChange={e => setProfileData({...profileData, designation: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-dark transition-colors" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Professional Bio</label>
                    <textarea 
                      rows={3}
                      value={profileData.bio}
                      onChange={e => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-dark transition-colors resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Timezone</label>
                    <select 
                      value={profileData.timezone}
                      onChange={e => setProfileData({...profileData, timezone: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-dark transition-colors text-sm"
                    >
                      <option>Asia/Colombo (GMT+5:30)</option>
                      <option>UTC (GMT+0:00)</option>
                      <option>America/New_York (GMT-5:00)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Language</label>
                    <select 
                      value={profileData.language}
                      onChange={e => setProfileData({...profileData, language: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-dark transition-colors text-sm"
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Sinhala</option>
                      <option>Tamil</option>
                    </select>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center space-x-2">
                    <Lock size={16} className="text-brand-dark" />
                    <span>Security & Privacy</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-xs font-bold text-slate-900">Two-Factor Authentication</p>
                          <p className="text-[10px] text-slate-500">Secure your account with 2FA</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setProfileData({...profileData, twoFactor: !profileData.twoFactor})}
                          className={`w-10 h-5 rounded-full relative transition-colors ${profileData.twoFactor ? 'bg-brand-dark' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${profileData.twoFactor ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-xs font-bold text-slate-900">Login Notifications</p>
                          <p className="text-[10px] text-slate-500">Get notified of new logins</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setProfileData({...profileData, loginNotifications: !profileData.loginNotifications})}
                          className={`w-10 h-5 rounded-full relative transition-colors ${profileData.loginNotifications ? 'bg-brand-dark' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${profileData.loginNotifications ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <button type="button" className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
                        <Key size={14} />
                        <span>Change Password</span>
                      </button>
                      <button type="button" className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
                        <Shield size={14} />
                        <span>View Login History</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-dark rounded-[32px] p-8 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">Database Status</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">OPTIMIZED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">Last Backup</span>
                <span className="text-xs font-bold">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                {editingUser ? 'Edit User Permissions' : 'Invite New User'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Email Address</label>
                  <input type="email" placeholder="john@paypro.ai" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Role</label>
                  <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm">
                    <option>Super Admin</option>
                    <option>Payroll Admin</option>
                    <option>Supervisor</option>
                    <option>Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Department</label>
                  <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm">
                    <option>Management</option>
                    <option>Finance</option>
                    <option>Operations</option>
                    <option>HR</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-4">Granular Permissions</label>
                <div className="grid grid-cols-2 gap-3">
                  {['payroll.read', 'payroll.write', 'attendance.view', 'attendance.mark', 'reports.export', 'users.manage'].map(perm => (
                    <label key={perm} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-dark focus:ring-brand-dark" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase">{perm.replace('.', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex justify-end space-x-4">
              <button onClick={() => setShowUserModal(false)} className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button className="px-6 py-2 bg-brand-dark text-white rounded-xl text-sm font-bold shadow-lg">
                {editingUser ? 'Save Changes' : 'Send Invitation'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showRoleModal && selectedRole && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Configure Role: {selectedRole.role}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedRole.desc}</p>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-8">
                {[
                  { group: 'Payroll Management', perms: ['payroll.read', 'payroll.write', 'payroll.approve', 'tax.manage'] },
                  { group: 'Workforce & Attendance', perms: ['attendance.view', 'attendance.mark', 'attendance.approve', 'employee.manage'] },
                  { group: 'Project Controls', perms: ['project.create', 'project.edit', 'site.allocate', 'budget.view'] },
                  { group: 'System & Security', perms: ['users.manage', 'audit.view', 'settings.edit', 'api.access'] }
                ].map((group, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">{group.group}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {group.perms.map(perm => (
                        <label key={perm} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${selectedRole.permissions.includes(perm) || selectedRole.permissions.includes('all') ? 'bg-brand-emerald' : 'bg-slate-300'}`} />
                            <span className="text-xs font-bold text-slate-700 uppercase">{perm.replace('.', ' ')}</span>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={selectedRole.permissions.includes(perm) || selectedRole.permissions.includes('all')}
                            onChange={() => {}} // Mock change
                            className="w-4 h-4 rounded border-slate-300 text-brand-dark focus:ring-brand-dark" 
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex justify-end space-x-4">
              <button onClick={() => setShowRoleModal(false)} className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button className="px-6 py-2 bg-brand-dark text-white rounded-xl text-sm font-bold shadow-lg">
                Save Role Permissions
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showApply, setShowApply] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    start_date: '',
    end_date: '',
    leave_type: 'Paid',
    reason: ''
  });

  useEffect(() => {
    loadLeaves();
    fetch('/api/employees').then(res => res.json()).then(setEmployees);
  }, []);

  const loadLeaves = () => {
    fetch('/api/leaves').then(res => res.json()).then(setLeaves);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/leaves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setShowApply(false);
    loadLeaves();
  };

  const handleStatus = async (id: number, status: string) => {
    await fetch(`/api/leaves/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadLeaves();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500">Manage employee leaves and sync with payroll</p>
        </div>
        <button 
          onClick={() => setShowApply(true)}
          className="bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-brand-dark/90 transition-colors shadow-lg shadow-brand-dark/20"
        >
          <Plus size={18} />
          <span>Apply Leave</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaves.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{l.first_name} {l.last_name}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {l.start_date} to {l.end_date}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                    l.leave_type === 'Paid' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {l.leave_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={l.reason}>
                  {l.reason}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                    l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                    l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {l.status === 'Pending' && (
                    <>
                      <button onClick={() => handleStatus(l.id, 'Approved')} className="text-emerald-600 hover:text-emerald-800 text-xs font-bold">Approve</button>
                      <button onClick={() => handleStatus(l.id, 'Rejected')} className="text-red-600 hover:text-red-800 text-xs font-bold">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showApply && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Apply Leave</h2>
                <button onClick={() => setShowApply(false)} className="text-slate-400 hover:text-slate-600">
                  <XCircle size={24} />
                </button>
              </div>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                  <select 
                    required
                    value={formData.employee_id}
                    onChange={e => setFormData({...formData, employee_id: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input 
                      type="date" required
                      value={formData.start_date}
                      onChange={e => setFormData({...formData, start_date: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                    <input 
                      type="date" required
                      value={formData.end_date}
                      onChange={e => setFormData({...formData, end_date: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                  <select 
                    value={formData.leave_type}
                    onChange={e => setFormData({...formData, leave_type: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Paid">Paid Leave</option>
                    <option value="Unpaid">Unpaid Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Casual">Casual Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                  <textarea 
                    required
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                  Submit Application
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContractManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<number | null>(null);
  const [milestones, setMilestones] = useState<ContractMilestone[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [heldRetention, setHeldRetention] = useState(0);
  const [cashFlow, setCashFlow] = useState<any>(null);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddInspection, setShowAddInspection] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ name: '', target_percentage: 0, amount: 0 });
  const [newInspection, setNewInspection] = useState({ milestone_id: 0, inspector_name: '', report_details: '', rating: 5 });

  useEffect(() => {
    fetch('/api/employees').then(res => res.json()).then(data => {
      setEmployees(data.filter((e: Employee) => e.calculation_method === 'Contract'));
    });
    fetch('/api/contracts/cash-flow').then(res => res.json()).then(setCashFlow);
  }, []);

  useEffect(() => {
    if (selectedEmp) {
      fetch(`/api/contracts/milestones/${selectedEmp}`).then(res => res.json()).then(setMilestones);
      fetch(`/api/contracts/retention/${selectedEmp}`).then(res => res.json()).then(data => setHeldRetention(data.total_held));
    }
  }, [selectedEmp]);

  const handleReleaseRetention = async () => {
    if (!selectedEmp || heldRetention <= 0) return;
    const month = new Date().toISOString().slice(0, 7);
    await fetch('/api/contracts/release-retention', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: selectedEmp, amount: heldRetention, period_month: month })
    });
    alert(`Retention release of LKR ${heldRetention.toLocaleString()} scheduled for ${month}`);
    setHeldRetention(0);
  };

  const handleAnalyze = async (milestone: ContractMilestone) => {
    setLoading(true);
    try {
      const reportsRes = await fetch(`/api/contracts/inspections/${milestone.id}`);
      const reports = await reportsRes.json();
      
      const emp = employees.find(e => e.id === selectedEmp);
      
      const analysis = await analyzeContractPayment({
        contract: emp,
        milestone: milestone,
        inspections: reports
      });
      
      setAiAnalysis({ milestoneId: milestone.id, ...analysis });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (milestoneId: number) => {
    alert("Payment approved and scheduled for next payroll run.");
  };

  const addMilestone = async () => {
    if (!selectedEmp || !newMilestone.name) return;
    await fetch('/api/contracts/milestones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: selectedEmp, ...newMilestone })
    });
    fetch(`/api/contracts/milestones/${selectedEmp}`).then(res => res.json()).then(setMilestones);
    setShowAddMilestone(false);
    setNewMilestone({ name: '', target_percentage: 0, amount: 0 });
  };

  const addInspection = async () => {
    if (!newInspection.milestone_id || !newInspection.inspector_name) return;
    await fetch('/api/contracts/inspections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInspection)
    });
    setShowAddInspection(false);
    setNewInspection({ milestone_id: 0, inspector_name: '', report_details: '', rating: 5 });
    alert("Inspection report submitted successfully.");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contract Management</h1>
          <p className="text-slate-500">Milestone tracking and AI-validated payments</p>
        </div>
        <select 
          className="bg-white border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand-dark"
          onChange={(e) => setSelectedEmp(Number(e.target.value))}
          value={selectedEmp || ''}
        >
          <option value="">Select Contract Worker</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_no})</option>
          ))}
        </select>
      </div>

      {selectedEmp && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Modals */}
          <AnimatePresence>
            {showAddMilestone && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
                >
                  <h3 className="text-2xl font-bold mb-6">Add New Milestone</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Milestone Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-brand-dark"
                        placeholder="e.g. Foundation Completion"
                        value={newMilestone.name}
                        onChange={e => setNewMilestone({...newMilestone, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Target %</label>
                        <input 
                          type="number" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-brand-dark"
                          value={newMilestone.target_percentage}
                          onChange={e => setNewMilestone({...newMilestone, target_percentage: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Amount (LKR)</label>
                        <input 
                          type="number" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-brand-dark"
                          value={newMilestone.amount}
                          onChange={e => setNewMilestone({...newMilestone, amount: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button onClick={() => setShowAddMilestone(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                      <button onClick={addMilestone} className="flex-1 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-dark/90 transition-colors">Save Milestone</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {showAddInspection && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
                >
                  <h3 className="text-2xl font-bold mb-6">Submit Inspection Report</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Select Milestone</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-brand-dark"
                        value={newInspection.milestone_id}
                        onChange={e => setNewInspection({...newInspection, milestone_id: Number(e.target.value)})}
                      >
                        <option value="0">Choose Milestone</option>
                        {milestones.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Inspector Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-brand-dark"
                        value={newInspection.inspector_name}
                        onChange={e => setNewInspection({...newInspection, inspector_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Report Details</label>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-brand-dark h-24"
                        value={newInspection.report_details}
                        onChange={e => setNewInspection({...newInspection, report_details: e.target.value})}
                      ></textarea>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Rating (1-5)</label>
                      <input 
                        type="number" 
                        min="1" max="5"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-brand-dark"
                        value={newInspection.rating}
                        onChange={e => setNewInspection({...newInspection, rating: Number(e.target.value)})}
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button onClick={() => setShowAddInspection(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                      <button onClick={addInspection} className="flex-1 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-dark/90 transition-colors">Submit Report</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Contract Milestones</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setShowAddInspection(true)}
                    className="text-slate-600 hover:text-slate-900 text-sm font-bold flex items-center"
                  >
                    <ShieldCheck size={16} className="mr-1" /> Add Inspection
                  </button>
                  <button 
                    onClick={() => setShowAddMilestone(true)}
                    className="text-brand-dark hover:text-brand-dark/80 text-sm font-bold flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Milestone
                  </button>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Milestone</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Target %</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {milestones.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{m.name}</td>
                      <td className="px-6 py-4">{m.target_percentage}%</td>
                      <td className="px-6 py-4">LKR {m.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                          m.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                          m.status === 'Invoiced' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleAnalyze(m)}
                          disabled={loading}
                          className="text-brand-dark hover:text-brand-dark/80 text-xs font-bold flex items-center justify-end w-full"
                        >
                          <BrainCircuit size={14} className="mr-1" />
                          {loading ? 'Analyzing...' : 'AI Validate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <AnimatePresence>
              {aiAnalysis && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="dark-card p-6 space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold flex items-center">
                      <BrainCircuit className="mr-2 text-brand-yellow" />
                      AI Analysis
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      aiAnalysis.riskScore < 30 ? 'bg-emerald-500/20 text-emerald-400' : 
                      aiAnalysis.riskScore < 60 ? 'bg-brand-yellow/20 text-brand-yellow' : 'bg-red-500/20 text-red-400'
                    }`}>
                      Risk: {aiAnalysis.riskScore}%
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs font-bold text-white/40 uppercase mb-2">Recommendation</p>
                      <p className="text-sm font-bold text-brand-yellow">{aiAnalysis.recommendation}</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs font-bold text-white/40 uppercase mb-2">Reasoning</p>
                      <p className="text-xs text-white/60 leading-relaxed">{aiAnalysis.reasoning}</p>
                    </div>

                    {aiAnalysis.detectedAnomalies.length > 0 && (
                      <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                        <p className="text-xs font-bold text-red-400 uppercase mb-2">Anomalies Detected</p>
                        <ul className="text-xs text-red-300 space-y-1 list-disc pl-4">
                          {aiAnalysis.detectedAnomalies.map((a: string, i: number) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs font-bold text-white/40 uppercase mb-2">Delay Risk</p>
                      <p className="text-xs text-white/60">{aiAnalysis.delayRisk}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApprove(aiAnalysis.milestoneId)}
                    className="w-full py-4 bg-brand-yellow text-brand-dark font-bold rounded-2xl hover:bg-brand-yellow/90 transition-all shadow-lg shadow-brand-yellow/20"
                  >
                    Approve Payment (LKR {aiAnalysis.suggestedPayment.toLocaleString()})
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass-card p-6">
              <h4 className="font-bold mb-4 flex items-center">
                <ShieldAlert size={18} className="mr-2 text-brand-dark" />
                Contract Compliance
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Retention Held</span>
                  <span className="font-bold">LKR {heldRetention.toLocaleString()}</span>
                </div>
                {heldRetention > 0 && (
                  <button 
                    onClick={handleReleaseRetention}
                    className="w-full py-2 bg-brand-dark text-white text-xs font-bold rounded-lg hover:bg-brand-dark/90 transition-colors"
                  >
                    Release Retention
                  </button>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Inspection Rating</span>
                  <span className="font-bold text-emerald-600">4.8/5.0</span>
                </div>
              </div>
            </div>

            {cashFlow && (
              <div className="glass-card p-6">
                <h4 className="font-bold mb-4 flex items-center">
                  <TrendingUp size={18} className="mr-2 text-brand-dark" />
                  Cash Flow Forecast
                </h4>
                <div className="space-y-4">
                  {cashFlow.milestones.map((m: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-text-muted">Milestones ({m.month})</span>
                      <span className="font-bold">LKR {m.total_due.toLocaleString()}</span>
                    </div>
                  ))}
                  {cashFlow.schedules.map((s: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-text-muted">Schedules ({s.month})</span>
                      <span className="font-bold text-brand-teal">LKR {s.total_due.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ExecutiveDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [subTab, setSubTab] = useState<'financial' | 'management'>('financial');
  const [executives, setExecutives] = useState<any[]>([]);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [showAllocate, setShowAllocate] = useState(false);
  const [selectedExec, setSelectedExec] = useState<any>(null);
  const [allocation, setAllocation] = useState({ profit_share: 0, bonus: 0, stock_options: 0 });

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    loadData();
    fetchExecutives();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/executive/dashboard');
      const dashboardData = await res.json();
      setData(dashboardData);
      
      // Auto-trigger AI analysis
      setAnalyzing(true);
      const analysis = await analyzeExecutiveDashboard(dashboardData);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const fetchExecutives = async () => {
    const res = await fetch('/api/executive/employees');
    const data = await res.json();
    setExecutives(data);
    
    const bRes = await fetch(`/api/executive/benefits/${currentMonth}`);
    const bData = await bRes.json();
    setBenefits(bData);
  };

  const handleAllocate = async () => {
    if (!selectedExec) return;
    await fetch('/api/executive/benefits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_id: selectedExec.id,
        period_month: currentMonth,
        profit_share_percentage: allocation.profit_share,
        bonus_amount: allocation.bonus,
        stock_options_granted: allocation.stock_options
      })
    });
    fetchExecutives();
    setShowAllocate(false);
    setAllocation({ profit_share: 0, bonus: 0, stock_options: 0 });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-brand-dark">Executive Dashboard</h1>
          <p className="text-[10px] text-text-muted">CFO-level financial intelligence & risk monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg mr-2">
            <button 
              onClick={() => setSubTab('financial')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${subTab === 'financial' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
            >
              Financial Intelligence
            </button>
            <button 
              onClick={() => setSubTab('management')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${subTab === 'management' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
            >
              Executive Management
            </button>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold text-text-light uppercase tracking-widest">Financial Health</p>
            <p className={`text-base font-bold ${aiAnalysis?.financialHealthScore > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {aiAnalysis?.financialHealthScore || '--'}%
            </p>
          </div>
          <button 
            onClick={loadData}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-text-light"
          >
            <RotateCw size={16} />
          </button>
        </div>
      </div>

      {subTab === 'financial' ? (
        <>
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="glass-card p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <Users size={16} className="text-blue-600" />
                </div>
                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">LIVE</span>
              </div>
              <p className="text-[10px] text-text-muted font-medium">Total Site Workforce</p>
              <h3 className="text-lg font-bold text-brand-dark mt-0.5">
                {data.workforce.reduce((acc: number, curr: any) => acc + curr.count, 0)}
              </h3>
              <div className="mt-2 space-y-1">
                {data.workforce.map((w: any, i: number) => (
                  <div key={i} className="flex justify-between text-[9px]">
                    <span className="text-text-light">{w.site_name}</span>
                    <span className="font-bold text-brand-dark">{w.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-emerald-50 rounded-lg">
                  <Clock size={16} className="text-brand-dark" />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Overtime Percentage</p>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{data.otPercentage.toFixed(1)}%</h3>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${data.otPercentage > 15 ? 'bg-red-500' : 'bg-brand-dark'}`}
                  style={{ width: `${Math.min(data.otPercentage * 2, 100)}%` }}
                ></div>
              </div>
              <p className="text-[8px] text-slate-400 mt-1">Target: &lt; 10% of basic payroll</p>
            </div>

            <div className="glass-card p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-brand-dark/5 rounded-lg">
                  <TrendingUp size={16} className="text-brand-dark" />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Avg. Productivity Score</p>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {(data.productivity.reduce((acc: number, curr: any) => acc + curr.score, 0) / data.productivity.length || 0).toFixed(1)}
              </h3>
              <p className="text-[8px] text-emerald-600 mt-1 flex items-center">
                <ArrowUpRight size={10} className="mr-1" /> +2.4% from last month
              </p>
            </div>

            <div className="glass-card p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-brand-dark/5 rounded-lg">
                  <ShieldAlert size={16} className="text-brand-dark" />
                </div>
                <span className="text-[8px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                  {data.fraudAlerts.length} ALERTS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Fraud Risk Level</p>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {data.fraudAlerts.length > 3 ? 'High' : data.fraudAlerts.length > 0 ? 'Medium' : 'Low'}
              </h3>
              <p className="text-[8px] text-slate-400 mt-1">Based on attendance anomalies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Charts */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-sm mb-4">Labor Cost vs Budget by Project</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.projectCosts}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                      />
                      <Bar dataKey="cost" name="Actual Cost" fill="#0A0A0A" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="labor_budget" name="Budget" fill="#E6FF00" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-sm mb-4">Contract Payment Status</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.contractStatus}
                          dataKey="total_amount"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={5}
                        >
                          {data.contractStatus.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#0A0A0A' : index === 1 ? '#E6FF00' : '#94a3b8'} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 space-y-1">
                    {data.contractStatus.map((s: any, i: number) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <span className="text-slate-500">{s.status}</span>
                        <span className="font-bold">LKR {s.total_amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-sm mb-4">Fraud Risk Alerts</h3>
                  <div className="space-y-2">
                    {data.fraudAlerts.map((a: any, i: number) => (
                      <div key={i} className="p-2 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex justify-between items-start">
                          <p className="text-[11px] font-bold text-slate-900">{a.first_name} {a.last_name}</p>
                          <span className="text-[9px] font-bold text-red-600">Risk: {a.fraud_score}%</span>
                        </div>
                        <p className="text-[10px] text-red-600 mt-0.5">{a.anomaly_details}</p>
                      </div>
                    ))}
                    {data.fraudAlerts.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                        <CheckCircle2 size={24} className="mb-1 text-emerald-500" />
                        <p className="text-[11px]">No fraud risks detected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <AnimatePresence>
                {analyzing ? (
                  <div className="dark-card p-4 flex flex-col items-center justify-center space-y-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-yellow"></div>
                    <p className="text-[11px] text-white/60 font-medium">AI is analyzing financial data...</p>
                  </div>
                ) : aiAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dark-card p-4 space-y-4"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <BrainCircuit className="text-brand-yellow" size={18} />
                      <h3 className="text-base font-bold">CFO AI Insights</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-[9px] font-bold text-white/40 uppercase mb-1.5">Profit Leakage Alerts</p>
                        <div className="space-y-2">
                          {aiAnalysis.leakageAlerts.map((a: any, i: number) => (
                            <div key={i} className="border-l-2 border-red-500 pl-2">
                              <p className="text-[10px] font-bold text-red-400">{a.area}</p>
                              <p className="text-[9px] text-white/60">{a.description}</p>
                              <p className="text-[9px] font-bold text-white/80 mt-0.5">Impact: {a.impact}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-[9px] font-bold text-white/40 uppercase mb-1.5">Margin Risk Prediction</p>
                        <div className="space-y-2">
                          {aiAnalysis.marginRisk.map((r: any, i: number) => (
                            <div key={i} className="flex justify-between items-start">
                              <div>
                                <p className="text-[10px] font-bold text-white/80">{r.project}</p>
                                <p className="text-[9px] text-white/60">{r.reason}</p>
                              </div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                r.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-brand-yellow/20 text-brand-yellow'
                              }`}>
                                {r.riskLevel}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-[9px] font-bold text-white/40 uppercase mb-1.5">Corrective Actions</p>
                        <ul className="text-[10px] text-white/80 space-y-1 list-disc pl-3">
                          {aiAnalysis.correctiveActions.map((a: string, i: number) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="glass-card p-4">
                <h4 className="font-bold text-sm mb-3 flex items-center">
                  <DollarSign size={14} className="mr-1.5 text-brand-dark" />
                  Financial Intelligence
                </h4>
                <div className="space-y-2">
                  {aiAnalysis?.insights.map((insight: string, i: number) => (
                    <div key={i} className="flex items-start space-x-2">
                      <div className="mt-1 w-1 h-1 rounded-full bg-brand-dark shrink-0"></div>
                      <p className="text-[10px] text-slate-600 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Monthly Executive Base</p>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                LKR {executives.reduce((acc, curr) => acc + curr.basic_salary, 0).toLocaleString()}
              </h3>
              <p className="text-[8px] text-slate-400 mt-1">Fixed monthly commitment</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Total Bonuses (Current Month)</p>
              <h3 className="text-lg font-bold text-brand-teal mt-0.5">
                LKR {benefits.reduce((acc, curr) => acc + curr.bonus_amount, 0).toLocaleString()}
              </h3>
              <p className="text-[8px] text-brand-teal mt-1">Performance-based allocation</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Avg. Profit Share %</p>
              <h3 className="text-lg font-bold text-emerald-600 mt-0.5">
                {(benefits.reduce((acc, curr) => acc + curr.profit_share_percentage, 0) / (benefits.length || 1)).toFixed(1)}%
              </h3>
              <p className="text-[8px] text-emerald-600 mt-1">Equity-linked compensation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-sm">Executive Staff Management</h3>
                  <div className="flex space-x-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                      {executives.length} Executives
                    </span>
                  </div>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-2 text-[9px] font-semibold text-slate-500 uppercase">Executive</th>
                      <th className="px-4 py-2 text-[9px] font-semibold text-slate-500 uppercase">Designation</th>
                      <th className="px-4 py-2 text-[9px] font-semibold text-slate-500 uppercase">Base Salary</th>
                      <th className="px-4 py-2 text-[9px] font-semibold text-slate-500 uppercase">Allocated Benefits</th>
                      <th className="px-4 py-2 text-[9px] font-semibold text-slate-500 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {executives.map(e => {
                      const benefit = benefits.find(b => b.employee_id === e.id);
                      return (
                        <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-7 h-7 rounded-full bg-brand-dark text-white flex items-center justify-center text-[10px] font-bold">
                                {e.first_name[0]}{e.last_name[0]}
                              </div>
                              <div>
                                <p className="text-[11px] font-medium text-slate-900">{e.first_name} {e.last_name}</p>
                                <p className="text-[8px] text-slate-400">{e.employee_no}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[8px] font-bold">
                              {e.designation}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-[11px] font-medium text-slate-900">
                            LKR {e.basic_salary.toLocaleString()}
                          </td>
                          <td className="px-4 py-2">
                            {benefit ? (
                              <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-emerald-600">Bonus: LKR {benefit.bonus_amount.toLocaleString()}</p>
                                <p className="text-[9px] font-bold text-brand-teal">Profit Share: {benefit.profit_share_percentage}%</p>
                              </div>
                            ) : (
                              <span className="text-[9px] text-slate-400 italic">No benefits allocated</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button 
                              onClick={() => {
                                setSelectedExec(e);
                                setShowAllocate(true);
                              }}
                              className="text-brand-dark hover:text-brand-dark/80 text-[10px] font-bold flex items-center justify-end w-full"
                            >
                              <Award size={12} className="mr-1" />
                              Allocate
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="glass-card p-4">
                <h4 className="font-bold text-sm mb-3 flex items-center">
                  <Crown size={14} className="mr-1.5 text-brand-dark" />
                  Executive Payroll Policy
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-brand-dark/5 rounded-lg border border-brand-dark/10">
                    <p className="text-[10px] font-bold text-slate-900 mb-0.5">Profit Sharing Pool</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed">
                      Executives are eligible for a profit-sharing pool capped at 5% of quarterly net profit.
                    </p>
                  </div>
                  <div className="p-3 bg-brand-dark/5 rounded-lg border border-brand-dark/10">
                    <p className="text-[10px] font-bold text-slate-900 mb-0.5">Performance Bonuses</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed">
                      Annual performance bonuses are calculated based on project delivery efficiency and cost savings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4">
                <h4 className="font-bold text-sm mb-3 flex items-center">
                  <Star size={14} className="mr-1.5 text-brand-dark" />
                  Stock Options (ESOP)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Total Pool Reserved</span>
                    <span className="font-bold">500,000 Units</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Total Granted</span>
                    <span className="font-bold text-brand-teal">125,000 Units</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-brand-teal h-full w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showAllocate && selectedExec && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-dark text-white flex items-center justify-center text-base font-bold">
                      {selectedExec.first_name[0]}{selectedExec.last_name[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{selectedExec.first_name} {selectedExec.last_name}</h3>
                      <p className="text-[10px] text-slate-500">{selectedExec.designation}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Profit Share Percentage (%)</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mt-1 outline-none focus:ring-1 focus:ring-brand-dark text-[11px]"
                        value={allocation.profit_share}
                        onChange={e => setAllocation({...allocation, profit_share: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Performance Bonus (LKR)</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mt-1 outline-none focus:ring-1 focus:ring-brand-dark text-[11px]"
                        value={allocation.bonus}
                        onChange={e => setAllocation({...allocation, bonus: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Stock Options (Units)</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mt-1 outline-none focus:ring-1 focus:ring-brand-dark text-[11px]"
                        value={allocation.stock_options}
                        onChange={e => setAllocation({...allocation, stock_options: Number(e.target.value)})}
                      />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button onClick={() => setShowAllocate(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors text-[11px]">Cancel</button>
                      <button onClick={handleAllocate} className="flex-1 py-2 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-dark/90 transition-colors text-[11px]">Allocate Benefits</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const WorkforceAI = () => {
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState<number | null>(null);
  const [activeShifts, setActiveShifts] = useState<any[]>([]);
  const [selectedShift, setSelectedShift] = useState<number | null>(null);
  const [qrCode, setQrCode] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [manualData, setManualData] = useState({ employee_id: 0, reason: '' });

  useEffect(() => {
    fetch('/api/sites').then(res => res.json()).then(setSites);
    fetch('/api/employees').then(res => res.json()).then(setEmployees);
  }, []);

  useEffect(() => {
    if (selectedSite) {
      loadSiteData();
      fetch(`/api/shifts/${selectedSite}`).then(res => res.json()).then(setActiveShifts);
    }
  }, [selectedSite]);

  const loadSiteData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance/insights/${selectedSite}`);
      const data = await res.json();
      setHistory(data);
      
      setAnalyzing(true);
      const aiInsights = await generateAttendanceInsights(data);
      setInsights(aiInsights);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const startShift = async () => {
    if (!selectedSite) return;
    const name = prompt("Enter Shift Name (e.g., Morning, Night):");
    if (!name) return;
    
    await fetch('/api/shifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        site_id: selectedSite, 
        supervisor_id: 1, 
        name, 
        start_time: new Date().toISOString() 
      })
    });
    fetch(`/api/shifts/${selectedSite}`).then(res => res.json()).then(setActiveShifts);
  };

  const endShift = async (id: number) => {
    if (!confirm("Are you sure you want to end this shift?")) return;
    await fetch(`/api/shifts/${id}/end`, { method: 'POST' });
    fetch(`/api/shifts/${selectedSite}`).then(res => res.json()).then(setActiveShifts);
    setSelectedShift(null);
    setQrCode(null);
  };

  const generateQR = async () => {
    if (!selectedSite || !selectedShift) {
      alert("Please select a site and an active shift first.");
      return;
    }
    const res = await fetch('/api/attendance/qr/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        supervisor_id: 1, 
        site_id: selectedSite,
        shift_id: selectedShift
      })
    });
    const data = await res.json();
    setQrCode(data);
  };

  const simulateOfflineScan = () => {
    if (!qrCode) return;
    const newEntry = {
      id: Date.now(),
      employee_id: 1, // Mock employee
      site_id: selectedSite,
      shift_id: selectedShift,
      qr_code_hash: qrCode.code_hash,
      device_id: "DEV-882-X",
      lat: 1.23,
      lng: 4.56,
      device_time: new Date().toISOString(),
      offline_timestamp: new Date().toISOString(),
      sync_status: 'Offline'
    };
    setOfflineQueue([...offlineQueue, newEntry]);
    alert("Attendance Recorded Locally (Offline Mode)");
  };

  const syncData = async () => {
    if (offlineQueue.length === 0) return;
    setLoading(true);
    for (const entry of offlineQueue) {
      await fetch('/api/attendance/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    }
    setOfflineQueue([]);
    loadSiteData();
    setLoading(false);
    alert("Sync Complete: All records uploaded to server.");
  };

  const submitManualAttendance = async () => {
    if (!selectedSite || !selectedShift || !manualData.employee_id || !manualData.reason) {
      alert("Please fill all fields and ensure site/shift are selected.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/attendance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manualData,
          site_id: selectedSite,
          shift_id: selectedShift,
          check_in: new Date().toISOString(),
          supervisor_id: 1 // Mock supervisor
        })
      });
      
      if (res.ok) {
        alert("Manual Attendance Recorded Successfully");
        setShowManualEntry(false);
        setManualData({ employee_id: 0, reason: '' });
        loadSiteData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Workforce AI Agent</h1>
          <p className="text-[10px] text-slate-500">Hybrid offline QR verification & fraud detection</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <select 
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-brand-dark text-[10px]"
            onChange={(e) => setSelectedSite(Number(e.target.value))}
            value={selectedSite || ''}
          >
            <option value="">Select Site</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${isOnline ? 'bg-slate-100 text-slate-700' : 'bg-emerald-600 text-white'}`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* QR & Simulation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-4 space-y-3">
            <h3 className="font-bold text-sm flex items-center">
              <Clock size={14} className="mr-1.5 text-brand-dark" />
              Shift Control
            </h3>
            <div className="space-y-2">
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {activeShifts.map(s => (
                  <div key={s.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all ${selectedShift === s.id ? 'bg-brand-dark/5 border-brand-dark' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="text-[10px]">
                      <p className={`font-bold ${selectedShift === s.id ? 'text-brand-dark' : 'text-slate-900'}`}>{s.name}</p>
                      <p className="text-[8px] text-slate-500">Started: {new Date(s.start_time).toLocaleTimeString()}</p>
                    </div>
                    <div className="flex space-x-1.5">
                      <button 
                        onClick={() => setSelectedShift(s.id)}
                        className={`px-2 py-0.5 rounded-md text-[8px] font-bold transition-all ${selectedShift === s.id ? 'bg-brand-dark text-white shadow-md shadow-brand-dark/20' : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-dark'}`}
                      >
                        {selectedShift === s.id ? 'Selected' : 'Select'}
                      </button>
                      <button 
                        onClick={() => endShift(s.id)}
                        className="p-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                        title="End Shift"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                ))}
                {activeShifts.length === 0 && (
                  <div className="text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <p className="text-[9px] text-slate-400">No active shifts found.</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <button 
                  onClick={startShift}
                  disabled={!selectedSite}
                  className="bg-slate-900 text-white text-[10px] py-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-50 font-bold"
                >
                  Start New Shift
                </button>
                {selectedShift && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <button 
                      onClick={generateQR}
                      className="bg-brand-dark text-white text-[10px] py-1.5 rounded-lg hover:bg-brand-dark/90 font-bold"
                    >
                      Generate QR
                    </button>
                    <button 
                      onClick={() => setShowManualEntry(true)}
                      className="bg-slate-100 text-slate-700 text-xs py-2 rounded-lg hover:bg-slate-200 font-bold flex items-center justify-center"
                    >
                      <FileText size={14} className="mr-1" /> Manual Entry
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showManualEntry && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                >
                  <h3 className="text-lg font-bold mb-4">Manual Attendance Entry</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Select Employee</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mt-1 outline-none focus:ring-1 focus:ring-brand-dark text-[11px]"
                        value={manualData.employee_id}
                        onChange={e => setManualData({...manualData, employee_id: Number(e.target.value)})}
                      >
                        <option value="0">Choose Employee</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_id})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Reason for Manual Entry</label>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mt-1 outline-none focus:ring-1 focus:ring-brand-dark h-20 text-[11px]"
                        placeholder="e.g. Device failure, QR scan error..."
                        value={manualData.reason}
                        onChange={e => setManualData({...manualData, reason: e.target.value})}
                      ></textarea>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button onClick={() => setShowManualEntry(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors text-[11px]">Cancel</button>
                      <button onClick={submitManualAttendance} className="flex-1 py-2 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-dark/90 transition-colors text-[11px]">Submit Entry</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {qrCode && (
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <h3 className="font-bold mb-4">Dynamic Site QR</h3>
              <div className="bg-white p-6 rounded-[32px] shadow-xl border-8 border-slate-900 mb-6">
                <QRCodeCanvas 
                  value={JSON.stringify({
                    site_id: selectedSite,
                    shift_id: selectedShift,
                    code: qrCode.code_hash,
                    timestamp: new Date().toISOString()
                  })} 
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-xs font-bold text-slate-900 uppercase">Site Access Token</p>
                <p className="text-[10px] text-slate-400 font-mono break-all">{qrCode.code_hash}</p>
                <p className="text-[10px] text-red-500 font-bold uppercase mt-2">Expires at: {new Date(qrCode.expires_at).toLocaleTimeString()}</p>
              </div>
              <button 
                onClick={simulateOfflineScan}
                className="w-full bg-slate-100 text-slate-900 text-xs py-3 rounded-xl hover:bg-slate-200 font-bold transition-all"
              >
                Simulate Employee Scan
              </button>
            </div>
          )}

          <div className="glass-card p-6">
            <h4 className="font-bold mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <ShieldAlert size={18} className="mr-2 text-brand-dark" />
                Offline Architecture
              </div>
              {offlineQueue.length > 0 && (
                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] animate-bounce">
                  {offlineQueue.length} Pending
                </span>
              )}
            </h4>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-900 mb-1">Local Encryption</p>
                <p className="text-[10px] text-slate-500">AES-256 tamper-proof logs enabled on mobile devices.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-900 mb-1">Sync Protocol</p>
                <p className="text-[10px] text-slate-500">WiFi-preferred syncing active.</p>
              </div>
              {offlineQueue.length > 0 && (
                <button 
                  onClick={syncData}
                  disabled={!isOnline}
                  className="w-full bg-emerald-600 text-white text-xs py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-bold"
                >
                  Sync Now ({offlineQueue.length} records)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Insights & History */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence>
            {analyzing ? (
              <div className="dark-card p-12 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-yellow"></div>
                <p className="text-sm text-white/60 font-medium">AI Agent generating site insights...</p>
              </div>
            ) : insights && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="dark-card p-6 space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <BrainCircuit className="text-brand-yellow" size={24} />
                    <h3 className="text-xl font-bold">Supervisor AI Insights</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    insights.siteRiskRating === 'Low' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    Site Risk: {insights.siteRiskRating}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs font-bold text-white/40 uppercase mb-2">Daily Anomalies</p>
                      <ul className="text-xs text-white/80 space-y-2">
                        {insights.dailyAnomalies.map((a: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <AlertCircle size={12} className="mr-2 mt-0.5 text-orange-400" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs font-bold text-white/40 uppercase mb-2">Absenteeism Prediction</p>
                      <p className="text-xs text-white/80 leading-relaxed">{insights.absenteeismPrediction}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs font-bold text-white/40 uppercase mb-2">Suspicious Employees</p>
                      <div className="space-y-3">
                        {insights.suspiciousEmployees.map((e: any, i: number) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-xs text-white/80 font-medium">{e.name}</span>
                            <span className="text-[10px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded">{e.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs font-bold text-white/40 uppercase mb-2">Site Summary</p>
                      <p className="text-xs text-white/60 leading-relaxed italic">"{insights.summary}"</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold">Recent Verification Logs</h3>
              <button className="text-xs font-bold text-brand-dark hover:underline">View All Logs</button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Time</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Risk Score</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{a.first_name} {a.last_name}</p>
                      <p className="text-[10px] text-slate-400">Device: {a.device_id || 'Unknown'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {new Date(a.check_in).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${a.risk_score > 70 ? 'bg-red-500' : a.risk_score > 30 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                            style={{ width: `${a.risk_score}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{a.risk_score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                        a.risk_level === 'Low' ? 'bg-emerald-100 text-emerald-700' : 
                        a.risk_level === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {a.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [month, setMonth] = useState('2024-03');
  const categories = ['All', 'Financial', 'Workforce', 'Compliance', 'AI Predictions'];

  const reports = [
    {
      id: 'payroll-register',
      title: "Monthly Payroll Register", 
      description: "Detailed breakdown of all employee earnings, deductions, and net pay.",
      icon: <FileText className="text-indigo-600" />,
      category: "Financial"
    },
    {
      id: 'epf-etf',
      title: "EPF/ETF Statutory Report", 
      description: "Ready-to-submit reports for statutory contributions.",
      icon: <Building2 className="text-emerald-600" />,
      category: "Compliance"
    },
    {
      id: 'labor-variance',
      title: "Labor Cost Variance", 
      description: "Compare budgeted vs actual labor costs across all projects.",
      icon: <TrendingUp className="text-brand-dark" />,
      category: "Financial"
    },
    {
      id: 'attendance-anomaly',
      title: "Attendance Anomaly Report", 
      description: "AI-detected geofence violations and behavioral fraud alerts.",
      icon: <ShieldAlert className="text-red-600" />,
      category: "Workforce"
    },
    {
      id: 'project-forecast',
      title: "Project Completion Forecast", 
      description: "AI-powered prediction of project timelines based on labor velocity.",
      icon: <BrainCircuit className="text-brand-yellow" />,
      category: "AI Predictions"
    },
    {
      id: 'tax-compliance',
      title: "Tax Compliance Summary", 
      description: "Summary of PAYE tax deductions and annual tax filings.",
      icon: <DollarSign className="text-indigo-600" />,
      category: "Compliance"
    },
    {
      id: 'attrition-risk',
      title: "Attrition Risk Analysis", 
      description: "AI model predicting potential employee turnover based on engagement data.",
      icon: <Users className="text-orange-600" />,
      category: "AI Predictions"
    }
  ];

  const filteredReports = activeCategory === 'All' 
    ? reports 
    : reports.filter(r => r.category === activeCategory);

  const handleGenerate = async () => {
    // In a real app, this would trigger a download or open a new tab
    alert(`Generating ${selectedReport.title} for ${month}...`);
    setSelectedReport(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reporting & Analytics</h1>
          <p className="text-slate-500">Generate enterprise-grade reports and predictive insights</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeCategory === cat ? 'bg-white text-brand-dark shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map(report => (
          <ReportCard 
            key={report.id}
            {...report}
            onGenerate={() => setSelectedReport(report)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Generate Report</h3>
                <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    {selectedReport.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedReport.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{selectedReport.category}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Select Period</label>
                  <input 
                    type="month" 
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Export Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
                      <FileText size={14} />
                      <span>PDF Document</span>
                    </button>
                    <button className="py-3 bg-slate-100 text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
                      <Download size={14} />
                      <span>CSV / Excel</span>
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                className="w-full py-4 bg-brand-dark text-white font-bold rounded-2xl shadow-xl shadow-brand-dark/20 flex items-center justify-center space-x-2"
              >
                <Download size={18} />
                <span>Download Report</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReportCard = ({ title, description, icon, category, onGenerate }: any) => (
  <div 
    onClick={onGenerate}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{category}</span>
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed mb-6 h-12 overflow-hidden">{description}</p>
    <button className="w-full py-3 bg-slate-50 text-slate-900 text-xs font-bold rounded-xl group-hover:bg-brand-dark group-hover:text-white transition-all flex items-center justify-center space-x-2">
      <Download size={14} />
      <span>Generate Report</span>
    </button>
  </div>
);

const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState('admin@paypro.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-10 w-full max-w-md shadow-xl border border-slate-100"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20 mb-6">
            <Calculator className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-brand-dark tracking-tight">Rockwell 365</h1>
          <p className="text-text-muted text-sm mt-2 font-medium">Construction Payroll Intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-text-light uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@paypro.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-text-light uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 text-base"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-xs text-text-light font-medium">
            Demo Credentials: <span className="font-bold text-text-muted">admin@paypro.com / admin123</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const AdvancesLoansPage = () => {
  const [advances, setAdvances] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [newAdvance, setNewAdvance] = useState({ employee_id: '', amount: 0, repayment_month: '' });

  useEffect(() => {
    fetch('/api/advances').then(res => res.json()).then(setAdvances);
    fetch('/api/loans').then(res => res.json()).then(setLoans);
    fetch('/api/employees').then(res => res.json()).then(setEmployees);
  }, []);

  const handleRequestAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/advances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAdvance)
    });
    setShowAdvanceModal(false);
    fetch('/api/advances').then(res => res.json()).then(setAdvances);
  };

  const approveAdvance = async (id: number) => {
    await fetch(`/api/advances/approve/${id}`, { method: 'POST' });
    fetch('/api/advances').then(res => res.json()).then(setAdvances);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Advances & Loans</h1>
          <p className="text-slate-500">Manage employee salary advances and long-term loans</p>
        </div>
        <button 
          onClick={() => setShowAdvanceModal(true)}
          className="bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Request Advance</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <HandCoins size={20} className="text-brand-emerald" />
            <span>Recent Advances</span>
          </h2>
          <div className="space-y-4">
            {advances.map(adv => (
              <div key={adv.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-900">{adv.first_name} {adv.last_name}</p>
                  <p className="text-xs text-slate-500">Requested: {adv.request_date} | Repay: {adv.repayment_month}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">LKR {adv.amount.toLocaleString()}</p>
                  {adv.status === 'Pending' ? (
                    <button 
                      onClick={() => approveAdvance(adv.id)}
                      className="text-[10px] font-bold text-indigo-600 hover:underline"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className={`text-[10px] font-bold uppercase ${adv.status === 'Paid' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {adv.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Landmark size={20} className="text-brand-yellow" />
            <span>Active Loans</span>
          </h2>
          <div className="space-y-4">
            {loans.map(loan => (
              <div key={loan.id} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-slate-900">{loan.first_name} {loan.last_name}</p>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full uppercase">
                    {loan.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Total</p>
                    <p className="text-sm font-bold">LKR {loan.total_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Monthly</p>
                    <p className="text-sm font-bold text-indigo-600">LKR {loan.monthly_installment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Balance</p>
                    <p className="text-sm font-bold text-emerald-600">LKR {loan.remaining_balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdvanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6">Request Salary Advance</h2>
            <form onSubmit={handleRequestAdvance} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Employee</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={newAdvance.employee_id}
                  onChange={e => setNewAdvance({ ...newAdvance, employee_id: e.target.value })}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_no})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Amount (LKR)</label>
                <input 
                  type="number"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={newAdvance.amount}
                  onChange={e => setNewAdvance({ ...newAdvance, amount: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Repayment Month</label>
                <input 
                  type="month"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={newAdvance.repayment_month}
                  onChange={e => setNewAdvance({ ...newAdvance, repayment_month: e.target.value })}
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAdvanceModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-brand-dark text-white font-bold rounded-xl"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const AccountingIntegration = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [journals, setJournals] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/accounting/journals/${month}`).then(res => res.json()).then(setJournals);
  }, [month]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accounting Integration</h1>
          <p className="text-slate-500">Auto-generated payroll journal entries for General Ledger</p>
        </div>
        <input 
          type="month" 
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Debit (LKR)</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Credit (LKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {journals.map(j => (
              <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{j.account_name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{j.description}</td>
                <td className="px-6 py-4 text-right font-mono text-indigo-600">{j.debit > 0 ? j.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                <td className="px-6 py-4 text-right font-mono text-emerald-600">{j.credit > 0 ? j.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
              </tr>
            ))}
            {journals.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No journal entries found for this period. Process payroll to generate.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BankProcessing = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/bank/transfers/${month}`).then(res => res.json()).then(setBatches);
  }, [month]);

  const generateBatch = async () => {
    await fetch('/api/bank/generate-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month })
    });
    fetch(`/api/bank/transfers/${month}`).then(res => res.json()).then(setBatches);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bank & Payment Processing</h1>
          <p className="text-slate-500">Generate bank transfer files and manage payment batches</p>
        </div>
        <div className="flex space-x-3">
          <input 
            type="month" 
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg"
          />
          <button 
            onClick={generateBatch}
            className="bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download size={18} />
            <span>Generate Batch</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {batches.map(batch => (
          <div key={batch.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Landmark size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{batch.batch_no}</p>
                <p className="text-sm text-slate-500">Generated: {new Date(batch.processed_at || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right flex items-center space-x-8">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Total Amount</p>
                <p className="text-xl font-bold text-slate-900">LKR {batch.total_amount.toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                  Download CSV
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                  Process Payment
                </button>
              </div>
            </div>
          </div>
        ))}
        {batches.length === 0 && (
          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
            <p className="text-slate-400 font-medium">No payment batches generated for this month.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CompliancePage = () => {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/compliance/documents').then(res => res.json()).then(setDocs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compliance & Legal</h1>
          <p className="text-slate-500">Manage statutory documents, contracts, and legal filings</p>
        </div>
        <button className="bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <FileUp size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{doc.first_name} {doc.last_name}</p>
                  <p className="text-xs text-slate-500">{doc.employee_no}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                    {doc.doc_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{doc.expiry_date || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                    doc.status === 'Valid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 hover:text-indigo-800 font-bold text-xs">View</button>
                </td>
              </tr>
            ))}
            {docs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No compliance documents found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AuditControls = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    fetch('/api/audit-logs').then(res => res.json()).then(data => {
      // Mocking more data if empty
      if (data.length === 0) {
        setLogs([
          { id: 1, action: 'Payroll Processed', details: 'March 2024 Payroll finalized for Engineering Dept. Total amount: LKR 4.5M. Processed by USR-001.', user_id: 'USR-001', created_at: new Date().toISOString(), type: 'System', status: 'Success', ip: '192.168.1.45', location: 'Colombo, LK', device: 'Chrome / macOS' },
          { id: 2, action: 'Project Budget Change', details: 'Main Tower budget increased by 15% (LKR 2.5M additional). Reason: Scope expansion in Phase 2.', user_id: 'USR-002', created_at: new Date(Date.now() - 3600000).toISOString(), type: 'User', status: 'Warning', ip: '192.168.1.12', location: 'Kandy, LK', device: 'Safari / iPad' },
          { id: 3, action: 'Unauthorized Access Attempt', details: 'Failed login attempt from unknown IP. Multiple incorrect password entries detected.', user_id: 'System', created_at: new Date(Date.now() - 7200000).toISOString(), type: 'Security', status: 'Critical', ip: '45.12.33.1', location: 'Moscow, RU', device: 'Unknown / Linux' },
          { id: 4, action: 'Employee Record Deleted', details: 'Employee EMP-992 (Nimal Perera) removed from system. Action authorized by HR Director.', user_id: 'USR-001', created_at: new Date(Date.now() - 86400000).toISOString(), type: 'User', status: 'Success', ip: '192.168.1.45', location: 'Colombo, LK', device: 'Chrome / macOS' },
          { id: 5, action: 'System Backup Completed', details: 'Daily automated cloud backup finished successfully. Size: 4.2GB.', user_id: 'System', created_at: new Date(Date.now() - 90000000).toISOString(), type: 'System', status: 'Success', ip: 'Internal', location: 'Cloud', device: 'Server' },
        ]);
      } else {
        setLogs(data);
      }
    });
  }, []);

  const filteredLogs = logs.filter(l => {
    const statusMatch = filter === 'All' || l.status === filter;
    const typeMatch = typeFilter === 'All' || l.type === typeFilter;
    const userMatch = userFilter === 'All' || l.user_id === userFilter;
    return statusMatch && typeMatch && userMatch;
  });

  const uniqueUsers = Array.from(new Set(logs.map(l => l.user_id)));
  const uniqueTypes = Array.from(new Set(logs.map(l => l.type)));

  const pendingApprovals = [
    { id: 1, type: 'Payroll', amount: 'LKR 4,500,000', requestedBy: 'HR Manager', date: '2024-03-24', description: 'Final approval for March 2024 payroll cycle.' },
    { id: 2, type: 'Budget', amount: 'LKR 1,200,000', requestedBy: 'Project Lead', date: '2024-03-23', description: 'Additional labor budget for Bridge Project Phase 2.' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit & Controls</h1>
          <p className="text-slate-500">System-wide activity logs and internal control monitoring</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-50 transition-colors">
            <ShieldCheck size={18} className="text-brand-emerald" />
            <span>Run Security Scan</span>
          </button>
          <button className="bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-slate-200">
            <Download size={18} />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Logs', value: logs.length, icon: History, color: 'bg-blue-50 text-blue-600' },
          { label: 'Critical Alerts', value: logs.filter(l => l.status === 'Critical').length, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
          { label: 'Pending Approvals', value: pendingApprovals.length, icon: FileCheck, color: 'bg-amber-50 text-amber-600' },
          { label: 'Active Users', value: '12', icon: Users, color: 'bg-emerald-50 text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Audit Log Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">System Activity Log</h2>
                <div className="flex space-x-2">
                  {['All', 'Success', 'Warning', 'Critical'].map(f => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${filter === f ? 'bg-brand-dark text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Filter by Type</label>
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    <option value="All">All Types</option>
                    {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Filter by User</label>
                  <select 
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    <option value="All">All Users</option>
                    {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => {
                      setFilter('All');
                      setTypeFilter('All');
                      setUserFilter('All');
                    }}
                    className="px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-2">
                        <p className="text-[10px] font-bold text-slate-900">{new Date(log.created_at).toLocaleDateString()}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{new Date(log.created_at).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-4 py-2">
                        <p className="text-[11px] font-bold text-slate-900">{log.action}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">{log.type}</p>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
                            {String(log.user_id || '').charAt(0) || 'S'}
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">{log.user_id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                          log.status === 'Success' ? 'bg-emerald-100 text-emerald-600' :
                          log.status === 'Warning' ? 'bg-amber-100 text-amber-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button 
                          onClick={() => {
                            setSelectedLog(log);
                            setShowLogModal(true);
                          }}
                          className="p-1.5 text-slate-300 hover:text-brand-dark hover:bg-white rounded-lg transition-all"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Pending Approvals</h2>
            <div className="space-y-4">
              {pendingApprovals.map(approval => (
                <div key={approval.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-emerald/30 transition-all cursor-pointer group" onClick={() => {
                  setSelectedApproval(approval);
                  setShowApprovalModal(true);
                }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-full uppercase">{approval.type}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{approval.date}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">{approval.amount}</p>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{approval.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Req: {approval.requestedBy}</p>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-emerald transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-dark rounded-[32px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="text-xl font-bold mb-2">Compliance Score</h3>
            <div className="flex items-end space-x-2 mb-4">
              <span className="text-5xl font-bold">98</span>
              <span className="text-xl font-bold opacity-40 mb-1">/100</span>
            </div>
            <p className="text-xs text-white/60 mb-6">Your system is currently meeting all internal control requirements.</p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors">View Compliance Report</button>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && selectedApproval && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Review Request</h3>
                <button onClick={() => setShowApprovalModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Request Details</p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">{selectedApproval.amount}</p>
                  <p className="text-sm font-bold text-slate-600">{selectedApproval.type} Approval</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Requested By</span>
                    <span className="font-bold">{selectedApproval.requestedBy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-bold">{selectedApproval.date}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 leading-relaxed">{selectedApproval.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 py-4 bg-brand-emerald text-brand-dark font-bold rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-brand-emerald/20">Approve</button>
                <button className="flex-1 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all">Reject</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {showLogModal && selectedLog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-10 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedLog.action}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">LOG-ID: {selectedLog.id.toString().padStart(6, '0')}</p>
                </div>
                <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Event Description</label>
                    <p className="text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {selectedLog.details}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Status</label>
                      <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                        selectedLog.status === 'Success' ? 'bg-emerald-100 text-emerald-600' :
                        selectedLog.status === 'Warning' ? 'bg-amber-100 text-amber-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {selectedLog.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Type</label>
                      <span className="text-[10px] font-bold text-slate-700">{selectedLog.type}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Metadata</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">User ID</span>
                        <span className="text-[10px] font-bold text-slate-900">{selectedLog.user_id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">IP Address</span>
                        <span className="text-[10px] font-mono text-slate-900">{selectedLog.ip}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Location</span>
                        <span className="text-[10px] font-bold text-slate-900">{selectedLog.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Device</span>
                        <span className="text-[10px] font-bold text-slate-900">{selectedLog.device}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Timestamp</span>
                        <span className="text-[10px] font-bold text-slate-900">{new Date(selectedLog.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-[10px] hover:bg-slate-200 transition-colors flex items-center space-x-1.5">
                  <Download size={12} />
                  <span>Download Log</span>
                </button>
                <button 
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 bg-brand-dark text-white font-bold rounded-lg text-[10px] hover:scale-105 transition-transform shadow-lg shadow-slate-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NotificationPanel = ({ isOpen, onClose, notifications, onRead }: { isOpen: boolean, onClose: () => void, notifications: any[], onRead: (id: number) => void }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Notifications</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              onClick={() => onRead(n.id)}
              className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-indigo-50/30' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  n.type === 'Alert' ? 'bg-red-100 text-red-600' : 
                  n.type === 'Warning' ? 'bg-amber-100 text-amber-600' : 
                  'bg-indigo-100 text-indigo-600'
                }`}>
                  {n.type}
                </span>
                <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{n.title}</p>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{n.message}</p>
            </div>
          ))
        )}
      </div>
      <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
        <button className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">View All Activity</button>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  return (
    <aside className="w-48 bg-white border-r border-slate-200 h-screen sticky top-0 overflow-y-auto flex flex-col">
      <div className="p-3 border-b border-slate-100 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-brand-primary rounded-md flex items-center justify-center shadow-sm">
            <Calculator className="text-white" size={14} />
          </div>
          <span className="text-base font-bold tracking-tight text-brand-dark">Rockwell 365</span>
        </div>
      </div>

      <div className="flex-1 px-2 py-2 space-y-3">
        <div className="space-y-0.5">
          <p className="px-2 text-[9px] font-bold text-text-light uppercase tracking-widest mb-1">My self-service</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Clock} label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
          <SidebarItem icon={Calendar} label="Leaves" active={activeTab === 'leaves'} onClick={() => setActiveTab('leaves')} />
          <SidebarItem 
            icon={Receipt} 
            label="Expenses & Claims" 
            active={activeTab === 'expenses'} 
            onClick={() => setActiveTab('expenses')} 
            subItems={[
              { label: 'Overview', active: false, onClick: () => {} },
              { label: 'Expenses', active: activeTab === 'expenses', onClick: () => setActiveTab('expenses') },
              { label: 'Claims', active: false, onClick: () => {} }
            ]}
          />
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-text-light uppercase tracking-widest mb-2">Workforce</p>
          <SidebarItem icon={Users} label="Employees" active={activeTab === 'employees'} onClick={() => setActiveTab('employees')} />
          <SidebarItem icon={BrainCircuit} label="Workforce AI" active={activeTab === 'workforce_ai'} onClick={() => setActiveTab('workforce_ai')} />
          <SidebarItem icon={Zap} label="AI Insights" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-text-light uppercase tracking-widest mb-2">Projects</p>
          <SidebarItem icon={Briefcase} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
          <SidebarItem icon={FileCheck} label="Contracts" active={activeTab === 'contracts'} onClick={() => setActiveTab('contracts')} />
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-text-light uppercase tracking-widest mb-2">Payroll</p>
          <SidebarItem icon={FileUp} label="Payroll Inputs" active={activeTab === 'inputs'} onClick={() => setActiveTab('inputs')} />
          <SidebarItem icon={Calculator} label="Processing" active={activeTab === 'payroll'} onClick={() => setActiveTab('payroll')} />
          <SidebarItem icon={CreditCard} label="Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          <SidebarItem icon={HandCoins} label="Advances" active={activeTab === 'advances'} onClick={() => setActiveTab('advances')} />
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-text-light uppercase tracking-widest mb-2">Management</p>
          <SidebarItem icon={Crown} label="Executive" active={activeTab === 'executive'} onClick={() => setActiveTab('executive')} />
          <SidebarItem icon={TrendingUp} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <SidebarItem icon={ShieldCheck} label="Audit" active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} />
          <SidebarItem icon={Scale} label="Compliance" active={activeTab === 'compliance'} onClick={() => setActiveTab('compliance')} />
          <SidebarItem icon={Database} label="Accounting" active={activeTab === 'accounting'} onClick={() => setActiveTab('accounting')} />
          <SidebarItem icon={FileText} label="Invoicing" active={activeTab === 'invoicing'} onClick={() => setActiveTab('invoicing')} />
        </div>
      </div>

      <div className="p-2 border-t border-slate-100">
        <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>
    </aside>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>({
    id: 1,
    username: "Admin User",
    role: "Administrator",
    email: "admin@paypro.com"
  });

  useEffect(() => {
    if (user) {
      fetch(`/api/notifications?userId=${user.id}`)
        .then(res => res.json())
        .then(setNotifications);
      
      const interval = setInterval(() => {
        fetch(`/api/notifications?userId=${user.id}`)
          .then(res => res.json())
          .then(setNotifications);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id: number) => {
    await fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
  };

  useEffect(() => {
    // Reset subtab when main tab changes
    const defaultSubTabs: Record<string, string> = {
      employees: 'Employee Master',
      projects: 'Project Master',
      attendance: 'Daily Log',
      payroll: 'Payroll Run',
      overtime: 'OT Approval',
      allowances: 'Allowance Setup',
      advances: 'Advances',
      contracts: 'Contract Registration',
      statutory: 'EPF Setup',
      accounting: 'Journal Posting',
      payments: 'Bank Transfer',
      invoicing: 'Labor Invoicing',
      documents: 'Employee Docs',
      reports: 'Core Reports',
      audit: 'Audit Logs',
      notifications: 'Alerts',
      integrations: 'API Setup',
      settings: 'Payroll Period'
    };
    if (defaultSubTabs[activeTab]) {
      setActiveSubTab(defaultSubTabs[activeTab]);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          user={user} 
          activeTab={activeTab} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
          unreadCount={unreadCount}
        />

        <main className="flex-1 p-4 overflow-y-auto">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg font-bold text-brand-dark">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('_', ' ')}
                </h1>
                <p className="text-[10px] text-text-muted mt-0.5">Manage your {activeTab.replace('_', ' ')} and activities</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-text-muted hover:bg-slate-50 transition-all flex items-center space-x-2">
                  <Download size={14} />
                  <span>Export</span>
                </button>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus size={14} />
                  <span>Add New</span>
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
                {activeTab === 'employees' && <EmployeeList searchQuery={searchQuery} />}
                {activeTab === 'workforce_ai' && <WorkforceAI />}
                {activeTab === 'contracts' && <ContractManagement />}
                {activeTab === 'projects' && <ProjectManagement searchQuery={searchQuery} />}
                {activeTab === 'attendance' && <WorkforceManagement />}
                {activeTab === 'leaves' && <LeaveManagement />}
                {activeTab === 'executive' && <ExecutiveDashboard />}
                {activeTab === 'ai' && <AIInsights />}
                {activeTab === 'inputs' && <PayrollInputs />}
                {activeTab === 'payroll' && <PayrollProcessing />}
                {activeTab === 'reports' && <ReportsPage />}
                {activeTab === 'advances' && <AdvancesLoansPage />}
                {activeTab === 'accounting' && <AccountingIntegration />}
                {activeTab === 'payments' && <BankProcessing />}
                {activeTab === 'compliance' && <CompliancePage />}
                {activeTab === 'audit' && <AuditControls />}
                {activeTab === 'settings' && <SettingsPage />}
                {activeTab === 'expenses' && <ExpensesView />}
                {activeTab === 'invoicing' && <InvoicingView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <AnimatePresence>
          {showNotifications && (
            <NotificationPanel 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
              notifications={notifications}
              onRead={markAsRead}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
