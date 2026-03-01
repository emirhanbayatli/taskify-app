"use client";
import { useState } from "react";
import Link from "next/link";
import { SocialButton } from "./SocialButton";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/AuthProvider";
import { Eye, EyeOff } from "lucide-react";

interface Auth {
  fullName: string;
  email: string;
  password: string;
}
interface AuthFormProps {
  type: "login" | "register" | "resetPassword";
}
export function AuthForm({ type }: AuthFormProps) {
  const { login, signUp, resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Auth>({ mode: "all" });

  return (
    <div className="w-full max-w-[480px] bg-[#1A2026] rounded-2xl border border-dark-border shadow-2xl p-8 md:p-12 flex flex-col gap-8">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Taskify</h1>
        <h2 className="text-xl font-semibold text-white">
          {type == "login" ? "Welcome Back!" : "Welcome to Taskify!"}
        </h2>
        <p className="text-sm text-white">Manage your projects with clarity</p>
      </div>

      {type != "resetPassword" ? (
        <div className="flex flex-col gap-6">
          <SocialButton provider="google" />
          <span className="text-center text-[10px] text-white font-bold uppercase text-dark-textMuted">
            Or continue with
          </span>
        </div>
      ) : null}

      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(async (data) => {
          if (type == "register") {
            await signUp(data.email, data.password, data.fullName);
            return;
          } else if (type == "login") {
            await login(data.email, data.password);
          } else {
            await resetPassword(data.email);
          }
        })}
      >
        {type === "register" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/90">Full Name</label>

            <input
              {...register("fullName", {
                required: "Full name is required!",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Full name must not exceed 100 characters",
                },
                pattern: {
                  value: /^[A-Za-zÇĞİÖŞÜçğıöşü\s]+$/,
                  message: "Full name can only contain letters",
                },
              })}
              type="text"
              placeholder="John Doe"
              className="h-12 px-4 rounded-lg bg-dark-input border text-white focus:ring-1 focus:ring-primary outline-none"
            />
            {errors.fullName && (
              <p className="text-red-500">{errors.fullName.message}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/90">Email Address</label>
          <input
            {...register("email", {
              required: "Email is required!",
              minLength: {
                value: 5,
                message: "Email must be at least 5 characters long",
              },
              maxLength: {
                value: 150,
                message: "Email must not exceed 150 characters",
              },
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Unexpected email format",
              },
            })}
            type="email"
            placeholder="name@company.com"
            className="h-12 px-4 rounded-lg bg-dark-input border  text-white focus:ring-1 focus:ring-primary outline-none"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        {type != "resetPassword" ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/90">Password</label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  maxLength: {
                    value: 60,
                    message: "Password must not exceed 60 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-12 w-full pl-4 pr-12 rounded-lg bg-dark-input border text-white focus:ring-1 focus:ring-primary outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <Link
                href="/reset-password"
                className="text-white/90 font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        ) : null}

        <button className="h-12 bg-blue-700 text-white/90 font-bold rounded-lg hover:bg-blue-600 transition">
          {type == "login"
            ? "Sign In"
            : type == "resetPassword"
              ? "Reset Password"
              : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm text-white/90 ">
        {type == "login"
          ? "Don't have an account?"
          : type == "resetPassword"
            ? "Remembered your password?"
            : "Already have an account?"}
        <Link
          href={type === "login" ? "/register" : "/login"}
          className="ml-1 font-bold text-white/90"
        >
          {type === "login" ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  );
}
