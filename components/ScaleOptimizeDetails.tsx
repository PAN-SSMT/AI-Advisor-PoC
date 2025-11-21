import React from 'react';
import { PaloAltoIcon, WorkloadIcon, AssessmentIcon, RiskPathIcon } from './icons';

const details = [
  'S&O check-in frequency',
  'S&O metrics met?',
  'S&O work done over the last quarter',
  'S&O on-going projects',
  'S&O future plans'
];

const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: React.ReactNode;
  category: string;
}> = ({ icon, title, category }) => (
    <div className="flex flex-col items-center text-center flex-1 p-4">
        {icon}
        <h4 className="text-lg font-bold text-gray-900 mt-3 mb-2 h-16 flex items-center justify-center">{title}</h4>
        <p className="text-base font-bold tracking-wider text-green-600 mb-4">{category}</p>
    </div>
);

const ScaleOptimizeDetails: React.FC = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Scale & Optimize Definitions</h1>
        <hr className="mb-8 border-yellow-500 border-2 w-24" />
        
        <div className="mb-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-around items-start">
                 <MetricCard 
                    icon={<PaloAltoIcon id="workload-icon"><WorkloadIcon className="w-10 h-10" /></PaloAltoIcon>}
                    title="Workload Consumption"
                    category="VISIBILITY"
                />
                <MetricCard 
                    icon={<PaloAltoIcon id="assessment-icon"><AssessmentIcon className="w-10 h-10" /></PaloAltoIcon>}
                    title="Assessment Profiles"
                    category="DETECTION"
                />
                <MetricCard 
                    icon={<PaloAltoIcon id="risk-icon"><RiskPathIcon className="w-10 h-10" /></PaloAltoIcon>}
                    title={<span>Reduction in Critical<br />Risk Attack Paths<br />Over 6 Months</span>}
                    category="REMEDIATION"
                />
            </div>
            <hr className="border-t border-green-300 my-6" />
            <div className="flex flex-col md:flex-row justify-around items-center text-center">
                <div className="flex-1 py-4 md:py-0"><p className="text-7xl font-bold text-green-600">50%</p></div>
                <div className="w-px bg-green-300 self-stretch mx-4 hidden md:block"></div>
                <div className="w-full h-px bg-green-300 my-4 md:hidden"></div>
                <div className="flex-1 py-4 md:py-0"><p className="text-7xl font-bold text-green-600">5</p></div>
                <div className="w-px bg-green-300 self-stretch mx-4 hidden md:block"></div>
                <div className="w-full h-px bg-green-300 my-4 md:hidden"></div>
                <div className="flex-1 py-4 md:py-0"><p className="text-7xl font-bold text-green-600">25%</p></div>
            </div>
        </div>
        
        <div className="space-y-4">
          {details.map((text, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-800 font-medium">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScaleOptimizeDetails;
