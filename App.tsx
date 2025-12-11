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
  },
  {
    id: 'impl-6',
    title: 'Disable Unused Security Groups',
    description: 'Identified and removed security groups that are not attached to any instances or network interfaces.',
    rationale: 'Unused security groups clutter the environment and can be inadvertently attached to resources, opening unintended access paths.',
    implementationInstructions: '1. Run RQL query to find unused security groups.\n2. Review the list for false positives.\n3. Delete security groups via Cloud Provider console.',
    riskLevel: 'Medium',
    effort: 'Low',
    status: RecommendationStatus.Approved,
    implementedOn: '2024-06-25',
  }
];

const App: React.FC = () => {
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
    <div className="flex flex-col h-screen w-screen text-gray-900">
      <header className="p-4 md:px-8 md:py-5 border-b border-gray-200 bg-white shadow-sm flex-shrink-0 flex justify-between items-center">
        <div>
          <img src="./assets/nova-logo.png" alt="NOVA - Next-Gen Operations & Virtual Advisor" className="h-[90px] -translate-y-[6%]" />
        </div>
        <div className="text-right">
          <img src="./assets/PaloAltoLogo.png" alt="Palo Alto Networks" className="h-[70px]" />
          <p className="text-gray-900 -mt-1 text-[18px] font-medium pr-[6%]">Technical Services</p>
        </div>
      </header>
      
      <main className="flex flex-1 overflow-hidden bg-gray-50 p-3 md:p-4 gap-3 md:gap-4">
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
      <Modal isOpen={isScaleOptimizeModalOpen} onClose={() => setIsScaleOptimizeModalOpen(false)} title="Scale & Optimize Status">
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
          <button className="text-blue-600 hover:underline text-sm">
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
        titleRight={<span className="text-gray-500 font-medium">{servicesPipelineData.lastSession.date}</span>}
        hideBorder
        maxWidth="max-w-3xl"
      >
        <LastSessionDetails summary={servicesPipelineData.lastSession.summary} />
      </Modal>
      <Modal 
        isOpen={isNextSessionModalOpen} 
        onClose={() => setIsNextSessionModalOpen(false)} 
        title="Next Session"
        titleRight={<span className="text-gray-500 font-medium">{servicesPipelineData.nextSession.date}</span>}
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