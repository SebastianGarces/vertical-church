import Link from "next/link";
import {
  VerticalEstLogo,
  FacebookIcon,
  InstagramIcon,
  SpotifyIcon,
  YoutubeIcon,
} from "./icons";

const footerLinks = {
  visit: {
    title: "Visit",
    links: [
      { label: "Plan A Visit", href: "/visit" },
      { label: "What To Expect", href: "/visit#what-to-expect" },
    ],
  },
  about: {
    title: "About",
    links: [
      { label: "About Us", href: "/about" },
      { label: "What We Believe", href: "/about/beliefs" },
      { label: "Leadership", href: "/about#leadership" },
    ],
  },
  getInvolved: {
    title: "Get Involved",
    links: [
      { label: "Next Steps", href: "/get-involved" },
      { label: "Small Groups", href: "/get-involved#small-groups" },
      { label: "Serve", href: "/get-involved#serve" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Watch", href: "/watch" },
      { label: "Events", href: "/events" },
      { label: "Give", href: "/give" },
    ],
  },
  shop: {
    title: "Shop",
    links: [{ label: "Shop", href: "https://verticalchurchnorth.myspreadshop.com/" }],
  },
};

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Spotify", href: "https://spotify.com", icon: SpotifyIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="bg-cream pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Logo - Top Left */}
        <div className="mb-10">
          <Link href="/" className="inline-block cursor-pointer">
            <VerticalEstLogo className="h-20 w-auto" color="#141C25" />
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-4">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-navy">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="font-body text-sm text-navy/70 transition-colors hover:text-florence cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-navy/10 pt-8 md:flex-row md:justify-between">
          {/* Copyright & Address */}
          <div className="text-center md:text-left">
            <p className="font-body text-xs text-navy/60">
              © {new Date().getFullYear()} Vertical Church
            </p>
            <Link
              href="https://maps.google.com/?q=5400+Lear+Nagle+Rd+North+Ridgeville+Ohio+44039"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-navy/60 underline transition-colors hover:text-navy cursor-pointer"
            >
              5400 Lear Nagle Rd North Ridgeville Ohio 44039
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center text-navy/60 transition-colors hover:text-navy cursor-pointer"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
