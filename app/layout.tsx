import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusHalls | Book Your Space",
  description: "University Seminar Hall and Auditorium Booking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans bg-black">
        {children}
      </body>
    </html>
  );
}