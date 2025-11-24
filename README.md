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

# BuddyScript - Social Media Feed Application

BuddyScript is a full-stack social media feed application built using **Next.js 14** and **Firebase**. It transforms a provided static HTML/CSS design into a fully functional Single Page Application (SPA). The app supports user authentication, real-time posts with images, privacy controls, and threaded comments.

## 🚀 Live Demo

- **Live URL:** [[https://buddy-script-snowy.vercel.app/login](https://buddy-script-snowy.vercel.app/login)]

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Backend & Database:** Firebase Authentication, Firestore (NoSQL)
- **Image Storage:** ImgBB API (chosen for robust free-tier support)
- **Forms & Validation:** React Hook Form, Zod
- **Icons:** React Icons

---

## ✨ Key Features

### 1. Authentication & Authorization

- **Secure Login/Register:** Email & Password authentication using Firebase.
- **Google Sign-In:** One-click login with automatic profile photo integration.
- **Protected Routes:** A higher-order component (`<ProtectedRoute>`) ensures only authenticated users can access the feed.

### 2. Feed Functionality

- **Create Posts:** Support for text content and image uploads.
- **Real-time Updates:** The feed listens to Firestore changes via `onSnapshot`, updating instantly without page reloads.
- **Privacy Controls:**
  - **Public:** Visible to all users.
  - **Private:** Visible only to the author.

### 3. Interactions

- **Likes:** Real-time toggling of likes on posts and comments.
- **Like Details:** A modal displays the list of users who liked a specific post.
- **Comments & Replies:** A recursive threaded comment system allows users to reply to comments infinitely (UI flattened for better UX).

---

## 🏗️ Architectural Decisions & Trade-offs

### 1. Image Storage (ImgBB vs. Firebase Storage)

- **Decision:** I utilized the **ImgBB API** for handling image uploads instead of Firebase Storage.
- **Reasoning:** The Firebase "Blaze Plan" is often required for cloud storage functionality in specific regions or to avoid strict quota limits during development. To ensure the application remains strictly free-tier and easily reviewable without configuration errors, ImgBB was chosen as a reliable alternative that returns direct URLs for storage in Firestore.

### 2. Client-Side Privacy Filtering

- **Decision:** Private posts are filtered on the client side within the `useEffect` hook rather than relying solely on complex Firestore queries.
- **Reasoning:** Firestore's NoSQL structure makes "OR" queries (e.g., `fetch WHERE visibility == 'public' OR authorId == 'me'`) complex, often requiring composite indexes. For the scope of this assignment, fetching recent posts and filtering based on the `visibility` flag provided the best balance of performance and user experience while keeping the backend logic simple.

### 3. Component Structure (SOLID Principles)

- **Decision:** The application logic is separated into small, single-responsibility components located in `src/components/feed/`:
  - `CreatePost.tsx`: Handles form input and image API uploads.
  - `PostCard.tsx`: Manages the display state of a single post.
  - `CommentItem.tsx`: Handles recursive logic for nested replies.
- **Reasoning:** This improves code readability, makes debugging easier, and allows for individual components to be reused.

---

## 🔒 Security Measures

1.  **Frontend Protection:** The `ProtectedRoute` wrapper instantly redirects unauthenticated users to the login page before the UI renders.
2.  **Database Security:** Firestore Security Rules (deployed) ensure that:
    - Users can only write to the database if they have a valid Auth Token.
    - Users cannot delete or modify posts that do not belong to them.
3.  **Environment Variables:** All API keys are accessed via `process.env` and are not hardcoded.

---

## 💻 How to Run Locally

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd buddy-script
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a file named `.env.local` in the root directory and add your keys:

    ```env
    NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
    ```

4.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

5.  **Access the App:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is created for an assignment/assessment purpose.
