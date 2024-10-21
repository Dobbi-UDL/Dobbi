import React from 'react'
import Image from 'next/image'
import { User, Settings, LogOut } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/common/DropdownMenu"

const UserProfile = () => {
    return (
        <DropdownMenu>
            {/* DropdownMenuTrigger is a button that will open the dropdown menu when clicked */}
            <DropdownMenuTrigger asChild>
                <button id="user-profile-button" className="relative h-8 w-8 rounded-full">
                    <Image
                        src="/images/placeholder-user.png"
                        alt="User avatar"
                        className="rounded-full object-cover"
                        fill
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserProfile