"use client";

import React from 'react';
import Link from 'next/link';
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { BuildingIcon, MailIcon, LockIcon } from 'lucide-react';
import routes from '@/config/routes';

export default function RegisterPage() {
    const fields = [
        { name: "company", label: "Company Name", type: "text", placeholder: "Acme Corp", icon: BuildingIcon },
        { name: "email", label: "Work Email", type: "email", placeholder: "john@company.com", icon: MailIcon },
        { name: "password", label: "Password", type: "password", placeholder: "Create a password", icon: LockIcon },
        { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm your password", icon: LockIcon }
    ];

    const handleRegister = (formData) => {
        console.log("Registration attempt with:", formData);
        // Handle registration logic
    };

    const footerContent = (
        <div className="text-center">
            <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href={routes.login} className="text-[#F66C72] hover:underline">
                    Log in
                </Link>
            </div>
        </div>
    );

    return (
        <AuthLayout
            title="Create your Dobbi account"
            description="Enter your details to get started"
            footerContent={footerContent}
        >
            <AuthForm
                fields={fields}
                onSubmit={handleRegister}
                buttonLabel="Sign Up"
            />
        </AuthLayout>
    );
}