"use client";

import React from 'react';
import Link from 'next/link';
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { MailIcon, LockIcon } from 'lucide-react';
import routes from '@/config/routes';

export default function LoginPage() {
    const fields = [
        { name: "email", label: "Work Email", type: "email", placeholder: "john@company.com", icon: MailIcon },
        { name: "password", label: "Access Key", type: "password", placeholder: "Enter your password", icon: LockIcon }
    ];

    const handleLogin = (formData) => {
        console.log("Login attempt with:", formData);
        // Handle login logic
    };

    const footerContent = (
        <div className="text-center space-y-2">
            <Link href={routes.forgotPassword} className="text-sm text-[#F66C72] hover:underline block">
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
            <AuthForm
                fields={fields}
                onSubmit={handleLogin}
                buttonLabel="Log In"
            />
        </AuthLayout>
    );
}