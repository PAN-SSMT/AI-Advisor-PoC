import React from 'react';
import { Recommendation, RecommendationStatus } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onUpdateStatus: (id: string, status: RecommendationStatus) => void;
  isReadOnly?: boolean;
  compact?: boolean;
}

const riskStyles: Record<Recommendation['riskLevel'], string> = {
  'Critical': 'border-red-500 bg-red-50 text-gray-800',
  'High': 'border-orange-500 bg-orange-50 text-gray-800',
  'Medium': 'border-yellow-500 bg-yellow-50 text-gray-800',
  'Low': 'border-blue-500 bg-blue-50 text-gray-800',
};

const effortStyles: Record<Recommendation['effort'], string> = {
  'High': 'text-gray-800',
  'Medium': 'text-gray-800',
  'Low': 'text-gray-800',
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onUpdateStatus, isReadOnly = false, compact = false }) => {
  const isActionable = recommendation.status === RecommendationStatus.Pending;

  return (
    <div className={`rounded-lg border-l-4 shadow-sm transition-all duration-300 ${riskStyles[recommendation.riskLevel]} ${compact ? 'p-4' : 'p-4'}`}>
      <div className="flex justify-between items-start">
        <h3 className={`text-lg font-bold text-gray-900 ${compact ? 'mb-0' : 'mb-2'}`}>{recommendation.title}</h3>
        <div className="flex flex-col items-end gap-0 flex-shrink-0 ml-2 -mt-1">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${riskStyles[recommendation.riskLevel]}`}>
            {recommendation.riskLevel} Risk
          </span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${effortStyles[recommendation.effort]}`}>
            {recommendation.effort} Effort
          </span>
        </div>
      </div>
      
      {!compact && (
        <>
          <div className="mt-1 w-full">
            <details className="mb-1">
              <summary className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">Show Description and Rationale</summary>
              <div className="mt-1 text-sm bg-gray-50 p-2 rounded-md">
                <h4 className="font-semibold text-gray-800 mb-1">Description</h4>
                <p className="mb-3 text-gray-600">{recommendation.description}</p>
                <h4 className="font-semibold text-gray-800 mb-1">Rationale</h4>
                <p className="text-gray-500">{recommendation.rationale}</p>
              </div>
            </details>
            <details>
              <summary className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                {recommendation.status === RecommendationStatus.Approved ? 'Show Implementation Notes' : 'Show Implementation Instructions'}
              </summary>
              <div className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                <p className="whitespace-pre-wrap">{recommendation.implementationInstructions}</p>
              </div>
            </details>
          </div>

          <div className="mt-3 flex justify-between items-end">
            <div>
              {isActionable && !isReadOnly && (
                <button
                  onClick={() => onUpdateStatus(recommendation.id, RecommendationStatus.Rejected)}
                  className="px-3 py-1 text-[10px] font-medium text-red-800 bg-red-100 border border-red-800 rounded-md shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Will not Implement
                </button>
              )}
            </div>

            <div className="text-right">
              {recommendation.status === RecommendationStatus.Approved && (
                <span className="text-sm font-semibold text-green-600">
                  {recommendation.implementedOn ? `Implemented on: ${recommendation.implementedOn}` : 'Implemented'}
                </span>
              )}
              {recommendation.status === RecommendationStatus.Rejected && (
                <span className="text-sm font-semibold text-red-600">Will not Implement</span>
              )}
              {isActionable && !isReadOnly && (
                <div className="text-sm text-black space-y-1">
                  <p>Deployment increase: <span className="font-semibold text-green-700">2%</span></p>
                  <p>Scale & Optimize increase: <span className="font-semibold text-green-700">3%</span></p>
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
