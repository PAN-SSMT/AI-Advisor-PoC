import React, { useState, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import ChatInterface from './components/ChatInterface';
import CombinedProgressWidget from './components/CombinedProgressWidget';
import ServicesPipelineWidget, { ServiceOffering } from './components/ServicesPipelineWidget';
import ProgressIndicatorsWidget from './components/ProgressIndicatorsWidget';
import RecommendedActionsWidget from './components/RecommendedActionsWidget';
import Modal from './components/Modal';
import DeploymentDetails from './components/DeploymentDetails';
import ScaleOptimizeDetails from './components/ScaleOptimizeDetails';
import CloudDeploymentServicesDetails from './components/StatusIndicator';
import EEAvailabilityDetails from './components/Sidebar';
import TMProjectsDetails from './components/ClarizenInfo';
import ScaleAndOptimizeSODetails from './components/TechnicalInformationForm';
import SupportCasesDetails from './components/SupportCasesDetails';
import LicenseConsumptionDetails from './components/LicenseConsumptionDetails';
import CurrentDocuments from './components/CurrentDocuments';
import LastSessionDetails from './components/LastSessionDetails';
import NextSessionDetails from './components/NextSessionDetails';
import MTTDetails from './components/MTTDetails';

import {
  Recommendation,
  RecommendationStatus,
  ChatMessage,
} from './types';
import { createChat, sendMessage } from './services/geminiService';

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Create Data Security Policies for Sensitive Data',
    description: 'Define and apply data security policies in Prisma Cloud to monitor and protect sensitive data (e.g., PII, financial data) stored in S3 buckets and other cloud storage services.',
    rationale: 'Proactively identifies and prevents data exfiltration and unauthorized access to critical business data, which is a primary target for attackers.',
    implementationInstructions: "1. Navigate to 'Data Security' in Prisma Cloud.\n2. Create a new policy and select data profiles (e.g., PCI, HIPAA).\n3. Apply the policy to the relevant cloud accounts and storage assets.\n4. Configure alerting for policy violations.",
    riskLevel: 'High',
    effort: 'Medium',
    status: RecommendationStatus.Pending,
    deploymentIncrease: 3,
    scaleOptimizeIncrease: 5,
    applicableProduct: 'Cortex Cloud',
  },
  {
    id: 'rec-2',
    title: 'Review and Restrict Overly Permissive IAM Roles',
    description: "Audit IAM roles for wildcard permissions (e.g., '*:*') and excessive privileges. Replace them with roles that follow the principle of least privilege.",
    rationale: 'Overly permissive roles increase the blast radius of a compromised identity, allowing attackers to move laterally and access more resources than necessary.',
    implementationInstructions: "1. Use Prisma Cloud's IAM security capabilities to identify over-privileged roles.\n2. Analyze the 'Permissions' tab for each role to understand its usage.\n3. Create new, more restrictive policies based on actual usage.\n4. Attach the new policies and detach the old ones.",
    riskLevel: 'High',
    effort: 'Medium',
    status: RecommendationStatus.Pending,
    deploymentIncrease: 4,
    scaleOptimizeIncrease: 2,
    applicableProduct: 'Cortex Cloud',
  },
  {
    id: 'rec-3',
    title: 'Integrate Cortex XDR with Prisma Cloud for Contextual Alerts',
    description: 'Connect your Cortex XDR instance with Prisma Cloud to enrich cloud security alerts with endpoint and network telemetry.',
    rationale: 'Integration provides a unified view of threats, correlating suspicious activity from endpoints to cloud workloads, which enables faster and more accurate incident response.',
    implementationInstructions: "1. In Prisma Cloud, go to Settings > Integrations.\n2. Select Cortex XDR and provide your API key and instance details.\n3. Enable alert forwarding to Cortex XDR.",
    riskLevel: 'Medium',
    effort: 'Low',
    status: RecommendationStatus.Pending,
    deploymentIncrease: 1,
    scaleOptimizeIncrease: 3,
    applicableProduct: 'XSIAM',
  },
  {
    id: 'rec-4',
    title: 'Enable Web Application and API Security (WAAS)',
    description: "Deploy Prisma Cloud's WAAS to protect your public-facing web applications and APIs from common exploits like the OWASP Top 10.",
    rationale: 'Web applications are a primary attack vector. WAAS provides a critical defense layer against application-level attacks that traditional network firewalls may miss.',
    implementationInstructions: "1. In Prisma Cloud, navigate to Compute > Defend > WAAS.\n2. Create a new WAAS policy for your web applications.\n3. Deploy the Prisma Cloud Defender on the hosts or containers running your applications and apply the policy.",
    riskLevel: 'Critical',
    effort: 'High',
    status: RecommendationStatus.Pending,
    deploymentIncrease: 7,
    scaleOptimizeIncrease: 5,
    applicableProduct: 'Cortex Cloud',
  },
  {
    id: 'rec-5',
    title: 'Configure Anomaly Detection Policies',
    description: 'Set up anomaly detection policies in Prisma Cloud to identify unusual user behavior, network traffic, and compute provisioning activities.',
    rationale: 'Detecting anomalous behavior can be an early indicator of a security breach or compromised account, even when specific threat signatures are not present.',
    implementationInstructions: "1. In Prisma Cloud, go to 'Investigate'.\n2. Use RQL to build queries that establish a baseline of normal activity.\n3. Create 'Anomaly' policies based on these queries under Policies > Alert Policies.",
    riskLevel: 'Medium',
    effort: 'Medium',
    status: RecommendationStatus.Pending,
    deploymentIncrease: 4,
    scaleOptimizeIncrease: 4,
    applicableProduct: 'XSIAM',
  },
  {
    id: 'rec-6',
    title: 'Implement Code Security Scanning in CI/CD Pipeline',
    description: "Integrate Prisma Cloud's Code Security module with your source code repositories (e.g., GitHub, GitLab) to scan for vulnerabilities and misconfigurations before deployment.",
    rationale: 'Shifting security left by finding and fixing issues early in the development lifecycle is more efficient and reduces the number of vulnerabilities reaching production.',
    implementationInstructions: "1. Go to Application Security > Code Security.\n2. Connect your SCM repository.\n3. Configure automated scans on pull requests and commits.",
    riskLevel: 'High',
    effort: 'Medium',
    status: RecommendationStatus.Pending,
    deploymentIncrease: 6,
    scaleOptimizeIncrease: 3,
    applicableProduct: 'Cortex Cloud',
  },
  {
    id: 'rec-7',
    title: 'Set up a Vulnerability Management Workflow',
    description: "Establish a clear process for triaging, assigning, and remediating vulnerabilities discovered by Prisma Cloud's host, container, and serverless function scanning.",
    rationale: 'A defined workflow ensures that vulnerabilities are addressed in a timely manner according to their severity, preventing a backlog of unpatched risks from accumulating.',
    implementationInstructions: "1. Define SLAs for different vulnerability severity levels (e.g., Critical: 7 days, High: 30 days).\n2. Use integrations with ticketing systems like Jira to automatically create remediation tasks.\n3. Use Prisma Cloud's dashboards to track remediation progress.",
    riskLevel: 'Medium',
    effort: 'Low',
    status: RecommendationStatus.Pending,
    deploymentIncrease: 2,
    scaleOptimizeIncrease: 1,
    applicableProduct: 'XSIAM',
  },
  {
    id: 'impl-1',
    title: 'Enable Unified Audit Logs',
    description: 'Enable unified audit logging across all Prisma Cloud accounts to ensure comprehensive visibility into user activities and system changes.',
    rationale: 'Centralized logging is crucial for forensic analysis and compliance auditing.',
    implementationInstructions: '1. Navigate to Settings > Audit Logs.\n2. Enable "Unified Audit Logging".\n3. Configure the S3 bucket destination for log archival.',
    riskLevel: 'High',
    effort: 'Low',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-07-10',
    applicableProduct: 'Cortex Cloud',
    deploymentIncrease: 3,
    scaleOptimizeIncrease: 2,
  },
  {
    id: 'impl-2',
    title: 'Deploy Cortex XDR Agents to Prod',
    description: 'Install Cortex XDR agents on all production Linux servers to ensure runtime protection against malware and exploits.',
    rationale: 'Runtime protection is essential for defending against zero-day attacks and lateral movement within the production environment.',
    implementationInstructions: '1. In Cortex XDR, go to Endpoints > Agent Installations.\n2. Create a new installation package for Linux.\n3. Deploy using the provided shell script via your orchestration tool (e.g., Ansible, Terraform).',
    riskLevel: 'Critical',
    effort: 'Medium',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-07-08',
    applicableProduct: 'XSIAM',
    deploymentIncrease: 6,
    scaleOptimizeIncrease: 3,
  },
  {
    id: 'impl-3',
    title: 'Configure Cloud Discovery',
    description: 'Set up Cloud Discovery in Prisma Cloud to automatically detect and monitor unprotected cloud assets.',
    rationale: 'Shadow IT and unmanaged resources pose a significant security risk. Automatic discovery ensures all assets are accounted for.',
    implementationInstructions: '1. Go to Compute > Manage > Cloud Accounts.\n2. Add your AWS and Azure root accounts.\n3. Enable "Discovery" mode.',
    riskLevel: 'Medium',
    effort: 'Low',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-07-05',
    applicableProduct: 'Cortex Cloud',
    deploymentIncrease: 4,
    scaleOptimizeIncrease: 2,
  },
  {
    id: 'impl-4',
    title: 'Enforce MFA for Console Access',
    description: 'Mandate Multi-Factor Authentication (MFA) for all users accessing the Prisma Cloud console to prevent unauthorized access.',
    rationale: 'MFA adds a critical layer of security, protecting against compromised credentials.',
    implementationInstructions: '1. Go to Settings > Access Control > SSO.\n2. Enable "Require MFA for all users".\n3. Configure IDP integration if using SSO.',
    riskLevel: 'High',
    effort: 'Low',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-07-02',
    applicableProduct: 'Cortex Cloud',
    deploymentIncrease: 2,
    scaleOptimizeIncrease: 2,
  },
  {
    id: 'impl-5',
    title: 'Remediate High Severity Image Vulnerabilities',
    description: 'Patched all container images in the production registry with high severity CVEs.',
    rationale: 'Reducing the attack surface by patching known vulnerabilities prevents exploitation in runtime environments.',
    implementationInstructions: '1. Identify images with high severity CVEs in Compute > Vulnerabilities.\n2. Apply vendor patches.\n3. Redeploy updated images to the registry.',
    riskLevel: 'Critical',
    effort: 'High',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-06-28',
    applicableProduct: 'XSIAM',
    deploymentIncrease: 7,
    scaleOptimizeIncrease: 4,
  },
  {
    id: 'impl-6',
    title: 'Disable Unused Security Groups',
    description: 'Identified and removed security groups that are not attached to any instances or network interfaces.',
    rationale: 'Unused security groups clutter the environment and can be inadvertently attached to resources, opening unintended access paths.',
    implementationInstructions: '1. Run RQL query to find unused security groups.\n2. Review the list for false positives.\n3. Delete security groups via Cloud Provider console.',
    riskLevel: 'Medium',
    effort: 'Low',
    applicableProduct: 'XSIAM',
    deploymentIncrease: 3,
    scaleOptimizeIncrease: 1,
    status: RecommendationStatus.Approved,
    implementedOn: '2024-06-25',
  },
  {
    id: 'impl-7',
    title: 'Configure Network Segmentation Policies',
    description: 'Implemented microsegmentation policies to restrict lateral movement between workloads in the cloud environment.',
    rationale: 'Network segmentation limits the blast radius of a breach by preventing attackers from moving freely between systems.',
    implementationInstructions: '1. Map application dependencies.\n2. Create identity-based segmentation policies in Prisma Cloud.\n3. Deploy in monitor mode first, then enforce.',
    riskLevel: 'High',
    effort: 'High',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-06-20',
    applicableProduct: 'Cortex Cloud',
    deploymentIncrease: 5,
    scaleOptimizeIncrease: 4,
  },
  {
    id: 'impl-8',
    title: 'Enable Runtime Protection for Containers',
    description: 'Activated runtime defense policies to detect and prevent malicious activities within running containers.',
    rationale: 'Runtime protection catches threats that evade static scanning, including zero-day exploits and fileless malware.',
    implementationInstructions: '1. Navigate to Compute > Defend > Runtime.\n2. Create runtime rules for container behavior.\n3. Enable blocking mode for high-confidence detections.',
    riskLevel: 'Critical',
    effort: 'Medium',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-06-18',
    applicableProduct: 'Cortex Cloud',
    deploymentIncrease: 6,
    scaleOptimizeIncrease: 3,
  },
  {
    id: 'impl-9',
    title: 'Integrate SIEM with Cortex XSOAR',
    description: 'Connected existing SIEM infrastructure with Cortex XSOAR for automated alert enrichment and response.',
    rationale: 'SIEM integration enables centralized visibility and automated playbook execution for faster incident response.',
    implementationInstructions: '1. Configure SIEM integration in XSOAR.\n2. Map alert fields to XSOAR incident types.\n3. Create automated enrichment playbooks.',
    riskLevel: 'Medium',
    effort: 'Medium',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-06-15',
    applicableProduct: 'XSIAM',
    deploymentIncrease: 4,
    scaleOptimizeIncrease: 4,
  },
  {
    id: 'impl-10',
    title: 'Deploy Host Vulnerability Scanning',
    description: 'Enabled continuous vulnerability scanning for all EC2 instances and virtual machines across cloud accounts.',
    rationale: 'Continuous scanning ensures new vulnerabilities are detected promptly as they are disclosed.',
    implementationInstructions: '1. Deploy Prisma Cloud Defenders on hosts.\n2. Configure vulnerability scanning schedules.\n3. Set up alerting thresholds for severity levels.',
    riskLevel: 'High',
    effort: 'Low',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-06-12',
    applicableProduct: 'Cortex Cloud',
    deploymentIncrease: 4,
    scaleOptimizeIncrease: 2,
  },
  {
    id: 'impl-11',
    title: 'Implement Secrets Scanning in Repositories',
    description: 'Configured automated scanning for exposed secrets and credentials in source code repositories.',
    rationale: 'Secrets in code are a common attack vector. Early detection prevents credential exposure in production.',
    implementationInstructions: '1. Go to Application Security > Secrets.\n2. Connect code repositories.\n3. Enable pre-commit hooks for real-time detection.',
    riskLevel: 'Critical',
    effort: 'Low',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-06-08',
    applicableProduct: 'Cortex Cloud',
    deploymentIncrease: 3,
    scaleOptimizeIncrease: 2,
  },
  {
    id: 'impl-12',
    title: 'Configure Alert Fatigue Reduction',
    description: 'Tuned alert policies and implemented alert grouping to reduce noise and prioritize actionable findings.',
    rationale: 'Alert fatigue leads to missed critical alerts. Proper tuning ensures analysts focus on real threats.',
    implementationInstructions: '1. Review alert volume and false positive rates.\n2. Adjust policy thresholds.\n3. Enable alert grouping and deduplication.',
    riskLevel: 'Medium',
    effort: 'Medium',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-06-05',
    applicableProduct: 'XSIAM',
    deploymentIncrease: 2,
    scaleOptimizeIncrease: 3,
  },
  {
    id: 'impl-13',
    title: 'Enable Cloud Infrastructure Entitlement Management',
    description: 'Deployed CIEM capabilities to monitor and right-size cloud permissions across AWS and Azure.',
    rationale: 'Excessive permissions are a leading cause of cloud breaches. CIEM ensures least-privilege access.',
    implementationInstructions: '1. Enable IAM Security in Prisma Cloud.\n2. Run permissions analysis.\n3. Generate and apply right-sized policies.',
    riskLevel: 'High',
    effort: 'High',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-06-01',
    applicableProduct: 'Cortex Cloud',
    deploymentIncrease: 5,
    scaleOptimizeIncrease: 4,
  },
  {
    id: 'impl-14',
    title: 'Set Up Automated Compliance Reporting',
    description: 'Configured automated compliance reports for SOC 2, PCI-DSS, and HIPAA frameworks.',
    rationale: 'Automated reporting reduces manual effort and ensures continuous compliance monitoring.',
    implementationInstructions: '1. Navigate to Compliance > Reports.\n2. Select required compliance frameworks.\n3. Schedule weekly report generation and distribution.',
    riskLevel: 'Low',
    effort: 'Low',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-05-28',
    applicableProduct: 'XSIAM',
    deploymentIncrease: 3,
    scaleOptimizeIncrease: 3,
  },
  {
    id: 'impl-15',
    title: 'Deploy Threat Intelligence Feeds',
    description: 'Integrated external threat intelligence feeds with Cortex XSIAM for enhanced threat detection and context.',
    rationale: 'Threat intelligence enriches alerts with IOCs and TTPs, enabling faster identification of known threats.',
    implementationInstructions: '1. Navigate to Threat Intelligence > Feeds.\n2. Configure premium and open-source feeds.\n3. Map indicators to detection rules.',
    riskLevel: 'High',
    effort: 'Medium',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-05-25',
    applicableProduct: 'XSIAM',
    deploymentIncrease: 4,
    scaleOptimizeIncrease: 3,
  },
  {
    id: 'impl-16',
    title: 'Configure Data Loss Prevention Policies',
    description: 'Implemented DLP policies to detect and prevent unauthorized data exfiltration across cloud storage and endpoints.',
    rationale: 'DLP protects sensitive data from accidental or malicious exposure, reducing compliance and reputational risks.',
    implementationInstructions: '1. Define sensitive data patterns and classifications.\n2. Create DLP policies in Data Security.\n3. Enable alerting and blocking for policy violations.',
    riskLevel: 'Critical',
    effort: 'High',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-05-20',
    applicableProduct: 'Cortex Cloud',
    deploymentIncrease: 4,
    scaleOptimizeIncrease: 3,
  },
  {
    id: 'impl-17',
    title: 'Enable Identity Analytics',
    description: 'Activated identity analytics to detect suspicious user behavior and compromised credentials across cloud environments.',
    rationale: 'Identity-based attacks are a leading cause of breaches. Analytics detect anomalous access patterns early.',
    implementationInstructions: '1. Enable Identity Security module.\n2. Configure baseline behavior learning.\n3. Set up alerts for anomalous activities.',
    riskLevel: 'High',
    effort: 'Low',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-05-15',
    applicableProduct: 'Cortex Cloud',
    deploymentIncrease: 2,
    scaleOptimizeIncrease: 3,
  }
];

// Dark mode toggle icons
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage for saved preference, default to false
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nova-dark-mode');
      return saved === 'true';
    }
    return false;
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState<boolean>(true);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  
  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);
  const [isScaleOptimizeModalOpen, setIsScaleOptimizeModalOpen] = useState(false);
  const [isCloudDeploymentModalOpen, setIsCloudDeploymentModalOpen] = useState(false);
  const [isEEAvailabilityModalOpen, setIsEEAvailabilityModalOpen] = useState(false);
  const [isTMProjectsModalOpen, setIsTMProjectsModalOpen] = useState(false);
  const [isScaleOptimizeSOModalOpen, setIsScaleOptimizeSOModalOpen] = useState(false);
  const [isSupportCasesModalOpen, setIsSupportCasesModalOpen] = useState(false);
  const [isLicenseConsumptionModalOpen, setIsLicenseConsumptionModalOpen] = useState(false);
  const [isActionItemsModalOpen, setIsActionItemsModalOpen] = useState(false);
  const [isImplementedActionsModalOpen, setIsImplementedActionsModalOpen] = useState(false);
  const [isCurrentDocumentsModalOpen, setIsCurrentDocumentsModalOpen] = useState(false);
  const [isLastSessionModalOpen, setIsLastSessionModalOpen] = useState(false);
  const [isNextSessionModalOpen, setIsNextSessionModalOpen] = useState(false);
  const [isMTTDModalOpen, setIsMTTDModalOpen] = useState(false);
  const [isMTTCModalOpen, setIsMTTCModalOpen] = useState(false);
  const [isMTTRModalOpen, setIsMTTRModalOpen] = useState(false);

  const [chat, setChat] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: 'model',
      text: "Welcome to your Cloud Security AI Advisor. I'm here to help you navigate your security implementation. I have generated some initial recommendations for you to review."
    }
  ]);

  const fetchRecommendations = useCallback(async () => {
    setIsLoadingRecs(true);
    
    // To simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));

    setRecommendations(MOCK_RECOMMENDATIONS);
    setIsLoadingRecs(false);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nova-dark-mode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    fetchRecommendations();
    setChat(createChat());
  }, [fetchRecommendations]);

  const handleUpdateRecStatus = useCallback((id: string, status: RecommendationStatus) => {
    setRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, status } : rec))
    );
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!chat) return;
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: message,
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoadingChat(true);

    const botResponseText = await sendMessage(chat, message);

    const botMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'model',
      text: botResponseText,
    };
    setChatMessages(prev => [...prev, botMessage]);
    setIsLoadingChat(false);
  };

  const handleOpenServiceOfferingPopup = (offering: ServiceOffering) => {
    switch (offering) {
      case 'cloud-deployment':
        setIsCloudDeploymentModalOpen(true);
        break;
      case 'ee-availability':
        setIsEEAvailabilityModalOpen(true);
        break;
      case 'tm-projects':
        setIsTMProjectsModalOpen(true);
        break;
      case 'scale-optimize':
        setIsScaleOptimizeSOModalOpen(true);
        break;
      case 'support-cases':
        setIsSupportCasesModalOpen(true);
        break;
      case 'license-consumption':
        setIsLicenseConsumptionModalOpen(true);
        break;
      case 'last-session':
        setIsLastSessionModalOpen(true);
        break;
      case 'next-session':
        setIsNextSessionModalOpen(true);
        break;
      default:
        break;
    }
  };

  const servicesPipelineData = {
    lastSession: {
      date: '2024-07-15',
      summary: [
        'Reviewed initial setup and configured basic policies.',
        'Completed onboarding of primary AWS accounts.',
        'Configured alert notifications for critical severity findings.',
        'Established baseline compliance standards for CIS benchmarks.',
        'Integrated with existing SIEM for log forwarding.',
      ],
    },
    nextSession: {
      date: '2024-08-01',
      summary: [
        'Onboard new cloud accounts (Azure production environment).',
        'Fine-tune vulnerability scanning thresholds.',
        'User training session for SOC team.',
        'Review and optimize IAM policies based on usage analysis.',
        'Configure custom compliance policies for internal standards.',
        'Set up automated remediation workflows.',
      ],
    },
  };

  return (
    <div className="flex flex-col h-screen w-screen text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="px-4 pt-[12px] pb-[11px] md:px-8 md:pt-[14px] md:pb-[13px] border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black shadow-sm flex-shrink-0 flex justify-between items-center transition-colors duration-200">
        <div>
          <img 
            src={isDarkMode ? "./nova-logo-dark.png" : "./nova-logo.png"} 
            alt="NOVA - Next-Gen Operations & Virtual Advisor" 
            className={`${isDarkMode ? 'h-[87px]' : 'h-[99px]'} -translate-y-[6%]`}
          />
        </div>
        <div className="flex items-center gap-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <div className="text-right">
            <img 
              src={isDarkMode ? "./PaloAltoLogoDark.png" : "./PaloAltoLogo.png"} 
              alt="Palo Alto Networks" 
              className="h-[74px]" 
            />
          </div>
        </div>
      </header>
      
      <main className="flex flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 p-3 md:p-4 gap-3 md:gap-4 transition-colors duration-200">
        {/* Left Column */}
        <div className="w-1/3 min-w-[350px] max-w-[450px] flex flex-col gap-3 md:gap-4">
            <CombinedProgressWidget 
              onOpenMTTDModal={() => setIsMTTDModalOpen(true)}
              onOpenMTTCModal={() => setIsMTTCModalOpen(true)}
              onOpenMTTRModal={() => setIsMTTRModalOpen(true)}
            />
            <ChatInterface
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
            />
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-3 md:gap-4">
          <div className="flex gap-3 md:gap-4">
            <div className="flex-[0_0_55%]">
              <ServicesPipelineWidget 
                {...servicesPipelineData} 
                onOpenPopup={handleOpenServiceOfferingPopup}
              />
            </div>
            <div className="flex-[1_1_45%]">
              <ProgressIndicatorsWidget
                onOpenDeploymentModal={() => setIsDeploymentModalOpen(true)}
                onOpenScaleOptimizeModal={() => setIsScaleOptimizeModalOpen(true)}
                recommendations={recommendations}
              />
            </div>
          </div>
          <RecommendedActionsWidget
            recommendations={recommendations}
            isLoadingRecs={isLoadingRecs}
            onUpdateStatus={handleUpdateRecStatus}
            onOpenPendingModal={() => setIsActionItemsModalOpen(true)}
            onOpenImplementedModal={() => setIsImplementedActionsModalOpen(true)}
          />
        </div>
      </main>
      
      <Modal isOpen={isDeploymentModalOpen} onClose={() => setIsDeploymentModalOpen(false)} title="Deployment Details">
        <DeploymentDetails />
      </Modal>
      <Modal isOpen={isScaleOptimizeModalOpen} onClose={() => setIsScaleOptimizeModalOpen(false)} title="Scale & Optimize Details">
        <ScaleOptimizeDetails />
      </Modal>
      <Modal isOpen={isCloudDeploymentModalOpen} onClose={() => setIsCloudDeploymentModalOpen(false)} title="Cloud Deployment Services Details">
        <CloudDeploymentServicesDetails />
      </Modal>
      <Modal isOpen={isEEAvailabilityModalOpen} onClose={() => setIsEEAvailabilityModalOpen(false)} title="EE Availability Details">
        <EEAvailabilityDetails />
      </Modal>
      <Modal isOpen={isTMProjectsModalOpen} onClose={() => setIsTMProjectsModalOpen(false)} title="T&M Projects Details">
        <TMProjectsDetails />
      </Modal>
      <Modal isOpen={isScaleOptimizeSOModalOpen} onClose={() => setIsScaleOptimizeSOModalOpen(false)} title="Scale & Optimize Service Details">
        <ScaleAndOptimizeSODetails />
      </Modal>
      <Modal 
        isOpen={isSupportCasesModalOpen} 
        onClose={() => setIsSupportCasesModalOpen(false)} 
        title="Support Cases"
        headerPaddingClass="py-5 pr-5 pl-10"
        headerCenter={
          <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            Open New Support Case
          </button>
        }
      >
        <SupportCasesDetails />
      </Modal>
      <Modal 
        isOpen={isLicenseConsumptionModalOpen} 
        onClose={() => setIsLicenseConsumptionModalOpen(false)} 
        title="License Consumption"
        headerPaddingClass="py-5 pr-5 pl-10"
      >
        <LicenseConsumptionDetails />
      </Modal>
      <Modal isOpen={isActionItemsModalOpen} onClose={() => setIsActionItemsModalOpen(false)} title="Action Items">
        <RecommendedActionsWidget
            recommendations={recommendations}
            isLoadingRecs={isLoadingRecs}
            onUpdateStatus={handleUpdateRecStatus}
            viewMode="pending"
        />
      </Modal>
      <Modal isOpen={isImplementedActionsModalOpen} onClose={() => setIsImplementedActionsModalOpen(false)} title="Implemented Actions">
          <RecommendedActionsWidget
              recommendations={recommendations}
              isLoadingRecs={isLoadingRecs}
              onUpdateStatus={handleUpdateRecStatus}
              viewMode="implemented"
          />
      </Modal>
      <Modal isOpen={isCurrentDocumentsModalOpen} onClose={() => setIsCurrentDocumentsModalOpen(false)} title="Support Documents">
        <CurrentDocuments />
      </Modal>
      <Modal 
        isOpen={isLastSessionModalOpen} 
        onClose={() => setIsLastSessionModalOpen(false)} 
        title="Last Session"
        titleRight={<span className="text-gray-500 dark:text-gray-400 font-medium">{servicesPipelineData.lastSession.date}</span>}
        hideBorder
        maxWidth="max-w-3xl"
      >
        <LastSessionDetails summary={servicesPipelineData.lastSession.summary} />
      </Modal>
      <Modal 
        isOpen={isNextSessionModalOpen} 
        onClose={() => setIsNextSessionModalOpen(false)} 
        title="Next Session"
        titleRight={<span className="text-gray-500 dark:text-gray-400 font-medium">{servicesPipelineData.nextSession.date}</span>}
        hideBorder
        maxWidth="max-w-3xl"
      >
        <NextSessionDetails summary={servicesPipelineData.nextSession.summary} />
      </Modal>
      <Modal 
        isOpen={isMTTDModalOpen} 
        onClose={() => setIsMTTDModalOpen(false)} 
        title="Mean Time to Detect (MTTD)"
        maxWidth="max-w-4xl"
      >
        <MTTDetails metricType="MTTD" />
      </Modal>
      <Modal 
        isOpen={isMTTCModalOpen} 
        onClose={() => setIsMTTCModalOpen(false)} 
        title="Mean Time to Contain (MTTC)"
        maxWidth="max-w-4xl"
      >
        <MTTDetails metricType="MTTC" />
      </Modal>
      <Modal 
        isOpen={isMTTRModalOpen} 
        onClose={() => setIsMTTRModalOpen(false)} 
        title="Mean Time to Resolve (MTTR)"
        maxWidth="max-w-4xl"
      >
        <MTTDetails metricType="MTTR" />
      </Modal>
    </div>
  );
};

export default App;