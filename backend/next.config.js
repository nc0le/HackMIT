/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        SUPABASE_PUBLIC_API_KEY: process.env.SUPABASE_PUBLIC_API_KEY,
    },
};

module.exports = nextConfig;
