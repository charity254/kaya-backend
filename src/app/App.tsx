import { useState, useEffect } from "react";
import { KayaLogin } from "./components/kaya-login";
import { KayaDashboard } from "./components/kaya-dashboard";
import { KayaHouseDetail } from "./components/kaya-house-detail";
import { KayaExplore } from "./components/kaya-explore";
import { KayaProfileSidebar } from "./components/kaya-profile-sidebar";
import { clearAuth } from "./lib/api";
import { Home, Compass } from "lucide-react";

type Screen = "login" | "dashboard" | "explore" | "house-detail";

export interface UserData {
  id: string;
  phone: string;
  token: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("kaya_user");
    if (stored) {
      try {
        const parsed: UserData = JSON.parse(stored);
        if (parsed.token && parsed.id && parsed.phone) {
          setUserData(parsed);
          setIsLoggedIn(true);
          setCurrentScreen("dashboard");
        }
      } catch {
        clearAuth();
      }
    }
  }, []);

  const handleLogin = (data: UserData) => {
    setUserData(data);
    setIsLoggedIn(true);
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentScreen("login");
    setShowProfileSidebar(false);
  };

  const handleHouseClick = (houseId: string) => {
    setSelectedHouseId(houseId);
    setCurrentScreen("house-detail");
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard");
    setSelectedHouseId(null);
  };

  const handleTabChange = (tab: "dashboard" | "explore") => {
    setCurrentScreen(tab);
  };

  if (!isLoggedIn) {
    return <KayaLogin onLogin={handleLogin} />;
  }

  return (
    <div className="size-full">
      {currentScreen === "dashboard" && userData && (
        <KayaDashboard
          onHouseClick={handleHouseClick}
          onProfileClick={() => setShowProfileSidebar(true)}
          userName={userData.phone}
        />
      )}

      {currentScreen === "explore" && userData && (
        <KayaExplore
          onHouseClick={handleHouseClick}
          onProfileClick={() => setShowProfileSidebar(true)}
          userName={userData.phone}
        />
      )}

      {currentScreen === "house-detail" && selectedHouseId && (
        <KayaHouseDetail houseId={selectedHouseId} onBack={handleBackToDashboard} />
      )}

      {currentScreen !== "house-detail" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-30">
          <div className="max-w-md mx-auto flex items-center justify-around px-6 py-3">
            <button
              onClick={() => handleTabChange("dashboard")}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                currentScreen === "dashboard"
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => handleTabChange("explore")}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                currentScreen === "explore"
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Compass className="w-6 h-6" />
              <span className="text-xs">Explore</span>
            </button>
          </div>
        </div>
      )}

      {userData && (
        <KayaProfileSidebar
          isOpen={showProfileSidebar}
          onClose={() => setShowProfileSidebar(false)}
          userData={userData}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
