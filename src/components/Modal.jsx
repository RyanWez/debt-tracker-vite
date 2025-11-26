import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

export default function Modal({ isOpen, onClose, title, children, className, variant = 'default', headerActions }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (isOpen) {
            dialog?.showModal();
        } else {
            dialog?.close();
        }
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    const onCancel = (e) => {
        e.preventDefault();
        onClose();
    };

    const getHeaderColor = () => {
        switch (variant) {
            case 'danger': return 'bg-red-50 text-red-900 border-b-2 border-red-100';
            case 'success': return 'bg-green-50 text-green-900 border-b-2 border-green-100';
            case 'info': return 'bg-blue-50 text-blue-900 border-b-2 border-blue-100';
            default: return 'bg-gray-50 text-gray-900 border-b-2 border-gray-100';
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onCancel={onCancel}
            className={clsx(
                "bg-white p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm rounded-xl shadow-2xl",
                "border border-gray-200",
                "transition-all duration-200 ease-out",
                className || "max-w-md w-full"
            )}
            style={{
                margin: 'auto',
                maxWidth: '28rem',
                width: '100%'
            }}
        >
            <div className={clsx(
                "flex justify-between items-center px-6 py-4 sticky top-0 z-10",
                getHeaderColor()
            )}>
                <h2 className="text-lg font-bold flex items-center gap-2">{title}</h2>
                <div className="flex items-center gap-2">
                    {headerActions}
                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
            <div className="p-6">
                {children}
            </div>
        </dialog>
    );
}
