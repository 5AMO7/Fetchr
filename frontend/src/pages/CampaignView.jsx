import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CampaignTabSidebar from '../components/CampaignTabSidebar';
import CampaignInformationTab from '../components/CampaignInformationTab';
import CampaignLeadsTab from '../components/CampaignLeadsTab';
import CampaignContentTab from '../components/CampaignContentTab';
import CampaignStatsTab from '../components/CampaignStatsTab';
import CampaignEmailsTab from '../components/CampaignEmailsTab';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function CampaignView() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('information');
    const { showToast } = useToast();

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await api.get(`/campaigns/${id}`);
                setCampaign(response.data);
                setLoading(false);
            } catch (err) {
                console.error("API Error:", err);
                showToast('error', err.response?.data?.message || 'Failed to load campaign');
                setLoading(false);
            }
        };

        if (id) {
            fetchCampaign();
        }
    }, [id, showToast]);

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-full">
                                                <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
                </div>
            );
        }

        if (!campaign) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-text-secondary-dark">Campaign not found</p>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case 'information':
                return <CampaignInformationTab campaign={campaign} onCampaignUpdate={setCampaign} />;
            case 'leads':
                return <CampaignLeadsTab campaign={campaign} />;
            case 'content':
                return <CampaignContentTab campaign={campaign} />;
            case 'stats':
                return <CampaignStatsTab campaign={campaign} />;
            case 'emails':
                return <CampaignEmailsTab campaign={campaign} />;
            default:
                return <CampaignInformationTab campaign={campaign} onCampaignUpdate={setCampaign} />;
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "w-fit px-3 py-1 border rounded-lg text-xs font-medium flex items-center gap-1";
        switch (status) {
            case 'active':
                return `${baseClasses} bg-success text-text-success border-border-success`;
            case 'draft':
                return `${baseClasses} bg-warning text-text-warning border-border-warning`;
            case 'paused':
                return `${baseClasses} bg-attention text-text-attention border-border-attention`;
            case 'completed':
                return `${baseClasses} bg-info text-text-info border-border-info`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <div className='flex h-screen w-screen'>
            <Sidebar />
            
            <CampaignTabSidebar 
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <main className='flex flex-col bg-background-primary w-full h-full overflow-hidden large-section-shadow z-10'>
                {/* Campaign Header */}
                <div className="border-b border-border-dark p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-text-primary">
                                {loading ? 'Loading...' : campaign?.name || 'Campaign'}
                            </h1>
                            {campaign?.description && (
                                <p className="text-text-secondary-dark mt-1">{campaign.description}</p>
                            )}
                        </div>
                        {campaign && (
                            <div className="flex items-center gap-4">
                                <span className={getStatusBadge(campaign.status)}>
                                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                </span>
                                <div className="text-sm text-text-secondary-dark">
                                    Created: {new Date(campaign.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
}

export default CampaignView; 