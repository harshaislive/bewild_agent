import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FormProvider } from "../context/FormContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Media Planner",
  description: "Create engaging social media content with the power of AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FormProvider>
          {children}
        </FormProvider>
      </body>
    </html>
  );
}
