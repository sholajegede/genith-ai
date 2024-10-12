"use client";

import { useState, useEffect } from "react";
import { Clapperboard, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";
import { PageHeader } from "@/components/page-header";
import { GradientHeading } from "@/registry/default/ui/gradient-heading";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import * as fal from "@fal-ai/serverless-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

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

export default function Generate() {
  const { toast } = useToast();
  const router = useRouter();
  const generationLimit = 5;
  const generationVideoLimit = 1;
  const { user } = useUser();
  const userId = user?.id;
  const save = useMutation(api.contents.saveContent);

  const [prompt, setPrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);

  const profile = useQuery(api.users.getUserById, {
    clerkId: userId as string,
  });

  const updateCount = useMutation(api.users.incrementGenerationCount);

  useEffect(() => {
    if (profile && profile.apiKey) {
      setUserApiKey(profile.apiKey as string);
    } else {
      setUserApiKey(null);
    }
  }, [profile]);

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

      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
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

      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`; // Return the IPFS URL
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw new Error("Failed to upload video to Pinata"); // Update error message
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate",
      });
      return;
    }

    if ((profile?.generationCount ?? 0) >= generationLimit) {
      router.push("/pricing");
      return;
    }

    setLoading(true);

    const updatedCount = await updateCount({
      userId: profile?._id as Id<"users">,
    });

    if (updatedCount > generationLimit) {
      router.push("/pricing");
      return;
    }

    if (userApiKey) {
      fal.config({ credentials: userApiKey });
    } else {
      fal.config({ credentials: process.env.NEXT_PUBLIC_FAL_KEY });
    }

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
        console.log("Generated Image URL:", imageUrl);

        const pinataUrl = await uploadImageToPinata(imageUrl);

        await save({
          userId: profile?._id as Id<"users">,
          creator: profile?.username,
          prompt,
          url: pinataUrl,
          type: "image",
        });

        setPrompt("");

        toast({
          title: "Success",
          description: "Image generated successfully!",
        });
        router.push("/dashboard");
      } else {
        console.log("No image URL found in the result.");
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
    if (!videoPrompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate",
      });
      return;
    }

    setLoading(true);

    if ((profile?.generationCount ?? 0) >= generationVideoLimit) {
      router.push("/pricing");
      return;
    }

    setLoading(true);

    const updatedCount = await updateCount({
      userId: profile?._id as Id<"users">,
    });

    if (updatedCount > generationLimit) {
      router.push("/pricing");
      return;
    }

    if (userApiKey) {
      fal.config({ credentials: userApiKey });
    } else {
      fal.config({ credentials: process.env.NEXT_PUBLIC_FAL_KEY });
    }

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
        console.log("Generated URL:", videoUrl);

        const pinataUrl = await uploadVideoToPinata(videoUrl);

        await save({
          userId: profile?._id as Id<"users">,
          creator: profile?.username,
          prompt: videoPrompt,
          url: pinataUrl,
          type: "video",
        });

        setVideoPrompt("");

        toast({
          title: "Success",
          description: "Video generated successfully!",
        });
        router.push("/dashboard");
      } else {
        console.log("No video URL found in the result.");
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
            <GradientHeading
              size="xl"
              weight="bold"
              className="text-center text-xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] max-w-2xl"
            >
              Enter your prompt to generate a new AI Image or Video
            </GradientHeading>
          </FadeIn>

          <FadeIn>
            <div className="max-w-4xl flex flex-wrap items-center justify-center gap-1 text-center text-base leading-3 text-foreground md:text-lg md:font-normal md:leading-6">
              <span>Unleash your creativity with AI-generated visuals.</span>
              <span>Post your creations and climb the community ranks.</span>
              <span>Browse and upvote unique content from fellow users!</span>
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
                        disabled={loading}
                      >
                        <Image className="mr-2" />
                        {loading ? "Generating..." : "Generate image"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="video">
                  {profile?.credits && profile.credits <= 5 ? (
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
                          disabled={loading}
                        >
                          <Clapperboard className="mr-2" />
                          {loading ? "Generating..." : "Generate video"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 mb-20 text-center">
                      <p className="text-lg">
                        To generate more videos, please buy a payment plan.
                      </p>
                      <Link href="/pricing">
                        <Button className="mt-6 px-6 py-3 text-base font-semibold">
                          Buy a plan
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </FadeIn>
        </PageHeader>
      </div>
    </div>
  );
}
Generate.theme = "light";