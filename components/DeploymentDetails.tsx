import React, { useState } from 'react';
import { PaloAltoIcon, TargetIcon, InfrastructureIcon, MagnifyingGlassIcon, ComplianceProfileIcon, CaseAssignedIcon } from './icons';

const cortexCloudSteps = [
  { icon: <MagnifyingGlassIcon className="w-8 h-8" />, title: <>Cloud Service<br/>Provider Connected</>, goal: 3, actual: 2 },
  { icon: <InfrastructureIcon className="w-8 h-8" />, title: <>Custom Posture Rule<br/>& Vulnerability Policy Created</>, goal: 10, actual: 12 },
  { icon: <ComplianceProfileIcon className="w-8 h-8" />, title: <>Compliance<br/>Assessment Profile</>, goal: 5, actual: 3 },
  { icon: <CaseAssignedIcon className="w-8 h-8" />, title: <>Case Assigned</>, goal: 5, actual: 5 },
  { icon: <TargetIcon className="w-8 h-8" />, title: <>Issue or Case<br/>Resolved</>, goal: 5, actual: 5 },
];

const xsiamSteps = [
  { icon: <MagnifyingGlassIcon className="w-8 h-8" />, title: <>Data Sources<br/>Integrated</>, goal: 8, actual: 6 },
  { icon: <InfrastructureIcon className="w-8 h-8" />, title: <>Detection Rules<br/>Configured</>, goal: 25, actual: 28 },
  { icon: <ComplianceProfileIcon className="w-8 h-8" />, title: <>Playbooks<br/>Deployed</>, goal: 12, actual: 10 },
  { icon: <CaseAssignedIcon className="w-8 h-8" />, title: <>Analysts<br/>Onboarded</>, goal: 6, actual: 6 },
  { icon: <TargetIcon className="w-8 h-8" />, title: <>Incidents<br/>Resolved</>, goal: 50, actual: 62 },
];

type TabType = 'cortex-cloud' | 'xsiam';

const DeploymentDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('xsiam');

  const currentSteps = activeTab === 'cortex-cloud' ? cortexCloudSteps : xsiamSteps;
  const tabTitle = activeTab === 'cortex-cloud' ? 'Cortex Cloud Deployment' : 'XSIAM Deployment';
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
              <PaloAltoIcon id={`${activeTab}-step-${index}`} className="w-20 h-20">
                {step.icon}
              </PaloAltoIcon>
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 leading-tight">{step.title}</p>
            </div>
            <div className="flex-shrink-0 flex gap-8 text-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Goal</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{step.goal}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Actual</p>
                <p className={`text-2xl font-bold mt-1 ${step.actual >= step.goal ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {step.actual}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentDetails;