"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { BuildingIcon, MailIcon, LockIcon } from 'lucide-react';
import routes from '@/config/routes';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
    // TODO: if too many fields, paginate the registration form
    const fields = [
        { name: "company", label: "Company Name", type: "text", placeholder: "Acme Corp", icon: BuildingIcon },
        { name: "email", label: "Work Email", type: "email", placeholder: "john@company.com", icon: MailIcon },
        { name: "password", label: "Password", type: "password", placeholder: "Create a password", icon: LockIcon },
        { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm your password", icon: LockIcon }
    ];

    const { signUp } = useAuth();
    const router = useRouter();
    const [message, setMessage] = useState('');

    const handleRegister = async (formData) => {
        const { company: name, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            console.log('Attempting registration with:', { name, email, password });
            const result = await signUp({ name, email, password });

            if (result.error) throw result.error;

            router.push(routes.dashboard);
        } catch (error) {
            console.error('Registration error:', error);
            setMessage(error.message || "An error occurred during registration");
        }
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
            {message && (
                <div className="mt-4 text-center text-red-500">
                    {message}
                </div>
            )}
        </AuthLayout>
    );
}