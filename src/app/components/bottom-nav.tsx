import { Calendar, Users, Image, User } from "lucide-react";

interface BottomNavProps {
  activeTab: "timeline" | "speakers" | "media" | "profile";
  onTabChange: (tab: "timeline" | "speakers" | "media" | "profile") => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around px-4 py-3">
          <button
            onClick={() => onTabChange("timeline")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === "timeline"
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Schedule</span>
          </button>

          <button
            onClick={() => onTabChange("speakers")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === "speakers"
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs">Speakers</span>
          </button>

          <button
            onClick={() => onTabChange("media")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === "media"
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image className="w-6 h-6" />
            <span className="text-xs">Media</span>
          </button>

          <button
            onClick={() => onTabChange("profile")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === "profile"
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}