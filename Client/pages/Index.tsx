"use client";

import { useSession } from "next-auth/react";
import { ContentPanel } from "@/components/ContentPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { redirect } from "next/navigation";
import { DashboardSkeleton } from "@/components/DasboardSkeleton";
import { useEffect } from "react";

const Index = () => {
  const sessionResult = useSession();
  
  // Safe destructuring with fallback
  const { data: session, status } = sessionResult || { data: null, status: "loading" };

  useEffect(() => {
    // Handle redirect on client side to avoid SSR issues
    if (status === "unauthenticated") {
      redirect("/signin");
    }
  }, [status]);

  // Show skeleton while loading or if session is not available
  if (status === "loading" || !session) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - 30% width */}
      <div className="w-[30%] border-r border-border">
        <ContentPanel />
      </div>

      {/* Right Panel - 70% width */}
      <div className="w-[70%] flex-1">
        <ChatPanel />
      </div>
    </div>
  );
};

export default Index;