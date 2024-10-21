/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'iocaslevcrftfqasuwhj.supabase.co',
                pathname: '/storage/v1/object/public/**', // Match public object URLs
            },
            {
                protocol: 'https',
                hostname: 'iocaslevcrftfqasuwhj.supabase.co',
                pathname: '/storage/v1/object/sign/**', // Keep this for signed URLs
            },
        ],
    },
};

export default nextConfig;
