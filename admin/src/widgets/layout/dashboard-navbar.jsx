import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";

import { UserInfo } from ".";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  // Puslapių pavadinimai lietuviškai
  const pageNames = {
    home: "Pradžia",
    orders: "Užsakymai",
    products: "Produktai",
    categories: "Kategorijos",
    users: "Vartotojai",
    projects: "Projektai",
    paskyra: "Paskyra",
    dashboard: "Valdymo skydelis",
    admin: "Admin",
  };

  const getPageName = (name) => pageNames[name?.toLowerCase()] || name;

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-lg shadow-blue-gray-500/5 backdrop-blur-md bg-white/90 border border-blue-gray-50"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        {/* Left side - Breadcrumbs & Title */}
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-amber-600 hover:opacity-100"
              >
                {getPageName(layout)}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-medium"
            >
              {getPageName(page)}
            </Typography>
          </Breadcrumbs>
          <div className="flex items-center gap-2 mt-1">
            <Typography variant="h5" color="blue-gray" className="font-bold">
              {getPageName(page)}
            </Typography>
            <Chip 
              value="Live" 
              size="sm" 
              className="rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-[10px] px-2 py-0.5 font-medium"
              icon={<span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            />
          </div>
        </div>

        {/* Right side - Search, User, Notifications */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-blue-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Ieškoti..."
              className="w-48 lg:w-64 pl-10 pr-4 py-2 text-sm bg-blue-gray-50/50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
            />
          </div>

          {/* Mobile menu button */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden rounded-xl hover:bg-blue-gray-50"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={2} className="h-5 w-5 text-blue-gray-600" />
          </IconButton>

          {/* Notifications */}
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray" className="rounded-xl hover:bg-blue-gray-50 relative">
                <BellIcon className="h-5 w-5 text-blue-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-80 border border-blue-gray-50 shadow-xl rounded-xl p-2">
              <div className="px-3 py-2 border-b border-blue-gray-50 mb-2">
                <Typography variant="small" className="font-semibold text-blue-gray-800">
                  Pranešimai
                </Typography>
              </div>
              <MenuItem className="flex items-center gap-3 rounded-lg hover:bg-amber-50/50">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 shadow-md shadow-amber-500/20">
                  <BellIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold"
                  >
                    Naujas užsakymas
                  </Typography>
                  <Typography
                    variant="small"
                    className="flex items-center gap-1 text-xs text-blue-gray-400"
                  >
                    <ClockIcon className="h-3 w-3" /> Prieš 13 min.
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-3 rounded-lg hover:bg-green-50/50">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-green-400 to-emerald-500 shadow-md shadow-green-500/20">
                  <CreditCardIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold"
                  >
                    Užsakymas įvykdytas
                  </Typography>
                  <Typography
                    variant="small"
                    className="flex items-center gap-1 text-xs text-blue-gray-400"
                  >
                    <ClockIcon className="h-3 w-3" /> Prieš 1 dieną
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* Settings */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="rounded-xl hover:bg-blue-gray-50"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-600" />
          </IconButton>

          {/* User Info */}
          <UserInfo />
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
