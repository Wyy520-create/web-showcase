/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出：next build 产出 out/ 目录，由 nginx 直接托管
  output: 'export',
  images: { unoptimized: true },
}

module.exports = nextConfig
