import Sidebar from '../components/Sidebar';
import FilterSidebar from '../components/FilterSidebar';

function MainLayout({children}) {
    return (
        <div className='flex h-screen w-screen'>
            <Sidebar />

            <main className='flex flex-col bg-background-primary w-full h-full p-4 px-20 owerflow-hidden large-section-shadow z-10'>{children}</main>

            <FilterSidebar />
        </div>
    );
}

export default MainLayout;