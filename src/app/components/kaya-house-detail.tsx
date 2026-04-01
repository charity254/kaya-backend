import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Sofa,
  Wifi,
  Car,
  Droplet,
  Zap,
  ShieldCheck,
  Play,
  ChevronLeft,
  ChevronRight,
  Lock,
  Phone,
  Navigation,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HouseDetailProps {
  houseId: string;
  onBack: () => void;
}

export function KayaHouseDetail({ houseId, onBack }: HouseDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Mock house data
  const house = {
    id: houseId,
    title: "Modern 2 Bedroom Apartment",
    location: "Mamboleo, Kisumu",
    exactLocation: "Plot 245, Mamboleo Estate, Near Kisumu Boys High School",
    coordinates: { lat: -0.0917, lng: 34.7680 },
    price: 25000,
    bedrooms: 2,
    bathrooms: 1,
    type: "Apartment",
    managedBy: "Owner",
    contactPerson: "+254 712 345 678",
    contactName: "Jane Akinyi",
    images: [
      "https://images.unsplash.com/photo-1764921587475-866c1d48dc48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1749878065837-6968c1805247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1597497522150-2f50bffea452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1757439402224-56c48352f719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    amenities: [
      { icon: Wifi, label: "Wi-Fi Ready" },
      { icon: Droplet, label: "Water 24/7" },
      { icon: Zap, label: "Backup Generator" },
      { icon: Car, label: "Parking Space" },
      { icon: ShieldCheck, label: "Secure Compound" },
      { icon: Sofa, label: "Furnished" },
    ],
    landmarks: [
      { name: "Kisumu Boys High School", distance: "500m" },
      { name: "Tuskys Supermarket", distance: "1.2km" },
      { name: "Kisumu Airport", distance: "8km" },
      { name: "Kisumu CBD", distance: "4km" },
    ],
    description: "Beautiful 2-bedroom apartment in a secure compound. Perfect for small families or professionals. The house features modern finishes, ample natural lighting, and 24/7 water supply. Located in a quiet neighborhood with easy access to major amenities.",
  };

  const handlePayment = () => {
    if (!phoneNumber) return;
    // Mock: Send OTP
    setShowOtpInput(true);
  };

  const handleVerifyOtp = () => {
    if (otp === "1234") { // Mock OTP verification
      setIsPaid(true);
      setShowPaymentModal(false);
    } else {
      alert("Invalid OTP. Try 1234 for demo");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % house.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + house.images.length) % house.images.length);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to listings</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden mb-4">
            <ImageWithFallback
              src={house.images[currentImageIndex]}
              alt={house.title}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full">
              {currentImageIndex + 1} / {house.images.length}
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-5 gap-2">
            {house.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-video bg-muted rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Virtual Tour Video */}
        <div className="mb-8 bg-white rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-5 h-5 text-primary" />
            <h3 className="text-foreground">Virtual Walkthrough Tour</h3>
          </div>
          <div className="aspect-video bg-muted rounded-xl overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={house.videoUrl}
              title="Virtual Tour"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Watch a complete 360° virtual tour of the property
          </p>
        </div>

        {/* House Details */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h1 className="text-3xl text-foreground mb-2">{house.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-5 h-5" />
                <span>{house.location}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl text-primary">KSh {house.price.toLocaleString()}</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="text-foreground mb-3">About This Property</h3>
              <p className="text-muted-foreground leading-relaxed">{house.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="text-foreground mb-4">Amenities & Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-primary" />
                  <span className="text-sm">{house.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-primary" />
                  <span className="text-sm">{house.bathrooms} Bathroom</span>
                </div>
                {house.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <amenity.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Landmarks */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="text-foreground mb-4">Nearby Landmarks</h3>
              <div className="space-y-3">
                {house.landmarks.map((landmark, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{landmark.name}</span>
                    <span className="text-sm text-primary">{landmark.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Management Info */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="text-foreground mb-4">Property Management</h3>
              <div className="flex items-center gap-3 p-3 bg-accent rounded-xl">
                <ShieldCheck className="w-10 h-10 text-accent-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Managed By</div>
                  <div className="text-foreground">{house.managedBy}</div>
                </div>
              </div>
            </div>

            {/* Locked Contact Information */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-foreground">Contact Details</h3>
              </div>

              {!isPaid ? (
                <div>
                  {/* Blurred Info */}
                  <div className="mb-4 space-y-3">
                    <div className="p-3 bg-muted rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">Exact Location</div>
                      <div className="text-foreground blur-sm select-none">
                        {house.exactLocation}
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">Contact Person</div>
                      <div className="text-foreground blur-sm select-none">
                        {house.contactName}
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                      <div className="text-foreground blur-sm select-none">
                        {house.contactPerson}
                      </div>
                    </div>
                  </div>

                  {/* Unlock Button */}
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    Unlock for KSh 400
                  </button>

                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Get verified contact details and exact location
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Unlocked Info */}
                  <div className="p-3 bg-accent rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Exact Location</div>
                    <div className="text-foreground flex items-start gap-2">
                      <Navigation className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>{house.exactLocation}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-accent rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Contact Person</div>
                    <div className="text-foreground">{house.contactName}</div>
                  </div>
                  <div className="p-3 bg-accent rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                    <a
                      href={`tel:${house.contactPerson}`}
                      className="text-primary flex items-center gap-2 hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {house.contactPerson}
                    </a>
                  </div>
                  
                  <button className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-primary/90 transition-colors">
                    Call Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl text-foreground mb-2">Unlock Contact Details</h2>
            <p className="text-muted-foreground mb-6">
              Pay KSh 400 to get verified contact information and exact location
            </p>

            {!showOtpInput ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+254 712 345 678"
                      className="w-full pl-12 pr-4 py-3.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="bg-accent p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-lg text-foreground">KSh 400</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You'll receive an M-Pesa STK push on your phone
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter the OTP sent to your phone to complete payment
                </p>
                <div>
                  <label className="block text-sm text-foreground mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                    className="w-full px-4 py-3.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-center text-2xl tracking-widest"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Demo: Use <strong>1234</strong> as OTP
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowOtpInput(false);
                      setOtp("");
                    }}
                    className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
