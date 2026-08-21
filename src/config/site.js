// Central configuration for CyberFalcon Digital.
// Update contact info, pricing, services, and portfolio projects here —
// every page pulls from this single source of truth.

import cyberfalconGrcImage from "../assets/portfolio/cyberfalcongrc.jpg";
import klentzmanImage from "../assets/portfolio/klentzman-content-hub.jpg";
import klentzmanSecretaryImage from "../assets/portfolio/klentzman-secretary-hub.jpg";

export const business = {
  name: "CyberFalcon Digital",
  legalName: "CyberFalcon Digital",
  owner: "Sable R Banks",
  ownerTitle: "Founder & Webmaster",
  tagline: "Your Website. Managed.",
  shortDescription:
    "Professional website development, maintenance, and ongoing webmaster support for organizations that need their website taken care of.",
  footerDescription:
    "Professional website development, management, and ongoing webmaster support for organizations that need their website taken care of.",
  foundedYear: 2024,
};

// Placeholder contact info — replace with real details before launch.
export const contact = {
  email: "hello@cyberfalcondigital.com",
  phone: "",
  formEndpoint: "",
};

export const social = {
  email: `mailto:${contact.email}`,
  linkedin: "",
  facebook: "",
  instagram: "",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Website Management", href: "/website-management" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const audiences = [
  {
    id: "small-business",
    icon: "Briefcase",
    title: "Small Businesses",
    description:
      "You have a business to run. You shouldn't have to spend your time figuring out how to update your website.",
  },
  {
    id: "nonprofits",
    icon: "HeartHandshake",
    title: "Nonprofits & Community Organizations",
    description:
      "Keep your programs, events, documents, and announcements current without needing someone on staff who understands web technology.",
  },
  {
    id: "churches",
    icon: "Church",
    title: "Churches",
    description:
      "Share your message, events, and resources with your congregation through a site that's always up to date.",
  },
  {
    id: "schools",
    icon: "GraduationCap",
    title: "Schools & Daycares",
    description:
      "Keep parents informed with accurate information, calendars, forms, and updates — without adding more to your plate.",
  },
  {
    id: "professional-orgs",
    icon: "Users",
    title: "Professional Organizations",
    description:
      "Present a professional, current online presence that builds trust and credibility with the people you serve.",
  },
];

export const services = [
  {
    id: "website-development",
    icon: "MonitorSmartphone",
    title: "Website Development",
    shortDescription: "Custom websites built from the ground up.",
    description:
      "A new website designed and built around your organization's goals — planned, structured, and developed to represent you well online.",
  },
  {
    id: "website-redesign",
    icon: "PenTool",
    title: "Website Redesign",
    shortDescription: "Modernize your site and improve user experience.",
    description:
      "An outdated website gets a modern structure, cleaner navigation, and an improved experience for the people visiting it.",
  },
  {
    id: "website-management",
    icon: "Settings",
    title: "Website Management",
    shortDescription: "Ongoing administration and updates.",
    description:
      "Day-to-day administration of your website so it stays current, functional, and accurate without you having to manage it yourself.",
  },
  {
    id: "content-updates",
    icon: "FileText",
    title: "Content Updates",
    shortDescription: "Pages, announcements, documents, images, and more.",
    description:
      "Send over new content — text, images, documents, announcements — and it gets added to your website correctly.",
  },
  {
    id: "website-maintenance",
    icon: "Wrench",
    title: "Website Maintenance",
    shortDescription: "Keep your website functional, current, and secure.",
    description:
      "Routine upkeep that keeps your website running smoothly, including updates that follow security-conscious best practices.",
  },
  {
    id: "technical-support",
    icon: "Headset",
    title: "Technical Support",
    shortDescription: "Troubleshoot issues and get the help you need.",
    description:
      "Something isn't working right? Reach out and get plain-language help resolving it, without needing to understand the technical details yourself.",
  },
];

export const managementRequests = [
  "Can you update this announcement?",
  "Can you add this PDF?",
  "Can you change this photo?",
  "Can you update our staff page?",
  "Can you add this event?",
  "Our website isn't displaying correctly.",
];

export const pricingPlans = [
  {
    id: "website-care",
    name: "Website Care",
    price: 99,
    isFeatured: false,
    features: [
      "Routine content updates",
      "Image & document updates",
      "Basic website maintenance",
      "Minor troubleshooting",
    ],
  },
  {
    id: "website-management",
    name: "Website Management",
    price: 199,
    isFeatured: true,
    featuredLabel: "Most Popular",
    features: [
      "Everything in Website Care",
      "Page edits & new content",
      "Website administration",
      "Priority support",
    ],
  },
  {
    id: "webmaster-pro",
    name: "Webmaster Pro",
    price: 299,
    isFeatured: false,
    features: [
      "Everything in Website Management",
      "Priority requests",
      "Website improvements",
      "Analytics & reporting",
    ],
  },
];

export const portfolioProjects = [
  {
    id: "klentzman-content-hub",
    title: "Klentzman Content Hub",
    description:
      "Administrative website for a public school campus, giving staff one place to submit website content updates and tech support requests.",
    services: ["Website Development", "Content Submissions", "Tech Support"],
    url: "https://klentzman-content-hub.web.app/",
    image: klentzmanImage,
  },
  {
    id: "klentzman-secretary-hub",
    title: "Klentzman Secretary Hub",
    description:
      "Web application for a school principal's secretary — a one-stop shop for staff to submit and track requests directed to her.",
    services: ["Website Development", "Request Tracking"],
    url: "https://klentzman-secretary-hub.web.app",
    image: klentzmanSecretaryImage,
  },
  {
    id: "cyberfalcongrc",
    title: "CyberFalconGRC",
    description:
      "Original website for CyberFalconGRC, a GRC audit firm founded by Sable R Banks.",
    services: ["IT Audit", "GRC", "Cybersecurity"],
    url: "https://hirecyberfalcon.com",
    image: cyberfalconGrcImage,
  },
];

export const trustPoints = [
  {
    icon: "ShieldCheck",
    title: "Reliable Support",
    description: "We keep your site running smoothly.",
  },
  {
    icon: "Radar",
    title: "Security Conscious",
    description: "Best practices for a safer, more stable website.",
  },
  {
    icon: "MessageSquare",
    title: "Clear Communication",
    description: "Plain language. Real people. No confusion.",
  },
];

export const serviceOptions = [
  "New Website",
  "Website Redesign",
  "Website Management",
  "Content Updates",
  "Website Maintenance",
  "Technical Support",
  "Domain/Hosting Assistance",
  "Other",
];
