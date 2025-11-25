import React from 'react';
import { CalendarIcon, MailIcon, UserIcon } from './icons';

export type ServiceOffering = 'cloud-deployment' | 'ee-availability' | 'tm-projects' | 'scale-optimize';

interface ServicesPipelineWidgetProps {
  lastSession: {
    date: string;
    summary: string;
  };
  nextSession: {
    date: string;
    summary: string[];
  };
  supportContacts: {
    role: string;
    name: string;
    email: string;
  }[];
  onOpenPopup: (offering: ServiceOffering) => void;
}

const ServiceOfferingButton: React.FC<{ children: React.ReactNode, onClick: () => void }> = ({ children, onClick }) => (
  <button onClick={onClick} className="text-blue-600 hover:underline text-left">
    {children}
  </button>
);

const ServicesPipelineWidget: React.FC<ServicesPipelineWidgetProps> = ({
  lastSession,
  nextSession,
  supportContacts,
  onOpenPopup,
}) => {

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Technical Services Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.8fr_1.1fr] gap-x-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-y-4">
          {/* Last Session */}
          <div>
            <div className="flex items-center">
              <h4 className="font-medium text-gray-500">Last Session</h4>
              <div className="flex items-center gap-2 text-gray-700 font-medium ml-4">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span>{lastSession.date}</span>
              </div>
            </div>
            <ul className="text-gray-600 mt-1 list-disc list-inside space-y-1 text-xs">
              <li>{lastSession.summary}</li>
            </ul>
          </div>

          {/* Next Session */}
          <div>
            <div className="flex items-center">
              <h4 className="font-medium text-gray-500">Next Session</h4>
              <div className="flex items-center gap-2 text-gray-700 font-medium ml-4">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span>{nextSession.date}</span>
              </div>
            </div>
            <ul className="text-gray-600 mt-1 list-disc list-inside space-y-1 text-xs">
              {nextSession.summary.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-y-4 md:px-6 md:border-l md:border-r md:border-gray-200 mt-4 md:mt-0 py-4 md:py-0">
            <div>
                <h4 className="font-medium text-gray-500 mb-2">Service Offerings</h4>
                <div className="space-y-2 text-gray-600 flex flex-col items-start">
                  <ServiceOfferingButton onClick={() => onOpenPopup('cloud-deployment')}>Cloud Deployment Services</ServiceOfferingButton>
                  <ServiceOfferingButton onClick={() => onOpenPopup('ee-availability')}>Extended Expertise</ServiceOfferingButton>
                  <ServiceOfferingButton onClick={() => onOpenPopup('tm-projects')}>T&amp;M projects</ServiceOfferingButton>
                  <ServiceOfferingButton onClick={() => onOpenPopup('scale-optimize')}>Scale &amp; Optimize</ServiceOfferingButton>
                </div>
            </div>
        </div>


        {/* Right Column */}
        <div className="flex flex-col gap-y-4 md:pl-6 mt-4 md:mt-0">
          {/* Contacts */}
          <div>
            <h4 className="font-medium text-gray-500 mb-2">Assigned Support</h4>
            <div className="space-y-2">
              {supportContacts.map(contact => (
                <div key={contact.role} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">{contact.name}</span>
                      <span className="text-gray-500 text-xs"> ({contact.role})</span>
                    </div>
                  </div>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-blue-600 hover:underline truncate text-xs">
                    <MailIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span>{contact.email}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServicesPipelineWidget;