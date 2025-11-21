import React, { useState, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import ChatInterface from './components/ChatInterface';
import AdoptionMaturityWidget from './components/AdoptionMaturityWidget';
import ScaleOptimizeWidget from './components/ScaleOptimizeWidget';
import ServicesPipelineWidget from './components/ServicesPipelineWidget';
import RecommendedActionsWidget from './components/RecommendedActionsWidget';
import PopupWindowPortal from './components/PopupWindowPortal';
import DeploymentDetails from './components/DeploymentDetails';
import ScaleOptimizeDetails from './components/ScaleOptimizeDetails';
import ClarizenInfo from './components/ClarizenInfo';
import {
  Recommendation,
  RecommendationStatus,
  ChatMessage,
} from './types';
import { generateRecommendations, createChat, sendMessage } from './services/geminiService';

const App: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState<boolean>(true);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);
  const [popupViewMode, setPopupViewMode] = useState<'all' | 'pending' | 'implemented'>('all');
  const [techInfoWindow, setTechInfoWindow] = useState<Window | null>(null);
  const [scaleOptimizeWindow, setScaleOptimizeWindow] = useState<Window | null>(null);
  const [clarizenInfoWindow, setClarizenInfoWindow] = useState<Window | null>(null);
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
    const context = `The customer is using the Cloud Security AI Advisor for Palo Alto Networks' Prisma and Cortex Cloud. They need proactive guidance and recommendations to improve their security posture.`;
    const newRecs = await generateRecommendations(context);

    // Sample implemented actions
    const implementedRecs: Recommendation[] = [
      {
        id: 'impl-1',
        title: 'Enable Unified Audit Logs',
        description: 'Enable unified audit logging across all Prisma Cloud accounts to ensure comprehensive visibility into user activities and system changes.',
        rationale: 'Centralized logging is crucial for forensic analysis and compliance auditing.',
        implementationInstructions: '1. Navigate to Settings > Audit Logs.\n2. Enable "Unified Audit Logging".\n3. Configure the S3 bucket destination for log archival.',
        riskLevel: 'High',
        effort: 'Low',
        status: RecommendationStatus.Approved,
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
      }
    ];

    setRecommendations([...newRecs, ...implementedRecs]);
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

  const servicesPipelineData = {
    lastSession: {
      date: '2024-07-15',
      summary: 'Reviewed initial setup and configured basic policies.',
    },
    nextSession: {
      date: '2024-08-01',
      summary: [
        'Onboard new cloud accounts.',
        'Fine-tune vulnerability scanning.',
        'User training session.',
      ],
    },
    eeCredits: {
      bought: 3326.0,
      used: 1023.6,
      planned: 536.4,
      available: 1766.0,
    },
    supportContacts: [
      { role: 'CSE', name: 'Alex Johnson', email: 'alex.j@example.com' },
      { role: 'EE', name: 'Maria Garcia', email: 'maria.g@example.com' },
      { role: 'CSM', name: 'David Chen', email: 'david.c@example.com' },
    ],
    expirationDate: '2025-06-30',
    tenantExpirationDate: '2026-01-15',
  };

  return (
    <div className="flex flex-col h-screen w-screen text-gray-900">
      <header className="p-4 md:px-8 md:py-5 border-b border-gray-200 bg-white shadow-sm flex-shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">N.O.V.A.</h1>
          <p className="text-gray-500 mt-1">Next-Gen Operations & Virtual Advisor</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-900">Palo Alto Networks</h2>
            <p className="text-gray-500 mt-1">Technical Services</p>
          </div>
        </div>
      </header>
      
      <main className="flex flex-1 overflow-hidden bg-gray-50 p-3 md:p-4 gap-3 md:gap-4">
        {/* Left Column */}
        <div className="w-1/3 min-w-[350px] max-w-[450px] flex flex-col gap-3 md:gap-4">
            <div className="flex gap-3 md:gap-4">
                <AdoptionMaturityWidget setPopupWindow={setTechInfoWindow} />
                <ScaleOptimizeWidget setPopupWindow={setScaleOptimizeWindow} />
            </div>
            <ChatInterface messages={chatMessages} onSendMessage={handleSendMessage} isLoading={isLoadingChat} />
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-3 md:gap-4">
          <ServicesPipelineWidget {...servicesPipelineData} setPopupWindow={setClarizenInfoWindow} />
          <RecommendedActionsWidget
            recommendations={recommendations}
            isLoadingRecs={isLoadingRecs}
            onUpdateStatus={handleUpdateRecStatus}
            setPopupWindow={setPopupWindow}
            setPopupViewMode={setPopupViewMode}
          />
        </div>
      </main>

      {popupWindow && (
        <PopupWindowPortal window={popupWindow}>
          <div className="h-full flex flex-col">
            <RecommendedActionsWidget
              recommendations={recommendations}
              isLoadingRecs={isLoadingRecs}
              onUpdateStatus={handleUpdateRecStatus}
              isPopupWindow={true}
              viewMode={popupViewMode}
            />
          </div>
        </PopupWindowPortal>
      )}
      
      {techInfoWindow && (
        <PopupWindowPortal window={techInfoWindow}>
          <DeploymentDetails />
        </PopupWindowPortal>
      )}

      {scaleOptimizeWindow && (
        <PopupWindowPortal window={scaleOptimizeWindow}>
          <ScaleOptimizeDetails />
        </PopupWindowPortal>
      )}

      {clarizenInfoWindow && (
        <PopupWindowPortal window={clarizenInfoWindow}>
          <ClarizenInfo />
        </PopupWindowPortal>
      )}
    </div>
  );
};

export default App;