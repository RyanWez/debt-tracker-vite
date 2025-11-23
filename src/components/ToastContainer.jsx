import { useData } from '../contexts/DataContext';

export default function ToastContainer() {
    const { toasts, removeToast } = useData();

    if (toasts.length === 0) return null;

    return (
        <div id="toast-container" className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast toast-${toast.type} animate-slideInRight`}>
                    <div className="toast-icon">
                        {toast.type === 'success' && '✅'}
                        {toast.type === 'error' && '❌'}
                        {toast.type === 'warning' && '⚠️'}
                        {toast.type === 'info' && 'ℹ️'}
                    </div>
                    <div className="toast-message">{toast.message}</div>
                    <div className="toast-progress" style={{ animationDuration: '3000ms' }}></div>
                </div>
            ))}
        </div>
    );
}
