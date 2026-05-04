import { Search, SlidersHorizontal, MapPin, Home as HomeIcon, Bed, User, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { apiGet } from "../lib/api";

interface MediaItem {
  id: string;
  media_url: string;
  media_type: string;
}

interface House {
  id: string;
  title: string;
  description: string;
  rent_price: number;
  general_location: string;
  exact_location: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_number: string | null;
  managed_by: string;
  landmarks: string;
  distance_info: string;
  is_unlocked: boolean;
  media: MediaItem[] | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  count: number;
  houses: House[];
}

function getTypeFromTitle(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("bedsitter")) return "Bedsitter";
  if (lower.includes("studio")) return "Studio";
  if (lower.includes("apartment")) return "Apartment";
  if (lower.includes("flat")) return "Flat";
  return "House";
}

function getBedroomsFromTitle(title: string): number {
  const match = title.match(/(\d+)\s*bedroom/i);
  return match ? parseInt(match[1]) : 1;
}

function isNewListing(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1764921587475-866c1d48dc48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1507138451611-3001135909fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1597497522150-2f50bffea452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1749878065837-6968c1805247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1757439402224-56c48352f719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
];

function getHouseImage(house: House, index: number): string {
  const firstImage = house.media?.find((m) => m.media_type === "image")?.media_url;
  return firstImage ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

interface DashboardProps {
  onHouseClick: (houseId: string) => void;
  onProfileClick: () => void;
  userName: string;
}

export function KayaDashboard({ onHouseClick, onProfileClick, userName }: DashboardProps) {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Houses");

  const fetchHouses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<ApiResponse>("/houses");
      setHouses(data.houses ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const filterTypes = ["All Houses", "Apartments", "Bedsitters", "Studios"];

  const filteredHouses = houses.filter((house) => {
    const type = getTypeFromTitle(house.title);
    const matchesFilter =
      activeFilter === "All Houses" ||
      (activeFilter === "Apartments" && type === "Apartment") ||
      (activeFilter === "Bedsitters" && type === "Bedsitter") ||
      (activeFilter === "Studios" && type === "Studio");

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      house.title.toLowerCase().includes(q) ||
      house.general_location.toLowerCase().includes(q) ||
      house.rent_price.toString().includes(q) ||
      type.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-foreground">Kaya</h1>
                <p className="text-xs text-muted-foreground">Find Your Home</p>
              </div>
            </div>

            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-foreground hidden sm:block">{userName}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by location, price, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button className="px-4 py-3.5 bg-white border border-border rounded-xl hover:bg-muted transition-colors flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterTypes.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? "bg-primary text-white"
                    : "bg-white border border-border hover:bg-muted"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Houses Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">Available Properties</h2>
            <div className="flex items-center gap-3">
              {!loading && !error && (
                <p className="text-sm text-muted-foreground">{filteredHouses.length} properties found</p>
              )}
              <button
                onClick={fetchHouses}
                disabled={loading}
                className="text-sm text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Loading properties...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <AlertCircle className="w-10 h-10 text-destructive" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <button
                onClick={fetchHouses}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredHouses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
              <HomeIcon className="w-10 h-10" />
              <p className="text-sm">No properties match your search.</p>
            </div>
          )}

          {!loading && !error && filteredHouses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHouses.map((house, index) => {
                const type = getTypeFromTitle(house.title);
                const bedrooms = getBedroomsFromTitle(house.title);
                const isNew = isNewListing(house.created_at);
                const image = getHouseImage(house, index);

                return (
                  <button
                    key={house.id}
                    onClick={() => onHouseClick(house.id)}
                    className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all group text-left"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={image}
                        alt={house.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isNew && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-white text-xs rounded-full">
                          New
                        </div>
                      )}
                      {house.is_unlocked && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs rounded-full">
                          Unlocked
                        </div>
                      )}
                      {!house.is_unlocked && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs rounded-full text-foreground">
                          {type}
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-card-foreground mb-2 line-clamp-1">{house.title}</h3>

                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="line-clamp-1">{house.general_location}</span>
                      </div>

                      {house.distance_info && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-1 pl-5">{house.distance_info}</p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <div className="text-2xl text-primary">
                            KSh {house.rent_price.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">per month</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Bed className="w-4 h-4" />
                          <span>{bedrooms} bed</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
