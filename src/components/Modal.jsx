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

    // Handle Esc key manually if needed, but dialog handles it by default. 
    // We just need to sync the state when it closes.
    const onCancel = (e) => {
        e.preventDefault(); // Prevent default close to allow controlled closing if needed, or just sync state
        onClose();
    };

    const getHeaderColor = () => {
        switch (variant) {
            case 'danger': return 'bg-red-500 text-white';
            case 'success': return 'bg-green-500 text-white';
            case 'info': return 'bg-blue-500 text-white';
            default: return 'gradient-yellow text-black';
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onCancel={onCancel}
            className={clsx(
                "bg-white p-0 brutalist-card backdrop:bg-black/60 backdrop:backdrop-blur-sm",
                className || "max-w-md w-full"
            )}
        >
            <div className={clsx(
                "flex justify-between items-center p-4 border-b-3 border-black sticky top-0 z-10",
                getHeaderColor()
            )}>
                <h2 className="text-xl font-black flex items-center gap-2">{title}</h2>
                <div className="flex items-center gap-2">
                    {headerActions}
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-black hover:text-white transition-colors border-2 border-black bg-white text-black cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
            <div className="p-6">
                {children}
            </div>
        </dialog>
    );
}
