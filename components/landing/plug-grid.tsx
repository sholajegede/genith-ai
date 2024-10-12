import { StickerIcon } from "lucide-react"

import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/registry/default/ui/minimal-card"

import { Badge } from "../ui/badge"

export function PlugCardGrid() {
  const cards = [
    {
      title: "Generate",
      description:
        "Enter a prompt, and our AI creates your custom image or video, saving it to Pinata automatically.",
      img: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2FoNGR5OXpvMnZ2a3NpNWpqYnlnOG82aWYzMnJhY256ajVuOWhpMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w1LYqDDIpDaLKj6N5t/giphy.gif",
    },
    {
      title: "Share",
      description:
        "Your content is instantly shared with the community for others to explore and upvote.",
      img: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3p0Nm1xcnE2eDNkOTJ6NndxaTJlejFodGozZ3RpcXc4MW80OHkwYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AdRaGoL5xT1SdI6J5v/giphy.gif",
    },
    {
      title: "Explore & Upvote",
      description:
        "Discover AI-generated content, upvote your favorites, and join the fun.",
      img: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXFpaG1vaG83YTgxdTdxc2ZreHNtaGphYjF4aXd6c3JvbXNodW9ubSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7bzrBMHEsgPb20T3C5/giphy.gif",
    },
  ]

  return (
    <div className="relative  w-full space-y-4 p-2">
      <Badge
        variant="outline"
        className="absolute left-4 top-4 rounded-[14px] border border-black/10 text-base md:left-6"
      >
        <StickerIcon className="mr-1  fill-[#A3C0E0] stroke-1 text-neutral-800" />{" "}
        How it works
      </Badge>
      <div className="flex flex-col justify-center  space-y-4 rounded-[34px]   p-3 pt-12">
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
          {cards.map((card) => (
            <p
              key={card.title}
            >
              <MinimalCard className="bg-transparent">
                {/* <MinimalCardImage src={card.img} alt={card.title} /> */}
                <MinimalCardTitle className="text-neutral-800">
                  {card.title}
                </MinimalCardTitle>
                <MinimalCardDescription className="text-neutral-900">
                  {card.description}
                </MinimalCardDescription>
              </MinimalCard>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
