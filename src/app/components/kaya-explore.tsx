import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Bed, X, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface House {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  type: string;
  image: string;
}

const allHouses: House[] = [
  {
    id: "1",
    title: "Modern 2 Bedroom Apartment",
    location: "Mamboleo, Kisumu",
    price: 25000,
    bedrooms: 2,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1764921587475-866c1d48dc48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "2",
    title: "Spacious 1 Bedroom Studio",
    location: "Milimani, Kisumu",
    price: 18000,
    bedrooms: 1,
    type: "Studio",
    image: "https://images.unsplash.com/photo-1507138451611-3001135909fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "3",
    title: "Luxury 3 Bedroom Apartment",
    location: "Riat, Kisumu",
    price: 45000,
    bedrooms: 3,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "4",
    title: "Affordable Bedsitter",
    location: "Kondele, Kisumu",
    price: 8000,
    bedrooms: 1,
    type: "Bedsitter",
    image: "https://images.unsplash.com/photo-1749878065837-6968c1805247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "5",
    title: "Executive 2 Bedroom",
    location: "Nyalenda, Kisumu",
    price: 22000,
    bedrooms: 2,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1597497522150-2f50bffea452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "6",
    title: "Cozy 1 Bedroom Flat",
    location: "Tom Mboya, Kisumu",
    price: 15000,
    bedrooms: 1,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1757439402224-56c48352f719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "7",
    title: "Family 4 Bedroom House",
    location: "Migosi, Kisumu",
    price: 60000,
    bedrooms: 4,
    type: "House",
    image: "https://images.unsplash.com/photo-1507138451611-3001135909fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "8",
    title: "Student Bedsitter",
    location: "Nyalenda, Kisumu",
    price: 6000,
    bedrooms: 1,
    type: "Bedsitter",
    image: "https://images.unsplash.com/photo-1764921587475-866c1d48dc48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
];

interface ExploreProps {
  onHouseClick: (houseId: string) => void;
  onProfileClick: () => void;
  userName: string;
}

export function KayaExplore({ onHouseClick, onProfileClick, userName }: ExploreProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>("All");

  const filteredHouses = allHouses.filter((house) => {
    const matchesPrice = house.price >= priceRange[0] && house.price <= priceRange[1];
    const matchesType = selectedType === "All" || house.type === selectedType;
    const matchesBedrooms =
      selectedBedrooms === "All" ||
      house.bedrooms === parseInt(selectedBedrooms);

    return matchesPrice && matchesType && matchesBedrooms;
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
                placeholder="Search properties..."
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3.5 rounded-xl flex items-center gap-2 transition-colors ${showFilters
                  ? "bg-primary text-white"
                  : "bg-white border border-border hover:bg-muted"
                }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 bg-white rounded-2xl p-6 border border-border">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm text-foreground mb-3">
                    Price Range (KSh)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="5000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>KSh 0</span>
                      <span>KSh {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm text-foreground mb-3">
                    Property Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Apartment", "Studio", "Bedsitter", "House"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-lg transition-colors ${selectedType === type
                            ? "bg-primary text-white"
                            : "bg-muted text-foreground hover:bg-muted-foreground/10"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm text-foreground mb-3">
                    Bedrooms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "1", "2", "3", "4"].map((bed) => (
                      <button
                        key={bed}
                        onClick={() => setSelectedBedrooms(bed)}
                        className={`px-4 py-2 rounded-lg transition-colors ${selectedBedrooms === bed
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
                  onClick={() => {
                    setPriceRange([0, 100000]);
                    setSelectedType("All");
                    setSelectedBedrooms("All");
                  }}
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
          <h2 className="text-2xl text-foreground mb-2">
            Discover Your Perfect Home
          </h2>
          <p className="text-muted-foreground">
            {filteredHouses.length} {filteredHouses.length === 1 ? "property" : "properties"} found
          </p>
        </div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHouses.map((house) => (
            <button
              key={house.id}
              onClick={() => onHouseClick(house.id)}
              className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all group text-left"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <ImageWithFallback
                  src={house.image}
                  alt={house.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-card-foreground mb-2 line-clamp-1 text-sm">
                  {house.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{house.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg text-primary">
                      KSh {house.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">per month</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Bed className="w-3.5 h-3.5" />
                    <span>{house.bedrooms}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredHouses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl text-foreground mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={() => {
                setPriceRange([0, 100000]);
                setSelectedType("All");
                setSelectedBedrooms("All");
              }}
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
