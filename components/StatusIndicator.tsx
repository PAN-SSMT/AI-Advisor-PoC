import React from 'react';
import { MailIcon } from './icons';

const InfoItem: React.FC<{ label: string; value?: string | React.ReactNode; }> = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{value || <span className="text-gray-400">Not specified</span>}</dd>
  </div>
);

const CloudDeploymentServicesDetails: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Cloud Deployment Services Details</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Details about Cloud Deployment Services.</p>
      </div>
      <div className="mt-6 border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
              <InfoItem label="Service Status" value="Active" />
              <InfoItem label="Last Status Report" value="2024-07-25" />
              <InfoItem label="Engagement Manager" value={
                <div className="flex justify-between items-center">
                  <span>Jane Doe</span>
                  <a href="mailto:jane.d@example.com" className="flex items-center gap-1 text-blue-600 hover:underline">
                    <MailIcon className="w-4 h-4 text-gray-400" />
                    <span>jane.d@example.com</span>
                  </a>
                </div>
              } />
              <InfoItem label="Project Manager" value={
                <div className="flex justify-between items-center">
                  <span>Mike Ross</span>
                  <a href="mailto:mike.r@example.com" className="flex items-center gap-1 text-blue-600 hover:underline">
                    <MailIcon className="w-4 h-4 text-gray-400" />
                    <span>mike.r@example.com</span>
                  </a>
                </div>
              } />
              <InfoItem label="Remaining Sessions" value="15" />
              <InfoItem label="Scheduled Sessions" value="12" />
              <InfoItem label="Completed Sessions" value="4" />
          </dl>
      </div>
    </div>
  );
};

export default CloudDeploymentServicesDetails;