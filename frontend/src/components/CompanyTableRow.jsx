import { UserGroupIcon, BuildingOffice2Icon, MapPinIcon, GlobeAltIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook, faLinkedin, faInstagramSquare, faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";
import ConfidenceScoreBadge from "./ConfidenceScoreBadge";

function CompanyTableRow({name, employees, industry, location, website, facebook, linkedin, instagram, x, confidenceScore}) {
    let websiteIconColor = "text-bad";
    let facebookIconColor = "#CE4040";
    let linkedinIconColor = "#CE4040";
    let instagramIconColor = "#CE4040";
    let xIconColor = "#CE4040";

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

    return (
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
                            <GlobeAltIcon className={`w-5 h-5 stroke-2 ${websiteIconColor}`} />
                            <FontAwesomeIcon icon={faSquareFacebook} size="lg" color={facebookIconColor} />
                            <FontAwesomeIcon icon={faLinkedin} size="lg" color={linkedinIconColor} />
                            <FontAwesomeIcon icon={faInstagramSquare} size="lg" color={instagramIconColor} />
                            <FontAwesomeIcon icon={faSquareXTwitter} size="lg" color={xIconColor} />
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

                <ConfidenceScoreBadge percentage={confidenceScore} />

                <div className="h-9 flex items-center justify-end gap-4 ms-32">
                    <div className="h-full flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-2 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow">
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 text-text-primary stroke-2 ms-[2px]"/>
                    </div>
                    <div className="h-full flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow">
                        <span className="text-accent">Save</span>
                    </div>
                    <div className="h-full flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-6 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow">
                        <span className="text-text-primary">Find similar</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyTableRow;