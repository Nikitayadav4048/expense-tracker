import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`toast ${type}`}>
      <Icon size={20} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;