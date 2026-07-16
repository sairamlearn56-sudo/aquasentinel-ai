import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingState({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}