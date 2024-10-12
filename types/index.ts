/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from "react";

import { Id } from "@/convex/_generated/dataModel";

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface Template {
  _id: Id<"templates">;
  name: string;
  subject: string;
  html: string;
  new: boolean;
  views: number;
  _creationTime: number;
};

export interface PageCardProps {
  imgUrl: string;
  name: string;
  category: string;
  price: number;
  videoUrl: string;
  pageId: Id<"pages">;
};

export interface CampaignCardProps {
  campaignId: Id<"campaigns">;
  name: string;
  description: string;
  creationTime: number;
};

export interface LeadCardProps {
  title: string;
  description: string;
  leadId: Id<"leads">;
}

export interface UserProfileProps {
  id: string;
  email: string;
  imageUrl: string;
  clerkId: string;
  username: string;
  walletBalance: number;
  totalDeposited: number;
  purchaseHistory: any[];
}

export interface PageCardOrderProps {
  imgUrl: string;
  name: string;
  description: string;
  category: string;
  price: number;
  pageId: Id<"pages">;
  file: string;
}

export interface UploadPageThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
}

export interface UploadPageFileProps {
  setZipFile: Dispatch<SetStateAction<string>>;
  setZipFileStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  zipFile: string;
}

export interface UploadPageDemoVideoProps {
  setVideo: Dispatch<SetStateAction<string>>;
  setVideoStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  video: string;
}

//methods
export interface UploadMethodPDFProps {
  setPDF: Dispatch<SetStateAction<string>>;
  setPDFStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  pdf: string;
}

export interface UploadMethodVideoProps {
  setVideo: Dispatch<SetStateAction<string>>;
  setVideoStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  video: string;
}

export interface TopPagesProps {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  podcast: {
    podcastTitle: string;
    podcastId: Id<"pages">;
  }[];
  totalPodcasts: number;
}

export interface PageProps {
  _id: Id<"pages">;
  _creationTime: number;
  audioStorageId: Id<"_storage"> | null;
  user: Id<"users">;
  podcastTitle: string;
  podcastDescription: string;
  audioUrl: string | null;
  imageUrl: string | null;
  imageStorageId: Id<"_storage"> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  voicePrompt: string;
  imagePrompt: string | null;
  voiceType: string;
  audioDuration: number;
  views: number;
}

export interface ProfilePageProps {
  podcasts: PageProps[];
  listeners: number;
}

export interface GeneratePageProps {
  voiceType: string;
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  voicePrompt: string;
  setVoicePrompt: Dispatch<SetStateAction<string>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}

export interface UploadPageThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
}

export interface LatestPageCardProps {
  imgUrl: string;
  title: string;
  duration: string;
  index: number;
  audioUrl: string;
  author: string;
  views: number;
  podcastId: Id<"pages">;
}

export interface PodcastDetailPlayerProps {
  audioUrl: string;
  podcastTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl: string;
  podcastId: Id<"pages">;
  imageStorageId: Id<"_storage">;
  audioStorageId: Id<"_storage">;
  authorImageUrl: string;
  authorId: string;
}

export interface CarouselProps {
  fansLikeDetail: TopPagesProps[];
}

export interface ProfileCardProps {
  podcastData: ProfilePageProps;
  imageUrl: string;
  userFirstName: string;
}

export type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};