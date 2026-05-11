"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  User,
  Phone,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { registerUser } from "@/app/actions/authActions";

export default function AuthModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const authMode = searchParams.get("auth"); // 'login' or 'register'
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");

  // Reset errors when mode changes
  useEffect(() => {
    setErrorMessage("");
  }, [authMode]);

  if (!authMode) return null;

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    params.delete("callbackUrl");
    const newPath = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newPath || "/", { scroll: false });
  };

  const handleSwitchMode = (mode: "login" | "register") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("auth", mode);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage("Invalid email or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", regName);
      formData.append("email", regEmail);
      formData.append("password", regPassword);
      formData.append("phoneNumber", regPhone);

      const result = await registerUser(formData);

      if (!result.success) {
        setErrorMessage(result.error || "Registration failed.");
      } else {
        // Auto-login after successful registration
        const signInResult = await signIn("credentials", {
          email: regEmail,
          password: regPassword,
          redirect: false,
        });
        if (!signInResult?.error) {
          router.push(callbackUrl);
          router.refresh();
        } else {
          handleSwitchMode("login");
        }
      }
    } catch (err) {
      setErrorMessage("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-sm";
  const labelClass =
    "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Art */}
        <div className="relative pt-10 pb-6 px-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-white/0 pointer-events-none"></div>
          <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 pointer-events-none">
            <Sparkles className="w-32 h-32 text-sky-600" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <img src="/UniBoarding-black.png" alt="UniBoarding Logo" className="h-12 w-auto object-contain mb-4" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              {authMode === "login" ? "Welcome Back" : "Join UniBoarding.com"}
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-2">
              {authMode === "login"
                ? "Sign in to access exclusive housing listings."
                : "Create an account to connect with the best student housing."}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="px-8 pb-8">
          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 font-bold text-xs rounded-xl text-center">
              {errorMessage}
            </div>
          )}

          {authMode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-center pt-4">
                <span className="text-slate-500 text-sm font-medium">
                  Don't have an account?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("register")}
                  className="text-sky-600 font-bold text-sm hover:underline"
                >
                  Sign up
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="07X XXX XXXX"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-sky-600/20"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-center pt-4">
                <span className="text-slate-500 text-sm font-medium">
                  Already have an account?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("login")}
                  className="text-slate-900 font-bold text-sm hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
