import { useEffect, useState } from 'react';
import { ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

function Toast({ type, message, show, onClose, autoClose = true }) {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        if (show) {
            setIsVisible(true);
            
            if (autoClose) {
                const timer = setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(() => {
                        onClose && onClose();
                    }, 300); // Wait for animation to complete
                }, 3000);
                
                return () => clearTimeout(timer);
            }
        } else {
            setIsVisible(false);
        }
    }, [show, autoClose, onClose]);
    
    let iconColor = "text-text-info";
    let backgroundColor = "bg-info";
    let borderColor = "border-border-info";
    let icon = <InformationCircleIcon className={`w-5 h-5 ${iconColor}`} />;
    
    if (type === "success") {
        iconColor = "text-text-success";
        backgroundColor = "bg-success";
        borderColor = "border-border-success";
        icon = <CheckCircleIcon className={`w-5 h-5 ${iconColor}`} />;
    } else if (type === "info") {
        iconColor = "text-text-info";
        backgroundColor = "bg-info";
        borderColor = "border-border-info";
        icon = <InformationCircleIcon className={`w-5 h-5 ${iconColor}`} />;
    } else if (type === "warning") {
        iconColor = "text-text-warning";
        backgroundColor = "bg-warning";
        borderColor = "border-border-warning";
        icon = <ExclamationTriangleIcon className={`w-5 h-5 ${iconColor}`} />;
    } else if (type === "error") {
        iconColor = "text-text-danger";
        backgroundColor = "bg-danger";
        borderColor = "border-border-danger";
        icon = <ExclamationCircleIcon className={`w-5 h-5 ${iconColor}`} />;
    }
    
    return (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className={`flex items-center p-3 ${backgroundColor} border ${borderColor} rounded-lg shadow-lg min-w-[300px] max-w-md`}>
                <div className="flex-shrink-0 mr-3">
                    {icon}
                </div>
                <div className="flex-1 mr-2">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button 
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => {
                            onClose && onClose();
                        }, 300);
                    }} 
                    className="flex-shrink-0 ml-2 text-text-secondary hover:text-text-secondary-dark hover:border-transparent bg-transparent focus:outline-none"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default Toast; 