import React, { useState, useRef, useEffect } from 'react';
import { Recommendation, RecommendationStatus } from '../types';
import { ChevronDownIcon } from './icons';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onUpdateStatus: (id: string, status: RecommendationStatus) => void;
  isReadOnly?: boolean;
  compact?: boolean;
}

const riskStyles: Record<Recommendation['riskLevel'], string> = {
  'Critical': 'border-red-500 bg-red-50 dark:bg-red-900/30 text-gray-800 dark:text-gray-200',
  'High': 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-gray-800 dark:text-gray-200',
  'Medium': 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-gray-800 dark:text-gray-200',
  'Low': 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-gray-800 dark:text-gray-200',
};

const effortStyles: Record<Recommendation['effort'], string> = {
  'High': 'text-gray-800 dark:text-gray-200',
  'Medium': 'text-gray-800 dark:text-gray-200',
  'Low': 'text-gray-800 dark:text-gray-200',
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onUpdateStatus, isReadOnly = false, compact = false }) => {
  const isActionable = recommendation.status === RecommendationStatus.Pending;
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`rounded-lg border-l-4 shadow-sm transition-all duration-300 ${riskStyles[recommendation.riskLevel]} ${compact ? 'p-4' : 'p-4'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-baseline gap-4 flex-1">
          <h3 className={`text-lg font-bold text-gray-900 dark:text-white ${compact ? 'mb-0' : (recommendation.status === RecommendationStatus.Approved ? 'mb-0' : 'mb-2')}`}>{recommendation.title}</h3>
          {recommendation.status === RecommendationStatus.Approved && !compact && (
            <span className="text-sm font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
              {recommendation.implementedOn ? `Implemented on: ${recommendation.implementedOn}` : 'Implemented'}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-0 flex-shrink-0 ml-2 -mt-1">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${riskStyles[recommendation.riskLevel]}`}>
            {recommendation.riskLevel} Risk
          </span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${effortStyles[recommendation.effort]}`}>
            {recommendation.effort} Effort
          </span>
          {isActionable && !isReadOnly && !compact && (
            <div className="relative mt-1" ref={actionsRef}>
              <button 
                onClick={() => setIsActionsOpen(p => !p)} 
                className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <span className="text-sm">Actions</span>
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              {isActionsOpen && (
                <div className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-10">
                  <div className="py-1">
                    <button 
                      onClick={() => { 
                        onUpdateStatus(recommendation.id, RecommendationStatus.Rejected); 
                        setIsActionsOpen(false); 
                      }} 
                      className="w-full text-left block px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Will not Implement
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {!compact && (
        <>
          <div className="mt-1 w-full">
            <details className="mb-1">
              <summary className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Description</summary>
              <div className="mt-1 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Description</h4>
                <p className="mb-3 text-gray-600 dark:text-gray-400">{recommendation.description}</p>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Rationale</h4>
                <p className="text-gray-500 dark:text-gray-400">{recommendation.rationale}</p>
              </div>
            </details>
            <details>
              <summary className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                {recommendation.status === RecommendationStatus.Approved ? 'Implementation Notes' : 'Implementation Instructions'}
              </summary>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                <p className="whitespace-pre-wrap">{recommendation.implementationInstructions}</p>
              </div>
            </details>
          </div>

          <div className="mt-3 flex justify-between items-end">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Applicable Product: <span className="font-medium text-gray-800 dark:text-gray-200">{recommendation.applicableProduct || 'Cortex Cloud'}</span>
              </span>
            </div>

            <div className="text-right">
              {recommendation.status === RecommendationStatus.Rejected && (
                <span className="text-sm font-semibold text-red-600">Will not Implement</span>
              )}
              {recommendation.deploymentIncrease !== undefined && recommendation.scaleOptimizeIncrease !== undefined && (
                <div className="text-sm space-y-1">
                  <p className="text-black dark:text-gray-200">Deployment increase: <span className="font-semibold text-green-700 dark:text-green-400">{recommendation.deploymentIncrease}%</span></p>
                  <p className="text-black dark:text-gray-200">Scale & Optimize increase: <span className="font-semibold text-green-700 dark:text-green-400">{recommendation.scaleOptimizeIncrease}%</span></p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendationCard;