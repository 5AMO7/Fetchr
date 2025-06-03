import { useState } from 'react';
import { ArrowRightIcon, PauseCircleIcon, PlayCircleIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from './ConfirmDialog';
import TooltipWrapper from './TooltipWrapper';

function CampaignTableRow({ id, name, description, status, createdAt, onDeleted }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteConfirm(false);
        setIsDeleting(true);
        
        try {
            await api.delete(`/campaigns/${id}`);
            showToast('success', 'Campaign deleted successfully');
            onDeleted(id);
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to delete campaign');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return <PlayCircleIcon className="w-4 h-4 text-text-success stroke-2" />;
            case 'draft':
                return <ExclamationCircleIcon className="w-4 h-4 text-text-warning stroke-2" />;
            case 'paused':
                return <PauseCircleIcon className="w-4 h-4 text-text-attention stroke-2" />;
            case 'completed':
                return <CheckCircleIcon className="w-4 h-4 text-text-info stroke-2" />;
            default:
                return null;
        }
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return 'No description';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <>
            <div className="w-full border-b border-border-dark grid grid-cols-[3rem_2fr_3fr_1fr_1fr_1fr] items-center justify-start px-6 py-4 hover:bg-gray-50 transition-colors">
                <input 
                    type="checkbox" 
                    className="w-[1.125rem] h-[1.125rem] rounded-xl border border-border-dark accent-accent me-5" 
                />
                
                <div className="flex flex-col">
                    <span className="text-text-primary font-medium">{name}</span>
                </div>
                
                <div className="flex flex-col">
                    <span className="text-text-secondary-dark text-sm" title={description}>
                        {truncateText(description)}
                    </span>
                </div>
                
                <div className="flex flex-col">
                    <span className={getStatusBadge(status)}>
                        {getStatusIcon(status)}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
                
                <div className="flex flex-col">
                    <span className="text-text-secondary-dark text-sm">
                        {formatDate(createdAt)}
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                    <TooltipWrapper tooltip={'Expand'}>
                        <div 
                            onClick={() => navigate(`/campaigns/${id}`)}
                            className="h-full flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-2 py-2 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow">
                            <ArrowRightIcon className="w-4 h-4 text-text-primary stroke-2 ms-[2px]"/>
                        </div>
                    </TooltipWrapper>
                    <button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Campaign"
                message={`Are you sure you want to delete the campaign "${name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
}

export default CampaignTableRow; 