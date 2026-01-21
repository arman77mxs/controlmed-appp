import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone para Docker
  output: 'standalone',
  // Usar Turbopack con configuración vacía (permite usar webpack fallback)
  turbopack: {},
  // Configuración para sql.js en el navegador
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // sql.js usa estos módulos de Node que no existen en el browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  // Headers para WebAssembly
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
