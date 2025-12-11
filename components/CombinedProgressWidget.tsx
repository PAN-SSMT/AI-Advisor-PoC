import React from 'react';
import { NewWindowIcon } from './icons';

interface CombinedProgressWidgetProps {
  onOpenMTTDModal: () => void;
  onOpenMTTCModal: () => void;
  onOpenMTTRModal: () => void;
}

// Arrow icons for change indicators
const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

// Change indicator component
const ChangeIndicator: React.FC<{ 
  percentage: number; 
  isIncrease: boolean; 
  period: string;
}> = ({ percentage, isIncrease, period }) => (
  <div className="flex items-center text-[10px]">
    <span className={`w-8 text-right font-medium ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
      {percentage}%
    </span>
    <span className="w-4 flex justify-center">
      {isIncrease ? (
        <ArrowUpIcon className="w-3 h-3 text-red-500" />
      ) : (
        <ArrowDownIcon className="w-3 h-3 text-green-500" />
      )}
    </span>
    <span className="text-gray-400">({period})</span>
  </div>
);

// Time display component with h/m/s labels
const TimeDisplay: React.FC<{ hours: string; minutes: string; seconds: string }> = ({ 
  hours, minutes, seconds 
}) => (
  <div className="flex items-end justify-center gap-0.5">
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-gray-400 font-medium">h</span>
      <span className="text-lg font-semibold text-gray-800 font-mono">{hours}</span>
    </div>
    <span className="text-lg font-semibold text-gray-400 font-mono pb-[1px]">:</span>
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-gray-400 font-medium">m</span>
      <span className="text-lg font-semibold text-gray-800 font-mono">{minutes}</span>
    </div>
    <span className="text-lg font-semibold text-gray-400 font-mono pb-[1px]">:</span>
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-gray-400 font-medium">s</span>
      <span className="text-lg font-semibold text-gray-800 font-mono">{seconds}</span>
    </div>
  </div>
);

// Metric section component with popup icon
const MetricSection: React.FC<{ 
  label: string; 
  hours: string; 
  minutes: string; 
  seconds: string;
  change7d: { percentage: number; isIncrease: boolean };
  change30d: { percentage: number; isIncrease: boolean };
  onOpenModal: () => void;
}> = ({
  label, hours, minutes, seconds, change7d, change30d, onOpenModal
}) => (
  <div className="flex-1 flex flex-col items-center relative">
    <div className="mb-1 relative">
      <span className="text-base font-semibold text-gray-800">{label}</span>
      <button
        onClick={onOpenModal}
        title={`Open ${label} details`}
        className="p-0.5 text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded transition-colors absolute -right-4 -top-1"
        aria-label={`Open ${label} details`}
      >
        <NewWindowIcon className="w-3 h-3" />
      </button>
    </div>
    <TimeDisplay hours={hours} minutes={minutes} seconds={seconds} />
    <div className="mt-2 flex flex-col gap-0.5 items-center">
      <div className="flex flex-col gap-0.5 -translate-x-[4%]">
        <ChangeIndicator percentage={change7d.percentage} isIncrease={change7d.isIncrease} period="7 days" />
        <ChangeIndicator percentage={change30d.percentage} isIncrease={change30d.isIncrease} period="30 days" />
      </div>
    </div>
  </div>
);

const CombinedProgressWidget: React.FC<CombinedProgressWidgetProps> = ({ 
  onOpenMTTDModal,
  onOpenMTTCModal,
  onOpenMTTRModal,
}) => {
  // Sample data - replace with actual data
  const metrics = {
    mttd: { 
      hours: '00', minutes: '27', seconds: '23',
      change7d: { percentage: 12, isIncrease: false },
      change30d: { percentage: 8, isIncrease: false },
    },
    mttc: { 
      hours: '00', minutes: '07', seconds: '12',
      change7d: { percentage: 5, isIncrease: true },
      change30d: { percentage: 3, isIncrease: false },
    },
    mttr: { 
      hours: '02', minutes: '23', seconds: '12',
      change7d: { percentage: 15, isIncrease: false },
      change30d: { percentage: 22, isIncrease: false },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <MetricSection label="MTTD" {...metrics.mttd} onOpenModal={onOpenMTTDModal} />
        <MetricSection label="MTTC" {...metrics.mttc} onOpenModal={onOpenMTTCModal} />
        <MetricSection label="MTTR" {...metrics.mttr} onOpenModal={onOpenMTTRModal} />
      </div>
    </div>
  );
};

export default CombinedProgressWidget;

