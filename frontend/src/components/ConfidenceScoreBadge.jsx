import { ShieldCheckIcon } from "@heroicons/react/24/outline";

function ConfidenceScoreBadge({percentage}) {
    let badgeBackground = "bg-background-secondary";
    let badgeBorder = "border-border-dark";
    let badgeText = "text-text-secondary";
    if (percentage < 35) {
        badgeBackground = "bg-danger";
        badgeBorder = "border-border-danger";
        badgeText = "text-text-danger";
    }
    else if (percentage < 60) {
        badgeBackground = "bg-warning";
        badgeBorder = "border-border-warning";
        badgeText = "text-text-warning";
    } else if (percentage < 85) {
        badgeBackground = "bg-attention";
        badgeBorder = "border-border-attention";
        badgeText = "text-text-attention";
    } else if (percentage >= 85) {
        badgeBackground = "bg-success";
        badgeBorder = "border-border-success";
        badgeText = "text-text-success";
    }

    return (
        <div className={`flex items-center gap-1 ${badgeBackground} rounded-lg border ${badgeBorder} py-1 px-2`}>
            <ShieldCheckIcon className={`h-5 w-5 ${badgeText} stroke-2`}/>
            <span className={`${badgeText} font-medium text-sm`}>{percentage}%</span>
        </div>
    );
}

export default ConfidenceScoreBadge;