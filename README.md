# Genith

**Genith** is an image and video generation app that leverages AI/ML technology to create content from text prompts. The app uses **Pinata** for secure, decentralized storage of all generated media, ensuring users can easily store and fetch their creations.

This project was built using modern technologies, including **Next.js**, **TypeScript**, **Clerk** for authentication, **Convex.dev** as the database, and hosted with **Vercel** for seamless deployment.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Pinata Integration](#pinata-integration)
5. [Environment Variables](#environment-variables)
6. [Running Locally](#running-locally)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)


## Tech Stack

The following technologies were used to build **Genith**:

- [**Fal-ai**](https://fal-ai.io/): AI/ML technology for generating images and videos from text prompts.
- [**Pinata**](https://pinata.cloud/): Secure, decentralized storage for all generated media.
- [**Next.js**](https://nextjs.org/): A fast and responsive framework for server-side rendering and static site generation.
- [**TypeScript**](https://www.typescriptlang.org/): For adding type safety and improving code quality.
- [**Clerk**](https://clerk.dev/): Authentication and user management system.
- [**Convex.dev**](https://convex.dev/): The database used for handling data efficiently.
- [**Vercel**](https://vercel.com/): Hosting platform for seamless deployment.
- [**Tailwind CSS**](https://tailwindcss.com/): Utility-first CSS framework for building modern UIs.


## Features

- **AI-Driven Content Generation**: Users can generate unique images and videos based on text prompts using **Fal-ai**.
- **Pinata for Storage**: Seamless and secure decentralized storage of all media.
- **Community Engagement**: Users can upvote content, fostering a collaborative creative community.
- **Authentication**: Secure login and user management with **Clerk**.
- **Responsive Design**: Built with **Tailwind CSS** for a clean, modern, and responsive UI.
- **Efficient Database**: Uses **Convex.dev** for handling user data and interactions.

## Getting Started

To run **Genith** locally, follow these steps.

### Prerequisites

- **Node.js** installed (v14 or higher).
- **npm** or **yarn** or **bun**  as the package manager.

### Installation

Clone the repository:

```bash
bash
Copy code
git clone https://github.com/yourusername/genith-ai.git
cd genith-ai

```

Install dependencies:

```bash
bash
Copy code
npm install
# or
yarn install
# or
bun install

```

### Running Locally

To start the development server:

```bash
bash
Copy code
npm run dev
# or
yarn dev
# or
bun run dev

```

Open [http://localhost:3000](http://localhost:3000/) with your browser to see the app in action.


## Pinata Integration

**Genith** leverages **Pinata** for secure and decentralized media storage. All images and videos generated by users are stored on Pinata’s IPFS, making them easily retrievable and securely stored.

### Steps to Integrate Pinata

To integrate **Pinata** into your local environment:

1. Sign up for a **Pinata** account at [Pinata](https://pinata.cloud/).
2. Generate an **API Key** from your Pinata dashboard.
3. Add your **Pinata API Key** and **Pinata Secret Key** to the `.env.local` file.

```bash
bash
Copy code
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key

```

1. All media uploads will now be routed through Pinata for secure storage on the decentralized IPFS network.


## Environment Variables

To run **Genith**, you will need to set up environment variables. Create a `.env.local` file in the root directory and add the following:

```bash
bash
Copy code
FAL_KEY=your_fal_ai_api_key
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_key (to connect clerk auth with convex)

NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CONVEX_HTTP_URL=your_convex_http_url (for webhooks)

```

Replace the placeholders with the respective values for your **Pinata**, **Clerk**, and **Convex.dev** configurations.


## Running Locally

To run **Genith** locally for development purposes:

1. Clone the repository and install dependencies as mentioned in the [Getting Started](#getting-started) section.
2. Run the development server:

```bash
bash
Copy code
npm run dev

```

1. Open [http://localhost:3000](http://localhost:3000/) in your browser to access the app.


## Deployment

**Genith** is hosted using **Vercel**. To deploy the app:

1. Create a **Vercel** account at [Vercel](https://vercel.com/).
2. Link the project to your **Vercel** account.
3. Add the necessary environment variables in your Vercel project settings.
4. Deploy the application:

```bash
bash
Copy code
vercel deploy

```

Your app will be deployed at `https://your-app-name.vercel.app`.


## Contributing

Contributions are welcome! Here’s how you can contribute:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.


## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
