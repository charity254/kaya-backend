import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, MapPin, Bed, User, Loader2, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiGet } from "../lib/api";

interface MediaItem {
  id: string;
  media_url: string;
  media_type: string;
}

interface House {
  id: string;
  title: string;
  rent_price: number;
  general_location: string;
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

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1764921587475-866c1d48dc48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1507138451611-3001135909fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1597497522150-2f50bffea452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1749878065837-6968c1805247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1757439402224-56c48352f719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
];

function getHouseImage(house: House, index: number): string {
  return house.media?.find((m) => m.media_type === "image")?.media_url ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
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

interface ExploreProps {
  onHouseClick: (houseId: string) => void;
  onProfileClick: () => void;
  userName: string;
}

export function KayaExplore({ onHouseClick, onProfileClick, userName }: ExploreProps) {
  const [allHouses, setAllHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>("All");

  const fetchHouses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<ApiResponse>("/houses?limit=100");
      setAllHouses(data.houses ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const filteredHouses = allHouses.filter((house) => {
    const type = getTypeFromTitle(house.title);
    const bedrooms = getBedroomsFromTitle(house.title);
    const matchesPrice = house.rent_price >= priceRange[0] && house.rent_price <= priceRange[1];
    const matchesType = selectedType === "All" || type === selectedType;
    const matchesBedrooms = selectedBedrooms === "All" || bedrooms === parseInt(selectedBedrooms);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      house.title.toLowerCase().includes(q) ||
      house.general_location.toLowerCase().includes(q) ||
      house.rent_price.toString().includes(q);
    return matchesPrice && matchesType && matchesBedrooms && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl text-foreground">Explore Properties</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by location, title, or price..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3.5 rounded-xl flex items-center gap-2 transition-colors ${
                showFilters ? "bg-primary text-white" : "bg-white border border-border hover:bg-muted"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 bg-white rounded-2xl p-6 border border-border">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-foreground mb-3">Price Range (KSh)</label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>KSh 0</span>
                      <span>KSh {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-3">Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Apartment", "Studio", "Bedsitter", "House"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedType === type
                            ? "bg-primary text-white"
                            : "bg-muted text-foreground hover:bg-muted-foreground/10"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-3">Bedrooms</label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "1", "2", "3", "4"].map((bed) => (
                      <button
                        key={bed}
                        onClick={() => setSelectedBedrooms(bed)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedBedrooms === bed
                            ? "bg-primary text-white"
                            : "bg-muted text-foreground hover:bg-muted-foreground/10"
                        }`}
                      >
                        {bed === "All" ? "All" : `${bed} bed`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <button
                  onClick={() => { setPriceRange([0, 100000]); setSelectedType("All"); setSelectedBedrooms("All"); setSearchQuery(""); }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl text-foreground mb-2">Discover Your Perfect Home</h2>
          {!loading && !error && (
            <p className="text-muted-foreground">
              {filteredHouses.length} {filteredHouses.length === 1 ? "property" : "properties"} found
            </p>
          )}
        </div>

        {/* States */}
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

        {/* Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHouses.map((house, index) => (
              <button
                key={house.id}
                onClick={() => onHouseClick(house.id)}
                className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all group text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={getHouseImage(house, index)}
                    alt={house.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {house.is_unlocked && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      Unlocked
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-card-foreground mb-2 line-clamp-1 text-sm">{house.title}</h3>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{house.general_location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg text-primary">KSh {house.rent_price.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Bed className="w-3.5 h-3.5" />
                      <span>{getBedroomsFromTitle(house.title)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && !error && filteredHouses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl text-foreground mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results</p>
            <button
              onClick={() => { setPriceRange([0, 100000]); setSelectedType("All"); setSelectedBedrooms("All"); setSearchQuery(""); }}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
