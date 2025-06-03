import { useState, useEffect } from 'react';
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

    const truncateText = (text, maxLength = 100) => {
        if (!text) return 'No content';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">Campaign Content</h2>
                    <p className="text-text-secondary-dark mt-1">
                        {steps.length} step{steps.length !== 1 ? 's' : ''} in this campaign sequence
                    </p>
                </div>
                <div
                    className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6 cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow"
                >
                    <PlusIcon className="w-4 h-4 text-accent mr-2" />
                    <span className="text-accent font-medium">Add Step</span>
                </div>
            </div>

            {steps.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <DocumentTextIcon className="w-16 h-16 text-text-secondary-dark mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-text-primary mb-2">No steps added yet</h3>
                        <p className="text-text-secondary-dark mb-4">
                            Create email steps to build your campaign sequence.
                        </p>
                        <div className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6 cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow">
                            <span className="text-accent font-medium">Create Your First Step</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-hidden">
                    <div className="space-y-4 max-h-full overflow-y-auto">
                        {steps.map((step, index) => (
                            <div key={step.id} className="bg-background-primary rounded-xl border border-border-dark p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-semibold">
                                                {step.step_order}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <EnvelopeIcon className="w-4 h-4 text-accent" />
                                                <span className="text-sm font-medium text-accent uppercase">
                                                    {step.type} Step
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-text-primary">
                                                {step.subject}
                                            </h3>
                                            {step.delay_hours > 0 && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <ClockIcon className="w-4 h-4 text-text-secondary-dark" />
                                                    <span className="text-sm text-text-secondary-dark">
                                                        Delay: {formatDelay(step.delay_hours)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 flex items-center justify-center bg-background-primary rounded-lg border border-blue-600 px-3 cursor-pointer hover:bg-blue-50 hover:border-blue-700 transition-all duration-300 ease-in-out small-button-shadow">
                                            <span className="text-blue-600 text-sm font-medium">Edit</span>
                                        </div>
                                        <div className="h-8 flex items-center justify-center bg-background-primary rounded-lg border border-accent px-3 cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow">
                                            <span className="text-accent text-sm font-medium">Preview</span>
                                        </div>
                                        <div
                                            onClick={() => handleDeleteStep(step.id)}
                                            className="h-8 flex items-center justify-center bg-background-primary rounded-lg border border-red-600 px-3 cursor-pointer hover:bg-red-50 hover:border-red-700 transition-all duration-300 ease-in-out small-button-shadow"
                                        >
                                            <span className="text-red-600 text-sm font-medium">Delete</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-text-secondary-dark mb-2">Email Content Preview:</h4>
                                    <div className="text-sm text-text-primary">
                                        <p className="mb-2"><strong>Subject:</strong> {step.subject}</p>
                                        <div className="bg-white rounded border p-3">
                                            <div 
                                                className="prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ 
                                                    __html: truncateText(step.body?.replace(/\n/g, '<br>'))
                                                }}
                                            />
                                            {step.body && step.body.length > 100 && (
                                                <span className="text-accent text-xs mt-2 hover:text-accent-dark cursor-pointer underline">
                                                    View Full Content
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="flex justify-center mt-6">
                                        <div className="w-px h-8 bg-border-dark"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CampaignContentTab; 