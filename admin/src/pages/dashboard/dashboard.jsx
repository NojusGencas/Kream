import { buildApiUrl } from '../../utils/api.js';
import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Chip,
  Tooltip,
  Spinner,
} from "@material-tailwind/react";
import {
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from "@/context";
import Chart from "react-apexcharts";

export function Dashboard() {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/stats'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Klaida gaunant statistiką");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Grafikas - užsakymai per savaitę
  const chartConfig = {
    type: "area",
    height: 240,
    series: [
      {
        name: "Užsakymai",
        data: stats?.ordersChart?.map((d) => d.count) || [0, 0, 0, 0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        toolbar: { show: false },
        sparkline: { enabled: false },
      },
      colors: ["#f59e0b"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        categories: stats?.ordersChart?.map((d) => {
          const date = new Date(d.date);
          return date.toLocaleDateString("lt-LT", { weekday: "short" });
        }) || ["Pr", "An", "Tr", "Kt", "Pn", "Št", "Sk"],
        labels: {
          style: { colors: "#616161", fontSize: "12px" },
        },
      },
      yaxis: {
        labels: {
          style: { colors: "#616161", fontSize: "12px" },
        },
      },
      grid: {
        borderColor: "#e7e7e7",
        strokeDashArray: 5,
      },
      tooltip: { theme: "light" },
    },
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "amber",
      confirmed: "blue",
      in_progress: "purple",
      completed: "green",
      cancelled: "red",
    };
    return colors[status] || "gray";
  };

  const getStatusText = (status) => {
    const texts = {
      new: "Naujas",
      confirmed: "Patvirtintas",
      in_progress: "Vykdomas",
      completed: "Įvykdytas",
      cancelled: "Atšauktas",
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner className="h-12 w-12" color="amber" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <Typography variant="h5" color="red">
            {error}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Statistikos kortelės */}
      <div className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Užsakymai */}
        <Card className="border border-blue-gray-100 shadow-sm overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent" />
          <CardBody className="p-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600">
                  Visi užsakymai
                </Typography>
                <Typography variant="h3" color="blue-gray" className="mt-1">
                  {stats?.orders?.total || 0}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <Chip
                    value={`${stats?.orders?.new || 0} nauji`}
                    size="sm"
                    color="amber"
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/40 shadow-lg">
                <ShoppingBagIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Produktai */}
        <Card className="border border-blue-gray-100 shadow-sm overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-green-500/10 to-transparent" />
          <CardBody className="p-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600">
                  Produktai
                </Typography>
                <Typography variant="h3" color="blue-gray" className="mt-1">
                  {stats?.products?.total || 0}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <Chip
                    value={`${stats?.products?.active || 0} aktyvūs`}
                    size="sm"
                    color="green"
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/40 shadow-lg">
                <CubeIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Kategorijos */}
        <Card className="border border-blue-gray-100 shadow-sm overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent" />
          <CardBody className="p-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600">
                  Kategorijos
                </Typography>
                <Typography variant="h3" color="blue-gray" className="mt-1">
                  {stats?.categories?.total || 0}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <Typography variant="small" color="blue-gray">
                    Produktų grupės
                  </Typography>
                </div>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/40 shadow-lg">
                <ClipboardDocumentListIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Vartotojai */}
        <Card className="border border-blue-gray-100 shadow-sm overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-purple-500/10 to-transparent" />
          <CardBody className="p-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600">
                  Vartotojai
                </Typography>
                <Typography variant="h3" color="blue-gray" className="mt-1">
                  {stats?.users?.total || 0}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <Typography variant="small" color="blue-gray">
                    Admin vartotojai
                  </Typography>
                </div>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/40 shadow-lg">
                <UsersIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Grafikai ir lentelės */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Užsakymų grafikas */}
        <Card className="border border-blue-gray-100 shadow-sm xl:col-span-2">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Užsakymai per savaitę
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  Paskutinių 7 dienų užsakymų statistika
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <Chip
                  value={`${stats?.orders?.completed || 0} įvykdyti`}
                  size="sm"
                  color="green"
                  className="rounded-full"
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-2 pb-4">
            {stats?.ordersChart?.length > 0 ? (
              <Chart {...chartConfig} />
            ) : (
              <div className="flex items-center justify-center h-60 text-blue-gray-500">
                <div className="text-center">
                  <ClockIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <Typography variant="small">Dar nėra užsakymų duomenų</Typography>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Užsakymų statusai */}
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Užsakymų būsenos
            </Typography>
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Dabartinė užsakymų situacija
            </Typography>
          </CardHeader>
          <CardBody className="p-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <Typography variant="small" className="font-medium">
                    Nauji
                  </Typography>
                </div>
                <Typography variant="h6" color="amber">
                  {stats?.orders?.new || 0}
                </Typography>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <Typography variant="small" className="font-medium">
                    Patvirtinti
                  </Typography>
                </div>
                <Typography variant="h6" color="blue">
                  {stats?.orders?.confirmed || 0}
                </Typography>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <Typography variant="small" className="font-medium">
                    Įvykdyti
                  </Typography>
                </div>
                <Typography variant="h6" color="green">
                  {stats?.orders?.completed || 0}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Paskutiniai užsakymai */}
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6"
        >
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Paskutiniai užsakymai
            </Typography>
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Naujausi gauti užsakymai
            </Typography>
          </div>
          <a
            href="/admin/orders"
            className="text-sm font-medium text-amber-600 hover:text-amber-800"
          >
            Visi užsakymai →
          </a>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {stats?.recentOrders?.length > 0 ? (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["#", "Klientas", "El. paštas", "Torto tipas", "Statusas", "Data"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, index) => {
                  const className = `py-3 px-5 ${
                    index === stats.recentOrders.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={order.id} className="hover:bg-blue-gray-50/50">
                      <td className={className}>
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          #{order.id}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-medium text-blue-gray-900">
                          {order.name}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm text-blue-gray-600">
                          {order.email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm text-blue-gray-600">
                          {order.cake_type || "-"}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          value={getStatusText(order.status)}
                          size="sm"
                          color={getStatusColor(order.status)}
                          className="rounded-full font-medium"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-sm text-blue-gray-600">
                          {new Date(order.created_at).toLocaleDateString("lt-LT")}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center h-32 text-blue-gray-500">
              <div className="text-center">
                <ShoppingBagIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <Typography variant="small">Dar nėra užsakymų</Typography>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Dashboard;
