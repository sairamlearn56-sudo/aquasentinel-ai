import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import WaterRippleBackground from "@/components/WaterRippleBackground";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background relative">
      <WaterRippleBackground />
      <Sidebar />
      <main className="lg:ml-64 pt-20 lg:pt-0 relative z-10">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}