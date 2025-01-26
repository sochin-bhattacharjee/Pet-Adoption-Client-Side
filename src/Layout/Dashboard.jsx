import { Link, NavLink, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import { Button } from "@material-tailwind/react";


const Dashboard = () => {
  const [isAdmin] = useAdmin();
  console.log(isAdmin)
  const {user} = useAuth();
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <Helmet>
        <title>Pet Adoption | Dashboard</title>
      </Helmet>

      <div className="sm:w-1/4 w-full bg-white text-white p-4 space-y-4">
        <Link to="/dashboard">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        </Link>
        <div>
            <img className="w-16 h-16 rounded-full mx-auto" src={user?.photoURL} alt="" />
            <p className="text-center font-semibold text-black">{user?.displayName}</p>
            {
                isAdmin && <p className="text-center font-semibold text-black">Admin</p>
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
                  <Button className="w-full">All User</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/allPets"
                >
                  <Button className="w-full">All Pets</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/allDonations"
                >
                  <Button className="w-full">All Donations</Button>
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
                  <Button className="w-full">Add a Pet</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/myAddPet"
                >
                  <Button className="w-full">My Added Pets</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/adoptionRequest"
                >
                  <Button className="w-full">Adoption Request</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/createDonationsCampaign"
                >
                  <Button className="w-full">Create Donations Campaign</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/myDonationsCampaign"
                >
                  <Button className="w-full">My Donations Campaign</Button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block rounded-md"
                  to="/dashboard/myDonations"
                >
                  <Button className="w-full">My Donations</Button>
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
                  <Button className="w-full">Home</Button>
                </NavLink>
              </li>
        </ul>
      </div>

      <div className="sm:w-3/4 w-full bg-gray-100 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
