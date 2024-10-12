import { SignUp } from '@clerk/nextjs';
import { Metadata } from 'next';

const defaultUrl = process.env.VERCEL_URL
  ? `https://genith-ai.vercel.app/sign-up`
  : process.env.NODE_ENV === 'development'
  ? `http://localhost:3000/sign-up`
  : `https://genith-ai.vercel.app/sign-up`;

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Sign Up',
  description: 'Create your free account'
};

const Page = () => {
  return (
    <SignUp path="/sign-up" />
  )
};

export default Page