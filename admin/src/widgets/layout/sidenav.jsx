import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav, AuthContext } from "@/context";
import { useContext } from "react";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const { user } = useContext(AuthContext);
  
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-900 to-gray-800",
    white: "bg-white shadow-xl",
    transparent: "bg-white/80 backdrop-blur-xl",
  };

  const textColors = {
    dark: "text-white",
    white: "text-gray-800",
    transparent: "text-gray-800",
  };

  const subTextColors = {
    dark: "text-gray-400",
    white: "text-gray-500",
    transparent: "text-gray-500",
  };

  // Akcento spalvos pagal sidenavColor
  const accentColors = {
    amber: { gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/30" },
    gray: { gradient: "from-gray-700 to-gray-900", shadow: "shadow-gray-500/30" },
    green: { gradient: "from-green-500 to-emerald-600", shadow: "shadow-green-500/30" },
    blue: { gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/30" },
    red: { gradient: "from-red-500 to-rose-600", shadow: "shadow-red-500/30" },
    pink: { gradient: "from-pink-500 to-fuchsia-600", shadow: "shadow-pink-500/30" },
  };

  const currentAccent = accentColors[sidenavColor] || accentColors.amber;

  // Filtruojame paslėptus puslapius
  const visibleRoutes = routes.filter(route => !route.hidden);

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-2xl transition-transform duration-300 xl:translate-x-0 border border-gray-200/50`}
    >
      {/* Logo ir pavadinimas */}
      <div className="relative border-b border-gray-200/50">
        <Link to="/admin/home" className="flex items-center gap-3 py-6 px-6">
          <div className={`flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden shadow-lg ${currentAccent.shadow} bg-white`}>
            <img src="/api/img/logo/logo.jpg" alt="Kream" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <Typography
              variant="h6"
              className={`font-bold ${textColors[sidenavType]}`}
            >
              Kream
            </Typography>
            <Typography
              variant="small"
              className={`font-normal text-xs ${subTextColors[sidenavType]}`}
            >
              Administravimas
            </Typography>
          </div>
        </Link>
        <IconButton
          variant="text"
          color={sidenavType === "dark" ? "white" : "blue-gray"}
          size="sm"
          ripple={false}
          className="absolute right-4 top-1/2 -translate-y-1/2 xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5" />
        </IconButton>
      </div>

      {/* Navigacija */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 100px)' }}>
        {visibleRoutes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="flex flex-col gap-1">
            {title && (
              <li className="mx-2 mt-4 mb-3">
                <Typography
                  variant="small"
                  className={`font-semibold text-xs uppercase tracking-wider ${subTextColors[sidenavType]}`}
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? `bg-gradient-to-r ${currentAccent.gradient} text-white shadow-lg ${currentAccent.shadow}`
                          : sidenavType === "dark"
                          ? "text-gray-300 hover:bg-white/10 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <span className={`${isActive ? "text-white" : ""}`}>
                        {icon}
                      </span>
                      <Typography
                        className={`font-medium text-sm ${isActive ? "text-white" : ""}`}
                      >
                        {name}
                      </Typography>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50">
        <div className={`flex items-center gap-3 px-2 ${textColors[sidenavType]}`}>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentAccent.gradient} flex items-center justify-center shadow-lg ${currentAccent.shadow}`}>
            <UserCircleIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <Typography variant="small" className="font-medium truncate">
              {user?.email || "Vartotojas"}
            </Typography>
            <Typography variant="small" className={`text-xs ${subTextColors[sidenavType]}`}>
              {user?.role === "admin" ? "Administratorius" : "Vartotojas"}
            </Typography>
          </div>
        </div>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Kream Administravimas",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;
