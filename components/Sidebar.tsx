import React from 'react';
import { MailIcon } from './icons';

const InfoItem: React.FC<{ label: string; value?: string | React.ReactNode; }> = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">{label}</dt>
    <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{value || <span className="text-gray-400 dark:text-gray-500">Not specified</span>}</dd>
  </div>
);

const EEAvailabilityDetails: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="border-t border-gray-200 dark:border-gray-700">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <InfoItem label="Assigned Engineer" value={
                <div className="flex justify-between items-center">
                  <span>John Smith</span>
                  <a href="mailto:john.s@example.com" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                    <MailIcon className="w-4 h-4 text-gray-400" />
                    <span>john.s@example.com</span>
                  </a>
                </div>
              } />
              <InfoItem label="EE Manager" value={
                <div className="flex justify-between items-center">
                  <span>Sarah Jenkins</span>
                  <a href="mailto:sarah.j@example.com" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                    <MailIcon className="w-4 h-4 text-gray-400" />
                    <span>sarah.j@example.com</span>
                  </a>
                </div>
              } />
              <InfoItem label="Last Status Report" value="2024-07-22" />
              <InfoItem label="Next Available Slot" value="2024-08-15" />
              <InfoItem label="Engagement Expiration" value="2025-01-31" />
              <InfoItem label="Credits consumption" value="3230 out of 5000" />
          </dl>
      </div>
    </div>
  );
};

export default EEAvailabilityDetails;