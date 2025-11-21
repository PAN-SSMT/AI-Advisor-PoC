import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import RecommendedActionsWidget from './components/RecommendedActionsWidget';
import { Recommendation, RecommendationStatus } from './types';

// The data structure passed from the main window
interface WidgetData {
    recommendations: Recommendation[];
    isLoadingRecs: boolean;
}

const RecommendationsWindowApp = () => {
    const [data, setData] = useState<WidgetData | null>(null);

    // This function will be called by the widget inside the popup.
    // It communicates back to the main (opener) window.
    const handleUpdateStatus = (id: string, status: RecommendationStatus) => {
        if (window.opener && typeof (window.opener as any).handleUpdateRecStatusFromPopup === 'function') {
            (window.opener as any).handleUpdateRecStatusFromPopup(id, status);
        } else {
            console.error("Could not communicate with the main application window. The update function is missing.");
        }
    };

    useEffect(() => {
        // The main window will call this function to push data updates.
        (window as any).updateData = (newData: Partial<WidgetData>) => {
            setData(prevData => ({ ...(prevData!), ...newData }));
        };
        
        // This handler receives the initial data from the parent window
        const handleDataReady = () => {
            if ((window as any).initialData) {
                setData((window as any).initialData);
            }
        };

        window.addEventListener('data-ready', handleDataReady);
        
        // In case the event fired before our listener was attached
        if ((window as any).initialData) {
             handleDataReady();
        }

        return () => {
            window.removeEventListener('data-ready', handleDataReady);
            delete (window as any).updateData;
        };
    }, []);

    if (!data) {
        return <div className="flex items-center justify-center h-screen"><p>Loading Recommendations...</p></div>;
    }

    return (
        <RecommendedActionsWidget
            recommendations={data.recommendations}
            isLoadingRecs={data.isLoadingRecs}
            onUpdateStatus={handleUpdateStatus}
            isPopupWindow={true}
        />
    );
};


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RecommendationsWindowApp />
  </React.StrictMode>
);