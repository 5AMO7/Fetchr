function CampaignTableSkeleton() {
    return (
        <div className="w-full border-b border-border-dark grid grid-cols-[3rem_2fr_3fr_1fr_1fr_1fr] items-center justify-start px-6 py-4 animate-pulse">
            <div className="w-[1.125rem] h-[1.125rem] bg-gray-200 rounded"></div>
            
            <div className="flex flex-col gap-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            
            <div className="flex flex-col gap-1">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
            
            <div className="flex flex-col">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
            
            <div className="flex flex-col">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            
            <div className="flex items-center gap-2">
                <div className="h-7 bg-gray-200 rounded w-12"></div>
                <div className="h-7 bg-gray-200 rounded w-12"></div>
                <div className="h-7 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    );
}

export default CampaignTableSkeleton; 