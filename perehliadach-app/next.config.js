const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const pdfWorkerPath = require.resolve(
    `pdfjs-dist/build/pdf.worker${
        process.env.NODE_ENV === 'development' ? '' : '.min'
    }.js`
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    webpack: (config) => {
        config.externals = [...config.externals, 'canvas', 'jsdome'];

        config.plugins.push(
            new CopyPlugin({
              patterns: [
                {
                  from: pdfWorkerPath,
                  to: path.join(__dirname, 'public'),
                },
              ],
            })
        );

        return config;
    }
}

module.exports = nextConfig;
