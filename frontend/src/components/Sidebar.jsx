import { ArrowLeftIcon, MagnifyingGlassIcon, BriefcaseIcon, ClipboardDocumentListIcon, EnvelopeIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import NavGroup from './NavGroup';
import NavItem from './NavItem';
import DividerLine from './DividerLine';
import UserCard from './UserCard';

function Sidebar() {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <aside className="bg-background-secondary p-3 flex flex-col justify-end">
            <div className="flex items-center justify-between ps-3 pe-5 pb-4">
                <img src="/fetchr-logo.svg" alt="Fetchr"/>
                <span type="button" className='bg-background-primary border border-border-light p-[6px] rounded-lg cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow'>
                    <ArrowLeftIcon className="h-4 w-4 text-text-primary stroke-2" />
                </span>
            </div>

            <DividerLine width="w-[19rem]" />

            <div className='flex flex-col gap-1 mt-5 mb-auto'>
                <NavGroup title="GENERAL">
                    <NavItem icon={MagnifyingGlassIcon} text="Explore" path={'/explore'} />
                </NavGroup>
                <NavGroup title="TOOLS">
                    <NavItem icon={BriefcaseIcon} text="Saved leads" path={'/saved-leads'} />
                    <NavItem icon={ClipboardDocumentListIcon} text="Campaigns" path={'/campaigns'} />
                    <NavItem icon={EnvelopeIcon} text="Email Templates" path={'/email-templates'} />
                </NavGroup>
            </div>

            <div className='flex flex-col mb-4 gap-1'>
                <NavItem icon={Cog6ToothIcon} text="Settings" path={'/settings'} />
                <NavItem icon={QuestionMarkCircleIcon} text="Support" path={'/support'} />
            </div>
            

            <DividerLine width="w-[19rem]" />

            <div className='my-8'>
                <UserCard onProfileClick={handleProfileClick} />
            </div>

            <div className='flex justify-center items-center w-full'>
                <span className='text-text-secondary text-sm'>@ 2025 Fetchr</span>
            </div>
        </aside>
    );
}

export default Sidebar;