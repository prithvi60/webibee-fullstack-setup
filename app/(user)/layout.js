import NavBar from "@/components/layout/NavBar";
import "../globals.css";
import Footer from "@/components/layout/Footer";


export default function SiteLayout({ children }) {
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
