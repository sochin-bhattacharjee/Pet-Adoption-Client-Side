import { Link, NavLink, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const isAdmin = true;
  const {user} = useAuth();
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Helmet>
        <title>Pet Adoption | Dashboard</title>
      </Helmet>

      <div className="md:w-1/4 w-full bg-red-500 text-white p-4 space-y-4">
        <Link to="/dashboard">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        </Link>
        <div>
            <img className="w-16 h-16 rounded-full mx-auto" src={user?.photoURL} alt="" />
            <p className="text-center font-semibold">{user?.displayName}</p>
            {
                isAdmin && <p className="text-center font-semibold">Admin</p>
            }
        </div>
        <ul className="space-y-2">
          {isAdmin ? (
            <>
              <li>
                <NavLink
                  className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  to="/dashboard/allUser"
                >
                  All User
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  to="/dashboard/allPets"
                >
                  All Pets
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  to="/dashboard/allDonations"
                >
                  All Donations
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  to="/dashboard/addPet"
                >
                  Add a Pet
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  to="/dashboard/myAddPet"
                >
                  My Added Pets
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  to="/dashboard/adoptionRequest"
                >
                  Adoption Request
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  to="/dashboard/createDonationsCampaign"
                >
                  Create Donations Campaign
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  to="/dashboard/myDonationsCampaign"
                >
                  My Donations Campaign
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  to="/dashboard/myDonations"
                >
                  My Donations
                </NavLink>
              </li>
            </>
          )}
        </ul>
        <ul className="mt-6">
          <li>
            <NavLink
              className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
              to="/"
            >
              Home
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="md:w-3/4 w-full bg-gray-200 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
