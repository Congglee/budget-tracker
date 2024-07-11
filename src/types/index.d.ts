import { IconKeys } from "@/components/icons";
import {
  KindeAccessToken,
  KindeUser,
} from "@kinde-oss/kinde-auth-nextjs/types";

export type Currency = {
  value: string;
  label: string;
  locale: string;
};

export type NavItem = {
  title: string;
  href: string;
};

export type Navigation = {
  data: NavItem[];
};
