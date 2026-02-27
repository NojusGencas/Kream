import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  CubeIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, UserList, Dashboard, ProductsList, OrdersList, CategoriesList } from "@/pages/dashboard";
import { SignIn, SignUp, SignOut } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "admin",
    title: "Valdymo skydelis",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Statistika",
        path: "/home",
        element: <Dashboard />,
      },
      {
        icon: <ShoppingBagIcon {...icon} />,
        name: "Užsakymai",
        path: "/orders",
        element: <OrdersList />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Produktai",
        path: "/products",
        element: <ProductsList />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Kategorijos",
        path: "/categories",
        element: <CategoriesList />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "Vartotojai",
        path: "/vartotojai",
        element: <UserList />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Mano paskyra",
        path: "/paskyra",
        element: <Profile />,
      },
    ],
  },
  {
    layout: "auth",
    // Paslėpti auth puslapiai - nėra title, todėl nerodomi navigacijoje
    hidden: true,
    pages: [
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "Prisijungti",
        path: "/prisijungti",
        element: <SignIn />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "Registruotis",
        path: "/registruotis",
        element: <SignUp />,
      },
      {
        icon: <ArrowLeftOnRectangleIcon {...icon} />,
        name: "Atsijungti",
        path: "/atsijungti",
        element: <SignOut />,
      },
    ],
  },
];

export default routes;
