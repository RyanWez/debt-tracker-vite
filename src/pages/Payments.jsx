import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Plus, Calendar, User, DollarSign, Edit, Trash2 } from 'lucide-react';
import SearchableSelect from '../components/SearchableSelect';
import Modal from '../components/Modal';

export default function Payments() {
    const { customers, payments, addPayment, updatePayment, deletePayment, getCustomerTotalDebt } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    // Edit/Delete State
    const [editingPayment, setEditingPayment] = useState(null);
    const [deletingPayment, setDeletingPayment] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
            const success = addPayment({
                ...formData,
                amount: Number(formData.amount)
            });
            
            if (success) {
                // Reset form but keep date
                setFormData(prev => ({
                    ...prev,
                    customerId: '',
                    amount: ''
                }));
            }
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editingPayment && editingPayment.amount) {
            const success = updatePayment(editingPayment.id, {
                ...editingPayment,
                amount: Number(editingPayment.amount)
            });
            if (success) {
                setIsEditModalOpen(false);
                setEditingPayment(null);
            }
        }
    };

    const handleDelete = () => {
        if (deletingPayment) {
            deletePayment(deletingPayment.id);
            setDeletingPayment(null);
        }
    };

    const openEditModal = (payment) => {
        setEditingPayment({ ...payment });
        setIsEditModalOpen(true);
    };

    const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown';

    const selectedCustomerDebt = useMemo(() => {
        if (!formData.customerId) return 0;
        return getCustomerTotalDebt(formData.customerId);
    }, [formData.customerId, getCustomerTotalDebt]);

    return (
        <div className="space-y-6">
            {/* Add Payment Form (Inline Card) */}
            <div className="brutalist-card gradient-teal p-4 animate-slideInUp relative z-20">
                <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                    <Plus size={24} className="border-2 border-black rounded-full p-0.5 bg-white" />
                    ငွေရှင်းတာမှတ်မယ်
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <SearchableSelect
                        options={customers}
                        value={formData.customerId}
                        onChange={(value) => setFormData({ ...formData, customerId: value })}
                        placeholder="-- ဖောက်သည် ရွေးပါ --"
                    />

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
                                    <div className="flex gap-2 mt-1">
                                        <button 
                                            onClick={() => openEditModal(payment)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setDeletingPayment(payment)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="✏️ ငွေရှင်းစာရင်း ပြင်ဆင်ရန်"
                variant="info"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="font-bold text-sm block mb-1">ဖောက်သည်</label>
                        <input
                            type="text"
                            disabled
                            value={getCustomerName(editingPayment?.customerId)}
                            className="brutalist-input w-full p-3 bg-gray-100"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="font-bold text-sm block mb-1">ပမာဏ</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={editingPayment?.amount || ''}
                                onChange={e => setEditingPayment({ ...editingPayment, amount: e.target.value })}
                                className="brutalist-input w-full p-3"
                            />
                        </div>
                        <div>
                            <label className="font-bold text-sm block mb-1">ရက်စွဲ</label>
                            <input
                                type="date"
                                required
                                value={editingPayment?.date || ''}
                                onChange={e => setEditingPayment({ ...editingPayment, date: e.target.value })}
                                className="brutalist-input w-full p-3"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="brutalist-btn bg-green-500 text-white w-full py-3">
                            ✅ ပြင်ဆင်မယ်
                        </button>
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="brutalist-btn bg-gray-400 text-white w-full py-3">
                            ❌ မလုပ်တော့ဘူး
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deletingPayment}
                onClose={() => setDeletingPayment(null)}
                title="⚠️ သတိပေးချက်"
                className="max-w-sm"
                variant="danger"
            >
                <div className="text-center">
                    <div className="text-5xl mb-4">🗑️</div>
                    <p className="font-bold mb-2">ဒီမှတ်တမ်းကို ဖျက်မှာ သေချာလား?</p>
                    <p className="text-sm text-gray-600 mb-4">ပြန်ယူလို့ မရနိုင်တော့ပါ။</p>

                    <div className="flex gap-3">
                        <button
                            onClick={handleDelete}
                            className="brutalist-btn bg-red-500 text-white flex-1 py-2"
                        >
                            ဖျက်မယ်
                        </button>
                        <button
                            onClick={() => setDeletingPayment(null)}
                            className="brutalist-btn bg-gray-200 text-black flex-1 py-2"
                        >
                            မဖျက်တော့ဘူး
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
