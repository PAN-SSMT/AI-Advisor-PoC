import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  headerCenter?: React.ReactNode;
  headerRight?: React.ReactNode;
  titleRight?: React.ReactNode;
  headerPaddingClass?: string;
  hideBorder?: boolean;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, headerCenter, headerRight, titleRight, headerPaddingClass, hideBorder, maxWidth }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-gray-800 bg-opacity-50 dark:bg-opacity-70 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`relative mx-auto w-full ${maxWidth || 'max-w-5xl'} shadow-lg rounded-2xl bg-white dark:bg-gray-900 transition-colors duration-200`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center ${headerPaddingClass || 'p-5'} ${hideBorder ? '' : 'border-b border-gray-200 dark:border-gray-700'}`}>
          <div className="flex items-center gap-4">
            <h3 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            {titleRight}
          </div>
          {headerCenter && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              {headerCenter}
            </div>
          )}
          <div className="flex items-center gap-4">
            {headerRight}
            <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
          </div>
        </div>
        <div className="max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;