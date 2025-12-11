import React from 'react';

export type ServiceOffering = 'cloud-deployment' | 'ee-availability' | 'tm-projects' | 'scale-optimize' | 'support-cases' | 'license-consumption' | 'last-session' | 'next-session';

interface ServicesPipelineWidgetProps {
  lastSession: {
    date: string;
    summary: string;
  };
  nextSession: {
    date: string;
    summary: string[];
  };
  onOpenPopup: (offering: ServiceOffering) => void;
}

const ServiceOfferingButton: React.FC<{ children: React.ReactNode, onClick: () => void }> = ({ children, onClick }) => (
  <button onClick={onClick} className="text-blue-600 hover:underline text-left">
    {children}
  </button>
);

const ServicesPipelineWidget: React.FC<ServicesPipelineWidgetProps> = ({
  onOpenPopup,
}) => {

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-sm h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Technical Services Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-y-2 justify-center">
          <ServiceOfferingButton onClick={() => onOpenPopup('last-session')}>Last Session</ServiceOfferingButton>
          <ServiceOfferingButton onClick={() => onOpenPopup('next-session')}>Next Session</ServiceOfferingButton>
          <ServiceOfferingButton onClick={() => onOpenPopup('support-cases')}>TAC Cases</ServiceOfferingButton>
          <ServiceOfferingButton onClick={() => onOpenPopup('license-consumption')}>License Consumption</ServiceOfferingButton>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center md:pl-6 md:border-l md:border-gray-200 mt-4 md:mt-0">
          <h4 className="font-medium text-gray-500 mb-2">Service Offerings</h4>
          <div className="space-y-2 text-gray-600 flex flex-col items-start">
            <ServiceOfferingButton onClick={() => onOpenPopup('cloud-deployment')}>Cloud Deployment Services</ServiceOfferingButton>
            <ServiceOfferingButton onClick={() => onOpenPopup('ee-availability')}>Extended Expertise</ServiceOfferingButton>
            <ServiceOfferingButton onClick={() => onOpenPopup('tm-projects')}>T&amp;M projects</ServiceOfferingButton>
            <ServiceOfferingButton onClick={() => onOpenPopup('scale-optimize')}>Scale &amp; Optimize</ServiceOfferingButton>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServicesPipelineWidget;