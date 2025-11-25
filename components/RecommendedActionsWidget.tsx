import React, { useState, useRef, useEffect } from 'react';
import { Recommendation, RecommendationStatus } from '../types';
import RecommendationCard from './RecommendationCard';
import { LoadingSpinner, NewWindowIcon, ChevronDownIcon } from './icons';

interface RecommendedActionsWidgetProps {
  recommendations: Recommendation[];
  isLoadingRecs: boolean;
  onUpdateStatus: (id: string, status: RecommendationStatus) => void;
  onOpenPendingModal?: () => void;
  onOpenImplementedModal?: () => void;
  viewMode?: 'all' | 'pending' | 'implemented';
  isPopupWindow?: boolean;
}

type SortByType = 'risk' | 'effort' | 'default';

const riskOrder: Record<Recommendation['riskLevel'], number> = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
const effortOrder: Record<Recommendation['effort'], number> = { 'High': 3, 'Medium': 2, 'Low': 1 };

const sortRecommendations = (recs: Recommendation[], sortBy: SortByType): Recommendation[] => {
  const sortedRecs = [...recs]; // Create a copy to avoid mutating props

  if (sortBy === 'risk') {
    sortedRecs.sort((a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel]);
  } else if (sortBy === 'effort') {
    // Sort by effort (High > Medium > Low), then by risk as a secondary sort
    sortedRecs.sort((a, b) => {
        const effortComparison = effortOrder[b.effort] - effortOrder[a.effort];
        if (effortComparison !== 0) return effortComparison;
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    });
  }
  return sortedRecs;
};

const SortDropdown: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSortBy: (value: SortByType) => void;
  sortRef: React.RefObject<HTMLDivElement>;
}> = ({ isOpen, setIsOpen, setSortBy, sortRef }) => (
    <div className="relative" ref={sortRef}>
        <button onClick={() => setIsOpen(p => !p)} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800">
            <span className="text-sm">Sort</span>
            <ChevronDownIcon className="w-3 h-3" />
        </button>
        {isOpen && (
            <div className="absolute right-0 mt-2 w-32 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                    <button onClick={() => { setSortBy('risk'); setIsOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        By Risk
                    </button>
                    <button onClick={() => { setSortBy('effort'); setIsOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        By Effort
                    </button>
                </div>
            </div>
        )}
    </div>
);

const RecommendedActionsWidget: React.FC<RecommendedActionsWidgetProps> = ({
  recommendations,
  isLoadingRecs,
  onUpdateStatus,
  onOpenPendingModal,
  onOpenImplementedModal,
  viewMode = 'all',
}) => {
  const [pendingSortBy, setPendingSortBy] = useState<SortByType>('default');
  const [implementedSortBy, setImplementedSortBy] = useState<SortByType>('default');
  
  const [isPendingSortOpen, setIsPendingSortOpen] = useState(false);
  const [isImplementedSortOpen, setIsImplementedSortOpen] = useState(false);

  const pendingSortRef = useRef<HTMLDivElement>(null);
  const implementedSortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pendingSortRef.current && !pendingSortRef.current.contains(event.target as Node)) {
        setIsPendingSortOpen(false);
      }
      if (implementedSortRef.current && !implementedSortRef.current.contains(event.target as Node)) {
        setIsImplementedSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const pendingRecommendations = recommendations.filter(rec => rec.status !== RecommendationStatus.Approved);
  const implementedRecommendations = recommendations.filter(rec => rec.status === RecommendationStatus.Approved);

  const sortedPending = sortRecommendations(pendingRecommendations, pendingSortBy);
  const sortedImplemented = sortRecommendations(implementedRecommendations, implementedSortBy);

  const renderActionItems = (fullWidth: boolean) => (
      <div className={`flex flex-col min-h-0 border-gray-200 ${fullWidth ? 'w-full' : 'w-full lg:w-[60%] border-b lg:border-b-0 lg:border-r'}`}>
          {viewMode === 'all' && (
            <div className="p-4 pb-2 bg-gray-50 border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Action Items</h4>
                <div className="mr-8">
                    <div className="flex items-center gap-6">
                        <SortDropdown 
                          isOpen={isPendingSortOpen}
                          setIsOpen={setIsPendingSortOpen}
                          setSortBy={setPendingSortBy}
                          sortRef={pendingSortRef}
                        />
                        {onOpenPendingModal && (
                          <button
                              onClick={onOpenPendingModal}
                              title="View all action items"
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-full transition-colors"
                              aria-label="View all action items"
                          >
                              <NewWindowIcon className="w-4 h-4" />
                          </button>
                        )}
                    </div>
                </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {sortedPending.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                      <p>No pending recommendations.</p>
                  </div>
              ) : (
                  sortedPending.map(rec => (
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
                 <div className="mr-8">
                    <div className="flex items-center gap-6">
                        <SortDropdown 
                            isOpen={isImplementedSortOpen}
                            setIsOpen={setIsImplementedSortOpen}
                            setSortBy={setImplementedSortBy}
                            sortRef={implementedSortRef}
                          />
                        {onOpenImplementedModal && (
                        <button
                            onClick={onOpenImplementedModal}
                            title="View all implemented actions"
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="View all implemented actions"
                        >
                            <NewWindowIcon className="w-4 h-4" />
                        </button>
                        )}
                    </div>
                 </div>
            </div>
           )}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {sortedImplemented.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">
                      <p>No actions implemented yet.</p>
                  </div>
              ) : (
                  sortedImplemented.map(rec => (
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