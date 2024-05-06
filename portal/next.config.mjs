/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
		serverComponentsExternalPackages: ["oslo", "@node-rs/argon2"]
	},
	async headers() {
		return [
			{
			  source: '/api/auth/validate-token',
			  headers: [
				{
				  key: "Access-Control-Allow-Origin",
				  value: "*",
				},
				{
				  key: "Access-Control-Allow-Methods",
				  value: "GET, POST, PUT, DELETE, OPTIONS",
				},
				{
				  key: "Access-Control-Allow-Headers",
				  value: "Content-Type, Authorization, portaltoken",
				},
			  ],
			},
		  ]
	}
};

export default nextConfig;
