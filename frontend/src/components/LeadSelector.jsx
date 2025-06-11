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
            // Resets state when the modal closes
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
                // Filters out leads that are already in the campaign
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl large-button-shadow w-full max-w-5xl h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 p-8 border-b border-gray-200">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">Select Leads</h3>
                        <p className="text-sm text-gray-600">Choose leads from your saved database to add to this campaign</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-2 py-2 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow"
                    >
                        <XMarkIcon className="w-4 h-4 text-text-primary stroke-2" />
                    </button>
                </div>

                {/* Search and Controls */}
                <div className="p-8 border-b border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by business name, email, industry..."
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400"
                            />
                        </div>
                        <button
                            onClick={handleSelectAll}
                            className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-6 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow"
                        >
                            <span className="text-text-primary">{selectedLeads.length === leads.length ? 'Deselect All' : 'Select All'}</span>
                        </button>
                    </div>
                    {selectedLeads.length > 0 && (
                        <div className="text-sm text-accent font-medium">
                            {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
                        </div>
                    )}
                </div>

                {/* Leads List */}
                <div className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading leads...</p>
                            </div>
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {searchTerm ? 'No matching leads found' : 'No saved leads available'}
                                </h3>
                                <p className="text-gray-600">
                                    {searchTerm 
                                        ? 'Try adjusting your search terms to find leads.' 
                                        : 'Save some leads first to add them to campaigns.'
                                    }
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto">
                            {/* Table Header */}
                            <div className="grid grid-cols-[auto,2fr,2fr,1fr,1fr] gap-4 px-8 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
                                <span></span>
                                <span>Business Name</span>
                                <span>Email</span>
                                <span>Industry</span>
                                <span>Location</span>
                            </div>
                            
                            {/* Leads Rows */}
                            <div className="divide-y divide-gray-200">
                                {leads.map((lead) => {
                                    const isSelected = selectedLeads.find(l => l.id === lead.id);
                                    return (
                                        <div
                                            key={lead.id}
                                            onClick={() => handleLeadSelect(lead)}
                                            className={`grid grid-cols-[auto,2fr,2fr,1fr,1fr] gap-4 px-8 py-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                                                isSelected ? 'bg-accent/5 border-l-4 border-l-accent' : ''
                                            }`}
                                        >
                                            {/* Checkbox */}
                                            <div className="flex items-center">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                                    isSelected 
                                                        ? 'bg-accent border-accent text-white' 
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}>
                                                    {isSelected && <CheckIcon className="w-3 h-3" />}
                                                </div>
                                            </div>
                                            
                                            {/* Business Name */}
                                            <div className="flex flex-col justify-center">
                                                <span className="font-semibold text-gray-900">
                                                    {lead.business_name || 'N/A'}
                                                </span>
                                                {lead.website && (
                                                    <span className="text-sm text-blue-600 hover:text-blue-700">
                                                        {lead.website}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Email */}
                                            <div className="flex flex-col justify-center">
                                                <span className="text-gray-900">
                                                    {lead.email || 'No email'}
                                                </span>
                                                {lead.phone && (
                                                    <span className="text-sm text-gray-600">
                                                        {lead.phone}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Industry */}
                                            <div className="flex items-center">
                                                <span className="text-gray-600">
                                                    {lead.industry || 'Not specified'}
                                                </span>
                                            </div>
                                            
                                            {/* Location */}
                                            <div className="flex items-center">
                                                <span className="text-gray-600 text-sm">
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
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-8 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        {leads.length} lead{leads.length !== 1 ? 's' : ''} available
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-6 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow"
                        >
                            <span className="text-text-primary">Cancel</span>
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selectedLeads.length === 0}
                            className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6 cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="text-accent">Add {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeadSelector; 