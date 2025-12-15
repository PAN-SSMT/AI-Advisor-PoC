import React from 'react';
import { PaloAltoIcon, WorkloadIcon, AssessmentIcon, RiskPathIcon } from './icons';

const scaleOptimizeSteps = [
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

const ScaleOptimizeDetails: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Scale & Optimize</h1>
      <hr className="mb-8 border-yellow-500 border-2 w-24" />
      
      <div className="space-y-8">
        {scaleOptimizeSteps.map((step, index) => (
          <div key={index} className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <PaloAltoIcon id={`scale-step-${index}`} className="w-20 h-20">
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