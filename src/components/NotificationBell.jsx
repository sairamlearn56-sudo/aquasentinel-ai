import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function NotificationBell({ compact }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let interval;
    const fetchUnread = async () => {
      try {
        const data = await base44.entities.AppNotification.filter({ read: false }, "-created_date", 50);
        setUnread(data?.length || 0);
      } catch (e) { /* ignore */ }
    };
    fetchUnread();
    interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <Link to="/notifications" className="relative w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Notifications">
        <Bell className="w-3.5 h-3.5" />
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center">{unread > 9 ? "9+" : unread}</span>}
      </Link>
    );
  }

  return (
    <Link to="/notifications" className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
      <Bell className="w-4 h-4" />
      <span>Notifications</span>
      {unread > 0 && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">{unread > 9 ? "9+" : unread}</span>}
    </Link>
  );
}