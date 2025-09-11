"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, Link, FileText, X, File } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ScrollArea } from "./ui/scroll-area";
import FileUpload from "./fileUplod";
import { LoadingSpinner } from "./ui/loader";
import { toast } from 'sonner'
import SonnerMsgs from "./ToastLoop";

interface ContentItem {
  id: string;
  type: "file" | "url";
  name: string;
  value: string
}



export const ContentPanel = () => {
 const [contentItems, setContentItems] = useState<(string | undefined)[]>([]);
 const [refreshKey, setRefreshKey] = useState(0);
 
  useEffect(() => {
       getAllDocs()
       .then((res) => {
            if (res) {
              setContentItems(res);
            }
       })
  },[refreshKey]);

  const [webUrl, setWebUrl] = useState("");
  const [urlOpen, setUrlOpen] = useState(false);
  const { data: session } = useSession();
  const [loading , setLoading] = useState(false);

  const userCollectionName = session?.user?.email?.split('@gmail.com').join('_') + "collection";

  const getAllDocs = async () => {
    try {
        const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/allDocs` , {
          userCollectionName 
        });

        return result.data.uniqueFiles;
    } catch (error) {
      return null;
    }
  
}

  const handleUrlSubmit = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/web` , {
          userCollectionName , url : webUrl
        });

        setLoading(false);
        if(res.data){ 
            toast.success(` Successfully analyzed and injested website : ${webUrl} !`, {
            position: 'top-center',
            style : {
            '--normal-bg':
            'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
            '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
            }  as React.CSSProperties
          })

           console.log(`Web Injesting Response : ${res.data}`);
        }


      } catch (error) {
        setLoading(false);
         toast.error(`Oops, there was an error processing url : ${webUrl}`, {
          style: {
            '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
            '--normal-text': 'var(--destructive)',
            '--normal-border': 'var(--destructive)'
          } as React.CSSProperties
        })
        console.log(`Error while injesting url : ${error}`);
        return ;
      }
  };


  return (
    <div className="h-screen flex flex-col p-6 gradient-subtle">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Content Input
        </h2>
        <p className="text-sm text-muted-foreground">
          Add your documents or web content to chat about
        </p>
      </div>

      {/* Content Items Display */}

      {loading && <SonnerMsgs/>}
   
      {contentItems.length > 0 && (
      <>
       <h2 className="text-xl font-semibold text-foreground mb-2 pl-2">Uploaded Docs</h2>
       <ScrollArea  className="max-h-30 mb-5 p-2 border rounded-xl">
        <div className="mb-4 space-y-2" >
          {contentItems.map((itemName,index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-card/50 border border-border/50 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                  <File className="w-4 h-4 text-primary flex-shrink-0" />
                <span
                  className="text-sm text-foreground truncate"
                  title={itemName ? itemName : ""}
                >
                  {itemName}
                </span>
              </div>
            </div>
          ))}
        </div>
    </ScrollArea>
    </>
      )}
 

      {/* Action Buttons - 15% of space */}
      <div className="space-y-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button
              variant="secondary"
              className="w-full justify-start gap-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-smooth"
            >
              <Upload className="w-4 h-4" />
              Upload Files
          </Button>
        </DialogTrigger>
          <DialogContent className="max-w-xl w-full">
              <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <DialogDescription>
                    Select a file to upload to your collection.
                  </DialogDescription>
              </DialogHeader>
                  <FileUpload onUploadSuccess={() => setRefreshKey(prev => prev + 1)}/>
          </DialogContent>
      </Dialog>

        <Popover open={urlOpen} onOpenChange={setUrlOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              className="w-full justify-start gap-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-smooth"
            >
              <Link className="w-4 h-4" />
              Add Web URL
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Add Web URL</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUrlOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Enter a URL to fetch and analyze content
                </p>
                <Input
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="bg-background border-border text-foreground"
                />
                <Button
                  onClick={handleUrlSubmit}
                  disabled={loading}
                  className="w-full"
                  variant="default"
                >
                  {!loading ? "Add URL" : <LoadingSpinner/>}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

    </div>
  );
};
