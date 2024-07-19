import { MenuGroup } from "@/types";
import { ArrowLeftRight, Bookmark, LayoutGrid, Settings } from "lucide-react";

export function getDashboardMenuList(pathname: string): MenuGroup[] {
  return [
    {
      label: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
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
          active: pathname.includes("/transactions"),
          icon: ArrowLeftRight,
          submenus: [
            {
              href: "/transactions",
              label: "All Transactions",
              active: pathname === "/transactions",
            },
            {
              href: "/transactions/new",
              label: "New Transactions",
              active: pathname === "/transactions/new",
            },
          ],
        },
        {
          href: "/categories",
          label: "Categories",
          active: pathname.includes("/categories"),
          icon: Bookmark,
          submenus: [],
        },
      ],
    },
    {
      label: "Settings",
      menus: [
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
