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
        setCustomers(prev => [...prev, { ...customer, id: Date.now().toString() }]);
    };

    const updateCustomer = (id, updates) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteCustomer = (id) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
        // Also cleanup debts and payments? The original app might have done this.
        // Let's check logic later. For now, just state manipulation.
    };

    const addDebt = (debt) => {
        setDebts(prev => [...prev, { ...debt, id: Date.now().toString() }]);
    };

    const addPayment = (payment) => {
        setPayments(prev => [...prev, { ...payment, id: Date.now().toString() }]);
    };

    return (
        <DataContext.Provider value={{
            customers, setCustomers,
            debts, setDebts,
            payments, setPayments,
            getCustomerTotalDebt,
            addCustomer, updateCustomer, deleteCustomer,
            addDebt, addPayment
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
