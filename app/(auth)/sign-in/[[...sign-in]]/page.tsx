import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';

const defaultUrl = process.env.VERCEL_URL
  ? `https://genith-ai.vercel.app/sign-in`
  : process.env.NODE_ENV === 'development'
  ? `http://localhost:3000/sign-in`
  : `https://genith-ai.vercel.app/sign-in`;

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Sign in',
  description: 'Sign in to your free account'
};

const Page = () => {
  return (
    <SignIn path="/sign-in" />
  )
};

export default Page