import {
  GraduationCap,
  ShieldCheck,
  Target,
  Users,
  Wallet,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { PerspectiveIcon } from "@/domain/strategy";

export const PERSPECTIVE_ICONS: Record<PerspectiveIcon, LucideIcon> = {
  users: Users,
  wallet: Wallet,
  workflow: Workflow,
  graduation: GraduationCap,
  shield: ShieldCheck,
  target: Target,
};

export const PERSPECTIVE_ICON_KEYS = Object.keys(
  PERSPECTIVE_ICONS,
) as PerspectiveIcon[];
