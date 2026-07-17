import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Languages, BellRing, Settings2, UserRound } from "lucide-react";

const FONT_STYLE = { fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif" };
const FONT_CSS = `.saas-page h1,.saas-page h2,.saas-page h3,.saas-page h4,.saas-page h5,.saas-page h6,.saas-page .font-heading{font-family:'Manrope',ui-sans-serif,system-ui,sans-serif}`;

export default function PageHeader({ title, subtitle, backLabel = "Back", children }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="saas-page" style={FONT_STYLE}>
      <style>{FONT_CSS}</style>

      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-border text-[13px] font-medium hover:bg-muted/50 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{backLabel}</span>
          </button>
          {title && (
            <div className="min-w-0">
              <h1 className="text-[26px] sm:text-[38px] font-bold leading-tight tracking-tight truncate">{title}</h1>
              {subtitle && <p className="text-[14px] text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Utility icons */}
        <div className="flex items-center gap-1">
          <button onClick={() => navigate("/settings/language")} className="p-2 rounded-xl glass border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="Language">
            <Languages className="w-[18px] h-[18px]" />
          </button>
          <button onClick={() => navigate("/settings/notifications")} className="p-2 rounded-xl glass border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="Notifications">
            <BellRing className="w-[18px] h-[18px]" />
          </button>
          <button onClick={() => navigate("/settings")} className="p-2 rounded-xl glass border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="Settings">
            <Settings2 className="w-[18px] h-[18px]" />
          </button>
          <button onClick={() => navigate("/profile")} className="p-2 rounded-xl glass border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="Profile">
            <UserRound className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Page content */}
      {children}
    </div>
  );
}