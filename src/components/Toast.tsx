import React, { useState, useEffect } from 'react';

interface ToastProps {
  show: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
  title: string;
  message: string;
  transactionHash?: string;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  show,
  onClose,
  type = 'success',
  title,
  message,
  transactionHash,
  duration = 5000
}) => {
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const copyToClipboard = async (text: string) => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(text);
      setTimeout(() => setCopying(false), 1000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setCopying(false);
    }
  };

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-900';
      case 'error':
        return 'text-red-900';
      case 'info':
        return 'text-blue-900';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      <div className={`${getBgColor()} border rounded-lg shadow-lg p-4 transform transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${getTextColor()}`}>
              {title}
            </h3>
            <div className={`mt-1 text-sm ${getTextColor()} opacity-90`}>
              <p className="whitespace-pre-line">{message}</p>
              
              {transactionHash && (
                <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">Transaction Hash:</span>
                    <button
                      onClick={() => copyToClipboard(transactionHash)}
                      className="text-xs bg-white px-2 py-1 rounded hover:bg-gray-50 transition flex items-center gap-1"
                    >
                      {copying ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-xs break-all text-gray-800">
                    {transactionHash}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};