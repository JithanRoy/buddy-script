This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/JithanRoy/buddy-script) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://buddy-script-snowy.vercel.app/login) from the creators of Next.js.

## BuddyScript - Project Documentation

1. Project Overview
   BuddyScript is a social media feed application built with Next.js and Firebase. It converts a static HTML/CSS design into a fully functional Single Page Application (SPA). Users can register, log in (via Email or Google), create posts with images, like posts, and engage in threaded comments.
2. Tech Stack
   Frontend Framework: Next.js 14 (App Router)
   Language: TypeScript
   Styling: Tailwind CSS
   Backend / Database: Firebase (Authentication & Firestore)
   Image Hosting: ImgBB API
   Form Handling: React Hook Form + Zod Validation
   Icons: React Icons
3. Key Features Implemented
   Authentication:
   Secure Registration and Login using Firebase Auth.
   Google Sign-In integration.
   Protected Routes: Non-authenticated users are redirected to the login page.
   Feed Functionality:
   Create posts with Text and Images.
   Real-time feed updates using Firestore listeners (onSnapshot).
   Privacy Controls: "Public" posts are visible to everyone; "Private" posts are visible only to the author.
   Interactions:
   Likes: Real-time like/unlike toggle on posts and comments.
   Like Details: A modal shows the list of users who liked a specific post.
   Comments: Threaded comment system allowing users to reply to comments.
4. Architectural Decisions & Trade-offs
   A. Image Storage (ImgBB vs. Firebase Storage)
   Decision: I utilized the ImgBB API for handling image uploads instead of Firebase Storage.
   Reasoning: The Firebase "Blaze Plan" (required for cloud functions and often storage in specific regions) requires billing setup. To ensure the application remains strictly free-tier and accessible without credit card dependencies for review, ImgBB was chosen as a robust, developer-friendly alternative.
   B. Client-Side Privacy Filtering
   Decision: Private posts are filtered on the client side inside the useEffect hook rather than via complex Firestore Security Rules conditions.
   Reasoning: While backend filtering is better for large-scale security, Firestore's NoSQL structure makes "OR" queries (e.g., fetch PUBLIC OR (PRIVATE AND MY_ID)) complex and requires composite indexes. For this assignment's scale, client-side filtering provided a smoother UX while still maintaining data integrity via basic Security Rules.
   C. Component Structure (SOLID Principles)
   Decision: I broke down the monolithic HTML design into small, single-responsibility components:
   CreatePost.tsx: Handles form input and image upload logic only.
   PostCard.tsx: Handles the display and interaction of a single post.
   CommentItem.tsx: Handles the recursive logic for nested replies.
   Reasoning: This makes the code maintainable, readable, and easier to debug.
   D. Authentication State
   Decision: Implemented a global AuthContext and a <ProtectedRoute> wrapper component.
   Reasoning: This avoids code duplication by handling session checks in one place. If a user is not logged in, the ProtectedRoute prevents the UI from flashing before redirecting.
5. Security Measures
   Frontend: ProtectedRoute component prevents unauthorized navigation to the Feed.
   Backend: Firestore Security Rules were deployed to ensure that only authenticated users can read/write data to the posts and users collections.
   Environment Variables: API keys (Firebase and ImgBB) are stored in .env.local and are not hardcoded in the source files.
6. How to Run Locally
   Clone the repository.
   Create a .env.local file and add the provided Firebase and ImgBB keys.
   Run npm install.
   Run npm run dev.
   Open http://localhost:3000.
