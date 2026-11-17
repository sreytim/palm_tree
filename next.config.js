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
  poweredByHeader: false,
  allowedDevOrigins: [
    "10.10.54.96",
    "10.10.58.176",
    "10.10.61.218",
    "10.10.50.217",
    "192.168.0.112",
  ],
  images: {
    // The archive's illustration set is SVG (gallery, category cards, process
    // timeline). Next refuses to serve SVG through the image optimizer unless
    // this is enabled, which returned HTTP 400 and broke every illustration.
    // Every SVG here ships from `public/`, so it is first-party, static and
    // trusted; the security policy below keeps it inert if one is ever opened
    // directly.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supabaseStoragePattern ? [supabaseStoragePattern] : []),
    ],
  },
};

module.exports = nextConfig;
