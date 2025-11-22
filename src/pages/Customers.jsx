import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Phone, User, Trash2, Edit, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import clsx from 'clsx';

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, getCustomerTotalDebt } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '' });

  // Edit/Delete State
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
    );
  }, [customers, searchTerm]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      addCustomer(formData);
      setFormData({ name: '', phone: '' });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer && editingCustomer.name.trim()) {
      updateCustomer(editingCustomer.id, editingCustomer);
      closeEditModal();
    }
  };

  const openEditModal = (customer) => {
    setEditingCustomer({ ...customer });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = () => {
    if (deletingCustomer) {
      deleteCustomer(deletingCustomer.id);
      setDeletingCustomer(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Customer Form (Inline Card) */}
      <div className="brutalist-card gradient-yellow p-4 animate-slideInUp">
        <h2 className="text-lg font-black mb-3 flex items-center gap-2">
          <Plus size={24} className="border-2 border-black rounded-full p-0.5 bg-white" />
          ဖောက်သည် အသစ်ထည့်မယ်
        </h2>
        <form onSubmit={handleAddSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="အမည် (ထည့်ရန်လို)"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="brutalist-input w-full p-3 bg-white"
          />
          <input
            type="tel"
            placeholder="ဖုန်းနံပါတ် (ရှိလျှင်ထည့်ပါ)"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="brutalist-input w-full p-3 bg-white"
          />
          <button type="submit" className="brutalist-btn bg-black text-white w-full py-3 hover:bg-gray-800">
            သိမ်းမယ်
          </button>
        </form>
      </div>

      {/* Search - Sticky */}
      <div className="sticky top-[72px] md:top-[72px] z-10 bg-gray-50 pb-4 -mx-4 md:-mx-8 px-4 md:px-8 pt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="🔍 နာမည် သို့မဟုတ် ဖုန်းနံပါတ် ရှာရန်..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="brutalist-input w-full pl-10 p-3 bg-white"
          />
        </div>
      </div>

      {/* Customer List - Limited Height with Hidden Scrollbar on Desktop/Tablet */}
      <div className="max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-hide md:scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(customer => {
            const totalDebt = getCustomerTotalDebt(customer.id);
            return (
              <div key={customer.id} className="brutalist-card bg-white p-4 flex flex-col justify-between group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-lg flex items-center gap-2">
                      <User size={18} />
                      {customer.name}
                    </h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(customer)}
                        className="p-1 hover:bg-blue-100 text-blue-600 rounded border-2 border-transparent hover:border-black transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingCustomer(customer)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded border-2 border-transparent hover:border-black transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {customer.phone && (
                    <p className="text-sm font-bold text-gray-500 flex items-center gap-2 mb-3">
                      <Phone size={14} />
                      {customer.phone}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">ကြွေးကျန်စုစုပေါင်း</span>
                    <span className={clsx(
                      "font-black text-xl",
                      totalDebt > 0 ? "text-red-600" : "text-green-600"
                    )}>
                      {totalDebt.toLocaleString()} Ks
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="font-bold text-gray-500">ဖောက်သည်များ မရှိသေးပါ</p>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="✏️ ဖောက်သည် ပြင်ဆင်ရန်"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="font-bold text-sm block mb-1">အမည် <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={editingCustomer?.name || ''}
              onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
              className="brutalist-input w-full p-3"
            />
          </div>
          <div>
            <label className="font-bold text-sm block mb-1">ဖုန်းနံပါတ်</label>
            <input
              type="tel"
              value={editingCustomer?.phone || ''}
              onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
              className="brutalist-input w-full p-3"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="brutalist-btn bg-green-500 text-white w-full py-3">
              ✅ ပြင်ဆင်မယ်
            </button>
            <button type="button" onClick={closeEditModal} className="brutalist-btn bg-gray-400 text-white w-full py-3">
              ❌ မလုပ်တော့ဘူး
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        title="⚠️ သတိပေးချက်"
        className="max-w-sm"
      >
        <div className="text-center">
          <div className="text-5xl mb-4">🗑️</div>
          <p className="font-bold mb-2">ဒီဖောက်သည်ကို ဖျက်မှာ သေချာလား?</p>
          <p className="text-sm text-gray-600 mb-4">"{deletingCustomer?.name}" နှင့် ပတ်သက်သော မှတ်တမ်းများအားလုံး ပျောက်သွားပါလိမ့်မယ်။</p>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="brutalist-btn bg-red-500 text-white flex-1 py-2"
            >
              ဖျက်မယ်
            </button>
            <button
              onClick={() => setDeletingCustomer(null)}
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
