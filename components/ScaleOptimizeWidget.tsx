import React from 'react';
import CircularProgress from './CircularProgress';
import { NewWindowIcon } from './icons';

interface ScaleOptimizeWidgetProps {
    onOpenModal: () => void;
}

const ScaleOptimizeWidget: React.FC<ScaleOptimizeWidgetProps> = ({ onOpenModal }) => {
    return (
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-800">
                    Scale & Optimize
                </h3>
                <button
                    onClick={onOpenModal}
                    title="Open scale & optimize details"
                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Open scale and optimize details"
                >
                    <NewWindowIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-grow flex items-center justify-center">
                <CircularProgress 
                    percentage={56} 
                    size={80} 
                    strokeWidth={8} 
                    textSize="text-xl" 
                    colorClassName="text-yellow-500"
                />
            </div>
        </div>
    );
};

export default ScaleOptimizeWidget;
