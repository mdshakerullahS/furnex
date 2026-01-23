/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dxv01t8ic/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/150/**",
      },
    ],
  },
};

export default nextConfig;
