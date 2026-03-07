import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/cleanest-village-in-india-mawlynnong",
        destination:
          "https://blog.trendswe.com/blog/cleanest-village-in-india-mawlynnong/",
        permanent: true,
      },
      {
        source: "/the-richest-village-of-maharashtra",
        destination:
          "https://blog.trendswe.com/blog/the-richest-village-of-maharashtra/",
        permanent: true,
      },
      {
        source: "/richest-village-in-india",
        destination: "https://blog.trendswe.com/blog/richest-village-in-india/",
        permanent: true,
      },
      {
        source: "/top-10-richest-villages-in-india",
        destination:
          "https://blog.trendswe.com/blog/top-10-richest-villages-in-india/",
        permanent: true,
      },
      {
        source: "/haunted-village-in-rajasthan",
        destination:
          "https://blog.trendswe.com/blog/haunted-village-in-rajasthan/",
        permanent: true,
      },
      {
        source: "/black-magic-village-in-assam",
        destination:
          "https://blog.trendswe.com/blog/black-magic-village-in-assam/",
        permanent: true,
      },
      {
        source: "/1st-solar-village-in-india",
        destination:
          "https://blog.trendswe.com/blog/1st-solar-village-in-india/",
        permanent: true,
      },
      {
        source: "/sanskrit-speaking-village-in-india",
        destination:
          "https://blog.trendswe.com/blog/sanskrit-speaking-village-in-india/",
        permanent: true,
      },
      {
        source: "/largest-village-in-punjab",
        destination:
          "https://blog.trendswe.com/blog/largest-village-in-punjab/",
        permanent: true,
      },
      {
        source: "/largest-village-in-india",
        destination: "https://blog.trendswe.com/blog/largest-village-in-india/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
