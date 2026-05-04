import { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  Lock,
  Phone,
  Navigation,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiGet, apiPost } from "../lib/api";

interface MediaItem {
  id: string;
  media_url: string;
  media_type: string;
}

interface HouseDetail {
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
}

interface InitiatePaymentResponse {
  message: string;
  payment_id: string;
  status: string;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1764921587475-866c1d48dc48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1749878065837-6968c1805247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1597497522150-2f50bffea452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1757439402224-56c48352f719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
];

function getBedroomsFromTitle(title: string): number {
  const match = title.match(/(\d+)\s*bedroom/i);
  return match ? parseInt(match[1]) : 1;
}

interface HouseDetailProps {
  houseId: string;
  onBack: () => void;
}

export function KayaHouseDetail({ houseId, onBack }: HouseDetailProps) {
  const [house, setHouse] = useState<HouseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [stkSent, setStkSent] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);

  const fetchHouse = async () => {
    try {
      const data = await apiGet<HouseDetail>(`/houses/${houseId}`);
      setHouse(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load property");
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchHouse().finally(() => setLoading(false));
  }, [houseId]);

  // Stop polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startPolling = () => {
    pollCountRef.current = 0;
    setPolling(true);
    pollRef.current = setInterval(async () => {
      pollCountRef.current += 1;
      const data = await fetchHouse();
      if (data?.is_unlocked) {
        stopPolling();
        setShowPaymentModal(false);
      } else if (pollCountRef.current >= 30) {
        // ~90 seconds (30 × 3s)
        stopPolling();
      }
    }, 3000);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setPolling(false);
  };

  const handleInitiatePayment = async () => {
    if (!paymentPhone || !house) return;
    setPaymentError(null);
    setPaymentLoading(true);
    try {
      const res = await apiPost<InitiatePaymentResponse>("/payments/initiate", {
        house_id: house.id,
        phone: paymentPhone,
      });
      if (res.status === "paid") {
        // Already paid — refresh house data
        await fetchHouse();
        setShowPaymentModal(false);
      } else {
        setStkSent(true);
        startPolling();
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Failed to initiate payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCloseModal = () => {
    stopPolling();
    setShowPaymentModal(false);
    setStkSent(false);
    setPaymentPhone("");
    setPaymentError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !house) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <p className="text-sm text-muted-foreground">{error ?? "Property not found"}</p>
          <button onClick={onBack} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  const images = house.media?.filter((m) => m.media_type === "image").map((m) => m.media_url) ?? [];
  const videoUrl = house.media?.find((m) => m.media_type === "video")?.media_url ?? null;
  const displayImages = images.length > 0 ? images : FALLBACK_IMAGES;
  const bedrooms = getBedroomsFromTitle(house.title);

  const staticAmenities = [
    { icon: Wifi, label: "Wi-Fi Ready" },
    { icon: Droplet, label: "Water 24/7" },
    { icon: Zap, label: "Backup Power" },
    { icon: Car, label: "Parking Space" },
    { icon: ShieldCheck, label: "Secure Compound" },
    { icon: Sofa, label: "Lounge Area" },
  ];

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
              src={displayImages[currentImageIndex]}
              alt={house.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setCurrentImageIndex((p) => (p - 1 + displayImages.length) % displayImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((p) => (p + 1) % displayImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-video bg-muted rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
              >
                <ImageWithFallback src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Video Tour */}
        {videoUrl && (
          <div className="mb-8 bg-white rounded-2xl p-6 border border-border">
            <h3 className="text-foreground mb-4">Virtual Walkthrough</h3>
            <div className="aspect-video bg-muted rounded-xl overflow-hidden">
              <video src={videoUrl} controls className="w-full h-full" />
            </div>
          </div>
        )}

        {/* Details grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h1 className="text-3xl text-foreground mb-2">{house.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-5 h-5" />
                <span>{house.general_location}</span>
              </div>
              {house.distance_info && (
                <p className="text-sm text-muted-foreground mb-4 pl-7">{house.distance_info}</p>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl text-primary">KSh {house.rent_price.toLocaleString()}</span>
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
                  <span className="text-sm">{bedrooms} {bedrooms === 1 ? "Bedroom" : "Bedrooms"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-primary" />
                  <span className="text-sm">Bathroom</span>
                </div>
                {staticAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <amenity.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Landmarks */}
            {house.landmarks && (
              <div className="bg-white rounded-2xl p-6 border border-border">
                <h3 className="text-foreground mb-3">Nearby Landmarks</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{house.landmarks}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Management */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="text-foreground mb-4">Property Management</h3>
              <div className="flex items-center gap-3 p-3 bg-accent rounded-xl">
                <ShieldCheck className="w-10 h-10 text-accent-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Managed By</div>
                  <div className="text-foreground">{house.managed_by}</div>
                </div>
              </div>
            </div>

            {/* Contact / Unlock */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                {house.is_unlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
                <h3 className="text-foreground">Contact Details</h3>
              </div>

              {!house.is_unlocked ? (
                <div>
                  <div className="mb-4 space-y-3">
                    <div className="p-3 bg-muted rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">Exact Location</div>
                      <div className="text-foreground blur-sm select-none">Plot 245, Mamboleo Estate</div>
                    </div>
                    <div className="p-3 bg-muted rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                      <div className="text-foreground blur-sm select-none">+254 7XX XXX XXX</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    Unlock for KSh 1
                  </button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Pay via M-Pesa to get verified contact details and exact location
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {house.exact_location && (
                    <div className="p-3 bg-accent rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">Exact Location</div>
                      <div className="text-foreground flex items-start gap-2">
                        <Navigation className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>{house.exact_location}</span>
                      </div>
                    </div>
                  )}
                  {house.contact_number && (
                    <div className="p-3 bg-accent rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                      <a
                        href={`tel:${house.contact_number}`}
                        className="text-primary flex items-center gap-2 hover:underline"
                      >
                        <Phone className="w-4 h-4" />
                        {house.contact_number}
                      </a>
                    </div>
                  )}
                  {house.contact_number && (
                    <a
                      href={`tel:${house.contact_number}`}
                      className="block w-full bg-primary text-white py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-center"
                    >
                      Call Now
                    </a>
                  )}
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
              Pay KSh 1 via M-Pesa to get verified contact information and exact location
            </p>

            {!stkSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">M-Pesa Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      placeholder="07XX XXX XXX"
                      className="w-full pl-12 pr-4 py-3.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="bg-accent p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-lg text-foreground">KSh 1</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You'll receive an M-Pesa STK push on your phone — enter your PIN to confirm
                  </p>
                </div>

                {paymentError && (
                  <p className="text-sm text-destructive text-center">{paymentError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInitiatePayment}
                    disabled={paymentLoading || !paymentPhone}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pay Now"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  {polling ? (
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  ) : (
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  )}
                  <p className="text-foreground">
                    {polling
                      ? "Waiting for payment confirmation..."
                      : "Payment check timed out"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {polling
                      ? "Check your phone and enter your M-Pesa PIN. This page will update automatically."
                      : "If you completed the payment, please go back and reopen this listing to see updated details."}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-full px-4 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
                >
                  {polling ? "Cancel" : "Close"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
