import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Plus, Calendar, User, DollarSign } from 'lucide-react';

export default function Payments() {
    const { customers, payments, addPayment, getCustomerTotalDebt } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        customerId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });

    const filteredPayments = useMemo(() => {
        return payments
            .filter(p => {
                const customer = customers.find(c => c.id === p.customerId);
                const customerName = customer?.name.toLowerCase() || '';
                return customerName.includes(searchTerm.toLowerCase());
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [payments, customers, searchTerm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.customerId && formData.amount) {
            addPayment({
                ...formData,
                amount: Number(formData.amount)
            });
            // Reset form but keep date
            setFormData(prev => ({
                ...prev,
                customerId: '',
                amount: ''
            }));
        }
    };

    const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown';

    const selectedCustomerDebt = useMemo(() => {
        if (!formData.customerId) return 0;
        return getCustomerTotalDebt(formData.customerId);
    }, [formData.customerId, getCustomerTotalDebt]);

    return (
        <div className="space-y-6">
            {/* Add Payment Form (Inline Card) */}
            <div className="brutalist-card gradient-teal p-4 animate-slideInUp">
                <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                    <Plus size={24} className="border-2 border-black rounded-full p-0.5 bg-white" />
                    ငွေရှင်းတာမှတ်မယ်
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <select
                        required
                        value={formData.customerId}
                        onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                        className="brutalist-input w-full p-3 bg-white"
                    >
                        <option value="">-- ဖောက်သည် ရွေးပါ --</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    {formData.customerId && (
                        <div className="brutalist-card bg-white p-3 border-2 border-black">
                            <span className="font-bold text-sm">လက်ရှိပေးရန်ကျန်ငွေ: </span>
                            <span className="text-xl font-black text-red-600 block">{selectedCustomerDebt.toLocaleString()} Ks</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className="brutalist-input w-full p-3 bg-white"
                            placeholder="ပေးမယ့်ပမာဏ (Ks)"
                        />
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="brutalist-input w-full p-3 bg-white"
                        />
                    </div>
                    <button type="submit" className="brutalist-btn bg-black text-white w-full py-3 hover:bg-gray-800">
                        သိမ်းမယ်
                    </button>
                </form>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="🔍 ဖောက်သည် ရှာရန်..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="brutalist-input w-full pl-10 p-3 bg-white"
                />
            </div>

            {/* Recent Payments List */}
            <div className="brutalist-card bg-white p-4">
                <h2 className="text-lg font-black mb-4 border-b-3 border-black pb-2">💵 နောက်ဆုံး ပြန်ဆပ်ငွေစာရင်း</h2>
                <div className="space-y-3">
                    {filteredPayments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 font-bold">မှတ်တမ်းမရှိသေးပါ</div>
                    ) : (
                        filteredPayments.map(payment => (
                            <div key={payment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 border-2 border-black hover:bg-teal-50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User size={16} className="text-gray-500" />
                                        <span className="font-black text-lg">{getCustomerName(payment.customerId)}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col justify-between w-full md:w-auto mt-2 md:mt-0 items-end gap-1">
                                    <span className="text-green-600 font-black text-xl">+{Number(payment.amount).toLocaleString()} Ks</span>
                                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {payment.date}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
