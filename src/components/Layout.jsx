import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import WaterRippleBackground from "@/components/WaterRippleBackground";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background relative">
      <WaterRippleBackground />
      <Sidebar />
      <main className="lg:ml-64 pt-20 lg:pt-0 relative z-10">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}