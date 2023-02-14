const svgUrlLoader = require("svg-url-loader");

const buildAsset = require("./build-asset");

buildAsset({
  assetFile: "logo.svg",
  targetFile: "logo.ts",
  targetVar: "WALLETCONNECT_LOGO_SVG_URL",
  loader: input =>
    svgUrlLoader(input)
      .replace(`module.exports = "`, "")
      .replace(`"`, ""),
});

buildAsset({
  assetFile: "caret.svg",
  targetFile: "caret.ts",
  targetVar: "CARET_SVG_URL",
  loader: input =>
    svgUrlLoader(input)
      .replace(`module.exports = "`, "")
      .replace(`"`, ""),
});
buildAsset({
  assetFile: "download_appstore.svg",
  targetFile: "download-ios.ts",
  targetVar: "NEOPIN_IOS_DOWNLOAD_SVG_URL",
  loader: input =>
    svgUrlLoader(input)
      .replace(`module.exports = "`, "")
      .replace(`"`, ""),
});

buildAsset({
  assetFile: "download_google.svg",
  targetFile: "download-aos.ts",
  targetVar: "NEOPIN_AOS_DOWNLOAD_SVG_URL",
  loader: input =>
    svgUrlLoader(input)
      .replace(`module.exports = "`, "")
      .replace(`"`, ""),
});

