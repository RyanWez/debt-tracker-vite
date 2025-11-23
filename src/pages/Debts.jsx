import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Plus, FileText, Calendar, User, Edit, Trash2 } from 'lucide-react';
import SearchableSelect from '../components/SearchableSelect';
import Modal from '../components/Modal';

export default function Debts() {
    const { customers, debts, addDebt, updateDebt, deleteDebt } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    // Edit/Delete State
    const [editingDebt, setEditingDebt] = useState(null);
    const [deletingDebt, setDeletingDebt] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
            const success = addDebt({
                ...formData,
                amount: Number(formData.amount),
                total: Number(formData.amount)
            });
            
            if (success) {
                // Reset form but keep date
                setFormData(prev => ({
                    ...prev,
                    customerId: '',
                    item: '',
                    amount: ''
                }));
            }
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editingDebt && editingDebt.amount) {
            const success = updateDebt(editingDebt.id, {
                ...editingDebt,
                amount: Number(editingDebt.amount),
                total: Number(editingDebt.amount)
            });
            if (success) {
                setIsEditModalOpen(false);
                setEditingDebt(null);
            }
        }
    };

    const handleDelete = () => {
        if (deletingDebt) {
            deleteDebt(deletingDebt.id);
            setDeletingDebt(null);
        }
    };

    const openEditModal = (debt) => {
        setEditingDebt({ ...debt });
        setIsEditModalOpen(true);
    };

    const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown';

    return (
        <div className="space-y-6">
            {/* Add Debt Form (Inline Card) */}
            <div className="brutalist-card gradient-pink p-4 animate-slideInUp relative z-20">
                <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                    <Plus size={24} className="border-2 border-black rounded-full p-0.5 bg-white" />
                    ကြွေးအသစ်မှတ်မယ်
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <SearchableSelect
                        options={customers}
                        value={formData.customerId}
                        onChange={(value) => setFormData({ ...formData, customerId: value })}
                        placeholder="-- ဖောက်သည် ရွေးပါ --"
                    />
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
                                    <div className="flex gap-2 mt-1">
                                        <button 
                                            onClick={() => openEditModal(debt)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setDeletingDebt(debt)}
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
                title="✏️ အကြွေးစာရင်း ပြင်ဆင်ရန်"
                variant="info"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="font-bold text-sm block mb-1">ဖောက်သည်</label>
                        <input
                            type="text"
                            disabled
                            value={getCustomerName(editingDebt?.customerId)}
                            className="brutalist-input w-full p-3 bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="font-bold text-sm block mb-1">ပစ္စည်း/မှတ်စု</label>
                        <input
                            type="text"
                            required
                            value={editingDebt?.item || ''}
                            onChange={e => setEditingDebt({ ...editingDebt, item: e.target.value })}
                            className="brutalist-input w-full p-3"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="font-bold text-sm block mb-1">ပမာဏ</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={editingDebt?.amount || ''}
                                onChange={e => setEditingDebt({ ...editingDebt, amount: e.target.value })}
                                className="brutalist-input w-full p-3"
                            />
                        </div>
                        <div>
                            <label className="font-bold text-sm block mb-1">ရက်စွဲ</label>
                            <input
                                type="date"
                                required
                                value={editingDebt?.date || ''}
                                onChange={e => setEditingDebt({ ...editingDebt, date: e.target.value })}
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
                isOpen={!!deletingDebt}
                onClose={() => setDeletingDebt(null)}
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
                            onClick={() => setDeletingDebt(null)}
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
