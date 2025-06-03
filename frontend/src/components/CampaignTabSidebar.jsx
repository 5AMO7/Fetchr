import { 
    UserGroupIcon, 
    DocumentTextIcon, 
    ChartBarIcon, 
    EnvelopeIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

function CampaignTabSidebar({ activeTab, onTabChange }) {
    const tabs = [
        {
            id: 'information',
            name: 'Information',
            icon: InformationCircleIcon,
            description: 'Campaign details & settings'
        },
        {
            id: 'leads',
            name: 'Leads',
            icon: UserGroupIcon,
            description: 'Manage campaign leads'
        },
        {
            id: 'content',
            name: 'Content',
            icon: DocumentTextIcon,
            description: 'Campaign steps & templates'
        },
        {
            id: 'stats',
            name: 'Stats',
            icon: ChartBarIcon,
            description: 'Campaign analytics'
        },
        {
            id: 'emails',
            name: 'Emails',
            icon: EnvelopeIcon,
            description: 'Sent & planned emails'
        }
    ];

    return (
        <div className="flex flex-col bg-background-secondary h-full w-80 border-r border-border-dark shadow-lg">
            <div className="p-4 border-b border-border-dark">
                <h2 className="text-lg font-semibold text-text-primary">Campaign Tabs</h2>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                w-full flex items-center px-4 py-3  text-sm rounded-lg hover:border-transparent duration-300 ease-in-out transition-colors group
                                ${isActive 
                                    ? 'bg-background-primary small-button-shadow' 
                                    : 'bg-background-secondary hover:bg-background-primary'
                                }
                            `}
                        >
                            <Icon 
                                className={`
                                    w-5 h-5 mr-3 stroke-2
                                    ${isActive ? 'text-accent' : 'text-text-primary'}
                                `} 
                            />
                            <div className="flex flex-col items-start">
                                <span className={`font-medium ${isActive ? 'text-accent' : 'text-text-primary'}`}>{tab.name}</span>
                                <span className={`
                                    text-xs mt-1 text-start 
                                    ${isActive ? 'text-accent' : 'text-text-secondary-dark'}
                                `}>
                                    {tab.description}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

export default CampaignTabSidebar; 