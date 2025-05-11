import { useState, useEffect } from "react";
import CompanyTableRow from "./CompanyTableRow";

function ComponentTable() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/leads');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                setCompanies(data);
                setLoading(false);
                console.log("Fetched data:", data); // Debug log
                document.getElementById("foundCompaniesCount").innerText = data.length;
            } catch (err) {
                console.error("API Error:", err); // Debug log
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    return (
        <div className="flex flex-col w-full h-full bg-background-primary rounded-xl border border-border-dark overflow-hidden shadow-md mt-6">
            <div className="w-full border-b border-border-dark flex items-center justify-start px-6 py-3">
                <input type="checkbox" className="w-[1.125rem] h-[1.125rem] rounded-xl border border-border-dark accent-accent me-5" />
                <span className="text-text-secondary-dark text-md">Company</span>
            </div>
            <div className="w-full h-full flex flex-col overflow-y-scroll overflow-x-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-4">Loading companies...</div>
                ) : error ? (
                    <div className="flex items-center justify-center p-4 text-red-500">Error: {error}</div>
                ) : companies.length === 0 ? (
                    <div className="flex items-center justify-center p-4">No companies found</div>
                ) : (
                    companies.map((company) => (
                        <CompanyTableRow 
                            key={company.id}
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
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default ComponentTable;