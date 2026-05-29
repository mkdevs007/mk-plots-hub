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

export interface FAQItem {
  question: string;
  answer: string;
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
  startingPrice?: string;
  priceLakh?: number;
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
  faqs?: FAQItem[];
  mapLink?: string;
}

export const projects: Project[] = [
  {
    slug: "mk-brhat-samruddhi",
    name: "MK BRHAT SAMRUDDHI",
    status: "Few Plots Left",
    city: "Bangalore",
    area: "Kenchanapura, Nagarabhavi Ext.",
    landmark: "Adjacent to BDA Kempegowda Layout Block 2",
    type: "residential",
    sizes: ["1200+ Sq.ft"],
    totalPlots: 38,
    availablePlots: 14,
    amenities: [
      "Gated Community",
      "Internal Roads",
      "Underground Infrastructure",
      "Street Lighting",
      "Water Connection",
      "Electricity Connection",
      "Landscaped Open Spaces",
      "Park Access",
      "Secure Residential Environment"
    ],
    rera: "BDA|",
    image: project1,
    description: "Exclusive BDA-approved gated community residential plots bordering BDA Kempegowda Layout Block 2, Bangalore. Ready for registration and possession.",
    nearbyPlaces: [
      { name: "Challaghatta Metro Station", distance: "8-10 Mins", category: "railway" },
      { name: "Mysore Road Connectivity", distance: "Easy Access", category: "highway" },
      { name: "NICE Road junction", distance: "5 mins", category: "highway" },
      { name: "National Law School of India University", distance: "4.5 KM", category: "school" },
      { name: "RV College of Engineering", distance: "5 KM", category: "school" },
      { name: "BGS Institutions", distance: "3.5 KM", category: "school" },
      { name: "Bangalore University Campus", distance: "6 KM", category: "school" },
      { name: "BGS Global Hospital", distance: "4.5 KM", category: "hospital" },
      { name: "Fortis Hospital Nagarabhavi", distance: "6.5 KM", category: "hospital" },
      { name: "RajaRajeshwari Medical College Hospital", distance: "5.5 KM", category: "hospital" }
    ],
    faqs: [
      { question: "Is MK BRHAT SAMRUDDHI BDA Approved?", answer: "Yes. MK BRHAT SAMRUDDHI offers BDA Approved Residential Sites." },
      { question: "What is the plot size?", answer: "Plots are available from 1200 Sq.ft onwards." },
      { question: "How many plots are available?", answer: "The project consists of 38 exclusive residential plots." },
      { question: "How far is Challaghatta Metro Station?", answer: "Approximately 8–10 minutes from the project." },
      { question: "Is the project suitable for investment?", answer: "Yes. Due to metro connectivity, BDA surroundings and Mysore Road growth corridor, the project has strong appreciation potential." },
      { question: "Is bank loan available?", answer: "Yes, subject to eligibility and bank approval." },
      { question: "What makes this project unique?", answer: "The project is adjacent to BDA Kempegowda Layout, shares boundaries with BDA parks and offers premium residential plots in a rapidly developing Bengaluru location." }
    ],
    mapLink: "https://maps.app.goo.gl/tRCQh8T6z3pGnXNc8?g_st=com.google.maps.preview.copy"
  },
  {
    slug: "mk-meadows",
    name: "MK Meadows",
    status: "Ongoing",
    city: "Mysore",
    area: "New R.T. Nagar",
    landmark: "5 minutes from Outer Ring Road",
    type: "residential",
    sizes: ["30x40", "30x50", "40x60"],
    totalPlots: 120,
    availablePlots: 55,
    amenities: [
      "Grand Entrance Arch",
      "Compound Wall",
      "30 & 40 Feet Wide Roads",
      "Underground Drainage System",
      "Water Supply Connection",
      "Electricity Connection",
      "Street Lights",
      "Children's Play Area",
      "Jogging Track",
      "Senior Citizen Seating Zone",
      "CCTV Surveillance",
      "Security Cabin",
      "Avenue Plantation",
      "Rain Water Harvesting",
      "Landscaped Green Spaces"
    ],
    rera: "MUDA|",
    image: project2,
    description: "Premium residential plotted development in New R.T. Nagar, Mysuru. Fully-planned layout, 5 minutes from the Outer Ring Road.",
    nearbyPlaces: [
      { name: "Outer Ring Road", distance: "5 Mins", category: "highway" },
      { name: "Mysuru City Center", distance: "8.5 KM", category: "other" },
      { name: "Mysuru Railway Station", distance: "9.5 KM", category: "railway" },
      { name: "Mysore Airport", distance: "18 KM", category: "airport" },
      { name: "Delhi Public School Mysuru", distance: "5 KM", category: "school" },
      { name: "JSS Public School", distance: "3 KM", category: "school" },
      { name: "St. Joseph's Central School", distance: "4 KM", category: "school" },
      { name: "Apollo BGS Hospital", distance: "6 KM", category: "hospital" },
      { name: "JSS Hospital", distance: "8 KM", category: "hospital" },
      { name: "Manipal Hospital Mysuru", distance: "11 KM", category: "hospital" }
    ],
    faqs: [
      { question: "Where is MK Meadows located?", answer: "MK Meadows is located at New R.T. Nagar, Mysuru, with excellent connectivity to the Outer Ring Road and key city destinations." },
      { question: "How far is the Outer Ring Road?", answer: "The project is approximately 5 minutes from the Outer Ring Road." },
      { question: "What plot sizes are available?", answer: "30x40 (1200 Sq.ft), 30x50 (1500 Sq.ft) and 40x60 (2400 Sq.ft) plots are available." },
      { question: "Is the layout approved?", answer: "Yes, the project is developed as an approved residential plotted layout." },
      { question: "Is bank loan facility available?", answer: "Yes, bank loan assistance is available subject to eligibility." },
      { question: "Is this suitable for investment?", answer: "Yes. Due to the strategic location and growing infrastructure around New R.T. Nagar, the project offers strong future appreciation potential." },
      { question: "Are schools and hospitals nearby?", answer: "Yes. Reputed schools, colleges and multi-speciality hospitals are located within easy reach of the project." },
      { question: "Can I construct a villa or independent house?", answer: "Yes. The layout is ideal for villa construction and residential development." },
      { question: "Is the project suitable for families?", answer: "Yes. The project offers a peaceful residential environment with modern infrastructure and nearby essential services." },
      { question: "Why choose MK Meadows?", answer: "Prime location, strong connectivity, future growth corridor, quality infrastructure and excellent investment opportunity make MK Meadows a preferred choice for home buyers and investors." }
    ],
    mapLink: "https://maps.app.goo.gl/qnijXkgELULmkUyn9?g_st=iw"
  },
  {
    slug: "mk-bilva-urban-city",
    name: "MK Bilva Urban City",
    status: "New Launch",
    city: "Mysore",
    area: "Jayapura, Hullahalli Highway",
    landmark: "2 KM from Peripheral Ring Road",
    type: "residential",
    sizes: ["30x40", "30x50", "40x60"],
    totalPlots: 150,
    availablePlots: 85,
    amenities: [
      "Grand Entrance Arch",
      "Compound Wall",
      "30 & 40 Feet Roads",
      "Underground Drainage",
      "Water Supply",
      "Electricity Connection",
      "Street Lights",
      "Children's Park",
      "Jogging Track",
      "Senior Citizen Area",
      "CCTV Surveillance",
      "Security Cabin",
      "Avenue Plantation",
      "Rain Water Harvesting",
      "Open Green Spaces"
    ],
    rera: "DTCP|",
    image: project3,
    description: "Premium plotted development located on the Mysuru to Hullahalli Jayapura State Highway, just 2 KM from the Peripheral Ring Road.",
    nearbyPlaces: [
      { name: "Peripheral Ring Road", distance: "2 KM", category: "highway" },
      { name: "Mysuru City Center", distance: "13 KM (20 mins)", category: "other" },
      { name: "Mysuru Bus Stand", distance: "14 KM (25 mins)", category: "other" },
      { name: "Mysuru Railway Station", distance: "14 KM (20 mins)", category: "railway" },
      { name: "Mysore Airport", distance: "11 KM (15 mins)", category: "airport" },
      { name: "Nanjangud", distance: "17 KM (25 mins)", category: "other" },
      { name: "Bengaluru Highway Access", distance: "19 KM (25 mins)", category: "highway" },
      { name: "JSS High School Jayapura", distance: "1.5 KM", category: "school" },
      { name: "University of Mysore", distance: "12 KM", category: "school" },
      { name: "Jayapura Health Center", distance: "1 KM", category: "hospital" },
      { name: "Apollo BGS Hospital", distance: "10 KM", category: "hospital" },
      { name: "Mysore Palace", distance: "13 KM", category: "other" },
      { name: "Chamundi Hills", distance: "15 KM", category: "other" },
      { name: "Mysuru Zoo", distance: "14 KM", category: "other" },
      { name: "Brindavan Gardens", distance: "22 KM", category: "other" }
    ],
    faqs: [
      { question: "Where is the project located?", answer: "The project is strategically located on Mysuru–Hullahalli State Highway, just 2 KM from the Peripheral Ring Road." },
      { question: "How far is Mysuru City Center?", answer: "Approximately 13 KM and 20 minutes from the project." },
      { question: "Is the project suitable for investment?", answer: "Yes, due to its proximity to major infrastructure developments and growing residential demand." },
      { question: "Are schools and hospitals nearby?", answer: "Yes, reputed schools, colleges, and hospitals are located within easy driving distance." },
      { question: "How far is Mysore Airport?", answer: "Approximately 11 KM and 15 minutes from the project." },
      { question: "How far is Mysuru Railway Station?", answer: "Approximately 14 KM and 20 minutes from the project." },
      { question: "Is bank loan facility available?", answer: "Yes, subject to eligibility and bank approval." },
      { question: "What plot sizes are available?", answer: "30x40 (1200 Sq.ft), 30x50 (1500 Sq.ft), and 40x60 (2400 Sq.ft) plots are available." },
      { question: "Is this suitable for constructing a villa or dream home?", answer: "Yes, the layout is planned for both residential living and long-term investment." },
      { question: "Why should I invest in this location?", answer: "Strategic highway access, proximity to PRR, developing infrastructure, and future appreciation potential make it an attractive investment destination." }
    ],
    mapLink: "https://maps.app.goo.gl/tRCQh8T6z3pGnXNc8?g_st=com.google.maps.preview.copy"
  },
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
