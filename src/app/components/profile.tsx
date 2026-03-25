import { Mail, MapPin, Briefcase, Calendar, Award, Bell, ChevronRight, LogOut, Settings, Ticket, QrCode } from "lucide-react";

interface ProfileProps {
  onLogout: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Avatar */}
      <div className="bg-gradient-to-br from-primary to-secondary pt-12 pb-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-block relative mb-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg">
              👤
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <h1 className="text-white text-2xl mb-1">Alex Morgan</h1>
          <p className="text-blue-100">Product Designer</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-md mx-auto px-6 -mt-12">
        {/* Ticket Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 shadow-lg mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              <span className="text-sm">Conference Pass</span>
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-xs">
              VIP Access
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-100 mb-1">Ticket ID</div>
              <div className="text-lg">TK-2026-0451</div>
            </div>
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
              <QrCode className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl text-primary mb-1">9</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div>
              <div className="text-2xl text-primary mb-1">4</div>
              <div className="text-xs text-muted-foreground">Speakers Met</div>
            </div>
            <div>
              <div className="text-2xl text-primary mb-1">28</div>
              <div className="text-xs text-muted-foreground">Connections</div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6">
          <h2 className="text-card-foreground mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-muted-foreground text-xs mb-0.5">Email</div>
                <div className="text-card-foreground truncate">alex.morgan@company.com</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-muted-foreground text-xs mb-0.5">Company</div>
                <div className="text-card-foreground truncate">Tech Innovations Inc.</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-muted-foreground text-xs mb-0.5">Location</div>
                <div className="text-card-foreground truncate">Nairobi, Kenya</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-muted-foreground text-xs mb-0.5">Registered</div>
                <div className="text-card-foreground truncate">January 15, 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6">
          <h2 className="text-card-foreground mb-4">Conference Badges</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs text-muted-foreground">Early Bird</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs text-muted-foreground">Networker</div>
            </div>
            <div className="text-center opacity-40">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Award className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">Attendee</div>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
          <button className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="text-card-foreground">Notifications</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="h-px bg-border"></div>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-card-foreground">Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="h-px bg-border"></div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors text-destructive"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
