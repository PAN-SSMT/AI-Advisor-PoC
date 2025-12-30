import React from 'react';
import { NewWindowIcon } from './icons';
import CircularProgress from './CircularProgress';
import { Recommendation, RecommendationStatus } from '../types';

interface ProgressIndicatorsWidgetProps {
  onOpenDeploymentModal: () => void;
  onOpenScaleOptimizeModal: () => void;
  recommendations: Recommendation[];
}

const ProgressIndicatorsWidget: React.FC<ProgressIndicatorsWidgetProps> = ({
  onOpenDeploymentModal,
  onOpenScaleOptimizeModal,
  recommendations,
}) => {
  // Calculate total deployment and scale & optimize percentages from implemented actions
  const implementedActions = recommendations.filter(rec => rec.status === RecommendationStatus.Approved);
  
  const totalDeploymentIncrease = implementedActions.reduce((sum, rec) => {
    return sum + (rec.deploymentIncrease || 0);
  }, 0);
  
  const totalScaleOptimizeIncrease = implementedActions.reduce((sum, rec) => {
    return sum + (rec.scaleOptimizeIncrease || 0);
  }, 0);
  return (
    <div className="bg-white dark:bg-gray-800 px-4 pt-4 pb-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full transition-colors duration-200">
      <div className="flex items-center justify-evenly gap-6 flex-1">
        {/* Deployment Dial */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-base font-semibold text-gray-800 dark:text-white">Deployment</h4>
            <button
              onClick={onOpenDeploymentModal}
              title="Open deployment details"
              className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Open deployment details"
            >
              <NewWindowIcon className="w-4 h-4" />
            </button>
          </div>
          <CircularProgress percentage={totalDeploymentIncrease} size={100} strokeWidth={9} textSize="text-lg" />
        </div>

        {/* Scale & Optimize Dial */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-base font-semibold text-gray-800 dark:text-white">Scale & Optimize</h4>
            <button
              onClick={onOpenScaleOptimizeModal}
              title="Open scale & optimize details"
              className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Open scale and optimize details"
            >
              <NewWindowIcon className="w-4 h-4" />
            </button>
          </div>
          <CircularProgress 
            percentage={totalScaleOptimizeIncrease} 
            size={100} 
            strokeWidth={9} 
            textSize="text-lg" 
            colorClassName="text-yellow-500"
          />
        </div>
      </div>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-2">Percentages indicate combined XSIAM and Cortex Cloud maturity</p>
    </div>
  );
};

export default ProgressIndicatorsWidget;

