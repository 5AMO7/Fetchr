import { UserGroupIcon, BuildingOffice2Icon, MapPinIcon } from "@heroicons/react/24/outline";

function CompanyTableSkeleton({ pageType = 'explore' }) {
    return (
        <div className="w-full bg-background-primary border-b border-border-dark ps-6 pe-3 py-2 flex items-center justify-start animate-pulse">
            <div className="flex items-center justify-start h-full pe-5">
                <div className="w-[1.125rem] h-[1.125rem]  border border-border-dark bg-background-secondary"></div>
            </div>
            <div className="h-full w-full flex items-center justify-end">
                <div className="flex items-center gap-5 me-auto">
                    <div className="h-10 w-10 bg-background-secondary rounded-full"></div>
                    <div>
                        <div className="flex items-center justify-start gap-3">
                            <div className="h-5 w-48 bg-background-secondary rounded"></div>
                            <div className="h-5 w-5 bg-background-secondary rounded"></div>
                            <div className="h-5 w-5 bg-background-secondary rounded"></div>
                            <div className="h-5 w-5 bg-background-secondary rounded"></div>
                            <div className="h-5 w-5 bg-background-secondary rounded"></div>
                            <div className="h-5 w-5 bg-background-secondary rounded"></div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-4 w-64 bg-background-secondary rounded"></div>
                        </div>

                    </div>
                </div>

                <div className="h-8 w-16 bg-background-secondary rounded-xl"></div>

                <div className="h-9 flex items-center justify-end gap-4 ms-32">
                    <div className="h-full w-9 bg-background-secondary rounded-lg"></div>
                    {pageType === 'explore' && (
                        <div className="h-full w-20 bg-background-secondary rounded-lg"></div>
                    )}
                    <div className="h-full w-32 bg-background-secondary rounded-lg"></div>
                    {pageType === 'saved-leads' && (
                        <div className="h-full w-9 bg-background-secondary rounded-lg"></div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CompanyTableSkeleton; 