"use client";

import BgNoiseWrapper from "@/components/texture-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export const Navbar = () => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <header className="w-full z-40 fixed top-0 left-0 bg-background">
        <BgNoiseWrapper url="/images/egg-shell-noise.png">
          <div className="container relative mx-auto min-h-20 flex gap-4 lg:grid lg:grid-cols-3 items-center">
            <div className="justify-start gap-4 inline-flex">
              <p className="font-semibold text-xl">Genith</p>
            </div>
            <div className="flex lg:justify-center"></div>
            <div className="flex justify-end w-full gap-4">
              <Link href="/sign-in">
                <Button variant="outline">Sign in</Button>
              </Link>
              <Link href="/sign-up" className="hidden sm:block">
                <Button>Create your account</Button>
              </Link>
            </div>
          </div>
        </BgNoiseWrapper>
      </header>
    );
  }
  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background">
      <BgNoiseWrapper url="/images/egg-shell-noise.png">
        <div className="container relative mx-auto min-h-20 flex gap-4 lg:grid lg:grid-cols-3 items-center">
          <div className="justify-start gap-4 inline-flex">
            <p className="font-semibold text-xl">Genith</p>
          </div>
          <div className="flex lg:justify-center"></div>
          <div className="flex justify-end w-full gap-4">
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </div>
      </BgNoiseWrapper>
    </header>
  );
};