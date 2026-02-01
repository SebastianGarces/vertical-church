"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { VerticalMainLogo } from "./icons";

const navLinks = [
  { label: "Plan A Visit", href: "/visit" },
  { label: "About", href: "/about" },
  { label: "Next Steps", href: "/get-involved" },
  { label: "Events", href: "/events" },
  { label: "Give", href: "/give" },
  { label: "Watch", href: "/watch" },
  { label: "Shop", href: "https://verticalchurchnorth.myspreadshop.com/" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy">
      <div className="flex h-16 items-center justify-between px-4 md:h-20 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center cursor-pointer" aria-label="Vertical Church - Home">
          <VerticalMainLogo
            className="h-8 w-auto md:h-10"
            color="#D4D4D0"
          />
        </Link>

        {/* Desktop Navigation - Right aligned */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isExternal = link.href.startsWith("http");
            return (
              <Link
                key={link.href}
                href={link.href}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`font-heading text-base font-bold uppercase tracking-[0.1em] transition-colors hover:text-florence cursor-pointer ${
                  isActive(link.href) ? "text-florence" : "text-pipper/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden cursor-pointer"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="h-0.5 w-6 bg-pipper"
          />
          <motion.span
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="h-0.5 w-6 bg-pipper"
          />
          <motion.span
            animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="h-0.5 w-6 bg-pipper"
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-navy md:top-20 lg:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex h-full flex-col items-center justify-center gap-8"
            >
              {navLinks.map((link, index) => {
                const isExternal = link.href.startsWith("http");
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`font-heading text-2xl uppercase tracking-[0.15em] transition-colors hover:text-florence cursor-pointer ${
                        isActive(link.href) ? "text-florence" : "text-pipper"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
