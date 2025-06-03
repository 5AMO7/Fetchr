import { UserGroupIcon, BuildingOffice2Icon, MapPinIcon, GlobeAltIcon, ArrowRightIcon, CheckCircleIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook, faLinkedin, faInstagramSquare, faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";
import ConfidenceScoreBadge from "./ConfidenceScoreBadge";
import api from "../utils/api";
import { useState, useRef, useEffect } from "react";
import TooltipWrapper from "./TooltipWrapper";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "./ConfirmDialog";

function CompanyTableRow({id, savedLeadId, name, employees, industry, location, website, facebook, linkedin, instagram, x, confidenceScore, saved, pageType, onExpand, refreshData}) {
    const [isSaved, setIsSaved] = useState(saved);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { showToast } = useToast();
    let notes = "asdasd";

    let websiteIconColor = "text-bad";
    let facebookIconColor = "#CE4040";
    let linkedinIconColor = "#CE4040";
    let instagramIconColor = "#CE4040";
    let xIconColor = "#CE4040";

    useEffect(() => {
        // Close dropdown when clicking outside
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (employees < 10) {
        employees = "<10";
    }
    else if (employees < 50) {
        employees = "10+";
    }
    else if (employees < 100) {
        employees = "50+";
    }
    else {
        employees = "100+";
    }

    website ? websiteIconColor = "text-accent" : websiteIconColor = "text-bad";
    facebook ? facebookIconColor = "#157145" : facebookIconColor = "#CE4040";
    linkedin ? linkedinIconColor = "#157145" : linkedinIconColor = "#CE4040";
    instagram ? instagramIconColor = "#157145" : instagramIconColor = "#CE4040";
    x ? xIconColor = "#157145" : xIconColor = "#CE4040";

    const saveLead = async () => {
        setIsLoading(true);
        try {
            await api.post("/leads/save", { lead_id: id, notes: notes }, {headers: { "Content-Type": "application/json" }});
            setIsSaved(true);
            showToast("success", "Lead saved successfully!");
        } catch (err) {
            console.error("Failed to save lead:", err);
            showToast("error", "Failed to save lead");
        }
        setIsLoading(false);
    };

    const confirmUnsave = () => {
        setIsDropdownOpen(false);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmUnsave = async () => {
        if (!savedLeadId) return;
        
        setIsLoading(true);
        setIsConfirmDialogOpen(false);
        
        try {
            await api.post("/leads/unsave", { saved_lead_id: savedLeadId }, {headers: { "Content-Type": "application/json" }});
            showToast("success", "Lead unsaved successfully!");
            
            // Use refreshData function to refresh the table data
            if (refreshData) {
                refreshData();
            }
        } catch (err) {
            console.error("Failed to unsave lead:", err);
            showToast("error", "Failed to unsave lead");
        }
        setIsLoading(false);
    };

    const handleCancelUnsave = () => {
        setIsConfirmDialogOpen(false);
    };

    // Determine if save button should be shown
    const showSaveButton = pageType !== 'saved-leads';

    // Render save button with disabled state if already saved
    const renderSaveButton = () => {
        if (!showSaveButton) return null;
        
        if (isSaved) {
            return (
                <TooltipWrapper tooltip={'Already saved'}>
                    <div className="h-full flex items-center justify-center bg-background-primary py-[5px] rounded-lg border border-border-dark px-[29px] cursor-not-allowed opacity-50">
                        <CheckCircleIcon className="w-6 h-6 text-accent stroke-2" />
                    </div>
                </TooltipWrapper>
            );
        }
        
        return (
            <div className={`h-full flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6  cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow`} onClick={saveLead}>
                {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent mx-2"></div> : <span className="text-accent">Save</span>}
            </div>
        );
    };

    // Render ellipsis button with dropdown menu (only on saved-leads page)
    const renderEllipsisButton = () => {
        if (pageType !== 'saved-leads') return null;
        
        return (
            <div className="relative" ref={dropdownRef}>
                <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="h-full flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-2 py-2 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow">
                    <EllipsisVerticalIcon className="w-4 h-4 text-text-primary stroke-2" />
                </div>
                
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 py-1 w-36 bg-background-primary rounded-md shadow-lg z-10 border border-border-dark">
                        <div 
                            className="block px-4 py-2 text-sm text-text-primary hover:bg-dark-primary cursor-pointer"
                            onClick={() => {
                                setIsDropdownOpen(false);
                                showToast("info", "Add to campaign functionality coming soon!");
                            }}
                        >
                            Add to campaign
                        </div>
                        <div 
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-dark-primary cursor-pointer"
                            onClick={confirmUnsave}
                        >
                            {isLoading ? "Unsaving..." : "Unsave"}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="w-full bg-background-primary border-b border-border-dark ps-6 pe-3 py-2 flex items-center justify-start">
                <div className="flex items-center justify-start h-full pe-5">
                    <input type="checkbox" className="w-[1.125rem] h-[1.125rem] rounded-xl border border-border-dark accent-accent" />
                </div>
                <div className="h-full w-full flex items-center justify-end">
                    <div className="flex items-center gap-5 me-auto">
                        <div className="h-10 w-10 bg-[#FFDADA] rounded-full">
                        </div>
                        <div>
                            <div className="flex items-center justify-start gap-3">
                                <span className="me-2">{name}</span>
                                {website ? (
                                    <TooltipWrapper tooltip={website} icon={'link'}>
                                        <GlobeAltIcon className={`w-5 h-5 stroke-2 ${websiteIconColor} cursor-pointer`} />
                                    </TooltipWrapper>
                                ) : (
                                    <GlobeAltIcon className={`w-5 h-5 stroke-2 ${websiteIconColor} cursor-default`}/>
                                )}
                                {facebook ? (
                                    <TooltipWrapper tooltip={facebook} icon={'link'}>
                                        <FontAwesomeIcon icon={faSquareFacebook} size="lg" color={facebookIconColor} className={facebook ? "cursor-pointer" : "cursor-default"} />
                                    </TooltipWrapper>
                                ) : (
                                    <FontAwesomeIcon icon={faSquareFacebook} size="lg" color={facebookIconColor} className={facebook ? "cursor-pointer" : "cursor-default"} />
                                )}
                                {linkedin ? (
                                    <TooltipWrapper tooltip={linkedin} icon={'link'}>
                                        <FontAwesomeIcon icon={faLinkedin} size="lg" color={linkedinIconColor} className={linkedin ? "cursor-pointer" : "cursor-default"} />
                                    </TooltipWrapper>
                                ) : (
                                    <FontAwesomeIcon icon={faLinkedin} size="lg" color={linkedinIconColor} className={linkedin ? "cursor-pointer" : "cursor-default"} />
                                )}
                                {instagram ? (
                                    <TooltipWrapper tooltip={instagram} icon={'link'}>
                                        <FontAwesomeIcon icon={faInstagramSquare} size="lg" color={instagramIconColor} className={instagram ? "cursor-pointer" : "cursor-default"} />
                                    </TooltipWrapper>
                                ) : (
                                    <FontAwesomeIcon icon={faInstagramSquare} size="lg" color={instagramIconColor} className={instagram ? "cursor-pointer" : "cursor-default"} />
                                )}
                                {x ? (
                                    <TooltipWrapper tooltip={x} icon={'link'}>
                                        <FontAwesomeIcon icon={faSquareXTwitter} size="lg" color={xIconColor} className={x ? "cursor-pointer" : "cursor-default"} />
                                    </TooltipWrapper>
                                ) : (
                                    <FontAwesomeIcon icon={faSquareXTwitter} size="lg" color={xIconColor} className={x ? "cursor-pointer" : "cursor-default"} />
                                )}
                                
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <UserGroupIcon className="w-4 h-4 text-text-secondary stroke-2" />
                                    <span className="text-sm text-text-secondary">{employees}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BuildingOffice2Icon className="w-4 h-4 text-text-secondary stroke-2" />
                                    <span className="text-sm text-text-secondary">{industry}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPinIcon className="w-4 h-4 text-text-secondary stroke-2" />
                                    <span className="text-sm text-text-secondary">{location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TooltipWrapper tooltip={'Confidence score'}>
                        <ConfidenceScoreBadge percentage={confidenceScore} />
                    </TooltipWrapper>

                    <div className="h-9 flex items-center justify-end gap-4 ms-32">
                        <TooltipWrapper tooltip={'Expand'}>
                            <div 
                                onClick={onExpand}
                                className="h-full flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-2 py-2 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow">
                                <ArrowRightIcon className="w-4 h-4 text-text-primary stroke-2 ms-[2px]"/>
                            </div>
                        </TooltipWrapper>
                        {renderSaveButton()}
                        <div className="h-full flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-6 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow">
                            <span className="text-text-primary">Find similar</span>
                        </div>
                        {renderEllipsisButton()}
                    </div>
                </div>
            </div>
            
            <ConfirmDialog
                isOpen={isConfirmDialogOpen}
                onClose={handleCancelUnsave}
                onConfirm={handleConfirmUnsave}
                title="Confirm Unsave"
                message={`Are you sure you want to unsave ${name}? This action cannot be undone.`}
                confirmText="Unsave"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
}

export default CompanyTableRow;