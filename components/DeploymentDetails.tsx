import React from 'react';
import { PaloAltoIcon, TargetIcon, InfrastructureIcon, MagnifyingGlassIcon, ComplianceProfileIcon, CaseAssignedIcon } from './icons';

const deploymentSteps = [
  { icon: <MagnifyingGlassIcon className="w-8 h-8" />, title: <>Cloud Service<br/>Provider Connected</>, goal: 3, actual: 2 },
  { icon: <InfrastructureIcon className="w-8 h-8" />, title: <>Custom Posture Rule<br/>& Vulnerability Policy Created</>, goal: 10, actual: 12 },
  { icon: <ComplianceProfileIcon className="w-8 h-8" />, title: <>Compliance<br/>Assessment Profile</>, goal: 5, actual: 3 },
  { icon: <CaseAssignedIcon className="w-8 h-8" />, title: <>Case Assigned</>, goal: 5, actual: 5 },
  { icon: <TargetIcon className="w-8 h-8" />, title: <>Issue or Case<br/>Resolved</>, goal: 5, actual: 5 },
];


const DeploymentDetails: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Cortex Cloud Deployment</h1>
      <hr className="mb-8 border-green-500 border-2 w-24" />
      
      <div className="space-y-8">
        {deploymentSteps.map((step, index) => (
          <div key={index} className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <PaloAltoIcon id={`step-${index}`} className="w-20 h-20">
                {step.icon}
              </PaloAltoIcon>
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-lg text-gray-800 leading-tight">{step.title}</p>
            </div>
            <div className="flex-shrink-0 flex gap-8 text-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Goal</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{step.goal}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Actual</p>
                <p className={`text-2xl font-bold mt-1 ${step.actual >= step.goal ? 'text-green-600' : 'text-red-600'}`}>
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