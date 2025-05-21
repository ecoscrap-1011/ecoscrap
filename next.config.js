/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Ensure config.externals is an array (handle if it's a function)
    if (typeof config.externals === 'function') {
      const originalExternals = config.externals;
      config.externals = async (context, request, callback) => {
        const externalsToIgnore = [
          'snappy',
          'socks',
          'aws4',
          'mongodb-client-encryption',
          'kerberos',
          '@mongodb-js/zstd',
          '@aws-sdk/credential-providers',
          'gcp-metadata',
        ];

        if (externalsToIgnore.includes(request)) {
          return callback(null, 'commonjs ' + request);
        }

        return originalExternals(context, request, callback);
      };
    } else {
      config.externals = config.externals || [];
      config.externals.push({
        snappy: 'commonjs snappy',
        socks: 'commonjs socks',
        aws4: 'commonjs aws4',
        'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
        kerberos: 'commonjs kerberos',
        '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
        '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers',
        'gcp-metadata': 'commonjs gcp-metadata',
      });
    }

    return config;
  },
};

module.exports = nextConfig;
