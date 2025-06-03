import { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function LeadSelector({ isOpen, onClose, onLeadsSelected, excludeLeadIds = [] }) {
    const [leads, setLeads] = useState([]);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { showToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchLeads();
        } else {
            // Reset state when modal closes
            setSelectedLeads([]);
            setSearchTerm('');
            setCurrentPage(1);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchLeads();
        }
    }, [searchTerm, currentPage]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            params.append('page', currentPage);
            
            const response = await api.get(`/leads/saved?${params}`);
            const data = response.data.data || response.data;
            
            if (Array.isArray(data)) {
                // Filter out leads that are already in the campaign
                const filteredLeads = data.filter(lead => !excludeLeadIds.includes(lead.id));
                setLeads(filteredLeads);
                setTotalPages(response.data.last_page || 1);
            } else {
                setLeads([]);
            }
        } catch (err) {
            console.error("Failed to fetch saved leads:", err);
            showToast('error', 'Failed to load saved leads');
        } finally {
            setLoading(false);
        }
    };

    const handleLeadSelect = (lead) => {
        setSelectedLeads(prev => {
            const isSelected = prev.find(l => l.id === lead.id);
            if (isSelected) {
                return prev.filter(l => l.id !== lead.id);
            } else {
                return [...prev, lead];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedLeads.length === leads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(leads);
        }
    };

    const handleConfirm = () => {
        onLeadsSelected(selectedLeads);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background-primary rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-dark">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary">Select Saved Leads</h2>
                        <p className="text-text-secondary-dark text-sm mt-1">
                            Choose from your saved leads to add to this campaign
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Search and Controls */}
                <div className="p-6 border-b border-border-dark">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search saved leads by business name, email, or industry..."
                                className="w-full pl-10 pr-4 py-2 border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleSelectAll}
                            className="px-4 py-2 text-sm border border-border-dark rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {selectedLeads.length === leads.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                    {selectedLeads.length > 0 && (
                        <div className="mt-2 text-sm text-accent">
                            {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
                        </div>
                    )}
                </div>

                {/* Leads List */}
                <div className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-text-secondary-dark">
                                    {searchTerm ? 'No saved leads found matching your search.' : 'No saved leads available. Save some leads first to add them to campaigns.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto">
                            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-border-dark bg-gray-50 text-sm font-medium text-text-secondary-dark">
                                <span></span>
                                <span>Business Name</span>
                                <span>Email</span>
                                <span>Industry</span>
                                <span>Location</span>
                            </div>
                            {leads.map((lead) => {
                                const isSelected = selectedLeads.find(l => l.id === lead.id);
                                return (
                                    <div
                                        key={lead.id}
                                        onClick={() => handleLeadSelect(lead)}
                                        className={`grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-border-dark cursor-pointer transition-colors ${
                                            isSelected ? 'bg-accent/10 border-accent/20' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                isSelected 
                                                    ? 'bg-accent border-accent text-white' 
                                                    : 'border-gray-300'
                                            }`}>
                                                {isSelected && <CheckIcon className="w-3 h-3" />}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-text-primary">
                                                {lead.business_name || 'N/A'}
                                            </span>
                                            {lead.website && (
                                                <span className="text-xs text-blue-600">
                                                    {lead.website}
                                                </span>
                                            )}
                                            {lead.notes && (
                                                <span className="text-xs text-text-secondary-dark italic">
                                                    Note: {lead.notes}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-text-primary">
                                                {lead.email || 'No email'}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-text-secondary-dark">
                                                {lead.industry || 'Not specified'}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-text-secondary-dark">
                                                {lead.city && lead.country 
                                                    ? `${lead.city}, ${lead.country}`
                                                    : 'Not specified'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-border-dark">
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-border-dark rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 text-sm text-text-secondary-dark">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border border-border-dark rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border-dark">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={selectedLeads.length === 0}
                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LeadSelector; 