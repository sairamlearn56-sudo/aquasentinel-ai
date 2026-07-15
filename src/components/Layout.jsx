import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import WaterRippleBackground from "@/components/WaterRippleBackground";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <WaterRippleBackground />
      <Sidebar />
      <main className="lg:ml-[17rem] pt-20 lg:pt-6 relative z-10">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto pb-52">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}