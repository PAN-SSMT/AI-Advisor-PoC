import React from 'react';
import { MailIcon } from './icons';

const InfoItem: React.FC<{ label: string; value?: string | React.ReactNode; }> = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">{label}</dt>
    <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{value || <span className="text-gray-400 dark:text-gray-500">Not specified</span>}</dd>
  </div>
);

const CloudDeploymentServicesDetails: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="border-t border-gray-200 dark:border-gray-700">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <InfoItem label="Service Status" value="Active" />
              <InfoItem label="Last Status Report" value="2024-07-25" />
              <InfoItem label="Engagement Manager" value={
                <div className="flex justify-between items-center">
                  <span>Jane Doe</span>
                  <a href="mailto:jane.d@example.com" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                    <MailIcon className="w-4 h-4 text-gray-400" />
                    <span>jane.d@example.com</span>
                  </a>
                </div>
              } />
              <InfoItem label="Project Manager" value={
                <div className="flex justify-between items-center">
                  <span>Mike Ross</span>
                  <a href="mailto:mike.r@example.com" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
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