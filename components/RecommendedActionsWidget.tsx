import React from 'react';
import { Recommendation, RecommendationStatus } from '../types';
import RecommendationCard from './RecommendationCard';
import { LoadingSpinner, NewWindowIcon } from './icons';

interface RecommendedActionsWidgetProps {
  recommendations: Recommendation[];
  isLoadingRecs: boolean;
  onUpdateStatus: (id: string, status: RecommendationStatus) => void;
  onOpenPendingModal?: () => void;
  onOpenImplementedModal?: () => void;
  viewMode?: 'all' | 'pending' | 'implemented';
}

const RecommendedActionsWidget: React.FC<RecommendedActionsWidgetProps> = ({
  recommendations,
  isLoadingRecs,
  onUpdateStatus,
  onOpenPendingModal,
  onOpenImplementedModal,
  viewMode = 'all',
}) => {

  const pendingRecommendations = recommendations.filter(rec => rec.status !== RecommendationStatus.Approved);
  const implementedRecommendations = recommendations.filter(rec => rec.status === RecommendationStatus.Approved);

  const renderActionItems = (fullWidth: boolean) => (
      <div className={`flex flex-col min-h-0 border-gray-200 ${fullWidth ? 'w-full' : 'w-full lg:w-[60%] border-b lg:border-b-0 lg:border-r'}`}>
          {viewMode === 'all' && (
            <div className="p-4 pb-2 bg-gray-50 border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Action Items</h4>
                {onOpenPendingModal && (
                  <button
                      onClick={onOpenPendingModal}
                      title="View all action items"
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="View all action items"
                  >
                      <NewWindowIcon className="w-4 h-4" />
                  </button>
                )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {pendingRecommendations.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                      <p>No pending recommendations.</p>
                  </div>
              ) : (
                  pendingRecommendations.map(rec => (
                      <RecommendationCard key={rec.id} recommendation={rec} onUpdateStatus={onUpdateStatus} />
                  ))
              )}
          </div>
      </div>
  );

  const renderImplementedItems = (fullWidth: boolean) => (
      <div className={`flex flex-col min-h-0 bg-gray-50/30 ${fullWidth ? 'w-full' : 'flex-1'}`}>
           {viewMode === 'all' && (
             <div className="p-4 pb-2 bg-gray-50 border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
                 <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Implemented Actions
                 </h4>
                 {onOpenImplementedModal && (
                  <button
                      onClick={onOpenImplementedModal}
                      title="View all implemented actions"
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="View all implemented actions"
                  >
                      <NewWindowIcon className="w-4 h-4" />
                  </button>
                 )}
            </div>
           )}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {implementedRecommendations.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">
                      <p>No actions implemented yet.</p>
                  </div>
              ) : (
                  implementedRecommendations.map(rec => (
                      <RecommendationCard 
                          key={rec.id} 
                          recommendation={rec} 
                          onUpdateStatus={onUpdateStatus} 
                          isReadOnly={true} 
                          compact={viewMode === 'all'}
                      />
                  ))
              )}
          </div>
      </div>
  );

  return (
    <section className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-0 overflow-hidden">
      {/* Widget Header - Hidden in modal views */}
      {viewMode === 'all' && (
        <div className="p-6 pb-2 flex justify-between items-center flex-shrink-0 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Recommended Actions
          </h3>
        </div>
      )}

      {isLoadingRecs ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <LoadingSpinner className="w-8 h-8 text-blue-500" />
          <span className="ml-3 text-gray-500">Generating Recommendations...</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {(viewMode === 'all' || viewMode === 'pending') && renderActionItems(viewMode === 'pending')}
            {(viewMode === 'all' || viewMode === 'implemented') && renderImplementedItems(viewMode === 'implemented')}
        </div>
      )}
    </section>
  );
};

export default RecommendedActionsWidget;