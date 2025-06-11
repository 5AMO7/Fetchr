import React, { useState, useEffect } from 'react';
import { PlusIcon, DocumentTextIcon, ClockIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function CampaignContentTab({ campaign }) {
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const response = await api.get(`/campaigns/${campaign.id}/steps`);
                setSteps(response.data);
                setLoading(false);
            } catch (err) {
                console.error("API Error:", err);
                showToast('error', 'Failed to load campaign steps');
                setLoading(false);
            }
        };

        if (campaign?.id) {
            fetchSteps();
        }
    }, [campaign, showToast]);

    const handleDeleteStep = async (stepId) => {
        if (!window.confirm('Are you sure you want to delete this step?')) {
            return;
        }

        try {
            await api.delete(`/campaigns/${campaign.id}/steps/${stepId}`);
            setSteps(steps.filter(step => step.id !== stepId));
            showToast('success', 'Step deleted successfully');
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to delete step');
        }
    };

    const formatDelay = (hours) => {
        if (hours === 0) return 'Immediately';
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}`;
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        if (remainingHours === 0) return `${days} day${days !== 1 ? 's' : ''}`;
        return `${days} day${days !== 1 ? 's' : ''}, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text) return 'No content available';
        const strippedText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
        return strippedText.length > maxLength ? strippedText.substring(0, maxLength) + '...' : strippedText;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Campaign Content</h2>
                    <p className="text-gray-600 mt-1">
                        {steps.length} step{steps.length !== 1 ? 's' : ''} in this campaign sequence
                    </p>
                </div>
                <button className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6 cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow">
                    <PlusIcon className="w-4 h-4 text-accent mr-2" />
                    <span className="text-accent font-medium">Add Step</span>
                </button>
            </div>

            {steps.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">No steps added yet</h3>
                        <p className="text-gray-600 mb-6">
                            Create email steps to build your campaign sequence.
                        </p>
                        <button className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6 cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow mx-auto">
                            <span className="text-accent font-medium">Create Your First Step</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-hidden">
                    <div className="space-y-6 max-h-full overflow-y-auto">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                {/* Delay Indicator (shown before step, except first step) */}
                                {index > 0 && (
                                    <div className="flex items-center justify-center py-4">
                                        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
                                            <ClockIcon className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm font-medium text-orange-700">
                                                Wait {formatDelay(step.delay_hours).toLowerCase()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="bg-white rounded-2xl border border-border-dark p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                                                {step.step_order}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <EnvelopeIcon className="w-4 h-4 text-accent" />
                                                <span className="text-sm font-medium text-accent uppercase">
                                                    {step.type} Step
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                {step.subject || 'No subject set'}
                                            </h3>
                                            {step.delay_hours > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <ClockIcon className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm text-gray-600">
                                                        Delay: {formatDelay(step.delay_hours)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-6 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow">
                                            <span className="text-text-primary font-medium">Edit</span>
                                        </button>
                                        <button className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6 cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow">
                                            <span className="text-accent font-medium">Preview</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStep(step.id)}
                                            className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-red-600 px-6 cursor-pointer hover:bg-red-50 hover:border-red-700 transition-all duration-300 ease-in-out small-button-shadow"
                                        >
                                            <span className="text-red-600 font-medium">Delete</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Email Content Preview</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 mb-1">Subject Line:</div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {step.subject || 'No subject set'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 mb-2">Email Body:</div>
                                            <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[120px]">
                                                <div className="prose prose-sm max-w-none text-gray-700">
                                                    {truncateText(step.body)}
                                                </div>
                                                {(!step.body || step.body.trim() === '') && (
                                                    <div className="text-gray-400 italic">
                                                        No content available
                                                    </div>
                                                )}
                                                {step.body && step.body.length > 150 && (
                                                    <button className="text-accent text-xs mt-3 hover:text-accent-dark underline">
                                                        View Full Content
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CampaignContentTab; 