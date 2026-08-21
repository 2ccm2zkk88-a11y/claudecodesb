import {
  Briefcase,
  HeartHandshake,
  Church,
  GraduationCap,
  Users,
  MonitorSmartphone,
  PenTool,
  Settings,
  FileText,
  Wrench,
  Headset,
  ShieldCheck,
  Radar,
  MessageSquare,
  Film,
} from "lucide-react";

const ICONS = {
  Briefcase,
  HeartHandshake,
  Church,
  GraduationCap,
  Users,
  MonitorSmartphone,
  PenTool,
  Settings,
  FileText,
  Wrench,
  Headset,
  ShieldCheck,
  Radar,
  MessageSquare,
  Film,
};

// Looks up a lucide icon by the string name stored in site config, so
// config data can stay plain JSON-serializable data instead of JSX.
export default function Icon({ name, ...props }) {
  const Component = ICONS[name];
  if (!Component) return null;
  return <Component {...props} aria-hidden="true" />;
}
