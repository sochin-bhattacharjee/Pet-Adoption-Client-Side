import {
  Navbar,
  MobileNav,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  Avatar,
  IconButton,
} from "@material-tailwind/react";
import { ChevronDownIcon, Bars2Icon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo/logo.png";
import { NavLink } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { FaHouseUser } from "react-icons/fa";
import { AuthContext } from "../../Provider/AuthProvider";
import DarkModeToggle from "../../ToggleTheme/DarkModeToggle";
import navImg from "../../assets/navbarImg/user.png"
import Swal from 'sweetalert2';


const SharedNavbar = () => {
  const {user, logOut} = useContext(AuthContext);
  const logout = async () => {
  try {
    await logOut();
    console.log("Logged Out");
    Swal.fire({
      icon: "success",
      title: "log out successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "log out failed",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

  const profileMenuItems = [
    { label: "My Profile" },
    { label: "Sign Out" },
  ];

  function ProfileMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    return (
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
          >
            <Avatar
              variant="circular"
              size="sm"
              alt=""
              className={`border  ${user ? "border-gray-900 dark:border-white" : "border-none"} p-0.5`}
              src={user ? user.photoURL : navImg}
            />
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-1">
          <div className="flex flex-col gap-4 p-5">
            {
              user?
              <>
              <NavLink to="/profile" className={({ isActive }) =>
              `flex gap-2 items-center font-medium ${
                isActive
                  ? "text-blue-500 underline"
                  : "text-black hover:text-blue-500"
              }`
            }>
              <FaHouseUser />
              {profileMenuItems[0].label}
            </NavLink>
            <button onClick={logout} className="flex gap-2 items-center hover:bg-red-100 py-1 px-2 rounded-[7px] font-medium">
              <IoPowerSharp />
              {profileMenuItems[1].label}
            </button>
              </>
              :
              <>
              <NavLink
            to="/login"
            className={({ isActive }) =>
              `mr-2 font-medium ${
                isActive
                  ? "text-blue-500 underline"
                  : "text-black hover:text-blue-500"
              }`
            }
          >
            login
          </NavLink>
              <NavLink
            to="/signUp"
            className={({ isActive }) =>
              `mr-2 font-medium ${
                isActive
                  ? "text-blue-500 underline"
                  : "text-black hover:text-blue-500"
              }`
            }
          >
            SignUp
          </NavLink>
          
              </>
            }
            
          </div>
        </MenuList>
      </Menu>
    );
  }

  function NavList() {
    return (
      <ul className="mt-2 mb-4 flex flex-col gap-5 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
        {[
          { path: "/", label: "Home" },
          { path: "/dashboard/welcome", label: "DashBoard" },
          { path: "/petListing", label: "Pet Listing" },
          { path: "/donationsCampaign", label: "Donation Campaigns" },
        ].map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `mr-2 font-medium ${
                isActive
                  ? "text-blue-500 underline"
                  : "text-black dark:text-white hover:text-blue-500"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
        {
          !user &&<>
          <NavLink to="/login" className={({ isActive }) =>
              `mr-2 font-medium ${
                isActive
                  ? "text-blue-500 underline"
                  : "text-black dark:text-white hover:text-blue-500"
              }`
            }>
          Login
        </NavLink>
        <NavLink to="/signUp" className={({ isActive }) =>
              `mr-2 font-medium ${
                isActive
                  ? "text-blue-500 underline"
                  : "text-black dark:text-white hover:text-blue-500"
              }`
            }>
          SignUp
        </NavLink>
          </>
        }
      </ul>
    );
  }

  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);


  return (
    <Navbar className="mx-auto p-2 lg:pl-6 sticky top-0 z-50 dark:bg-gray-900 rounded-none border-none">
      <div className="flex justify-between items-center text-blue-gray-900">
        <div className="flex items-center">
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={toggleIsNavOpen}
            className=" mr-2 lg:hidden text-black"
          >
            <Bars2Icon className="h-6 w-6 dark:text-white" />
          </IconButton>
          <NavLink
            to="/"
            className="mr-4 ml-2 text-black dark:text-white cursor-pointer py-1.5 font-medium flex items-center gap-3"
          >
            <img src={logo} alt="" />
            Pet Adoption
          </NavLink>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <NavList />
          </div>
        </div>

        <div className="flex sm:gap-3 items-center">
        <DarkModeToggle/>
          <ProfileMenu />
        </div>
      </div>
      <MobileNav open={isNavOpen} className="overflow-scroll">
        <NavList />
      </MobileNav>
    </Navbar>
  );
};

export default SharedNavbar;
