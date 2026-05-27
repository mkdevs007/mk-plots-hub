import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

export type ProjectStatus = "Ongoing" | "New Launch" | "Few Plots Left" | "Completed";

export interface SizePrice {
  size: string;
  price: string;
}

export type NearbyCategory =
  | "airport"
  | "school"
  | "hospital"
  | "market"
  | "highway"
  | "railway"
  | "it_park"
  | "other";

export interface NearbyPlace {
  name: string;
  distance: string;
  category: NearbyCategory;
}

export interface ProgressMilestone {
  date: string;
  title: string;
  desc: string;
  done: boolean;
}

export interface Project {
  slug: string;
  name: string;
  status: ProjectStatus;
  city: string;
  area: string;
  landmark: string;
  type: "residential" | "commercial" | "agricultural" | "industrial";
  sizes: string[];
  sizePrices?: SizePrice[];
  totalPlots: number;
  availablePlots: number;
  startingPrice: string;
  priceLakh: number;
  amenities: string[];
  rera: string;
  image: string;
  videoUrl?: string;
  galleryImages?: string[];
  galleryVideos?: string[];
  description: string;
  progressTimeline?: ProgressMilestone[];
  layoutPdfUrl?: string;
  nearbyPlaces?: NearbyPlace[];
}

export const projects: Project[] = [
  {
    slug: "mk-green-valley",
    name: "MK Green Valley",
    status: "Ongoing",
    city: "Bangalore",
    area: "Devanahalli",
    landmark: "8 km from Kempegowda Airport",
    type: "residential",
    sizes: ["30x40", "30x50", "40x60"],
    totalPlots: 180,
    availablePlots: 64,
    startingPrice: "₹18 Lakh",
    priceLakh: 18,
    amenities: ["Road", "Water", "Electricity", "Park", "Security"],
    rera: "PRM/KA/RERA/1251/308/PR/2024",
    image: project1,
    description:
      "A premium gated layout nestled near the airport, with wide roads, lush parks and 24/7 security.",
  },
  {
    slug: "mk-royal-heights",
    name: "MK Royal Heights",
    status: "New Launch",
    city: "Mysore",
    area: "Hunsur Road",
    landmark: "12 km from Mysore Palace",
    type: "commercial",
    sizes: ["40x60", "50x80", "60x90"],
    totalPlots: 96,
    availablePlots: 96,
    startingPrice: "₹28 Lakh",
    priceLakh: 28,
    amenities: ["Road", "Water", "Electricity", "Security", "Drainage"],
    rera: "PRM/KA/RERA/1251/309/PR/2025",
    image: project2,
    description:
      "Commercial layout on the Mysore-Hunsur growth corridor, perfect for showrooms, offices and retail.",
  },
  {
    slug: "mk-agri-estates",
    name: "MK Agri Estates",
    status: "Few Plots Left",
    city: "Tumkur",
    area: "Kunigal",
    landmark: "Off NH-75 highway",
    type: "agricultural",
    sizes: ["1/4 acre", "1/2 acre", "1 acre"],
    totalPlots: 60,
    availablePlots: 11,
    startingPrice: "₹8 Lakh",
    priceLakh: 8,
    amenities: ["Road", "Water", "Electricity", "Security"],
    rera: "PRM/KA/RERA/1251/277/PR/2024",
    image: project3,
    description:
      "Fertile farm plots with borewell connectivity — ideal for weekend farms and long-term agri investment.",
  },
  {
    slug: "mk-industrial-park",
    name: "MK Industrial Park",
    status: "Ongoing",
    city: "Hubli",
    area: "Gokul Road",
    landmark: "Near Hubli industrial corridor",
    type: "industrial",
    sizes: ["60x90", "80x120", "100x150"],
    totalPlots: 48,
    availablePlots: 22,
    startingPrice: "₹35 Lakh",
    priceLakh: 35,
    amenities: ["Road", "Water", "Electricity", "Drainage", "Security"],
    rera: "PRM/KA/RERA/1251/301/PR/2024",
    image: project2,
    description:
      "Industrial plots with high-load power, wide truck access roads and proximity to the Hubli logistics hub.",
  },
  {
    slug: "mk-orchid-meadows",
    name: "MK Orchid Meadows",
    status: "Completed",
    city: "Bangalore",
    area: "Sarjapur",
    landmark: "5 min from Sarjapur Road",
    type: "residential",
    sizes: ["30x40", "30x50"],
    totalPlots: 120,
    availablePlots: 0,
    startingPrice: "Sold Out",
    priceLakh: 0,
    amenities: ["Road", "Water", "Electricity", "Park", "Security", "CCTV"],
    rera: "PRM/KA/RERA/1251/198/PR/2022",
    image: project1,
    description:
      "A successfully delivered gated community layout in Bangalore's fastest-growing IT belt.",
  },
];

export const cities = ["Bangalore", "Mysore", "Hubli", "Tumkur"];
