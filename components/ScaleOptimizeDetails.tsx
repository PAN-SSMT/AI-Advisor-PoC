import React, { useState } from 'react';
import { PaloAltoIcon, WorkloadIcon, AssessmentIcon, RiskPathIcon } from './icons';

const cortexCloudSteps = [
  { 
    icon: <WorkloadIcon className="w-8 h-8" />, 
    title: <>Workload Consumption</>, 
    goal: 50, 
    actual: 62, 
    unit: '%' 
  },
  { 
    icon: <AssessmentIcon className="w-8 h-8" />, 
    title: <>Assessment Profiles</>, 
    goal: 5, 
    actual: 4, 
    unit: '' 
  },
  { 
    icon: <RiskPathIcon className="w-8 h-8" />, 
    title: <>Reduction in Critical Risk <br />Attack Paths Over 6 Months</>, 
    goal: 25, 
    actual: 29, 
    unit: '%' 
  },
];

const xsiamSteps = [
  { 
    icon: <WorkloadIcon className="w-8 h-8" />, 
    title: <>Alert Volume Reduction</>, 
    goal: 40, 
    actual: 52, 
    unit: '%' 
  },
  { 
    icon: <AssessmentIcon className="w-8 h-8" />, 
    title: <>Automated Playbooks</>, 
    goal: 15, 
    actual: 18, 
    unit: '' 
  },
  { 
    icon: <RiskPathIcon className="w-8 h-8" />, 
    title: <>Mean Time to Respond<br />Improvement Over 6 Months</>, 
    goal: 30, 
    actual: 35, 
    unit: '%' 
  },
];

type TabType = 'cortex-cloud' | 'xsiam';

const ScaleOptimizeDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('xsiam');

  const currentSteps = activeTab === 'cortex-cloud' ? cortexCloudSteps : xsiamSteps;
  const tabTitle = activeTab === 'cortex-cloud' ? 'Cortex Cloud Scale & Optimize' : 'XSIAM Scale & Optimize';
  const accentColor = 'border-green-500';

  return (
    <div className="p-6 md:p-8">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('xsiam')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'xsiam'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          XSIAM
        </button>
        <button
          onClick={() => setActiveTab('cortex-cloud')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'cortex-cloud'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Cortex Cloud
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{tabTitle}</h1>
      <hr className={`mb-8 ${accentColor} border-2 w-24`} />
      
      <div className="space-y-8">
        {currentSteps.map((step, index) => (
          <div key={index} className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <PaloAltoIcon id={`${activeTab}-scale-step-${index}`} className="w-20 h-20">
                {step.icon}
              </PaloAltoIcon>
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 leading-tight">{step.title}</p>
            </div>
            <div className="flex-shrink-0 flex gap-8 text-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Goal</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{step.goal}{step.unit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Actual</p>
                <p className={`text-2xl font-bold mt-1 ${step.actual >= step.goal ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {step.actual}{step.unit}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScaleOptimizeDetails;