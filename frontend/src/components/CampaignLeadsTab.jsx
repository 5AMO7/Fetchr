import { useState, useEffect } from 'react';
import { PlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import LeadSelector from './LeadSelector';

function CampaignLeadsTab({ campaign }) {
    const [campaignLeads, setCampaignLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [leadSelectorOpen, setLeadSelectorOpen] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchCampaignLeads = async () => {
            try {
                const response = await api.get(`/campaigns/${campaign.id}/campaign-leads`);
                const data = response.data.data || response.data;
                setCampaignLeads(data);
                setLoading(false);
            } catch (err) {
                console.error("API Error:", err);
                showToast('error', 'Failed to load campaign leads');
                setLoading(false);
            }
        };

        if (campaign?.id) {
            fetchCampaignLeads();
        }
    }, [campaign, showToast]);

    const handleRemoveLead = async (campaignLeadId) => {
        if (!window.confirm('Are you sure you want to remove this lead from the campaign?')) {
            return;
        }

        try {
            await api.delete(`/campaigns/${campaign.id}/campaign-leads/${campaignLeadId}`);
            setCampaignLeads(campaignLeads.filter(cl => cl.id !== campaignLeadId));
            showToast('success', 'Lead removed from campaign');
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to remove lead');
        }
    };

    const handleAddLeads = () => {
        setLeadSelectorOpen(true);
    };

    const handleLeadsSelected = async (selectedLeads) => {
        try {
            // Add leads to campaign using bulk operation
            const leadIds = selectedLeads.map(lead => lead.id);
            const response = await api.post(`/campaigns/${campaign.id}/campaign-leads/bulk`, {
                action: 'add',
                lead_ids: leadIds
            });

            // Fetch updated campaign leads
            const updatedResponse = await api.get(`/campaigns/${campaign.id}/campaign-leads`);
            const updatedData = updatedResponse.data.data || updatedResponse.data;
            setCampaignLeads(updatedData);
            
            showToast('success', response.data.message || 'Leads added successfully');
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to add leads');
        }
    };

    const getExcludeLeadIds = () => {
        return campaignLeads.map(cl => cl.lead?.id).filter(Boolean);
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
                    <h2 className="text-xl font-semibold text-text-primary">Campaign Leads</h2>
                    <p className="text-text-secondary-dark mt-1">
                        {campaignLeads.length} lead{campaignLeads.length !== 1 ? 's' : ''} in this campaign
                    </p>
                </div>
                <button 
                    onClick={handleAddLeads}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Leads
                </button>
            </div>

            {campaignLeads.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <UserMinusIcon className="w-16 h-16 text-text-secondary-dark mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-text-primary mb-2">No leads added yet</h3>
                        <p className="text-text-secondary-dark mb-4">
                            Add leads to this campaign to start your outreach sequence.
                        </p>
                        <button 
                            onClick={handleAddLeads}
                            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                        >
                            Add Your First Lead
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-hidden">
                    <div className="bg-background-primary rounded-xl border border-border-dark overflow-hidden">
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-border-dark bg-gray-50">
                            <span className="text-sm font-medium text-text-secondary-dark">Business Name</span>
                            <span className="text-sm font-medium text-text-secondary-dark">Email</span>
                            <span className="text-sm font-medium text-text-secondary-dark">Industry</span>
                            <span className="text-sm font-medium text-text-secondary-dark">Added</span>
                            <span className="text-sm font-medium text-text-secondary-dark">Actions</span>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {campaignLeads.map((campaignLead) => (
                                <div 
                                    key={campaignLead.id} 
                                    className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-border-dark hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-text-primary">
                                            {campaignLead.lead?.business_name || 'N/A'}
                                        </span>
                                        <span className="text-sm text-text-secondary-dark">
                                            {campaignLead.lead?.city && campaignLead.lead?.country 
                                                ? `${campaignLead.lead.city}, ${campaignLead.lead.country}`
                                                : 'Location not specified'
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-text-primary">
                                            {campaignLead.lead?.email || 'No email'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-text-secondary-dark">
                                            {campaignLead.lead?.industry || 'Not specified'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm text-text-secondary-dark">
                                            {new Date(campaignLead.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleRemoveLead(campaignLead.id)}
                                            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <LeadSelector
                isOpen={leadSelectorOpen}
                onClose={() => setLeadSelectorOpen(false)}
                onLeadsSelected={handleLeadsSelected}
                excludeLeadIds={getExcludeLeadIds()}
            />
        </div>
    );
}

export default CampaignLeadsTab; 