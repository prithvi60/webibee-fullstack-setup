import NavBar from "@/components/layout/NavBar";
import "../globals.css";
import Footer from "@/components/layout/Footer";
import React from "react";


export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main className={`relative`}>
        <NavBar />
        {children}
        <Footer />
      </main>
    </div>
  );
}
