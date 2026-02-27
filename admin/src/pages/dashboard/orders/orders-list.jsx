import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Spinner,
  Tabs,
  TabsHeader,
  Tab,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  EyeIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { AuthContext, AlertContext } from "@/context";

const STATUS_OPTIONS = [
  { value: "new", label: "Naujas", color: "amber", icon: ClockIcon },
  { value: "confirmed", label: "Patvirtintas", color: "blue", icon: CheckIcon },
  { value: "in_progress", label: "Vykdomas", color: "purple", icon: ArrowPathIcon },
  { value: "completed", label: "Įvykdytas", color: "green", icon: CheckCircleIcon },
  { value: "cancelled", label: "Atšauktas", color: "red", icon: XMarkIcon },
];

// Status flow - koks statusas seka po kurio
const STATUS_FLOW = {
  new: "confirmed",
  confirmed: "in_progress", 
  in_progress: "completed",
  completed: "completed",
  cancelled: "cancelled",
};

export function OrdersList() {
  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCompletedModal, setOpenDeleteCompletedModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletingCompleted, setDeletingCompleted] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Klaida gaunant užsakymus");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      addAlert(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Klaida keičiant statusą");

      addAlert("Statusas atnaujintas", "success");
      fetchOrders();
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Klaida trinant užsakymą");

      addAlert("Užsakymas ištrintas", "success");
      setOpenDeleteModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const handleDeleteCompleted = async () => {
    setDeletingCompleted(true);
    try {
      const res = await fetch(`/api/orders/status/completed`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Klaida trinant užsakymus");

      const data = await res.json();
      addAlert(`Ištrinta įvykdytų užsakymų: ${data.deletedCount}`, "success");
      setOpenDeleteCompletedModal(false);
      fetchOrders();
    } catch (err) {
      addAlert(err.message, "error");
    } finally {
      setDeletingCompleted(false);
    }
  };

  const getStatusConfig = (status) => {
    return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toString().includes(searchTerm);
    
    const matchesTab = activeTab === "all" || order.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const tabCounts = {
    all: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner className="h-12 w-12" color="amber" />
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Užsakymų valdymas
                </Typography>
                <Typography variant="small" className="text-blue-gray-600 font-normal mt-1">
                  Peržiūrėkite ir valdykite gautus užsakymus
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                {/* Delete completed button */}
                {tabCounts.completed > 0 && (
                  <Button
                    size="sm"
                    color="red"
                    variant="outlined"
                    className="flex items-center gap-2"
                    onClick={() => setOpenDeleteCompletedModal(true)}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Ištrinti įvykdytus ({tabCounts.completed})
                  </Button>
                )}
                <div className="relative w-full md:w-72">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-gray-400" />
                  <input
                    type="text"
                    placeholder="Ieškoti pagal vardą, el. paštą..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-blue-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Status Tabs */}
            <Tabs value={activeTab} className="w-full">
              <TabsHeader
                className="bg-blue-gray-50 p-1"
                indicatorProps={{
                  className: "bg-white shadow-md rounded-lg",
                }}
              >
                <Tab
                  value="all"
                  onClick={() => setActiveTab("all")}
                  className={activeTab === "all" ? "text-amber-600" : ""}
                >
                  <div className="flex items-center gap-2">
                    Visi
                    <Chip value={tabCounts.all} size="sm" variant="ghost" className="rounded-full" />
                  </div>
                </Tab>
                <Tab
                  value="new"
                  onClick={() => setActiveTab("new")}
                  className={activeTab === "new" ? "text-amber-600" : ""}
                >
                  <div className="flex items-center gap-2">
                    Nauji
                    <Chip value={tabCounts.new} size="sm" color="amber" className="rounded-full" />
                  </div>
                </Tab>
                <Tab
                  value="confirmed"
                  onClick={() => setActiveTab("confirmed")}
                  className={activeTab === "confirmed" ? "text-blue-600" : ""}
                >
                  <div className="flex items-center gap-2">
                    Patvirtinti
                    <Chip value={tabCounts.confirmed} size="sm" color="blue" className="rounded-full" />
                  </div>
                </Tab>
                <Tab
                  value="in_progress"
                  onClick={() => setActiveTab("in_progress")}
                  className={activeTab === "in_progress" ? "text-purple-600" : ""}
                >
                  <div className="flex items-center gap-2">
                    Vykdomi
                    <Chip value={tabCounts.in_progress} size="sm" color="purple" className="rounded-full" />
                  </div>
                </Tab>
                <Tab
                  value="completed"
                  onClick={() => setActiveTab("completed")}
                  className={activeTab === "completed" ? "text-green-600" : ""}
                >
                  <div className="flex items-center gap-2">
                    Įvykdyti
                    <Chip value={tabCounts.completed} size="sm" color="green" className="rounded-full" />
                  </div>
                </Tab>
              </TabsHeader>
            </Tabs>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[900px] table-auto">
            <thead>
              <tr>
                {["#", "Klientas", "Kontaktai", "Torto info", "Pristatymas", "Statusas", "Veiksmai"].map(
                  (el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const className = `py-3 px-5 ${
                  index === filteredOrders.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;
                const statusConfig = getStatusConfig(order.status);

                return (
                  <tr key={order.id} className="hover:bg-blue-gray-50/50">
                    <td className={className}>
                      <Typography className="text-sm font-bold text-amber-600">
                        #{order.id}
                      </Typography>
                      <Typography className="text-xs text-blue-gray-500">
                        {new Date(order.created_at).toLocaleDateString("lt-LT")}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-900">
                        {order.name}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm text-blue-gray-600">
                        {order.email}
                      </Typography>
                      {order.phone && (
                        <Typography className="text-xs text-blue-gray-500">
                          {order.phone}
                        </Typography>
                      )}
                    </td>
                    <td className={className}>
                      <div className="space-y-1">
                        {order.cake_type && (
                          <Typography className="text-sm">{order.cake_type}</Typography>
                        )}
                        {order.cake_size && (
                          <Typography className="text-xs text-blue-gray-500">
                            Dydis: {order.cake_size}
                          </Typography>
                        )}
                        {order.cake_flavor && (
                          <Typography className="text-xs text-blue-gray-500">
                            Skonis: {order.cake_flavor}
                          </Typography>
                        )}
                      </div>
                    </td>
                    <td className={className}>
                      {order.delivery_date ? (
                        <div>
                          <Typography className="text-sm font-medium">
                            {new Date(order.delivery_date).toLocaleDateString("lt-LT")}
                          </Typography>
                          {order.delivery_time && (
                            <Typography className="text-xs text-blue-gray-500">
                              {order.delivery_time}
                            </Typography>
                          )}
                        </div>
                      ) : (
                        <Typography className="text-sm text-blue-gray-400">-</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {/* Quick Status Buttons */}
                      <div className="flex items-center gap-1">
                        {/* Current Status Chip with Menu */}
                        <Menu placement="bottom-start">
                          <MenuHandler>
                            <button className={`
                              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                              transition-all duration-200 cursor-pointer hover:shadow-md
                              ${order.status === 'new' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : ''}
                              ${order.status === 'confirmed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
                              ${order.status === 'in_progress' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : ''}
                              ${order.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                              ${order.status === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                            `}>
                              {React.createElement(statusConfig.icon, { className: "w-3.5 h-3.5" })}
                              {statusConfig.label}
                              <ChevronDownIcon className="w-3 h-3 ml-1" />
                            </button>
                          </MenuHandler>
                          <MenuList className="min-w-[180px]">
                            <Typography variant="small" className="px-3 py-1 text-blue-gray-500 font-medium">
                              Keisti statusą į:
                            </Typography>
                            <hr className="my-1" />
                            {STATUS_OPTIONS.map((status) => (
                              <MenuItem
                                key={status.value}
                                onClick={() => handleStatusChange(order.id, status.value)}
                                disabled={order.status === status.value}
                                className={`flex items-center gap-2 ${order.status === status.value ? 'bg-blue-gray-50' : ''}`}
                              >
                                <div className={`
                                  w-6 h-6 rounded-full flex items-center justify-center
                                  ${status.color === 'amber' ? 'bg-amber-100 text-amber-600' : ''}
                                  ${status.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                                  ${status.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                                  ${status.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                                  ${status.color === 'red' ? 'bg-red-100 text-red-600' : ''}
                                `}>
                                  {React.createElement(status.icon, { className: "w-3.5 h-3.5" })}
                                </div>
                                <span className={order.status === status.value ? 'font-semibold' : ''}>
                                  {status.label}
                                </span>
                                {order.status === status.value && (
                                  <CheckIcon className="w-4 h-4 ml-auto text-green-500" />
                                )}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>

                        {/* Quick Next Status Button */}
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <Tooltip content={`Pakeisti į: ${getStatusConfig(STATUS_FLOW[order.status]).label}`}>
                            <IconButton
                              variant="filled"
                              size="sm"
                              color={getStatusConfig(STATUS_FLOW[order.status]).color}
                              className="rounded-full w-7 h-7"
                              onClick={() => handleStatusChange(order.id, STATUS_FLOW[order.status])}
                            >
                              <CheckIcon className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Quick Cancel Button */}
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <Tooltip content="Atšaukti užsakymą">
                            <IconButton
                              variant="text"
                              size="sm"
                              color="red"
                              className="rounded-full w-7 h-7"
                              onClick={() => handleStatusChange(order.id, 'cancelled')}
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Peržiūrėti">
                          <IconButton
                            variant="text"
                            color="blue"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenViewModal(true);
                            }}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Ištrinti">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenDeleteModal(true);
                            }}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="flex items-center justify-center h-32 text-blue-gray-500">
              <Typography>Užsakymų nerasta</Typography>
            </div>
          )}
        </CardBody>
      </Card>

      {/* View Order Modal */}
      <Dialog open={openViewModal} handler={() => setOpenViewModal(false)} size="lg">
        <DialogHeader className="flex items-center justify-between">
          <div>
            <Typography variant="h5">
              Užsakymas #{selectedOrder?.id}
            </Typography>
            <Typography variant="small" className="text-blue-gray-500 font-normal">
              {selectedOrder && new Date(selectedOrder.created_at).toLocaleString("lt-LT")}
            </Typography>
          </div>
          <Chip
            value={getStatusConfig(selectedOrder?.status).label}
            color={getStatusConfig(selectedOrder?.status).color}
            className="rounded-full"
          />
        </DialogHeader>
        <DialogBody className="overflow-y-auto max-h-[60vh]">
          {selectedOrder && (
            <div className="space-y-6">
              {/* Kliento info */}
              <div className="bg-blue-gray-50 rounded-lg p-4">
                <Typography variant="h6" className="mb-3 text-blue-gray-800">
                  Kliento informacija
                </Typography>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="small" className="text-blue-gray-500">
                      Vardas
                    </Typography>
                    <Typography className="font-medium">{selectedOrder.name}</Typography>
                  </div>
                  <div>
                    <Typography variant="small" className="text-blue-gray-500">
                      El. paštas
                    </Typography>
                    <Typography className="font-medium">{selectedOrder.email}</Typography>
                  </div>
                  {selectedOrder.phone && (
                    <div>
                      <Typography variant="small" className="text-blue-gray-500">
                        Telefonas
                      </Typography>
                      <Typography className="font-medium">{selectedOrder.phone}</Typography>
                    </div>
                  )}
                </div>
              </div>

              {/* Torto info */}
              <div className="bg-amber-50 rounded-lg p-4">
                <Typography variant="h6" className="mb-3 text-amber-800">
                  Torto informacija
                </Typography>
                <div className="grid grid-cols-2 gap-4">
                  {selectedOrder.cake_type && (
                    <div>
                      <Typography variant="small" className="text-blue-gray-500">
                        Torto tipas
                      </Typography>
                      <Typography className="font-medium">{selectedOrder.cake_type}</Typography>
                    </div>
                  )}
                  {selectedOrder.cake_size && (
                    <div>
                      <Typography variant="small" className="text-blue-gray-500">
                        Dydis
                      </Typography>
                      <Typography className="font-medium">{selectedOrder.cake_size}</Typography>
                    </div>
                  )}
                  {selectedOrder.cake_flavor && (
                    <div>
                      <Typography variant="small" className="text-blue-gray-500">
                        Skonis
                      </Typography>
                      <Typography className="font-medium">{selectedOrder.cake_flavor}</Typography>
                    </div>
                  )}
                  {selectedOrder.decoration && (
                    <div className="col-span-2">
                      <Typography variant="small" className="text-blue-gray-500">
                        Dekoracijos
                      </Typography>
                      <Typography className="font-medium">{selectedOrder.decoration}</Typography>
                    </div>
                  )}
                </div>
              </div>

              {/* Pristatymas */}
              {(selectedOrder.delivery_date || selectedOrder.delivery_time) && (
                <div className="bg-green-50 rounded-lg p-4">
                  <Typography variant="h6" className="mb-3 text-green-800">
                    Pristatymo informacija
                  </Typography>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedOrder.delivery_date && (
                      <div>
                        <Typography variant="small" className="text-blue-gray-500">
                          Data
                        </Typography>
                        <Typography className="font-medium">
                          {new Date(selectedOrder.delivery_date).toLocaleDateString("lt-LT")}
                        </Typography>
                      </div>
                    )}
                    {selectedOrder.delivery_time && (
                      <div>
                        <Typography variant="small" className="text-blue-gray-500">
                          Laikas
                        </Typography>
                        <Typography className="font-medium">
                          {selectedOrder.delivery_time}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Žinutė */}
              {selectedOrder.message && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <Typography variant="h6" className="mb-3 text-purple-800">
                    Papildoma žinutė
                  </Typography>
                  <Typography className="whitespace-pre-wrap">
                    {selectedOrder.message}
                  </Typography>
                </div>
              )}
            </div>
          )}
        </DialogBody>
        <DialogFooter className="flex-col gap-4 sm:flex-row">
          {/* Status Quick Actions */}
          <div className="flex flex-wrap gap-2 mr-auto">
            <Typography variant="small" className="text-blue-gray-500 self-center mr-2">
              Statusas:
            </Typography>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  handleStatusChange(selectedOrder.id, status.value);
                  setSelectedOrder({ ...selectedOrder, status: status.value });
                }}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-200 border-2
                  ${selectedOrder?.status === status.value 
                    ? `${status.color === 'amber' ? 'bg-amber-500 text-white border-amber-500' : ''}
                       ${status.color === 'blue' ? 'bg-blue-500 text-white border-blue-500' : ''}
                       ${status.color === 'purple' ? 'bg-purple-500 text-white border-purple-500' : ''}
                       ${status.color === 'green' ? 'bg-green-500 text-white border-green-500' : ''}
                       ${status.color === 'red' ? 'bg-red-500 text-white border-red-500' : ''}`
                    : `${status.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : ''}
                       ${status.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : ''}
                       ${status.color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' : ''}
                       ${status.color === 'green' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : ''}
                       ${status.color === 'red' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : ''}`
                  }
                `}
              >
                {React.createElement(status.icon, { className: "w-3.5 h-3.5" })}
                {status.label}
              </button>
            ))}
          </div>
          <Button variant="outlined" color="blue-gray" onClick={() => setOpenViewModal(false)}>
            Uždaryti
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(false)} size="sm">
        <DialogHeader>Ištrinti užsakymą?</DialogHeader>
        <DialogBody>
          <Typography>
            Ar tikrai norite ištrinti užsakymą #{selectedOrder?.id} nuo{" "}
            {selectedOrder?.name}? Šis veiksmas negrįžtamas.
          </Typography>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="outlined" color="blue-gray" onClick={() => setOpenDeleteModal(false)}>
            Atšaukti
          </Button>
          <Button color="red" onClick={handleDelete}>
            Ištrinti
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Completed Orders Modal */}
      <Dialog open={openDeleteCompletedModal} handler={() => setOpenDeleteCompletedModal(false)} size="sm">
        <DialogHeader className="flex items-center gap-2">
          <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
          Ištrinti įvykdytus užsakymus?
        </DialogHeader>
        <DialogBody>
          <Typography>
            Ar tikrai norite ištrinti <strong>visus {tabCounts.completed} įvykdytus</strong> užsakymus? 
            Šis veiksmas negrįžtamas ir bus ištrinti visi užsakymai su statusu "Įvykdytas".
          </Typography>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button 
            variant="outlined" 
            color="blue-gray" 
            onClick={() => setOpenDeleteCompletedModal(false)}
            disabled={deletingCompleted}
          >
            Atšaukti
          </Button>
          <Button 
            color="red" 
            onClick={handleDeleteCompleted}
            disabled={deletingCompleted}
            className="flex items-center gap-2"
          >
            {deletingCompleted ? (
              <>
                <Spinner className="h-4 w-4" />
                Trinama...
              </>
            ) : (
              <>
                <TrashIcon className="h-4 w-4" />
                Ištrinti visus
              </>
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default OrdersList;
