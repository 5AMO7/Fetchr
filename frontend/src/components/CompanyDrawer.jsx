import { XMarkIcon, UserGroupIcon, BuildingOffice2Icon, MapPinIcon, GlobeAltIcon, PhoneIcon, EnvelopeIcon, CalendarIcon, CurrencyDollarIcon, DocumentTextIcon, ClockIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook, faLinkedin, faInstagramSquare, faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";
import { AnimatePresence } from "motion/react";
import * as Motion from "motion/react";
import DividerLine from "./DividerLine";
import TooltipWrapper from "./TooltipWrapper";

function CompanyDrawer({ company, isOpen, onClose }) {
    if (!company) return null;

    // Determine social media icon colors
    const websiteIconColor = company.website ? "text-accent" : "text-bad";
    const facebookIconColor = company.facebook ? "#157145" : "#CE4040";
    const linkedinIconColor = company.linkedin ? "#157145" : "#CE4040";
    const instagramIconColor = company.instagram ? "#157145" : "#CE4040";
    const twitterIconColor = company.twitter ? "#157145" : "#CE4040";

    // Format employee count
    let formattedEmployees = company.employee_count;
    if (formattedEmployees < 10) {
        formattedEmployees = "<10 employees";
    } else if (formattedEmployees < 50) {
        formattedEmployees = "10+ employees";
    } else if (formattedEmployees < 100) {
        formattedEmployees = "50+ employees";
    } else {
        formattedEmployees = "100+ employees";
    }

    // Format profitability status
    const profitabilityStatus = company.profitable === true ? "Profitable" : 
                                company.profitable === false ? "Not profitable" : 
                                "Unknown profitability";

    return (
        <AnimatePresence>
            {isOpen && (
                <Motion.motion.div
                    initial={{ x: 500 }}
                    animate={{ x: 0 }}
                    exit={{ x: 500 }}
                    transition={{ ease: "easeOut", duration: 0.25 }}
                    className="fixed top-0 right-0 z-50 h-full w-[450px] bg-background-secondary shadow-xl border-l border-border-dark"
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark">
                            <h2 className="text-2xl font-medium text-text-primary">Company Details</h2>
                            <button 
                                onClick={onClose}
                                className="bg-background-primary p-[6px] rounded-lg border border-border-light hover:bg-dark-primary hover:border-border-light duration-300 transition-all small-button-shadow"
                            >
                                <XMarkIcon className="h-4 w-4 text-text-primary stroke-2" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 bg-[#FFDADA] rounded-full"></div>
                                <div>
                                    <h3 className="text-xl font-medium">{company.business_name}</h3>
                                    <div className="text-text-secondary">{company.reg_type} {company.registration_number}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                {company.website && (
                                    <TooltipWrapper tooltip={company.website} icon={'link'}>
                                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                                            <GlobeAltIcon className={`w-6 h-6 stroke-2 ${websiteIconColor}`} />
                                        </a>
                                    </TooltipWrapper>
                                )}
                                {company.facebook && (
                                    <TooltipWrapper tooltip={company.facebook} icon={'link'}>
                                        <a href={company.facebook} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={faSquareFacebook} size="xl" color={facebookIconColor} />
                                        </a>
                                    </TooltipWrapper>
                                )}
                                {company.linkedin && (
                                    <TooltipWrapper tooltip={company.linkedin} icon={'link'}>
                                        <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={faLinkedin} size="xl" color={linkedinIconColor} />
                                        </a>
                                    </TooltipWrapper>
                                )}
                                {company.instagram && (
                                    <TooltipWrapper tooltip={company.instagram} icon={'link'}>
                                        <a href={company.instagram} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={faInstagramSquare} size="xl" color={instagramIconColor} />
                                        </a>
                                    </TooltipWrapper>
                                )}
                                {company.twitter && (
                                    <TooltipWrapper tooltip={company.twitter} icon={'link'}>
                                        <a href={company.twitter} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={faSquareXTwitter} size="xl" color={twitterIconColor} />
                                        </a>
                                    </TooltipWrapper>
                                )}
                            </div>

                            <DividerLine />

                            <div className="mt-6 space-y-4">
                                <h4 className="text-lg font-medium mb-2">Contact Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {company.email && (
                                        <div className="flex items-center gap-2">
                                            <EnvelopeIcon className="h-5 w-5 text-text-secondary" />
                                            <a href={`mailto:${company.email}`} className="text-accent hover:underline hover:text-accent-dark">{company.email}</a>
                                        </div>
                                    )}
                                    {company.phone_number && (
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon className="h-5 w-5 text-text-secondary" />
                                            <a href={`tel:${company.phone_number}`} className="text-accent hover:underline hover:text-accent-dark">{company.phone_number}</a>
                                        </div>
                                    )}
                                </div>

                                <h4 className="text-lg font-medium mt-6 mb-2">Business Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <UserGroupIcon className="h-5 w-5 text-text-secondary" />
                                        <span>{formattedEmployees}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BuildingOffice2Icon className="h-5 w-5 text-text-secondary" />
                                        <span>{company.industry || "Unknown industry"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPinIcon className="h-5 w-7 text-text-secondary" />
                                        <span>{[company.address, company.city, company.country].filter(Boolean).join(", ")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-5 w-5 text-text-secondary" />
                                        <span>{company.founded_date ? `Founded: ${company.founded_date}` : "Founded date unknown"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CurrencyDollarIcon className="h-5 w-5 text-text-secondary" />
                                        <span>{profitabilityStatus}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="h-5 w-7 text-text-secondary" />
                                        <span>Last verified: {company.last_verified_at || "Unknown"}</span>
                                    </div>
                                </div>

                                {company.description && (
                                    <>
                                        <h4 className="text-lg font-medium mt-6 mb-2">Description</h4>
                                        <div className="flex items-start gap-2 mt-2">
                                            {/* <DocumentTextIcon className="h-5 w-7 text-text-secondary mt-1" /> */}
                                            <p className="text-text-secondary-dark">{company.description}</p>
                                        </div>
                                    </>
                                )}

                                {company.source && (
                                    <div className="mt-6 text-sm text-text-secondary">
                                        Source: {company.source}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Motion.motion.div>
            )}
        </AnimatePresence>
    );
}

export default CompanyDrawer; 