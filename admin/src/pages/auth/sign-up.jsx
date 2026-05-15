import { buildApiUrl } from '../../utils/api.js';
import { useState, useContext } from "react";
import {
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { AlertContext } from "@/context";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const { addAlert, hideAllAlerts } = useContext(AlertContext);

  // Password strength checker
  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const strengthLabels = ['Labai silpnas', 'Silpnas', 'Vidutinis', 'Stiprus', 'Labai stiprus'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    hideAllAlerts();

    if (!email || !password || !password2) {
      addAlert("Visi laukai privalomi", "warning");
      return;
    }

    if (password !== password2) {
      addAlert("Slaptažodžiai nesutampa", "warning");
      return;
    }

    if (password.length < 6) {
      addAlert("Slaptažodis turi būti bent 6 simbolių", "warning");
      return;
    }

    if (!agreed) {
      addAlert("Turite sutikti su sąlygomis", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(buildApiUrl('/api/register'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
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

      addAlert("Registracija sėkminga! Laukite kol administratorius patvirtins jūsų paskyrą.", "success");
      setTimeout(() => navigate("/auth/prisijungti"), 2000);
    } catch (error) {
      addAlert("Serverio klaida", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex">
      {/* Left Side - Branded Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
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
              Prisijunk prie mūsų!
            </Typography>
            <Typography className="text-white/80 text-lg leading-relaxed mb-8">
              Sukurkite paskyrą ir pradėkite valdyti savo verslą efektyviai.
            </Typography>

            {/* Features */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6 text-white/80" />
                <span className="text-white/90">Pilna užsakymų valdymo sistema</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6 text-white/80" />
                <span className="text-white/90">Produktų katalogo tvarkymas</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6 text-white/80" />
                <span className="text-white/90">Išsami statistika ir ataskaitos</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6 text-white/80" />
                <span className="text-white/90">El. pašto pranešimai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 text-6xl opacity-20 animate-pulse">✨</div>
        <div className="absolute bottom-10 left-10 text-5xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>🧁</div>
      </div>

      {/* Right Side - Form */}
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
              Sukurti paskyrą
            </Typography>
            <Typography className="text-gray-500 mt-2">
              Užpildykite formą žemiau
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
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <Typography variant="small" className="text-gray-500">
                    Stiprumas: {strengthLabels[passwordStrength - 1] || 'Įveskite slaptažodį'}
                  </Typography>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <Typography variant="small" className="font-medium text-gray-700 mb-2 block">
                Pakartokite slaptažodį
              </Typography>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword2 ? "text" : "password"}
                  placeholder="••••••••"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white ${
                    password2 && password !== password2 ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword2 ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {password2 && password !== password2 && (
                <Typography variant="small" className="text-red-500 mt-1">
                  Slaptažodžiai nesutampa
                </Typography>
              )}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-600">
                Sutinku su{" "}
                <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">
                  paslaugų teikimo sąlygomis
                </a>{" "}
                ir{" "}
                <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">
                  privatumo politika
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner className="h-5 w-5" />
                  <span>Kuriama...</span>
                </>
              ) : (
                <span>Sukurti paskyrą</span>
              )}
            </button>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <Typography variant="small" className="font-medium text-blue-800">
                    Saugi registracija
                  </Typography>
                  <Typography variant="small" className="text-blue-700 mt-1">
                    Po registracijos administratorius patikrins ir patvirtins jūsų paskyrą.
                  </Typography>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <Typography className="text-center text-gray-600 mt-6">
              Jau turite paskyrą?{" "}
              <Link
                to="/auth/prisijungti"
                className="font-semibold text-amber-600 hover:text-amber-700"
              >
                Prisijungti
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
