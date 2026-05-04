import { X, Phone, User, Home, Heart, Eye, LogOut } from "lucide-react";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    id: string;
    phone: string;
    token: string;
  };
  onLogout: () => void;
}

export function KayaProfileSidebar({ isOpen, onClose, userData, onLogout }: ProfileSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" />

      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl text-foreground">Profile</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info Card */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-center text-xl mb-1">{userData.phone}</h3>
            <p className="text-center text-green-100 text-sm">House Hunter</p>
          </div>

          {/* Contact Details */}
          <div className="bg-muted rounded-2xl p-5 mb-6">
            <h3 className="text-sm text-muted-foreground mb-4">Account Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">Phone</div>
                <div className="text-sm text-foreground truncate">{userData.phone}</div>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-muted rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div className="text-lg text-foreground mb-1">—</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>

            <div className="bg-muted rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div className="text-lg text-foreground mb-1">—</div>
              <div className="text-xs text-muted-foreground">Saved</div>
            </div>

            <div className="bg-muted rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div className="text-lg text-foreground mb-1">—</div>
              <div className="text-xs text-muted-foreground">Unlocked</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground mb-2">Kaya House Hunting</p>
            <p className="text-xs text-muted-foreground">Version 1.0.0 • Made in Kenya 🇰🇪</p>
          </div>
        </div>
      </div>
    </>
  );
}
