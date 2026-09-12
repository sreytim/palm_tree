const nextConfig = {
  allowedDevOrigins: ["10.10.61.218", "192.168.0.112"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

module.exports = nextConfig;
