import React from 'react';

type MetricType = 'MTTD' | 'MTTC' | 'MTTR';

interface MTTDetailsProps {
  metricType: MetricType;
}

// Simple SVG line chart component
const TrendChart: React.FC<{ data: number[]; color: string; label: string }> = ({ data, color, label }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 120;
  const width = 100;
  const is30Day = data.length > 7;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 mb-1">{label}</span>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
        {/* Only show dots for 7-day view, or every 4th point for 30-day */}
        {data.map((value, index) => {
          if (is30Day && index % 4 !== 0 && index !== data.length - 1) return null;
          const x = (index / (data.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          return (
            <circle key={index} cx={x} cy={y} r={is30Day ? 2 : 3} fill={color} />
          );
        })}
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{is30Day ? '30d ago' : '7d ago'}</span>
        <span>Today</span>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; subtitle?: string; trend?: 'up' | 'down'; trendValue?: string }> = ({
  title, value, subtitle, trend, trendValue
}) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    {trend && trendValue && (
      <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'down' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'down' ? (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )}
        <span>{trendValue}</span>
      </div>
    )}
  </div>
);

const MTTDDetails: React.FC = () => {
  const trendData7d = [32, 28, 35, 30, 25, 27, 27]; // minutes over 7 days
  const trendData30d = [45, 42, 38, 40, 35, 33, 32, 30, 35, 32, 28, 35, 30, 25, 27, 27, 29, 31, 28, 26, 30, 28, 27, 29, 28, 27, 26, 28, 27, 27]; // minutes over 30 days
  
  return (
    <div className="space-y-6">
      {/* Header with current value */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Mean Time to Detect (MTTD)</h3>
            <p className="text-sm text-blue-700 mt-1">Average time to identify a security threat or incident</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-blue-600">00:27:23</p>
            <p className="text-sm text-blue-500">Current Average</p>
          </div>
        </div>
      </div>

      {/* Trend Graphs */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Trend Analysis</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <TrendChart data={trendData7d} color="#3B82F6" label="7-Day Trend (minutes)" />
            <MetricCard title="7 Days Trend" value="12% ↓" subtitle="Improved from 00:31:05" trend="down" trendValue="Faster detection" />
          </div>
          <div>
            <TrendChart data={trendData30d} color="#1D4ED8" label="30-Day Trend (minutes)" />
            <MetricCard title="30 Days Trend" value="8% ↓" subtitle="Improved from 00:29:45" trend="down" trendValue="Consistent improvement" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard title="Alerts Analyzed" value="1,247" subtitle="Last 7 days" />
        <MetricCard title="True Positives" value="89%" subtitle="Detection accuracy" />
        <MetricCard title="Avg Detection Sources" value="3.2" subtitle="Per incident" />
      </div>

      {/* Detection Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Detection Sources (Palo Alto Networks)</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Prisma Cloud CSPM Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <span className="text-sm text-gray-600">35%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Cortex XDR Endpoint Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
              <span className="text-sm text-gray-600">28%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Prisma Cloud CWP Runtime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '22%' }}></div>
              </div>
              <span className="text-sm text-gray-600">22%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">XSOAR Automated Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <span className="text-sm text-gray-600">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formula & Calculation */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">How MTTD is Calculated</h4>
        <div className="bg-white rounded-lg p-4 font-mono text-sm text-gray-700 mb-4">
          MTTD = Σ(Detection Time - Incident Start Time) / Total Incidents
        </div>
        <p className="text-sm text-gray-600">
          Detection time is measured from when an attack or anomaly begins to when Prisma Cloud, Cortex XDR, 
          or other Palo Alto Networks security tools generate the first alert. Lower MTTD values indicate 
          faster threat identification, reducing potential damage from undetected attacks.
        </p>
      </div>
    </div>
  );
};

const MTTCDetails: React.FC = () => {
  const trendData7d = [10, 8, 12, 9, 7, 8, 7]; // minutes over 7 days
  const trendData30d = [15, 14, 13, 12, 11, 12, 10, 11, 10, 12, 10, 8, 12, 9, 7, 8, 7, 9, 8, 7, 8, 9, 8, 7, 8, 7, 8, 7, 7, 7]; // minutes over 30 days
  
  return (
    <div className="space-y-6">
      {/* Header with current value */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-900">Mean Time to Contain (MTTC)</h3>
            <p className="text-sm text-green-700 mt-1">Average time to isolate and stop threat propagation</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-green-600">00:07:12</p>
            <p className="text-sm text-green-500">Current Average</p>
          </div>
        </div>
      </div>

      {/* Trend Graphs */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Trend Analysis</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <TrendChart data={trendData7d} color="#22C55E" label="7-Day Trend (minutes)" />
            <MetricCard title="7 Days Trend" value="5% ↑" subtitle="Increased from 00:06:51" trend="up" trendValue="Slightly slower" />
          </div>
          <div>
            <TrendChart data={trendData30d} color="#15803D" label="30-Day Trend (minutes)" />
            <MetricCard title="30 Days Trend" value="3% ↓" subtitle="Improved from 00:07:25" trend="down" trendValue="Overall improvement" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard title="Incidents Contained" value="156" subtitle="Last 7 days" />
        <MetricCard title="Auto-Contained" value="67%" subtitle="Via XSOAR playbooks" />
        <MetricCard title="Avg Actions Taken" value="4.8" subtitle="Per containment" />
      </div>

      {/* Containment Methods */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Containment Actions (Palo Alto Networks)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Cortex XDR Isolation</span>
            </div>
            <p className="text-sm text-gray-600">Endpoint quarantine and network isolation via Cortex XDR agents</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Prisma Cloud Remediation</span>
            </div>
            <p className="text-sm text-gray-600">Auto-remediation of misconfigurations and policy violations</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">XSOAR Playbooks</span>
            </div>
            <p className="text-sm text-gray-600">Automated response workflows for rapid containment</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Network Segmentation</span>
            </div>
            <p className="text-sm text-gray-600">Dynamic microsegmentation via Prisma Cloud</p>
          </div>
        </div>
      </div>

      {/* Formula & Calculation */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">How MTTC is Calculated</h4>
        <div className="bg-white rounded-lg p-4 font-mono text-sm text-gray-700 mb-4">
          MTTC = Σ(Containment Time - Detection Time) / Total Incidents
        </div>
        <p className="text-sm text-gray-600">
          Containment time measures from initial detection to when the threat is isolated and prevented 
          from spreading. This includes actions like endpoint isolation, network segmentation, 
          credential revocation, and workload quarantine through Palo Alto Networks security stack.
        </p>
      </div>
    </div>
  );
};

const MTTRDetails: React.FC = () => {
  const trendData7d = [150, 145, 160, 140, 135, 143, 143]; // minutes over 7 days
  const trendData30d = [200, 195, 185, 180, 175, 170, 165, 160, 155, 160, 155, 150, 145, 160, 140, 135, 143, 143, 145, 142, 140, 145, 143, 142, 144, 143, 142, 143, 143, 143]; // minutes over 30 days
  
  return (
    <div className="space-y-6">
      {/* Header with current value */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-purple-900">Mean Time to Resolve (MTTR)</h3>
            <p className="text-sm text-purple-700 mt-1">Average time to fully remediate and close an incident</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-purple-600">02:23:12</p>
            <p className="text-sm text-purple-500">Current Average</p>
          </div>
        </div>
      </div>

      {/* Trend Graphs */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Trend Analysis</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <TrendChart data={trendData7d} color="#A855F7" label="7-Day Trend (minutes)" />
            <MetricCard title="7 Days Trend" value="15% ↓" subtitle="Improved from 02:47:18" trend="down" trendValue="Faster resolution" />
          </div>
          <div>
            <TrendChart data={trendData30d} color="#7C3AED" label="30-Day Trend (minutes)" />
            <MetricCard title="30 Days Trend" value="22% ↓" subtitle="Improved from 03:03:28" trend="down" trendValue="Significant improvement" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard title="Incidents Resolved" value="142" subtitle="Last 7 days" />
        <MetricCard title="First-Time Fix" value="78%" subtitle="No recurrence" />
        <MetricCard title="Avg Resolution Steps" value="8.3" subtitle="Per incident" />
      </div>

      {/* Resolution Phases */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Resolution Timeline Breakdown</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Investigation & Root Cause Analysis</span>
              <span className="text-sm text-gray-500">45 min avg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '32%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Remediation & Patching</span>
              <span className="text-sm text-gray-500">58 min avg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '41%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Verification & Testing</span>
              <span className="text-sm text-gray-500">25 min avg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-purple-500 h-3 rounded-full" style={{ width: '18%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Documentation & Closure</span>
              <span className="text-sm text-gray-500">15 min avg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-orange-500 h-3 rounded-full" style={{ width: '9%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Tools */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Resolution Enablers (Palo Alto Networks)</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <div>
              <p className="font-medium text-gray-900">Prisma Cloud Alerts</p>
              <p className="text-gray-500">Contextual alerts with remediation guidance</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <p className="font-medium text-gray-900">Cortex XSOAR</p>
              <p className="text-gray-500">Automated playbooks for common incidents</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
            <div>
              <p className="font-medium text-gray-900">Unit 42 Threat Intel</p>
              <p className="text-gray-500">IOCs and remediation recommendations</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
            <div>
              <p className="font-medium text-gray-900">Prisma Cloud IaC</p>
              <p className="text-gray-500">Infrastructure fixes via code templates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formula & Calculation */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">How MTTR is Calculated</h4>
        <div className="bg-white rounded-lg p-4 font-mono text-sm text-gray-700 mb-4">
          MTTR = Σ(Resolution Time - Detection Time) / Total Incidents
        </div>
        <p className="text-sm text-gray-600">
          Resolution time encompasses the entire incident lifecycle from detection to full remediation, 
          including investigation, containment, eradication, recovery, and lessons learned. 
          Palo Alto Networks tools like XSOAR and Prisma Cloud auto-remediation significantly reduce MTTR 
          through automation and pre-built response playbooks.
        </p>
      </div>
    </div>
  );
};

const MTTDetails: React.FC<MTTDetailsProps> = ({ metricType }) => {
  switch (metricType) {
    case 'MTTD':
      return <MTTDDetails />;
    case 'MTTC':
      return <MTTCDetails />;
    case 'MTTR':
      return <MTTRDetails />;
    default:
      return null;
  }
};

export default MTTDetails;
