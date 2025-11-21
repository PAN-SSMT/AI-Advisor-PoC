import React from 'react';

const InfoItem: React.FC<{ label: string; value?: string | React.ReactNode; }> = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{value || <span className="text-gray-400">Not specified</span>}</dd>
  </div>
);

const ClarizenInfo: React.FC = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">EE Credits & Clarizen Information</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Detailed services and engagement information.</p>
        </div>
        <div className="mt-6 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
                <InfoItem label="Cloud Deployment Services" />
                <InfoItem label="Service Sessions remaining" value="6" />
                <InfoItem label="Engagement Expiration" value="2025-06-30" />
                <InfoItem label="Tenant Expiration" value="2026-01-15" />
                <InfoItem label="EE Availability" />
                <InfoItem label="T&M projects" />
            </dl>
        </div>
      </div>
    </div>
  );
};

export default ClarizenInfo;