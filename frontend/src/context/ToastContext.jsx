import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    
    const showToast = (type, message) => {
        setToast({ show: true, type, message });
    };
    
    const hideToast = () => {
        setToast({ ...toast, show: false });
    };
    
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast 
                type={toast.type} 
                message={toast.message} 
                show={toast.show} 
                onClose={hideToast} 
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
} 