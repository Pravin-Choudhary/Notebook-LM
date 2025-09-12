"use client";

import { useSession } from "next-auth/react";
import { ContentPanel } from "@/components/ContentPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { redirect } from "next/navigation";
import { DashboardSkeleton } from "@/components/DasboardSkeleton";
import { useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const sessionResult = useSession();
  
  const { data: session, status } = sessionResult || { data: null, status: "loading" };

  useEffect(() => {
  
    if (status === "unauthenticated") {
      redirect("/signin");
    }
  }, [status]);

  if (status === "loading" || !session) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex bg-background">
  
      <div className="border-r border-border">
        <SidebarTrigger/>
      </div>

      <div className="w-full flex-1">
        <ChatPanel />
      </div>
    </div>
  );
};

export default Index;