import { useState, useEffect, useCallback, useMemo } from "react";
import CompanyTableRow from "./CompanyTableRow";
import CompanyDrawer from "./CompanyDrawer";
import CompanyTableSkeleton from "./CompanyTableSkeleton";
import api from "../utils/api";
import { useFilters } from "../context/FilterContext";

function CompanyTable({ data }) {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { filters } = useFilters();
    
    let apiData = "/leads";
    let pageType = "explore";

    if (data == 'saved-leads') {
        apiData = "/leads/saved";
        pageType = "saved-leads";
    }

    // Function to refresh the table data
    const refreshData = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            try {
                const response = await api.get(apiData);
                
                const data = response.data;
                setCompanies(data);
                setLoading(false);
                console.log("Fetched data:", data); // Debug log
                const countElement = document.getElementById("foundCompaniesCount");
                if (countElement) {
                    countElement.innerText = data.length;
                }
            } catch (err) {
                console.error("API Error:", err); // Debug log
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [apiData, refreshTrigger]);

    // Filter companies based on the selected filters
    const filteredCompanies = useMemo(() => {
        if (!companies.length) return [];

        return companies.filter(company => {
            // Filter by company name
            if (filters.companyName && filters.companyName.trim() !== '') {
                const searchTerm = filters.companyName.toLowerCase();
                const companyName = company.business_name.toLowerCase();
                
                if (!companyName.includes(searchTerm)) {
                    return false;
                }
            }
            
            // Filter by industry
            if (filters.industries.length > 0 && !filters.industries.includes(company.industry)) {
                return false;
            }

            // Filter by location
            if (filters.locations.length > 0 && !filters.locations.includes(company.city)) {
                return false;
            }

            // Filter by employee count
            if (filters.employeeCount.length > 0) {
                // Get employee count string representation
                let sizeCategory;
                const count = company.employee_count;
                
                if (count < 10) {
                    sizeCategory = "<10 employees";
                } else if (count < 50) {
                    sizeCategory = "10+ employees";
                } else if (count < 100) {
                    sizeCategory = "50+ employees";
                } else {
                    sizeCategory = "100+ employees";
                }
                
                if (!filters.employeeCount.includes(sizeCategory)) {
                    return false;
                }
            }

            // Filter by social media presence
            if (filters.socialMedia && Object.keys(filters.socialMedia).length > 0) {
                for (const [platform, shouldHave] of Object.entries(filters.socialMedia)) {
                    let companyHasPlatform = false;
                    
                    // Check if company has the platform
                    switch (platform) {
                        case 'website':
                            companyHasPlatform = !!company.website;
                            break;
                        case 'facebook':
                            companyHasPlatform = !!company.facebook;
                            break;
                        case 'linkedin':
                            companyHasPlatform = !!company.linkedin;
                            break;
                        case 'instagram':
                            companyHasPlatform = !!company.instagram;
                            break;
                        case 'twitter':
                            companyHasPlatform = !!company.twitter;
                            break;
                        default:
                            continue;
                    }
                    
                    // If filter is "should have" but company doesn't have it, exclude
                    // If filter is "should not have" but company has it, exclude
                    if (shouldHave !== companyHasPlatform) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [companies, filters]);

    // Update the count of filtered companies
    useEffect(() => {
        const countElement = document.getElementById("foundCompaniesCount");
        if (countElement && filteredCompanies) {
            countElement.innerText = filteredCompanies.length;
        }
    }, [filteredCompanies]);

    const handleCompanyExpand = async (companyId, leadId) => {
        try {
            // Find basic company data from current list
            const companyBasic = companies.find(company => company.id === companyId);
            
            // If we already have complete data, use it directly
            if (companyBasic && Object.keys(companyBasic).length > 10) {
                setSelectedCompany(companyBasic);
                setDrawerOpen(true);
                return;
            }
            
            // Otherwise fetch the detailed company data
            const idToFetch = pageType === 'saved-leads' && leadId ? leadId : companyId;
            const response = await api.get(`/leads/${idToFetch}`);
            setSelectedCompany(response.data);
            setDrawerOpen(true);
        } catch (err) {
            console.error("Failed to fetch company details:", err);
            // If fetch fails, use the basic data anyway
            const companyBasic = companies.find(company => company.id === companyId);
            if (companyBasic) {
                setSelectedCompany(companyBasic);
                setDrawerOpen(true);
            }
        }
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    return (
        <div className="flex flex-col w-full h-full bg-background-primary rounded-xl border border-border-dark overflow-hidden shadow-md mt-6">
            <div className="w-full border-b border-border-dark flex items-center justify-start px-6 py-3">
                <input type="checkbox" className="w-[1.125rem] h-[1.125rem] rounded-xl border border-border-dark accent-accent me-5" />
                <span className="text-text-secondary-dark text-md">Company</span>
            </div>
            <div className="w-full h-full flex flex-col overflow-y-scroll overflow-x-hidden">
                {loading ? (
                    <>
                        <CompanyTableSkeleton pageType={pageType} />
                        <div className="opacity-90">
                            <CompanyTableSkeleton pageType={pageType} />
                        </div>
                        <div className="opacity-80">
                            <CompanyTableSkeleton pageType={pageType} />
                        </div>
                        <div className="opacity-70">
                            <CompanyTableSkeleton pageType={pageType} />
                        </div>
                        <div className="opacity-60">
                            <CompanyTableSkeleton pageType={pageType} />
                        </div>
                        <div className="opacity-50">
                            <CompanyTableSkeleton pageType={pageType} />
                        </div>
                        <div className="opacity-40">
                            <CompanyTableSkeleton pageType={pageType} />
                        </div>
                        <div className="opacity-30">
                            <CompanyTableSkeleton pageType={pageType} />
                        </div>
                    </>
                ) : error ? (
                    <div className="flex items-center justify-center p-4 text-red-500">Error: {error}</div>
                ) : filteredCompanies.length === 0 ? (
                    <div className="flex items-center justify-center p-4">No companies found matching your filters</div>
                ) : (
                    filteredCompanies.map((company) => (
                        <CompanyTableRow 
                            key={company.id}
                            id={pageType === 'saved-leads' ? company.lead_id || company.id : company.id}
                            savedLeadId={pageType === 'saved-leads' ? company.id : null}
                            name={`${company.business_name}, ${company.reg_type}`} 
                            employees={company.employee_count} 
                            industry={company.industry} 
                            location={company.city} 
                            website={company.website}
                            facebook={company.facebook}
                            linkedin={company.linkedin}
                            instagram={company.instagram}
                            twitter={company.twitter}
                            confidenceScore={company.confidence_score}
                            saved={company.saved}
                            pageType={pageType}
                            onExpand={() => handleCompanyExpand(company.id, company.lead_id)}
                            refreshData={refreshData}
                        />
                    ))
                )}
            </div>
            
            <CompanyDrawer 
                company={selectedCompany} 
                isOpen={drawerOpen} 
                onClose={handleDrawerClose} 
            />
        </div>
    );
}

export default CompanyTable;