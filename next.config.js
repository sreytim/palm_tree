const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseStoragePattern = supabaseUrl
  ? (() => {
      const storageUrl = new URL(supabaseUrl);
      return {
        protocol: storageUrl.protocol.slice(0, -1),
        hostname: storageUrl.hostname,
        ...(storageUrl.port ? { port: storageUrl.port } : {}),
        pathname: "/storage/v1/object/public/photos/**",
      };
    })()
  : null;

const nextConfig = {
  allowedDevOrigins: [
    "10.10.54.96",
    "10.10.58.176",
    "10.10.61.218",
    "192.168.0.112",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supabaseStoragePattern ? [supabaseStoragePattern] : []),
    ],
  },
};

module.exports = nextConfig;
