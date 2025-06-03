import Sidebar from '../components/Sidebar';
import CampaignTable from "../components/CampaignTable";
import { NavLink } from 'react-router-dom';

function Campaigns() {
    return (
        <div className='flex h-screen w-screen'>
            <Sidebar />

            <main className='flex flex-col bg-background-primary w-full h-full p-4 px-20 overflow-hidden large-section-shadow z-10'>
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl">Your Campaigns</h1>
                    <NavLink to={'/campaigns/create'} className="h-9 flex items-center justify-center bg-background-primary rounded-lg border border-accent px-6 cursor-pointer hover:bg-dark-primary hover:border-accent-dark transition-all duration-300 ease-in-out small-button-shadow">
                        <span className="text-accent">Create a new campaign</span>
                    </NavLink>
                </div>
                <CampaignTable />
            </main>
        </div>
    );
}

export default Campaigns;