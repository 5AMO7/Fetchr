import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import MDEditor, { commands } from '@uiw/react-md-editor';
import EmailPlaceholders from '../components/EmailPlaceholders';
import AIEmailEnhancer from '../components/AIEmailEnhancer';
import LeadSelector from '../components/LeadSelector';
import TooltipWrapper from '../components/TooltipWrapper';

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
            delayUnit: 'days', // 'minutes', 'hours', 'days', 'weeks'
            showEditor: true // Control editor visibility for each step
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
        setSteps(prevSteps => prevSteps.map(step => 
            step.id === stepId ? { ...step, [field]: value } : step
        ));
    };

    const handleAIContentUpdate = (stepId, newContent) => {
        console.log(`AI Content Update for step ${stepId}:`, newContent.substring(0, 100) + '...');
        
        // Find current step content before update
        const currentStep = steps.find(s => s.id === stepId);
        console.log(`Current step content before AI update:`, currentStep?.body?.substring(0, 100) + '...');
        
        // Hide the editor for this step
        setSteps(prevSteps => prevSteps.map(step => 
            step.id === stepId 
                ? { ...step, showEditor: false } 
                : step
        ));
        
        // Update the step content after a brief delay
        setTimeout(() => {
            setSteps(prevSteps => prevSteps.map(step => 
                step.id === stepId 
                    ? { ...step, body: newContent, showEditor: true } 
                    : step
            ));
            console.log(`Editor remounted for step ${stepId} with new content`);
        }, 100);
        
        // Log after a delay to verify persistence
        setTimeout(() => {
            const updatedStep = steps.find(s => s.id === stepId);
            console.log(`Step content after AI update:`, updatedStep?.body?.substring(0, 100) + '...');
        }, 600);
    };

    const handleAISubjectUpdate = (stepId, newSubject) => {
        console.log(`AI Subject Update for step ${stepId}:`, newSubject);
        handleStepChange(stepId, 'subject', newSubject);
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
            delayUnit: 'days', // Only days are supported now
            showEditor: true // Initialize editor visibility for new steps
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
        <div className="flex items-center justify-center mb-12">
            <div className="relative">
                {/* Progress line background */}
                <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-10"></div>
                
                {/* Active progress line */}
                <div 
                    className="absolute top-6 left-6 h-0.5 bg-accent transition-all duration-500 ease-in-out -z-10"
                    style={{ width: `${((currentStep - 1) / (stepTitles.length - 1)) * 100}%` }}
                ></div>
                
                <div className="flex items-center justify-between space-x-16">
                    {stepTitles.map((step) => {
                        const isCompleted = currentStep > step.number;
                        const isActive = currentStep === step.number;
                        
                        return (
                            <div key={step.number} className="flex flex-col items-center space-y-3">
                                {/* Step circle */}
                                <div className={`
                                    relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ease-in-out transform
                                    ${isCompleted 
                                        ? 'bg-accent text-white shadow-lg scale-110' 
                                        : isActive 
                                            ? 'bg-accent text-white shadow-xl scale-110 ring-4 ring-accent/20' 
                                            : 'bg-white text-gray-400 border-2 border-gray-200 hover:border-gray-300'
                                    }
                                `}>
                                    {isCompleted ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className={`${isActive ? 'text-white' : 'text-gray-500'}`}>
                                            {step.number}
                                        </span>
                                    )}
                                    
                                    {/* Active pulse animation */}
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-full bg-accent animate-pulse opacity-10" style={{ animationDuration: '3s' }}></div>
                                    )}
                                </div>
                                
                                {/* Step label */}
                                <div className="text-center">
                                    <div className={`
                                        text-sm font-semibold transition-colors duration-300
                                        ${isCompleted || isActive 
                                            ? 'text-accent' 
                                            : 'text-gray-400'
                                        }
                                    `}>
                                        {step.title}
                                    </div>
                                    <div className={`
                                        text-xs mt-1 transition-colors duration-300
                                        ${isCompleted 
                                            ? 'text-green-600' 
                                            : isActive 
                                                ? 'text-accent' 
                                                : 'text-gray-400'
                                        }
                                    `}>
                                        {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Campaign Information Section */}
            <div className="bg-white rounded-2xl large-button-shadow border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Campaign Information</h3>
                        <p className="text-sm text-gray-600">Set up the basic details for your email campaign</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Campaign Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Campaign Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={campaignData.name}
                            onChange={(e) => handleCampaignDataChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400"
                            placeholder="e.g., Welcome Series Q1 2024"
                        />
                        <p className="mt-2 text-xs text-gray-500">Choose a descriptive name that helps you identify this campaign</p>
                    </div>

                    {/* Campaign Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Description
                        </label>
                        <textarea
                            value={campaignData.description}
                            onChange={(e) => handleCampaignDataChange('description', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white text-gray-900 placeholder-gray-500 resize-none shadow-sm transition-all duration-200 hover:border-gray-400"
                            placeholder="Describe the purpose and goals of this email campaign..."
                        />
                        <p className="mt-2 text-xs text-gray-500">Optional: Add notes about the campaign's objectives and target audience</p>
                    </div>
                </div>
            </div>

            {/* Additional Settings Section */}
            <div className="bg-white rounded-2xl large-button-shadow border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Additional Settings</h3>
                        <p className="text-sm text-gray-600">Configure advanced options for your campaign</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Email Tracking Option */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center mt-1">
                            <input
                                type="checkbox"
                                id="trackEmails"
                                checked={campaignData.trackEmailOpens}
                                onChange={(e) => handleCampaignDataChange('trackEmailOpens', e.target.checked)}
                                className="w-5 h-5 text-accent border-2 border-gray-300 rounded focus:ring-accent focus:ring-2 transition-colors duration-200"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="trackEmails" className="block text-sm font-semibold text-gray-900 cursor-pointer">
                                Track Email Opens
                            </label>
                            <p className="text-sm text-gray-600 mt-1">
                                Monitor when recipients open your emails to measure engagement and campaign effectiveness
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Analytics
                                </span>
                                <span className="text-xs text-gray-500">Provides open rates and timing insights</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Sequence</h2>
                <p className="text-gray-600">Create a series of emails that will be sent to your leads automatically</p>
            </div>

            {/* Steps Container */}
            <div className="space-y-6">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        {/* Delay Indicator (shown before step, except first step) */}
                        {index > 0 && (
                            <div className="flex items-center justify-center">
                                <div className="bg-white rounded-2xl large-button-shadow border border-orange-200 p-6 mx-auto w-80">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Wait Period</h4>
                                        <div className="flex items-center justify-center gap-3">
                                            <input
                                                type="number"
                                                min="1"
                                                value={step.delay || 1}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    let finalValue;
                                                    if (value === '' || value === '0') {
                                                        finalValue = 1;
                                                    } else {
                                                        const numValue = parseInt(value, 10);
                                                        finalValue = Math.max(1, isNaN(numValue) ? 1 : numValue);
                                                    }
                                                    handleStepChange(step.id, 'delay', finalValue);
                                                }}
                                                className="w-16 min-w-16 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-lg font-semibold"
                                            />
                                            <span className="text-gray-600 font-medium">days</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Email will be sent {step.delay} day{step.delay !== 1 ? 's' : ''} after the previous step
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Email Step Card */}
                        <div className="bg-white rounded-2xl large-button-shadow border border-gray-200 p-8" data-step={step.id}>
                            {/* Step Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {index === 0 ? 'Welcome Email' : `Follow-up Email ${index}`}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {index === 0 ? 'Sent immediately when campaign starts' : `Sent ${step.delay} day${step.delay !== 1 ? 's' : ''} after previous email`}
                                        </p>
                                    </div>
                                </div>
                                {steps.length > 1 && (
                                    <button
                                        onClick={() => removeStep(step.id)}
                                        className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Remove
                                    </button>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column - Template & Subject */}
                                <div className="space-y-6">
                                    {/* Template Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Email Template
                                        </label>
                                        <select
                                            value={step.template}
                                            onChange={(e) => handleTemplateSelection(step.id, e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400"
                                            disabled={templatesLoading}
                                        >
                                            <option value="">
                                                {templatesLoading ? 'Loading templates...' : 'Choose a template (optional)'}
                                            </option>
                                            {emailTemplates.map((template) => (
                                                <option key={template.id} value={template.id}>
                                                    {template.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-2 text-xs text-gray-500">Select a pre-built template or create from scratch</p>
                                    </div>

                                    {/* Email Subject */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Email Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={step.subject}
                                            onChange={(e) => handleStepChange(step.id, 'subject', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400"
                                            placeholder={index === 0 ? "Welcome to our platform!" : "Following up on your interest"}
                                        />
                                        <p className="mt-2 text-xs text-gray-500">Write a compelling subject line that encourages opens</p>
                                    </div>
                                </div>

                                {/* Right Column - Email Body */}
                                <div className="lg:col-span-1">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Email Content <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <EmailPlaceholders onInsertPlaceholder={(placeholderText) => handleInsertPlaceholder(step.id, placeholderText)} />
                                            <AIEmailEnhancer 
                                                currentContent={step.body}
                                                onContentUpdate={(content) => handleAIContentUpdate(step.id, content)}
                                                onSubjectUpdate={(subject) => handleAISubjectUpdate(step.id, subject)}
                                            />
                                        </div>
                                    </div>
                                    <div data-color-mode="light">
                                        {step.showEditor ? (
                                            <MDEditor
                                                value={step.body}
                                                onChange={(value) => handleStepChange(step.id, 'body', value || '')}
                                                height={300}
                                                preview="edit"
                                                className="border border-gray-300 rounded-xl shadow-sm"
                                                commands={customCommands}
                                            />
                                        ) : (
                                            <div className="border border-gray-300 rounded-xl h-[300px] flex items-center justify-center bg-gray-50">
                                                <div className="text-gray-500">Updating content...</div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Use the toolbar to format your email. Add placeholders to personalize messages.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ))}
                
                {/* Add Step Button */}
                <div className="flex justify-center pt-4">
                    <button
                        onClick={addStep}
                        className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200 font-medium group"
                    >
                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-accent/10 rounded-full flex items-center justify-center transition-colors duration-200">
                            <PlusIcon className="w-5 h-5" />
                        </div>
                        Add Another Email Step
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
                <div
                    onClick={addLead}
                    className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6 cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow"
                >
                    <span className="text-accent font-medium">Add leads</span>
                </div>
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
                            <div
                                onClick={() => setLeads([])}
                                className="h-8 flex items-center justify-center bg-background-primary rounded-lg border border-red-600 px-3 cursor-pointer hover:bg-red-50 hover:border-red-700 transition-all duration-300 ease-in-out small-button-shadow"
                            >
                                <span className="text-red-600 text-sm font-medium">Remove all</span>
                            </div>
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
                                <TooltipWrapper tooltip={'Remove lead'}>
                                    <div
                                        onClick={() => removeLead(lead.id)}
                                        className="h-8 w-8 flex items-center justify-center bg-background-primary rounded-lg border border-red-600 cursor-pointer hover:bg-red-50 hover:border-red-700 transition-all duration-300 ease-in-out small-button-shadow"
                                    >
                                        <XMarkIcon className="w-4 h-4 text-red-600" />
                                    </div>
                                </TooltipWrapper>
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
                
                <div className="flex-1">
                    {renderCurrentStep()}
                </div>

                {/* Fixed Navigation Bar */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 large-button-shadow rounded-2xl mx-auto w-full max-w-6xl mt-8 -mb-8">
                    <div className="flex items-center justify-between px-8 py-6">
                        {/* Progress Info */}
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Step <span className="font-semibold text-gray-900">{currentStep}</span> of <span className="font-semibold text-gray-900">{stepTitles.length}</span>
                            </div>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-accent h-2 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${(currentStep / stepTitles.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center space-x-4">
                            {currentStep > 1 && (
                                <button
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="h-11 flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-6 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow"
                                >
                                    <svg className="w-4 h-4 mr-2 text-text-primary stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="text-text-primary">Back</span>
                                </button>
                            )}
                            
                            <button
                                onClick={handleContinue}
                                disabled={!canContinue() || isLoading}
                                className={`h-11 flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6 cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow ${
                                    (!canContinue() || isLoading) 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : ''
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent -ml-1 mr-3"></div>
                                        <span className="text-accent">Creating Campaign...</span>
                                    </>
                                ) : (
                                    <>
                                        {currentStep === 3 ? (
                                            <>
                                                <svg className="w-4 h-4 mr-2 text-accent stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <span className="text-accent">Create Campaign</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-accent">Continue</span>
                                                <svg className="w-4 h-4 ml-2 text-accent stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CampaignsCreate; 