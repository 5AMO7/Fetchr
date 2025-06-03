import Alert from "../components/Alert";
import Sidebar from '../components/Sidebar';

function Settings() {
    return (
        <div className='flex h-screen w-screen'>
            <Sidebar />

            <main className='flex flex-col bg-background-primary w-full h-full p-4 px-20 owerflow-hidden large-section-shadow z-10'></main>

        </div>
    );
}

export default Settings;