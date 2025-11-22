import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Plus, FileText, Calendar, User } from 'lucide-react';

export default function Debts() {
    const { customers, debts, addDebt } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        customerId: '',
        item: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });

    const filteredDebts = useMemo(() => {
        return debts
            .filter(d => {
                const customer = customers.find(c => c.id === d.customerId);
                const customerName = customer?.name.toLowerCase() || '';
                return customerName.includes(searchTerm.toLowerCase()) ||
                    d.item.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [debts, customers, searchTerm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.customerId && formData.amount) {
            addDebt({
                ...formData,
                amount: Number(formData.amount),
                total: Number(formData.amount)
            });
            // Reset form but keep date
            setFormData(prev => ({
                ...prev,
                customerId: '',
                item: '',
                amount: ''
            }));
        }
    };

    const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown';

    return (
        <div className="space-y-6">
            {/* Add Debt Form (Inline Card) */}
            <div className="brutalist-card gradient-pink p-4 animate-slideInUp">
                <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                    <Plus size={24} className="border-2 border-black rounded-full p-0.5 bg-white" />
                    ကြွေးအသစ်မှတ်မယ်
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
                    <input
                        type="text"
                        required
                        value={formData.item}
                        onChange={e => setFormData({ ...formData, item: e.target.value })}
                        className="brutalist-input w-full p-3 bg-white"
                        placeholder="ပစ္စည်း/မှတ်စု (ဥပမာ - မုန့် 2ထုပ်)"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className="brutalist-input w-full p-3 bg-white"
                            placeholder="ပမာဏ (Ks)"
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
                    placeholder="🔍 ဖောက်သည် သို့မဟုတ် ပစ္စည်း ရှာရန်..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="brutalist-input w-full pl-10 p-3 bg-white"
                />
            </div>

            {/* Recent Debts List */}
            <div className="brutalist-card bg-white p-4">
                <h2 className="text-lg font-black mb-4 border-b-3 border-black pb-2">📋 နောက်ဆုံးကြွေးမှတ်တမ်းများ</h2>
                <div className="space-y-3">
                    {filteredDebts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 font-bold">မှတ်တမ်းမရှိသေးပါ</div>
                    ) : (
                        filteredDebts.map(debt => (
                            <div key={debt.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 border-2 border-black hover:bg-pink-50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User size={16} className="text-gray-500" />
                                        <span className="font-black text-lg">{getCustomerName(debt.customerId)}</span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                        <FileText size={14} />
                                        {debt.item}
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col justify-between w-full md:w-auto mt-2 md:mt-0 items-end gap-1">
                                    <span className="text-red-600 font-black text-xl">{Number(debt.total).toLocaleString()} Ks</span>
                                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {debt.date}
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
