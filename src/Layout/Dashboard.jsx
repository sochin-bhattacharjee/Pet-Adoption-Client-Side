import { Link, NavLink, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import { Button, IconButton } from "@material-tailwind/react";
import DarkModeToggle from "../ToggleTheme/DarkModeToggle";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const Dashboard = () => {
  const [isAdmin] = useAdmin();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      <Helmet>
        <title>Pet Adoption | Dashboard</title>
      </Helmet>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
        <h2 className="text-xl font-bold dark:text-white">Dashboard</h2>
        <DarkModeToggle />
        <IconButton
          variant="text"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6 dark:text-white" />
          ) : (
            <Bars2Icon className="h-6 w-6 dark:text-white" />
          )}
        </IconButton>
      </div>

      {/* Sidebar */}
      <div
        className={`border-r-2 md:border-r-4 border-blue-700 rounded-br-xl md:rounded-br-3xl rounded-tr-xl md:rounded-tr-3xl
    fixed md:static top-0 left-0 z-40
    h-screen
    w-3/4 sm:w-1/2 md:w-1/4
    bg-white dark:bg-gray-900
    p-4 pt-16 md:pt-4
    overflow-y-auto
    transform transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        <div className=" mx-auto"></div>

        <Link to="/dashboard">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
            Dashboard
          </h2>
        </Link>

        <div className="mb-1">
          <img
            className="w-16 h-16 rounded-full mx-auto object-cover dark:text-white"
            src={user?.photoURL}
            alt={user?.displayName}
          />
          <p className="text-center font-semibold text-black dark:text-slate-300">
            {user?.displayName}
          </p>
          {isAdmin && (
            <p className="text-center md:text-xl font-semibold text-blue-600">Admin</p>
          )}
        </div>

        {/* left side div */}
        <ul className="mt-2">
          {isAdmin && (
            <div>
              <NavLink to="/dashboard/allUser">
                <Button className="w-full mb-2 dark:bg-slate-200 dark:text-black font-bold">All User</Button>
              </NavLink>
              <NavLink to="/dashboard/allPets">
                <Button className="w-full mb-2 dark:bg-slate-200 dark:text-black font-bold">All Pets</Button>
              </NavLink>
              <NavLink to="/dashboard/allDonations">
                <Button className="w-full mb-2 dark:bg-slate-200 dark:text-black font-bold">All Donations</Button>
              </NavLink>
            </div>
          )}

          <NavLink to="/dashboard/addPet">
            <Button className="w-full mb-2 dark:bg-slate-200 dark:text-black font-bold">Add a Pet</Button>
          </NavLink>
          <NavLink to="/dashboard/myAddPet">
            <Button className="w-full mb-2 dark:bg-slate-200 dark:text-black font-bold">My Added Pets</Button>
          </NavLink>
          <NavLink to="/dashboard/adoptionRequest">
            <Button className="w-full mb-2 dark:bg-slate-200 dark:text-black font-bold">Adoption Request</Button>
          </NavLink>
          <NavLink to="/dashboard/createDonationsCampaign">
            <Button className="w-full mb-2 dark:bg-slate-200 dark:text-black font-bold">Create Donations Campaign</Button>
          </NavLink>
          <NavLink to="/dashboard/myDonationsCampaign">
            <Button className="w-full mb-2 dark:bg-slate-200 dark:text-black font-bold">My Donations Campaign</Button>
          </NavLink>
          <NavLink to="/dashboard/myDonations">
            <Button className="w-full mb-2 dark:bg-slate-200 dark:text-black font-bold">My Donations</Button>
          </NavLink>
        </ul>

        <NavLink to="/">
          <Button className="w-full dark:bg-slate-200 dark:text-black font-bold">Home</Button>
        </NavLink>
      </div>

      {/* Right side div */}
      {/* Content */}
      <div className="md:w-3/4 w-full h-screen overflow-y-auto bg-gray-100 dark:bg-gray-900 p-2">
      <div className="flex justify-end sticky top-0 z-50">
          <div className="hidden md:block">
            <DarkModeToggle/>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
