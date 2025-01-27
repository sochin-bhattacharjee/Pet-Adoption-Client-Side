import { Link, NavLink, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import { Button } from "@material-tailwind/react";
import DarkModeToggle from "../ToggleTheme/DarkModeToggle";


const Dashboard = () => {
  const [isAdmin] = useAdmin();
  console.log(isAdmin)
  const {user} = useAuth();
  return (
    <div className="sm:min-h-screen flex flex-col sm:flex-row">
      <Helmet>
        <title>Pet Adoption | Dashboard</title>
      </Helmet>

      <div className="sm:w-1/4 w-full bg-white dark:bg-gray-800 text-white p-4 space-y-4">
        <Link to="/dashboard">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Dashboard</h2>
        </Link>
        <div>
            <img className="w-16 h-16 rounded-full mx-auto object-cover" src={user?.photoURL} alt="" />
            <p className="text-center font-semibold text-black dark:text-white">{user?.displayName}</p>
            {
                isAdmin && <p className="text-center font-semibold text-blue-600 dark:text-blue-500">Admin</p>
            }
        </div>
        <ul className="space-y-2">
          {isAdmin && (
            <>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/allUser"
                >
                  <Button className="w-full dark:text-black dark:bg-gray-200">All User</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/allPets"
                >
                  <Button className="w-full dark:text-black dark:bg-gray-200">All Pets</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/allDonations"
                >
                  <Button className="w-full dark:text-black dark:bg-gray-200">All Donations</Button>
                </NavLink>
              </li>
            </>
          )} 
            <>
            <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/addPet"
                >
                  <Button className="w-full dark:text-black dark:bg-gray-200">Add a Pet</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/myAddPet"
                >
                  <Button className="w-full dark:text-black dark:bg-gray-200">My Added Pets</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/adoptionRequest"
                >
                  <Button className="w-full dark:text-black dark:bg-gray-200">Adoption Request</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/createDonationsCampaign"
                >
                  <Button className="w-full dark:text-black dark:bg-gray-200">Create Donations Campaign</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/myDonationsCampaign"
                >
                  <Button className="w-full dark:text-black dark:bg-gray-200">My Donations Campaign</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/myDonations"
                >
                  <Button className="w-full dark:text-black dark:bg-gray-200">My Donations</Button>
                </NavLink>
              </li>
            </>
        </ul>
        <ul className="mt-6">
        <li>
                <NavLink
                  className="block rounded-md"
                  to="/"
                >
                  <Button className="w-full dark:text-black dark:bg-gray-200">Home</Button>
                </NavLink>
              </li>
        </ul>
        <div className="bg-gray-500 dark:bg-gray-700 p-3 rounded-lg"><DarkModeToggle /></div>
      </div>

      <div className="sm:w-3/4 w-full bg-gray-100 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
