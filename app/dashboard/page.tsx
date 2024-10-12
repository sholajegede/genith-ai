"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Package2,
  MousePointerClick,
  ArrowBigUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import BgNoiseWrapper from "@/components/texture-wrapper";
import { FadeIn } from "@/components/animate/fade-in";
import { UserContentGrid } from "@/components/landing/user-content-grid";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useClerk } from "@clerk/nextjs";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const { signOut } = useClerk();
  const userId = user?.id;
  const updateKey = useMutation(api.users.updateUser);

  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const profile = useQuery(api.users.getUserById, {
    clerkId: userId as string,
  });

  const contents = useQuery(api.contents.getContentsByUserId, {
    userId: profile?._id as Id<"users">
  });

  const totalUpvotes = useQuery(api.contents.getTotalUpvotesByUserId, {
    userId: profile?._id as Id<"users">
  });

  const handleUpdateKey = async () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter your API key",
      });
      return;
    }

    setLoading(true);

    try {
      await updateKey({
        userId: profile?._id as Id<"users">,
        apiKey,
      });

      setApiKey("");

      toast({
        title: "Success",
        description: "Api Key saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error saving API Key.",
        variant: "destructive",
      });
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <BgNoiseWrapper url="/images/egg-shell-noise.png">
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span>Genith</span>
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link
              href="/generate"
              className="text-muted-foreground hover:text-foreground"
            >
              Generate
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <p
              className="text-red-400 hover:text-red-500"
              onClick={() => signOut({ redirectUrl: "/sign-in" })}
            >
              Logout
            </p>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span>Genith</span>
                </Link>
                <Link href="/dashboard" className="hover:text-foreground">
                  Dashboard
                </Link>
                <Link
                  href="/generate"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Generate
                </Link>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </Link>
                <p
                  className="text-red-400 hover:text-red-500"
                  onClick={() => signOut({ redirectUrl: "/sign-in" })}
                >
                  Logout
                </p>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 sm:grid-cols-3 md:gap-8">
            <Card x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Credits ({profile?.credits || 0})</CardTitle>
                <CardDescription className="text-balance leading-relaxed">
                  To generate more images and videos on Genith AI, click on the button below to buy more credits.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/pricing">
                  <Button>
                    Get more credits
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-01-chunk-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Generated
                </CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contents?.length || 0}</div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upvotes</CardTitle>
                <ArrowBigUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUpvotes || 0}</div>
              </CardContent>
            </Card>
          </div>

          <FadeIn>
            <section className="w-full space-y-4 md:block">
              <div className="mx-auto rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-[44px]">
                <UserContentGrid />
              </div>
            </section>
          </FadeIn>
        </main>
      </div>
    </BgNoiseWrapper>
  );
};

export default Dashboard;