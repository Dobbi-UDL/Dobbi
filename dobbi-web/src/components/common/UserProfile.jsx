import React from 'react'
import Image from 'next/image'
import { User, Settings, LogOut } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/common/DropdownMenu"
import Link from 'next/link'
import routes from '@/config/routes'

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
            <DropdownMenuContent align="end" className="w-56 bg-white" sideOffset={5}>
                <Link href={routes.profile} passHref>
                    <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                </Link>
                <Link href={routes.settings} passHref>
                    <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </Link>
                <Link href={routes.logout} passHref>
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserProfile