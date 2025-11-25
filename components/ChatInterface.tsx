import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { BotIcon, UserIcon, SendIcon, LoadingSpinner, UploadIcon, GoogleDriveIcon, DropboxIcon, SharePointIcon, ComputerDesktopIcon, DocumentIcon, ChevronRightIcon, ChevronLeftIcon } from './icons';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onOpenCurrentDocuments: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, onOpenCurrentDocuments }) => {
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

  const handleOpenCurrentDocuments = () => {
    onOpenCurrentDocuments();
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
                    <button onClick={handleOpenCurrentDocuments} className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
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
