"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { MailIcon, LockIcon } from "lucide-react";
import routes from "@/config/routes";
import { useAuth } from "@/contexts/AuthContext";
import { checkIfAdmin } from "@/utils/adminUtils";

export default function LoginPage() {
  const fields = [
    {
      name: "email",
      label: "Work Email",
      type: "email",
      placeholder: "john@company.com",
      icon: MailIcon,
    },
    {
      name: "password",
      label: "Access Key",
      type: "password",
      placeholder: "Enter your password",
      icon: LockIcon,
    },
  ];

  const { signIn } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleLogin = async (formData) => {
    const email = formData.email;
    const password = formData.password;

    try {
      console.log("Attempting login with:", { email, password });
      const { data, error } = await signIn({ email, password });
      console.log("signIn response:", { status: data?.status, error });
      if (data.status === "pending") {
        router.push(routes.register_request);
        return;
      } else if (data.status === "rejected") {
        setMessage("Your account is rejected. Please contact support.");
        return;
      }
      if (error) {
        setMessage("User not found or incorrect password.");
        return;
      }
      if (data.role === "admin") {
        router.push(routes.companies);
        return;
      }
      router.push(routes.dashboard);
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  const footerContent = (
    <div className="text-center space-y-2">
      <Link
        href={routes.forgotPassword}
        className="text-sm text-[#F66C72] hover:underline block"
      >
        Forgot your password?
      </Link>
      <div className="text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href={routes.register} className="text-[#F66C72] hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Welcome back to Dobbi"
      description="Enter your credentials to access your account"
      footerContent={footerContent}
    >
      <AuthForm fields={fields} onSubmit={handleLogin} buttonLabel="Log In" />
      {message && (
        <div className="mt-4 text-center text-black-500">{message}</div>
      )}
    </AuthLayout>
  );
}
