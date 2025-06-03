import { Fragment } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) {
    if (!isOpen) return null;
    
    let iconColor = "text-text-warning";
    let icon = <ExclamationTriangleIcon className={`w-6 h-6 ${iconColor}`} />;
    
    if (type === "danger") {
        iconColor = "text-red-600";
    } else if (type === "info") {
        iconColor = "text-text-info";
    }
    
    return (
        <Fragment>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
            
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-background-primary rounded-lg shadow-xl w-full max-w-md border border-border-dark">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                            <div className="flex-shrink-0">
                                {icon}
                            </div>
                            <h3 className="text-lg font-medium text-text-warning">{title}</h3>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-text-secondary hover:text-text-primary bg-transparent hover:border-transparent"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-4 pt-2">
                        <p className="text-text-primary">{message}</p>
                    </div>
                    
                    <div className="flex justify-end gap-2 p-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-text-primary bg-background-primary border border-border-dark rounded hover:bg-dark-primary hover:border-accent transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 text-white ${type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-accent hover:bg-accent/90"} hover:border-transparent rounded transition-colors`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ConfirmDialog; 