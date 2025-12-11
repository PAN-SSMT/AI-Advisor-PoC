import React from 'react';

const LicenseConsumptionDetails: React.FC = () => {
  const licenses = [
    {
      name: 'Prisma Cloud Enterprise',
      allocated: 1000,
      consumed: 756,
      unit: 'credits',
    },
    {
      name: 'Cortex XDR Pro',
      allocated: 500,
      consumed: 423,
      unit: 'endpoints',
    },
    {
      name: 'Cloud Workload Protection',
      allocated: 200,
      consumed: 187,
      unit: 'workloads',
    },
    {
      name: 'Web Application Firewall',
      allocated: 50,
      consumed: 32,
      unit: 'applications',
    },
  ];

  const getUsagePercentage = (consumed: number, allocated: number) => {
    return Math.round((consumed / allocated) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="px-10 py-4">
      <div className="space-y-4">
        {licenses.map((license) => {
          const percentage = getUsagePercentage(license.consumed, license.allocated);
          return (
            <div key={license.name} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-800">{license.name}</h4>
                <span className="text-sm text-gray-600">
                  {license.consumed.toLocaleString()} / {license.allocated.toLocaleString()} {license.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getUsageColor(percentage)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">{percentage}% utilized</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LicenseConsumptionDetails;

