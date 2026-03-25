import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";

interface Session {
  id: number;
  title: string;
  time: string;
  duration: string;
  speaker: string;
  room: string;
  attendees: number;
  type: "keynote" | "workshop" | "talk" | "break" | "lunch";
}

const sessions: Session[] = [
  {
    id: 1,
    title: "Registration & Welcome Coffee",
    time: "08:00 AM",
    duration: "1h",
    speaker: "",
    room: "Main Lobby",
    attendees: 0,
    type: "break",
  },
  {
    id: 2,
    title: "Opening Keynote: Tech Innovation in East Africa",
    time: "09:00 AM",
    duration: "1h",
    speaker: "Dr. Amara Ochieng",
    room: "Main Hall",
    attendees: 300,
    type: "keynote",
  },
  {
    id: 3,
    title: "Building Scalable Mobile Solutions",
    time: "10:15 AM",
    duration: "45min",
    speaker: "James Wanjala",
    room: "Conference Room A",
    attendees: 80,
    type: "talk",
  },
  {
    id: 4,
    title: "Coffee Break & Networking",
    time: "11:00 AM",
    duration: "30min",
    speaker: "",
    room: "Lobby Area",
    attendees: 0,
    type: "break",
  },
  {
    id: 5,
    title: "AI & Machine Learning Workshop",
    time: "11:30 AM",
    duration: "1h 30min",
    speaker: "Sarah Kimani",
    room: "Tech Lab",
    attendees: 50,
    type: "workshop",
  },
  {
    id: 6,
    title: "Lunch Break",
    time: "01:00 PM",
    duration: "1h",
    speaker: "",
    room: "Dining Hall",
    attendees: 0,
    type: "lunch",
  },
  {
    id: 7,
    title: "Digital Transformation in Africa",
    time: "02:00 PM",
    duration: "45min",
    speaker: "Peter Otieno",
    room: "Conference Room B",
    attendees: 120,
    type: "talk",
  },
  {
    id: 8,
    title: "Youth in Tech: Panel Discussion",
    time: "03:00 PM",
    duration: "1h",
    speaker: "Multiple Speakers",
    room: "Main Hall",
    attendees: 200,
    type: "talk",
  },
  {
    id: 9,
    title: "Closing Remarks & Networking",
    time: "04:15 PM",
    duration: "45min",
    speaker: "",
    room: "Main Hall",
    attendees: 0,
    type: "break",
  },
];

const typeColors = {
  keynote: "bg-primary text-white",
  workshop: "bg-secondary text-white",
  talk: "bg-accent text-accent-foreground",
  break: "bg-muted text-muted-foreground",
  lunch: "bg-muted text-muted-foreground",
};

export function Timeline() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 text-blue-100 mb-2">
            <MapPin className="w-5 h-5" />
            <span className="text-sm">Kisumu, Kenya</span>
          </div>
          <h1 className="text-white text-3xl mb-1">Event Schedule</h1>
          <div className="flex items-center gap-2 text-blue-100">
            <Calendar className="w-4 h-4" />
            <p>March 15, 2026 • 9 sessions</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-md mx-auto px-6 -mt-4">
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Time */}
                <div className="flex-shrink-0 w-20">
                  <div className="text-sm text-muted-foreground">{session.time}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {session.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Type Badge */}
                  <div className="mb-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${
                        typeColors[session.type]
                      }`}
                    >
                      {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-card-foreground mb-2 line-clamp-2">
                    {session.title}
                  </h3>

                  {/* Details */}
                  {session.speaker && (
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{session.speaker}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{session.room}</span>
                      </div>
                      {session.attendees > 0 && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                          <span>{session.attendees} seats</span>
                        </div>
                      )}
                    </div>
                  )}
                  {!session.speaker && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{session.room}</span>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                {session.speaker && (
                  <div className="flex-shrink-0 flex items-center">
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}