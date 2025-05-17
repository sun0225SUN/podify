/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js'
import createNextIntlPlugin from 'next-intl/plugin'

/** @type {import("next").NextConfig} */
const nextConfig = {}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
