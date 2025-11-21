import React from 'react';
import { PaloAltoIcon, TargetIcon, InfrastructureIcon, MagnifyingGlassIcon, ComplianceProfileIcon, CaseAssignedIcon } from './icons';

const deploymentSteps = [
  { icon: <MagnifyingGlassIcon className="w-8 h-8" />, title: <>Cloud Service<br/>Provider Connected</>},
  { icon: <InfrastructureIcon className="w-8 h-8" />, title: <>Custom Posture Rule<br/>& Vulnerability Policy Created</>},
  { icon: <ComplianceProfileIcon className="w-8 h-8" />, title: <>Compliance<br/>Assessment Profile</>},
  { icon: <CaseAssignedIcon className="w-8 h-8" />, title: <>Case Assigned</>},
  { icon: <TargetIcon className="w-8 h-8" />, title: <>Issue or Case<br/>Resolved</>},
];


const DeploymentDetails: React.FC = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Cortex Cloud Deployment Definitions</h1>
        <hr className="mb-8 border-green-500 border-2 w-24" />
        
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <div className="flex justify-between items-start text-center relative z-10">
                {deploymentSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <PaloAltoIcon id={`step-${index}`} className="w-20 h-20 mb-2">
                            {step.icon}
                        </PaloAltoIcon>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-cyan-400 to-green-400 rounded-lg flex -mt-10 pt-12 pb-4 text-white text-center relative">
                {/* Dividers */}
                <div className="absolute top-0 bottom-0 left-1/5 w-px bg-white/50 transform"></div>
                <div className="absolute top-0 bottom-0 left-2/5 w-px bg-white/50 transform"></div>
                <div className="absolute top-0 bottom-0 left-3/5 w-px bg-white/50 transform"></div>
                <div className="absolute top-0 bottom-0 left-4/5 w-px bg-white/50 transform"></div>

                {deploymentSteps.map((step, index) => (
                    <div key={index} className="flex-1 px-2 h-16 flex items-center justify-center">
                        <p className="font-semibold text-sm leading-tight">{step.title}</p>
                    </div>
                ))}
            </div>
          
            <div className="flex mt-8 border-t-2 border-green-300 pt-4">
                <div className="flex-1 text-center font-bold tracking-wider text-green-600">VISIBILITY</div>
                <div className="flex-1 text-center font-bold tracking-wider text-green-600 border-l-2 border-green-300">DETECTION</div>
                <div className="flex-1 text-center font-bold tracking-wider text-green-600 border-l-2 border-green-300">REMEDIATION</div>
            </div>
          
            <div className="flex flex-col md:flex-row justify-around items-center mt-8">
              <div className="flex-1 py-4 md:py-0 text-center">
                  <p className="text-7xl font-bold text-green-600">20%</p>
                  <p className="text-base font-semibold text-gray-500 mt-2 tracking-wide uppercase">Posture Workload Consumption</p>
              </div>
              <div className="w-full h-px bg-gray-200 my-4 md:hidden"></div>
              <div className="flex-1 py-4 md:py-0 text-center">
                  <p className="text-7xl font-bold text-green-600">20%</p>
                  <p className="text-base font-semibold text-gray-500 mt-2 tracking-wide uppercase">Runtime Workload Consumption</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentDetails;