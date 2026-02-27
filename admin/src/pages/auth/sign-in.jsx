import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, AlertContext } from "@/context";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, setUser, token, setToken } = useContext(AuthContext);
  const { addAlert, hideAllAlerts } = useContext(AlertContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    hideAllAlerts();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = null;
      }

      if (!res.ok) {
        if (data && data.message) {
          let details = "";
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((error) => {
              details += error.msg + "<br />";
            });
          }
          addAlert(data.message, "warning", details || null);
        }
        setLoading(false);
        return;
      }

      // Tikrinti ar vartotojas turi admin teises
      if (data.user.role !== "admin") {
        addAlert("Prieiga uždrausta. Tik administratoriai gali prisijungti prie valdymo panelės.", "error");
        setLoading(false);
        return;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      addAlert("Prisijungta sėkmingai", "success");
    } catch (err) {
      addAlert("Tinklo klaida", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      setTimeout(() => navigate("/dashboard/home"), 1000);
    }
  }, [user, token]);

  return (
    <section className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/api/img/logo.jpg" 
              alt="Kream Logo" 
              className="h-20 w-auto mx-auto mb-4 rounded-xl shadow-md"
            />
            <Typography variant="h3" className="font-bold text-gray-900">
              Sveiki sugrįžę!
            </Typography>
            <Typography className="text-gray-500 mt-2">
              Prisijunkite prie admin panelės
            </Typography>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <Typography variant="small" className="font-medium text-gray-700 mb-2 block">
                El. paštas
              </Typography>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="vardas@paštas.lt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Typography variant="small" className="font-medium text-gray-700 mb-2 block">
                Slaptažodis
              </Typography>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-600">Prisiminti mane</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner className="h-5 w-5" />
                  <span>Jungiamasi...</span>
                </>
              ) : (
                <span>Prisijungti</span>
              )}
            </button>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
              <div className="flex items-start gap-3">
                <ShieldExclamationIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <Typography variant="small" className="font-medium text-amber-800">
                    Prieiga tik administratoriams
                  </Typography>
                  <Typography variant="small" className="text-amber-700 mt-1">
                    Užsiregistravus, administratorius turi patvirtinti jūsų paskyrą ir suteikti prieigos teises.
                  </Typography>
                </div>
              </div>
            </div>

            {/* Register Link */}
            <Typography className="text-center text-gray-600 mt-6">
              Neturite paskyros?{" "}
              <Link
                to="/auth/registruotis"
                className="font-semibold text-amber-600 hover:text-amber-700"
              >
                Registruotis
              </Link>
            </Typography>
          </form>
        </div>
      </div>

      {/* Right Side - Branded Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full"></div>
        </div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="text-center max-w-md">
            {/* Logo with glow effect */}
            <div className="relative mb-8">
              <div className="absolute inset-0 blur-2xl bg-white/30 rounded-full scale-150"></div>
              <img 
                src="/api/img/logo.jpg" 
                alt="Kream Logo" 
                className="h-28 w-auto mx-auto relative z-10 drop-shadow-2xl rounded-xl"
              />
            </div>
            
            <Typography variant="h2" className="font-bold mb-4">
              Valdymo Panelė
            </Typography>
            <Typography className="text-white/80 text-lg leading-relaxed">
              Valdykite savo tortų verslą lengvai ir efektyviai. 
              Užsakymai, produktai, klientai - viskas vienoje vietoje.
            </Typography>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <Typography variant="h3" className="font-bold">
                  150+
                </Typography>
                <Typography className="text-white/70 text-sm">
                  Užsakymų
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h3" className="font-bold">
                  50+
                </Typography>
                <Typography className="text-white/70 text-sm">
                  Produktų
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h3" className="font-bold">
                  99%
                </Typography>
                <Typography className="text-white/70 text-sm">
                  Pasitenkinimas
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 text-6xl opacity-20 animate-pulse">✨</div>
        <div className="absolute bottom-10 left-10 text-5xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>🧁</div>
        <div className="absolute top-1/3 right-20 text-4xl opacity-20 animate-pulse" style={{ animationDelay: "0.5s" }}>🍰</div>
      </div>
    </section>
  );
}

export default SignIn;
