import "./globals.css";
import Script from "next/script";
import { Space_Grotesk, Sora } from "next/font/google";

const bodyFont = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
});

const displayFont = Sora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

export const metadata = {
  title: "AniComic",
  description: "Khung frontend responsive cho nen tang xem anime/comic",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${bodyFont.variable} ${displayFont.variable}`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var saved = localStorage.getItem("anicomic-theme");
                var theme =
                  saved === "deep-midnight" || saved === "oled"
                    ? "deep-midnight"
                    : "default";
                document.documentElement.setAttribute("data-theme", theme);
              } catch (e) {
                document.documentElement.setAttribute("data-theme", "default");
              }
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
