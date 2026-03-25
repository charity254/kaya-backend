import { Mail, Phone, User, Home, ArrowRight } from "lucide-react";
import { useState } from "react";

interface KayaLoginProps {
  onLogin: (userData: { name: string; email: string; phone: string }) => void;
}

export function KayaLogin({ onLogin }: KayaLoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      onLogin({ name, email, phone });
    } else {
      // Mock login - in real app would verify credentials
      onLogin({ name: "Alex Ochieng", email, phone: "+254712345678" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
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
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isRegister
                ? "Start your house hunting journey"
                : "Sign in to continue house hunting"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input - Only for Register */}
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone Input */}
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
                  placeholder="+254 712 345 678"
                  className="w-full pl-12 pr-4 py-3.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-6"
            >
              {isRegister ? "Create Account" : "Sign In"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center mt-6 text-sm">
            <span className="text-muted-foreground">
              {isRegister ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary hover:underline"
            >
              {isRegister ? "Sign in" : "Create account"}
            </button>
          </div>
        </div>

        {/* Trust Badge */}
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
