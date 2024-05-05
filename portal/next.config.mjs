/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
		serverComponentsExternalPackages: ["oslo", "@node-rs/argon2"]
	}
};

export default nextConfig;
