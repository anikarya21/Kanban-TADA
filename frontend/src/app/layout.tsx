import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northstar | Product launch",
  description: "Product launch project board",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
