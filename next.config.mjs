/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `next build` writes a plain HTML/CSS/JS site to /out for Netlify.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
