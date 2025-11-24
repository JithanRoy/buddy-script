"use client";

import { auth, db } from "@/lib/firebase";
import { registerSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // 2. Update Profile Display Name
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      // 3. Save extra details to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        photoURL: null,
        createdAt: new Date().toISOString(),
      });

      router.push("/login");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          setError("This email is already registered.");
        } else if (err.code === "auth/wrong-password") {
          setError("Invalid password.");
        } else if (err.code === "auth/user-not-found") {
          setError("User not found.");
        } else {
          setError("Failed to register. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
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
      <div className="absolute top-0 right-0">
        <Image
          src="/assets/images/shape2.svg"
          width={200}
          height={200}
          alt="shape"
        />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Side: Images (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-8 relative">
            <div className="relative w-full max-w-lg mx-auto">
              <Image
                src="/assets/images/registration.png"
                width={600}
                height={500}
                alt="Registration Hero"
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

              <p className="text-gray-500 mb-2">Get Started Now</p>
              <h4 className="text-2xl font-bold mb-8 text-gray-800">
                Registration
              </h4>

              {/* Google Button Mockup */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-lg mb-6 hover:bg-gray-50 transition"
              >
                <Image
                  src="/assets/images/google.svg"
                  width={20}
                  height={20}
                  alt="Google"
                />
                <span className="font-medium text-gray-700">
                  Register with google
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register("firstName")}
                      className="w-full text-black px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      {...register("lastName")}
                      className="w-full text-black px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

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

                    {/* 4. Toggle Button */}
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
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repeat Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full text-black px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="mt-8 mb-8">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
                  >
                    {isSubmitting ? "Creating Account..." : "Register Now"}
                  </button>
                </div>
              </form>

              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
