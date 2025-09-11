"use client";

import { useSession } from "next-auth/react";
import { ContentPanel } from "@/components/ContentPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { redirect } from "next/navigation";
import { DashboardSkeleton } from "@/components/DasboardSkeleton";


const Index = () => {
  const { data: session, status } = useSession(); // Destructure directly

  // Redirect unauthenticated users
  if (status === "unauthenticated") {
    redirect("/signin");
  }

  // Show skeleton while loading
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
