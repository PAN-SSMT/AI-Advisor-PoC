import React from 'react';
import { NewWindowIcon } from './icons';
import CircularProgress from './CircularProgress';

interface ProgressIndicatorsWidgetProps {
  onOpenDeploymentModal: () => void;
  onOpenScaleOptimizeModal: () => void;
}

const ProgressIndicatorsWidget: React.FC<ProgressIndicatorsWidgetProps> = ({
  onOpenDeploymentModal,
  onOpenScaleOptimizeModal,
}) => {
  return (
    <div className="bg-white px-4 py-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-evenly gap-6 h-full">
      {/* Deployment Dial */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-base font-semibold text-gray-800">Deployment</h4>
          <button
            onClick={onOpenDeploymentModal}
            title="Open deployment details"
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open deployment details"
          >
            <NewWindowIcon className="w-4 h-4" />
          </button>
        </div>
        <CircularProgress percentage={68} size={100} strokeWidth={9} textSize="text-lg" />
      </div>

      {/* Scale & Optimize Dial */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-base font-semibold text-gray-800">Scale & Optimize</h4>
          <button
            onClick={onOpenScaleOptimizeModal}
            title="Open scale & optimize details"
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open scale and optimize details"
          >
            <NewWindowIcon className="w-4 h-4" />
          </button>
        </div>
        <CircularProgress 
          percentage={56} 
          size={100} 
          strokeWidth={9} 
          textSize="text-lg" 
          colorClassName="text-yellow-500"
        />
      </div>
    </div>
  );
};

export default ProgressIndicatorsWidget;

