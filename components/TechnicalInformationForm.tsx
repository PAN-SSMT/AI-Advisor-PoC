import React from 'react';
import { MailIcon } from './icons';

const InfoItem: React.FC<{ label: string; value?: string | React.ReactNode; }> = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">{label}</dt>
    <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{value || <span className="text-gray-400 dark:text-gray-500">Not specified</span>}</dd>
  </div>
);

const ScaleAndOptimizeSODetails: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="border-t border-gray-200 dark:border-gray-700">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <InfoItem label="S&O Engineer" value={
                <div className="flex justify-between items-center">
                  <span>Alice Williams</span>
                  <a href="mailto:alice.w@example.com" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                    <MailIcon className="w-4 h-4 text-gray-400" />
                    <span>alice.w@example.com</span>
                  </a>
                </div>
              } />
              <InfoItem label="S&O Manager" value={
                <div className="flex justify-between items-center">
                  <span>Bob Brown</span>
                  <a href="mailto:bob.b@example.com" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                    <MailIcon className="w-4 h-4 text-gray-400" />
                    <span>bob.b@example.com</span>
                  </a>
                </div>
              } />
              <InfoItem label="Last Status Report" value="2024-07-28" />
              <InfoItem label="Last Review" value="2024-07-01" />
              <InfoItem label="Next Review" value="2024-10-01" />
          </dl>
      </div>
    </div>
  );
};

export default ScaleAndOptimizeSODetails;