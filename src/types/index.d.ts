import { Budget, Category } from "@prisma/client";

export type SiteConfig = {
  name: string;
  author: string;
  description: string;
  keywords: Array<string>;
  url: {
    base: string;
    author: string;
  };
  links: {
    github: string;
  };
  ogImage: string;
};

export type NavItem = {
  title: string;
  href: string;
};

export type Navigation = {
  data: NavItem[];
};

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type MenuGroup = {
  label: string;
  menus: Menu[];
};

export type SearchParams = {
  from?: string;
  to?: string;
  time_frame?: TimeFrame;
  month?: string;
  year?: string;
  keyword?: string;
};

export type DateRange = { from: Date; to: Date };

export type TimeFrame = "month" | "year";

export type HistoryData = {
  month: number;
  expense: number;
  income: number;
  year: number;
};

export type ExtendedCategory = Category & { budgets: Budget[] };
