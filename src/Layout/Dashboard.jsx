import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="grid grid-cols-12 min-h-screen">
            <div className="col-span-4 bg-red-400">
                <ul>
                    <li><NavLink className="bg-blue-600" to="/dashboard/addPet">Add a pet</NavLink></li>
                    <li><NavLink className="bg-blue-600" to="/dashboard/myAddPet">My added pets</NavLink></li>
                    <li><NavLink className="bg-blue-600" to="/dashboard/adoptionRequest">Adoption Request</NavLink></li>
                    <li><NavLink className="bg-blue-600" to="/dashboard/createDonationsCampaign">Create Donations Campaign</NavLink></li>
                    <li><NavLink className="bg-blue-600" to="/dashboard/myDonationsCampaign">My Donations Campaign</NavLink></li>
                    <li><NavLink className="bg-blue-600" to="/dashboard/myDonations">My Donations</NavLink></li>
                </ul>
            </div>
            <div className="col-span-8 bg-green-600">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;