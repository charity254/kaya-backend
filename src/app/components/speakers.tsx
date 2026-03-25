import { MapPin, Briefcase, Twitter, Linkedin, Globe, Mail } from "lucide-react";

interface Speaker {
  id: number;
  name: string;
  title: string;
  company: string;
  bio: string;
  location: string;
  image: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    email?: string;
  };
}

const speakers: Speaker[] = [
  {
    id: 1,
    name: "Dr. Amara Ochieng",
    title: "Chief Technology Officer",
    company: "TechBridge Africa",
    bio: "Leading digital transformation initiatives across East Africa with focus on AI and sustainable tech solutions.",
    location: "Nairobi, Kenya",
    image: "👩🏾‍💼",
    socials: {
      twitter: "@amaraochieng",
      linkedin: "amara-ochieng",
      website: "amaraochieng.com",
      email: "amara@techbridge.africa",
    },
  },
  {
    id: 2,
    name: "James Wanjala",
    title: "Senior Mobile Engineer",
    company: "M-Pesa Innovation",
    bio: "Expert in building scalable mobile payment solutions serving millions of users across Africa.",
    location: "Kisumu, Kenya",
    image: "👨🏾‍💻",
    socials: {
      twitter: "@jameswanjala",
      linkedin: "james-wanjala",
      email: "james@mpesa.com",
    },
  },
  {
    id: 3,
    name: "Sarah Kimani",
    title: "AI Research Lead",
    company: "DataMinds Kenya",
    bio: "Pioneering machine learning applications for agriculture and healthcare in developing regions.",
    location: "Mombasa, Kenya",
    image: "👩🏿‍🔬",
    socials: {
      twitter: "@sarahkimani",
      linkedin: "sarah-kimani",
      website: "sarahkimani.io",
      email: "sarah@dataminds.co.ke",
    },
  },
  {
    id: 4,
    name: "Peter Otieno",
    title: "Digital Strategy Director",
    company: "Kenya Digital Hub",
    bio: "Driving government digital initiatives and smart city projects in Kenya and neighboring countries.",
    location: "Nairobi, Kenya",
    image: "👨🏿‍💼",
    socials: {
      linkedin: "peter-otieno",
      website: "kenyadigitalhub.go.ke",
      email: "peter@digitalhub.go.ke",
    },
  },
];

export function Speakers() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-white text-3xl mb-2">Our Speakers</h1>
          <p className="text-blue-100">Meet the experts leading our sessions</p>
        </div>
      </div>

      {/* Speakers List */}
      <div className="max-w-md mx-auto px-6 -mt-4">
        <div className="space-y-4">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border"
            >
              {/* Speaker Header */}
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                  {speaker.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-card-foreground mb-1">{speaker.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{speaker.title}</p>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="truncate">{speaker.company}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {speaker.bio}
              </p>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>{speaker.location}</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 flex-wrap">
                {speaker.socials.twitter && (
                  <a
                    href={`https://twitter.com/${speaker.socials.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-accent rounded-lg text-sm text-accent-foreground hover:bg-accent/80 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>{speaker.socials.twitter}</span>
                  </a>
                )}
                {speaker.socials.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${speaker.socials.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-accent rounded-lg text-sm text-accent-foreground hover:bg-accent/80 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {speaker.socials.website && (
                  <a
                    href={`https://${speaker.socials.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-accent rounded-lg text-sm text-accent-foreground hover:bg-accent/80 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
                {speaker.socials.email && (
                  <a
                    href={`mailto:${speaker.socials.email}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-accent rounded-lg text-sm text-accent-foreground hover:bg-accent/80 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
