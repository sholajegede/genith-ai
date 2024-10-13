"use client";

import { useState, useEffect, useRef } from "react";
import { Clapperboard, Image, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Announcement } from "@/components/announcement";
import { FadeIn } from "@/components/fade-in";
import { PlugCardGrid } from "@/components/landing/plug-grid";
import { ContentGrid } from "@/components/landing/content-grid";
import { PageHeader } from "@/components/page-header";
import { GradientHeading } from "@/registry/default/ui/gradient-heading";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import * as fal from "@fal-ai/serverless-client";
import Link from "next/link";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: "https://green-large-barracuda-918.mypinata.cloud",
});

interface FalAiResult {
  images: {
    content_type: string;
    file_name: string;
    file_size: number;
    height: number;
    url: string;
    width: number;
  }[];
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
  prompt: string;
  seed: number;
}

export default function HomePage() {
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const save = useMutation(api.contents.saveContent);

  const [prompt, setPrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generationCount, setGenerationCount] = useState<number>(0);

  useEffect(() => {
    const storedCount = localStorage.getItem("generationCount");
    setGenerationCount(storedCount ? parseInt(storedCount) : 0);
  }, []);

  const uploadImageToPinata = async (image: string) => {
    const formData = new FormData();
    const blob = await fetch(image).then((res) => res.blob());
    formData.append("file", blob, "genith-ai.jpg");

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key:
              process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          },
        }
      );

      const pinataUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      return pinataUrl;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw new Error("Failed to upload image to Pinata");
    }
  };

  const uploadVideoToPinata = async (videoUrl: string) => {
    const formData = new FormData();
    const blob = await fetch(videoUrl).then((res) => res.blob());
    formData.append("file", blob, "genith-video.mp4");

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key:
              process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          },
        }
      );

      const pinataUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      return pinataUrl;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw new Error("Failed to upload video to Pinata"); // Update error message
    }
  };

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGenerate = async () => {
    if (generationCount >= 3) {
      toast({
        title: "Error",
        description:
          "Generation limit reached. Please sign in to get 5 more credits.",
      });
      return;
    }

    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate",
      });
      return;
    }

    setLoading(true);

    fal.config({ credentials: process.env.NEXT_PUBLIC_FAL_KEY });

    try {
      const result = (await fal.subscribe("fal-ai/aura-flow", {
        input: {
          prompt,
          image_size: "landscape_4_3",
          num_images: 1,
          expand_prompt: true,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      })) as FalAiResult;

      const imageUrl = result.images[0]?.url;

      if (imageUrl) {
        const pinataUrl = await uploadImageToPinata(imageUrl);

        await save({
          prompt,
          url: pinataUrl,
          type: "image",
        });

        const newCount = generationCount + 1;
        localStorage.setItem("generationCount", newCount.toString());
        setGenerationCount(newCount);

        setPrompt("");

        toast({
          title: "Success",
          description: "Image generated successfully!",
        });

        scrollToContent();
      } else {
        //console.log("No image URL found in the result.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error generating image.",
        variant: "destructive",
      });
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const handleGenerateVideo = async () => {
    if (generationCount >= 1) {
      toast({
        title: "Error",
        description:
          "Generation limit reached. Please sign in to get 5 more credits.",
      });
      return;
    }

    if (!videoPrompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate",
      });
      return;
    }

    setLoading(true);

    fal.config({ credentials: process.env.NEXT_PUBLIC_FAL_KEY });

    try {
      const result = (await fal.subscribe("fal-ai/cogvideox-5b", {
        input: {
          prompt: videoPrompt,
          video_size: {
            height: 480,
            width: 720,
          },
          negative_prompt:
            "Distorted, discontinuous, Ugly, blurry, low resolution, motionless, static, disfigured, disconnected limbs, Ugly faces, incomplete arms",
          num_inference_steps: 50,
          guidance_scale: 7,
          use_rife: true,
          export_fps: 16,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      })) as FalAiResult;

      const videoUrl = result.video?.url;

      if (videoUrl) {
        const pinataUrl = await uploadVideoToPinata(videoUrl);

        await save({
          prompt: videoPrompt,
          url: pinataUrl,
          type: "video",
        });

        const newCount = generationCount + 1;
        localStorage.setItem("generationCount", newCount.toString());
        setGenerationCount(newCount);

        setVideoPrompt("");

        toast({
          title: "Success",
          description: "Video generated successfully!",
        });

        scrollToContent();
      } else {
        //console.log("No video URL found in the result.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error generating video.",
        variant: "destructive",
      });
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="isolate min-h-screen overflow-hidden bg-white bg-gradientTopRightLight pb-8 sm:pb-12 md:pb-0">
      <div className="container relative pt-20 sm:pt-22 md:pt-16 lg:pt-6"></div>
      <div className="container relative">
        <PageHeader>
          <FadeIn>
            <Announcement />
          </FadeIn>
          <FadeIn>
            <GradientHeading
              size="xl"
              weight="bold"
              className="text-center text-xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] max-w-2xl"
            >
              Create, Share and Explore AI-Generated Images and Videos
            </GradientHeading>
          </FadeIn>

          <FadeIn>
            <div className="max-w-4xl flex flex-wrap items-center justify-center gap-1 text-center text-base leading-3 text-foreground md:text-lg md:font-normal md:leading-6">
              <span>Generate stunning images and videos using AI.</span>
              <span>Share with the community to get upvoted.</span>
              <span>Explore and upvote other users' creations!</span>

              <Tabs defaultValue="image" className="relative w-full mt-4 mb-2">
                <TabsList className="w-full max-w-[210px]">
                  <TabsTrigger value="image">Text to Image</TabsTrigger>
                  <TabsTrigger value="video">Text to Video</TabsTrigger>
                </TabsList>
                <TabsContent value="image">
                  <div className="relative w-full mt-4 mb-2">
                    <Textarea
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="A futuristic city skyline at sunset, with flying cars zipping between towering glass buildings and neon lights reflecting off the clouds."
                      rows={6}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />

                    <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                      <Button
                        className="px-4 py-2 text-white rounded-md"
                        onClick={handleGenerate}
                        disabled={loading || generationCount >= 3}
                      >
                        {loading ? (
                            <span className="inline-flex">
                              <Loader className="mr-1 h-5 w-5 animate-spin" />
                              Generating...
                            </span>
                          ) : (
                            <span className="inline-flex">
                              <Image className="mr-1 h-5 w-5" />
                              Generate image
                            </span>
                          )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="video">
                  {generationCount <= 1 ? (
                    <div className="relative w-full mt-4 mb-2">
                      <Textarea
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="A serene forest scene transitioning from dawn to dusk, with sunlight filtering through the trees and a gentle stream flowing by, accompanied by bird songs."
                        rows={6}
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                      />

                      <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                        <Button
                          className="px-4 py-2 text-white rounded-md"
                          onClick={handleGenerateVideo}
                          disabled={loading || generationCount >= 1}
                        >
                          {loading ? (
                            <span className="inline-flex">
                              <Loader className="mr-1 h-5 w-5 animate-spin" />
                              Generating...
                            </span>
                          ) : (
                            <span className="inline-flex">
                              <Clapperboard className="mr-1 h-5 w-5" />
                              Generate video
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 mb-20 text-center">
                      <p className="text-lg">
                        To generate more videos, please sign in to get 5 free
                        credits.
                      </p>
                      <Link href="/sign-in">
                        <Button className="mt-6 px-6 py-3 text-base font-semibold">
                          Sign in now
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="text-left items-left justify-left mx-auto max-w-7xl rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-[44px]">
                <PlugCardGrid />
              </div>
            </div>
          </FadeIn>
        </PageHeader>

        <FadeIn>
          <section className="w-full mb-10 space-y-4 md:block">
            <div ref={contentRef} className="mx-auto max-w-7xl rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-[44px]">
              <ContentGrid />
            </div>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
HomePage.theme = "light";