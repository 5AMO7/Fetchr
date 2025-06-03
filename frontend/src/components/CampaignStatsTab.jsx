import { useState, useEffect } from 'react';
import { 
    ChartBarIcon, 
    EnvelopeIcon, 
    EyeIcon, 
    ExclamationTriangleIcon,
    UserGroupIcon 
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function CampaignStatsTab({ campaign }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get(`/campaigns/${campaign.id}/stats`);
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                console.error("API Error:", err);
                showToast('error', 'Failed to load campaign statistics');
                setLoading(false);
            }
        };

        if (campaign?.id) {
            fetchStats();
        }
    }, [campaign, showToast]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Leads',
            value: stats?.total_leads || 0,
            icon: UserGroupIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Emails Sent',
            value: stats?.emails_sent || 0,
            icon: EnvelopeIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Emails Opened',
            value: stats?.emails_opened || 0,
            icon: EyeIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Emails Failed',
            value: stats?.emails_failed || 0,
            icon: ExclamationTriangleIcon,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        }
    ];

    return (
        <div className="h-full flex flex-col p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Campaign Statistics</h2>
                <p className="text-text-secondary-dark mt-1">
                    Overview of your campaign performance and metrics
                </p>
            </div>

            {stats ? (
                <div className="flex-1">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="bg-background-primary rounded-xl border border-border-dark p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-text-secondary-dark">
                                                {stat.title}
                                            </p>
                                            <p className="text-2xl font-bold text-text-primary mt-1">
                                                {stat.value.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                            <Icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Open Rate Card */}
                        <div className="bg-background-primary rounded-xl border border-border-dark p-6">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Open Rate</h3>
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative w-32 h-32">
                                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            stroke="#e5e7eb"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            stroke="#10b981"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(stats.open_rate || 0) * 3.14} 314`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-text-primary">
                                            {stats.open_rate || 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-text-secondary-dark text-center">
                                {stats.emails_opened || 0} out of {stats.emails_sent || 0} emails opened
                            </p>
                        </div>

                        {/* Campaign Progress */}
                        <div className="bg-background-primary rounded-xl border border-border-dark p-6">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Campaign Progress</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-text-secondary-dark">Steps Created</span>
                                        <span className="text-text-primary">{stats.total_steps || 0}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: stats.total_steps > 0 ? '100%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-text-secondary-dark">Leads Added</span>
                                        <span className="text-text-primary">{stats.total_leads || 0}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full" 
                                            style={{ width: stats.total_leads > 0 ? '100%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-text-secondary-dark">Emails Sent</span>
                                        <span className="text-text-primary">{stats.emails_sent || 0}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-purple-600 h-2 rounded-full" 
                                            style={{ 
                                                width: stats.total_leads > 0 
                                                    ? `${((stats.emails_sent || 0) / (stats.total_leads * (stats.total_steps || 1))) * 100}%` 
                                                    : '0%' 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-background-primary rounded-xl border border-border-dark p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Campaign Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {((stats.emails_sent || 0) > 0 ? ((stats.emails_opened || 0) / (stats.emails_sent || 1)) * 100 : 0).toFixed(1)}%
                                </div>
                                <div className="text-sm text-text-secondary-dark">Success Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.total_steps || 0}
                                </div>
                                <div className="text-sm text-text-secondary-dark">Total Steps</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {stats.total_leads || 0}
                                </div>
                                <div className="text-sm text-text-secondary-dark">Total Leads</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <ChartBarIcon className="w-16 h-16 text-text-secondary-dark mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-text-primary mb-2">No statistics available</h3>
                        <p className="text-text-secondary-dark">
                            Add leads and steps to your campaign to see statistics.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CampaignStatsTab; 