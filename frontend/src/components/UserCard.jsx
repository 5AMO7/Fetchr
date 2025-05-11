import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

function UserCard({name, email}) {
    return (
        <div className="flex bg-background-primary cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out select-none large-button-shadow rounded-xl py-3 pe-3 items-center justify-end">
            <div className="flex items-center justify-center h-full px-3">
                <div className="w-12 h-12 bg-text-secondary rounded-full"></div>
            </div>
            <div className="flex flex-col justify-center items-stretch">
                <span className="text-text-primary text-xl">{name}</span>
                <span className="text-text-secondary text-xs">{email}</span>
            </div>
            <div className="ms-auto">
                <ChevronUpDownIcon className="h-6 w-6 text-text-secondary" />
            </div>
        </div>
    );
}

export default UserCard;