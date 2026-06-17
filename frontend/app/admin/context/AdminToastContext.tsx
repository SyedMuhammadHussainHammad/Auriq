"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface AdminToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const AdminToastContext = createContext<AdminToastContextType | undefined>(undefined);

export const AdminToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast]);

  return (
    <AdminToastContext.Provider value={{ toast: addToast, success, error }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className="flex items-center gap-3 bg-[#111] border border-white/10 shadow-2xl px-5 py-4 rounded-xl transform transition-all duration-300"
            style={{ animation: 'slideIn 0.3s ease-out forwards' }}
          >
            {t.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-sm font-semibold text-white/90 tracking-wide">{t.message}</span>
          </div>
        ))}
        <style jsx>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
      </div>
    </AdminToastContext.Provider>
  );
};

export const useAdminToast = () => {
  const context = useContext(AdminToastContext);
  if (!context) throw new Error('useAdminToast must be used within an AdminToastProvider');
  return context;
};
