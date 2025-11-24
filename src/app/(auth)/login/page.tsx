/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { auth, db } from "@/lib/firebase";
import { LoginFormData, loginSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const names = user.displayName?.split(" ") || ["User", ""];
        const firstName = names[0];
        const lastName = names.length > 1 ? names.slice(1).join(" ") : "";

        await setDoc(userDocRef, {
          uid: user.uid,
          firstName: firstName,
          lastName: lastName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }

      router.push("/feed");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  // --- 2. HANDLE EMAIL LOGIN ---
  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/feed");
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  return (
    <section className="min-h-screen relative bg-[#F0F2F5] overflow-hidden flex items-center justify-center py-10">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0">
        <Image
          src="/assets/images/shape1.svg"
          width={200}
          height={200}
          alt="shape"
        />
      </div>
      <div className="absolute bottom-0 right-0 rotate-180">
        <Image
          src="/assets/images/shape3.svg"
          width={200}
          height={200}
          alt="shape"
        />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Side: Images */}
          <div className="hidden lg:block lg:col-span-8 relative">
            <div className="relative w-full max-w-lg mx-auto">
              <Image
                src="/assets/images/login.png"
                width={600}
                height={500}
                alt="Login Hero"
                priority
              />
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/assets/images/logo.svg"
                  width={200}
                  height={200}
                  alt="Logo"
                />
              </div>

              <p className="text-gray-500 mb-2">Welcome back</p>
              <h4 className="text-2xl font-bold mb-8 text-gray-800">
                Login to your account
              </h4>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-lg mb-6 hover:bg-gray-50 transition"
              >
                <Image
                  src="/assets/images/google.svg"
                  width={20}
                  height={20}
                  alt="Google"
                />
                <span className="font-medium text-gray-700">
                  Or sign-in with google
                </span>
              </button>

              <div className="relative text-center mb-6">
                <span className="bg-white px-2 text-gray-500 text-sm relative z-10">
                  Or
                </span>
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 z-0"></div>
              </div>

              {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full text-black px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className="w-full text-black px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="remember"
                      className="mr-2"
                      defaultChecked
                    />
                    <label htmlFor="remember" className="text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <div className="mt-8 mb-8">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
                  >
                    {isSubmitting ? "Logging in..." : "Login now"}
                  </button>
                </div>
              </form>

              <p className="text-center text-gray-600 text-sm">
                Dont have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create New Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
