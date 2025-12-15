import React from 'react';

interface NextSessionDetailsProps {
  summary: string[];
}

const NextSessionDetails: React.FC<NextSessionDetailsProps> = ({ summary }) => {
  return (
    <div className="p-6">
      <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Planned Agenda</h4>
      <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
        {summary.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default NextSessionDetails;

