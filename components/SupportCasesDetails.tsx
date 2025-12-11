import React from 'react';

const SupportCasesDetails: React.FC = () => {
  const supportCases = [
    {
      id: 'CASE-001',
      title: 'Cloud account onboarding issue',
      status: 'Open',
      priority: 'High',
      created: '2024-07-10',
      lastUpdated: '2024-07-14',
    },
    {
      id: 'CASE-002',
      title: 'Policy configuration assistance',
      status: 'In Progress',
      priority: 'Medium',
      created: '2024-07-08',
      lastUpdated: '2024-07-12',
    },
    {
      id: 'CASE-003',
      title: 'Integration with SIEM platform',
      status: 'Resolved',
      priority: 'Low',
      created: '2024-06-25',
      lastUpdated: '2024-07-05',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div>
      <div className="divide-y divide-gray-200">
        {supportCases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="py-4 px-10 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs text-gray-500 font-mono">{caseItem.id}</span>
                <h4 className="font-medium text-gray-800">{caseItem.title}</h4>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(caseItem.status)}`}>
                {caseItem.status}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>Priority: <span className={`font-medium ${getPriorityColor(caseItem.priority)}`}>{caseItem.priority}</span></span>
              <span>Created: {caseItem.created}</span>
              <span>Updated: {caseItem.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportCasesDetails;

