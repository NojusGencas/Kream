import { useEffect, useMemo, useState, useContext } from "react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PencilIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import {
  TrashIcon,
} from "@heroicons/react/24/solid";
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
  Switch,
  Spinner,
  Input,
} from "@material-tailwind/react";
import { AuthContext, AlertContext } from "@/context";

const TABS = [
  { label: "Visi", value: "all", icon: UserGroupIcon },
  { label: "Administratoriai", value: "admin", icon: ShieldCheckIcon },
  { label: "Vartotojai", value: "user", icon: UserIcon },
];

export function UserList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  
  // Edit modals
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const { token, user: currentUser } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);

  useEffect(() => {
    if (!token) return;
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(data || []);
    } catch (e) {
      addAlert(e.message || "Nepavyko užkrauti vartotojų", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const byTab = tab === "all" ? rows : rows.filter((r) => r.role === tab);
    const term = q.trim().toLowerCase();
    if (!term) return byTab;
    return byTab.filter((r) => r.email?.toLowerCase().includes(term));
  }, [rows, tab, q]);

  const stats = useMemo(() => ({
    total: rows.length,
    admins: rows.filter((r) => r.role === "admin").length,
    users: rows.filter((r) => r.role === "user").length,
    active: rows.filter((r) => r.status === 1).length,
  }), [rows]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Nepavyko pakeisti rolės");

      setRows((prev) =>
        prev.map((r) => (r.id === userId ? { ...r, role: newRole } : r))
      );
      addAlert("Rolė pakeista sėkmingai", "success");
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Nepavyko pakeisti būsenos");

      setRows((prev) =>
        prev.map((r) => (r.id === userId ? { ...r, status: newStatus } : r))
      );
      addAlert("Būsena pakeista sėkmingai", "success");
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(`/api/users/${deletingUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Nepavyko ištrinti vartotojo");

      setRows((prev) => prev.filter((r) => r.id !== deletingUser.id));
      addAlert("Vartotojas ištrintas", "success");
      setOpenDeleteModal(false);
      setDeletingUser(null);
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setEditEmail(user.email);
    setEditPassword("");
    setShowPassword(false);
    setOpenEditModal(true);
  };

  const handleUpdateEmail = async () => {
    if (!editingUser || !editEmail.trim()) return;
    
    if (editEmail === editingUser.email) {
      addAlert("El. paštas nepakito", "warning");
      return;
    }

    setEditLoading(true);
    try {
      const res = await fetch(`/api/users/${editingUser.id}/email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: editEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Nepavyko pakeisti el. pašto");

      setRows((prev) =>
        prev.map((r) => (r.id === editingUser.id ? { ...r, email: editEmail } : r))
      );
      setEditingUser((prev) => ({ ...prev, email: editEmail }));
      addAlert("El. paštas pakeistas sėkmingai", "success");
    } catch (err) {
      addAlert(err.message, "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!editingUser || !editPassword.trim()) {
      addAlert("Įveskite naują slaptažodį", "warning");
      return;
    }

    if (editPassword.length < 4) {
      addAlert("Slaptažodis per trumpas (min. 4 simboliai)", "warning");
      return;
    }

    setEditLoading(true);
    try {
      const res = await fetch(`/api/users/${editingUser.id}/reset-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: editPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Nepavyko pakeisti slaptažodžio");

      setEditPassword("");
      addAlert("Slaptažodis pakeistas sėkmingai", "success");
    } catch (err) {
      addAlert(err.message, "error");
    } finally {
      setEditLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEditPassword(password);
    setShowPassword(true);
  };

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : "?";
  };

  const getAvatarColor = (role) => {
    return role === "admin"
      ? "bg-gradient-to-br from-purple-500 to-indigo-600"
      : "bg-gradient-to-br from-blue-400 to-cyan-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner className="h-12 w-12" color="amber" />
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500">
                  Viso vartotojų
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.total}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500">
                  Administratoriai
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.admins}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500">
                  Paprasti vartotojai
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.users}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500">
                  Aktyvūs
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.active}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Card */}
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader floated={false} shadow={false} className="rounded-none p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Vartotojų valdymas
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-sm">
                Valdykite sistemos vartotojus ir jų teises
              </Typography>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {TABS.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTab(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    tab === value
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                      : "bg-blue-gray-50 text-blue-gray-700 hover:bg-blue-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      tab === value ? "bg-white/20" : "bg-blue-gray-200"
                    }`}
                  >
                    {value === "all"
                      ? stats.total
                      : value === "admin"
                      ? stats.admins
                      : stats.users}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-gray-400" />
              <input
                type="text"
                placeholder="Ieškoti pagal el. paštą..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-blue-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-0">
          {/* User List */}
          <div className="divide-y divide-blue-gray-50">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-blue-gray-400">
                <UserGroupIcon className="w-16 h-16 mb-4 opacity-50" />
                <Typography>Vartotojų nerasta</Typography>
              </div>
            ) : (
              filtered.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 hover:bg-blue-gray-50/50 transition-colors gap-4"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${getAvatarColor(
                        user.role
                      )} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                    >
                      {getInitials(user.email)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Typography
                          variant="small"
                          className="font-semibold text-blue-gray-900"
                        >
                          {user.email}
                        </Typography>
                        {user.id === currentUser?.id && (
                          <Chip
                            value="Tu"
                            size="sm"
                            color="amber"
                            className="rounded-full text-xs"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <EnvelopeIcon className="w-4 h-4 text-blue-gray-400" />
                        <Typography variant="small" className="text-blue-gray-500">
                          ID: {user.id}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4 md:gap-6 flex-wrap md:flex-nowrap">
                    {/* Role Select */}
                    <div className="flex items-center gap-3">
                      <Typography variant="small" className="text-blue-gray-600 hidden md:block">
                        Rolė:
                      </Typography>
                      <div className="w-44">
                        <Select
                          value={user.role}
                          onChange={(val) => handleRoleChange(user.id, val)}
                          disabled={user.id === currentUser?.id}
                          className="!border-blue-gray-200"
                          labelProps={{ className: "hidden" }}
                          containerProps={{ className: "min-w-[140px]" }}
                        >
                          <Option value="admin">
                            <div className="flex items-center gap-2">
                              <ShieldCheckIcon className="w-4 h-4 text-purple-500" />
                              Administratorius
                            </div>
                          </Option>
                          <Option value="user">
                            <div className="flex items-center gap-2">
                              <UserIcon className="w-4 h-4 text-blue-500" />
                              Vartotojas
                            </div>
                          </Option>
                        </Select>
                      </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center gap-3">
                      <Typography variant="small" className="text-blue-gray-600 hidden md:block">
                        Būsena:
                      </Typography>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.status === 1}
                          onChange={() =>
                            handleStatusChange(user.id, user.status === 1 ? 0 : 1)
                          }
                          disabled={user.id === currentUser?.id}
                          color="green"
                        />
                        <Chip
                          value={user.status === 1 ? "Aktyvus" : "Neaktyvus"}
                          size="sm"
                          color={user.status === 1 ? "green" : "red"}
                          variant="ghost"
                          className="rounded-full"
                          icon={
                            user.status === 1 ? (
                              <CheckCircleIcon className="w-4 h-4" />
                            ) : (
                              <XCircleIcon className="w-4 h-4" />
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Edit Button */}
                      <Tooltip content="Redaguoti vartotoją">
                        <IconButton
                          variant="text"
                          color="blue"
                          onClick={() => openEditUser(user)}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </IconButton>
                      </Tooltip>

                      {/* Delete Button */}
                      {user.id !== currentUser?.id && (
                        <Tooltip content="Ištrinti vartotoją">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => {
                              setDeletingUser(user);
                              setOpenDeleteModal(true);
                            }}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(false)} size="sm">
        <DialogHeader className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <TrashIcon className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <Typography variant="h5">Ištrinti vartotoją?</Typography>
          </div>
        </DialogHeader>
        <DialogBody>
          <Typography className="text-blue-gray-600">
            Ar tikrai norite ištrinti vartotoją{" "}
            <span className="font-semibold text-blue-gray-900">
              {deletingUser?.email}
            </span>
            ? Šis veiksmas negrįžtamas.
          </Typography>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={() => setOpenDeleteModal(false)}
          >
            Atšaukti
          </Button>
          <Button color="red" onClick={handleDelete}>
            Ištrinti
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog 
        open={openEditModal} 
        handler={() => setOpenEditModal(false)} 
        size="md"
      >
        <DialogHeader className="flex items-center gap-3 border-b border-blue-gray-100 pb-4">
          <div className={`w-12 h-12 rounded-xl ${getAvatarColor(editingUser?.role)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
            {getInitials(editingUser?.email)}
          </div>
          <div>
            <Typography variant="h5">Redaguoti vartotoją</Typography>
            <Typography variant="small" className="text-blue-gray-500 font-normal">
              ID: {editingUser?.id}
            </Typography>
          </div>
        </DialogHeader>
        <DialogBody className="space-y-6 pt-6">
          {/* Email Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-amber-500" />
              <Typography variant="h6" color="blue-gray">
                El. pašto adresas
              </Typography>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  label="El. paštas"
                  color="amber"
                  className="!border-blue-gray-200 focus:!border-amber-500"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
              <Button
                color="amber"
                onClick={handleUpdateEmail}
                disabled={editLoading || editEmail === editingUser?.email}
                className="flex items-center gap-2"
              >
                {editLoading ? <Spinner className="h-4 w-4" /> : "Išsaugoti"}
              </Button>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <KeyIcon className="w-5 h-5 text-amber-500" />
              <Typography variant="h6" color="blue-gray">
                Slaptažodžio keitimas
              </Typography>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <Typography variant="small" className="text-amber-800 mb-3">
                <strong>Pastaba:</strong> Slaptažodžiai yra užšifruoti ir negali būti peržiūrėti. 
                Galite nustatyti naują slaptažodį vartotojui.
              </Typography>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    label="Naujas slaptažodis"
                    color="amber"
                    className="!border-blue-gray-200 focus:!border-amber-500 pr-10"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                  <IconButton
                    variant="text"
                    size="sm"
                    className="!absolute right-1 top-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4 text-blue-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-blue-gray-500" />
                    )}
                  </IconButton>
                </div>
                <Tooltip content="Sugeneruoti atsitiktinį">
                  <Button
                    variant="outlined"
                    color="blue-gray"
                    onClick={generateRandomPassword}
                    className="px-3"
                  >
                    🎲
                  </Button>
                </Tooltip>
              </div>
              {editPassword && (
                <div className="mt-3 flex items-center justify-between">
                  <Typography variant="small" className="text-blue-gray-600">
                    Naujas slaptažodis: <code className="bg-white px-2 py-1 rounded font-mono">{showPassword ? editPassword : "••••••••"}</code>
                  </Typography>
                  <Button
                    size="sm"
                    color="amber"
                    onClick={handleResetPassword}
                    disabled={editLoading}
                    className="flex items-center gap-2"
                  >
                    {editLoading ? <Spinner className="h-4 w-4" /> : "Pakeisti slaptažodį"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 bg-blue-gray-50 rounded-xl">
            <Typography variant="small" className="text-blue-gray-600 mb-2 font-semibold">
              Vartotojo informacija
            </Typography>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-gray-400">Rolė:</span>
                <Chip
                  value={editingUser?.role === "admin" ? "Administratorius" : "Vartotojas"}
                  size="sm"
                  color={editingUser?.role === "admin" ? "purple" : "blue"}
                  className="rounded-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-gray-400">Būsena:</span>
                <Chip
                  value={editingUser?.status === 1 ? "Aktyvus" : "Neaktyvus"}
                  size="sm"
                  color={editingUser?.status === 1 ? "green" : "red"}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="border-t border-blue-gray-100 pt-4">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={() => setOpenEditModal(false)}
          >
            Uždaryti
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default UserList;
