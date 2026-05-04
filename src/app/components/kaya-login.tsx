import { Phone, Home, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { apiPost, setToken } from "../lib/api";

interface VerifyOTPResponse {
  token: string;
  user: { id: string; phone: string; role: string };
}

interface KayaLoginProps {
  onLogin: (userData: { id: string; phone: string; token: string }) => void;
}

export function KayaLogin({ onLogin }: KayaLoginProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiPost("/auth/request-otp", { phone });
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiPost<VerifyOTPResponse>("/auth/verify-otp", { phone, otp });
      setToken(res.token);
      localStorage.setItem("kaya_user", JSON.stringify({ id: res.user.id, phone: res.user.phone, token: res.token }));
      onLogin({ id: res.user.id, phone: res.user.phone, token: res.token });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-5 bg-white rounded-3xl mb-4 shadow-2xl">
            <Home className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-white text-4xl mb-2">Kaya</h1>
          <p className="text-green-100 text-lg">Find Your Perfect Home in Kenya</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-foreground mb-2">
              {step === "phone" ? "Welcome" : "Verify OTP"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === "phone"
                ? "Enter your phone number to get started"
                : `We sent a 6-digit code to ${phone}`}
            </p>
          </div>

          {step === "phone" ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm text-foreground mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX or +254..."
                    className="w-full pl-12 pr-4 py-3.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm text-foreground mb-2">
                  One-Time Password
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-center text-2xl tracking-widest"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & Sign In <ArrowRight className="w-5 h-5" /></>}
              </button>

              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setError(null); }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Use a different number
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-green-100 text-sm">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            <span>Trusted by 10,000+ house hunters in Kenya</span>
          </div>
        </div>
      </div>
    </div>
  );
}
