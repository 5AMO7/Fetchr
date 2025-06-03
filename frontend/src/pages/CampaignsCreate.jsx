import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import MDEditor, { commands } from '@uiw/react-md-editor';
import EmailPlaceholders from '../components/EmailPlaceholders';
import LeadSelector from '../components/LeadSelector';

// Custom commands so that there is no insert image button
const customCommands = [
    commands.bold, 
    commands.italic, 
    commands.strikethrough, 
    commands.hr, 
    commands.title, 
    commands.divider, 
    commands.link, 
    commands.quote, 
    commands.code, 
    commands.divider, 
    commands.unorderedList, 
    commands.orderedList, 
    commands.checkedList, 
    commands.divider, 
    commands.help
];

function CampaignsCreate() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [emailTemplates, setEmailTemplates] = useState([]);
    const [templatesLoading, setTemplatesLoading] = useState(true);
    const [leadSelectorOpen, setLeadSelectorOpen] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Step 1: Campaign data
    const [campaignData, setCampaignData] = useState({
        name: '',
        description: '',
        trackEmailOpens: false
    });

    // Step 2: Steps data
    const [steps, setSteps] = useState([
        {
            id: 1,
            template: '',
            subject: '',
            body: '',
            delay: 0, // First step is sent immediately
            delayUnit: 'days' // 'minutes', 'hours', 'days', 'weeks'
        }
    ]);

    // Step 3: Leads data
    const [leads, setLeads] = useState([]);

    const stepTitles = [
        { number: 1, title: 'Campaign', active: currentStep === 1 },
        { number: 2, title: 'Steps', active: currentStep === 2 },
        { number: 3, title: 'Leads', active: currentStep === 3 }
    ];

    // Fetch email templates when component mounts
    useEffect(() => {
        const fetchEmailTemplates = async () => {
            try {
                const response = await api.get('/email-templates');
                setEmailTemplates(response.data);
                setTemplatesLoading(false);
            } catch (err) {
                console.error("Failed to fetch email templates:", err);
                showToast('error', 'Failed to load email templates');
                setTemplatesLoading(false);
            }
        };

        fetchEmailTemplates();
    }, [showToast]);

    const handleCampaignDataChange = (field, value) => {
        setCampaignData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleStepChange = (stepId, field, value) => {
        setSteps(prev => prev.map(step => 
            step.id === stepId ? { ...step, [field]: value } : step
        ));
    };

    const handleTemplateSelection = (stepId, templateId) => {
        if (templateId) {
            const selectedTemplate = emailTemplates.find(template => template.id === parseInt(templateId));
            if (selectedTemplate) {
                setSteps(prev => prev.map(step => 
                    step.id === stepId ? { 
                        ...step, 
                        template: templateId,
                        subject: selectedTemplate.subject,
                        body: selectedTemplate.body
                    } : step
                ));
            }
        } else {
            // Clear template selection
            setSteps(prev => prev.map(step => 
                step.id === stepId ? { 
                    ...step, 
                    template: '',
                    subject: '',
                    body: ''
                } : step
            ));
        }
    };

    const addStep = () => {
        const newStep = {
            id: steps.length + 1,
            template: '',
            subject: '',
            body: '',
            delay: 1, // Default to 1 day delay for new steps
            delayUnit: 'days'
        };
        setSteps(prev => [...prev, newStep]);
    };

    const removeStep = (stepId) => {
        if (steps.length > 1) {
            setSteps(prev => prev.filter(step => step.id !== stepId));
        }
    };

    const addLead = () => {
        setLeadSelectorOpen(true);
    };

    const handleLeadsSelected = (selectedLeads) => {
        // Add selected leads to the current leads list, avoiding duplicates
        setLeads(prevLeads => {
            const existingIds = prevLeads.map(lead => lead.id);
            const newLeads = selectedLeads.filter(lead => !existingIds.includes(lead.id));
            return [...prevLeads, ...newLeads];
        });
        showToast('success', `Added ${selectedLeads.length} lead${selectedLeads.length !== 1 ? 's' : ''} to campaign`);
    };

    const removeLead = (leadId) => {
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
        showToast('success', 'Lead removed from campaign');
    };

    const getExcludeLeadIds = () => {
        return leads.map(lead => lead.id);
    };

    const handleInsertPlaceholder = (stepId, placeholderText) => {
        setTimeout(() => {
            const textarea = document.querySelector(`[data-step="${stepId}"] .w-md-editor-text-input`);
            if (textarea) {
                const step = steps.find(s => s.id === stepId);
                if (step) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const newText = step.body.substring(0, start) + placeholderText + step.body.substring(end);
                    handleStepChange(stepId, 'body', newText);
                    
                    // Focus and set cursor position right after the inserted text
                    setTimeout(() => {
                        textarea.focus();
                        const newPosition = start + placeholderText.length;
                        textarea.setSelectionRange(newPosition, newPosition);
                    }, 100);
                }
            } else {
                const step = steps.find(s => s.id === stepId);
                if (step) {
                    const newBody = step.body + (step.body && !step.body.endsWith('\n') ? '\n' : '') + placeholderText;
                    handleStepChange(stepId, 'body', newBody);
                }
            }
        }, 0);
    };

    const canContinue = () => {
        switch (currentStep) {
            case 1:
                return campaignData.name.trim().length > 0;
            case 2:
                return steps.every(step => step.subject.trim().length > 0);
            case 3:
                return true; // Can always proceed from leads step
            default:
                return false;
        }
    };

    const handleContinue = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            handleCreateCampaign();
        }
    };

    const handleCreateCampaign = async () => {
        setIsLoading(true);
        
        try {
            // Step 1: Create the campaign
            const campaignPayload = {
                ...campaignData,
                status: 'draft'
            };
            
            const campaignResponse = await api.post('/campaigns', campaignPayload);
            const campaignId = campaignResponse.data.id;

            // Step 2: Add steps to the campaign
            if (steps.length > 0) {
                for (const step of steps) {
                    // Convert delay to hours based on delay unit
                    let delayHours = step.delay;
                    switch (step.delayUnit) {
                        case 'minutes':
                            delayHours = Math.round(step.delay / 60);
                            break;
                        case 'hours':
                            delayHours = step.delay;
                            break;
                        case 'days':
                            delayHours = step.delay * 24;
                            break;
                        case 'weeks':
                            delayHours = step.delay * 24 * 7;
                            break;
                        default:
                            delayHours = step.delay * 24; // Default to days
                    }

                    const stepPayload = {
                        step_order: step.id,
                        type: 'email',
                        delay_hours: delayHours,
                        subject: step.subject,
                        body: step.body
                    };
                    
                    await api.post(`/campaigns/${campaignId}/steps`, stepPayload);
                }
            }

            // Step 3: Add leads to the campaign
            if (leads.length > 0) {
                const leadIds = leads.map(lead => lead.id);
                await api.post(`/campaigns/${campaignId}/campaign-leads/bulk`, {
                    action: 'add',
                    lead_ids: leadIds
                });
            }

            showToast('success', 'Campaign created successfully');
            setTimeout(() => {
                navigate(`/campaigns/${campaignId}`);
            }, 1500);
        } catch (err) {
            console.error('Campaign creation error:', err);
            showToast('error', err.response?.data?.message || 'Failed to create campaign');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-0">
                {stepTitles.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        <div className={`
                            flex items-center px-6 py-3 text-sm font-medium
                            ${step.active 
                                ? 'bg-accent text-white' 
                                : 'bg-gray-200 text-gray-700'
                            }
                            ${index === 0 ? 'rounded-l-lg' : ''}
                            ${index === stepTitles.length - 1 ? 'rounded-r-lg' : ''}
                            ${index > 0 ? 'clip-path-arrow' : ''}
                        `}>
                            <span className="w-6 h-6 rounded-full bg-white text-gray-900 flex items-center justify-center text-xs font-bold mr-2">
                                {step.number}
                            </span>
                            {step.title}
                        </div>
                        {index < stepTitles.length - 1 && (
                            <div className="w-0 h-0 border-l-[20px] border-l-gray-200 border-y-[20px] border-y-transparent"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-text-primary">Campaign Information</h2>
            
            {/* Campaign Name */}
            <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                    Campaign Name *
                </label>
                <input
                    type="text"
                    value={campaignData.name}
                    onChange={(e) => handleCampaignDataChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background-primary text-text-primary"
                    placeholder="Enter campaign name"
                />
            </div>

            {/* Campaign Description */}
            <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                    Description
                </label>
                <textarea
                    value={campaignData.description}
                    onChange={(e) => handleCampaignDataChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background-primary text-text-primary resize-none"
                    placeholder="Enter campaign description"
                />
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="trackEmails"
                    checked={campaignData.trackEmailOpens}
                    onChange={(e) => handleCampaignDataChange('trackEmailOpens', e.target.checked)}
                    className="w-4 h-4 border-2 border-gray-900 rounded accent-accent"
                />
                <label htmlFor="trackEmails" className="text-sm font-medium text-text-primary">
                    Track Email opens
                </label>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-6 overflow-x-auto pb-4">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        {/* Delay Indicator (shown before step, except first step) */}
                        {index > 0 && (
                            <div className="flex-shrink-0 flex flex-col items-center justify-center text-center px-4">
                                <div className="w-2 h-8 bg-blue-300 rounded-full mb-2"></div>
                                <div className="text-xs text-blue-600 font-medium">
                                    Wait {step.delay} {step.delayUnit}
                                </div>
                                <div className="w-2 h-8 bg-blue-300 rounded-full mt-2"></div>
                            </div>
                        )}
                        
                        <div className="flex-shrink-0 w-96 bg-white border border-gray-200 rounded-lg p-4" data-step={step.id}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-text-primary">
                                Step {index + 1}
                            </h3>
                            {steps.length > 1 && (
                                <button
                                    onClick={() => removeStep(step.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            {/* Delay Configuration (for steps after the first one) */}
                            {index > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <label className="block text-sm font-medium text-text-secondary-dark mb-2">
                                        Send this email after:
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={step.delay}
                                            onChange={(e) => handleStepChange(step.id, 'delay', parseInt(e.target.value) || 0)}
                                            className="w-20 px-2 py-1 border border-border-dark rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                        <select
                                            value={step.delayUnit}
                                            onChange={(e) => handleStepChange(step.id, 'delayUnit', e.target.value)}
                                            className="px-2 py-1 border border-border-dark rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                        >
                                            <option value="minutes">minutes</option>
                                            <option value="hours">hours</option>
                                            <option value="days">days</option>
                                            <option value="weeks">weeks</option>
                                        </select>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-1">
                                        This step will be sent {step.delay} {step.delayUnit} after the previous step
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-text-secondary-dark mb-1">
                                    Select a template...
                                </label>
                                <select
                                    value={step.template}
                                    onChange={(e) => handleTemplateSelection(step.id, e.target.value)}
                                    className="block w-full rounded-md py-2 px-3 text-md text-text-primary border border-border-dark focus:outline-none focus:ring-2 focus:ring-accent"
                                    disabled={templatesLoading}
                                >
                                    <option value="">
                                        {templatesLoading ? 'Loading templates...' : 'Select a template...'}
                                    </option>
                                    {emailTemplates.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary-dark mb-1">
                                    Email Subject
                                </label>
                                <input
                                    type="text"
                                    value={step.subject}
                                    onChange={(e) => handleStepChange(step.id, 'subject', e.target.value)}
                                    className="block w-full rounded-md py-2 px-3 text-md text-text-primary border border-border-dark focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="Enter email subject"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-text-secondary-dark">
                                        Email Body
                                    </label>
                                    <div className="flex gap-2">
                                        <EmailPlaceholders onInsertPlaceholder={(placeholderText) => handleInsertPlaceholder(step.id, placeholderText)} />
                                    </div>
                                </div>
                                <div data-color-mode="light">
                                    <MDEditor
                                        value={step.body}
                                        onChange={(value) => handleStepChange(step.id, 'body', value || '')}
                                        height={350}
                                        preview="edit"
                                        className="border border-border-dark rounded-lg"
                                        commands={customCommands}
                                    />
                                </div>
                                <p className="text-xs text-text-secondary-dark mt-1">
                                    Format your email using the toolbar buttons above or by writing Markdown directly. 
                                    Use the Placeholders dropdown to insert template variables.
                                </p>
                            </div>
                        </div>
                        </div>
                    </React.Fragment>
                ))}
                
                <div className="flex-shrink-0 w-64 flex items-center justify-center">
                    <button
                        onClick={addStep}
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent transition-colors"
                    >
                        <PlusIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-lg font-medium text-gray-600">Add a step</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-text-primary">Add leads</h2>
                    <p className="text-text-secondary-dark">Select leads from your database to include in this campaign</p>
                </div>
                <button
                    onClick={addLead}
                    className="px-4 py-2 border border-accent text-accent rounded hover:bg-accent hover:text-white transition-colors"
                >
                    Add leads
                </button>
            </div>

            <div className="border border-gray-200 rounded-lg">
                <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm text-text-secondary-dark">
                                {leads.length} lead{leads.length !== 1 ? 's' : ''} selected
                            </span>
                        </div>
                        {leads.length > 0 && (
                            <button
                                onClick={() => setLeads([])}
                                className="text-sm text-red-600 hover:text-red-700 transition-colors"
                            >
                                Remove all
                            </button>
                        )}
                    </div>
                </div>
                
                {leads.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary-dark">
                        <p>No leads added yet. Click "Add leads" to get started.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {leads.map((lead) => (
                            <div key={lead.id} className="p-4 flex items-center space-x-4">
                                <input type="checkbox" className="w-4 h-4" defaultChecked />
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <div>
                                        <div className="font-medium text-text-primary">
                                            {lead.business_name || 'N/A'}
                                        </div>
                                        <div className="text-sm text-text-secondary-dark">
                                            {lead.email || 'No email'}
                                        </div>
                                    </div>
                                    <div className="text-sm text-text-secondary-dark">
                                        {lead.industry || 'Not specified'}
                                    </div>
                                    <div className="text-sm text-text-secondary-dark">
                                        {lead.city && lead.country 
                                            ? `${lead.city}, ${lead.country}`
                                            : 'Location not specified'
                                        }
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeLead(lead.id)}
                                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <LeadSelector
                isOpen={leadSelectorOpen}
                onClose={() => setLeadSelectorOpen(false)}
                onLeadsSelected={handleLeadsSelected}
                excludeLeadIds={getExcludeLeadIds()}
            />
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            default:
                return renderStep1();
        }
    };

    return (
        <div className='flex h-screen w-screen'>
            <Sidebar />

            <main className='flex flex-col bg-background-primary w-full h-full p-8 overflow-auto large-section-shadow z-10'>
                {renderStepIndicator()}
                
                <div className="flex-1 mb-8">
                    {renderCurrentStep()}
                </div>

                <div className="flex justify-end max-w-6xl mx-auto w-full">
                    <div className="flex space-x-4">
                        {currentStep > 1 && (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        
                        <button
                            onClick={handleContinue}
                            disabled={!canContinue() || isLoading}
                            className="px-6 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isLoading ? 'Creating...' : (currentStep === 3 ? 'Create Campaign' : 'continue')}
                            {!isLoading && currentStep < 3 && (
                                <span className="ml-2">▶</span>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CampaignsCreate; 