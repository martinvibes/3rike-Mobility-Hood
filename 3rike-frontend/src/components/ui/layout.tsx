import { Outlet } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export default function Layout() {
  return (
    <div
      className="flex flex-col min-h-screen overflow-x-hidden bg-white"
    >
      <Navbar />
      <main className="grow">
        <Outlet /> {/* All page-specific content renders here */}
      </main>
      <Footer />
    </div>
  );
}
