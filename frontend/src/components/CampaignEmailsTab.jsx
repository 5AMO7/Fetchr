import { useState, useEffect } from 'react';
import { 
    EnvelopeIcon, 
    ClockIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    EyeIcon,
    CalendarIcon 
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function CampaignEmailsTab({ campaign }) {
    const [stepLogs, setStepLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, sent, pending, failed
    const { showToast } = useToast();

    useEffect(() => {
        const fetchStepLogs = async () => {
            try {
                const response = await api.get(`/campaigns/${campaign.id}/step-logs`);
                setStepLogs(response.data);
                setLoading(false);
            } catch (err) {
                console.error("API Error:", err);
                showToast('error', 'Failed to load email logs');
                setLoading(false);
            }
        };

        if (campaign?.id) {
            fetchStepLogs();
        }
    }, [campaign, showToast]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent':
                return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
            case 'pending':
                return <ClockIcon className="w-5 h-5 text-yellow-600" />;
            case 'failed':
                return <XCircleIcon className="w-5 h-5 text-red-600" />;
            default:
                return <EnvelopeIcon className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case 'sent':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'failed':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not scheduled';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredLogs = stepLogs.filter(log => {
        if (filter === 'all') return true;
        return log.status === filter;
    });

    const statusCounts = {
        all: stepLogs.length,
        sent: stepLogs.filter(log => log.status === 'sent').length,
        pending: stepLogs.filter(log => log.status === 'pending').length,
        failed: stepLogs.filter(log => log.status === 'failed').length
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
                    <h2 className="text-xl font-semibold text-text-primary">Email Status</h2>
                    <p className="text-text-secondary-dark mt-1">
                        Track sent and planned emails for each lead
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
                {[
                    { key: 'all', label: 'All', count: statusCounts.all },
                    { key: 'sent', label: 'Sent', count: statusCounts.sent },
                    { key: 'pending', label: 'Pending', count: statusCounts.pending },
                    { key: 'failed', label: 'Failed', count: statusCounts.failed }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`
                            flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
                            ${filter === tab.key 
                                ? 'bg-white text-text-primary shadow-sm' 
                                : 'text-text-secondary-dark hover:text-text-primary'
                            }
                        `}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {filteredLogs.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <EnvelopeIcon className="w-16 h-16 text-text-secondary-dark mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-text-primary mb-2">
                            {filter === 'all' ? 'No emails found' : `No ${filter} emails`}
                        </h3>
                        <p className="text-text-secondary-dark">
                            {filter === 'all' 
                                ? 'Add leads and start your campaign to see email logs.'
                                : `No emails with status "${filter}" found.`
                            }
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-hidden">
                    <div className="bg-background-primary rounded-xl border border-border-dark overflow-hidden">
                        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-border-dark bg-gray-50">
                            <span className="text-sm font-medium text-text-secondary-dark">Lead</span>
                            <span className="text-sm font-medium text-text-secondary-dark">Step</span>
                            <span className="text-sm font-medium text-text-secondary-dark">Status</span>
                            <span className="text-sm font-medium text-text-secondary-dark">Scheduled</span>
                            <span className="text-sm font-medium text-text-secondary-dark">Sent</span>
                            <span className="text-sm font-medium text-text-secondary-dark">Actions</span>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {filteredLogs.map((log) => (
                                <div 
                                    key={log.id} 
                                    className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-border-dark hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-text-primary">
                                            {log.campaign_lead?.lead?.business_name || 'Unknown Lead'}
                                        </span>
                                        <span className="text-sm text-text-secondary-dark">
                                            {log.campaign_lead?.lead?.email || 'No email'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-text-primary">
                                            Step {log.campaign_step?.step_order} - {log.campaign_step?.type}
                                        </span>
                                        <span className="text-sm text-text-secondary-dark">
                                            {log.campaign_step?.subject || 'No subject'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(log.status)}
                                            <span className={getStatusBadge(log.status)}>
                                                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="w-4 h-4 text-text-secondary-dark" />
                                            <span className="text-sm text-text-secondary-dark">
                                                {formatDate(log.scheduled_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm text-text-secondary-dark">
                                            {log.sent_at ? formatDate(log.sent_at) : '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {log.status === 'sent' && (
                                            <div className="h-8 w-8 flex items-center justify-center bg-background-primary rounded-lg border border-accent cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow">
                                                <EyeIcon className="w-4 h-4 text-accent" />
                                            </div>
                                        )}
                                        {log.status === 'pending' && (
                                            <div className="h-8 flex items-center justify-center bg-background-primary rounded-lg border border-blue-600 px-3 cursor-pointer hover:bg-blue-50 hover:border-blue-700 transition-all duration-300 ease-in-out small-button-shadow">
                                                <span className="text-blue-600 text-sm font-medium">Send Now</span>
                                            </div>
                                        )}
                                        {log.status === 'failed' && (
                                            <div className="h-8 flex items-center justify-center bg-background-primary rounded-lg border border-red-600 px-3 cursor-pointer hover:bg-red-50 hover:border-red-700 transition-all duration-300 ease-in-out small-button-shadow">
                                                <span className="text-red-600 text-sm font-medium">Retry</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CampaignEmailsTab; 