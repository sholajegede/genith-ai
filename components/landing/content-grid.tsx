"use client";

import { useState } from "react";
import { ArrowBigUp, IceCream } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardMedia,
  MinimalCardTitle,
  MinimalCardFooter,
} from "@/registry/default/ui/minimal-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "../ui/use-toast";

export function ContentGrid() {
  const { toast } = useToast();
  const [selectedCreator, setSelectedCreator] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [expandContent, setExpandContent] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<Id<"contents"> | null>(null);

  const contents = useQuery(api.contents.getAllContents);
  const upvote = useMutation(api.contents.upvoteContent);
  const markAsViewed = useMutation(api.contents.markContentAsViewed);

  const handleView = async (
    prompt: string,
    url: string,
    type: string,
    creator: string,
    contentId: Id<"contents">
  ) => {
    setSelectedCreator(creator);
    setSelectedPrompt(prompt);
    setSelectedContent(url);
    setSelectedType(type);
    setSelectedContentId(contentId);
    setExpandContent(true);

    try {
      await markAsViewed({ contentId });
    } catch (error) {
      console.error("Failed to update content view status:", error);
    }
  };

  const handleUpvote = async () => {
    if (selectedContentId) {
      try {
        await upvote({ contentId: selectedContentId });
        setExpandContent(false);
        toast({
          title: "Success",
          description: `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1).toLowerCase()} successfully upvoted!`,
        });
      } catch (error) {
        console.error("Failed to upvote:", error);
      }
    }
  };

  const sortedContents = contents ? [...contents].sort((a, b) => {
    return new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime();
  }) : [];

  return (
    <>
      <Dialog open={expandContent} onOpenChange={setExpandContent}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCreator ? (
                <span>Created by: {selectedCreator}</span>
              ) : null}
            </DialogTitle>
            <DialogDescription className="text-wrap mt-6">
              <span className="font-medium">Prompt:</span>
              <blockquote className="mt-2 border-l-2 pl-6 italic">
                {selectedPrompt}
              </blockquote>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="">
            {selectedType === "image" ? (
              <Image
                src={selectedContent || ""}
                alt=""
                className="w-full h-[250px] object-cover rounded-md"
                width={100}
                height={100}
                quality={100}
                unoptimized
              />
            ) : (
              <video
                controls
                autoPlay
                className="w-full h-[200px] object-cover rounded-md"
              >
                <source src={selectedContent || ""} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </DialogFooter>
          <div className="ml-auto mt-2">
            <Button onClick={handleUpvote}>Upvote</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="dark relative flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/10 p-2 shadow-sm md:gap-24 md:rounded-[40px] md:p-2">
        <Badge
          variant="outline"
          className="absolute left-4 top-4 rounded-[14px] border border-black/10 text-base text-neutral-800 md:left-6"
        >
          <IceCream className="fill-[#D2F583] stroke-1 text-neutral-800" />{" "}
          Explore Generated Contents
        </Badge>
        <div className="flex flex-col justify-center space-y-4 rounded-[34px] p-3 pt-12">
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 w-full">
            {sortedContents &&
              sortedContents.map((content) => (
                <div
                  key={content._id}
                  onClick={() =>
                    handleView(
                      content.prompt as string,
                      content.url as string,
                      content.type as string,
                      content.creator as string,
                      content._id as Id<"contents">
                    )
                  }
                >
                  <MinimalCard className="relative p-2 no-underline shadow-sm transition-colors  dark:bg-neutral-800/90 dark:hover:bg-neutral-800/80">
                    <div
                      className={cn(
                        "relative mb-6 h-[190px] w-full rounded-[20px]",
                        "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)]",
                        "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)]"
                      )}
                    >
                      {content.type === "image" ? (
                        <MinimalCardImage src={content.url as string} alt="" />
                      ) : (
                        <MinimalCardMedia src={content.url as string} alt="" />
                      )}

                      <div className="absolute inset-0 rounded-[16px]">
                        <div
                          className={cn(
                            "absolute inset-0 rounded-[16px]",
                            "shadow-[0px_0px_0px_1px_rgba(0,0,0,.07),0px_0px_0px_3px_#fff,0px_0px_0px_4px_rgba(0,0,0,.08)]",
                            "dark:shadow-[0px_0px_0px_1px_rgba(0,0,0,.07),0px_0px_0px_3px_rgba(100,100,100,0.3),0px_0px_0px_4px_rgba(0,0,0,.08)]"
                          )}
                        />
                        <div
                          className={cn(
                            "absolute inset-0 rounded-[16px]",
                            "dark:shadow-[0px_1px_1px_0px_rgba(0,0,0,0.15),0px_1px_1px_0px_rgba(0,0,0,0.15)_inset,0px_0px_0px_1px_rgba(0,0,0,0.15)_inset,0px_0px_1px_0px_rgba(0,0,0,0.15)]"
                          )}
                        />
                      </div>
                      {content.new === true ? (
                        <Badge
                          variant="outline"
                          className="absolute bottom-4 right-4 rounded-[9px] border border-black/10   bg-[#D2F583]  text-sm text-neutral-900"
                        >
                          New
                        </Badge>
                      ) : null}
                    </div>
                    <MinimalCardTitle className="text-neutral-200">
                      {content.creator || null}
                    </MinimalCardTitle>
                    <MinimalCardDescription className="text-neutral-400">
                      {content.prompt}
                    </MinimalCardDescription>

                    <MinimalCardDescription />

                    <MinimalCardFooter>
                      <div className="p-1 py-1.5 px-1.5 rounded-md text-neutral-400 flex items-center gap-1 absolute bottom-2 right-2 rounded-br-[16px]">
                        <p className="flex items-center gap-1 tracking-tight text-neutral pr-1 text-sm">
                          Upvotes <ArrowBigUp className="w-5 h-5" /> (
                          {content.upvotes || 0})
                        </p>
                      </div>
                    </MinimalCardFooter>
                  </MinimalCard>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};