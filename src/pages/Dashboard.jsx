import { useData } from '../contexts/DataContext';
import { useMemo } from 'react';
import { TrendingDown, DollarSign, Users, Calendar } from 'lucide-react';

export default function Dashboard() {
    const { customers, debts, payments, getCustomerTotalDebt } = useData();

    const metrics = useMemo(() => {
        const totalDebt = customers.reduce((sum, c) => sum + getCustomerTotalDebt(c.id), 0);

        const today = new Date().toISOString().split('T')[0];
        const todayPayment = payments
            .filter(p => p.date === today)
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthDebt = debts
            .filter(d => d.date && d.date.startsWith(currentMonth))
            .reduce((sum, d) => sum + (Number(d.total) || 0), 0);

        return {
            totalDebt,
            todayPayment,
            customerCount: customers.length,
            monthDebt
        };
    }, [customers, debts, payments, getCustomerTotalDebt]);

    const topDebtors = useMemo(() => {
        return customers
            .map(c => ({ ...c, totalDebt: getCustomerTotalDebt(c.id) }))
            .filter(c => c.totalDebt > 0)
            .sort((a, b) => b.totalDebt - a.totalDebt)
            .slice(0, 5);
    }, [customers, getCustomerTotalDebt]);

    const todayTransactions = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return payments
            .filter(p => p.date === today)
            .map(p => {
                const customer = customers.find(c => c.id === p.customerId);
                return { ...p, customerName: customer?.name || 'Unknown' };
            })
            .reverse();
    }, [payments, customers]);

    return (
        <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="brutalist-card gradient-red p-4 metric-card animate-slideInUp">
                    <div className="text-xs font-bold mb-1 flex items-center gap-1"><TrendingDown size={14} /> ကြွေးကျန်စုစုပေါင်း</div>
                    <div className="text-2xl font-black">{metrics.totalDebt.toLocaleString()} Ks</div>
                </div>
                <div className="brutalist-card gradient-green p-4 metric-card animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                    <div className="text-xs font-bold mb-1 flex items-center gap-1"><DollarSign size={14} /> ဒီနေ့ရငွေ</div>
                    <div className="text-2xl font-black">{metrics.todayPayment.toLocaleString()} Ks</div>
                </div>
                <div className="brutalist-card gradient-blue p-4 metric-card animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="text-xs font-bold mb-1 flex items-center gap-1"><Users size={14} /> ဖောက်သည် ဦးရေ</div>
                    <div className="text-2xl font-black">{metrics.customerCount}</div>
                </div>
                <div className="brutalist-card gradient-purple p-4 metric-card animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                    <div className="text-xs font-bold mb-1 flex items-center gap-1"><Calendar size={14} /> လစဉ်အကြွေး</div>
                    <div className="text-2xl font-black">{metrics.monthDebt.toLocaleString()} Ks</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Debtors */}
                <div className="brutalist-card gradient-orange p-4 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-lg font-black mb-3 border-b-3 border-black pb-2">📈 အကြွေးအများဆုံး ဖောက်သည်များ</h2>
                    <div className="space-y-2 max-h-60 overflow-y-auto hide-scrollbar">
                        {topDebtors.length === 0 ? (
                            <p className="text-center text-sm font-bold text-gray-500 py-4">ဒေတာမရှိသေးပါ</p>
                        ) : (
                            topDebtors.map(c => (
                                <div key={c.id} className="flex justify-between items-center bg-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="font-bold text-sm">{c.name}</span>
                                    <span className="font-black text-red-600">{c.totalDebt.toLocaleString()} Ks</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="brutalist-card bg-white p-4">
                    <h2 className="text-lg font-black mb-3 border-b-3 border-black pb-2">🕐 ဒီနေ့ ပြန်ဆပ်ငွေစာရင်း</h2>
                    <div className="space-y-2 max-h-60 overflow-y-auto hide-scrollbar">
                        {todayTransactions.length === 0 ? (
                            <p className="text-center text-sm font-bold text-gray-500 py-4">ဒီနေ့ ငွေရှင်းထားတာ မရှိသေးပါ</p>
                        ) : (
                            todayTransactions.map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-green-50 p-2 border-2 border-black">
                                    <div>
                                        <div className="font-bold text-sm">{p.customerName}</div>
                                        <div className="text-xs text-gray-500">Today</div>
                                    </div>
                                    <span className="font-black text-green-600">+{p.amount.toLocaleString()} Ks</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
