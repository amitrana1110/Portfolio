import localFont from "next/font/local";
import "./globals.css";
import "./mobile.css";
import { Dock, Profile } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { MotionRoot } from "@/components/motion/motion-root";
import { portfolio } from "@/data/portfolio";
import { siteOrigin, isPublicOrigin } from "@/lib/site-url";
const origin = siteOrigin();
const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/satoshi-regular-subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi-medium-subset.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi-bold-subset.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};
export const metadata = {
  metadataBase: new URL(
    origin || "http://localhost:3000",
  ),
  title: {
    default: `${portfolio.name} — ${portfolio.role}`,
    template: `%s — ${portfolio.name}`,
  },
  description: portfolio.summary,
  openGraph: {
    title: `${portfolio.name} — ${portfolio.role}`,
    description: portfolio.summary,
    type: "website",
    images: [
      {
        url: "/images/haldiram-cover.svg",
        width: 1200,
        height: 800,
        alt: "Amit Singh Rana portfolio",
      },
    ],
  },
  robots: { index: isPublicOrigin(origin), follow: isPublicOrigin(origin) },
};
const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch(e){}})()`;
export default function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={satoshi.variable}>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <MotionRoot />
        <Profile />
        <div className="site">
          <main id="main">{children}</main>
          <Footer />
        </div>
        <Dock />
      </body>
    </html>
  );
}
