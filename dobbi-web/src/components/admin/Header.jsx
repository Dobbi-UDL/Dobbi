import { Bell, Settings } from 'lucide-react'

export function Header({ user }) {
    return (
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-[#F66C72]">
            <div className="flex items-center">
                <button className="text-gray-500 focus:outline-none lg:hidden">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center">
                <button className="flex mx-4 text-gray-600 focus:outline-none">
                    <Bell className="h-6 w-6" />
                </button>
                <div className="relative">
                    <button className="relative z-10 block h-8 w-8 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none focus:border-white">
                        <img className="h-full w-full object-cover" src={user?.user_metadata?.avatar_url || "https://via.placeholder.com/150"} alt="Your avatar" />
                    </button>
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F66C72] hover:text-white">Profile</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F66C72] hover:text-white">Settings</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F66C72] hover:text-white">Logout</a>
                    </div>
                </div>
            </div>
        </header>
    )
}