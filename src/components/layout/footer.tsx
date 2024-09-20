import Logo from "@/components/logo";
import { navLinks } from "@/config/links";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="container p-6 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between space-y-1">
          <Link href="/">
            <Logo />
          </Link>
          <ul className="mb-6 flex flex-wrap items-center opacity-60 sm:mb-0">
            {navLinks.data.map((item, index) => {
              return (
                item.href && (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="mr-4 hover:underline md:mr-6"
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              );
            })}
          </ul>
        </div>
        <hr className="my-4 text-muted-foreground sm:mx-auto" />
        <div className="flex items-center justify-center">
          <div className="block text-sm text-muted-foreground sm:text-center">
            © {new Date().getFullYear()}{" "}
            <a
              target="_blank"
              href={siteConfig.links?.github}
              className="hover:underline"
            >
              Budget Tracker App
            </a>
            . All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
