import { Link } from "react-router-dom";
import {
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ArrowsPointingOutIcon,
  ArrowLeftCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowRightCircleIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import {
  AuthContext,
} from "@/context";
import { useContext } from "react";


export function UserInfo() {
  const { user, token } = useContext(AuthContext);

  // Gauti inicialus iš el. pašto
  const getInitials = (email) => {
    if (!email) return "U";
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  };

  // Gauti spalvą pagal rolę
  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "amber";
      case "manager": return "blue";
      default: return "gray";
    }
  };

  return (
    (user && token) ? (
      <Menu placement="bottom-end">
        <MenuHandler>
          <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-gray-50 transition-all cursor-pointer border-0 bg-transparent">
            {/* Avatar */}
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-sm shadow-md shadow-amber-500/20">
              {getInitials(user.email)}
            </div>
            {/* Info */}
            <div className="hidden lg:block text-left">
              <Typography variant="small" className="font-semibold text-blue-gray-800 leading-tight">
                {user.email?.split("@")[0] || "Vartotojas"}
              </Typography>
              <Typography variant="small" className="text-xs text-blue-gray-500 leading-tight">
                {user.role === "admin" ? "Administratorius" : user.role}
              </Typography>
            </div>
            {/* Dropdown icon */}
            <ChevronDownIcon className="h-3 w-3 text-blue-gray-400 hidden lg:block" />
          </button>
        </MenuHandler>
        <MenuList className="p-2 border border-blue-gray-50 shadow-xl rounded-xl min-w-[200px]">
          {/* User header in dropdown */}
          <div className="px-3 py-2 border-b border-blue-gray-50 mb-2">
            <Typography variant="small" className="font-semibold text-blue-gray-800">
              {user.email}
            </Typography>
            <Chip 
              value={user.role === "admin" ? "Administratorius" : user.role}
              size="sm"
              color={getRoleColor(user.role)}
              className="mt-1 text-[10px]"
            />
          </div>
          
          <Link to="/dashboard/paskyra">
            <MenuItem className="flex items-center gap-3 rounded-lg hover:bg-amber-50/50">
              <UserIcon className="h-4 w-4 text-blue-gray-600" />
              <Typography variant="small" className="font-medium text-blue-gray-700">
                Mano paskyra
              </Typography>
            </MenuItem>
          </Link>
          
          <hr className="my-2 border-blue-gray-50" />
          
          <Link to="/auth/atsijungti">
            <MenuItem className="flex items-center gap-3 rounded-lg hover:bg-red-50/50 text-red-500">
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <Typography variant="small" className="font-medium">
                Atsijungti
              </Typography>
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
    ) : (
      <div className="flex items-center gap-2">
        <Link to="/auth/registruotis">
          <Button
            variant="text"
            size="sm"
            color="blue-gray"
            className="hidden items-center gap-2 rounded-xl xl:flex normal-case font-medium"
          >
            <UserCircleIcon className="h-4 w-4" />
            Registruotis
          </Button>
        </Link>
        <Link to="/auth/prisijungti">
          <Button
            size="sm"
            className="hidden items-center gap-2 rounded-xl xl:flex normal-case font-medium bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-amber-500/20"
          >
            <ArrowRightCircleIcon className="h-4 w-4" />
            Prisijungti
          </Button>
        </Link>
        {/* Mobile icons */}
        <Link to="/auth/prisijungti" className="xl:hidden">
          <IconButton
            variant="text"
            color="blue-gray"
            className="rounded-xl"
          >
            <ArrowRightCircleIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </Link>
      </div>
    )
  );
}

UserInfo.displayName = "/src/widgets/layout/user-info.jsx";

export default UserInfo;
