import React from 'react';
import { Recommendation, RecommendationStatus } from '../types';
import RecommendationCard from './RecommendationCard';
import { LoadingSpinner, NewWindowIcon } from './icons';

interface RecommendedActionsWidgetProps {
  recommendations: Recommendation[];
  isLoadingRecs: boolean;
  onUpdateStatus: (id: string, status: RecommendationStatus) => void;
  isPopupWindow?: boolean;
  setPopupWindow?: (win: Window | null) => void;
  setPopupViewMode?: (mode: 'pending' | 'implemented') => void;
  viewMode?: 'all' | 'pending' | 'implemented';
}

const RecommendedActionsWidget: React.FC<RecommendedActionsWidgetProps> = ({
  recommendations,
  isLoadingRecs,
  onUpdateStatus,
  isPopupWindow = false,
  setPopupWindow,
  setPopupViewMode,
  viewMode = 'all',
}) => {

  const handleOpenInNewWindow = (mode: 'pending' | 'implemented') => {
    if (setPopupWindow && setPopupViewMode) {
      const title = mode === 'pending' ? 'Action Items' : 'Implemented Actions';
      const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>${title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'Inter', sans-serif;
              }
            </style>
          </head>
          <body class="bg-gray-50 text-gray-800 h-screen flex flex-col">
            <div id="root" class="flex-1 flex flex-col p-4 overflow-hidden"></div>
          </body>
          </html>
        `);

        newWindow.document.close();

        setPopupWindow(newWindow);
        setPopupViewMode(mode);
        
        newWindow.addEventListener('beforeunload', () => {
          setPopupWindow(null);
        });
      }
    }
  };

  const pendingRecommendations = recommendations.filter(rec => rec.status !== RecommendationStatus.Approved);
  const implementedRecommendations = recommendations.filter(rec => rec.status === RecommendationStatus.Approved);

  const renderActionItems = (fullWidth: boolean) => (
      <div className={`flex flex-col min-h-0 border-gray-200 ${fullWidth ? 'w-full' : 'w-full lg:w-[60%] border-b lg:border-b-0 lg:border-r'}`}>
          {(viewMode === 'all' || isPopupWindow) && (
            <div className="p-4 pb-2 bg-gray-50 border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Action Items</h4>
                {!isPopupWindow && setPopupWindow && (
                  <button
                      onClick={() => handleOpenInNewWindow('pending')}
                      title="Open Action Items in new window"
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Open action items in a new window"
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
           {(viewMode === 'all' || isPopupWindow) && (
             <div className="p-4 pb-2 bg-gray-50 border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
                 <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Implemented Actions
                 </h4>
                 {!isPopupWindow && setPopupWindow && (
                  <button
                      onClick={() => handleOpenInNewWindow('implemented')}
                      title="Open Implemented Actions in new window"
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Open implemented actions in a new window"
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
                          compact={!isPopupWindow}
                      />
                  ))
              )}
          </div>
      </div>
  );

  return (
    <section className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-0 overflow-hidden">
      {/* Widget Header - Hidden in Popup to prevent duplicate title with Window/Section headers */}
      {!isPopupWindow && (
        <div className="p-6 pb-2 flex justify-between items-center flex-shrink-0 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            {viewMode === 'pending' ? 'Action Items' : viewMode === 'implemented' ? 'Implemented Actions' : 'Recommended Actions'}
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