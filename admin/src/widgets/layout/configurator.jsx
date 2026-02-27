import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  SunIcon,
  MoonIcon,
  SwatchIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  IconButton,
  Switch,
  Typography,
} from "@material-tailwind/react";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setSidenavColor,
  setSidenavType,
  setFixedNavbar,
} from "@/context";

export function Configurator() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openConfigurator, sidenavColor, sidenavType, fixedNavbar } =
    controller;

  const sidenavColors = {
    amber: { from: "from-amber-500", to: "to-orange-600", name: "Gintarinė" },
    gray: { from: "from-gray-800", to: "to-gray-900", name: "Pilka" },
    green: { from: "from-green-500", to: "to-emerald-600", name: "Žalia" },
    blue: { from: "from-blue-500", to: "to-indigo-600", name: "Mėlyna" },
    red: { from: "from-red-500", to: "to-rose-600", name: "Raudona" },
    pink: { from: "from-pink-500", to: "to-fuchsia-600", name: "Rožinė" },
  };

  const sidenavTypeOptions = [
    { value: "dark", icon: MoonIcon, label: "Tamsi" },
    { value: "white", icon: SunIcon, label: "Šviesi" },
    { value: "transparent", icon: SwatchIcon, label: "Skaidri" },
  ];

  return (
    <aside
      className={`fixed top-0 right-0 z-50 h-screen w-80 bg-white shadow-2xl transition-transform duration-300 ${
        openConfigurator ? "translate-x-0" : "translate-x-80"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
            <SwatchIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <Typography variant="h6" color="blue-gray">
              Nustatymai
            </Typography>
            <Typography variant="small" className="text-gray-500 font-normal">
              Pritaikykite išvaizdą
            </Typography>
          </div>
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setOpenConfigurator(dispatch, false)}
          className="rounded-full"
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5" />
        </IconButton>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
        {/* Spalvų schema */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <SwatchIcon className="w-5 h-5 text-amber-500" />
            <Typography variant="h6" color="blue-gray">
              Akcento spalva
            </Typography>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(sidenavColors).map(([color, config]) => (
              <button
                key={color}
                onClick={() => setSidenavColor(dispatch, color)}
                className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                  sidenavColor === color
                    ? "border-gray-900 bg-gray-50"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.from} ${config.to} shadow-lg transition-transform group-hover:scale-110`}
                />
                <Typography variant="small" className="text-xs font-medium text-gray-600">
                  {config.name}
                </Typography>
                {sidenavColor === color && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Šoninės juostos tipas */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bars3BottomLeftIcon className="w-5 h-5 text-amber-500" />
            <Typography variant="h6" color="blue-gray">
              Šoninė juosta
            </Typography>
          </div>
          <div className="flex gap-2">
            {sidenavTypeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setSidenavType(dispatch, value)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  sidenavType === value
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-6 h-6 ${sidenavType === value ? "text-amber-500" : "text-gray-400"}`} />
                <Typography variant="small" className={`font-medium ${sidenavType === value ? "text-gray-900" : "text-gray-500"}`}>
                  {label}
                </Typography>
              </button>
            ))}
          </div>
        </div>

        {/* Navigacijos nustatymai */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Typography variant="h6" color="blue-gray">
              Papildomi nustatymai
            </Typography>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <Typography variant="small" className="font-medium text-gray-900">
                    Fiksuota navigacija
                  </Typography>
                  <Typography variant="small" className="text-gray-500 text-xs">
                    Viršutinė juosta lieka vietoje
                  </Typography>
                </div>
              </div>
              <Switch
                id="navbar-fixed"
                color="amber"
                checked={fixedNavbar}
                onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">💡</span>
            </div>
            <div>
              <Typography variant="small" className="font-semibold text-amber-900">
                Patarimas
              </Typography>
              <Typography variant="small" className="text-amber-700 mt-1">
                Nustatymai išsaugomi automatiškai ir bus pritaikyti kiekvieną kartą kai prisijungsite.
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

Configurator.displayName = "/src/widgets/layout/configurator.jsx";

export default Configurator;
