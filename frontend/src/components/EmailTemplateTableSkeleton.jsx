function EmailTemplateTableSkeleton() {
    return (
        <div className="w-full bg-background-primary border-b border-border-dark ps-6 pe-3 py-2 flex items-center justify-start animate-pulse">
            <div className="h-full w-full grid grid-cols-[3rem_2fr_2fr_3fr_1fr] items-center">
                <div className="w-[1.125rem] h-[1.125rem] border border-border-dark bg-background-secondary"></div>
                <div className="h-5 w-32 bg-background-secondary rounded"></div>
                <div className="h-5 w-40 bg-background-secondary rounded"></div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-background-secondary rounded"></div>
                    <div className="h-4 w-3/4 bg-background-secondary rounded"></div>
                    <div className="h-4 w-1/2 bg-background-secondary rounded"></div>
                    <div className="h-4 w-3/4 bg-background-secondary rounded"></div>
                </div>
                <div className="flex justify-center">
                    <div className="h-9 w-16 bg-background-secondary rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}

export default EmailTemplateTableSkeleton; 