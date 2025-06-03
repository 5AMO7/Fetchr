import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

function CampaignInformationTab({ campaign, onCampaignUpdate }) {
    const [formData, setFormData] = useState({
        name: campaign?.name || '',
        description: campaign?.description || '',
        status: campaign?.status || 'draft'
    });
    const [originalData, setOriginalData] = useState({
        name: campaign?.name || '',
        description: campaign?.description || '',
        status: campaign?.status || 'draft'
    });
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    // Update form data when campaign changes
    useEffect(() => {
        if (campaign) {
            const newData = {
                name: campaign.name || '',
                description: campaign.description || '',
                status: campaign.status || 'draft'
            };
            setFormData(newData);
            setOriginalData(newData);
        }
    }, [campaign]);

    // Check if form has changes
    const hasChanges = () => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await api.put(`/campaigns/${campaign.id}`, formData);
            onCampaignUpdate(response.data);
            setOriginalData(formData); // Update original data after successful save
            showToast('success', 'Campaign updated successfully');
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to update campaign');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };



    if (!campaign) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-text-secondary-dark">No campaign data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-xl font-semibold text-text-primary">Campaign Information</h2>

                {/* Campaign Name */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        Campaign Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
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
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background-primary text-text-primary resize-none"
                        placeholder="Enter campaign description"
                    />
                </div>

                {/* Campaign Status */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        Status
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background-primary text-text-primary"
                    >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Campaign Details (Read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Created Date
                        </label>
                        <p className="text-text-secondary-dark bg-background-secondary px-3 py-2 rounded-lg border border-border-dark">
                            {new Date(campaign.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Last Modified
                        </label>
                        <p className="text-text-secondary-dark bg-background-secondary px-3 py-2 rounded-lg border border-border-dark">
                            {new Date(campaign.updated_at || campaign.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Campaign ID
                        </label>
                        <p className="text-text-secondary-dark font-mono text-sm bg-background-secondary px-3 py-2 rounded-lg border border-border-dark">
                            {campaign.id}
                        </p>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isLoading || !formData.name.trim() || !hasChanges()}
                        className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CampaignInformationTab; 