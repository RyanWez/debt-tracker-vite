import { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [customers, setCustomers] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('bakery_customers') || '[]');
        } catch (e) {
            console.error("Failed to parse customers", e);
            return [];
        }
    });

    const [debts, setDebts] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('bakery_debts') || '[]');
        } catch (e) {
            console.error("Failed to parse debts", e);
            return [];
        }
    });

    const [payments, setPayments] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('bakery_payments') || '[]');
        } catch (e) {
            console.error("Failed to parse payments", e);
            return [];
        }
    });

    // Toast State
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        localStorage.setItem('bakery_customers', JSON.stringify(customers));
    }, [customers]);

    useEffect(() => {
        localStorage.setItem('bakery_debts', JSON.stringify(debts));
    }, [debts]);

    useEffect(() => {
        localStorage.setItem('bakery_payments', JSON.stringify(payments));
    }, [payments]);

    const getCustomerTotalDebt = (customerId) => {
        const customerDebts = debts.filter(d => d.customerId === customerId);
        const customerPayments = payments.filter(p => p.customerId === customerId);

        const totalDebt = customerDebts.reduce((sum, d) => sum + (Number(d.total) || 0), 0);
        const totalPaid = customerPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        return totalDebt - totalPaid;
    };

    // Helper to add data
    const addCustomer = (customer) => {
        if (customers.some(c => c.name.toLowerCase() === customer.name.toLowerCase())) {
            showToast('ဒီနာမည်နဲ့ ဖောက်သည် ရှိပြီးသားပါ!', 'error');
            return false;
        }
        setCustomers(prev => [...prev, { ...customer, id: Date.now().toString() }]);
        showToast('ဖောက်သည် အသစ် ထည့်ပြီးပါပြီ', 'success');
        return true;
    };

    const updateCustomer = (id, updates) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
        showToast('ဖောက်သည် အချက်အလက် ပြင်ပြီးပါပြီ', 'success');
        return true;
    };

    const deleteCustomer = (id) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
        // Also cleanup debts and payments? The original app might have done this.
        // Let's check logic later. For now, just state manipulation.
        showToast('ဖောက်သည်ကို ဖျက်လိုက်ပါပြီ', 'success');
        return true;
    };

    const addDebt = (debt) => {
        setDebts(prev => [...prev, { ...debt, id: Date.now().toString() }]);
        showToast('အကြွေးမှတ်တမ်း သိမ်းပြီးပါပြီ', 'success');
        return true;
    };

    const addPayment = (payment) => {
        const currentDebt = getCustomerTotalDebt(payment.customerId);
        
        if (currentDebt <= 0) {
            showToast('ဒီဖောက်သည်မှာ ပေးစရာ အကြွေးမရှိပါ', 'error');
            return false;
        }

        if (Number(payment.amount) > currentDebt) {
            showToast(`ပေးရန်ကျန်ငွေ ${currentDebt.toLocaleString()} Ks ထက် ကျော်လွန်နေပါတယ်`, 'error');
            return false;
        }

        setPayments(prev => [...prev, { ...payment, id: Date.now().toString() }]);
        showToast('ငွေရှင်းမှတ်တမ်း သိမ်းပြီးပါပြီ', 'success');
        return true;
    };

    const updateDebt = (id, updates) => {
        setDebts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
        showToast('အကြွေးမှတ်တမ်း ပြင်ပြီးပါပြီ', 'success');
        return true;
    };

    const deleteDebt = (id) => {
        setDebts(prev => prev.filter(d => d.id !== id));
        showToast('အကြွေးမှတ်တမ်း ဖျက်လိုက်ပါပြီ', 'success');
        return true;
    };

    const updatePayment = (id, updates) => {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        showToast('ငွေရှင်းမှတ်တမ်း ပြင်ပြီးပါပြီ', 'success');
        return true;
    };

    const deletePayment = (id) => {
        setPayments(prev => prev.filter(p => p.id !== id));
        showToast('ငွေရှင်းမှတ်တမ်း ဖျက်လိုက်ပါပြီ', 'success');
        return true;
    };

    return (
        <DataContext.Provider value={{
            customers, setCustomers,
            debts, setDebts,
            payments, setPayments,
            getCustomerTotalDebt,
            addCustomer, updateCustomer, deleteCustomer,
            addDebt, addPayment,
            updateDebt, deleteDebt,
            updatePayment, deletePayment,
            toasts, removeToast
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
