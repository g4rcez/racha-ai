const withSerwist = require("@serwist/next").default({
  swSrc: "./src/app/sw.ts",
  swDest: "public/sw.js",
  register: true,
});

module.exports = withSerwist({
  // Your Next.js config
});
