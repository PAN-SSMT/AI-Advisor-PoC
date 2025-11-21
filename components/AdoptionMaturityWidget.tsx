import React from 'react';
import CircularProgress from './CircularProgress';
import { NewWindowIcon } from './icons';

interface AdoptionMaturityWidgetProps {
    setPopupWindow: (win: Window | null) => void;
}

const AdoptionMaturityWidget: React.FC<AdoptionMaturityWidgetProps> = ({ setPopupWindow }) => {
    
    const handleOpenInNewWindow = () => {
        if (setPopupWindow) {
            const newWindow = window.open('', '_blank', 'width=1024,height=768,scrollbars=yes,resizable=yes');
            if (newWindow) {
                newWindow.document.write(`
                  <!DOCTYPE html>
                  <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Deployment Details</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                      body {
                        font-family: 'Inter', sans-serif;
                      }
                    </style>
                  </head>
                  <body class="bg-gray-50 text-gray-800">
                    <div id="root"></div>
                  </body>
                  </html>
                `);
                
                newWindow.document.close();
                setPopupWindow(newWindow);
                
                newWindow.addEventListener('beforeunload', () => {
                  setPopupWindow(null);
                });
            }
        }
    };

    return (
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-800">
                    Deployment
                </h3>
                <button
                    onClick={handleOpenInNewWindow}
                    title="Open deployment details"
                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Open deployment details in a new window"
                >
                    <NewWindowIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-grow flex items-center justify-center">
                <CircularProgress percentage={68} size={80} strokeWidth={8} textSize="text-xl" />
            </div>
        </div>
    );
};

export default AdoptionMaturityWidget;