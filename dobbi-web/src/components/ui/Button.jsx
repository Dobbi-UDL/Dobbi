import React from 'react';
import { cn } from "@/lib/utils";

export function Button({ className, ...props }) {
    return (
        <button
            className={cn(
                "w-full mt-6 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
                "bg-[#F66C72] text-white hover:bg-black", // Updated styles
                className
            )}
            {...props}
        />
    );
}
