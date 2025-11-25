import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { BotIcon, UserIcon, SendIcon, LoadingSpinner, UploadIcon, GoogleDriveIcon, DropboxIcon, SharePointIcon, ComputerDesktopIcon, DocumentIcon, ChevronRightIcon, ChevronLeftIcon } from './icons';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'upload'>('main');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      // Reset menu view when closed
      setTimeout(() => setMenuView('main'), 200);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleUploadOptionClick = () => {
    // In a real app, this would trigger the corresponding file picker.
    console.log("Upload option clicked");
    setIsDropdownOpen(false);
  };

  const openCurrentDocumentsWindow = () => {
    const newWindow = window.open('', '_blank', 'width=600,height=600,scrollbars=yes,resizable=yes');
    if (newWindow) {
        const docs = [
            { name: "Prisma Cloud Admin Guide v24.1.pdf", date: "2024-07-10", size: "4.2 MB" },
            { name: "Cortex XDR Best Practices.docx", date: "2024-06-22", size: "1.8 MB" },
            { name: "Q2 Security Audit Report.pdf", date: "2024-06-30", size: "2.5 MB" },
            { name: "Cloud Compliance Framework.xlsx", date: "2024-05-15", size: "0.9 MB" },
            { name: "Network Topology - AWS Prod.vsd", date: "2024-04-01", size: "3.1 MB" }
        ];

        const listItems = docs.map(doc => `
            <li class="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between transition duration-150 ease-in-out">
                <div class="flex items-center min-w-0 flex-1">
                    <div class="flex-shrink-0">
                        <svg class="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </div>
                    <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                            <p class="text-sm font-medium text-blue-600 truncate">${doc.name}</p>
                            <p class="flex items-center text-sm text-gray-500">
                                <span class="truncate">${doc.size}</span>
                            </p>
                        </div>
                        <div class="hidden md:block">
                            <div>
                                <p class="text-sm text-gray-900">Uploaded on <time datetime="${doc.date}">${doc.date}</time></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                </div>
            </li>
        `).join('');

        newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <title>Current System Documents</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                <style>body { font-family: 'Inter', sans-serif; }</style>
            </head>
            <body class="bg-gray-50">
                <div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">Support Documents</h1>
                            <p class="mt-1 text-sm text-gray-500">Files currently indexed and available to the AI Advisor.</p>
                        </div>
                        <button onclick="window.close()" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                            Close
                        </button>
                    </div>
                    <div class="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul role="list" class="divide-y divide-gray-200">
                            ${listItems}
                        </ul>
                    </div>
                </div>
            </body>
            </html>
        `);
        newWindow.document.close();
    }
    setIsDropdownOpen(false);
  };

  return (
    <aside className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
      <div className="p-4 border-b border-gray-200 flex-shrink-0 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">NOVA Advisor</h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-100 text-blue-800 border border-blue-800 font-semibold rounded-md shadow-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <DocumentIcon className="w-4 h-4" />
            <span>Support Documents</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              {menuView === 'main' ? (
                <div className="py-1">
                    <button onClick={openCurrentDocumentsWindow} className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        <div className="flex items-center gap-3">
                            <DocumentIcon className="w-5 h-5 text-gray-500" />
                            <span>Current Documents</span>
                        </div>
                    </button>
                    <button onClick={() => setMenuView('upload')} className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        <div className="flex items-center gap-3">
                            <UploadIcon className="w-5 h-5 text-gray-500" />
                            <span>Upload Documents</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
              ) : (
                <div className="py-1">
                  <button onClick={() => setMenuView('main')} className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 border-b border-gray-100" role="menuitem">
                    <ChevronLeftIcon className="w-3 h-3" />
                    <span>Back</span>
                  </button>
                  <button onClick={handleUploadOptionClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <GoogleDriveIcon className="w-5 h-5 text-gray-500" />
                    <span>Google Drive</span>
                  </button>
                  <button onClick={handleUploadOptionClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <DropboxIcon className="w-5 h-5 text-gray-500" />
                    <span>Dropbox</span>
                  </button>
                  <button onClick={handleUploadOptionClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <SharePointIcon className="w-5 h-5 text-gray-500" />
                    <span>SharePoint</span>
                  </button>
                  <button onClick={handleUploadOptionClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <ComputerDesktopIcon className="w-5 h-5 text-gray-500" />
                    <span>Upload from computer</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'model' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-gray-600" /></div>}
            
            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {message.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>

            {message.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><UserIcon className="w-5 h-5 text-blue-600" /></div>}
          </div>
        ))}
        {isLoading && messages[messages.length-1].role === 'user' && (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-gray-600" /></div>
                <div className="max-w-xs md:max-w-md px-4 py-2 rounded-xl bg-gray-100 text-gray-800">
                    <LoadingSpinner className="w-5 h-5 text-gray-500" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </aside>
  );
};

export default ChatInterface;