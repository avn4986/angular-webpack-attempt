const path = require("path");

module.exports = {
  "build": {
    "env": require("./config/prod"),
    "index": path.join(__dirname, "..", "dist", "index.html"),
    "assetsRoot": path.join(__dirname, "..", "dist"),
    "assetsSubDirectory": "static",
    "assetsPublicPath": "/",
    "productionSourceMap": true,
    "productionGzipExtensions": ["js", "css"],
  },
  "dev": {
    "env": require("./config/dev"),
    "port": 3000,
    "autoOpenBrowser": false,
    "assetsSubDirectory": "static",
    "assetsPublicPath": "/",
    "cssSourceMap": false
  }
};