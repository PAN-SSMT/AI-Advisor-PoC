import React from 'react';

interface LastSessionDetailsProps {
  summary: string[];
}

const LastSessionDetails: React.FC<LastSessionDetailsProps> = ({ summary }) => {
  return (
    <div className="p-6">
      <h4 className="font-medium text-gray-500 mb-2">Session Summary</h4>
      <ul className="text-gray-600 list-disc list-inside space-y-1">
        {summary.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default LastSessionDetails;

