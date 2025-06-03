import Alert from "../components/Alert";
import CompanyTable from "../components/CompanyTable";
import MainLayout from "../layouts/MainLayout";

function SavedLeads() {
    return (
        <MainLayout>
            <h1 className="text-2xl mb-4">Here are your <span className="text-accent font-medium" id="foundCompaniesCount">...</span> saved companies!</h1>
            <CompanyTable data={'saved-leads'}/>
        </MainLayout>
    );
}

export default SavedLeads;