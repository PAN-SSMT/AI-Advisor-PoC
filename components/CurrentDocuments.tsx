import React from 'react';
import { DocumentIcon, ChevronRightIcon } from './icons';

const docs = [
    { name: "Prisma Cloud Admin Guide v24.1.pdf", date: "2024-07-10", size: "4.2 MB" },
    { name: "Cortex XDR Best Practices.docx", date: "2024-06-22", size: "1.8 MB" },
    { name: "Q2 Security Audit Report.pdf", date: "2024-06-30", size: "2.5 MB" },
    { name: "Cloud Compliance Framework.xlsx", date: "2024-05-15", size: "0.9 MB" },
    { name: "Network Topology - AWS Prod.vsd", date: "2024-04-01", size: "3.1 MB" }
];

const CurrentDocuments: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400 mb-6">Files currently indexed and available to the AI Advisor.</p>
        <div className="bg-white dark:bg-gray-900 overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {docs.map(doc => (
                    <li key={doc.name} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition duration-150 ease-in-out cursor-pointer">
                        <div className="flex items-center min-w-0 flex-1">
                            <div className="flex-shrink-0">
                                <DocumentIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">{doc.name}</p>
                                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <span className="truncate">{doc.size}</span>
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <div>
                                        <p className="text-sm text-gray-900 dark:text-gray-200">Uploaded on <time dateTime={doc.date}>{doc.date}</time></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default CurrentDocuments;
