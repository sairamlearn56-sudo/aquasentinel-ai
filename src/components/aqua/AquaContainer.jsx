import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAqua } from "@/lib/AquaContext";
import AquaMascot from "@/components/aqua/AquaMascot";
import AquaChat from "@/components/aqua/AquaChat";

export default function AquaContainer() {
  const { mood, chatOpen, openChat, closeChat, wave } = useAqua();

  // Trigger welcome when Aqua first appears (authenticated only)
  useEffect(() => {
    const timer = setTimeout(() => wave(), 800);
    return () => clearTimeout(timer);
  }, [wave]);

  return (
    <>
      {/* Mascot — always visible, bottom-left */}
      <div className="fixed bottom-3 left-3 lg:left-72 z-40 pointer-events-auto">
        <AquaMascot mood={mood} onClick={chatOpen ? closeChat : openChat} />
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {chatOpen && <AquaChat onClose={closeChat} />}
      </AnimatePresence>
    </>
  );
}