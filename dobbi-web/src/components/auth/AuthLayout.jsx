import React from 'react'
import Image from "next/image"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/auth/ui/Card"

export function AuthLayout({ children, title, description, footerContent }) {
    return (
        <div id="auth-layout" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
            <div id="auth-container" className="w-full max-w-md">
                <div id="auth-image-container" className="flex justify-center">
                    <Image id="auth-image" src="/images/dobbi-open-arms-short.png" alt="Dobbi Mascot" width={200} height={100} />
                </div>
                <Card id="auth-card" className="w-full max-w-md shadow-lg">
                    <CardHeader id="auth-header" className="text-center">
                        <h2 id="auth-title" className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                        <p id="auth-description" className="text-gray-500">{description}</p>
                    </CardHeader>
                    <CardContent id="auth-card-content" className="space-y-4">
                        {children}
                    </CardContent>
                    {footerContent && (
                        <CardFooter id="auth-footer" className="flex justify-center">
                            {footerContent}
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    )
}