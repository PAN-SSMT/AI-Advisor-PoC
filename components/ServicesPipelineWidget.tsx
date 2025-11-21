import React from 'react';
import { CalendarIcon, CreditCardIcon, MailIcon, UserIcon, NewWindowIcon } from './icons';

interface EECredits {
  bought: number;
  used: number;
  planned: number;
  available: number;
}

interface ServicesPipelineWidgetProps {
  lastSession: {
    date: string;
    summary: string;
  };
  nextSession: {
    date: string;
    summary: string[];
  };
  eeCredits: EECredits;
  supportContacts: {
    role: string;
    name: string;
    email: string;
  }[];
  setPopupWindow: (win: Window | null) => void;
}

const ServicesPipelineWidget: React.FC<ServicesPipelineWidgetProps> = ({
  lastSession,
  nextSession,
  eeCredits,
  supportContacts,
  setPopupWindow,
}) => {
  const handleOpenInNewWindow = () => {
    if (setPopupWindow) {
        const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        if (newWindow) {
            newWindow.document.write(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Clarizen Information</title>
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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Services Pipeline</h3>
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.8fr_1.1fr] gap-x-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-y-4">
          {/* Last Session */}
          <div>
            <div className="flex items-center">
              <h4 className="font-medium text-gray-500">Last Session</h4>
              <div className="flex items-center gap-2 text-gray-700 font-medium ml-4">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span>{lastSession.date}</span>
              </div>
            </div>
            <ul className="text-gray-600 mt-1 list-disc list-inside space-y-1 text-xs">
              <li>{lastSession.summary}</li>
            </ul>
          </div>

          {/* Next Session */}
          <div>
            <div className="flex items-center">
              <h4 className="font-medium text-gray-500">Next Session</h4>
              <div className="flex items-center gap-2 text-gray-700 font-medium ml-4">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span>{nextSession.date}</span>
              </div>
            </div>
            <ul className="text-gray-600 mt-1 list-disc list-inside space-y-1 text-xs">
              {nextSession.summary.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-y-4 md:px-6 md:border-l md:border-r md:border-gray-200 mt-4 md:mt-0 py-4 md:py-0">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <CreditCardIcon className="w-4 h-4 text-gray-400" />
                        <h4 className="font-medium text-gray-500">EE Credits</h4>
                    </div>
                    <button
                        onClick={handleOpenInNewWindow}
                        title="Open Clarizen Information"
                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors relative bottom-1"
                        aria-label="Open Clarizen information in a new window"
                    >
                        <NewWindowIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between items-center text-xs">
                        <span>Bought</span>
                        <span className="font-semibold text-gray-800">{eeCredits.bought.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span>Used</span>
                        <span className="font-semibold text-gray-800">{eeCredits.used.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span>Planned</span>
                        <span className="font-semibold text-gray-800">{eeCredits.planned.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span>Available</span>
                        <span className="font-semibold text-gray-800">{eeCredits.available.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>


        {/* Right Column */}
        <div className="flex flex-col gap-y-4 md:pl-6 mt-4 md:mt-0">
          {/* Contacts */}
          <div>
            <h4 className="font-medium text-gray-500 mb-2">Assigned Support</h4>
            <div className="space-y-2">
              {supportContacts.map(contact => (
                <div key={contact.role} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">{contact.name}</span>
                      <span className="text-gray-500 text-xs"> ({contact.role})</span>
                    </div>
                  </div>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-blue-600 hover:underline truncate text-xs">
                    <MailIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span>{contact.email}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServicesPipelineWidget;