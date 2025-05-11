import Alert from "../components/Alert";
import ComponentTable from "../components/ComponentTable";
import MainLayout from "../layouts/MainLayout";

function Explore() {
    return (
        <MainLayout>
            <h1 className="text-2xl mb-4">We found <span className="text-accent font-medium" id="foundCompaniesCount">...</span> companies for you!</h1>
            <Alert type={"info"} message={"This is an alert message, maybe something that is wrong, or just a message that warns the user of something, it can also be blue with an information circle in case of just reminding or reporting to the user."}/>
            <ComponentTable />
        </MainLayout>
    );
}

export default Explore;