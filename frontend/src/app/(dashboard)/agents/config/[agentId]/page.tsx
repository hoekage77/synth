'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useUpdateAgent } from '@/hooks/react-query/agents/use-agents';
import { useUpdateAgentMCPs } from '@/hooks/react-query/agents/use-update-agent-mcps';
import { useCreateAgentVersion, useActivateAgentVersion } from '@/hooks/react-query/agents/use-agent-versions';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AgentPreview } from '../../../../../components/agents/agent-preview';

import { useAgentVersionData } from '../../../../../hooks/use-agent-version-data';
import { useAgentVersionStore } from '../../../../../lib/stores/agent-version-store';

import { AgentHeader, VersionAlert, ConfigurationTab } from '@/components/agents/config';

import { DEFAULT_AGENTPRESS_TOOLS } from '@/components/agents/tools';
import { useExportAgent } from '@/hooks/react-query/agents/use-agent-export-import';

interface FormData {
  name: string;
  description: string;
  system_prompt: string;
  model?: string;
  agentpress_tools: any;
  configured_mcps: any[];
  custom_mcps: any[];
  is_default: boolean;
  profile_image_url?: string;
  icon_name?: string | null;
  icon_color: string;
  icon_background: string;
}

function AgentConfigurationContent() {
  const params = useParams();
  const agentId = params.agentId as string;
  const queryClient = useQueryClient();

  const { agent, versionData, isViewingOldVersion, isLoading, error } = useAgentVersionData({ agentId });
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialAccordion = searchParams.get('accordion');
  const versionParam = searchParams.get('version');
  const { setHasUnsavedChanges } = useAgentVersionStore();
  
  const updateAgentMutation = useUpdateAgent();
  const updateAgentMCPsMutation = useUpdateAgentMCPs();
  const createVersionMutation = useCreateAgentVersion();
  const activateVersionMutation = useActivateAgentVersion();
  const exportMutation = useExportAgent();

  // Use refs for stable references to avoid callback recreation
  const agentIdRef = useRef(agentId);
  const mutationsRef = useRef({
    updateAgent: updateAgentMutation,
    updateMCPs: updateAgentMCPsMutation,
    export: exportMutation,
    activate: activateVersionMutation,
  });

  // Update refs when values change
  useEffect(() => {
    agentIdRef.current = agentId;
    mutationsRef.current = {
      updateAgent: updateAgentMutation,
      updateMCPs: updateAgentMCPsMutation,
      export: exportMutation,
      activate: activateVersionMutation,
    };
  }, [agentId, updateAgentMutation, updateAgentMCPsMutation, exportMutation, activateVersionMutation]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    system_prompt: '',
    model: undefined,
    agentpress_tools: DEFAULT_AGENTPRESS_TOOLS,
    configured_mcps: [],
    custom_mcps: [],
    is_default: false,
    profile_image_url: '',
    icon_name: null,
    icon_color: '#000000',
    icon_background: '#e5e5e5',
  });

  const [originalData, setOriginalData] = useState<FormData>(formData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [lastLoadedVersionId, setLastLoadedVersionId] = useState<string | null>(null);

  useEffect(() => {
    if (!agent) return;
    
    const currentVersionId = versionData?.version_id || agent.current_version_id || 'current';
    const shouldResetForm = !lastLoadedVersionId || lastLoadedVersionId !== currentVersionId;
    
    if (!shouldResetForm) {
      setLastLoadedVersionId(currentVersionId);
      return;
    }
    
    let configSource = agent;
    if (versionData) {
      configSource = {
        ...agent,
        ...versionData,
        system_prompt: versionData.system_prompt,
        model: versionData.model,
        configured_mcps: versionData.configured_mcps,
        custom_mcps: versionData.custom_mcps,
        agentpress_tools: versionData.agentpress_tools,
        icon_name: versionData.icon_name || agent.icon_name,
        icon_color: versionData.icon_color || agent.icon_color,
        icon_background: versionData.icon_background || agent.icon_background,
      };
    }
    const newFormData: FormData = {
      name: configSource.name || '',
      description: configSource.description || '',
      system_prompt: configSource.system_prompt || '',
      model: configSource.model,
      agentpress_tools: configSource.agentpress_tools || DEFAULT_AGENTPRESS_TOOLS,
      configured_mcps: configSource.configured_mcps || [],
      custom_mcps: configSource.custom_mcps || [],
      is_default: configSource.is_default || false,
      profile_image_url: configSource.profile_image_url || '',
      icon_name: configSource.icon_name || null,
      icon_color: configSource.icon_color || '#000000',
      icon_background: configSource.icon_background || '#e5e5e5',
    };
    setFormData(newFormData);
    setOriginalData(newFormData);
    setLastLoadedVersionId(currentVersionId);
  }, [agent, versionData, lastLoadedVersionId]);

  const displayData = isViewingOldVersion && versionData ? {
    name: formData.name,
    description: formData.description,
    system_prompt: versionData.system_prompt || formData.system_prompt,
    model: versionData.model || formData.model,
    agentpress_tools: versionData.agentpress_tools || formData.agentpress_tools,
    configured_mcps: versionData.configured_mcps || formData.configured_mcps,
    custom_mcps: versionData.custom_mcps || formData.custom_mcps,
    is_default: formData.is_default,
    profile_image_url: formData.profile_image_url,
    icon_name: versionData.icon_name || formData.icon_name || null,
    icon_color: versionData.icon_color || formData.icon_color || '#000000',
    icon_background: versionData.icon_background || formData.icon_background || '#e5e5e5',
  } : formData;

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMCPChange = useCallback((updates: { configured_mcps: any[]; custom_mcps: any[] }) => {
    const previousConfigured = formData.configured_mcps;
    const previousCustom = formData.custom_mcps;

    setFormData(prev => ({
      ...prev,
      configured_mcps: updates.configured_mcps || [],
      custom_mcps: updates.custom_mcps || []
    }));

    mutationsRef.current.updateMCPs.mutate({
      agentId: agentIdRef.current,
      configured_mcps: updates.configured_mcps || [],
      custom_mcps: updates.custom_mcps || [],
      replace_mcps: true
    }, {
      onSuccess: () => {
        setOriginalData(prev => ({
          ...prev,
          configured_mcps: updates.configured_mcps || [],
          custom_mcps: updates.custom_mcps || []
        }));
        toast.success('MCP configuration updated');
      },
      onError: (error) => {
        setFormData(prev => ({
          ...prev,
          configured_mcps: previousConfigured,
          custom_mcps: previousCustom
        }));
        toast.error('Failed to update MCP configuration');
        console.error('MCP update error:', error);
      }
    });
  }, []);

  const saveField = useCallback(async (fieldData: Partial<FormData>) => {
    try {
      await mutationsRef.current.updateAgent.mutateAsync({
        agentId: agentIdRef.current,
        ...fieldData,
      });
      
      setFormData(prev => ({ ...prev, ...fieldData }));
      setOriginalData(prev => ({ ...prev, ...fieldData }));
      return true;
    } catch (error) {
      console.error('Failed to save field:', error);
      throw error;
    }
  }, []);

  const handleNameSave = async (name: string) => {
    try {
      await saveField({ name });
      toast.success('Agent name updated');
    } catch {
      toast.error('Failed to update agent name');
      throw new Error('Failed to update agent name');
    }
  };

  const handleProfileImageSave = async (profileImageUrl: string | null) => {
    try {
      await saveField({ profile_image_url: profileImageUrl || '' });
    } catch {
      toast.error('Failed to update profile picture');
      throw new Error('Failed to update profile picture');
    }
  };
  
  const handleIconSave = async (iconName: string | null, iconColor: string, iconBackground: string) => {
    try {
      await saveField({ icon_name: iconName, icon_color: iconColor, icon_background: iconBackground });
      toast.success('Agent icon updated');
    } catch {
      toast.error('Failed to update agent icon');
      throw new Error('Failed to update agent icon');
    }
  };

  const handleSystemPromptSave = async (system_prompt: string) => {
    try {
      await saveField({ system_prompt });
      toast.success('System prompt updated');
    } catch {
      toast.error('Failed to update system prompt');
      throw new Error('Failed to update system prompt');
    }
  };

  const handleModelSave = async (model: string) => {
    try {
      await saveField({ model });
      toast.success('Model updated');
    } catch {
      toast.error('Failed to update model');
      throw new Error('Failed to update model');
    }
  };

  const handleToolsSave = async (agentpress_tools: Record<string, boolean | { enabled: boolean; description: string }>) => {
    try {
      await saveField({ agentpress_tools });
      toast.success('Tools updated');
    } catch {
      toast.error('Failed to update tools');
      throw new Error('Failed to update tools');
    }
  };

  const handleExport = () => {
    mutationsRef.current.export.mutate(agentIdRef.current);
  };

  const { hasUnsavedChanges, isCurrentVersion } = React.useMemo(() => {
    const formDataStr = JSON.stringify(formData);
    const originalDataStr = JSON.stringify(originalData);
    const hasChanges = formDataStr !== originalDataStr;
    const isCurrent = !isViewingOldVersion;
    
    return {
      hasUnsavedChanges: hasChanges && isCurrent,
      isCurrentVersion: isCurrent
    };
  }, [formData, originalData, isViewingOldVersion]);

  const prevHasUnsavedChangesRef = useRef(hasUnsavedChanges);
  useEffect(() => {
    if (prevHasUnsavedChangesRef.current !== hasUnsavedChanges) {
      prevHasUnsavedChangesRef.current = hasUnsavedChanges;
      setHasUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges]);

  const router = useRouter();

  const handleActivateVersion = async (versionId: string) => {
    try {
      await mutationsRef.current.activate.mutateAsync({ agentId: agentIdRef.current, versionId });
      router.push(`/agents/config/${agentIdRef.current}`);
    } catch (error) {
      console.error('Failed to activate version:', error);
    }
  };

  // OPTIMIZED: Simplified save with stable reference
  const handleSave = useCallback(async () => {
    const currentFormData = formData;
    const hasChanges = JSON.stringify(currentFormData) !== JSON.stringify(originalData);
    
    if (hasChanges) {
      try {
        await mutationsRef.current.updateAgent.mutateAsync({
          agentId: agentIdRef.current,
          ...currentFormData,
        });
        
        setOriginalData(currentFormData);
        toast.success('Agent updated successfully');
      } catch (error) {
        toast.error('Failed to update agent');
        console.error('Failed to save agent:', error);
      }
    }
  }, []); // Using snapshot of formData in function instead of dependency

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Failed to load agent: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Agent not found
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const previewAgent = {
    ...agent,
    ...displayData,
    agent_id: agentId,
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:grid lg:grid-cols-2 w-full h-full">
          <div className="bg-background h-full flex flex-col border-r border-border/40 overflow-hidden">
            <div className="flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="pt-4">
                {isViewingOldVersion && (
                  <div className="mb-4 px-8">
                    <VersionAlert
                      versionData={versionData}
                      isActivating={activateVersionMutation.isPending}
                      onActivateVersion={handleActivateVersion}
                    />
                  </div>
                )}
                <div>
                  <AgentHeader
                    agentId={agentId}
                    displayData={displayData}
                    isViewingOldVersion={isViewingOldVersion}
                    onFieldChange={handleFieldChange}
                    onExport={handleExport}
                    isExporting={exportMutation.isPending}
                    agentMetadata={agent?.metadata}
                    currentVersionId={agent?.current_version_id}
                    currentFormData={{
                      system_prompt: formData.system_prompt,
                      configured_mcps: formData.configured_mcps,
                      custom_mcps: formData.custom_mcps,
                      agentpress_tools: formData.agentpress_tools
                    }}
                    hasUnsavedChanges={hasUnsavedChanges}
                    onVersionCreated={() => {
                      setOriginalData(formData);
                    }}
                    onNameSave={handleNameSave}
                    onProfileImageSave={handleProfileImageSave}
                    onIconSave={handleIconSave}
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="h-full">
                <ConfigurationTab
                  agentId={agentId}
                  displayData={displayData}
                  versionData={versionData}
                  isViewingOldVersion={isViewingOldVersion}
                  onFieldChange={handleFieldChange}
                  onMCPChange={handleMCPChange}
                  onSystemPromptSave={handleSystemPromptSave}
                  onModelSave={handleModelSave}
                  onToolsSave={handleToolsSave}
                  initialAccordion={initialAccordion}
                  agentMetadata={agent?.metadata}
                  isLoading={updateAgentMutation.isPending}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-muted/20 h-full flex flex-col relative">
            <div className="absolute inset-0">
              <AgentPreview agent={previewAgent} />
            </div>
          </div>
        </div>

        <div className="lg:hidden w-full h-full">
          <div className="bg-background h-full flex flex-col overflow-hidden">
            <div className="flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="pt-4">
                
                {isViewingOldVersion && (
                  <div className="mb-4 px-4">
                    <VersionAlert
                      versionData={versionData}
                      isActivating={activateVersionMutation.isPending}
                      onActivateVersion={handleActivateVersion}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between px-4">
                  <AgentHeader
                    agentId={agentId}
                    displayData={displayData}
                    isViewingOldVersion={isViewingOldVersion}
                    onFieldChange={handleFieldChange}
                    onExport={handleExport}
                    isExporting={exportMutation.isPending}
                    agentMetadata={agent?.metadata}
                    currentVersionId={agent?.current_version_id}
                    currentFormData={{
                      system_prompt: formData.system_prompt,
                      configured_mcps: formData.configured_mcps,
                      custom_mcps: formData.custom_mcps,
                      agentpress_tools: formData.agentpress_tools
                    }}
                    hasUnsavedChanges={hasUnsavedChanges}
                    onVersionCreated={() => {
                      setOriginalData(formData);
                    }}
                    onNameSave={handleNameSave}
                    onProfileImageSave={handleProfileImageSave}
                    onIconSave={handleIconSave}
                  />
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[85vh]">
                      <DrawerHeader>
                        <DrawerTitle>Agent Preview</DrawerTitle>
                      </DrawerHeader>
                      <div className="flex-1 overflow-hidden">
                        <AgentPreview agent={previewAgent} />
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="h-full">
                <ConfigurationTab
                  agentId={agentId}
                  displayData={displayData}
                  versionData={versionData}
                  isViewingOldVersion={isViewingOldVersion}
                  onFieldChange={handleFieldChange}
                  onMCPChange={handleMCPChange}
                  onSystemPromptSave={handleSystemPromptSave}
                  onModelSave={handleModelSave}
                  onToolsSave={handleToolsSave}
                  initialAccordion={initialAccordion}
                  agentMetadata={agent?.metadata}
                  isLoading={updateAgentMutation.isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentConfigurationPage() {
  return <AgentConfigurationContent />;
} 