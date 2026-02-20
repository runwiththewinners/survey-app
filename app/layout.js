import "./globals.css";

export const metadata = {
  title: "RWTW — Get Started",
  description: "Find your perfect RWTW package",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
