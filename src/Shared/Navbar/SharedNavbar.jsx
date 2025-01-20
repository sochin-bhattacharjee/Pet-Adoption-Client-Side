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
import { useEffect, useState } from "react";
import logo from "../../assets/logo/logo.png";
import { NavLink } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { FaHouseUser, FaUserEdit } from "react-icons/fa";

const SharedNavbar = () => {
  const profileMenuItems = [
    {
      label: "My Profile",
    },
    {
      label: "Edit Profile",
    },
    {
      label: "Sign Out",
    },
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
              className="border border-gray-900 p-0.5"
              src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=76&q=80"
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
            <NavLink className="flex gap-2 items-center">
              <FaHouseUser />
              {profileMenuItems[0].label}
            </NavLink>
            <NavLink className="flex gap-2 items-center">
              <FaUserEdit />
              {profileMenuItems[1].label}
            </NavLink>
            <NavLink className="flex gap-2 items-center">
              <IoPowerSharp />
              {profileMenuItems[2].label}
            </NavLink>
          </div>
        </MenuList>
      </Menu>
    );
  }

  function NavList() {
    return (
      <ul className="mt-2 mb-4 flex flex-col gap-5 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
        <NavLink className="text-black mr-2 font-medium" to="">
          Home
        </NavLink>
        <NavLink className="text-black mr-2 font-medium" to="">
          DashBoard
        </NavLink>
        <NavLink className="text-black mr-2 font-medium" to="">
          Pet Listing
        </NavLink>
        <NavLink className="text-black mr-2 font-medium" to="">
          Donation Campaigns
        </NavLink>
        <NavLink
          className="text-black font-medium"
          to="/login"
          size="sm"
          variant="text"
        >
          <span>LogIn</span>
        </NavLink>
        <NavLink
          className="text-black font-medium"
          to="/signUp"
          size="sm"
          variant="text"
        >
          <a>SignUp</a>
        </NavLink>
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
    <Navbar className="mx-auto p-2 lg:pl-6">
      <div className="flex justify-between items-center text-blue-gray-900">
        <div className="flex items-center">
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={toggleIsNavOpen}
            className=" mr-2 lg:hidden text-black"
          >
            <Bars2Icon className="h-6 w-6" />
          </IconButton>
          <NavLink
            to="/"
            className="mr-4 ml-2 text-black cursor-pointer py-1.5 font-medium flex items-center gap-3"
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

        <div>
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
