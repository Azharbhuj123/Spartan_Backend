// utils/cache.js
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 300 }); // expires after 5 mins

module.exports = myCache;
