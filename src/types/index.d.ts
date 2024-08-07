import { IconKeys } from "@/components/icons";
import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
};

export type Navigation = {
  data: NavItem[];
};

export type SiteConfig = {
  name: string;
  author: string;
  description: string;
  keywords: Array<string>;
  url?: {
    base: string;
    author: string;
  };
  links?: {
    github: string;
  };
  ogImage?: string;
};

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

export type MenuGroup = {
  label: string;
  menus: Menu[];
};

export type TransactionType = "income" | "expense";

export type DateRange = {
  from: Date;
  to: Date;
};

export type TimeFrame = "month" | "year";

export type Period = {
  month: number;
  year: number;
};

export type SearchParams = {
  from?: string;
  to?: string;
  time_frame?: TimeFrame;
  month?: string;
  year?: string;
};

export type HistoryData = {
  month: number;
  expense: number;
  income: number;
  year: number;
};
