import { ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

function Alert({type, message}) {
    let iconColor = "text-text-info";
    let borderColor = "border-border-info";
    let backgroundColor = "bg-info";
    let icon = null;

    if (type == "info") {
        iconColor = "text-text-info";
        borderColor = "border-border-info";
        backgroundColor = "bg-info";
        icon = <InformationCircleIcon className={`w-5 h-5 ${iconColor}`} />
    }
    else if (type == "warning") {
        iconColor = "text-text-warning";
        borderColor = "border-border-warning";
        backgroundColor = "bg-warning";
        icon = <ExclamationTriangleIcon className={`w-5 h-5 ${iconColor}`} />
    }
    else if (type == "error") {
        iconColor = "text-text-danger";
        borderColor = "border-border-danger";
        backgroundColor = "bg-danger";
        icon = <ExclamationCircleIcon className={`w-5 h-5 ${iconColor}`} />
    }

    return (
        <div className={`flex items-center w-full px-4 py-2 ${backgroundColor} border ${borderColor} rounded-xl gap-4`}>
            <span>{icon}</span>
            <span className={`text-sm ${iconColor}`}>{message}</span>
        </div>
    );
}

export default Alert;