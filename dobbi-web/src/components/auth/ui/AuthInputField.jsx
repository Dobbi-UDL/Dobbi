import React from 'react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

export function InputField({
    label,
    id,
    type = "text",
    placeholder,
    icon: Icon,
    onChange,
    togglePassword,
    showPassword,
    className,
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    type={type === "password" && showPassword ? "text" : type}
                    placeholder={placeholder}
                    className={cn("pl-10", className)}
                    onChange={onChange}
                />
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                )}
                {togglePassword && (
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                )}
            </div>
        </div>
    );
}
