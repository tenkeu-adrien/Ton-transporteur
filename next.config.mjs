/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
      },
      eslint: {
        ignoreDuringBuilds: true, // Désactive ESLint pendant les builds
      },
      typescript: {
        ignoreBuildErrors: true,
      },
};

export default nextConfig;
// module.exports = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
 
// }