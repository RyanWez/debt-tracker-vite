import { useData } from '../contexts/DataContext';
import Modal from './Modal';
import { Edit2, Trash2 } from 'lucide-react';

export default function CustomerDetailsModal({ customer, isOpen, onClose, onEdit, onDelete }) {
    const { debts, payments } = useData();

    if (!customer) return null;

    const customerDebts = debts.filter(d => d.customerId === customer.id).sort((a, b) => new Date(b.date) - new Date(a.date));
    const customerPayments = payments.filter(p => p.customerId === customer.id).sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalDebt = customerDebts.reduce((sum, debt) => sum + (Number(debt.total) || 0), 0) -
        customerPayments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

    const headerActions = (
        <>
            <button
                onClick={() => onEdit(customer)}
                className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-black border-2 border-black hover:bg-blue-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
                <Edit2 size={12} /> EDIT
            </button>
            <button
                onClick={() => onDelete(customer)}
                className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-black border-2 border-black hover:bg-red-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
                <Trash2 size={12} /> DEL
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={customer.name}
            headerActions={headerActions}
            className="max-w-md w-full"
        >
            {/* Total Debt Card */}
            <div className="bg-pink-100 border-4 border-black p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-sm font-bold mb-1">စုစုပေါင်းကြွေးကျန်</h3>
                <div className="text-3xl font-black text-red-600">
                    {totalDebt.toLocaleString()} Ks
                </div>
            </div>

            {/* Debt History */}
            <div className="mb-6">
                <h3 className="text-lg font-black mb-3">အကြွေးယူမှုစာရင်း</h3>
                <div className="space-y-3">
                    {customerDebts.length > 0 ? (
                        customerDebts.slice(0, 3).map((debt) => (
                            <div key={debt.id} className="flex justify-between items-center bg-red-50 p-3 border-l-4 border-black">
                                <div>
                                    <div className="font-bold">{debt.item || 'အကြွေး'}</div>
                                    <div className="text-xs text-gray-500">{new Date(debt.date).toLocaleDateString()}</div>
                                </div>
                                <div className="font-black text-red-600">{Number(debt.total).toLocaleString()} Ks</div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-sm italic">အကြွေးမှတ်တမ်း မရှိပါ။</div>
                    )}
                </div>
            </div>

            {/* Payment History */}
            <div>
                <h3 className="text-lg font-black mb-3">ပြန်ဆပ်ငွေမှတ်တမ်း</h3>
                <div className="space-y-3">
                    {customerPayments.length > 0 ? (
                        customerPayments.slice(0, 3).map((payment) => (
                            <div key={payment.id} className="flex justify-between items-center bg-green-50 p-3 border-l-4 border-black">
                                <div>
                                    <div className="font-bold">ပြန်ဆပ်ငွေ</div>
                                    <div className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
                                </div>
                                <div className="font-black text-green-600">{Number(payment.amount).toLocaleString()} Ks</div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-sm italic">ပြန်ဆပ်ငွေမှတ်တမ်း မရှိပါ။</div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
