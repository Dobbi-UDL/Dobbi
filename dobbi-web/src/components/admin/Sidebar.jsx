import { Home, Users, Building2, UserCog } from 'lucide-react'

export function Sidebar({ activeTab, setActiveTab }) {
    const tabs = [
        { name: 'Dashboard', icon: Home, value: 'dashboard' },
        { name: 'Companies', icon: Building2, value: 'companies' },
        { name: 'Admins', icon: UserCog, value: 'admins' },
        { name: 'Users', icon: Users, value: 'users' },
    ]

    return (
        <div className="flex flex-col w-64 bg-gray-800">
            <div className="flex items-center justify-center h-20 shadow-md">
                <h1 className="text-3xl uppercase text-white">Admin</h1>
            </div>
            <ul className="flex flex-col py-4">
                {tabs.map((tab) => (
                    <li
                        key={tab.value}
                        className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${activeTab === tab.value ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <a
                            href="#"
                            onClick={() => setActiveTab(tab.value)}
                            className="flex items-center w-full h-full px-4 space-x-2"
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.name}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}