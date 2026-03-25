import { Search, SlidersHorizontal, MapPin, Home as HomeIcon, Bed, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface House {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  type: string;
  image: string;
  isNew: boolean;
}

const houses: House[] = [
  {
    id: 1,
    title: "Modern 2 Bedroom Apartment",
    location: "Mamboleo, Kisumu",
    price: 25000,
    bedrooms: 2,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1764921587475-866c1d48dc48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isNew: true,
  },
  {
    id: 2,
    title: "Spacious 1 Bedroom Studio",
    location: "Milimani, Kisumu",
    price: 18000,
    bedrooms: 1,
    type: "Studio",
    image: "https://images.unsplash.com/photo-1507138451611-3001135909fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isNew: false,
  },
  {
    id: 3,
    title: "Luxury 3 Bedroom Apartment",
    location: "Riat, Kisumu",
    price: 45000,
    bedrooms: 3,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isNew: true,
  },
  {
    id: 4,
    title: "Affordable Bedsitter",
    location: "Kondele, Kisumu",
    price: 8000,
    bedrooms: 1,
    type: "Bedsitter",
    image: "https://images.unsplash.com/photo-1749878065837-6968c1805247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isNew: false,
  },
  {
    id: 5,
    title: "Executive 2 Bedroom",
    location: "Nyalenda, Kisumu",
    price: 22000,
    bedrooms: 2,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1597497522150-2f50bffea452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isNew: false,
  },
  {
    id: 6,
    title: "Cozy 1 Bedroom Flat",
    location: "Tom Mboya, Kisumu",
    price: 15000,
    bedrooms: 1,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1757439402224-56c48352f719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isNew: false,
  },
];

interface DashboardProps {
  onHouseClick: (houseId: number) => void;
  onProfileClick: () => void;
  userName: string;
}

export function KayaDashboard({ onHouseClick, onProfileClick, userName }: DashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-foreground">Kaya</h1>
                <p className="text-xs text-muted-foreground">Find Your Home</p>
              </div>
            </div>

            {/* User Profile */}
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
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button className="px-4 py-3.5 bg-white border border-border rounded-xl hover:bg-muted transition-colors flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-primary text-white rounded-lg whitespace-nowrap">
              All Houses
            </button>
            <button className="px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
              Apartments
            </button>
            <button className="px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
              Bedsitters
            </button>
            <button className="px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
              Studios
            </button>
          </div>
        </div>

        {/* Houses Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">Available Properties</h2>
            <p className="text-sm text-muted-foreground">{houses.length} properties found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses.map((house) => (
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
                  {house.isNew && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-white text-xs rounded-full">
                      New
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-card-foreground mb-2 line-clamp-1">{house.title}</h3>
                  
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{house.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl text-primary">
                        KSh {house.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Bed className="w-4 h-4" />
                      <span>{house.bedrooms} bed</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
