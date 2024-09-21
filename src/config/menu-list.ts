import { MenuGroup } from "@/types";
import {
  ArrowLeftRight,
  Bookmark,
  LayoutGrid,
  Settings,
  WalletMinimal,
} from "lucide-react";

export function generateDashboardMenuList(pathname: string): MenuGroup[] {
  return [
    {
      label: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      label: "Contents",
      menus: [
        {
          href: "",
          label: "Transactions",
          active: pathname.includes("/dashboard/transactions"),
          icon: ArrowLeftRight,
          submenus: [
            {
              href: "/dashboard/transactions",
              label: "All Transactions",
              active: pathname === "/dashboard/transactions",
            },
            {
              href: "/dashboard/transactions/new",
              label: "New Transaction",
              active: pathname === "/dashboard/transactions/new",
            },
          ],
        },
        {
          href: "/dashboard/categories",
          label: "Categories",
          active: pathname.includes("/dashboard/categories"),
          icon: Bookmark,
          submenus: [],
        },
        {
          href: "/dashboard/budgets",
          label: "Budgets",
          active: pathname.includes("/dashboard/budgets"),
          icon: WalletMinimal,
          submenus: [],
        },
      ],
    },
    {
      label: "Settings",
      menus: [
        {
          href: "/dashboard/settings",
          label: "Account",
          active: pathname.includes("/dashboard/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
