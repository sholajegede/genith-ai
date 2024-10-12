import Link from "next/link"
import { ArrowRight, SparklesIcon } from "lucide-react"

import ShaderLensBlurDemo from "@/registry/default/example/shader-lens-blur-demo"
import { GradientHeading } from "@/registry/default/ui/gradient-heading"
import { LightBoard } from "@/registry/default/ui/lightboard"
import ShaderLensBlur from "@/registry/default/ui/shader-lens-blur"

import { Badge } from "../ui/badge"

export function FeaturedComponent() {
  return (
    <div className="relative flex w-full flex-col  p-2  md:flex-row md:items-center md:gap-24 md:p-6">
      <Badge
        variant="outline"
        className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6"
      >
        <SparklesIcon className="  fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
        Featured
      </Badge>
      <div className="flex flex-col justify-center pb-2 pl-2 pt-16 md:items-center">
        <div className="flex  gap-2">
          <div>
            <GradientHeading>LightBoard</GradientHeading>
            <Link
              href="/docs/components/lightboard"
              className="flex items-center gap-1 "
            >
              A retro light board marquee that you can draw on
              <ArrowRight className="hidden h-4 w-4 md:block" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 flex max-w-xl grow flex-col items-center justify-center space-y-0 rounded-[14px] bg-black p-4 md:mt-0 md:rounded-md">
        {/* Matrix Style */}
        <div className="w-full">
          <LightBoard
            rows={16}
            lightSize={3}
            gap={1}
            disableDrawing={false}
            text="THE MATRIX HAS YOU"
            font="default"
            updateInterval={10}
            colors={{
              background: "#001a00",
              textDim: "#006600",
              drawLine: "#00b300",
              textBright: "#00ff00",
            }}
          />
        </div>

        <div className="w-full">
          <LightBoard
            rows={15}
            lightSize={2}
            gap={1}
            text="Welcome to the cult"
            font="default"
            disableDrawing={false}
            updateInterval={50}
            colors={{
              background: "#1a1a1a",
              textDim: "#ff9999",
              drawLine: "#ffff99",
              textBright: "#6CF2E8",
            }}
          />
        </div>

        {/* Interactive Neon Board */}
        <div className="w-full">
          <LightBoard
            rows={32}
            lightSize={2}
            gap={1}
            disableDrawing={false}
            text="NEON DREAMS"
            font="default"
            updateInterval={10}
            colors={{
              background: "#0a0a0a",
              textDim: "#ff00ff33",
              drawLine: "#ff00ff66",
              textBright: "#EBB7DD",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function LatestComponent() {
  return (
    <div className="relative flex w-full flex-col  p-2  md:flex-row md:items-center md:gap-24 md:p-6">
      <Badge
        variant="outline"
        className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6"
      >
        <SparklesIcon className="  fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
        Latest component
      </Badge>
      <div className="flex flex-col justify-center pb-2 pl-2 pt-16 md:items-center">
        <div className="flex  gap-2">
          <div>
            <GradientHeading>Blur Shader</GradientHeading>
            <Link
              href="/docs/components/shader-lens-blur"
              className="flex items-center gap-1 "
            >
              A shader that blurs the edges of your content
              <ArrowRight className="hidden h-4 w-4 md:block" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 flex max-w-xl grow flex-col items-center justify-center space-y-0 rounded-[14px]  p-4 md:mt-0 md:rounded-md">
        <ShaderLensBlur />
      </div>
    </div>
  )
}
