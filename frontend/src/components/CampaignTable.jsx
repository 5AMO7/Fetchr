import { useState, useEffect } from "react";
import CampaignTableRow from "./CampaignTableRow";
import CampaignTableSkeleton from "./CampaignTableSkeleton";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

function CampaignTable() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await api.get('/campaigns');
                
                const data = response.data.data || response.data; // Handle pagination
                setCampaigns(data);
                setLoading(false);
            } catch (err) {
                console.error("API Error:", err); // Debug log
                showToast('error', err.response?.data?.message || 'Failed to load campaigns');
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [showToast]);

    const handleCampaignDeleted = (campaignId) => {
        setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
    };

    return (
        <div className="flex flex-col w-full h-full bg-background-primary rounded-xl border border-border-dark overflow-hidden shadow-md mt-6">
            <div className="w-full border-b border-border-dark grid grid-cols-[3rem_2fr_3fr_1fr_1fr_1fr] items-center justify-start px-6 py-3">
                <input type="checkbox" className="w-[1.125rem] h-[1.125rem] rounded-xl border border-border-dark accent-accent me-5" />
                <span className="text-text-secondary-dark text-md">Name</span>
                <span className="text-text-secondary-dark text-md">Description</span>
                <span className="text-text-secondary-dark text-md">Status</span>
                <span className="text-text-secondary-dark text-md">Created</span>
                <span className="sr-only">Actions</span>
            </div>
            <div className="w-full h-full flex flex-col overflow-y-scroll overflow-x-hidden">
                {loading ? (
                    <>
                        <CampaignTableSkeleton />
                        <div className="opacity-90">
                            <CampaignTableSkeleton />
                        </div>
                        <div className="opacity-80">
                            <CampaignTableSkeleton />
                        </div>
                        <div className="opacity-70">
                            <CampaignTableSkeleton />
                        </div>
                        <div className="opacity-60">
                            <CampaignTableSkeleton />
                        </div>
                        <div className="opacity-50">
                            <CampaignTableSkeleton />
                        </div>
                        <div className="opacity-40">
                            <CampaignTableSkeleton />
                        </div>
                        <div className="opacity-30">
                            <CampaignTableSkeleton />
                        </div>
                    </>
                ) : campaigns.length === 0 ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                            <p className="text-text-secondary-dark mb-2">You have no campaigns yet.</p>
                            <a href="/campaigns/create" className="text-accent hover:text-accent-dark">
                                Create your first campaign!
                            </a>
                        </div>
                    </div>
                ) : (
                    campaigns.map((campaign) => (
                        <CampaignTableRow 
                            key={campaign.id}
                            id={campaign.id}
                            name={campaign.name} 
                            description={campaign.description} 
                            status={campaign.status}
                            createdAt={campaign.created_at}
                            onDeleted={handleCampaignDeleted}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default CampaignTable; 