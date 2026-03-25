import { Image as ImageIcon, Video, Download, Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

type MediaType = "all" | "photos" | "videos";

interface MediaItem {
  id: number;
  type: "photo" | "video";
  title: string;
  time: string;
  thumbnail: string;
}

// Mock media data
const mediaItems: MediaItem[] = [
  { id: 1, type: "photo", title: "Opening Keynote", time: "09:15 AM", thumbnail: "conference keynote speaker" },
  { id: 2, type: "video", title: "Welcome Speech", time: "09:00 AM", thumbnail: "conference audience hall" },
  { id: 3, type: "photo", title: "Networking Session", time: "11:00 AM", thumbnail: "business networking event" },
  { id: 4, type: "photo", title: "Panel Discussion", time: "03:00 PM", thumbnail: "conference panel discussion" },
  { id: 5, type: "video", title: "AI Workshop Highlights", time: "11:30 AM", thumbnail: "technology workshop coding" },
  { id: 6, type: "photo", title: "Coffee Break", time: "11:00 AM", thumbnail: "conference coffee break networking" },
  { id: 7, type: "photo", title: "Tech Lab Session", time: "11:45 AM", thumbnail: "computer lab technology" },
  { id: 8, type: "video", title: "Closing Remarks", time: "04:15 PM", thumbnail: "conference stage event" },
  { id: 9, type: "photo", title: "Team Collaboration", time: "02:30 PM", thumbnail: "team collaboration workspace" },
];

export function Media() {
  const [filter, setFilter] = useState<MediaType>("all");

  const filteredMedia = mediaItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "photos") return item.type === "photo";
    if (filter === "videos") return item.type === "video";
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-white text-3xl mb-2">Media Gallery</h1>
          <p className="text-blue-100">Photos and videos from the conference</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-md mx-auto px-6 -mt-4 mb-6">
        <div className="bg-card rounded-2xl p-1.5 shadow-sm border border-border flex gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              filter === "all"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("photos")}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              filter === "photos"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Photos
          </button>
          <button
            onClick={() => setFilter("videos")}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              filter === "videos"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video className="w-4 h-4" />
            Videos
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="max-w-md mx-auto px-6">
        <div className="grid grid-cols-2 gap-3">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-muted">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-${1500000000000 + item.id * 1000000}?w=400&h=400&fit=crop`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  fallbackSrc={`https://source.unsplash.com/400x400/?${encodeURIComponent(item.thumbnail)}`}
                />
                
                {/* Video Play Button Overlay */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-2 right-2">
                  {item.type === "photo" ? (
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    </div>
                  ) : (
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5">
                      <Video className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm text-card-foreground mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No media found</p>
          </div>
        )}
      </div>
    </div>
  );
}
