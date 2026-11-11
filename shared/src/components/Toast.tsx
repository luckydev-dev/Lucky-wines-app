import React, { createContext, useContext, useState, useCallback } from 'react';
import { IconCheckCircle, IconAlertCircle, IconInfo, IconClose } from '../icons/CustomIcons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <IconCheckCircle size={18} color="#22C55E" />;
      case 'error':
        return <IconAlertCircle size={18} color="#EF4444" />;
      case 'warning':
        return <IconAlertCircle size={18} color="#F59E0B" />;
      case 'info':
      default:
        return <IconInfo size={18} color="#60A5FA" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: 'env(safe-area-inset-top, 20px)',
        left: '16px',
        right: '16px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              backgroundColor: '#1E191C',
              color: '#FCFAF8',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid rgba(201, 163, 41, 0.3)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideDown 200ms ease',
            }}
          >
            {getToastIcon(toast.type)}
            <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, lineHeight: 1.4 }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#B5A697',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <IconClose size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
